'use strict';
var Index = {
  getCounters: true,
  DESIGHN: function() {
    const updateTimer = (deadline) => {
    // calculates time left until deadline
    const time = deadline - new Date();
    return {
        'days': Math.floor(time / (1000 * 60 * 60 * 24)),
        'hours': Math.floor((time / (1000 * 60 * 60)) % 24),
        'minutes': Math.floor((time / (1000 * 60)) % 60),
        'seconds': Math.floor((time / (1000)) % 60),
        'total': time
    };
}

const animateClock = (span) => {
    // animation lasts for 0.5 seconds
    span.className = 'turn';
    setTimeout(() => {
        span.className = '';
    }, 500);
}

const startTimer = (id, deadline) => {
    // calls updateTimer every second
    const timeInterval = setInterval(() => {
        const clock = document.getElementsByClassName(id)[0];
        let timer = updateTimer(deadline);

        clock.innerHTML =
            '<span>' + timer.days + '</span>' +
            '<span>' + timer.hours + '</span>' +
            '<span>' + timer.minutes + '</span>' +
            '<span>' + timer.seconds + '</span>';

        const spans = clock.getElementsByTagName("span");
        animateClock(spans[3]);
        if (timer.seconds == 59) animateClock(spans[2]);
        if (timer.minutes == 59 && timer.seconds == 59) animateClock(spans[1]);
        if (timer.minutes == 23 && timer.minutes == 59 && timer.seconds == 59) animateClock(spans[0]);


        // check if deadline has passed
        if (timer.total < 1) {
            clearInterval(timeInterval);
            clock.innerHTML =
                '<span>0</span><span>0</span><span>0</span><span>0</span>';
        }

    }, 1000);
}


window.onload = () => {
    const deadline = new Date("December 31, 2018 23:59:59");
    startTimer("clockTimer", deadline)
};


    $('#head_arrow').click(function(){
      $('html,body').animate({
        scrollTop: $('.content').height()
      }, 1000);
    });

    lightGallery(document.getElementById('lightgallery'))

    $('.buttonGallery').on('click',function(){

      if($(this).attr('data-click-state') == 1) {
        $(this).attr('data-click-state', 0);
        $(this).html('Слайдер')
        $('.carouselInsta').fadeOut(300);
        $('.galleryInsta').fadeIn(300);
      } else {
        $(this).attr('data-click-state', 1)
        $(this).html('Галерея')
        $('.carouselInsta').fadeIn(300);
        $('.galleryInsta').fadeOut(300);
      }

    });

    $(window).scroll(function(){
      $(".arrowsss").css("opacity", 1 - $(window).scrollTop() / 250);
    });

    if($(window).width() < 800){
      $(".header").height($(window).height() - 50 + 'px')
    }else{
      $(".header").height($(window).height() - 150 + 'px')
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
          console.log(result.searchResult);
          var res = result.searchResult;
          $('.search_data div').remove();
          $(".search_title span").html(res.length)
          for(let i = 0; i < res.length; i++){
            var newObj = document.createElement('div');
            newObj.className = 'search_object';            
            $('.search_data').append(newObj);

            var obImg =  document.createElement('div');
            obImg.className = 'search_min_img';            
            $(newObj).append(obImg);

            var img =  document.createElement('img');
            img.id = 'TovImg'+i;   
            img.setAttribute('src', '../../../data/tovar/'+res[i].image[0]);         
            $(obImg).append(img);

            var obTitle =  document.createElement('div');
            obTitle.className = 'search_min_title';
            obTitle.innerHTML = res[i].title;
            $(newObj).append(obTitle);
          }
          
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
    }
  });
},1000);

var getStockFunc = function(id){
  $.post('/getStock',{num: id},(res) => {
    console.log(res);
  });
}


$(() => {
	var $sendBtn = $('.send-button'),
			$iWrapper = $('.icon-wrapper'),
			$i1 = $('.icon-1'),
			$i2 = $('.icon-2');

	function animationEvent() {
		var t,
				el = document.createElement('fakeelement');

		var animations = {
			animation: 'animationend',
			OAnimation: 'oAnimationEnd',
			MozAnimation: 'animationend',
			WebkitAnimation: 'webkitAnimationEnd'
		};

		for (t in animations) {
			if (el.style[t] !== undefined) {
				return animations[t];
			}
		}
	}

	$sendBtn.on('click', e => {
		$iWrapper.css('color', '#66bb6a');
		$iWrapper.addClass('icon-wrapper-animation');
		$sendBtn.addClass('clicked');
		$i1.delay(900);
		$i1.fadeTo(300, 0);
		$i2.delay(900);
		$i2.fadeTo(300, 1);
	});

	$sendBtn.on(animationEvent(), e => {
		if (e.originalEvent.animationName == 'input-shadow') {
			$sendBtn.removeClass('clicked');
		}
	});

	$iWrapper.on(animationEvent(), e => {
		if (e.originalEvent.animationName == 'icon-animation') {
			$iWrapper.removeClass('icon-wrapper-animation');
			setTimeout(reset, 1200);
		}
	});

	function reset() {
		$i1.fadeTo(250, 1);
		$i2.fadeTo(250, 0);
		$iWrapper.css('color', '#f8bbd0');
	}
}); // end of document ready
