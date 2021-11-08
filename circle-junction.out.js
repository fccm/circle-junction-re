(() => {
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // bs-platform/lib/js/js_int.js
  var max, min;
  var init_js_int = __esm({
    "bs-platform/lib/js/js_int.js"() {
      max = 2147483647;
      min = -2147483648;
    }
  });

  // bs-platform/lib/js/js_math.js
  function floor_int(f) {
    if (f > max) {
      return max;
    } else if (f < min) {
      return min;
    } else {
      return Math.floor(f);
    }
  }
  function random_int(min2, max2) {
    return floor_int(Math.random() * (max2 - min2 | 0)) + min2 | 0;
  }
  var init_js_math = __esm({
    "bs-platform/lib/js/js_math.js"() {
      init_js_int();
    }
  });

  // bs-platform/lib/js/caml_array.js
  function get(xs, index) {
    if (index < 0 || index >= xs.length) {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "index out of bounds",
        Error: new Error()
      };
    }
    return xs[index];
  }
  var init_caml_array = __esm({
    "bs-platform/lib/js/caml_array.js"() {
    }
  });

  // bs-platform/lib/js/caml_int32.js
  function mod_(x, y) {
    if (y === 0) {
      throw {
        RE_EXN_ID: "Division_by_zero",
        Error: new Error()
      };
    }
    return x % y;
  }
  var init_caml_int32 = __esm({
    "bs-platform/lib/js/caml_int32.js"() {
    }
  });

  // circle-junction.bs.js
  var require_circle_junction_bs = __commonJS({
    "circle-junction.bs.js"(exports) {
      init_js_math();
      init_caml_array();
      init_caml_int32();
      "use strict";
      var canvas = document.getElementById("my_canvas");
      var ctx = canvas.getContext("2d");
      var w = canvas.width;
      var h = canvas.height;
      var rect = canvas.getBoundingClientRect();
      var colors = [
        "30",
        "102",
        "174",
        "246",
        "318"
      ];
      var circles = [];
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#222";
      function next_color(c) {
        var num_colors = colors.length;
        var j2 = mod_(c.color + 1 | 0, num_colors);
        c.color = j2;
      }
      function ev_mouse(ev) {
        var x = ev.clientX - rect.left | 0;
        var y = ev.clientY - rect.top | 0;
        for (var i2 = 0, i_finish2 = circles.length; i2 < i_finish2; ++i2) {
          var c = get(circles, i2);
          var lx = x - c.x;
          var ly = y - c.y;
          if (lx * lx + ly * ly < c.r * c.r) {
            next_color(c);
          }
        }
      }
      function new_circle(param) {
        var _r = 16 + 16 * Math.random();
        var a = 360 * Math.random();
        var s = 0.2 + 0.8 * Math.random();
        var _colors_len = colors.length;
        var _dx = s * Math.cos(a * Math.PI / 180);
        var _dy = s * Math.sin(a * Math.PI / 180);
        var _color = random_int(0, _colors_len);
        return {
          r: _r,
          x: _r + (w - 2 * _r) * Math.random(),
          y: _r + (h - 2 * _r) * Math.random(),
          dx: _dx,
          dy: _dy,
          color: _color,
          collided: false
        };
      }
      function circles_collided(ca, cb) {
        ca.collided = true;
        cb.collided = true;
      }
      for (_for = 0; _for <= 17; ++_for) {
        _c = new_circle(void 0);
        circles.push(_c);
      }
      var _c;
      var _for;
      function circles_collide(ca, cb) {
        if (ca.color !== cb.color) {
          return false;
        }
        if (ca.collided || cb.collided) {
          return false;
        }
        var lx = ca.x - cb.x;
        var ly = ca.y - cb.y;
        var lim = ca.r + cb.r;
        return lx * lx + ly * ly < lim * lim;
      }
      function step_circle(c) {
        if (!c.collided) {
          c.x = c.x + c.dx;
          c.y = c.y + c.dy;
          if (c.x - c.r < 0 || c.x + c.r > w) {
            c.dx = -c.dx;
          }
          if (c.y - c.r < 0 || c.y + c.r > h) {
            c.dy = -c.dy;
            return;
          } else {
            return;
          }
        }
      }
      function draw_circle(c) {
        if (c.collided) {
          ctx.fillStyle = "#888";
        } else {
          var color = get(colors, c.color);
          ctx.fillStyle = "hsla(" + color + ", 80%, 60%, 0.6)";
        }
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
      }
      function sort_circles(ca, cb) {
        if (ca.collided && !cb.collided) {
          return -1;
        } else if (cb.collided && !ca.collided) {
          return 1;
        } else {
          return 0;
        }
      }
      function animate(param) {
        ctx.fillStyle = "#777";
        ctx.fillRect(0, 0, w, h);
        var circles_length2 = circles.length;
        for (var i2 = 0; i2 < circles_length2; ++i2) {
          var c = get(circles, i2);
          step_circle(c);
          draw_circle(c);
        }
        for (var i$1 = 0, i_finish2 = circles_length2 - 2 | 0; i$1 <= i_finish2; ++i$1) {
          var ci2 = get(circles, i$1);
          for (var j2 = i$1 + 1 | 0; j2 < circles_length2; ++j2) {
            var cj2 = get(circles, j2);
            if (circles_collide(ci2, cj2)) {
              circles_collided(ci2, cj2);
              circles.sort(sort_circles);
            }
          }
        }
      }
      function new_loc(c) {
        var _r = c.r;
        c.x = _r + (w - 2 * _r) * Math.random();
        c.y = _r + (h - 2 * _r) * Math.random();
      }
      var circles_length = circles.length;
      for (i = 0, i_finish = circles_length - 2 | 0; i <= i_finish; ++i) {
        ci = get(circles, i);
        for (j = i + 1 | 0; j < circles_length; ++j) {
          cj = get(circles, j);
          if (circles_collide(ci, cj)) {
            next_color(ci);
          }
        }
      }
      var ci;
      var cj;
      var j;
      var i;
      var i_finish;
      var loop = setInterval(animate, 25);
      canvas.addEventListener("mousedown", ev_mouse, false);
      var _w = w;
      var _h = h;
      var num_circles = 18;
      exports.canvas = canvas;
      exports.ctx = ctx;
      exports.w = w;
      exports.h = h;
      exports._w = _w;
      exports._h = _h;
      exports.rect = rect;
      exports.colors = colors;
      exports.circles = circles;
      exports.num_circles = num_circles;
      exports.next_color = next_color;
      exports.ev_mouse = ev_mouse;
      exports.new_circle = new_circle;
      exports.circles_collided = circles_collided;
      exports.circles_collide = circles_collide;
      exports.step_circle = step_circle;
      exports.draw_circle = draw_circle;
      exports.sort_circles = sort_circles;
      exports.animate = animate;
      exports.new_loc = new_loc;
      exports.loop = loop;
    }
  });
  require_circle_junction_bs();
})();
