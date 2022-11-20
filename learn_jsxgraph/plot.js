const board = JXG.JSXGraph.initBoard('box', { 
    boundingbox: [-5, 5, 5, -5], axis:true , showCopyright: false
});

var input = board.create('input', [-4.5, 4, 'x^2', 'f: '], {
	cssStyle: 'width: 8em'
    });
var plots = [];

var plot = function() {
    var f = board.jc.snippet(input.Value(), true, 'x', false);
    plots.push(board.create('functiongraph', [f]));
};
var clear = function() {
    for (f of plots) {
        board.removeObject(f);
    }
};

var btn_start = board.create('button', [-4.5, 3.2, 'plot', plot]);
var btn_clear = board.create('button', [-3.0, 3.2, 'clear all', clear]);