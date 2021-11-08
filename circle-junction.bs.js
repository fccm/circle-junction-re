// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Js_math = require("./bs-platform/lib/js/js_math.js");
var Caml_array = require("./bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("./bs-platform/lib/js/caml_int32.js");

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
  var j = Caml_int32.mod_(c.color + 1 | 0, num_colors);
  c.color = j;
  
}

function ev_mouse(ev) {
  var x = ev.clientX - rect.left | 0;
  var y = ev.clientY - rect.top | 0;
  for(var i = 0 ,i_finish = circles.length; i < i_finish; ++i){
    var c = Caml_array.get(circles, i);
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
  var _color = Js_math.random_int(0, _colors_len);
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

for(var _for = 0; _for <= 17; ++_for){
  var _c = new_circle(undefined);
  circles.push(_c);
}

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
      return ;
    } else {
      return ;
    }
  }
  
}

function draw_circle(c) {
  if (c.collided) {
    ctx.fillStyle = "#888";
  } else {
    var color = Caml_array.get(colors, c.color);
    ctx.fillStyle = "hsla(" + color + ", 80%, 60%, 0.6)";
  }
  ctx.beginPath();
  ctx.arc(c.x, c.y, c.r, 0.0, Math.PI * 2.0, true);
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
  var circles_length = circles.length;
  for(var i = 0; i < circles_length; ++i){
    var c = Caml_array.get(circles, i);
    step_circle(c);
    draw_circle(c);
  }
  for(var i$1 = 0 ,i_finish = circles_length - 2 | 0; i$1 <= i_finish; ++i$1){
    var ci = Caml_array.get(circles, i$1);
    for(var j = i$1 + 1 | 0; j < circles_length; ++j){
      var cj = Caml_array.get(circles, j);
      if (circles_collide(ci, cj)) {
        circles_collided(ci, cj);
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

for(var i = 0 ,i_finish = circles_length - 2 | 0; i <= i_finish; ++i){
  var ci = Caml_array.get(circles, i);
  for(var j = i + 1 | 0; j < circles_length; ++j){
    var cj = Caml_array.get(circles, j);
    if (circles_collide(ci, cj)) {
      next_color(ci);
    }
    
  }
}

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
/* canvas Not a pure module */
