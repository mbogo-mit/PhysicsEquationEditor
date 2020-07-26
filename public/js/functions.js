/*

Success: unknown variable -> known,
Info: number of known and unknown variables and the number of equations you need to solve the problem and how many unique equations you have
Warning: tells you when you are using irrelevant equations, when variables with unknown units dont match on different lines, when simplifications could be done wrong
Error: dimensional analysis fails on a line

*/
function RID(){
  let c = "abcdefghijklmnopqrstuvwxyz0123456789";
  let rid = "";
  for(var i = 0; i < 10; i++){
    let r = Math.random() * c.length;
    rid += c.substring(r, r+1);
  }

  return rid;
}

function AddHoverEventToVariablesAndVectors(id){
  //first we are going to add hover event to vectors only

  $(`#${id} var, .mq-nonSymbola`).unbind('mouseenter mouseleave');

  $(`#${id} var, .mq-nonSymbola`).hover(function(){
    if(!MOUSEDOWN){
      if(!ParsedHoverRequest){
        ParsedHoverRequest = true;
        CurrentlyHoveredMCI = $(this).attr("mathquill-command-id");

        HoveredOutOfTaggedVariable = false;
        setTimeout(function(r){
          if(!HoveredOutOfTaggedVariable){
            ShowSelectionMenu(r);////right after we tag a variable we need to show all the information about the variable
          }
        }, ShowMenuTimeout,$(this)[0].getBoundingClientRect());

        TagVariable(id);
        //console.log("hover");
      }
    }

  },function(){//hover out
    ParsedHoverRequest = false;
    HoveredOutOfTaggedVariable = true;

    setTimeout(function(){
      if(!HoveringOverVariableDescriptionMenu){
        HideSelectionMenu();
      }
    }, HideMenuTimeout);

  });

  $(`#${id} .mq-non-leaf > .mq-diacritic-above`).each(function(){
    $(this).parent().unbind('mouseenter mouseleave');
    $(this).parent().find("var, .mq-nonSymbola").unbind('mouseenter mouseleave');//remove hover event from any variable inside the vector because the vector already has a hover event
    $(this).parent().hover(function(){
      if(!MOUSEDOWN){
        if(!ParsedHoverRequest){
          ParsedHoverRequest = true;
          let r = $(this)[0].getBoundingClientRect();
          CurrentlyHoveredMCI = $(this).attr("mathquill-command-id");

          HoveredOutOfTaggedVariable = false;
          setTimeout(function(r){
            if(!HoveredOutOfTaggedVariable){
              ShowSelectionMenu(r);////right after we tag a variable we need to show all the information about the variable
            }
          }, ShowMenuTimeout,$(this)[0].getBoundingClientRect());

          TagVariable(id);
          //console.log("hover");
        }
      }
    },function(){//hover out
      ParsedHoverRequest = false;
      HoveredOutOfTaggedVariable = true;

      setTimeout(function(){
        if(!HoveringOverVariableDescriptionMenu){
          HideSelectionMenu();
        }
      }, HideMenuTimeout);
    });

    //after putting the hover event on the vector as a whole we need to remove the hover event
    //from any var tags that may be inside the vector so they are not triggered when the user hovers over the vector
    $(this).parent().find("var, .mq-nonSymbola").unbind("mouseover");
  });

}

function replaceLatexKeywordsWithSpace(latexString){
  let cmds = ["\\sqrt","\\frac"];
  for(var i = 0; i < cmds.length; i++){
    latexString = latexString.replace(cmds[i], new Array(cmds[i].length + 1).join(" "));
  }

  return latexString;

}

function SelectedStringPossibleVariable(str){
  //looking for any characters that is not a word or white space
  console.log(str.search(/\+|\-|\*|\^|\\cdot/g));
  return str.search(/\+|\-|\*|\^|\\cdot/g) == -1;
}

function SelectedStringDefined(str){
  return str in DefinedVariables;
}

function ShowSelectionMenu(r){
  $("#variable_description_menu").css({top: r.top + 45, left: r.left + 20});
  $("#variable_description_menu").css("display","block");
}

function PopulateSelectionMenu(props, editable = true){
  //fill the menu with the proper data
  if(editable){
    $("#edit_variable_description").css("display","inline");
  }
  else{
    $("#edit_variable_description").css("display","none");
  }
  $("#variable_description_menu tbody .variable_state").html(props.state);
  $("#variable_description_menu tbody .variable_type").html(props.type);
  $("#variable_description_menu tbody .variable_units").html(props.units);

}

function HideSelectionMenu(){
  $("#variable_description_menu").css("display","none");

  HoveringOverVariableDescriptionMenu = false;//if the menu is not showing then the user can't be hovering over it
}

function UpdateSimilarDefinedVariables(opts){
  console.log("UpdateSimilarDefinedVariables");
  if(opts.type == "update"){
    SimilarDefinedVariables[opts.ls] = {
      state: opts.props.state,
      type: opts.props.type,
      units: opts.props.units,
      unitsMathjs: opts.props.unitsMathjs,
      quantity: opts.props.quantity,
    };
  }
  else if(opts.type == "remove"){
    delete SimilarDefinedVariables[opts.ls];
  }
  //console.log(SimilarDefinedVariables);
}


function UpdateDefinedVariables(opts){
  if(opts.type == "add" || opts.type == "update"){
    if(opts.editable){
      let rid = (DefinedVariables[opts.ls] == undefined) ? RID(): DefinedVariables[opts.ls].rid;
      DefinedVariables[opts.ls] = opts.props;
      DefinedVariables[opts.ls].rid = rid;
      DefinedVariables[opts.ls].autoGenerated = opts.autoGenerated || false;
    }
    else{
      PreDefinedVariables[opts.ls] = opts.props;
      PreDefinedVariables[opts.ls].rid = opts.rid;
    }
  }
  else if(opts.type == "remove"){
    //console.log(opts);
    if(opts.editable){
      for (let [key, value] of Object.entries(DefinedVariables)) {
        if(value.rid == opts.rid){
          delete DefinedVariables[key];
          break;
        }
      }
    }
    else{
      for (let [key, value] of Object.entries(PreDefinedVariables)) {
        if(value.rid == opts.rid){
          delete PreDefinedVariables[key];
          break;
        }
      }
    }
  }

  if(opts.updateErrorMessages != false){
    //after editing we need to check if there are any new Editor errors
    EL.GenerateEditorErrorMessages();
  }

  //after editing the defined variables and or predfined variables we need to check what are the relevant equations for the defined variables
  CheckForAndDisplayRelevantEquations();
}

