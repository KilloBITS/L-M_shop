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
