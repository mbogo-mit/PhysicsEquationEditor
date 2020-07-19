function EditorLogger(){
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
      description: "You are adding or substracting expressions that don't have the same units",
      example: "",
    },
    "Units do not equal each other": {
      description: "You have expressions that are set equal to each other that don't have the same units",
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
    let ids = Object.keys(MathFields);
    this.clearLog();//clearing log befor adding to it

    for(var i = 0; i < ids.length; i++){
      let ls = PutBracketsAroundAllSubsSups(MathFields[ids[i]].mf.latex());
      if(ls.length > 0){//there is something to evaluate
        if(GetUndefinedVariables(ls).length == 0){//no undefined variables
          CheckIfUnitsMatchInMathField(ls);
          CheckForErrorsInExpression(ls, GetLineNumberFromMathFieldId(ids[i]));
        }
      }
    }

    this.display();
  }

  this.addLog = function(log){
    this.log.success = this.log.success.concat(log.success);
    this.log.info = this.log.info.concat(log.info);
    this.log.warning = this.log.warning.concat(log.warning);
    this.log.error = this.log.error.concat(log.error);
  }

  this.clearLog = function(){
    this.log = {
      success: [],
      info: [],
      warning: [],
      error: [],
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

  this.display = function(){
    //changing html of logger
    let html = ejs.render(Templates["editorLogger"],{log: Object.assign({}, this.log)});
    $("#editor-log-container").html(html);
    //once the html is inject we need to add materialize event listeners to all the collapsibles
    $('#editor-log-container .collapsible').collapsible();
    //changing html of log indicators in header
    $("#btn-log-success-indicator .indicator-count").html(this.log.success.length);
    $("#btn-log-info-indicator .indicator-count").html(this.log.info.length);
    $("#btn-log-warning-indicator .indicator-count").html(this.log.warning.length);
    $("#btn-log-error-indicator .indicator-count").html(this.log.error.length);
  }

}

let EL = new EditorLogger();
