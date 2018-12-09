var ML;
$(document).ready(function(){
  $("#setNumber").click(function(){
    $('#loaderNumber').fadeIn(300);
    $.post('/newPartnersNumber',{number: $("#phoneNumMask").val()}, function(res){
      $('#loaderNumber').fadeOut(300);
    });
  });
  $("#phoneNumMask").mask("+38(099) 999-9999");
  $( ".menuBTN" ).hover(function() {
    try{
      $("."+ ML+",.opensMenu").hide();
    }catch(e){
      console.warn('Есть небольшой конфликт, но это не критично')
    }
      ML = $(".menuBTN:eq("+$(".menuBTN").index(this)+")").attr('menu-link');
    if(ML != undefined){
      $("."+ML+",.opensMenu").show();
    }
  }, function(e){
        ML = $(".menuBTN:eq("+$(".menuBTN").index(this)+")").attr('menu-link');
        $( ".opensMenu" ).hover(function() {}, function(e){
              $("."+ML+",.opensMenu").hide();
        });
  });
});
