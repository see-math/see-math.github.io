var iter = 0
var iter_table
var f
var df
var root
var ineq1
var ineq2
var max_iter
var path = []
var tur
var curr_position = 0

//to ensure sleep when running animation
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

//create a board
const board = JXG.JSXGraph.initBoard('box', {
    boundingbox: [-5, 5, 5, -5],
    axis: true,
    showCopyright: false,
    showFullscreen: true
});

//create a turtle
tur = board.create('turtle', [0, 0], {
    strokeOpacity: 0.5
});
tur.setPenSize(1);
tur.pu();

//emulates numspace returns n+1 points including end points
function interval_spacing(start, end, n) {
    let points = []
    for (let i = 0; i <= n; i++) {
        points.push(start + (end - start) * (i / n))
    }
    return points
}

//get the maximum value of f(x) in the interval [a,b]
function maxfunc(f, a, b, n = 1000) {
    xarray = interval_spacing(a, b, n)
    max = f(a)
    for (let i = 0; i <= n; i++) {
        if (f(xarray[i]) > max) {
            max = f(xarray[i])
        }
    }
    return max
}

//get the minimum value of f(x) in the interval [a,b]
function minfunc(f, a, b, n = 1000) {
    xarray = interval_spacing(a, b, n)
    min = f(a)
    for (let i = 0; i <= n; i++) {
        if (f(xarray[i]) < min) {
            min = f(xarray[i])
        }
    }
    return min
}


//creates a table for each row containing info of one iteration of newton rhapson algorithm
//returns 1 if error; array if sucessful
function nr_table(f, df, x, n) {
    var iters = []

    if (f(x) == 0) {
        alert('root is at initial point' + x + 'itself')
        return 1
    }

    max_iter = n

    //row headers  x 

    for (i = 0; i < n + 1; i++) {
        iters.push(x)

        x = x - (f(x) / df(x))

    }
    console.log(iters)
    return iters
}

function init_graph() {
    //get values from user
    x = parseFloat(document.getElementById('xvalue').value)

    inputfunc = document.getElementById('funcname').value
    console.log(inputfunc)
    f = board.jc.snippet(inputfunc, true, 'x', false)

    dfunc = document.getElementById('diffname').value
    console.log(dfunc)
    df = board.jc.snippet(dfunc, true, 'x', false)

    //plot two functions
    board.create('functiongraph', [f])
    // board.create('functiongraph', [df]) no need to plot the derivative


    //get max and min to set the viewport
    let max = maxfunc(f, x - 2 * Math.abs(x), x + 2 * Math.abs(x), 1000)
    let min = minfunc(f, x - 2 * Math.abs(x), x + 2 * Math.abs(x), 1000)
    board.setBoundingBox([x - Math.abs(x), max * 1.2, x + Math.abs(x), min * 1.2])

    //create a point
    xpoint = board.create('point', [x, 0], {
        face: 'x',
        name: 'x0'
    }).size(3)

    // button2 = board.create('button', [mid, min*1.1 , 'Next', next_turtle ] , {}); add button on graph itself
    iter_table = nr_table(f, df, x, 15)

}

//called when animate button is pressed
function trace_turtle() {
    tur.cs()
    tur.pu()
    tur.moveTo([iter_table[0], 0])
    tur.pd()
    for (i = 0; i < max_iter; i++) {
        tur.lookTo([iter_table[i], f(iter_table[i])])
        tur.moveTo([iter_table[i], f(iter_table[i])])

        //create a point
        board.create('point', [iter_table[i], 0], {
            face: 'x',
            name: ''
        }).size(2)
        board.create('point', [iter_table[i], f(iter_table[i])], {
            name: 'x' + String(i)
        }).size(1)

        tur.lookTo([iter_table[i + 1], 0])
        tur.moveTo([iter_table[i + 1], 0])
    }
}