function IsVariableLatexStringVector(ls){
  return ls.indexOf("\\vec{") != -1 && ls.indexOf("\\hat{") != -1;
}

function UpdatedVariableDefinition(){
  $("#btn_udpate_variable_definition").addClass("disabled");//once the button is click it needs to be disabled
  $("#select_known_or_unknown").formSelect();
  $("#select_variable_type").formSelect();
  let props = {
    state: ($("#select_known_or_unknown").formSelect('getSelectedValues')[0]),
    type: $("#select_variable_type").formSelect('getSelectedValues')[0],
    units: TrimUnitInputValue($("#input-units-autocomplete").val()),
    fullUnitsString: $("#input-units-autocomplete").val(),
    value: (isExactValueInputFilledProperly() && VariableValueMathField.latex().length > 0) ? VariableValueMathField.latex() : undefined,
    unitsMathjs: UnitReference[$("#input-units-autocomplete").val()].unitsMathjs,//returns latex string for that particular input
    quantity: UnitReference[$("#input-units-autocomplete").val()].quantity,
  };

  //figuring out if we are defining an new variable or an existing one
  let ls = ($("#modal_define_variable").attr("type") == "new") ? DynamicMathField.latex() : StaticMathField.latex();
  ls = PutBracketsAroundAllSubsSups(ls);
  ls = ls.replace(/\\\s/g).replace(/\s/g,"");//removing unnecessary spaces which include latex formating space "\ " and just empty space "     "
  //if the user inputed that the variable is a vector but didn't put the vector sign or related signs then we will do that for them
  if(props.type == "vector" && (ls.indexOf('\\vec{') == -1 && ls.indexOf('\\hat{') == -1 && ls.indexOf('\\bar{') == -1 && ls.indexOf('\\overline{') == -1)){
    ls = `\\vec{${ls}}`;
  }
  //if the user inputed that the variable is a scalar but has the vector sign in their input then we will remove the vector sign for them
  if(props.type == "scalar" && ls.indexOf('\\vec{') != -1){
    ls = ls.substring(5,ls.length - 1);//removes "\vec{" from beginning and "}" from end
  }

  if($("#input-similar-defined-variables").prop("checked")){
    UpdateSimilarDefinedVariables({
      type: "update",
      ls: ls.replace(/_\{[^\}\{\s]*\}/g,""),//removes underscores to make variable more generic
      props: {
        state: "unknown",
        type: props.type,
        units: props.units,
        unitsMathjs: props.unitsMathjs,
        quantity: props.quantity,
      },
    });
  }
  else{
    UpdateSimilarDefinedVariables({
      type: "remove",
      ls: ls.replace(/_\{[^\}\{\s]*\}/g,""),//removes underscores to make variable more generic
    });
  }

  UpdateDefinedVariables({
    type: "update",
    ls: ls,
    editable: true,
    props: props,
  });
  //after adding or editing a variable we need to add or edit a variable in the "My Variables Tab"
  let rid = (Object.keys(DefinedVariables).includes(ls)) ? DefinedVariables[ls].rid : PreDefinedVariables[ls].rid;
  UpdateMyVariablesCollection({ls: ls, rid: rid, update: true, add: false, remove: false});

  //clear modal and resetting all values
  $("#select_known_or_unknown").val("");
  $("#select_variable_type").val("");
  $("#input-units-autocomplete").val("");
  VariableValueMathField.latex("");
  $("#input-exact-value-wrapper").css("display","none");
  $("#input-similar-defined-variables").prop("checked",true);

  MathFields[FocusedMathFieldId].mf.focus();
}

function TrimUnitInputValue(str){
  let start = str.indexOf(":");
  let end = str.indexOf("(");
  if(start != -1 && end != -1){
    str = str.substring(0,start) + " " + str.substring(end);
  }

  return str;
}

function TagVariable(id){
  CurrentlyTaggingVariables = true;
  console.log('Tag Variable!');
  if(CurrentlyHoveredMCI != null){

    //before we do anything we need to save the current position of the cursor so we can put it back to where it was once we are done
    let cp = GetCurrentCursorPositionFromTheRight(id);

    //mathField.focus();
    MathFields[id].mf.moveToLeftEnd();
    //$("#math-field .mq-selection").children().unwrap();
    let hoveredElmnt = $(`#${id} [mathquill-command-id='${CurrentlyHoveredMCI}']`);
    //console.log(CurrentlyHoveredMCI);
    //console.log($(`[mathquill-command-id='${CurrentlyHoveredMCI}']`));
    //this while loop positions the mathquil cursor in the right place
    while(!hoveredElmnt.prev().hasClass("mq-cursor")){
      MathFields[id].mf.keystroke("Right")
    }

    if(hoveredElmnt.next().hasClass("mq-supsub")){
      //console.log(hoveredElmnt.next().children(".mq-sub"));
      if(hoveredElmnt.next().children(".mq-sub").length > 0){
        //selecting the subscript of the variable as well
        MathFields[id].mf.keystroke("Shift-Right");
      }
    }

    //then we select the element we just hovered
    MathFields[id].mf.keystroke("Shift-Right");

    let ls = MathFields[id].mf.latex();

    MathFields[id].mf.typedText("$")
    let ls3 = MathFields[id].mf.latex();
    //console.log("ls3 " + ls3);
    ls = AdjustLatexForSubSup(ls, ls3);//editing ls if we see that their is inconsistency with how sub or sups are formatted
    //console.log("ls " + ls);
    let ls2 = MathFields[id].mf.latex().split("\\$");
    //console.log(ls2);
    let startIndex = ls.indexOf(ls2[0]);//start Index is always 0 based on my testing
    //we should only check the part of the string that comes after the variable we are trying to tag so we need to start the string substring at the index of the length of the first half of the string that is on the left of the variable that is being tagged
    //once we get the index we need to add back (startIndex + ls2[0].length) because that is how much off the number is from the orginal string beacuse we used a substring that is not the whole length of the string
    let endIndex = ls.substring(startIndex + ls2[0].length).indexOf(ls2[1]) + startIndex + ls2[0].length;
    let selectedString = "";
    if(endIndex == startIndex + ls2[0].length){//this expression equals true when ls2[1] = "" meaning that the variable we are trying to tag is on the very right edge of the equation
      selectedString = ls.substring(startIndex + ls2[0].length);
    }
    else{
      selectedString = ls.substring(startIndex + ls2[0].length, endIndex);
    }

    MathFields[id].mf.keystroke("Shift-Left");
    MathFields[id].mf.keystroke("Del");
    MathFields[id].mf.write(selectedString);
    StaticMathField.latex(selectedString);
    //console.log(selectedString);
    if(Object.keys(DefinedVariables).includes(selectedString)){
      PopulateSelectionMenu(Object.assign({}, DefinedVariables[selectedString]), true);
    }
    else if(Object.keys(PreDefinedVariables).includes(selectedString)){
      PopulateSelectionMenu(Object.assign({}, PreDefinedVariables[selectedString]), false);
    }
    else{
      PopulateSelectionMenu(Object.assign({}, DefaultDefinedVariable), true);
    }

    //we should only place the cursor back if this mathfield is the mathfield that is currently being focused on by the user
    if(FocusedMathFieldId == id){
      //ok now that we are done editing we need to put the cursor back to its previous location
      MathFields[id].mf.moveToRightEnd();
      for(var c = 0; c < cp; c++){
        MathFields[id].mf.keystroke("Left");
      }
    }
    else{
      MathFields[id].mf.blur();
    }

  }

  CurrentlyTaggingVariables = false;
}

