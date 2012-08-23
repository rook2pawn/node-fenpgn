var fen = require('../index');
var h = require('../lib/help');
exports.testIsCheckMove = function(test) {
    test.expect(4);
    var game = new fen();
    var last = undefined;
    game.mm('e2e4');
    last = game.getLastHistory();
    test.equals(false,last.isCheckMove); 
    game.mm('a7a6');
    game.mm('e4e5');
    game.mm('a6a5');
    game.mm('e5e6');
    game.mm('a5a4');
    last = game.getLastHistory();
    test.equals(false,last.isCheckMove); 
    game.mm('e6d7');
    last = game.getLastHistory();
    console.log(last);
    test.equals(true,last.isCheckMove); 
    // check that history hasn't been screwed with
    var hist = game.getHistory();
    // 7 moves + 1 startpos history
    test.equals(8,hist.length);
    test.done();
};
