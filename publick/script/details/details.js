'use strict';
var BASKET = [];


var Details = {
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
      $(".bubbly-button").html("Оплатить товар на сумму: " + summa + ' ГРН');

      $(".backet_load").hide();
    });


  },
  DESIGHN: function(){

    var amount = document.getElementsByClassName('current-amount');
    var changes = document.getElementsByTagName('i');
    function changeAmount() {
      if(this.className.includes('minus') && amount[0].textContent > 0) {
        amount[0].textContent--;
      }else if(this.className.includes('plus')) {
        amount[0].textContent++;
      }
    }
    for(var i = 0; i < 2; i++) {
      changes[i].addEventListener('click', changeAmount, false);
    }

    $(".sizeBTN").click(function(){
      // let id = $(this).attr('id')
      // console.log(id);
      $(".sizeBTN").removeClass('size_a');
      $(this).addClass('size_a');
    });
    $(".btnTableSizes").click(function(){
      $(".content.tovar").css({
        "filter":"blur(5px) grayscale(100%)"
      });
      $("#modalSizes").fadeIn(300);
    });
    $("#closeTableSizes").click(function(){
      $(".content.tovar").css({
        "filter":"blur(0px) grayscale(0%)"
      });
      $("#modalSizes").fadeOut(300);
    });
    $(".imageD").click(function(){
      var index = $(".imageD").index(this);
      var imdData = $(".imageD:eq("+index+")").attr('image-data');
      $(".imageTov").removeClass('ac');
      $(".imageTov:eq("+index+")").addClass('ac');
      console.log(imdData)
      $("#tovarImage").attr('src', imdData)
    });
    $(".setComments").click(function(){
      $.post('/newComment',{text: $("#commentsText").val(), tovai: $("#commentsText").attr("tov_AI") }, function(res){
        console.log(res);
        if(res.code === 500){
          var newCommebtData = '<div class="comment-wrap"> <div class="comment-block"><p class="comment-text">'+res.msg.text+'</p><div class="bottom-comment"><div class="comment-date">'+res.msg.author+'</div></div></div></div>';
          $('.comments .comment-wrap:eq(0)').after(newCommebtData);
          $("#commentsText").val("");
        }else{
          createAlert('','Ошибка 403','нет доступа','success',true,true,'pageMessages');
        }
      });
    });
     $(".half,.full").click(function(){
       var tovID = $(this).attr("tovid");
       var setStar = $(this).attr("for").split('_')[0].replace(/[^-0-9]/gim,'');

       $.post("/setStars",{id: tovID, ss: setStar},function(d){
         createAlert('','Ваш голос принят!','','success',true,true,'pageMessages');
       });
     });
     $(".basketBlock").click(function(){
       if(BASKET.length >= 1){
         Details.UPDATE_BASCET();
       }else{
         createAlert('','','Ваша корзина пуста :(','warning',false,true,'pageMessages')
       }
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
         $("."+Details.ML+",.opensMenu").hide();
       }catch(e){
         console.warn('Есть небольшой конфликт, но это не критично')
       }
       Details.ML = $(".menuBTN:eq("+$(".menuBTN").index(this)+")").attr('menu-link');
       if(Details.ML != undefined){
         $("."+Details.ML+",.opensMenu").show();
       }
     }, function(e){
       Details.ML = $(".menuBTN:eq("+$(".menuBTN").index(this)+")").attr('menu-link');
           $( ".opensMenu" ).hover(function() {}, function(e){
                 $("."+Details.ML+",.opensMenu").hide();
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
  setBasket: function(ind){
     if(BASKET.indexOf(ind.toString()) === -1){
       BASKET.push(ind.toString());
       localStorage.setItem("VernissageBasket", BASKET);
       $(".basketBlock span").html(BASKET.length);

     }else{
       createAlert('','','Такой товар уже есть в вашей корзине!','warning',false,true,'pageMessages');
     }
   },
  INIT: function(){
    Details.DESIGHN();
    Details.BASKET();
   }
}

$(document).ready(() => {
  Details.INIT();



  var mycode = function() {
  var newImage = new Image();
  newImage.onload = function(){
    console.log(newImage.width)
    // $('#canvas').attr('width',newImage.width);
    // $('#canvas').attr('height',newImage.height);

  }
  newImage.src = $('#kitchenSmall').attr('src');


  var pad = scrawl.pad.canvas,
    base = scrawl.cell[pad.base],
    display = scrawl.cell[pad.display],
    canvas = scrawl.canvas[pad.name],
    actionCell,
    hitCell,
    hitGroup,
    magnifier,
    moveMagnifier,
    border = 200,
    here, ratioX, ratioY, x, y,
    offsetX, offsetY,
    currentPin = false,
    choke = true,
    anim;

  scrawl.getImagesByClass('demopic');

  pad.makeCurrent();

  actionCell = pad.addNewCell({
    name: 'demo10_actionCell',
    width: (base.actualWidth + border) * 2,
    height: (base.actualHeight + border) * 2,
    shown: false
  });

  hitCell = pad.addNewCell({
    name: 'demo10_hitCell',
    width: base.actualWidth,
    height: base.actualHeight,
    showOrder: 2
  });
  hitGroup = scrawl.makeGroup({
    name: 'demo10_pins',
    cell: hitCell.name
  });

  scrawl.makePicture({
    name: 'demo10_actionBackground',
    source: 'kitchenLarge',
    copyWidth: '100%',
    copyHeight: '100%',
    pasteWidth: base.actualWidth * 2,
    pasteHeight: base.actualHeight * 2,
    startX: 'center',
    startY: 'center',
    handleX: 'center',
    handleY: 'center',
    group: 'demo10_actionCell',
    order: 0
  });

  scrawl.makePicture({
    name: 'demo10_background',
    source: 'kitchenSmall',
    width: '100%',
    height: '100%',
    globalCompositeOperation: 'destination-over',
    order: 2
  });

  magnifier = scrawl.makePicture({
    name: 'demo10_magnifier',
    source: 'demo10_actionCell',
    copyWidth: base.actualWidth * 2 * 0.15,
    copyHeight: base.actualHeight * 2 * 0.3,
    width: '30%',
    height: '60%',
    handleX: 'center',
    handleY: 'center',
    pivot: 'demo10_magnifierStencil',
    globalCompositeOperation: 'source-in',
    order: 1
  });

  scrawl.makeWheel({
    name: 'demo10_magnifierStencil',
    pivot: 'mouse',
    radius: '15%',
    fillStyle: 'black',
    order: 0
  }).clone({
    name: 'demo10_magnifierOutline',
    pivot: 'demo10_magnifierStencil',
    method: 'draw',
    lineWidth: 2,
    strokeStyle: 'red',
    order: 3
  });



  moveMagnifier = function(e) {
    var testPin;
    if (e.force) {
      pad.render();
    } else {
      here = pad.getMouse();
      if (choke && here.active && !isNaN(here.x)) {
        ratioX = base.actualWidth / display.actualWidth;
        ratioY = base.actualHeight / display.actualHeight;
        x = Math.floor(here.x * ratioX * 2) + border;
        y = Math.floor(here.y * ratioY * 2) + border;
        offsetX = magnifier.get('width') / 2;
        offsetY = magnifier.get('height') / 2;
        magnifier.set({
          copyX: x - offsetX,
          copyY: y - offsetY
        });
        testPin = hitGroup.getEntityAt(here);
        if (testPin) {
          if (currentPin && currentPin.name !== testPin.name) {
            currentPin.set({
              scale: 1
            });
            scrawl.entity[currentPin.name + 'Label'].set({
              visibility: false
            });
          }
          testPin.set({
            scale: 2
          });
          scrawl.entity[testPin.name + 'Label'].set({
            visibility: true
          });
          currentPin = testPin;
        } else {
          if (currentPin) {
            currentPin.set({
              scale: 1
            });
            scrawl.entity[currentPin.name + 'Label'].set({
              visibility: false
            });
            currentPin = false;
          }
        }
        pad.render(here);
        choke = false;
      }
    }
  };

  var myanimation = function() {
    choke = true;
  };

  anim = scrawl.makeAnimation({
    name: 'panel10_animation',
    fn: myanimation
  });

  scrawl.addListener(['move'], function(e) {
    moveMagnifier(e);
  }, canvas);

  scrawl.addListener(['down', 'enter'], function() {
    pad.setDisplayOffsets();
    anim.run();
  }, canvas);

  scrawl.addListener(['up', 'leave'], function() {
    anim.halt();
  }, canvas);

  pad.render();
}

scrawl.loadExtensions({
  minified: true,
  path: 'https://scrawl.rikweb.org.uk/min_5-0-0/',
  extensions: ['images', 'wheel', 'phrase'],
  callback: function() {
    window.addEventListener('load', function() {
      scrawl.init();
      mycode();
    }, false);
  },
});

});
