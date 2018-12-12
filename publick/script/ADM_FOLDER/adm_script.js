function runOnKeys(func) {
  var codes = [].slice.call(arguments, 1);
  var pressed = {};
  document.onkeydown = function(e) {
    e = e || window.event;
    pressed[e.keyCode] = true;
    for (var i = 0; i < codes.length; i++) {
      if (!pressed[codes[i]]) {
        return;
      }
    }
    pressed = {};
    func();

  };
  document.onkeyup = function(e) {
    e = e || window.event;
    delete pressed[e.keyCode];
  };
}
runOnKeys(function() {
  var isAdmin = confirm("Вы действительно хотите перейти к панели управления?");
  if(isAdmin){
    window.location.href = "/panel";
  }
},"Q".charCodeAt(0),"A".charCodeAt(0));


function seTovarColor(e, i){
  var color = $(e).attr('id');
  $('.spn_hol').attr('style','').show();
  $.post('/tovarSetColor',{colors: color, id: i},function(res){
      console.log(res);
      $(".spn_hol").css({"transform": "scale(3)", "opacity": "0.3", "filter":"grayscale(100%)"}).fadeOut(400);
      $('.colActive').removeClass('white red green blue magenta purple bezheviy yellow black rozov polosat').addClass(color);
  });
}
