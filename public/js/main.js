var CurrentMQSelection = null;
var CurrentlyProcessing = false;
var CurrentlyHoveredMCI = null;
let CurrentCursorPositionMCI = undefined;
let CurrentlyTaggingVariables = false;
let CurrentCursorPositionFromTheRight = 0;

//the key will be the latex string that represents the variable and the key will have refrence another objects with properties
//known:true/false,type:constant,scalar function,vector, vector field, units: quantity (key for global var object), size: Mega->milli

var MQ = MathQuill.getInterface(2); // keeps the API stable

var StaticMathField = MQ.StaticMath(document.getElementById('static-math-define-variable'));
var VariableValueMathField = MQ.MathField(document.getElementById('variable-value-math-field'),{
  handlers: {
    edit: function(){
      CheckModalForm();
    }
  }
});
var DynamicMathField = MQ.MathField(document.getElementById('dynamic-math-define-variable'), {
  spaceBehavesLikeTab: false,
  restrictMismatchedBrackets: true,
  sumStartsWithNEquals: true,
  supSubsRequireOperand: true,
  autoCommands: 'pi theta lambda sqrt sum int',
  autoOperatorNames: 'sin',
  charsThatBreakOutOfSupSub: '+-=<>',
  handlers: {
    edit: function() {
      //this checks if the latex in this math filed is a valid variable
      if(IsInputAValidVariable(DynamicMathField.latex())){
        console.log("true");
        $("#dynamic-math-define-variable").attr("valid","true");
        $("#dynamic-math-define-variable-helper-text").html("Valid Input");
        $("#dynamic-math-define-variable-helper-text").addClass("teal-text");
        $("#dynamic-math-define-variable-helper-text").removeClass("red-text");
      }
      else{
        console.log("false");
        $("#dynamic-math-define-variable").attr("valid","false");
        $("#dynamic-math-define-variable-helper-text").html("Invalid Input");
        $("#dynamic-math-define-variable-helper-text").removeClass("teal-text");
        $("#dynamic-math-define-variable-helper-text").addClass("red-text");
      }
      CheckModalForm();
    },
    enter: function(){

    },
    moveOutOf: function(dir, mathField) {
      //tagging variables may cause this event to fire by accident so we need to make sure that the event was not fire because of the processes that occur while tagging a variable
      if (dir === MQ.R){

      }
      else if(dir === MQ.L){

      }
    },
    downOutOf: function(mathField) {

    },
    upOutOf: function(mathField){

    },
    deleteOutOf: function(dir, mathField){

    }
  }
});

//initializing first line
CreateNewMathField("first_math_field");

function CreateNewMathField(id){
  //el is a jquery Element
  var m = MQ.MathField(document.getElementById(id), {
    spaceBehavesLikeTab: false,
    restrictMismatchedBrackets: true,
    sumStartsWithNEquals: true,
    supSubsRequireOperand: true,
    autoCommands: 'pi theta lambda sqrt sum int',
    autoOperatorNames: 'sin cos',
    charsThatBreakOutOfSupSub: '+-=<>',
    handlers: {
      edit: function() {
        //AddHoverEventToVariablesAndVectors(id);
        if(!CurrentlyTaggingVariables){
          UpdateLineLabelHeight(id);
          GenerateErrorMessages(id);
          EL.GenerateEditorErrorMessages();
        }

      },
      enter: function(){
        MathFieldKeyPressEnter($(`#${id}`).parents(".editor_line"));
      },
      moveOutOf: function(dir, mathField) {
        //tagging variables may cause this event to fire by accident so we need to make sure that the event was not fire because of the processes that occur while tagging a variable
        if (dir === MQ.R && !CurrentlyTaggingVariables){
          MoveCursor1Line(mathField.el().id, "down","right");
        }
        else if(dir === MQ.L && !CurrentlyTaggingVariables){
          MoveCursor1Line(mathField.el().id, "up","left");
        }
      },
      downOutOf: function(mathField) {
        MoveCursor1Line(mathField.el().id, "down", "down");
      },
      upOutOf: function(mathField){
        MoveCursor1Line(mathField.el().id, "up", "up");
      },
      deleteOutOf: function(dir, mathField){
        DeleteCurrentMathField(mathField.el().id);
      }
    }
  });

  MathFields[id] = {mf:m, message: {
    question: null,//is this variable a physics constant
    warning: null,//variable undefined,
    error: null, //units don't match, variable d can't be used
  }};

  BlurMathFields();
  MathFields[id].mf.focus();

  UpdateLineLabelHeight(id);

  FocusedMathFieldId = id;
  SetMathFieldsUI();

  AddLineLabelHoverEvent(id);

}
