
var Global = {
  changeTypeDost: function(t){
    $("#CityOfDost,#CityOfPostNP,#CityOfPostUl,#CityOfPostD,#CityOfPostK").fadeOut(130)
    if(parseInt(t) === 0){

    }
    if(parseInt(t) === 1){
      $("#CityOfDost,#CityOfPostUl,#CityOfPostD,#CityOfPostK").fadeIn(300);
      $("#input-PaymentCity").val("Львів").attr("disabled",true);
      $("#CityOfDost label").hide();
    }
    if(parseInt(t) === 2){
      $("#CityOfDost,#CityOfPostNP").fadeIn(300);
      $("#input-PaymentCity").val("").attr("disabled",false);
      $("#CityOfDost label").show();
    }
    if(parseInt(t) === 3){

    }
  },
  message: function(e){
    e.preventDefault(e);
    var msg_data = {
      MyName: $("#input-name").val(),
      myEmail:$("#input-email").val(),
      myTheme:$("#input-subject").val(),
      message:$("#input-message").val(),
    };
    $.post('/sendMessage',msg_data, function(data){
      if(
        ($("#input-name").val().length > 1)||
        ($("#input-email").val().length > 1)||
        ($("#input-subject").val().length > 1)||
        ($("#input-message").val().length > 1)){
          createAlert('','Сообщение отправленно!','Ваше сообщение біло успешно отправлено.','success',true,true,'pageMessages');
          $(".cf input[type='text'],.cf input[type='email'], #input-message").val('');
      }else{
        createAlert('','','Сообщение не отправлено!','warning',false,true,'pageMessages');
        return false
      }
    });
  },
  BTN: function(){
    $('.menu-wrapper').on('click', function() {
      $('.hamburger-menu').toggleClass('animate');
      // $('.twoLine').toggleClass('openMenuClass');
      $(".menu_data").hide();
      $(".twoLine").slideToggle();
    })

    $(".addToJelaniya").click(function(){
      $.post('/addToJelaniya',{numObj: $(this).attr('tovAI')}, function(res) {
        $(this).css({
          "background-image":"url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU3Ljk5OSA1Ny45OTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU3Ljk5OSA1Ny45OTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4Ij4KPGc+Cgk8cGF0aCBkPSJNNTYuNDE3LDIxLjgxNmMtMi4wMzcsMi4wODktMjMuNDc5LDIyLjUxLTIzLjQ3OSwyMi41MUMzMS44NSw0NS40NDEsMzAuNDI0LDQ2LDI4Ljk5OSw0NiAgIGMtMS40MjgsMC0yLjg1NC0wLjU1OS0zLjkzOS0xLjY3NGMwLDAtMjEuNDQxLTIwLjQyMS0yMy40OC0yMi41MWMtMi4wMzctMi4wOS0yLjE3Ni01Ljg0OCwwLTguMDc4ICAgYzIuMTc0LTIuMjI5LDUuMjExLTIuNDA2LDcuODc5LDBsMTkuNTQsMTguNzM1bDE5LjUzOS0xOC43MzVjMi42Ny0yLjQwNiw1LjcwNS0yLjIyOSw3Ljg3OSwwICAgQzU4LjU5NSwxNS45NjksNTguNDU2LDE5LjcyNyw1Ni40MTcsMjEuODE2eiIgZmlsbD0iI0ZGRkZGRiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)"
        });
        console.log(res);
      });
    });
    $(".addToSravnenie").click(function(){

    });


    $( ".draggable" ).draggable({
      cursor: "crosshair"
    });
    $(".NEXT_pay_bas").click(function(){
      $('.basket_info').show(300);
    });
    $(".lang").click(function(){
      document.cookie = "vernissageLang="+$(this).attr("id");
      location.reload();
    });
    if($("body").width() > 800){
        return $(window).scrollTop() > 300 ? $(".logotype").css({"height":"50px"}) : $(".logotype").css({"height":"100px"}), $(window).scrollTop() > 600 ? $("#back-to-top").addClass("show") : $("#back-to-top").removeClass("show");
    }else{
        return $(window).scrollTop() > 600 ? $("#back-to-top").addClass("show") : $("#back-to-top").removeClass("show")
    }
  }
};

$(document).ready(function() {
  Global.BTN();
  setTimeout(function() {

    $(".spn_hol").css({"transform": "scale(5)", "opacity": "0.3", "filter":"grayscale(100%)"}).fadeOut(400);
  }, 1500);

  // $(document).scroll(function(){
  //   $('.menu_data').hide();
  //   $('.hamburger-menu').removeClass('animate');
  //   $('.twoLine').removeClass('openMenuClass');
  //   $(".twoLine").click();
  // });
});