function AdjustLatexForSubSup(ls1,ls2){
  //we are going to compare the two strings and the minute they are not in agreement we will check if the character before that disagrement was a _ or ^ and it will tell us that their is an inconsistnecy in formatting so we will fix ls1 and return it
  let i = 0;
  while(i < ls1.length && i < ls2.length){
    if(ls1[i] != ls2[i]){//the minute the string don't match we will stop the while loop but we need to run checks to figure out why they don't match and it if has to do with ^ and _ formating of brackets
      if(i != 0){//i has to be greater than 0 for it to be a bracket formatting problem because there has to be a character (^ or _) before the mismatch
        //now we have to check if the previous character is a ^ or _
        if(ls1[i-1] == "^" || ls2[i-1] =="_"){//the character before the mismatch has to be a ^ or _ for us to consider changing the latex string
          //copy
          let str = ls1.slice();
          //edit and save
          ls1 = str.substring(0,i) + "{" + str.substring(i,i+1) + "}" + str.substring(i+1);
        }
      }
      break;
    }
    i++;
  }

  return ls1;
}

function GetCurrentCursorPositionFromTheRight(id){
  //this function counts how many keystrokes it takes to get to the very right of the line and then returns that number so when the dom is edited and the cursor is moved around we can figure out where to put it later
  let p = 0;
  while(!$(`#${id} .mq-root-block`).children().last().hasClass("mq-cursor")){
    MathFields[id].mf.keystroke("Right");
    p++;
  }
  MathFields[id].mf.moveToLeftEnd();

  return p;
}

function MathFieldKeyPressEnter(el){
  //create a new div element then initialize a math field in it
  let rid = RID();
  $(`
    <div class="editor_line row">
      <div class="line_label col m1">
        <span class="active line-number">1</span>
        <span onclick="OpenEditorLog('warning')" class="line-warning" mf="${rid}">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="amber-text text-lighten-2 bi bi-exclamation-triangle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>
        </span>
        <span onclick="OpenEditorLog('error')" class="line-error" mf="${rid}">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="red-text text-lighten-2 bi bi-bug-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A4.985 4.985 0 0 0 3 6h10a4.985 4.985 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A4.978 4.978 0 0 0 8 1a4.979 4.979 0 0 0-2.731.811l-.29-.956zM13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5H13zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975z"/>
          </svg>
        </span>
        <span class="line-question" mf="${rid}"><i class="fas fa-question-circle"></i></span>
      </div>
      <div class="col m11 my_math_field_col">
        <div id="${rid}" class="my_math_field"></div>
      </div>
    </div>
    `).insertAfter(el);

  FocusedMathFieldId = rid;
  SetMathFieldsUI();

  //adding keypress event for the new mathfield element
  $(`#${rid}`).click(function(){
    FocusedMathFieldId = $(this).attr("id");
    SetMathFieldsUI();
  });

  AdjustLineLabelNumber();//make sure that the line is label with the correct number

  CreateNewMathField(rid);
}

function MoveCursor1Line(id, move = "down", direction = "right"){
  BlurMathFields();
  let nextLineId = undefined;
  if(move == "down"){
    nextLineId = $(`#${id}`).parents(".editor_line").next().find(".my_math_field").attr("id");

    if(nextLineId == undefined){//there is no line below so we must create one
      MathFieldKeyPressEnter($(`#${id}`).parents(".editor_line"));
    }
    else{
      FocusedMathFieldId = nextLineId;
      SetMathFieldsUI();
      MathFields[FocusedMathFieldId].mf.focus();
      if(direction == "right"){
        MathFields[FocusedMathFieldId].mf.moveToLeftEnd();
      }
      else{
        MathFields[FocusedMathFieldId].mf.moveToLeftEnd();
      }



    }

  }
  else if(move == "up"){
    nextLineId = $(`#${id}`).parents(".editor_line").prev().find(".my_math_field").attr("id");
    if(nextLineId != undefined){
      FocusedMathFieldId = nextLineId;
      SetMathFieldsUI();
      MathFields[FocusedMathFieldId].mf.focus();
      if(direction == "left"){
        MathFields[FocusedMathFieldId].mf.moveToRightEnd();
      }
      else{
        MathFields[FocusedMathFieldId].mf.moveToLeftEnd();
      }
    }
  }

}

function UpdateLineLabelHeight(id){
  //console.log($(`#${id}`).parents(".editor_line").children(".line_label"));
  $(`#${id}`).parents(".editor_line").children(".line_label").css({
    height: $(`#${id}`).parent(".my_math_field_col").css("height")
  });
  //console.log($(`#${id}`).parent(".my_math_field_col").css("height"));
}

function BlurMathFields(){
  for (let [key, value] of Object.entries(MathFields)) {
    value.mf.blur();
  }
}

function AdjustLineLabelNumber(){
  $(".editor_line").each(function(index){
    $(this).find(".line_label span.line-number").html(index + 1);
  });
}

function GenerateAutoCompleteData(){
  let data = {};
  let unitReference = {};
  UnitReference = {};
  for (let [key, value] of Object.entries(ListOfSIUnits)) {
    let k = `${key}: ${value.name} (${value.symbol})`;
    data[k] = null;
    value.quantity = key;
    unitReference[k] = value;
  }

  UnitReference = Object.assign({}, unitReference);

  return data;
}

