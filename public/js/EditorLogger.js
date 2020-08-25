function EditorLogger(){

  this.rawExpressionData = {};
  this.linesToCheckForSelfConsistency = [];
  this.expressionsThatDontActuallyEqualEachOther = {};

  this.undefinedVars = {
    undefined: {},
    defined: {},
  };

  this.savedUndefinedVars = {};

  this.log = {
    success: [],
    info: [],
    warning: [],
    error: [],
  };

  this.errorTypes = {
    "Unexpected end of expression": {
      description: "An equation on this line is ending in an operation",
      example: "",
    },
    "Unexpected type of argument in function cross": {
      description: "You are crossing a vector with a scalar",
      example: "",
    },
    "Cannot read property 'toString' of undefined": {
      description: "You have an empty expression or no expression on this line",
      example: "",
    },
    "Units do not match": {
      description: "You are adding or substracting expressions that don't have the same units",
      example: "",
    },
    "Adding a scalar with a vector": {
      description: "Units match, but your adding a scalar with a vector",
      example: "",
    },
    "Setting a vector equal to scalar": {
      description: "Units match, but you are setting a vector quantity equal to a scalar quantity",
      example: "",
    },
    "Units do not equal each other": {
      description: "You have expressions that are set equal to each other that don't have the same units",
      example: "",
    },
    "Incorrect equations": {
      description: "You have incorrect equations on this line",
      example: "",
    },
    "Expressions don't equal": {
      description: "These equations may be symbolically equal but when the variable values are plugged in the expressions don't equal",
      example: "",
    },
    "Expressions found inside integral without differential variable": {
      description: "All expressions inside the parentheses of an integral must be multiplied by a differential variable, for exmaple: dx,dy,dt,etc",
      example: "",
    },
    "Integral bounds not formatted properly": {
      description: "There is an integral on this line that has a lower bound defined but not an upper bound defined or vise versa",
      example: "",
    },
    "Value expected": {
      description: "An equation on this line is formatted incorrectly",
      example: "",
    },
    "Unexpected type of argument in function addScalar": {
      description: "There is an equation on this line that is adding a unitless value to a value with units",
      example: "",
    },
    "Unexpected type of argument in function log": {
      description: "Expressions inside any log must be unitless. Check all expressions on this line that are inside a log and make sure they simplify to a unitless expression",
      example: "",
    },
    "Unexpected type of argument in function pow": {
      description: "All expressions in the exponent must simplify down to a unitless expression. Check that all exponents on this line simplify down to a unitless value.",
      example: "",
    },
    "Unit in function sin is no angle": {
      description: "All expressions in sin function must simplify to be radians, steradians, or unitless",
      example: "",
    },
    "Unit in function cos is no angle": {
      description: "All expressions in cos function must simplify to be radians, steradians, or unitless",
      example: "",
    },
    "Unit in function tan is no angle": {
      description: "All expressions in tan function must simplify to be radians, steradians, or unitless",
      example: "",
    },
    "Unit in function csc is no angle": {
      description: "All expressions in csc function must simplify to be radians, steradians, or unitless",
      example: "",
    },
    "Unit in function sec is no angle": {
      description: "All expressions in sec function must simplify to be radians, steradians, or unitless",
      example: "",
    },
    "Unexpected type of argument in function asin": {
      description: "All expressions in arcsin function must simplify to be radians, steradians, or unitless",
      example: "",
    },
    "Unexpected type of argument in function acos": {
      description: "All expressions in arccos function must simplify to be radians, steradians, or unitless",
      example: "",
    },
    "Unexpected type of argument in function atan": {
      description: "All expressions in arctan function must simplify to be radians, steradians, or unitless",
      example: "",
    },
    "defaultError": {
      description: "There is something wrong with an equation on this line. This may be a problem with the Editor. Please contact customer support if the issue persists",
      example: "",
    }
  }

  this.GenerateEditorErrorMessages = function(opts = {}){
    let orderedIds = OrderMathFieldIdsByLineNumber(Object.keys(MathFields));
    this.clearLog();//clearing log befor adding to it
    this.saveUndefinedVariablesData();
    this.clearUndefinedVariables();
    this.clearRawExpressionData();
    this.clearLinesToCheckForSelfConsistency();

    for(const [lineNumber, id] of Object.entries(orderedIds)){
      //before we do anything there are some edge case we need to take care of specifically \nabla^2 need to be formatted as \nabla \cdot \nabla
      let ls = FormatNablaSquared(MathFields[id].mf.latex());
      ls = PutBracketsAroundAllSubsSupsAndRemoveEmptySubsSups(ls);
      if(ls.length > 0){//there is something to evaluate
        let undefinedVars = GetUndefinedVariables(RemoveDifferentialOperatorDFromLatexString(ls));
        this.recordUndefinedVariables(undefinedVars);
        CheckForErrorsInExpression(ls, lineNumber, id);
      }
    }

    //after we have gone through all the lines and parsed everything we will have a list of lines that we can check for selfConsistency so lets do that
    this.CheckLinesForSelfConsistency();
    //we use the same list of lines we can check for self consistency to check if we can figure out if we can identify known values and also check that equations actually equal each other not just symbolically
    this.UpdateKnownUnknownVariables();
    //after this function runs it will populate "this.expressionsThatDontActuallyEqualEachOther" with information about equations that don't actually equal each other so we need to add the errors that this object represents
    this.AddErrorsFromExpressionsThatDontActuallyEqualEachOther();

    //after parsing through everything and building up the list of defined undefined variables we need to check if there are any relevant equations for the set of variables we have in DefinedVariables and this.undefinedVars.defined
    CheckForAndDisplayRelevantEquations();

    this.display({dontRenderMyVariablesCollection: opts.dontRenderMyVariablesCollection});
  }

  this.AddErrorsFromExpressionsThatDontActuallyEqualEachOther = function(){
    let orderedIds = OrderMathFieldIdsByLineNumber(Object.keys(MathFields));
    let errors = [];
    for(const [lineNumber, latexExpressions] of Object.entries(this.expressionsThatDontActuallyEqualEachOther)){
      errors.push({
        error: this.createLoggerErrorFromMathJsError("Expressions don't equal"),
        info: "",
        latexExpressions: latexExpressions.filter((value, index, self)=>{return self.indexOf(value) === index}),//filtering so that there is only unique sets of equations because we don't need the same equation showing up twice
        lineNumber: lineNumber,
        mfID: orderedIds[lineNumber],
      });

      MathFields[orderedIds[lineNumber]].log.error.push({
        error: this.createLoggerErrorFromMathJsError("Expressions don't equal"),
        latexExpressions: latexExpressions.filter((value, index, self)=>{return self.indexOf(value) === index}),//filtering so that there is only unique sets of equations because we don't need the same equation showing up twice,
      });

    }
    this.addLog({error: errors});//adding errors to the log
  }

  this.ParsePreviousLinesAgainWithNewInfoAboutUndefinedVariables = function(endingLineNumber){
    let orderedIds = OrderMathFieldIdsByLineNumber(Object.keys(MathFields));
    this.clearLog();//clearing log befor adding to it
    this.clearUndefinedVariables(true, false);//clearing undefined variables but not defined undefined variables

    for(const [lineNumber, id] of Object.entries(orderedIds)){
      if(lineNumber > endingLineNumber){
        break;//we break the job of this function was only to parse previous lines and the current line we were on when we called this function
      }
      else{
        //before we do anything there are some edge case we need to take care of specifically \nabla^2 need to be formatted as \nabla \cdot \nabla
        let ls = FormatNablaSquared(MathFields[id].mf.latex());
        ls = PutBracketsAroundAllSubsSupsAndRemoveEmptySubsSups(ls);
        if(ls.length > 0){//there is something to evaluate
          let undefinedVars = GetUndefinedVariables(RemoveDifferentialOperatorDFromLatexString(ls));
          this.recordUndefinedVariables(undefinedVars);
          CheckForErrorsInExpression(ls, lineNumber, id);
        }
      }

    }
  }

  this.CheckLinesForSelfConsistency = function(){
    let orderedIds = OrderMathFieldIdsByLineNumber(Object.keys(MathFields));
    let lineNumber;
    let mfID;
    //this function will go through the "this.linesToCheckForSelfConsistency" array and do a high level check for self consistency
    //this makes sures that there are no duplicate values in the array
    this.linesToCheckForSelfConsistency = this.linesToCheckForSelfConsistency.filter((value, index, self)=>{
      return self.indexOf(value) === index
    });
    for(let i = 0; i < this.linesToCheckForSelfConsistency.length; i++){
      lineNumber = this.linesToCheckForSelfConsistency[i];
      mfID = orderedIds[this.linesToCheckForSelfConsistency[i]];
      for(let j = 0; j < this.rawExpressionData[this.linesToCheckForSelfConsistency[i]].length; j++){
        let expressionsThatDontEqualEachOtherOnThisLine = [];
        let a = [];
        let c = 0;
        if(this.rawExpressionData[this.linesToCheckForSelfConsistency[i]][j].length >= 2){//you can only do a self consistency check if there at least two expressions set equal to each other
          //before we do a high level self consistency check we need to make sure that integrals are formatted properly and have the correct information. specifically if a lower bound is defined then an upperbound should also be defined and vise versa
          if(AreIntegralBoundsFormattedProperly(this.rawExpressionData[this.linesToCheckForSelfConsistency[i]][j])){
            a = DoHighLevelSelfConsistencyCheck(this.rawExpressionData[this.linesToCheckForSelfConsistency[i]][j], lineNumber, mfID);
            while(c < a.length){
              expressionsThatDontEqualEachOtherOnThisLine.push(a[c]);
              c++;
            }
          }
          else{
            this.addLog({error: [{
              error: this.createLoggerErrorFromMathJsError("Integral bounds not formatted properly"),
              info: "",
              lineNumber: lineNumber,
              mfID: mfID,
            }]});

            //we are going to add this information to the correct mathfield that has this error
            MathFields[mfID].log.error.push({
              error: this.createLoggerErrorFromMathJsError("Integral bounds not formatted properly"),
            });
          }

        }

        if(expressionsThatDontEqualEachOtherOnThisLine.length > 0){
          //console.log("expressionsThatDontEqualEachOtherOnThisLine", expressionsThatDontEqualEachOtherOnThisLine);
          let latexExpressions = expressionsThatDontEqualEachOtherOnThisLine.map((value)=>{
            let oppositeOperator = {
              "<": "\\nless",
              ">": "\\ngtr",
              "=": "\\ne",
              "\\le": ">",
              "\\ge": "<",
            };
            return `${value.expression1} ${oppositeOperator[value.operator]} ${value.expression2}`;
          });
          //console.log(latexExpressions);
          this.addLog({error: [{
            error: this.createLoggerErrorFromMathJsError("Incorrect equations"),
            info: "",
            latexExpressions: latexExpressions,
            lineNumber: lineNumber,
            mfID: mfID,
          }]});

          //we are going to add this information to the correct mathfield that has this error
          MathFields[mfID].log.error.push({
            error: this.createLoggerErrorFromMathJsError("Incorrect equations"),
            latexExpressions: latexExpressions,
          });
        }
      }
    }

  }

  this.CheckLinesForKnownVariables = function(){
    let orderedIds = OrderMathFieldIdsByLineNumber(Object.keys(MathFields));
    let lineNumber;
    let mfID;
    //this function will go through the "this.linesToCheckForSelfConsistency" array and do a high level check for self consistency
    //this makes sures that there are no duplicate values in the array
    this.linesToCheckForSelfConsistency = this.linesToCheckForSelfConsistency.filter((value, index, self)=>{
      return self.indexOf(value) === index
    });
    for(let i = 0; i < this.linesToCheckForSelfConsistency.length; i++){
      lineNumber = this.linesToCheckForSelfConsistency[i];
      mfID = orderedIds[this.linesToCheckForSelfConsistency[i]];
      for(let j = 0; j < this.rawExpressionData[this.linesToCheckForSelfConsistency[i]].length; j++){
        if(this.rawExpressionData[this.linesToCheckForSelfConsistency[i]][j].length >= 2){//you can only do a self consistency check if there at least two expressions set equal to each other
          //before we do a high level self consistency check we need to make sure that integrals are formatted properly and have the correct information. specifically if a lower bound is defined then an upperbound should also be defined and vise versa
          if(AreIntegralBoundsFormattedProperly(this.rawExpressionData[this.linesToCheckForSelfConsistency[i]][j])){
            IdentifyAllKnownVariablesAndTheirValues2(this.rawExpressionData[this.linesToCheckForSelfConsistency[i]][j], lineNumber, mfID);
          }
        }  
      }
    }  
  }

  this.UpdateKnownUnknownVariables = function(reset = true){
    //we need to first reset all unknown variables current state to "unknown" so that they have to prove that they are known every time the user makes an edit in the editor
    if(reset){
      this.ResetAllUnknownVariblesToCurrentStateUnknown();
    }
    this.expressionsThatDontActuallyEqualEachOther = {};//we have to reset this object everytime we run this function because this.CheckLinesForKnownVariables() will populuate this object with the most up to date expressions that don't actually equal each other
    this.CheckLinesForKnownVariables();
    //after we have identified all of the undefined and variables and defined undefined variables and have created logs for everything we need to evaluate which variables are unknown and which variables where initil unknown but are defined by all known variables
    /*for(const [lineNumber, expressions] of Object.entries(this.rawExpressionData)){
      this.IdentifyAllKnownVariablesAndTheirValues(expressions);
    }*/
  }

  this.IdentifyAllKnownVariablesAndTheirValues = function(exprs){
    for(var i = 0; i < exprs.length; i++){
      let exprsCopy;
      if(exprs[i].length >= 2){//if there aren't at least two expressions set equal to each other there is no way that a variable that was previously unknown could be equal to all known variables
        exprsCopy = JSON.parse(JSON.stringify(exprs[i]));//copying exprs data to be used later and information added
        for(var j = 0; j < exprsCopy.length; j++){
          let vars = GetVariablesFromLatexString(exprsCopy[j].rawStr);
          let unknownVars = [];
          let variableValues = {
            unknown: {},//this holds an object of all the variables in this expression with unknown values
            known: {},//this holds an object of all the variables in this expression with known values
          };
          for(let v of vars){
            if(DefinedVariables[v] != undefined){
              //trying to figure out if this variable is unknown
              if(DefinedVariables[v].state != "given" && DefinedVariables[v].currentState != "known"){
                unknownVars.push(v);
              }
              //trying to figure out if this variables values is undefined or defined
              if(DefinedVariables[v].value != undefined){
                variableValues.known[v] = DefinedVariables[v].value;
              }
              else{
                variableValues.unknown[v] = undefined;
              }
            }
            else if(PreDefinedVariables[v] != undefined){
              //because this is a predefined variable we known that it is known so all we want to do is pass its value as a into the set of known values for this expression
              //trying to figure out if this variables values is undefined or defined
              if(PreDefinedVariables[v].value != undefined){
                variableValues.known[v] = PreDefinedVariables[v].value;
              }
              else{
                variableValues.unknown[v] = undefined;
              }
            }
            else if(this.undefinedVars.undefined[v] != undefined){
              //trying to figure out if this variable is unknown
              if(this.undefinedVars.undefined[v].state != "given" && this.undefinedVars.undefined[v].currentState != "known"){
                unknownVars.push(v);
              }
              //trying to figure out if this variables values is undefined or defined
              if(this.undefinedVars.undefined[v].value != undefined){
                variableValues.known[v] = this.undefinedVars.undefined[v].value;
              }
              else{
                variableValues.unknown[v] = undefined;
              }
            }
            else if(this.undefinedVars.defined[v] != undefined){
              //trying to figure out if this variable is unknown
              if(this.undefinedVars.defined[v].state != "given" && this.undefinedVars.defined[v].currentState != "known"){
                unknownVars.push(v);
              }
              //trying to figure out if this variables values is undefined or defined
              if(this.undefinedVars.defined[v].value != undefined){
                variableValues.known[v] = this.undefinedVars.defined[v].value;
              }
              else{
                variableValues.unknown[v] = undefined;
              }
            }
          }
  
          exprsCopy[j].unknownVars = unknownVars;
          exprsCopy[j].variableValues = variableValues;
  
        }
  
        //now that we have gathered the necessary information to check if a unknown variable can become known and to check if a now known variable could have its actual value calculated we need to actaully do these checks and calculations
        let index = 0;
        while(index < exprsCopy.length){
          //first we need to see if the expression are related using an equal sign '=' if not there is no way we could say this value is known and therefore actauly calcualte this "known value"
          if(exprsCopy[index].operator == "="){
            if(exprsCopy[index].unknownVars.length + exprsCopy[index + 1].unknownVars.length == 1){//this means that out of these two expression one is completely known and the other only has one unknown variable which we can say is known because it is apart of an equation where it is the only unknown
              let uniqueRIDStringArray = GenerateUniqueRIDStringForVariables(`${exprsCopy[index].rawStr} + ${exprsCopy[index + 1].rawStr}`);
              let unknownVariable;
              if(exprsCopy[index].unknownVars.length == 0){//if this current expression is completely known then the unknown variable is in the other expression
                unknownVariable = exprsCopy[index + 1].unknownVars[0];
              }
              else{
                unknownVariable = exprsCopy[index].unknownVars[0];
              }
              //we are now going to try to solve for the one variable that is unknown in the other expression
              let expression1 = ExactConversionFromLatexStringToNerdamerReadableString(exprsCopy[index].rawStr, uniqueRIDStringArray);
              let expression2 = ExactConversionFromLatexStringToNerdamerReadableString(exprsCopy[index + 1].rawStr, uniqueRIDStringArray);
              if(expression1 != null && expression2 != null){//the conversion from latex to nerdamer readable string was successful
                SqrtLoop = 0;//resetting this global variable to 0 which makes sure that nerdamer doesn't go into a loop trying to solve for a variable
                let unknownVariableRIDString = ReplaceVariablesWithUniqueRIDString(unknownVariable, uniqueRIDStringArray).replace(/(\(|\)|\s)/g,"");//removing parentheses on the ends and white space because if the rid variable is "_ertyuio" this function will return " (_ertyuio) "
                //console.log(`${expression1} = ${expression2}, solved for: ${unknownVariableRIDString}`);
                try{
                  let solution = nerdamer(`${expression1} = ${expression2}`).solveFor(unknownVariableRIDString);
                  //console.log("solution",solution.toString());
                  if(solution.length > 0){//that means we found a solution
                    //we are going to gather every non-zero solution but if all solution are zero then we will send the zerio as the solution
                    let allNonZeroSolutions = solution.filter((s) => {return s.toString() != "0"});
                    //console.log("allNonZeroSolutions", allNonZeroSolutions);
                    let knownVariableValue;
                    if(allNonZeroSolutions.length == 0){
                      knownVariableValue = solution[0].toString();
                    }
                    else{
                      knownVariableValue = allNonZeroSolutions[0].toString();//grab the first non zero solution
                    }
                    //now that we have solved for this variable, we need to see if we can calculate its actual value
                    if(Object.keys(exprsCopy[index].variableValues.unknown).length + Object.keys(exprsCopy[index + 1].variableValues.unknown).length == 1){
                      //this means that the only unknown variable value in these two expression set equal to each other is the variable we are trying to calculate its value
                      //we now need to replace every UniqueRIDString with the value of the latex variable 
                      let count = 0;
                      let r;
                      let allKnownVariableValues = Object.assign(exprsCopy[index].variableValues.known, exprsCopy[index + 1].variableValues.known);
                      //console.log("allKnownVariableValues", allKnownVariableValues);
                      //console.log("uniqueRIDStringArray",uniqueRIDStringArray);
                      while(count < uniqueRIDStringArray.length){
                        if(allKnownVariableValues[uniqueRIDStringArray[count].variable] != undefined){
                          //console.log("uniqueRIDStringArray[count].ridString",uniqueRIDStringArray[count].ridString);
                          r = new RegExp(uniqueRIDStringArray[count].ridString, 'g');
                          knownVariableValue = knownVariableValue.replace(r, `(${allKnownVariableValues[uniqueRIDStringArray[count].variable]})`);
                        }
                        count++;
                      }
                      try{
                        //making sure that anything we replaced this string with is 
                        knownVariableValue = CleanLatexString(knownVariableValue,["multiplication"]);
                        knownVariableValue = nerdamer.convertFromLaTeX(knownVariableValue).toString();
                        //console.log("knownVariableValue", knownVariableValue);
                        //once we have replaced all unique rid strings with there variable values we need to try to evaluate this string using mathjs because it only allows for simple numbers and arrays so if it throws an error then we don't have a simple number or array (vector)
                        try{
                          knownVariableValue = math.evaluate(knownVariableValue).toString();
                        }catch(err2){
                          knownVariableValue = undefined;
                          //console.log(err2);
                        }
                      }
                      catch(err){
                        knownVariableValue = undefined;
                        //console.log(err);
  
                      }
                      
                    }
                    else{
                      knownVariableValue = undefined;
                    }
  
                    //now that we have tried to calcuate this known value regardless if we were succesful or failed we were able to solve for a unknown variable using all known values so we need to set the variable's "currenState" equal to "knonwn"
                    let foundMatchAndChangedVariableValueOrState = false
                    if(DefinedVariables[unknownVariable] != undefined){
                      DefinedVariables[unknownVariable].currentState = "known";
                      DefinedVariables[unknownVariable].value = (knownVariableValue) ? ConvertStringToScientificNotation(knownVariableValue) : undefined;
                      foundMatchAndChangedVariableValueOrState = true;
                    }
                    else if(this.undefinedVars.undefined[unknownVariable] != undefined){
                      this.undefinedVars.undefined[unknownVariable].currentState = "known";
                      this.undefinedVars.undefined[unknownVariable].value = (knownVariableValue) ? ConvertStringToScientificNotation(knownVariableValue) : undefined;
                      foundMatchAndChangedVariableValueOrState = true;
                    }
                    else if(this.undefinedVars.defined[unknownVariable] != undefined){
                      this.undefinedVars.defined[unknownVariable].currentState = "known";
                      this.undefinedVars.defined[unknownVariable].value = (knownVariableValue) ? ConvertStringToScientificNotation(knownVariableValue) : undefined;
                      foundMatchAndChangedVariableValueOrState = true;
                    }
  
                    if(foundMatchAndChangedVariableValueOrState){
                      //because we changed values and were able to identify new known variables we need
                      //call "UpdateKnownUnknownVariables" function which will parse the rawExpressionData from the first line with the new information we have put into the known unknown variables.
                      //By passing in "false" this function wont reset the variables currentState values which is what we want because we want the information we have just found to persist. Otherwise we would get a loop
                      this.UpdateKnownUnknownVariables(false);
                      return;//after this function is done running it means it has already parsed all the lines starting from the top  so we just end right here
                    }
                  }
                }
                catch(err5){
                  console.log("error");
                  //console.log(err5);//something went wrong when trying to sovle variable
                }
                
              }
            }
          }
          index++;
        }
      }
    }
  }

  this.recordUndefinedVariables = function(undefinedVars){
    let definedUndefinedVariables = Object.keys(this.undefinedVars.defined);
    for(let i = 0; i < undefinedVars.length; i++){
      if(this.undefinedVars.undefined[undefinedVars[i]] == undefined){
        //we need to check first that we haven't already given this undefined variable a definition based on equations that were written in previous lines.
        //so we check that this undefined variable is not a key in this.undefinedVars.defined because that would mean it is defined
        if(!definedUndefinedVariables.includes(undefinedVars[i])){
          //we are going to add this new undefined variable to the list of undefined variables
          let savedVariable = this.retrieveSavedUndefinedVariablesData(undefinedVars[i]);
          this.undefinedVars.undefined[undefinedVars[i]] = {
            state: (savedVariable.state) ? savedVariable.state : "unknown",
            type: (IsVariableLatexStringVector(undefinedVars[i])) ? "vector" : "scalar",
            units: "undefined (none)",
            value: (savedVariable.value) ? savedVariable.value: undefined,
            valueFormattingError: (savedVariable.valueFormattingError) ? savedVariable.valueFormattingError: undefined,
            unitsMathjs: "1 undefinedunit",
            rid: (savedVariable.rid) ? savedVariable.rid : RID(),
          };
        }

      }
    }
  }

  this.recordDefinitionForUndefinedVariable = function(definedUndefinedVariable, unitsMathjs){
    let fullUnitsString = GetFullUnitsStringFromUnitsMathJs(unitsMathjs);
    let isVariableVector = IsVariableLatexStringVector(definedUndefinedVariable);

    let savedVariable = this.retrieveSavedUndefinedVariablesData(definedUndefinedVariable);

    this.undefinedVars.defined[definedUndefinedVariable] = {
      state: (savedVariable.state) ? savedVariable.state : "unknown",
      type: (isVariableVector) ? "vector" : "scalar",
      value: (savedVariable.value) ? savedVariable.value: undefined,
      valueFormattingError: (savedVariable.valueFormattingError) ? savedVariable.valueFormattingError: undefined,
      canBeVector: fullUnitsString.canBeVector,
      fullUnitsString: fullUnitsString.str,
      units: (fullUnitsString.custom) ? fullUnitsString.str : TrimUnitInputValue(fullUnitsString.str),
      unitsMathjs: GetUnitsFromMathJsVectorString(unitsMathjs),//if it is not a vector it won't effect the string
      rid: (savedVariable.rid) ? savedVariable.rid : RID(),
      quantity: (fullUnitsString.custom) ? undefined : UnitReference[fullUnitsString.str].quantity,
      dynamicUnits: true,
    };
    //then after giving this variable a definiton we need to remove it from the undefined object of this.undefinedVars
    delete this.undefinedVars.undefined[definedUndefinedVariable];

    //once we define a variable we need to check if the variable we defined is a vector and if it is then we need to also define its magnitude by default.
    //So if we found a defintion for an undefined variable \vec{F} then we need to add its magnitude F to VectorMagnitudeVariables
    if(isVariableVector){
      UpdateVectorMagnitudeVariables({
        type: "update",
        ls: definedUndefinedVariable,
        props: Object.assign({}, this.undefinedVars.defined[definedUndefinedVariable]),
      });
    }

  }

  this.addLog = function(log){
    this.log.success = this.log.success.concat((log.success) ? log.success : []);
    this.log.info = this.log.info.concat((log.info) ? log.info : []);
    this.log.warning = this.log.warning.concat((log.warning) ? log.warning : []);
    this.log.error = this.log.error.concat((log.error) ? log.error : []);
  }

  this.addToMathFieldsLog = function(log){

  }

  this.clearLog = function(){
    this.log = {
      success: [],
      info: [],
      warning: [],
      error: [],
    };
    for (const [key, value] of Object.entries(MathFields)) {
      MathFields[key].log = {
        warning: [],//variable undefined,
        error: [], //units don't match
      };
    }
  }

  this.clearRawExpressionData = function(){
    this.rawExpressionData = {};
  }


  this.clearLinesToCheckForSelfConsistency = function(){
    this.linesToCheckForSelfConsistency = [];
  }

  this.clearUndefinedVariables = function(clearUndefined = true, clearDefined = true){
    if(clearUndefined){
      this.undefinedVars.undefined = {};
    }
    if(clearDefined){
      this.undefinedVars.defined = {};
      //after we clear the defined undefined variables we need to make sure we clear any vector
      //magnitudes that were generated by defined undefined  vector variables and stored in VectorMagnitudeVariables
      //the process described above can be found in this.recordDefinitionForUndefinedVariable() function
      RemoveAllDynamicUnitsVariablesFromVectorMagnitudeVariables();
      //all defined undefined variables have an attribute dynamicUnits that is set to true which allows use to figure out which vector magnitudes were set by defined undefined variables
    }

  }

  this.ResetAllUnknownVariblesToCurrentStateUnknown = function(){
    //definedVariables needs to be set because it persists between edits so every time an edit is made every unknown
    //variable needs to prove that they are set equal to all known variables in the editor
    for(const [key, value] of Object.entries(DefinedVariables)){
      if(value.state == "unknown"){
        DefinedVariables[key].currentState = "unknown";
        //if the value is unknown by definition then the value of the variable must be "undefined"
        DefinedVariables[key].value = undefined;
      }
    }

    //these variables are dynamically created eveyr time the editor is changed so you would think we wouldn't have to reset
    //these if they were just created. but in the use case where the user changes the state of another variable we wanted to
    //be able to update the state of all the other variables without having to parse everything and regenerate everything.
    //This can be seen in the function "ToggleVariableState"
    for(const [key, value] of Object.entries(this.undefinedVars.undefined)){
      if(value.state == "unknown"){
        this.undefinedVars.undefined[key].currentState = "unknown";
        //if the value is unknown by definition then the value of the variable must be "undefined"
        this.undefinedVars.undefined[key].value = undefined;
      }
    }
    for(const [key, value] of Object.entries(this.undefinedVars.defined)){
      if(value.state == "unknown"){
        this.undefinedVars.defined[key].currentState = "unknown";
        //if the value is unknown by definition then the value of the variable must be "undefined"
        this.undefinedVars.defined[key].value = undefined;
      }
    }

  }

  this.saveUndefinedVariablesData = function(){
    this.savedUndefinedVars = Object.assign({}, this.undefinedVars);
  }

  this.retrieveSavedUndefinedVariablesData = function(ls){
    for(const [key, value] of Object.entries(this.savedUndefinedVars.undefined)){
      if(ls == key){
        return value;
      }
    }

    for(const [key, value] of Object.entries(this.savedUndefinedVars.defined)){
      if(ls == key){
        return value;
      }
    }
    //if we can't find this variable in past data then we will just return a default variable
    return {
      state: "unknown",
    };
  }

  this.createLoggerErrorFromMathJsError = function(err){
    let keys = Object.keys(this.errorTypes);
    let et = Object.assign({}, this.errorTypes);
    let error = undefined;
    keys.map(function(key, index){
      if(err.indexOf(key) != -1){

        error = {
          type: key,
          description: et[key].description,
          example: et[key].example,
        }
      }
    });

    if(error){
      return error;
    }

    return {
      type: err,
      description: et["defaultError"].description,
      example: et["defaultError"].example,
    };

  }

  this.display = function(opts = {}){
    let log = JSON.parse(JSON.stringify(this.log));//copying so we don't accidentally change the real log
    //changing html of logger
    let html = ejs.render(Templates["editorLogger"],{log: log});
    $("#editor-log-container").html(html);
    //once the html is inject we need to add materialize event listeners to all the collapsibles
    $('#editor-log-container .collapsible').collapsible();
    $("#editor-log-container .collapsible .collapsible-body.information-container").css("max-height",`${window.innerHeight - $("#editor-log-container .collapsible.log-container").height()}px`)
    //changing html of log indicators in header
    $("#btn-log-success-indicator .indicator-count").html(log.success.length);
    $("#btn-log-info-indicator .indicator-count").html(log.info.length);
    $("#btn-log-warning-indicator .indicator-count").html(log.warning.length);
    $("#btn-log-error-indicator .indicator-count").html(log.error.length);

    RenderAllMathFieldLogs();

    //initialize static math fields that are used in the log
    $(".log-static-latex").each(function(){
      MQ.StaticMath($(this)[0]).latex($(this).attr("latex"));
    });

    if(!opts.dontRenderMyVariablesCollection){
      //after generating errors and defined undefined and defined undefined variables we need to rerender my variable collection
      OrderCompileAndRenderMyVariablesCollection();
    }
    
  }

}

let EL = new EditorLogger();
