'use strict';
var Index = {
  ML: "",
  getCounters: true,
  DESIGHN: function() {
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
          console.log(result);
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

    $('.menu-wrapper').on('click', function() {
      $('.hamburger-menu').toggleClass('animate');
      $('.twoLine').toggleClass('openMenuClass');
    })

    $(".menuBTN").hover(function() {
      try {
        $("." + Index.ML + ",.opensMenu").hide();

        Index.ML = $(".menuBTN:eq(" + $(".menuBTN").index(this) + ")").attr('menu-link');
        if (Index.ML != undefined) {
          $("." + Index.ML + ",.opensMenu").show();
        }

      } catch (e) {
        console.warn('Есть небольшой конфликт, но это не критично')
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
      autoSlideDelay = 6000,
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
    $(document).scroll(function (event) {
    var scroll = $(document).scrollTop();
        if(scroll >= 1000 && Index.getCounters){
          Index.getCounters = false;
          $.post('/counters', function(res){
            $(".counters_length:eq(0)").html(parseInt(res.a - (res.a / 4)))
            $(".counters_length:eq(1)").html(parseInt(res.b - (res.b / 4)))
            $(".counters_length:eq(2)").html(parseInt(res.c - (res.c / 4)))
            $(".counters_length:eq(3)").html(parseInt(res.d - (res.d / 4)))
            STC = setInterval(function(){
              if(parseInt($(".counters_length:eq(0)").html()) < res.a){
                $(".counters_length:eq(0)").html( parseInt($(".counters_length:eq(0)").html()) + 1)
              }
              if(parseInt($(".counters_length:eq(1)").html()) < res.b){
                $(".counters_length:eq(1)").html( parseInt($(".counters_length:eq(1)").html()) + 1)
              }
              if(parseInt($(".counters_length:eq(2)").html()) < res.c){
                $(".counters_length:eq(2)").html( parseInt($(".counters_length:eq(2)").html()) + 1)
              }
              if(parseInt($(".counters_length:eq(3)").html()) < res.d){
                $(".counters_length:eq(3)").html( parseInt($(".counters_length:eq(3)").html()) + 1)
              }
            }, 10);
          });
        }
    });
  },
  INIT: function() {
    Index.DESIGHN();
  }
}

$(document).ready(() => {
  Index.INIT();
});
