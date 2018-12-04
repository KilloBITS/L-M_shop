'use strict';
var BASKET = [];
var toPage;


var Index = {
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
         minBasImg.style.backgroundImage = "url(../../../data/tovar/" + tovar.tovar[i].image[0]+")";
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
     $(".filtersBtn").click(function(){
       if($(".filtersBtn").hasClass('activeFilter')){
         $(".filtersBtn").removeClass('activeFilter');
         $(".filters").slideToggle();
       }else{
         $(".filtersBtn").addClass('activeFilter');
         $(".filters").slideToggle();
       }
     });

     $(".half,.full").click(function(){
       var tovID = $(this).attr("tovid");
       var setStar = $(this).attr("for").split('_')[0].replace(/[^-0-9]/gim,'');
       console.log(tovID);
       console.log(setStar);

       $.post("/setStars",{id: tovID, ss: setStar},function(d){
         console.log(d)
       });
     });

     $(".basketBlock").click(function(){
       if(BASKET.length >= 1){
         Index.UPDATE_BASCET();
       }else{
         createAlert('','','Ваша корзина пуста :(','warning',false,true,'pageMessages')
       }

     });

     $(".basket_close").click(function(){
       $(".backet_load").show();
       $("body").css({"overflow":"auto"});
       $("#basketDATA").fadeOut(300);
     });

     $( document ).ready(function() {
       $(".input-login").each(function() {
         if ($(this).val() != "") {
           $(this).parent().addClass("animation");
         }
       });
     });

     //Add animation when input is focused
     $(".login-input").focus(function(){
       $(this).parent().addClass("animation animation-color");
     });

     //Remove animation(s) when input is no longer focused
     $(".login-input").focusout(function(){
       if($(this).val() === "")
         $(this).parent().removeClass("animation");
       $(this).parent().removeClass("animation-color");
     })


     $(".btn-success").click(function(){

     });

     $(document).ready(function() {
         $('#list').click(function(event){
           event.preventDefault();
           $('#products .item').addClass('list-group-item');
         });
         $('#grid').click(function(event){
           event.preventDefault();
           $('#products .item').removeClass('list-group-item');
           $('#products .item').addClass('grid-group-item');
         });
     });

     // $('.menu-wrapper').on('click', function() {
     //   $('.hamburger-menu').toggleClass('animate');
     //   $('.twoLine').toggleClass('openMenuClass');
     //   $(".menu_data").hide();
     // })

     $( ".menuBTN" ).hover(function() {
       try{
         $("."+Index.ML+",.opensMenu").hide();
       }catch(e){
         console.warn('Есть небольшой конфликт, но это не критично')
       }
       Index.ML = $(".menuBTN:eq("+$(".menuBTN").index(this)+")").attr('menu-link');
       if(Index.ML != undefined){
         $("."+Index.ML+",.opensMenu").show();
       }
     }, function(e){
       Index.ML = $(".menuBTN:eq("+$(".menuBTN").index(this)+")").attr('menu-link');
           $( ".opensMenu" ).hover(function() {}, function(e){
                 $("."+Index.ML+",.opensMenu").hide();
           });
     });
   },
   TOVAR_CONSTRUCTOR: function(dataARR){
     console.log(dataARR)
   },
   LOAD_TOVAR: function(filter){
     if(filter){
       $.post('/tovar',filter,function(tov){
         Index.TOVAR_CONSTRUCTOR(tov);
       });
     }else{
       $.post('/tovar',function(tov){
         Index.TOVAR_CONSTRUCTOR(tov);
       });
     }
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
   setBasket: function(ind, btn){
     if(BASKET.indexOf(ind.toString()) === -1){
       BASKET.push(ind);
       localStorage.setItem("VernissageBasket", BASKET);

       var URL = $(".list-group-image:eq("+btn+")").attr('src');
       var neAnimation = document.createElement('div');
       neAnimation.className = 'neAnimation';
       neAnimation.style.left = $(".list-group-image:eq("+btn+")").offset().left + 'px';
       neAnimation.style.top = $(".list-group-image:eq("+btn+")").offset().top + 'px';
       neAnimation.style.width = $(".list-group-image:eq("+btn+")").width() + 'px';
       neAnimation.style.height = $(".list-group-image:eq("+btn+")").height()  + 'px';
       neAnimation.style.backgroundImage = 'url('+URL+')';
       $('body').append(neAnimation);

       setTimeout(function(){
         neAnimation.style.left = $(".basketBlock").offset().left + 'px';
         neAnimation.style.top = $(".basketBlock").offset().top + 'px';
         neAnimation.style.width = '30px';
         neAnimation.style.height = '30px';
         setTimeout(function(){
           $(neAnimation).fadeOut(300)
         },350);
       },500);


       $(".basketBlock span").html(BASKET.length);
       $(".getSuccess:eq("+btn+")").fadeIn(300);

       $(".basketBlock").css({
         "width": "32px",
         "height": "32px"
       });

       setTimeout(function(){
         $(".basketBlock").css({
           "width": "26px",
           "height": "26px"
         });
       },300);

       setTimeout(function(){
         $(".getSuccess:eq("+btn+")").fadeOut(300);
       },2000);
     }else{
       $(".getError:eq("+btn+")").fadeIn(300);
       setTimeout(function(){
         $(".getError:eq("+btn+")").fadeOut(300);
       },2000);
       createAlert('','','Такой товар уже есть в вашей корзине!','warning',false,true,'pageMessages');
     }
   },
   INIT: function(){
    Index.DESIGHN();
    Index.LOAD_TOVAR(false);
    Index.BASKET();
   }
}

$(document).ready(() => {
  Index.INIT();
});
