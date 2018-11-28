'use strict';
var BASKET = [];
var Oplata = {
    ML:"",
    UPDATE_BASCET: function(){

      $("#CityOfDost,#CityOfPostNP").fadeIn(300);
      $("#input-PaymentCity").val("").attr("disabled",false);
      $("#CityOfDost label").show();


      $('.basket_doc').remove();
      $("#basketDATA").fadeIn(300);
      $("body").css({"overflow":"hidden"});
      $.post('/getbasket',{data:BASKET},function(tovar){
        console.log(tovar)
        $("#JSTOVAR").val(JSON.stringify(tovar.tovar));
        $("#input-PaymentPhone").mask("+38(099) 999-9999");
        var summa = 0;
        for(let i = 0; i < tovar.tovar.length; i++){
          var newDiv = document.createElement("div");
          newDiv.className = "basket_doc";
          $(".basket_tovar .BSK").append(newDiv)
          summa = summa + parseFloat(tovar.tovar[i].price);
          var minBasImg = document.createElement("div");
          minBasImg.style.backgroundImage = "url(../../../data/tovar/"+tovar.tovar[i].image[0]+")";
          minBasImg.className = "minBasImg";

          var minBasTitle = document.createElement("div");
          minBasTitle.innerHTML = tovar.tovar[i].title;
          minBasTitle.className = "minBasTitle";

          var minAllSum = document.createElement("div");
          minAllSum.innerHTML = tovar.tovar[i].price + " ГРН";
          minAllSum.className = "minAllSum";

          var minBasLength = document.createElement("div");
          minBasLength.className = "minBasLength";

          var minBasDel = document.createElement("div");
          minBasDel.onclick = function(){
            let index = $(".minBasDel").index(this);
            BASKET.splice(index, 1);
            localStorage.setItem("VernissageBasket", BASKET);
            $(".basketBlock span").html(BASKET.length);
            $(this).parent().remove();

            if(BASKET.length === 0){
              $(".backet_load").show();
              $("body").css({"overflow":"auto"});
              $("#basketDATA").fadeOut(300);
            }
          };
          minBasDel.className = "minBasDel";

          $(newDiv).append(minBasImg);
          $(newDiv).append(minBasTitle);
          $(newDiv).append(minAllSum);
          $(newDiv).append(minBasLength);
          $(newDiv).append(minBasDel);

          var inplen = document.createElement("input");
          inplen.className = "InputLength";
          inplen.type = "number"
          inplen.value = 1;
          $(minBasLength).append(inplen)
        }
        $(".allSum").html(summa + ' ГРН');
        $(".bubbly-button").html('');
        $(".bubbly-button").html("Оплатить товар на сумму: " + summa + ' ГРН');

        $(".backet_load").hide();
      });
    },
   DESIGHN: function(){
     $(".basketBlock").click(function(){
       if(BASKET.length >= 1){
         Oplata.UPDATE_BASCET();
       }else{
         createAlert('','','Ваша корзина пуста :(','warning',false,true,'pageMessages')
       }
     });
     $(".searchBlock").hover(function(){
       $(".searchLine").css({"width":"170px"});
     });

     $(".basket_close").click(function(){
       $(".backet_load").show();
       $("body").css({"overflow":"auto"});
       $("#basketDATA").fadeOut(300);
     });

     // $('.menu-wrapper').on('click', function() {
     //   $('.hamburger-menu').toggleClass('animate');
     //   $('.twoLine').toggleClass('openMenuClass');
     //   $(".menu_data").hide();
     // })

    $( ".menuBTN" ).hover(function() {
      try{
        $("."+Oplata.ML+",.opensMenu").hide();
      }catch(e){
        console.warn('Есть небольшой конфликт, но это не критично')
      }
      Oplata.ML = $(".menuBTN:eq("+$(".menuBTN").index(this)+")").attr('menu-link');
      if(Oplata.ML != undefined){
        $("."+Oplata.ML+",.opensMenu").show();
      }
    }, function(e){
      Oplata.ML = $(".menuBTN:eq("+$(".menuBTN").index(this)+")").attr('menu-link');
          $( ".opensMenu" ).hover(function() {}, function(e){
                $("."+Oplata.ML+",.opensMenu").hide();
          });
    });


   },
   BASKET: function(){
     if(localStorage.getItem('VernissageBasket') !== null){

       let MY = localStorage.getItem("VernissageBasket").split(",");
       if(MY[0] !== ""){
         $(".basketBlock span").html(MY.length);
         BASKET = MY;
       }
     }
   },
   INIT: function(){
    Oplata.DESIGHN();
   }
}

$(document).ready(() => {
  Oplata.INIT();
  Oplata.BASKET();
});
$(document).ready(function(){


  $("img").height($(".main-box").height());

  $(".to-signin").on("click", function () {
    $(this)
      .addClass("top-active-button")
      .siblings()
      .removeClass("top-active-button");
    $(".form-signup").slideUp(500);
    $(".form-signin").slideDown(500);
  });

  $(".to-signup").on("click", function () {
    $(this)
      .addClass("top-active-button")
      .siblings()
      .removeClass("top-active-button");
    $(".form-signin").slideUp(500);
    $(".form-signup").slideDown(500);
  });

  $(".to-signin-link").on("click", function () {
    $(".to-signin")
      .addClass("top-active-button")
      .siblings()
      .removeClass("top-active-button");
    $(".form-signup").slideUp(200);
    $(".form-signin").slideDown(200);
  });

  $(".to-signup-link").on("click", function () {
    $(".to-signup")
      .addClass("top-active-button")
      .siblings()
      .removeClass("top-active-button");
    $(".form-signin").slideUp(200);
    $(".form-signup").slideDown(200);
  });
});