function CheckUnitsValue(){

  console.log("Check Units Value")

  //console.log($("#input-units-autocomplete").val());

  if(Object.keys(AutoGeneratedUnitData).includes($("#input-units-autocomplete").val())){
    $("#units-helper-text").html("Valid Unit");
    $("#units-helper-text").attr("valid","true");
    $("#units-helper-text").addClass("teal-text");
    $("#units-helper-text").removeClass("red-text");
  }
  else{
    $("#units-helper-text").html("Unit not recognized");
    $("#units-helper-text").attr("valid",false);
    $("#units-helper-text").removeClass("teal-text");
    $("#units-helper-text").addClass("red-text");
  }

}

function IsInputAValidVariable(ls){
  console.log("IsInputAValidVariable");
  //console.log(ls);
  let listOfUnwantedChars = ListOfOperators.concat(["^","+","-","/","\\vec{ }"]);
  if(ls.length > 0){//the user inputted something
    //console.log(GetVariablesFromLatexString(ls));
    if(GetVariablesFromLatexString(ls).length == 1){//we can only find one variable
      //check to make sure there are not unwanted characters
      for(var i = 0; i < listOfUnwantedChars.length; i++){
        if(ls.indexOf(listOfUnwantedChars[i]) != -1){//found unwanted character
          return false;
        }
      }
      //if we get through the for loop without returning then there are no unwanted characters
      return true;
    }
  }

  return false;
}

function CheckModalForm(){
  console.log("Checkmodalform");
  let disableButton = true;
  //checks if form is properly filled
  if($("#select_known_or_unknown").val() != null && $("#select_variable_type").val() != null){
    let exactValueFilledProperly = false;

    if($("#select_known_or_unknown").val() == "known" && $("#select_variable_type").val() == "scalar"){
      $("#input-exact-value-wrapper").css("display","block");
      exactValueFilledProperly = isExactValueInputFilledProperly();
    }
    else{
      $("#input-exact-value-wrapper").css("display","none");
      exactValueFilledProperly = true;
    }

    if(exactValueFilledProperly){

      //style exact value input text green because input is filled properly
      $("#input-exact-value-wrapper .helper-text").addClass("teal-text");
      $("#input-exact-value-wrapper .helper-text").removeClass("red-text");
      $("#input-exact-value-wrapper .helper-text").html("Valid Input");

      if($("#units-helper-text").attr("valid") == "true"){
        //checking if the variable is a vector and if so then we need to check if it can be. if it is a scalar then everything is good
        //console.log($("#input-units-autocomplete").val());
        if($("#select_variable_type").val() == "scalar" || UnitReference[$("#input-units-autocomplete").val()].canBeVector){
          //if the if statement returns true than the unit and the type of unit (scalar or vector) agree with each other
          $("#variable-type-helper-text").css('display','none');//don't display error message
          if(($("#dynamic-math-define-variable").attr("valid") == "true" || $("#modal_define_variable").attr("type") == "existing")){
            disableButton = false;
          }
        }
        else{
          //the only way the if statement returned false is if the variable is a vector but the unit the user chose can't be a vector
          $("#variable-type-helper-text").css('display','inline-block');
        }
      }

    }
    else{
      //style exact value input text red because input is not filled properly
      $("#input-exact-value-wrapper .helper-text").addClass("red-text");
      $("#input-exact-value-wrapper .helper-text").removeClass("teal-text");
      $("#input-exact-value-wrapper .helper-text").html("Invalid Input");
    }

  }



  if(disableButton){
    $("#btn_udpate_variable_definition").addClass("disabled");
  }
  else{
    $("#btn_udpate_variable_definition").removeClass("disabled");
  }

}

function isExactValueInputFilledProperly(){
  let ls = VariableValueMathField.latex();
  //removing any acceptable characters that could trigger an unwanted character
  ls = ls.replace(/\\cdot/g,"").replace(/\\frac/g,"").replace(/\\times/g,"").replace(/\\pi/g,"").replace(/[ei]/g);
  let unwantedChars = "+*=!@#$%&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  for(var i = 0; i < unwantedChars.length; i++){
    if(ls.includes(unwantedChars[i])){
      return false;
    }
  }

  return true;
}

function SetMathFieldsUI(){
  $(".line_label").removeClass('active');
  $(`#${FocusedMathFieldId}`).parents(".editor_line").children(".line_label").addClass("active");
  $(".my_math_field_col").removeClass("active");
  $(`#${FocusedMathFieldId}`).parent(".my_math_field_col").addClass("active");
}

function DeleteCurrentMathField(id){
  //the id of the mathfield that needs to be focused because this one is getting deleted
  let newId = $(`#${id}`).parents(".editor_line").prev().find(".my_math_field").attr("id");
  if(newId != undefined){
    //deleting mathfield
    delete MathFields[id];
    $(`#${id}`).parents(".editor_line").remove();
    //setting new mathfield
    FocusedMathFieldId = newId;
    SetMathFieldsUI();
    AdjustLineLabelNumber();
    MathFields[FocusedMathFieldId].mf.focus();
    MathFields[FocusedMathFieldId].mf.moveToRightEnd();

  }
}

function ToggleKeyboard(){
  console.log("Toggle Keyboard");
  //console.log($("#toggle-dir").hasClass("fa-caret-down"));
  if($("#toggle-dir").hasClass("fa-caret-down")){
    $("#toggle-dir").removeClass("fa-caret-down");
    $("#toggle-dir").addClass("fa-caret-up");
    $("#keyboard-container").css("top","100%");
  }
  else{
    $("#toggle-dir").removeClass("fa-caret-up");
    $("#toggle-dir").addClass("fa-caret-down");
    $("#keyboard-container").css("top","calc(100% - 150px)");
  }
}

function RenderMessageUI(id){

  console.log(MathFields[id].message);

  let elmnt = $(`#${id}`).parents(".editor_line");
  elmnt.find(".line_label span").removeClass('active');

  if(MathFields[id].message.question != null){
    elmnt.find(".line_label span.line-question").addClass('active');
  }
  else if(MathFields[id].message.warning != null){
    elmnt.find(".line_label span.line-warning").addClass('active');
  }
  else if(MathFields[id].message.error != null){
    elmnt.find(".line_label span.line-error").addClass('active');
  }
  else{
    elmnt.find(".line_label span.line-number").addClass('active');
  }
}

