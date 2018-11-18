$(document).ready(function(){
    var closeTime = true;
    var theCanvas = document.getElementById('canvas');
    var theCode = document.getElementById('codeblock');
    var context = theCanvas.getContext('2d');

    var BG = new Image();
    var width = 1;
    var height = 1;
    var ratio = 1;

    document.body.style.overflow= 'hidden';
    document.getElementById('preblock').style.overflow= 'hidden';
    document.body.style.backgroundColor = 'black';

    function distance(o, d) {
      // var R = 6371e3; // radius of the earth in metres
      var phi1 = Math.PI * o.lat / 180;
      var phi2 = Math.PI * d.lat / 180;
      var deltaphi = Math.PI * (d.lat - o.lat) / 180;
      var deltalamda = Math.PI * (d.long - o.long) / 180;

      var a = Math.sin(deltaphi / 2) * Math.sin(deltaphi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltalamda / 2) * Math.sin(deltalamda / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var distance = R * c;

      return distance;
    }

    function intermediatePoint(f, o, d) {
      var delta = distance(o, d) / 6371e3;
      var a = Math.sin((1 - f) * delta) / Math.sin(delta);
      var b = Math.sin(f * delta) / Math.sin(delta);

      var x = a * Math.cos(Math.PI * o.lat / 180) * Math.cos(Math.PI * o.long / 180) + b * Math.cos(Math.PI * d.lat / 180) * Math.cos(Math.PI * d.long / 180);
      var y = a * Math.cos(Math.PI * o.lat / 180) * Math.sin(Math.PI * o.long / 180) + b * Math.cos(Math.PI * d.lat / 180) * Math.sin(Math.PI * d.long / 180);
      var z = a * Math.sin(Math.PI * o.lat / 180) + b * Math.sin(Math.PI * d.lat / 180);

      return {long:Math.atan2(y, x) * 180 / Math.PI, lat:Math.atan2(z, Math.sqrt((x * x) + (y * y))) * 180 / Math.PI};
    }

    function angle(o, d) {
      var x = d.long - o.long;
      var y = d.lat - o.lat;
      var theta = 0;
      if (y > 0) {
        theta = Math.atan(x / y);
      }
      else if (y < 0) {
        theta = Math.PI + Math.atan(x / y);
      }
      else if (x > 0 && y === 0) {
        theta = Math.PI / 2;
      }
      else {
        theta = 3 * Math.PI / 2;
      }
      return theta;
    }

    function getViewportDimension() {
      var e = window, a = 'inner';
      if (!( 'innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
      }
      return {w:e[a + 'Width'], h:e[a + 'Height']};
    }

    function resize () {
      //apply the dimension to the canvas
      var dim = getViewportDimension();
      var winWidth = dim.w;
      var winHeight = dim.h;

      if (4/3 < winWidth/winHeight)
      {
        ratio = winHeight/3;
        width = 4 * ratio;
        height = winHeight;
      }
      else if (4/3 > winWidth/winHeight)
      {
        ratio = winWidth/4;
        height = 3 * ratio;
        width = winWidth;
      }
      else
      {
        ratio = 1;
        width = winWidth;
        height = winHeight;
      }
      theCode.height = height;
      theCode.width = width;
      theCode.style.padding = (winHeight - height) / 2 + 'px ' + (winWidth - width) / 2 + 'px';
      var preblock = document.getElementById('preblock');
      preblock.clientHeight = height;
      preblock.clientWidth = width;

      theCanvas.height = height;
      theCanvas.width = width;
      theCanvas.style.padding = (winHeight - height) / 2 + 'px ' + (winWidth - width) / 2 + 'px';

      drawStartScreen();
    }

    function initApp() {
      //BG.src = '{% static "converter/map.jpg" %}';
      resize();
      t0 = Date.now();
      gameLoop();
    }

    function smoothAlpha(alpha) {
      return 1 - ((1 - alpha) * (1 - alpha));
    }

    function drawStartScreen () {
      //BG colour

      //BG Img
      //context.drawImage(BG, 0, 0, theCanvas.width, theCanvas.height);
    }

    function writeCalcs() {
      t1 = Date.now();
      var t = (t1 - t0) / 1000;
      var para = document.getElementById('codepara');
      var funcs = "Origin: Vernissage (longitude: 0.1, latitude: 15.5)\nDestination: Lviv (longitude: 12.0, latitude: 14.3)\n\n" + distance + "\n\n" + angle + "\n\n" + intermediatePoint;
      var calc = "\nCalculating... \n";
      var text;
      var dim = getViewportDimension();
      var winWidth = dim.w;
      var winHeight = dim.h;
      if (t < 1) {
        text = calc.substring(0, Math.floor(calc.length * t)) + "_";
        para.textContent = text;
      }
      else if (t < 5) {
        text = calc + funcs.substring(0, Math.floor(funcs.length * (t - 1) / 6)) + "_";
        para.textContent = text;
      }
      else if (t < 6) {
        para.textContent = calc + funcs.substring(0, Math.floor(funcs.length * (t - 1) / 6)) + "_";

        if (4/3 < winWidth/winHeight)
        {
          ratio = winHeight/3;
          width = 4 * ratio;
          height = winHeight;
        }
        else if (4/3 > winWidth/winHeight)
        {
          ratio = winWidth/4;
          height = 3 * ratio;
          width = winWidth;
        }
        else
        {
          ratio = 1;
          width = winWidth;
          height = winHeight;
        }

      }
      else if (t < 7) {
        para.textContent = calc + funcs.substring(0, Math.floor(funcs.length * (t - 1) / 6)) + "_";

        if (4/3 < winWidth/winHeight)
        {
          ratio = winHeight/3;
          width = 4 * ratio;
          height = winHeight;
        }
        else if (4/3 > winWidth/winHeight)
        {
          ratio = winWidth/4;
          height = 3 * ratio;
          width = winWidth;
        }
      }
      else if (t > 7) {
        console.log(123);
        closeTime = false;
        $(".ERROR_block").fadeIn(400);
        clearInterval(gameLoop);
        resize();
      }

    }

    function run() {
      writeCalcs();
    }


    function gameLoop() {
      if(closeTime){
        window.setTimeout(gameLoop, 30);
        run();
      }
    }

    initApp();

});
