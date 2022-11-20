var iter = 0
var iter_table
var f
var root
var ineq1
var ineq2
var max_iter

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const board = JXG.JSXGraph.initBoard('box', {
    boundingbox: [-5, 5, 5, -5],
    axis: true,
    showCopyright: false,
    showFullscreen: true
});

function interval_spacing(start, end, n) {
    let points = []
    for (let i = 0; i <= n; i++) {
        points.push(start + (end - start) * (i / n))
    }
    return points
}

function maxfunc(f, a, b, n = 1000) {
    x = interval_spacing(a, b, n)
    max = f(a)
    for (let i = 0; i <= n; i++) {
        if (f(x[i]) > max) {
            max = f(x[i])
        }
    }
    return max
}

function minfunc(f, a, b, n) {
    x = interval_spacing(a, b, n)
    min = f(a)
    for (let i = 0; i <= n; i++) {
        if (f(x[i]) < min) {
            min = f(x[i])
        }
    }
    return min
}


//creates a table for each row containing info of one iteration of bisection algorithm
//returns 1 if error array if sucessful
function bisection_table(f, a, b, eps) {
    var iters = []

    if (a > b) {
        alert('a must be smaller than b')
        return 1
    }

    if (a == b) {
        alert('a and b must be distinct')
    }

    if (f(a) == 0) {
        alert('root is at point a itself')
        return 1
    }

    if (f(b) == 0) {
        alert('root is at point b itself')
        return 1
    }

    if (f(a) * f(b) > 0) {
        alert('choose appropriate starting values')
        return 1
    }

    n = Math.ceil(Math.log(Math.abs(a - b) / eps) / Math.log(2))
    max_iter = n
    //row headers  [iter_number , a_values ,  sign_fa , b_values ,    sign_fb ,    mid_value,     f_mid ,     error ]

    for (i = 0; i < n + 1; i++) {
        mid = (a + b) * 0.5

        iters.push([i, a, Math.sign(f(a)), b, Math.sign(f(b)), mid, Math.sign(f(mid)), b - a])

        if (f(mid) * f(a) < 0) {
            b = mid
        } else {
            a = mid
        }
        root = mid
    }
    console.log(iters)
    return iters
}

function init_graph() {
    //get values from user
    a = parseInt(document.getElementById('avalue').value)
    b = parseInt(document.getElementById('bvalue').value)
    inputfunc = document.getElementById('funcname').value
    alert(inputfunc)
    f = board.jc.snippet(inputfunc, true, 'x', false)
    board.create('functiongraph', [f]);
    let mid = (a + b) / 2

    let vep = (b - a) / 6

    //define three vertical lines 
    aline = board.create('line', [
        [a, 0],
        [a, 1]
    ], {
        visible: false

    });

    bline = board.create('line', [
        [b, 0],
        [b, 1]
    ], {
        visible: false
    });

    midline = board.create('line', [
        [mid, 0],
        [mid, 1]
    ], {
        straightFirst: true,
        straightLast: true,
        strokeWidth: 2,
        dash: 2,
        fixed: true
    });

    //get max and min to set the viewport
    let max = maxfunc(f, a, b, 1000)
    let min = minfunc(f, a, b, 1000)
    board.setBoundingBox([a - vep, max * 1.2, b + vep, min * 1.2])

    //create three points
    apoint = board.create('point', [a, f(a)])
    bpoint = board.create('point', [b, f(b)])
    midpoint = board.create('point', [mid, f(mid)], {
        face: 'x',
        name: 'mid'
    })

    // button2 = board.create('button', [mid, min*1.1 , 'Next', update_graph ] , {}); add button on graph itself
    iter_table = bisection_table(f, a, b, 0.01)

}

function update_graph() {
    iter++
    if (iter >= max_iter) {
        alert('The root upto given tolerance is' + root)
        return
    }
    a = iter_table[iter][1]
    b = iter_table[iter][3]
    mid = iter_table[iter][5]

    let vep = (b - a) / 6

    //remove previous inequality
    board.removeObject(ineq1)
    board.removeObject(ineq2)


    //update all three lines
    aline.point1.moveTo([a, 0]);
    aline.point2.moveTo([a, 1]);
    bline.point1.moveTo([b, 0]);
    bline.point2.moveTo([b, 1]);
    midline.point1.moveTo([mid, 0]);
    midline.point2.moveTo([mid, 1]);

    //update min and max
    let max = maxfunc(f, a, b, 1000)
    let min = minfunc(f, a, b, 1000)

    //update the three points
    apoint.setPositionDirectly(JXG.COORDS_BY_USER, [a, f(a)]);
    bpoint.setPositionDirectly(JXG.COORDS_BY_USER, [b, f(b)]);
    midpoint.setPositionDirectly(JXG.COORDS_BY_USER, [mid, f(mid)]);

    //create inequalities for shading the region containing root
    if (root < mid) {
        ineq1 = board.create('inequality', [midline], {
            fillColor: 'yellow',
            fillopacity: 0.1
        });
    } else {
        ineq1 = board.create('inequality', [midline], {
            inverse: true,
            fillColor: 'yellow',
            fillopacity: 0.1
        });
    }

    if (f(b) * f(mid) < 0) {
        ineq2 = board.create('inequality', [bline], {
            fillColor: 'blue',
            fillopacity: 0.1
        });
    } else {
        ineq2 = board.create('inequality', [aline], {
            inverse: true,
            fillColor: 'blue',
            fillopacity: 0.1
        });
    }

    board.setBoundingBox([a - vep, max * 1.2, b + vep, min * 1.2])

    board.update()
}

function animate_loop() {
    iter++

    if (iter >= max_iter) {
        alert('The root upto given tolerance is' + root)
        return
    }
    a = iter_table[iter][1]
    b = iter_table[iter][3]
    mid = iter_table[iter][5]

    let vep = (b - a) / 6

    //remove previous inequality
    board.removeObject(ineq1)
    board.removeObject(ineq2)


    //update all three lines
    aline.point1.moveTo([a, 0]);
    aline.point2.moveTo([a, 1]);
    bline.point1.moveTo([b, 0]);
    bline.point2.moveTo([b, 1]);
    midline.point1.moveTo([mid, 0]);
    midline.point2.moveTo([mid, 1]);

    //update min and max
    let max = maxfunc(f, a, b, 1000)
    let min = minfunc(f, a, b, 1000)

    //update the three points
    apoint.setPositionDirectly(JXG.COORDS_BY_USER, [a, f(a)]);
    bpoint.setPositionDirectly(JXG.COORDS_BY_USER, [b, f(b)]);
    midpoint.setPositionDirectly(JXG.COORDS_BY_USER, [mid, f(mid)]);

    //create inequalities for shading the region containing root
    if (root < mid) {
        ineq1 = board.create('inequality', [midline], {
            fillColor: 'yellow',
            fillopacity: 0.1
        });
    } else {
        ineq1 = board.create('inequality', [midline], {
            inverse: true,
            fillColor: 'yellow',
            fillopacity: 0.1
        });
    }

    if (f(b) * f(mid) < 0) {
        ineq2 = board.create('inequality', [bline], {
            fillColor: 'blue',
            fillopacity: 0.1
        });
    } else {
        ineq2 = board.create('inequality', [aline], {
            inverse: true,
            fillColor: 'blue',
            fillopacity: 0.1
        });
    }

    board.update()

}

async function animation() {
    board.toFullscreen()
    iter = 0
    for (i = 0; i < max_iter; i++) {
        animate_loop()
        await sleep(1000);

    }
}