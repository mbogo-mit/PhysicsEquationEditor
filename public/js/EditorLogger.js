function EditorLogger(){

  this.undefinedVars = {
    undefined: {},
    defined: {},
  };

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
    "Units do not match": {
      description: "You are adding or substracting expressions that don't have the same units, or you are adding to expressions with the same units but one is a vector and the other is a scalar",
      example: "",
    },
    "Units do not equal each other": {
      description: "You have expressions that are set equal to each other that don't have the same units, or they have the same units but one is a vector and the other is a scalar.",
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

  this.GenerateEditorErrorMessages = function(){
    let orderedIds = OrderMathFieldIdsByLineNumber(Object.keys(MathFields));
    this.clearLog();//clearing log befor adding to it
    this.clearUndefinedVariables();

    for(const [lineNumber, id] of Object.entries(orderedIds)){
      //before we do anything there are some edge case we need to take care of specifically \nabla^2 need to be formatted as \nabla \cdot \nabla
      let ls = FormatNablaSquared(MathFields[id].mf.latex());
      ls = PutBracketsAroundAllSubsSups(ls);
      ls = RemoveDifferentialOperatorDFromLatexString(ls);
      if(ls.length > 0){//there is something to evaluate
        let undefinedVars = GetUndefinedVariables(ls);
        this.recordUndefinedVariables(undefinedVars);
        CheckForErrorsInExpression(ls, lineNumber, id);
      }
    }

    this.display();
  }

  this.ParsePreviousLinesAgainWithNewInfo = function(endingLineNumber){
    let orderedIds = OrderMathFieldIdsByLineNumber(Object.keys(MathFields));
    this.clearLog();//clearing log befor adding to it
    this.clearUndefinedVariables(true, false);//clearing undefined variables but not defined undefined variables

    for(const [lineNumber, id] of Object.entries(orderedIds)){
      if(lineNumber == endingLineNumber){
        break;//we break because we have already parsed this line and there are no more previous lines
      }
      else{
        //before we do anything there are some edge case we need to take care of specifically \nabla^2 need to be formatted as \nabla \cdot \nabla
        let ls = FormatNablaSquared(MathFields[id].mf.latex());
        ls = PutBracketsAroundAllSubsSups(ls);
        ls = RemoveDifferentialOperatorDFromLatexString(ls);
        if(ls.length > 0){//there is something to evaluate
          let undefinedVars = GetUndefinedVariables(ls);
          this.recordUndefinedVariables(undefinedVars);
          CheckForErrorsInExpression(ls, lineNumber, id);
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
          this.undefinedVars.undefined[undefinedVars[i]] = {
            state: "unknown",
            type: (IsVariableLatexStringVector(undefinedVars[i])) ? "vector" : "scalar",
            units: "undefined (none)",
            value: undefined,
            unitsMathjs: "1 undefinedunit",
            rid: RID(),
          };
        }

      }
    }
  }

  this.recordDefinitionForUndefinedVariable = function(definedUndefinedVariable, unitsMathjs){
    let fullUnitsString = GetFullUnitsStringFromUnitsMathJs(unitsMathjs);
    let customUnitsString = unitsMathjs.split(" ");
    customUnitsString.splice(0,1);
    customUnitsString = customUnitsString.join(" ");
    customUnitsString = customUnitsString.replace(/vector/g, "");
    let isVariableVector = IsVariableLatexStringVector(definedUndefinedVariable);

    if(isVariableVector){
      if(unitsMathjs.indexOf("vector") == -1){//variable is suppose to be a vector but doens't have vector unit inside of it so we multiply one in
        //making the unit have a vector
        unitsMathjs = math.evaulate(`(1 vector) (${unitsMathjs})`).toString();
      }
    }
    else{
      if(unitsMathjs.indexOf("vector") != -1){//variable is not suppose to be a vector but has a vector unit inside of it so we take it out
        unitsMathjs = unitsMathjs.replace(/vector/g, "");
      }
    }
    this.undefinedVars.defined[definedUndefinedVariable] = {
      state: "unknown",
      type: (isVariableVector) ? "vector" : "scalar",
      value: undefined,
      fullUnitsString: (fullUnitsString != null) ? fullUnitsString : customUnitsString,
      units: (fullUnitsString != null) ? TrimUnitInputValue(fullUnitsString) : customUnitsString,
      unitsMathjs: unitsMathjs,
      rid: RID(),
    };
    //then after giving this variable a definiton we need to remove it from the undefined object of this.undefinedVars
    delete this.undefinedVars.undefined[definedUndefinedVariable];
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

  this.clearUndefinedVariables = function(clearUndefined = true, clearDefined = true){
    if(clearUndefined){
      this.undefinedVars.undefined = {};
    }
    if(clearDefined){
      this.undefinedVars.defined = {};
    }
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

  this.display = function(){
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
      MQ.StaticMath($(this)[0]);
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

    //after generating errors and defined undefined and defined undefined variables we need to rerender my variable collection
    OrderCompileAndRenderMyVariablesCollection();
  }

}

let EL = new EditorLogger();
