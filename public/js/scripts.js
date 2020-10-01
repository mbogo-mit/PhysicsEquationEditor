$(document).ready(function(){


  $("#determinate-loader").css("width","100%");

  ListOfPhysicsConstants = JSON.parse($("#main-screen").attr("lopc"));

  setTimeout(function(){
    if((function() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    })()){
      $("#loading-screen span").html("Please use desktop browser. Cannot load in mobile")
    }else{
      //we need to intialize user data if there is any to init
      InitEditorWithEditorData();
      $("#loading-screen").animate({
        opacity: 0.0
      },500,function(){
        $(this).css("display","none");
      });
    }
    
  },2000);

  window.onbeforeunload = function (e) {
    if(SaveEditorData){
      SaveEditorDataToLocalStorage();
    }else{
      localStorage.removeItem("editor-data");
    }
    
  };


  $(".static-physics-equation").each(function(i){
    MQ.StaticMath($(this).get(0)).latex($(this).attr("latex"));
  });

  $(".keyboard-latex").each(function(i){
    MQ.StaticMath($(this).get(0),{});
  });

  //setting the mathfields for the warning message box
  MessageBoxMathFields.question.m1 = MQ.StaticMath($("#question-box-static-mathfield")[0]);
  MessageBoxMathFields.warning.m1 = MQ.StaticMath($("#warning-box-undefined-vars")[0]);

  $('.tabs').tabs();
  $('.dropdown-trigger').dropdown();

  $("#modal-physics-equation-more-information, #modal-user-guide, #modal-create-custom-unit, #promo-video-modal").modal();
  $("#modal_import_variable_definition").modal({
    onOpenStart: function(){
      $("#btn-update-imported-variables").addClass("disabled");
    },
  });
  $("#modal-create-custom-unit").modal({
    onOpenEnd: function(){
      // copying whatever the user wrote in the units dropdown into the custom si units modal
      $("#input-custom-unit").val($("#input-user-units-search").val());
      // focusing on the input so the user can get to editing and creating the custom unit
      $("#input-custom-unit").focus();
      ParseAndRenderCustomUnit();
    },
  });

  $('.collapsible').collapsible();
  $("#physics_equations .collapsible").collapsible({
    onOpenEnd: function(){
      //there are some equations that are too long to fit into the space alotted so I am finding them and making their font size a bit smaller so they don't overlap into other equations
      $("#physics_equations .collapsible li.active .static-physics-equation").each(function(){
        //console.log($(this).width(), $(this).parent(".col").width());
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

  $(document).mousedown(function(){
    MOUSEDOWN = true;
  }).mouseup(function(){
    MOUSEDOWN = false;
  });


  $(".my_math_field").click(function(){
    FocusedMathFieldId = $(this).attr("id");
  });

  $("#math_field_editor_container").css("height",`${window.innerHeight - $("#math_field_editor_container").offset().top}px`);
  RecalculateHeightOfLineEmptySpace();
  $("#my_variables-collection-container").css("height",`${window.innerHeight - $("#my_variables-collection-container")[0].getBoundingClientRect().top}px`);

  $("#editor-log-container .collapsible .collapsible-body.information-container").css("max-height",`${window.innerHeight - $("#editor-log-container .collapsible.log-container").height()}px`);

  //when user is searching for units in the units dropdown
  $("#input-user-units-search").on("input",function(){
    RenderSIUnitsSearch();
  });

  $("#input-custom-unit").on("input",function(){
    ParseAndRenderCustomUnit();
  });

  $("#main-screen").click(function(e){
    MainScreenClicked(e);
  });

  $(".variable-checkbox").change(function(){
    $("#btn-update-imported-variables").removeClass("disabled");
  });


  //adding event listener to physics equation headers so  that when they are mouseovered or mouse we can show or hide the informational videos accordingly
  $(".static-physics-equation-header").mouseout(function(e){
    let id = $(this).attr("infoId");
    if($(e.relatedTarget).attr("id") != id && $(`#${id}`).find(e.relatedTarget).length == 0){
      HideInfoPopup(id);
    }
  }).mouseover(function(){
    if($(this).attr("info") != undefined){
      let id = $(this).attr("infoId");
      if($(`#${id}.more-information-videos-container`).length == 0){
        //this means that more information Popup hasn't been created so we will create it
        CreateInfoPopup(id, JSON.parse($(this).attr("info")));
      }
      DisplayInfoPopup(id, $(this).children('span')[0].getBoundingClientRect());
    }
    
  });

  $(".static-physics-equation-header > span").mouseout(function(e){
    //if we mouseout into the spans parent we don't care but if we mouse out into something else then we do care
    if(!$(e.relatedTarget).hasClass("static-physics-equation-header")){
      HideInfoPopup($(this).parent(".static-physics-equation-header").attr("infoId"));
    }
  }).mouseover(function(){
    let el = $(this).parent(".static-physics-equation-header");
    if(el.attr("info") != undefined){
      let id = el.attr("infoId");
      if($(`#${id}.more-information-videos-container`).length == 0){
        //this means that more information Popup hasn't been created so we will create it
        CreateInfoPopup(id, JSON.parse(el.attr("info")));
      }
      DisplayInfoPopup(id, $(this).get(0).getBoundingClientRect());
    }
  });

});
