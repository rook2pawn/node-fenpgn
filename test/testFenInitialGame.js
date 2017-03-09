var fen = require('../index');
var h = require('../lib/help');
var t = require('tape');
t('testFenPos Position', function(test) {
    test.plan(1);
    var msan = 'g1f3 b8c6 e2e4 g8f6 e4e5 f6e4 d2d3 e4c5 d3d4 c5e4';
    var game = new fen(msan);
    test.equals(game.getFenPos(),'r1bqkb1r/pppppppp/2n5/4P3/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq - 1 6');
});