function GetUndefinedVariables(ls){
  ls = RemoveCommentsFromLatexString(ls);
  //first we need to get all the variables
  let vars = GetVariablesFromLatexString(ls);
  //console.log("........................vars");
  //console.log(vars);
  let definedVars = Object.keys(DefinedVariables).concat(Object.keys(PreDefinedVariables));
  //console.log("........................definedVars");
  //console.log(definedVars);
  let undefinedVars = [];
  for(var i = 0; i < vars.length; i++){
    if(!definedVars.includes(vars[i])){
      undefinedVars.push(vars[i]);
    }
  }

  //so now we have this list of undefined variables but we need to check if we can automatically assign values to some of the variables using the SimilarDefinedVariables object
  //if we can then they are no longer undefined
  let newSetOfUndefinedVars = TryToAssignDefinitionsToUndefinedVariables(undefinedVars)

  return newSetOfUndefinedVars;

}

function TryToAssignDefinitionsToUndefinedVariables(undefinedVars){
  let keys = Object.keys(SimilarDefinedVariables);
  let newSetOfUndefinedVars = [];
  for(var i = 0; i < undefinedVars.length; i++){
    let ls = undefinedVars[i];

    let uv = ls.replace(/_\{[^\}\{\s]*\}/g,"");//removing underscores to make it more generic to see if it can match with any of the generic variables that are in SimilarDefinedVariables
    let index = keys.indexOf(uv);
    if(index != -1){//we found a match
      //so now we will define this variable that was before seen as undefined by seeding with the information found in SimilarDefinedVariables object

      UpdateDefinedVariables({
        updateErrorMessages: false,
        type: "update",
        ls: ls,
        editable: true,
        props: Object.assign({},SimilarDefinedVariables[keys[index]]),//seeding it with base information about a variable for example F_{0} that was seen as a force so a similar variable F_{1} should also be seen as a force
        autoGenerated: true,
      });
      //after adding or editing a variable we need to add or edit a variable in the "My Variables Tab"
      let rid = (Object.keys(DefinedVariables).includes(ls)) ? DefinedVariables[ls].rid : PreDefinedVariables[ls].rid;
      UpdateMyVariablesCollection({ls: ls, rid: rid, update: true, add: false, remove: false});
    }
    else{
      //if we didn't find a match then we know for a fact that this variable is still undefined
      newSetOfUndefinedVars.push(ls);
    }
  }

  return newSetOfUndefinedVars;
}

function RemoveCommentsFromLatexString(ls){
  //we need to find the index of "\text{" in the string and find the closing bracket and remove everthing in between
  while(ls.indexOf("\\text{") != -1){
    let startIndex = ls.indexOf("\\text{");
    let i = startIndex;
    let foundClosingBracket = false;
    while(i < ls.length){
      if(ls[i] == "}"){
        //we need to check that it is not an escaped closing bracket meaning that it is just text and not a latex closing bracket
        if(ls[i - 1] != "\\"){
          foundClosingBracket = true;
          break;
        }
      }
      i++;
    }

    ls = ls.substring(0, startIndex) + ls.substring(i + 1);
  }

  return ls;
}

function PutBracketsAroundAllSubsSups(ls){
  //puts brackets around all superscripts and subscripts if they don't have them already
  let i = 0;
  let foundIndicator = false;
  while(i < ls.length){
    if(foundIndicator){
      if(ls[i] != "{"){
        ls = ls.substring(0,i) + "{" + ls[i] + "}" + ls.substring(i+1);
      }
    }

    foundIndicator = (ls[i] == "_" || ls[i] == "^");

    i++;
  }

  return ls;
}

function AddLineLabelHoverEvent(id){
  $(`.line_label [mf='${id}']`).hover(function(){
    OpenLineMessageBox(id);
  },function(){
    CloseLineMessageBox();
  });
}

function OpenLineMessageBox(id){

  //console.log("OpenLineMessageBox.................");
  //console.log(MathFields[id].message);

  $("#line-message-box-question, #line-message-box-warning, #line-message-box-error").removeClass("active");

  if(MathFields[id].message.question != null){
    $("#line-message-box-question").addClass('active');
  }
  else if(MathFields[id].message.warning != null){
    $("#line-message-box-warning").addClass('active');
    if(MathFields[id].message.warning.type == 1){
      MessageBoxMathFields.warning.m1.latex(MathFields[id].message.warning.vars.join(","));
    }
  }
  else if(MathFields[id].message.error != null){
    $("#line-message-box-error").addClass('active');
    if(MathFields[id].message.error.type == 1){
      $("#line-message-box-error").html("click to view error in log");
    }
  }

  //after setting up the message box we need to display it in the right place
  let r = $(`#${id}`).parents(".editor_line").find(".line_label")[0].getBoundingClientRect();
  $("#line-message-box").css({
    top: r.top + r.height + 10,
    left: 10
  });

  $("#line-message-box").css("display","block");

}

function CloseLineMessageBox(){
  $("#line-message-box").css("display","none");
}

function TogglePhysicsConstant(el, index){
    let obj = Object.assign({}, ListOfPhysicsConstants[index]);
    //console.log(obj);
    if(!el.prev().prop("checked")){
      M.toast({html: `<span class='green-text text-lighten-4'>${obj.quantity}</span> &nbsp; added to 'My Variables' Tab`, displayLength: 3000});
      UpdateMyVariablesCollection({ls: obj.symbol, rid: el.attr("rid"), add: true, pc: obj, editable: false, indexChild: index});
    }
    else{
      //we need to check if variable is being used in the editor and if it is this can't be removed
      if(!isVariableBeingUsedInEditor({rid: el.attr("rid"), editable: false})){
        M.toast({html: `<span class='red-text text-lighten-4'>${obj.quantity}</span> 	&nbsp; removed from 'My Variables' Tab`, displayLength: 3000});
        UpdateMyVariablesCollection({ls: obj.symbol, rid: el.attr("rid"), remove: true, editable: false});
      }
      else{
        //if it is being used then we just show a notitication that the variable can't be deleted
        M.toast({html: "This variable can't be removed because it is being used", displayLength: 3000});
      }
    }

}

function UpdateMyVariableCollectionWithDynamicVariables(undefinedVars){

}

