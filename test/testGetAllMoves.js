var fen = require('../index');
var h = require('../lib/help');
var t = require('tape');

t('test get All moves', function(test) {
    test.plan(1);
    var game = new fen;
    var moves = game.allMoves(); // based on active player.
    test.deepEquals(moves,
        [ 'a2a3', 'a2a4', 'b2b3', 'b2b4', 'c2c3', 'c2c4', 'd2d3', 'd2d4', 'e2e3', 'e2e4', 'f2f3', 'f2f4', 'g2g3', 'g2g4', 'h2h3', 'h2h4', 'b1a3', 'b1c3', 'g1f3', 'g1h3' ]);
});
