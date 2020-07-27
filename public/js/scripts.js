$(document).ready(function(){

  $("#determinate-loader").css("width","100%");

  setTimeout(function(){
    $("#loading-screen").animate({
      opacity: 0.0
    },500,function(){
      $(this).css("display","none");
    });
  },2100);


  $(".static-physics-equation").each(function(i){
    MQ.StaticMath($(this)[0]).latex($(this).attr("latex"));
  });

  $(".keyboard-latex").each(function(i){
    MQ.StaticMath($(this)[0],{});
  });

  //setting the mathfields for the warning message box
  MessageBoxMathFields.question.m1 = MQ.StaticMath($("#question-box-static-mathfield")[0]);
  MessageBoxMathFields.warning.m1 = MQ.StaticMath($("#warning-box-undefined-vars")[0]);

  $('.tabs').tabs();
  $("#modal_define_variable, #modal-physics-equation-more-information, #modal_import_mechanics_variable_definition").modal();
  $('.collapsible').collapsible();
  $("#physics_equations .collapsible").collapsible({
    onOpenEnd: function(){
      //there are some equations that are too long to fit into the space alotted so I am finding them and making their font size a bit smaller so they don't overlap into other equations
      $("#physics_equations .static-physics-equation").each(function(){
        //console.log($(this)[0].getBoundingClientRect(), $(this).parent(".col")[0].getBoundingClientRect());
        if($(this).width() > $(this).parent(".col").width()){
          $(this).css("font-size","13px");
        }
      });
    }
  });
  $('.tooltipped').tooltip();
  $('#side-nav-editor-log').sidenav({
    edge: 'right',
    preventScrolling: false,
  });

  $("#equations_container").height($(window).height() - 64);
  $("#physics_equations").height($(window).height() - $("#physics_equations").offset().top - 70);
  $("#physics_constants").height($(window).height() - $("#physics_constants").offset().top - 100);
  $("#my_variables").height($(window).height() - $("#my_variables").offset().top - 100);

  $("#my_variables .collection-item").hover(function(){
    $("#my_variables .collection-item").removeClass('active');
    $(this).addClass('active');
  },function(){
    $(this).removeClass('active');
  });

  $(".physics-constant-checkbox-span").each(function(){
    $(this).click(function(){
      CheckIfPhysicsConstantCheckboxIsDisabled($(this));
    });
  });

  $(".physics-constant-checkbox-input").each(function(i){
    $(this).change(function(){
      TogglePhysicsConstant($(this), i);
    });
  });

  AutoGeneratedUnitData = GenerateAutoCompleteData();

  $('#input-units-autocomplete').autocomplete({
    data: AutoGeneratedUnitData,
    onAutocomplete: function(){
      CheckUnitsValue();
      CheckModalForm();
    }
  });

  $("#first_math_field").click(function(){
    FocusedMathFieldId = $(this).attr("id");
    SetMathFieldsUI();
  });

  $("#input-units-autocomplete").on("input",function(){
    CheckUnitsValue();
    CheckModalForm();
  });

  $("#variable_description_menu").hover(function(){
    HoveringOverVariableDescriptionMenu = true;
  },function(){//hover out
    HoveringOverVariableDescriptionMenu = false;
    HideSelectionMenu();
  });

  $("#btn_udpate_variable_definition").click(UpdatedVariableDefinition);

  $(document).mousedown(function(){
    MOUSEDOWN = true;
  }).mouseup(function(){
    MOUSEDOWN = false;
  });


  $(".my_math_field").click(function(){
    FocusedMathFieldId = $(this).attr("id");
  });

  $("#edit_variable_description").click(function(){
    OpenDefineVariableModal({init: true});
  });

  $("#math_field_editor_container").css("height",`${window.innerHeight - $("#math_field_editor_container").offset().top}px`);
  RecalculateHeightOfLineEmptySpace();
  $("#my_variables-collection-container").css("height",`${window.innerHeight - $("#my_variables-collection-container")[0].getBoundingClientRect().top}px`);

  $("#editor-log-container .collapsible .collapsible-body.information-container").css("max-height",`${window.innerHeight - $("#editor-log-container .collapsible.log-container").height()}px`);

});
