var fen = require('../index');
var h = require('../lib/help');
var t = require('tape');
t('testIsCheckMove',function(test) {
    test.plan(6);
    var game = new fen();
    game.mm('e2e4');
    test.equals(game.getLastHistory().blackChecked,false);
    game.mm('a7a6');
    game.mm('e4e5');
    game.mm('a6a5');
    game.mm('e5e6');
    game.mm('a5a4');
    test.equals(game.getLastHistory().blackChecked,false);
    test.equals(game.getActivePlayer(),'white')
    debugger;
    game.mm('e6d7');
    test.equals(game.getActivePlayer(),'black')
    test.equals(game.getLastHistory().blackChecked,true);
    // check that history hasn't been screwed with
    var hist = game.getHistory();
    // 7 moves + 1 startpos history
    test.equals(8,hist.length);
});
