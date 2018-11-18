var ADMIN = {
  GLOBAL_FILE: "",
  NEW_TOVAR: false,
  EDIT_TYPE: '',
  EDIT_AI_SELECT: 0,
  EDIT_IMAGE: '',
  URL_VAL: '',
  REMOVE_CATEGORY:function(a,b){
    var isAdmin = confirm("Вы действительно хотите удалить категорию '"+b+"' ?\n(востановление категории будет невозможно, а все товары находяциеся в ней нужно будет переносить в другую категорию!)");
    if(isAdmin){
      $.post("/removecategory",{index: a},(res) => {
        console.log(res);
      })
    };
  },
  SAVE_NEW_CATEGORY: function(){
    ADMIN.CONSOLE_TO_MESSAGE(false);
    var nc = {
      cat_name_ru: $("#newCatNameRU").val(),
      cat_name_ua: $("#newCatNameUa").val(),
      // identificator: $("#IDENTIFICATOR_NEW_CAT").val(),
      test_url: $("#test_url").val()
    };
    $.post("/addCategory",nc, (res) => {
      ADMIN.CONSOLE_TO_MESSAGE(res);
    });
  },
  NEW_CATEGORY: function(){
    // ADMIN.CONSOLE_TO_MESSAGE(false);
    $('#modal-warning').modal('show');
    $.post("/maxAImenu",function(res){
      ADMIN.URL_VAL = "/shop?c="+res.ml
      $("#test_url").val(ADMIN.URL_VAL);
      // ADMIN.CONSOLE_TO_MESSAGE(res);
    });
  },
  CONSOLE_TO_MESSAGE: function(status){
    if(status === false){
      $('.BIG_LOADER').fadeIn(100);
      $('.wrapper').css({"filter":"blur(3.5px)"});
    }else{
      $('.BIG_LOADER').fadeOut(100);
      $('.wrapper').css({"filter":"blur(0)"});
    }
  },
  SAVE_SOCIALS: function(){
    ADMIN.CONSOLE_TO_MESSAGE(false);
    $.post("/saveSocials",{v: $("#VK").val() , i: $("#INSTA").val() , f: $("#FB").val() }, (res) => {
      ADMIN.CONSOLE_TO_MESSAGE(res);
    });
  },
  TOVAR_VISIBILITY: function(status, ai){

    $.post("/SetStatusVisibile",{a: status,b:ai}, function(res){
      ADMIN.CONSOLE_TO_MESSAGE(res);
    })
  },
  SAVE_NEW_TOVAR:function(){
    ADMIN.CONSOLE_TO_MESSAGE(false);
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
          ADMIN.CONSOLE_TO_MESSAGE(res);
      });
  },
  EDIT_TOVAR: function(ai){

    ADMIN.NEW_TOVAR = false;
    ADMIN.EDIT_AI_SELECT = parseInt(ai);
      $('#modal-info').modal('show')
      $.post('/getAdmTovar',{d:ai},(res) => {
        ADMIN.CONSOLE_TO_MESSAGE(res);
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
      });
  },
  SAVE_LOCAL_TOVAR: function(){
    ADMIN.CONSOLE_TO_MESSAGE(false);
    let RU = {
      btn_shopDetails: $("#btn_shopDetails").val(),
      btn_shopbas: $("#btn_shopbas").val(),
    }
    let UA = {
      btn_shopDetails_ua: $("#btn_shopDetails_ua").val(),
      btn_shopbas_ua: $("#btn_shopbas_ua").val(),
    }

    $.post("/updateLocalTovar",{ru: RU, ua: UA}, (res) => {
      ADMIN.CONSOLE_TO_MESSAGE(res);
    });
  },
  SAVE_LOCAL_INDEX: function(){
    ADMIN.CONSOLE_TO_MESSAGE(false);
    let RU = {
      news_titleNEW_ru: $("#news_titleNEW_ru").val(),
      news_textNEW_ru: $("#news_textNEW_ru").val(),
      news_btnNEW_ru: 'Посмотреть больше',
      about_titleNEW_ru: $("#about_titleNEW_ru").val(),
      about_textNEW_ru: $("#about_textNEW_ru").val(),
      about_btnNEW_ru: "Детальнее",
      newsB_titleNEW_ru: $("#newsB_titleNEW_ru").val(),
      mail_titleNEW_ru: $("#mail_titleNEW_ru").val(),
      mail_textNEW_ru: $("#mail_textNEW_ru").val(),
      mail_btnNEW_ru: 'Отправить сообщение'
    }
    let UA = {
      news_titleNEW_ua: $("#news_titleNEW_ua").val(),
      news_textNEW_ua: $("#news_textNEW_ua").val(),
      news_btnNEW_ua: 'Подивитись більше',
      about_titleNEW_ua: $("#about_titleNEW_ua").val(),
      about_textNEW_ua: $("#about_textNEW_ua").val(),
      about_btnNEW_ua: 'Детальніше',
      newsB_titleNEW_ua: $("#newsB_titleNEW_ua").val(),
      mail_titleNEW_ua: $("#mail_titleNEW_ua").val(),
      mail_textNEW_ua: $("#mail_textNEW_ua").val(),
      mail_btnNEW_ua: 'Відправити повідомлення',
    }

    $.post("/updateLocal",{ru: RU, ua: UA}, (res) => {
      ADMIN.CONSOLE_TO_MESSAGE(res);
    });
  },
  SITE_STATUS: function(s){
    ADMIN.CONSOLE_TO_MESSAGE(false);
    $.post("/siteStatus",{status: s}, (res) => {
      ADMIN.CONSOLE_TO_MESSAGE(res);
    })
  },
  SAVE_TITLE: function(){
    ADMIN.CONSOLE_TO_MESSAGE(false);
    var T = {
      title_ua: $("#edit_title_ua").val(),
      title_ru: $("#edit_title_ru").val()
    };
    $.post("/saveTitle",T,(res) => {
      ADMIN.CONSOLE_TO_MESSAGE(res);
    });
  },
  CHANGE_TYPE: function(){
    $.post("/getMenu",{c: $("#tCategories").val()},(res) => {
      $("#tType option").remove();
      ADMIN.CONSOLE_TO_MESSAGE(res);
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

        $('#modal-info').modal('hide')
        $("#tName,#tPrice,#tCategories,#tType,#tText,#tText_ua,#tName_ua").val("");
      break;
      case 1:
        $("#EDIT_MODAL_OF_CATEGORY").fadeOut(100);
        $("#TPlinkName_RU,#TPlinkName_UA").val("");
      break;
    }

  },
  CHART_SALES_STATISTICS: function(){
    $.post('/getCounters',function(res){

      var countdata = res.counters_data;
      var line_chart = [];
      for(let i = 0; i < countdata.length; i++){
        line_chart.push({date: countdata[i].date, value: countdata[i].list.length });
      }
      $("#line-chart").empty();
      var line = new Morris.Line({
        element          : 'line-chart',
        resize           : true,
        data             : line_chart,
        xkey             : 'date',
        ykeys           : ['value'],
        labels           : ['Value'],
        lineColors       : ['#000'],
        lineWidth        : 2,
        hideHover        : 'auto',
        gridTextColor    : '#fff',
        gridStrokeWidth  : 0.4,
        pointSize        : 4,
        pointStrokeColors: ['#efefef'],
        gridLineColor    : '#efefef',
        gridTextFamily   : 'Open Sans',
        gridTextSize     : 10
      });
      line.redraw();
    });
    $("#revenue-chart").empty();
    let revenue = Morris.Area({
      element   : 'revenue-chart',
      resize    : true,
      data      : [
        { y: '2018 Q1', item1: 1 },
        { y: '2018 Q2', item1: 10 },
        { y: '2018 Q3', item1: 22 },
        { y: '2018 Q4', item1: 18 },
        { y: '2018 Q5', item1: 28 },
        { y: '2018 Q5', item1: 28 },
        { y: '2018 Q5', item1: 28 },
      ],
      xkey      : 'y',
      ykeys     : ['item1'],
      labels    : ['Item 1'],
      lineColors: ['#a0d0e0'],
      hideHover : 'auto'
    });
    revenue.redraw()


  },
  BUTTONS: function(){
    $('.miniClick').click(function(){
      var ind = $('.miniClick').index(this);
      localStorage.setItem("vernissage_miniClick", ind);
    });

    $('.treeview').click(function(){
      var ind = $('.treeview').index(this);
      localStorage.setItem("vernissage_treeview", ind);
    });

    $("#IDENTIFICATOR_NEW_CAT").on('keyup', function(){
      $("#test_url").val(ADMIN.URL_VAL+ "," + $("#IDENTIFICATOR_NEW_CAT").val());
    });
    $(".text-muted").click(function(){
      var a = $(this).offset();
      $(".li_vipadayka").css({
        "right":"11px",
        "top": a.top + 40 + "px"
      }).fadeIn(300);
    });
    $(".miniClick").click(function(){
      let index = $(".miniClick").index(this);
      $(".miniClick").removeClass("active");
      $(".miniClick:eq("+index+")").addClass("active");

      $(".pageOfPanel").removeClass("pageActive");
      $(".pageOfPanel:eq("+index+")").addClass("pageActive");
    });
  },
  SCRIPTS:function(){
    if(localStorage.getItem("vernissage_treeview") && localStorage.getItem("vernissage_treeview") >= 0){
       $('.treeview:eq('+parseInt(localStorage.getItem("vernissage_treeview"))+')').addClass("menu-open");
       $('.treeview:eq('+parseInt(localStorage.getItem("vernissage_treeview"))+') .treeview-menu').show();
       $('.miniClick:eq('+parseInt(localStorage.getItem("vernissage_miniClick"))+')').click().addClass("active");
       $('.pageOfPanel:eq('+parseInt(localStorage.getItem("vernissage_miniClick"))+')').addClass("pageActive");

    }
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
        // $("#visiblelogo").css({"background-image":" url(../../../image/loaders/load.gif)"});
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
                  $("#vis_logo").attr("src", res.img);
                });
            };
            reader.readAsDataURL(this.files[0]);
        }
      }, false);

      $('#example1').DataTable({
        'paging'      : true,
        'lengthChange': true,
        'searching'   : true,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : true
      });
  },
  GET_CPU: function(){

    /*
    * Flot Interactive Chart
    * -----------------------
    */
    // We use an inline data source in the example, usually data would
    // be fetched from a server
    var data = [], totalPoints = 100

    function getRandomData() {

    if (data.length > 0)
    data = data.slice(1)

    // Do a random walk
    while (data.length < totalPoints) {

    var prev = data.length > 0 ? data[data.length - 1] : 50,
    y    = prev + Math.random() * 10 - 5

    if (y < 0) {
    y = 0
    } else if (y > 100) {
    y = 100
    }

    data.push(y)
    }

    // Zip the generated y values with the x values
    var res = []
    for (var i = 0; i < data.length; ++i) {
    res.push([i, data[i]])
    }

    return res
    }

    var interactive_plot = $.plot('#interactive', [getRandomData()], {
      grid  : {
        borderColor: '#f3f3f3',
        borderWidth: 1,
        tickColor  : '#f3f3f3'
      },
      series: {
        shadowSize: 0, // Drawing is faster without shadows
        color     : '#3c8dbc'
      },
      lines : {
        fill : true, //Converts the line chart to area chart
        color: '#3c8dbc'
      },
      yaxis : {
        min : 0,
        max : 100,
        show: true
      },
      xaxis : {
        show: true
      }
    })

    var updateInterval = 500 //Fetch data ever x milliseconds
    var realtime       = 'on' //If == to on then fetch data every x seconds. else stop fetching
    function update() {

    interactive_plot.setData([getRandomData()])

    // Since the axes don't change, we don't need to call plot.setupGrid()
    interactive_plot.draw()
    if (realtime === 'on')
    setTimeout(update, updateInterval)
    }

    //INITIALIZE REALTIME DATA FETCHING
    if (realtime === 'on') {
    update()
    }
    //REALTIME TOGGLE
    $('#realtime .btn').click(function () {
    if ($(this).data('toggle') === 'on') {
    realtime = 'on'
    }
    else {
    realtime = 'off'
    }
    update()
    })

  }
};

$(document).ready(function(){
  ADMIN.BUTTONS();
  ADMIN.SCRIPTS();
  ADMIN.CHART_SALES_STATISTICS();
  ADMIN.GET_CPU();
});