function UpdateMyVariablesCollection(opts = {ls: "", rid: "", update: true, add: false, pc: {}, remove: false, editable: true}){

  //first we need to identify where this variable is coming from "PreDefinedVariables" or "DefinedVariables" and that determines if the the variable is editable or not
  let currentVariable;
  let isVariableEditable = Object.keys(DefinedVariables).includes(opts.ls);
  if(isVariableEditable){
    currentVariable = Object.assign({}, DefinedVariables[opts.ls]);
  }else{
    currentVariable = Object.assign({}, PreDefinedVariables[opts.ls]);
  }

  if(opts.update){
    let updateCollection = false;

    $(`#my_variables .collection-item .static-physics-equation`).each(function(){
      if($(this).attr("rid") == opts.rid){
        updateCollection = true;
        //we need to remove all badges and put new ones
        $(this).parent().children(".new.badge, .delete-var").remove();
        let html = `
          <span class="right delete-var" onclick="UpdateMyVariablesCollection({rid: '${opts.rid}',remove: true, editable: ${isVariableEditable}})"><i class="material-icons">close</i></span>
          <span class="new badge ${currentVariable.state}" data-badge-caption="${currentVariable.state}"></span>
          <span class="new badge info" data-badge-caption="${currentVariable.type}"></span>
          <span class="new badge info" data-badge-caption="${currentVariable.units}"></span>
        `;
        $(html).insertAfter($(this));
        return;

      }
    });

    if(!updateCollection){
      let html = `
      <li class="collection-item">
        <span class="static-physics-equation editable-variable tooltipped" data-position="left" data-tooltip="Edit" latex="${opts.ls}" rid="${opts.rid}" onclick="EditVariableDefinition($(this))"></span>
        <span class="right delete-var" onclick="UpdateMyVariablesCollection({rid: '${opts.rid}',remove: true, editable: ${isVariableEditable}})"><i class="material-icons">close</i></span>
        <span class="new badge ${currentVariable.state}" data-badge-caption="${currentVariable.state}"></span>
      `;
      if(currentVariable.value == undefined){
        html += `
        <span class="new badge info" data-badge-caption="${currentVariable.type}"></span>
        <span class="new badge info" data-badge-caption="${currentVariable.units}"></span>
        `;
      }
      else{
        html += `
        <span class="new badge info" data-badge-caption="${currentVariable.units}"></span>
        <span class="new badge constant-info" data-badge-caption=""><span latex="=${currentVariable.value}" rid="${opts.rid}"></span></span>
        `;
      }

      `
      </li>
      `;
      $("#my_variables .collection").append(html);
      //adding materialize event listener
      $(`.editable-variable[rid='${opts.rid}']`).tooltip();
    }
  }
  else if(opts.add){
    let html = `
    <li class="collection-item">
      <span class="static-physics-equation" latex="${opts.pc.symbol}" rid="${opts.rid}"></span>
      <span class="right delete-var" onclick="UpdateMyVariablesCollection({ls: '${opts.ls}', rid: '${opts.rid}',remove: true, editable: ${isVariableEditable}, indexChild: ${opts.indexChild}})"><i class="material-icons">close</i></span>
      <span class="new badge physics-constant" data-badge-caption="${opts.pc.quantity}"></span>
      <span class="new badge constant-info" data-badge-caption=""><span latex="${opts.pc.unit}" rid="${opts.rid}"></span></span>
      <span class="new badge constant-info" data-badge-caption=""><span latex="=${opts.pc.value}" rid="${opts.rid}"></span></span>

    </li>
    `;
    $("#my_variables .collection").append(html);
    //adding variable to defined variables
    UpdateDefinedVariables({
      type: "add",
      ls: opts.pc.symbol,
      rid: opts.rid,
      editable: opts.editable,
      props: {
        state: "known",
        type: 'constant',
        units: opts.pc.unitString,
        size: "0",
        unitsMathjs: opts.pc.unitsMathjs,
        quantity: opts.pc.quantity,
      },
    });
  }
  else if(opts.remove){
    //before we remove this variable we need to check if it is being used in the editor
    if(!isVariableBeingUsedInEditor({rid: opts.rid, editable: opts.editable})){
      $(`#my_variables .collection-item .static-physics-equation`).each(function(){
        if($(this).attr("rid") == opts.rid){
          $(this).parent().remove();
        }
      });
      if(opts.indexChild != undefined){
        //this means that we are deleting a physics constants because they are the only ones that know what number child they are in the list of physics constants
        //because we are deleting the physics constant we have to uncheck the box in the physics constants list under "Use" column
        $($(`.physics-constant-checkbox-span`)[opts.indexChild]).prev().prop("checked",false)
      }
      //removing variable from defined variables object
      UpdateDefinedVariables({
        type: "remove",
        rid: opts.rid,
        editable: opts.editable,
      });
    }
    else{
      //if it is being used then we just show a notitication that the variable can't be deleted
      M.toast({html: "This variable can't be removed because it is being used", displayLength: 3000});
    }

  }

  if((opts.add || opts.update) && opts.rid != undefined && opts.rid != ""){
    //initializing static mathfield for any latex string that might be used
    $(`#my_variables .collection [rid='${opts.rid}']`).each(function(){
      MQ.StaticMath($(this)[0]).latex($(this).attr("latex"));
    });
  }

  //updating hover event
  $("#my_variables .collection-item").unbind("mouseout mouseover");
  $("#my_variables .collection-item").hover(function(){
    $("#my_variables .collection-item").removeClass('active');
    $(this).addClass('active');
  },function(){
    $(this).removeClass('active');
  });
  //checking how many variables are defined and if there are none adding the no-variables-defined class to the collection
  //this helps with ui look and feel
  if($("#my_variables .collection-item").length == 0){
    $("#my_variables .collection").addClass("no-variables-defined");
  }
  else{
    $("#my_variables .collection").removeClass("no-variables-defined");
  }

}

function isVariableBeingUsedInEditor(opts){
  let vars = (opts.editable) ? (Object.assign({}, DefinedVariables)) : (Object.assign({}, PreDefinedVariables));
  let latexString;
  for (const [key, value] of Object.entries(vars)) {
    if(value.rid == opts.rid){
      latexString = key;
    }
  }

  if(latexString != undefined){
    for (const [key, value] of Object.entries(MathFields)) {
      //getting all the variables in a specific mathfield and checking if any of them match the latexString we are looking for
      if(GetVariablesFromLatexString(value.mf.latex()).indexOf(latexString) != -1){
        return true;
      }
    }
  }

  return false;

}

function EditVariableDefinition(el){
  for (const [key, value] of Object.entries(DefinedVariables)) {
    if(value.rid == el.attr("rid")){
      StaticMathField.latex(key);//passing the latex string that corresponds to the variable the user is trying to edit
      //use existing variable because the user wants to edit an exisiting variable
      OpenDefineVariableModal({init: true, ls: key, variable: value});
    }
  }

}

function CopyPhysicsEquationToClipboard(el){
  CopyToClipboard(el.attr("latex"));
  M.toast({html: "Equation copied to clipboard", displayLength: 3000});
}