//called when next button is pressed
function next_turtle() {
    cx = iter_table[curr_position]
    if (curr_position == 0) {
        tur.cs()
        tur.pu()
        tur.moveTo([cx, 0])
        tur.pd()
        tangent = board.create('line', [
            [cx, f(cx)],
            [iter_table[curr_position + 1], 0]
        ], {
            visible: true
        });
    }
    tur.moveTo([cx, f(cx)])
    tangent.point1.moveTo([cx, f(cx)])
    tangent.point2.moveTo([iter_table[curr_position + 1], 0])
    tur.moveTo([iter_table[curr_position + 1], 0])
    //get max and min to set the viewport

    //old = board.getBoundingBox()

    let now_max = maxfunc(f, cx - 0.75 * Math.abs(cx), x + 0.75 * Math.abs(cx), 1000)
    let now_min = minfunc(f, cx - 0.75 * Math.abs(cx), x + 0.75 * Math.abs(cx), 1000)

    //chnage this to get slow transition
    now_ax = cx - 0.75 * Math.abs(cx)
    now_ay = now_max * 1.2
    now_bx = cx + 0.75 * Math.abs(cx)
    now_by = now_min * 1.2

    if (now_ay < 0) {
        now_ay = 1
    }
    if (now_by > 0) {
        now_by = -1
    }

    ncx = iter_table[curr_position+ 1]

    let next_max = maxfunc(f, ncx - 0.75 * Math.abs(ncx), x + 0.75 * Math.abs(ncx), 1000)
    let next_min = minfunc(f, ncx - 0.75 * Math.abs(ncx), x + 0.75 * Math.abs(ncx), 1000)

    //chnage this to get slow transition
    next_ax = ncx - 0.75 * Math.abs(ncx)
    next_ay = next_max * 1.2
    next_bx = ncx + 0.75 * Math.abs(ncx)
    next_by = next_min * 1.2

    if (next_ay < 0) {
        next_ay = 1
    }
    if (next_by > 0) {
        next_by = -1
    }

    zoomandgo(now_ax, now_ay, now_bx, now_by, next_ax, next_ay, next_bx, next_by)
    //board.setBoundingBox([cx - 0.75 * Math.abs(cx), max * 1.2, cx + 0.75 * Math.abs(cx), min * 1.2])

    console.log(board.getBoundingBox())
    curr_position++
}

//zoom function
async function zoomandgo(old_xa, old_ya, old_xb, old_yb, new_xa, new_ya, new_xb, new_yb) {

    var zoom_xa = Math.max(old_xa, new_xa)
    var zoom_ya = Math.max(old_ya, new_ya)
    var zoom_xb = Math.max(old_xb, new_xb)
    var zoom_yb = Math.max(old_yb, new_yb)

    board.setBoundingBox([old_xa, old_ya, old_xb, old_yb])

    xa_tran = interval_spacing(old_xa, zoom_xa, 100)
    ya_tran = interval_spacing(old_ya, zoom_ya, 100)
    xb_tran = interval_spacing(old_xb, zoom_xb, 100)
    yb_tran = interval_spacing(old_yb, zoom_yb, 100)

    for (i = 0; i < 101; i++) {
        board.setBoundingBox([xa_tran[i], ya_tran[i], xb_tran[i], yb_tran[i]])
        await sleep(10)
    }


    board.setBoundingBox([zoom_xa, zoom_ya, zoom_xb, zoom_yb])

    xa_tran = interval_spacing(zoom_xa, new_xa, 100)
    ya_tran = interval_spacing(zoom_ya, new_ya, 100)
    xb_tran = interval_spacing(zoom_xb, new_xb, 100)
    yb_tran = interval_spacing(zoom_yb, new_yb, 100)

    for (i = 0; i < 101; i++) {
        board.setBoundingBox([xa_tran[i], ya_tran[i], xb_tran[i], yb_tran[i]])
        await sleep(10)
    }
}


//animate function from bisection
async function animation() {
    board.toFullscreen()
    iter = 0
    for (i = 0; i < max_iter; i++) {
        animate_loop()
        await sleep(1000);

    }
}
