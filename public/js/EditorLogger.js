function EditorLogger(){

  this.rawExpressionData = {};
  this.linesToCheckForSelfConsistency = [];

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
    "Unexpected type of argument in function addScalar": {
      description: "There is an equation on this line that is adding a unitless value to a value with units",
      example: "",
    },
    "defaultError": {
      description: "There is something wrong with an equation on this line. This may be a problem with the Editor. please contact customer support if the issue persists",
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

    this.UpdateKnownUnknownVariables();

    //after parsing through everything and building up the list of defined undefined variables we need to check if there are any relevant equations for the set of variables we have in DefinedVariables and this.undefinedVars.defined
    CheckForAndDisplayRelevantEquations();

    this.display({dontRenderMyVariablesCollection: opts.dontRenderMyVariablesCollection});
  }

  this.ParsePreviousLinesAgainWithNewInfoAboutUnknownVariables = function(endingLineNumber){
    for(const [lineNumber, expressions] of Object.entries(this.rawExpressionData)){
      if(lineNumber > endingLineNumber){
        break;//we break the job of this function was only to parse previous lines and the current line we were on when we called this function
      }
      else{
        IdentifyAllKnownVariablesAndTheirValues(expressions);
      }

    }

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
        }
      }
    }

  }

  this.UpdateKnownUnknownVariables = function(reset = true){
    //we need to first reset all unknown variables current state to "unknown" so that they have to prove that they are known every time the user makes an edit in the editor
    if(reset){
      this.ResetAllUnknownVariblesToCurrentStateUnknown();
    }
    //after we have identified all of the undefined and variables and defined undefined variables and have created logs for everything we need to evaluate which variables are unknown and which variables where initil unknown but are defined by all known variables
    for(const [lineNumber, expressions] of Object.entries(this.rawExpressionData)){
      IdentifyAllKnownVariablesAndTheirValues(expressions);
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

  this.clearLog = function(){
    this.log = {
      success: [],
      info: [],
      warning: [],
      error: [],
    };
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
    let log = Object.assign({}, this.log);//copying so we don't accidentally change the real log
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

    //initialize static math fields that are used in the log
    $(".log-static-latex").each(function(){
      MQ.StaticMath($(this)[0]).latex($(this).attr("latex"));
    });

    //we need to first clear all the messages from every mathfield and set them to the default state before we populate them with information and render
    for (const [key, value] of Object.entries(MathFields)) {
      MathFields[key].message = {
        question: null,//is this variable a physics constant
        warning: null,//variable undefined,
        error: null, //units don't match
      };

      RenderMessageUI(key);//then render the change
    }

    //display warnings and errors in the editor lines
    for(var i = 0; i < log.error.length; i++){
      MathFields[log.error[i].mfID].message.error = {type: 1};
      RenderMessageUI(log.error[i].mfID);//takes the messages for a specific math field and renders it
    }

    for(var i = 0; i < log.warning.length; i++){
      MathFields[log.warning[i].mfID].message.warning = {
        type: 1,
        vars: log.warning[i].variables,
      }
      RenderMessageUI(log.warning[i].mfID);//takes the messages for a specific math field and renders it
    }

    if(!opts.dontRenderMyVariablesCollection){
      //after generating errors and defined undefined and defined undefined variables we need to rerender my variable collection
      OrderCompileAndRenderMyVariablesCollection();
    }
    
  }

}

let EL = new EditorLogger();
