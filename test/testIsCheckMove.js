var fen = require('../index');
var h = require('../lib/help');
var t = require('tape');
t('testIsCheckMove',function(test) {
    // check where a checkmate can be removed
    test.plan(9);
    var game = new fen();
    game.mm('e2e4');
    test.equals(game.last().blackChecked,false);
    game.mm('a7a6');
    game.mm('e4e5');
    game.mm('a6a5');
    game.mm('e5e6');
    game.mm('a5a4');
    test.equals(game.last().blackChecked,false);
    test.equals(game.getActivePlayer(),'white')
    game.mm('e6d7');
    test.equals(game.getActivePlayer(),'black')
    test.equals(game.last().blackChecked,true);
    test.equals(game.last().winner,"", "there should be no winner yet");
    test.equals(game.last().winner,"", "there should be no winner yet");
    test.deepEquals(h.allMoves(game.last()), [ 'b8d7', 'c8d7', 'd8d7', 'e8d7' ], "these are the outs for black");
    // check that history hasn't been screwed with
    var hist = game.getHistory();
    // 7 moves + 1 startpos history
    test.equals(8,hist.length);
});
