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

const board = JXG.JSXGraph.initBoard('box', {
    boundingbox: [-5, 5, 5, -5],
    axis: true,
    showCopyright: false,
    showFullscreen: true
});

tur = board.create('turtle', [0, 0], {
    strokeOpacity: 0.5
});
tur.setPenSize(1);
tur.pu();

function interval_spacing(start, end, n) {
    let points = []
    for (let i = 0; i <= n; i++) {
        points.push(start + (end - start) * (i / n))
    }
    return points
}

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
    x = parseInt(document.getElementById('xvalue').value)

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
    board.setBoundingBox([x -  Math.abs(x), max * 1.2, x +  Math.abs(x), min * 1.2])

    //create a point
    xpoint = board.create('point', [x, 0], {
        face: 'x',
        name: 'x0'
    }).size(3)

    // button2 = board.create('button', [mid, min*1.1 , 'Next', next_turtle ] , {}); add button on graph itself
    iter_table = nr_table(f, df, x, 15)

}

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

    let max = maxfunc(f, cx - 0.75 * Math.abs(cx), x + 0.75 * Math.abs(cx), 1000)
    let min = minfunc(f, cx - 0.75 * Math.abs(cx), x + 0.75 * Math.abs(cx), 1000)
    board.setBoundingBox([cx - 0.75 * Math.abs(cx), max * 1.2, cx + 0.75 * Math.abs(cx), min * 1.2])
    curr_position++
}

async function animation() {
    board.toFullscreen()
    iter = 0
    for (i = 0; i < max_iter; i++) {
        animate_loop()
        await sleep(1000);

    }
}