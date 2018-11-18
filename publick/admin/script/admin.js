var ADMIN = {
  GLOBAL_FILE: "",
  NEW_TOVAR: false,
  EDIT_TYPE: '',
  EDIT_AI_SELECT: 0,
  EDIT_IMAGE: '',
  STATISTIC: function(){
    $("#revenue-chart").empty();
    let aaa = Morris.Area({
      element   : 'revenue-chart',
      resize    : true,
      data      : [
        { y: '2018 Q1', item1: 1 },
        { y: '2018 Q2', item1: 10 },
        { y: '2018 Q3', item1: 22 },
        { y: '2018 Q4', item1: 18 },
        { y: '2018 Q1', item1: 28 },
      ],
      xkey      : 'y',
      ykeys     : ['item1'],
      labels    : ['Item 1'],
      lineColors: ['#a0d0e0'],
      hideHover : 'auto'
    });

    aaa.redraw()
  },

  /* Работа с меню */
  SAVE_NEW_CATEGORIES: function(){
    var NM = {
      name_ru: $("#TPlinkName_RU").val(),
      name_ua: $("#TPlinkName_UA").val()
    }
    $.post("/addCategory", NM, function(res){
      console.log(res)
    })
  },
  /*Работа с товарами*/
  CHANGE_TYPE: function(){
    $.post("/getMenu",{c: $("#tCategories").val()},(res) => {
      $("#tType option").remove();
      console.log(res)
      if(res.menu.podlink.length > 1){
        $("#tType").attr("disabled",false).removeAttr("style")
        for (var i = 0; i < res.menu.podlink.length; i++) {
          var option = document.createElement("option");
          option.value = res.menu.podlink[i].types;
          option.text = res.menu.podlink[i].pname;
          $("#tType").append(option);
        }
        $("#tType").prepend("<option disabled selected>выберите тип</option>");
        if(!ADMIN.NEW_TOVAR){
        // }else{
          $("#tType").val(ADMIN.EDIT_TYPE).change();
        }
      }else{
        $("#tType").attr("disabled",true).css({"background-color":"silver"})
      }
    })
  },
  CANCEL: function(canWin){
    switch(canWin){
      case 0:
        $("#EDIT_MODAL").fadeOut(100);
        $("#tName,#tPrice,#tCategories,#tType,#tText,#tText_ua,#tName_ua").val("");
      break;
      case 1:
      $("#EDIT_MODAL_OF_CATEGORY").fadeOut(100);
      $("#TPlinkName_RU,#TPlinkName_UA").val("");
      break;
    }

  },
  SAVE_GLOBAL: function(){
    let RU = {
      news_titleNEW_ru: $("#news_titleNEW_ru").val(),
      news_textNEW_ru: $("#news_textNEW_ru").val(),
      news_btnNEW_ru: $("#news_btnNEW_ru").val(),
      about_titleNEW_ru: $("#about_titleNEW_ru").val(),
      about_textNEW_ru: $("#about_textNEW_ru").val(),
      about_btnNEW_ru: $("#about_btnNEW_ru").val(),
      newsB_titleNEW_ru: $("#newsB_titleNEW_ru").val(),
      mail_titleNEW_ru: $("#mail_titleNEW_ru").val(),
      mail_textNEW_ru: $("#mail_textNEW_ru").val(),
      mail_btnNEW_ru: $("#mail_btnNEW_ru").val()
    }
    let UA = {
      news_titleNEW_ua: $("#news_titleNEW_ua").val(),
      news_textNEW_ua: $("#news_textNEW_ua").val(),
      news_btnNEW_ua: $("#news_btnNEW_ua").val(),
      about_titleNEW_ua: $("#about_titleNEW_ua").val(),
      about_textNEW_ua: $("#about_textNEW_ua").val(),
      about_btnNEW_ua: $("#about_btnNEW_ua").val(),
      newsB_titleNEW_ua: $("#newsB_titleNEW_ua").val(),
      mail_titleNEW_ua: $("#mail_titleNEW_ua").val(),
      mail_textNEW_ua: $("#mail_textNEW_ua").val(),
      mail_btnNEW_ua: $("#mail_btnNEW_ua").val()
    }

    $.post("/updateLocal",{ru: RU, ua: UA}, (res) => {
      console.log(res);
    });

  },
  SAVE:function(){
    $(".backet_load").fadeIn(100);
      let save_data = {
        title: $("#tName").val(),
        price: $("#tPrice").val(),
        category: parseInt($("#tCategories").val()),
        types: $("#tType").val(),
        text: $("#tText").val(),
        sale: [$("#tSaleEnabled").is(':checked'), $("#tSale").val()]
      };

      let save_data_ua = {
        title: $("#tName_ua").val(),
        price: $("#tPrice").val(),
        category: parseInt($("#tCategories").val()),
        types: $("#tType").val(),
        text: $("#tText_ua").val(),
        sale: [$("#tSaleEnabled").is(':checked'), $("#tSale").val()]
      };

      var url = '/setAdmTovar';

      $.post(url,{ru:save_data, ua:save_data_ua, file: ADMIN.GLOBAL_FILE, te: ADMIN.NEW_TOVAR, ai:ADMIN.EDIT_AI_SELECT},function(res){
          ADMIN.CANCEL();
        $(".backet_load").fadeOut(100);
      });


  },
  REMOVE: function(ai){
    $.post('/delAdmTovar',{d:ai},(res) => {
      if(res.code === 500){
        alert(res.msg)
        $(".tovar-ai-"+ai).remove();
      }else{
        alert("Произошла ошибка");
      }
    });
  },
  EDIT: function(ai){
    ADMIN.NEW_TOVAR = false;
    ADMIN.EDIT_AI_SELECT = parseInt(ai);
    $(".backet_load").fadeIn(100);
    $("#EDIT_MODAL").fadeIn(200);
    $.post('/getAdmTovar',{d:ai},(res) => {
      console.log(res);
      $("#tName").val(res.tovar_ru[0].title);
      $("#tName_ua").val(res.tovar_ua[0].title);

      $("#tCategories").val(res.tovar_ru[0].category).change();
      ADMIN.EDIT_TYPE = res.tovar_ru[0].types;

      $("#tPrice").val(res.tovar_ru[0].price);
      if(res.tovar_ru[0].sale[0]){
        $("#tSaleEnabled").attr("checked",true);
        $("#tSale").val(res.tovar_ru[0].sale[1]).removeAttr("disabled");
      }else{
        $("#tSaleEnabled").removeAttr("checked");
        $("#tSale").val(0).attr("disabled",true);
      }
      /**/
      $("#tImageDemo").attr("src","../../../data/tovar/"+res.tovar_ru[0].image);
      ADMIN.EDIT_IMAGE = res.tovar_ru[0].image;
      $("#tText").val(res.tovar_ru[0].text);
      $("#tText_ua").val(res.tovar_ua[0].text);


      $(".backet_load").fadeOut(300);
    });
  },
  /* Обработчики событий */
  DESIGHN: function(){
    $(".newLinkitem").click(function(){
      // let plink_item = document.createElement("div");
      // plink_item.className = 'plink_item';
      // $("#"+$(this).attr("to-menu")).append(plink_item);
      //
      // let pLink_text = document.createElement("div");
      // pLink_text.innerHTML = '• Введите название';
      // pLink_text.className = 'pLink_text';
      // $(plink_item).append(pLink_text);
      // let plink_delete = document.createElement("div");
      // plink_delete.className = 'plink_delete';
      // $(plink_item).append(plink_delete);
      // let plink_edit = document.createElement("div");
      // plink_edit.className = 'plink_edit';
      // $(plink_item).append(plink_edit);
    });
    $("#newCategoryMenu").click(function(){
      $("#TPlinkName_RU,#TPlinkName_UA").val('');
      $("#EDIT_MODAL_OF_CATEGORY").fadeIn(300);
    });
    $("#selected_tov_image").click(function(){
      $("#tFile").click();
    });
    $("#tSaleEnabled").on("change",function(){
      if($("#tSaleEnabled").is(':checked')){
        $("#tSale").val(0).attr("disabled",false);
      }else{
        $("#tSale").val(0).attr("disabled",true);
      }
    });
    $(".mini_load_demo").click(function(){
      let index = $('.mini_load_demo').index(this);
      $.post("/updateLoader",{i:index},(res) => {
        $("#newLoaders").css({"background-image":"url(../../../image/loaders/load"+index+".gif)"});
        $("#selectLoaders").click();
      })
    });
    $("#sendNewLogo").click(function(){
      $("#newLogotype").click();
    });
    $("#selectLoaders").click(function(){
      $(".list_loaders").toggle();
    });
  	$('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function(){
  		$(this).toggleClass('open');
  	});
    $("#newTovar").click(function(){
      $("#EDIT_MODAL").fadeIn(200);
      $("#tImageDemo").attr("src","data:image/png;base64,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")
      ADMIN.NEW_TOVAR = true;
    });
    $('.menu_btn').click(function(){
      let index = $('.menu_btn').index(this);
      localStorage.setItem("click_menu",index);
      $("#pageMenu_list").css({"height":"0px"});
      $('.menu_btn').removeClass("btnact");
      $('.menu_btn:eq('+index+')').addClass("btnact");
      $('.page,.page-min').removeClass("active");
      $('.page:eq('+index+')').addClass("active");
    });

    $('.menu_btn_min').click(function(){
      let index = $('.menu_btn_min').index(this);
      localStorage.setItem("click_menu_min",index);
      // $('.menu_btn').removeClass("btnact");
      // $('.menu_btn:eq('+index+')').addClass("btnact");
      $('.page,.page-min').removeClass("active");
      $('.page-min:eq('+index+')').addClass("active");
    });

    $('.mobile_menu').click(function(){
      if(!$('.left_menu').hasClass('active')){
        $('.left_menu').addClass('active');
      }else{
        $('.left_menu').removeClass('active');
      }
    });

    $(".visual").click(function(){
      if($("#pageMenu_list").height() > 10){
        $("#pageMenu_list").css({"height":"0px"});
      }else{
        $("#pageMenu_list").css({"height":"150px"});
      }
    });
    $('#example2').DataTable({
      'paging'      : true,
      'lengthChange': true,
      'searching'   : true,
      'ordering'    : true,
      'info'        : false,
      'autoWidth'   : true
    });
  },
  INIT: function(){
    ADMIN.DESIGHN();
    setInterval(function(){
      ADMIN.STATISTIC();
    },10000);
    $(".menu_btn:eq("+localStorage.getItem("click_menu")+")").click();
  }
};