function createAlert(title, summary, details, severity, dismissible, autoDismiss, appendToId) {
  var iconMap = {
    info: "fa fa-info-circle",
    success: "fa fa-thumbs-up",
    warning: "fa fa-exclamation-triangle",
    danger: "fa ffa fa-exclamation-circle"
  };

  var iconAdded = false;

  var alertClasses = ["alert", "animated", "flipInX"];
  alertClasses.push("alert-" + severity.toLowerCase());

  if (dismissible) {
    alertClasses.push("alert-dismissible");
  }

  var msgIcon = $("<i />", {
    "class": iconMap[severity] // you need to quote "class" since it's a reserved keyword
  });

  var msg = $("<div />", {
    "class": alertClasses.join(" ") // you need to quote "class" since it's a reserved keyword
  });

  if (title) {
    var msgTitle = $("<h4 />", {
      html: title
    }).appendTo(msg);

    if(!iconAdded){
      msgTitle.prepend(msgIcon);
      iconAdded = true;
    }
  }

  if (summary) {
    var msgSummary = $("<strong />", {
      html: summary
    }).appendTo(msg);

    if(!iconAdded){
      msgSummary.prepend(msgIcon);
      iconAdded = true;
    }
  }

  if (details) {
    var msgDetails = $("<p />", {
      html: details
    }).appendTo(msg);

    if(!iconAdded){
      msgDetails.prepend(msgIcon);
      iconAdded = true;
    }
  }


  if (dismissible) {
    var msgClose = $("<span />", {
      "class": "close", // you need to quote "class" since it's a reserved keyword
      "data-dismiss": "alert",
      html: "X"
    }).appendTo(msg);
  }

  $('#' + appendToId).prepend(msg);

  if(autoDismiss){
    setTimeout(function(){
      msg.addClass("flipOutX");
      setTimeout(function(){
        msg.remove();
      },1000);
    }, 5000);
  }
}
$(function() {
  if ($('#sidecontent3').length) {
    var el = $('#sidecontent3');
    var stickyTop = $('#sidecontent3').offset().top;
    var stickyHeight = $('#sidecontent3').height();
    $(window).scroll(function() {

      var limit = $('#footer-wrapper').offset().top - stickyHeight - 20;
      var windowTop = $(window).scrollTop();
      if (stickyTop < windowTop) {
        el.css({
          position: 'fixed',
          top: 20
        });
      } else {
        el.css('position', 'static');
      }
      if (limit < windowTop) {
        var diff = limit - windowTop;
        el.css({
          top: diff
        });
      }
    });
  }
});
// Back to top button
(function() {
  $(document).ready(function() {
    if($("body").width() > 800){
      return $(window).scroll(function() {
        return $(window).scrollTop() > 300 ? $(".logotype").css({"height":"50px"}) : $(".logotype").css({"height":"100px"}), $(window).scrollTop() > 600 ? $("#back-to-top").addClass("show") : $("#back-to-top").removeClass("show")
      }), $("#back-to-top").click(function() {
        return $("html,body").animate({
          scrollTop: "0"
        })
      })
    }else{
      return $(window).scroll(function() {
        return $(window).scrollTop() > 600 ? $("#back-to-top").addClass("show") : $("#back-to-top").removeClass("show")
      }), $("#back-to-top").click(function() {
        return $("html,body").animate({
          scrollTop: "0"
        })
      })
    }

  })
}).call(this);
var $messages = $('.messages-content'),
    d, h, m,
    i = 0;
$(document).ready(function(){
  $('.container-call').click(function(){
    $(".avenue-messenger").toggle();
    if(i === 0){
      setTimeout(function() {
        fakeMessage();
      }, 100);
    }

  });


  function setDate(){
    d = new Date()
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
      $('<div class="checkmark-sent-delivered">&check;</div>').appendTo($('.message:last'));
      $('<div class="checkmark-read">&check;</div>').appendTo($('.message:last'));
    }
  }

  function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }

    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.messages')).addClass('new');
    setDate();

    $('<div class="message loading new"><figure class="avatar"><img src="../../../image/chatbot.jpg" /></figure><span></span></div>').appendTo($('.messages'));

    $.post('/to-yuliadMessage', {messageText: msg}, function(res){
      $('.message.loading').remove();
      $('<div class="message new"><figure class="avatar"><img src="../../../image/chatbot.jpg" /></figure>' + res.msgNewServer + '</div>').appendTo($('.messages')).addClass('new');
      setDate();
    })

    $('.message-input').val(null);
    setTimeout(function() {
    }, 1000 + (Math.random() * 20) * 100);
  }

  $('.message-submit').click(function() {
    insertMessage();
  });

  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      insertMessage();
      return false;
    }
  })

  var Fake = ['Здравствуйте, я виртуальный помошник Юля, у вас появились вопроссы ? я могу вам чем то помочь ?'];

  function fakeMessage() {
    if ($('.message-input').val() != '') {
      return false;
    }
    $('<div class="message loading new"><figure class="avatar"><img src="../../../image/chatbot.jpg" /></figure><span></span></div>').appendTo($('.messages'));

    setTimeout(function() {
      $('.message.loading').remove();
      $('<div class="message new"><figure class="avatar"><img src="../../../image/chatbot.jpg" /></figure>' + Fake[i] + '</div>').appendTo($('.messages')).addClass('new');
      setDate();
      i++;
    }, 1000 + (Math.random() * 20) * 50);
  }
});
