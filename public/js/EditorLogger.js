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
    let ids = Object.keys(MathFields);
    this.clearLog();//clearing log befor adding to it

    for(var i = 0; i < ids.length; i++){
      //before we do anything there are some edge case we need to take care of specifically \nabla^2 need to be formatted as \nabla \cdot \nabla
      let ls = FormatNablaSquared(MathFields[ids[i]].mf.latex());
      ls = PutBracketsAroundAllSubsSups(ls);
      ls = RemoveDifferentialOperatorDFromLatexString(ls);
      let lineNumber = GetLineNumberFromMathFieldId(ids[i]);
      if(ls.length > 0){//there is something to evaluate
        let undefinedVars = GetUndefinedVariables(ls);
        if(undefinedVars.length == 0){//no undefined variables
          CheckForErrorsInExpression(ls, lineNumber, ids[i]);
        }
        else{
          this.addLog({warning: {
            warning: "Undefined Variables",
            variables: undefinedVars,
            lineNumber: lineNumber,
            mfID: ids[i],
          }});
        }
      }
    }

    this.display();
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

    //display warnings and errors in the editor lines
    for(var i = 0; i < log.error.length; i++){
      MathFields[log.error[i].mfID].message = {
        error: null, //units don't match, variable d can't be used
      }
      MathFields[log.error[i].mfID].message.error = {type: 1};
      RenderMessageUI(log.error[i].mfID);//takes the messages for a specific math field and renders it
    }

    for(var i = 0; i < log.warning.length; i++){
      MathFields[log.warning[i].mfID].message = {
        warning: null,//variable undefined,
      }
      MathFields[log.warning[i].mfID].message.warning = {
        type: 1,
        vars: log.warning[i].variables,
      }
      RenderMessageUI(log.warning[i].mfID);//takes the messages for a specific math field and renders it
    }

  }

}

let EL = new EditorLogger();