$(document).ready(function(){
  ADMIN.INIT();
  ADMIN.STATISTIC();
/*Для загрузки изображений в товары*/
  file = document.getElementById('tFile');
  file.addEventListener('change', function () {
    // $("#tImageDemo").css({"background-image":" url(../../../image/loaders/load.gif)"});
    $("#tImageDemo").attr("src","../../../image/loaders/load.gif")
      var fullPath = file.value;
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
          filename = filename.substring(1);
      }

      if (this.files && this.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              ADMIN.GLOBAL_FILE = e.target.result;
              $("#tImageDemo").attr("src",ADMIN.GLOBAL_FILE)
              // $("#tImageDemo").css({"background-image":" url("+ADMIN.GLOBAL_FILE+")"});
          };
          reader.readAsDataURL(this.files[0]);
      }
  }, false);

  /*Для загрузки новой аватарки*/
    newLogotype = document.getElementById('newLogotype');
    newLogotype.addEventListener('change', function () {
      $("#visiblelogo").css({"background-image":" url(../../../image/loaders/load.gif)"});
      var fullPath = newLogotype.value;
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
          filename = filename.substring(1);
      }

      if (this.files && this.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              ADMIN.GLOBAL_FILE = e.target.result;
              $.post('/updateAva',{n: ADMIN.GLOBAL_FILE},(res) => {
                $("#visiblelogo").css({"background-image":" url("+res.img+")"});
              });
          };
          reader.readAsDataURL(this.files[0]);
      }
    }, false);

  $("#profile").click(function () {
      $(".animate-profile").toggle(function () {
      });
  });
  $("#notification").click(function () {
      $(".animate-notification").toggle(function () {
      });
  });
  $(" .filter ").click(function () {
      $(".drop-down-filter").toggle(function () {
      });
  });


});
