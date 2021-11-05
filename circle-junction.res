open Belt

type document  // abstract type for a document object

type rect = {
    x: int,
    y: int,
    left: int,
    right: int,
    top: int,
    bottom: int,
    width: int,
    height: int,
}

type mousedown_event = {
    clientX: int,
    clientY: int,
}

type circle = {
    r: float,  // radius
    mutable x: float,
    mutable y: float,

    mutable dx: float,
    mutable dy: float,

    mutable color: int,

    mutable collided: bool,
}

type context = {
    mutable lineWidth: int,
    mutable strokeStyle: string,
    mutable fillStyle: string,
}

type mouse_event = {
    clientX: int,
    clientY: int,
}

@send external getElementById: (document, string) => Dom.element = "getElementById"
@send external getContext: (Dom.element, string) => context = "getContext"

@send external getBoundingClientRect: Dom.element => rect = "getBoundingClientRect"

@send external beginPath: context => unit = "beginPath"
@send external closePath: context => unit = "closePath"
@send external fill: context => unit = "fill"
@send external fillRect: (context, int, int, int, int) => unit = "fillRect"
@send external arc: (context, float, float, float, float, float, bool) => unit = "arc"

@get external width: Dom.element => int = "width"
@get external height: Dom.element => int = "height"

@val external doc: document = "document"

@send external addEventListener: (Dom.element, string, mouse_event => unit, bool) => unit = "addEventListener"

type intervalID

@val external setInterval : (unit => unit, int) => intervalID = "setInterval"
@val external clearInterval : intervalID => unit = "clearInterval"


let canvas = getElementById(doc, "my_canvas")
let ctx = getContext(canvas, "2d")

let w = width(canvas)
let h = height(canvas)

let _w = Belt.Int.toFloat(w)
let _h = Belt.Int.toFloat(h)

let rect = getBoundingClientRect(canvas)

let colors = ["30", "102", "174", "246", "318"]
let circles: array<circle> = []
let num_circles = 18

//let colors = ["0", "120", "240"]
//let colors = ["30", "120", "210", "300"]
//let colors = ["0", "72", "144", "216", "288"]
//let colors = ["0", "60", "120", "180", "240", "300"]
//let colors = ["10", "55", "100", "185", "210", "235", "280", "325"]

ctx.lineWidth = 2
ctx.strokeStyle = "#222"


let next_color = (c) => {
    let num_colors = Js.Array.length(colors)
    let j = mod(c.color + 1, num_colors)
    c.color = j
}


let ev_mouse = (ev) => {
    let x = Belt.Int.toFloat( ev.clientX - rect.left )
    let y = Belt.Int.toFloat( ev.clientY - rect.top )

    for i in 0 to Js.Array.length(circles) - 1 {
        let c = Option.getExn(circles[i])

        let lx = x -. c.x
        let ly = y -. c.y

        if ((lx *. lx +. ly *. ly) < (c.r *. c.r)) {
            next_color(c)
        }
    }
}


let new_circle = () => {
    let _r = 16. +. 16. *. Js.Math.random()

    let a = 360. *. Js.Math.random()
    let s = 0.2 +. 0.8 *. Js.Math.random()

    let _colors_len = Js.Array.length(colors)

    let _dx = s *. Js.Math.cos(a *. Js.Math._PI /. 180.)
    let _dy = s *. Js.Math.sin(a *. Js.Math._PI /. 180.)

    let _color = Js.Math.random_int(0, _colors_len)

    let circle = {
        r: _r,
        x: _r +. (_w -. 2. *. _r) *. Js.Math.random(),
        y: _r +. (_h -. 2. *. _r) *. Js.Math.random(),
        dx: _dx,
        dy: _dy,
        color: _color,
        collided: false
    }
    circle
}


let circles_collided = (ca, cb) => {
    ca.collided = true
    cb.collided = true
}


/* populate the array circles with initialised circles */
for _ in 0 to num_circles - 1 {
    let _c = new_circle()
    let _ = Js.Array2.push(circles, _c)
}


let circles_collide = (ca, cb) => {
    if (ca.color != cb.color) { false } else {
        if (ca.collided || cb.collided) { false } else {
            let lx = ca.x -. cb.x
            let ly = ca.y -. cb.y
            let lim = ca.r +. cb.r
            let collision = ((lx *. lx +. ly *. ly) < (lim *. lim))
            collision
        }
    }
}


let step_circle = (c) => {
    if (!c.collided) {
        c.x = c.x +. c.dx
        c.y = c.y +. c.dy
        if ((c.x -. c.r) < 0. || (c.x +. c.r) > _w) { c.dx = -. c.dx }
        if ((c.y -. c.r) < 0. || (c.y +. c.r) > _h) { c.dy = -. c.dy }
    }
}


let draw_circle = (c) => {
    if (c.collided) {
        ctx.fillStyle = "#888"
    } else {
        let color = Option.getExn( colors[c.color] )
        ctx.fillStyle = "hsla(" ++ color ++ ", 80%, 60%, 0.6)"
    }
    beginPath(ctx)
    arc(ctx, c.x, c.y, c.r, 0.0, Js.Math._PI *. 2.0, true)
    closePath(ctx)
    fill(ctx)
}


let sort_circles = (ca, cb) => {
    if (ca.collided && !cb.collided) { -1 }
    else if (cb.collided && !ca.collided) { 1 }
    else { 0 }
}


let animate = () => {
    ctx.fillStyle = "#777"
    fillRect(ctx, 0,0,w,h)

    let circles_length = Js.Array.length(circles)

    for i in 0 to circles_length - 1 {
        let _c = circles[i]
        let c = Option.getExn(_c)
        step_circle(c)
        draw_circle(c)
    }

    for i in 0 to circles_length - 2 {
        let ci = Option.getExn(circles[i])

        for j in i + 1 to circles_length - 1 {
            let cj = Option.getExn(circles[j])

            if (circles_collide(ci, cj)) {
                circles_collided(ci, cj)
                let _ = Js.Array2.sortInPlaceWith(circles, sort_circles)
            }
        }
    }
}


let new_loc = (c) => {
    let _r = c.r
    c.x = _r +. (_w -. 2. *. _r) *. Js.Math.random()
    c.y = _r +. (_h -. 2. *. _r) *. Js.Math.random()
}


{
    // Check that no circles initially collide

    let circles_length = Js.Array.length(circles)

    for i in 0 to circles_length - 2 {
        let ci = Option.getExn(circles[i])

        for j in i + 1 to circles_length - 1 {
            let cj = Option.getExn(circles[j])

            if circles_collide(ci, cj) {
                next_color(ci)
		//new_loc(ci)
            }
        }
    }
}


let loop = setInterval(animate, 1000/40)

// if game finished
//clearInterval(loop);

addEventListener(canvas, "mousedown", ev_mouse, false)

