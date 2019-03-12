'use strict';
var BASKET = [];
var toPage;


var Index = {
   DESIGHN: function(){


      $(document).ready(function(){

        $(".dropdown").click(function(){
          $(".menu").toggleClass("showMenu");
            $(".menu > li").click(function(){
              $(".dropdown > p").html($(this).html());
                $(".menu").removeClass("showMenu");
            });
        });

      });

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
   INIT: function(){
    Index.DESIGHN();
    Index.LOAD_TOVAR(false);
   }
}

$(document).ready(() => {
  Index.INIT();
});
