
'use strict';
var Index = {
  ML: "",
  getCounters: true,
  DESIGHN: function() {
    $(window).scroll(function(){
      $(".arrowsss").css("opacity", 1 - $(window).scrollTop() / 250);
    });

    if($(window).width() < 800){
      $(".header").height($(window).height() - 50 + 'px')
    }


    $(".searchBlock").hover(function() {
      $(".searchLine").css({
        "width": "170px"
      });
    });

    $("#SEARCH").on("keyup", function() {
      if ($("#SEARCH").val().length > 3) {
        $(".search_result").fadeIn(150);
        $.post("/search", {
          name: $("#SEARCH").val()
        }, function(result) {
          console.log(JSON.parse(result.searchResult));
        });
      } else {
        $(".search_result").fadeOut(150);
      }
    });

    $('body').click(function(e) {
      if (e.target.className != 'searchBlockVal' && $('#SEARCH').val().length === 0) {
        $(".searchLine").css({
          "width": "0px"
        });
      }
    });

    $(".menuBTN").hover(function() {
      try {
        $("." + Index.ML + ",.opensMenu").hide();
      } catch (e) {
        console.warn('Есть небольшой конфликт, но это не критично')
      }
        Index.ML = $(".menuBTN:eq(" + $(".menuBTN").index(this) + ")").attr('menu-link');
        if (Index.ML != undefined) {
          $("." + Index.ML + ",.opensMenu").show();
        }



    }, function(e) {
      Index.ML = $(".menuBTN:eq(" + $(".menuBTN").index(this) + ")").attr('menu-link');
      $(".opensMenu").hover(function() {}, function(e) {
        $("." + Index.ML + ",.opensMenu").hide();
      });
    });



    var $slider = $(".slider"),
      $slideBGs = $(".slide__bg"),
      diff = 0,
      curSlide = 0,
      numOfSlides = $(".slide").length - 1,
      animating = false,
      animTime = 500,
      autoSlideTimeout,
      autoSlideDelay = 15000,
      $pagination = $(".slider-pagi");

    function createBullets() {
      for (var i = 0; i < numOfSlides + 1; i++) {
        var $li = $("<li class='slider-pagi__elem'></li>");
        $li.addClass("slider-pagi__elem-" + i).data("page", i);
        if (!i) $li.addClass("active");
        $pagination.append($li);
      }
    };

    createBullets();

    function manageControls() {
      $(".slider-control").removeClass("inactive");
      if (!curSlide) $(".slider-control.left").addClass("inactive");
      if (curSlide === numOfSlides) $(".slider-control.right").addClass("inactive");
    };

    function autoSlide() {
      autoSlideTimeout = setTimeout(function() {
        curSlide++;
        if (curSlide > numOfSlides) curSlide = 0;
        changeSlides();
      }, autoSlideDelay);
    };

    autoSlide();

    function changeSlides(instant) {
      if (!instant) {
        animating = true;
        manageControls();
        $slider.addClass("animating");
        $slider.css("top");
        $(".slide").removeClass("active");
        $(".slide-" + curSlide).addClass("active");
        setTimeout(function() {
          $slider.removeClass("animating");
          animating = false;
        }, animTime);
      }
      window.clearTimeout(autoSlideTimeout);
      $(".slider-pagi__elem").removeClass("active");
      $(".slider-pagi__elem-" + curSlide).addClass("active");
      $slider.css("transform", "translate3d(" + -curSlide * 100 + "%,0,0)");
      $slideBGs.css("transform", "translate3d(" + curSlide * 50 + "%,0,0)");
      diff = 0;
      autoSlide();
    }

    function navigateLeft() {
      if (animating) return;
      if (curSlide > 0) curSlide--;
      changeSlides();
    }

    function navigateRight() {
      if (animating) return;
      if (curSlide < numOfSlides) curSlide++;
      changeSlides();
    }

    $(document).on("mousedown touchstart", ".slider", function(e) {
      if (animating) return;
      window.clearTimeout(autoSlideTimeout);
      var startX = e.pageX || e.originalEvent.touches[0].pageX,
        winW = $(window).width();
      diff = 0;

      $(document).on("mousemove touchmove", function(e) {
        var x = e.pageX || e.originalEvent.touches[0].pageX;
        diff = (startX - x) / winW * 70;
        if ((!curSlide && diff < 0) || (curSlide === numOfSlides && diff > 0)) diff /= 2;
        $slider.css("transform", "translate3d(" + (-curSlide * 100 - diff) + "%,0,0)");
        $slideBGs.css("transform", "translate3d(" + (curSlide * 50 + diff / 2) + "%,0,0)");
      });
    });

    $(document).on("mouseup touchend", function(e) {
      $(document).off("mousemove touchmove");
      if (animating) return;
      if (!diff) {
        changeSlides(true);
        return;
      }
      if (diff > -8 && diff < 8) {
        changeSlides();
        return;
      }
      if (diff <= -8) {
        navigateLeft();
      }
      if (diff >= 8) {
        navigateRight();
      }
    });

    $(document).on("click", ".slider-control", function() {
      if ($(this).hasClass("left")) {
        navigateLeft();
      } else {
        navigateRight();
      }
    });

    $(".nextSliderBtn").click(function(){
      navigateRight();
    });
    $(".prevSliderBtn").click(function(){
      navigateLeft();
    });

    $(document).on("click", ".slider-pagi__elem", function() {
      curSlide = $(this).data("page");
      changeSlides();
    });
    var STC;
    // $(document).scroll(function (event) {
    // var scroll = $(document).scrollTop();
    //     if(scroll >= 1000 && Index.getCounters){
    //       Index.getCounters = false;
    $.post('/counters', function(res){
      $(".counters_length:eq(0)").html(417)
      $(".counters_length:eq(1)").html(res.b)
      $(".counters_length:eq(3)").html(res.d)
      $(".counters_length:eq(2)").html(385)
      $("#products2").html(res.b)
    });
    //     }
    // });
  },
  INIT: function() {
    Index.DESIGHN();
  }
}

$(document).ready(function() {
  Index.INIT();
});



/*
 2017 Julian Garnier
 Released under the MIT license
*/
setTimeout(function(){
  $(function(){
  $('.carousel-item').eq(0).addClass('active');
  var total = $('.carousel-item').length;
  var current = 0;
  $('#moveRight').on('click', function(){
    var next=current;
    current= current+1;
    setSlide(next, current);
  });
  $('#moveLeft').on('click', function(){
    var prev=current;
    current = current- 1;
    setSlide(prev, current);
  });
  function setSlide(prev, next){
    var slide= current;
    if(next>total-1){
     slide=0;
      current=0;
    }
    if(next<0){
      slide=total - 1;
      current=total - 1;
    }
           $('.carousel-item').eq(prev).removeClass('active');
           $('.carousel-item').eq(slide).addClass('active');
      setTimeout(function(){

      },800);



    console.log('current '+current);
    console.log('prev '+prev);
  }
});
},1000);