function CopyToClipboard(str) {
  //console.log(str);
  const el = document.createElement('textarea');
  el.value = str;
  //console.log(el.value);
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

function DefineUndefinedVariable(el){
  StaticMathField.latex(el.attr("latex"));//passing the latex string that corresponds to the variable the user is trying to edit
  OpenDefineVariableModal({init: true, ls: el.attr("latex"), variable: null});
}

function OpenDefineVariableModal(opts = {init: true}){
  //checking input box regardless of whether or not it is a new variable that is being defined or an existing. It should always assume similar variables have same units unless the user unchecks the box
  $("#input-similar-defined-variables").prop("checked",true);
  //closing more info container when modal is first opened
  $("#similar-variables-info-container").removeClass("opened");
  $("#similar-variables-info-container").css({height: 0, opacity: 0});

  //making sure that unit type error helper text is not showing because when the modal is first opened everything is formatted correctly regardless if we are making a new variable or editing an exisiting one
  $("#variable-type-helper-text").css("display",'none');

  //before opening modal we need to initialize all the select inputs
  $('#select_known_or_unknown, #select_variable_type').formSelect();
  let variable = null;
  if(opts.init){
    $("#modal_define_variable").attr("type","existing");//we are defining an existing variable
    if(Object.keys(DefinedVariables).includes(opts.ls)){
      variable = Object.assign({}, opts.variable);


      //console.log('variable', variable);

      $('#select_known_or_unknown, #select_variable_type').formSelect();//this actutally updates the form
      $("#select_known_or_unknown").val(variable.state);
      $("#select_variable_type").val(variable.type);
      $('#select_known_or_unknown, #select_variable_type').formSelect();//this actutally updates the form

      $("#input-units-autocomplete").val(variable.fullUnitsString);

      if(variable.value != undefined){
        VariableValueMathField.latex(variable.value);
      }
      else{
        VariableValueMathField.latex("");
      }

      //formating valid unit helper text
      $("#units-helper-text").attr("valid","true");
      $("#units-helper-text").html("Valid Unit");
      $("#units-helper-text").addClass("teal-text");
      $("#units-helper-text").removeClass("red-text");

    }

  }
  else{
    //if init is false that means that a user is trying to create a new variable so they need a dynamic math field so they can write out the variable
    $("#modal_define_variable").attr("type","new");//we are defining a new variable
    //making sure the dynamic math field starts out empty so that the user can type whatever they want
    DynamicMathField.latex("");
    $("#input-exact-value-wrapper").css("display","none");
    VariableValueMathField.latex("");
  }

  if(variable == null){

    $("#select_known_or_unknown").val("");
    $("#select_variable_type").val("");
    $('#select_known_or_unknown, #select_variable_type').formSelect();//this actutally updates the form

    $("#input-units-autocomplete").val("");

    //formating helper text for units
    $("#units-helper-text").html("Unit not recognized");
    $("#units-helper-text").attr("valid","false");
    $("#units-helper-text").removeClass("teal-text");
    $("#units-helper-text").addClass("red-text");

    $("#input-exact-value-wrapper").css("display","none");
    VariableValueMathField.latex("");

  }

  //if the user clicks on the headers it should open up the editing variable modal
  $("#modal_define_variable").modal('open');
  CheckModalForm();//make sure that everything is formatted properly

}

function ToggleMoreInformationOnSimilarVariablesContainer(){
  if($("#similar-variables-info-container").hasClass("opened")){
    $("#similar-variables-info-container").removeClass("opened");
    $("#similar-variables-info-container").animate({
      height: 0,
      opacity: 0,
    }, 500);
  }
  else{
    $("#similar-variables-info-container").addClass("opened");
    $("#similar-variables-info-container").css("height","100%");
    let h = $("#similar-variables-info-container").height();
    $("#similar-variables-info-container").height(0);
    $("#similar-variables-info-container").animate({
      height: h,
      opacity: 1,
    }, 500);
  }
}

function CloseEditorLog(){
  $("#editor-log-container").animate({
    right: -0.416 * window.innerWidth,
  },250);
}

function OpenEditorLog(type){
  $('#editor-log-container .collapsible.log-container').collapsible('close', 0);
  $('#editor-log-container .collapsible.log-container').collapsible('close', 1);
  $('#editor-log-container .collapsible.log-container').collapsible('close', 2);
  $('#editor-log-container .collapsible.log-container').collapsible('close', 3);
  $(".success-log, .info-log, .warning-log, .error-log").removeClass('active');
  switch(type) {
    case 'success':
      $('#editor-log-container .collapsible.log-container').collapsible('open', 0);
      break;
    case 'info':
      $('#editor-log-container .collapsible.log-container').collapsible('open', 1);
      break;
    case 'warning':
      $('#editor-log-container .collapsible.log-container').collapsible('open', 2);
      break;
    case 'error':
      $('#editor-log-container .collapsible.log-container').collapsible('open', 3);
      break;
    default:
      // code block
  }
  $("#editor-log-container").animate({
    right: 0,
  },250);
}

function GetLineNumberFromMathFieldId(mfId){
  return parseInt($(`#${mfId}`).parents(".editor_line").find(".line-number").html());
}

function CheckForAndDisplayRelevantEquations(){
  let usedQuantities = GetAllUsedQuantities();//an object that has the quanitity as the key and true if it is known or and false if it is unknown
  //this function goes through the dom of physics equations and checks the quanities they relate and sees if the equation is relevant for the defined quanities in the editor
  //an equation is relevant when there are no quanitites that the user is not using  and when it has one quantity that the user is using and has set as known.
  //additionally the user has to have the same number of each quantity or more for an equation to be relevant

  let sections = ["mechanics-equations","thermal-equations","waves-optics-equations","electricity-magnetism-equations","modern-physics-equations"];

  let totalNumberOfRelevantEquationsInSection = 0;

  sections.map(function(section,index){

    let numberOfRelevantEquationsInSection = 0;

    $(`#physics_equations .${section} .static-physics-equation.mq-math-mode`).each(function(){
      let quantities = JSON.parse($(this).attr("quantities"));
      let isRelevantEquation = false;
      for (const [key, value] of Object.entries(quantities)) {
        if(usedQuantities[key] != undefined){//checking if user has defined the quantity that this equation uses
          if(usedQuantities[key].number >= value){//the user has defined this variable at least the same number of times this equation needs or more
            if(usedQuantities[key].state == "known"){
              isRelevantEquation = true;
            }
          }
          else{
            isRelevantEquation = false;//the equation is not relevant because this equation needs a specific quantity a specific number of times and the user hasn't defined a quantity enough times
            break;
          }
        }
        else{
          isRelevantEquation = false;//the equation is not relevant because there is a quantity that this equation needs that the user hasn't defined
          break;
        }
      }

      if(isRelevantEquation){
        $(this).addClass("relevant-equation");
        numberOfRelevantEquationsInSection += 1;
      }
      else{
        $(this).removeClass("relevant-equation");
      }

    });

    totalNumberOfRelevantEquationsInSection += numberOfRelevantEquationsInSection;

    //updating the label that shows how many relevant equations are in a specific physics equation section
    $(`#physics_equations .${section} .relevant-equations-badge`).html(numberOfRelevantEquationsInSection);
    if(numberOfRelevantEquationsInSection > 0){//making the badge and count visibile if there are relevant equations in this section
      $(`#physics_equations .${section} .relevant-equations-badge`).addClass('active');
    }
    else{
      $(`#physics_equations .${section} .relevant-equations-badge`).removeClass('active');
    }

  });

  $("#relevant-physics-equations-total-count > span").html(totalNumberOfRelevantEquationsInSection);
  if(totalNumberOfRelevantEquationsInSection > 0){
    $("#relevant-physics-equations-total-count").addClass("active");
  }
  else{
    $("#relevant-physics-equations-total-count").removeClass("active");
  }

}

function GetAllUsedQuantities(){
  let usedQuantities = {};

  for (const [key, value] of Object.entries(PreDefinedVariables)) {
    if(value.quantity != undefined){
      if(usedQuantities[value.quantity] == undefined){
        usedQuantities[value.quantity] = {number: 1, state: value.state};
      }
      else{
        usedQuantities[value.quantity].number += 1;
      }
    }
  }

  for (const [key, value] of Object.entries(DefinedVariables)) {
    if(value.quantity != undefined){
      if(usedQuantities[value.quantity] == undefined){
        usedQuantities[value.quantity] = {number: 1, state: value.state};
      }
      else{
        usedQuantities[value.quantity].number += 1;
      }
    }
  }

  return usedQuantities;

}

function CheckIfAutoGeneratedVariablesAreBeingUsed(){

  let autoGeneratedVars = [];
  for (const [key, value] of Object.entries(DefinedVariables)) {
    if(value.autoGenerated){
      //pushing the latex string because this variable is auto Generated
      autoGeneratedVars.push(key);
    }
  }

  //when some edits the editor we need to check if the auto generated variables are being used and if not we need to remove them
  for (const [key, obj] of Object.entries(MathFields)) {
    if(autoGeneratedVars.length > 0){
      let ls = obj.mf.latex();//getting the latex string from a specific mathfield
      let vars = GetVariablesFromLatexString(ls);

      for(let i = 0; i < autoGeneratedVars.length; i++){
        //loop through the autoGeneratedVars array and check if the variable is included in the vars list.
        //if it is then we know this autoGenerated variable is being used so we remove it from the list of autoGeneratedVars.
        if(vars.includes(autoGeneratedVars[i])){
          autoGeneratedVars.splice(i,1);
          i--;//to adjust for the shift in indexes after the splice
        }
      }
    }
  }

  //after we have looped through all of the mathfields and checked all the auotGenerated variables the autoGeneratedVars array will only have the unused auto Generated variables in it
  //so we take this list of keys that are latex string and will remove these variables
  for(let i = 0; i < autoGeneratedVars.length; i++){
    UpdateMyVariablesCollection({rid: DefinedVariables[autoGeneratedVars[i]].rid, remove: true, editable: true});
  }
}

function RemoveDifferentialOperatorDFromLatexString(ls){
  let acceptableStrings = ["\\vec"].concat("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""));
  let newLs = "";
  let i = 0;
  let str = "";
  let delta = 1;
  let skipCharacter = false;
  while(i < ls.length){
    delta = 1;
    skipCharacter = false;
    str = ls.substring(i);
    if(str[0] == "d" && str.length > 1){//checking that the "d" we are looking at is not the last character in the string if it is we must assume that it is not a differntial operator
      for(let c = 0; c < acceptableStrings.length; c++){
        if(str.indexOf(acceptableStrings[c]) == 1){//this means that the acceptable character comes right after "d" and uses "d" as a differntial operator for example the equation: dxdydz=dv, where x,y,z,v all use "d" as an operator
          skipCharacter = true;//we want to skip this character
          delta = 1;
          break;//once we find a character that works we don't have to continue to parse through the rest of the array
        }
      }

    }
    else if(str.indexOf("\\Delta ") == 0 && str.length > "\\Delta ".length){//checking that the "d" we are looking at is not the last character in the string if it is we must assume that it is not a differntial operator
      for(let c = 0; c < acceptableStrings.length; c++){
        if(str.substring("\\Delta ".length).indexOf(acceptableStrings[c]) == 0){//this means that the acceptable character comes right after "d" and uses "d" as a differntial operator for example the equation: dxdydz=dv, where x,y,z,v all use "d" as an operator
          skipCharacter = true;//we want to skip this character
          delta = "\\Delta ".length;
          break;//once we find a character that works we don't have to continue to parse through the rest of the array
        }
      }

    }
    else if(str.indexOf("_{") == 0 || str.indexOf("^{") == 0){
      //we don't parse any information in a sup or sub because those wouldnt have any actual operations happening inside them so we just record everything inside these ranges and move on
      delta = FindIndexOfClosingBracket(str.substring(2)) + 3;//adding 2 this value would get us to the index of the closing bracket and then adding one more would get us to the next character we want to parse
    }
    else if(str.indexOf("\\") == 0){
      let a = ListOfOperators.concat(LatexGreekLetters);//this is a list of special latex strings that we should not parse and just add to newLs
      for(let i = 0; i < a.length; i++){
        if(str.indexOf(a[i]) == 0){//if we find a match then change delta and stop parsing through the array
          delta = a[i].length;
          break;
        }
      }
    }

    if(!skipCharacter){
      newLs += ls.substring(i, i + delta);//recording information into newLs
    }

    i += delta;
  }
  return newLs;
}

function FormatNablaSquared(ls){
  //we need to replace all instances of \nabla^2 with \nabla \cdot \nabla for our editor to know what we mean
  return ls.replace(/nabla\^2/g,"\\nabla\\cdot\\nabla ");

}

function OrderMathFieldIdsByLineNumber(ids){
  let orderedIds = {};
  for(var i = 0; i < ids.length; i++){
    orderedIds[GetLineNumberFromMathFieldId(ids[i])] = ids[i];
  }

  return orderedIds;
}
