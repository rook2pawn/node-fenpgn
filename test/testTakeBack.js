var fen = require('../index');
var h = require('../lib/help');
exports.testTakeBack = function(test) {
    test.expect(3);
    var game = new fen();
    game.mm('e2e4');
    var hist = game.getHistory();
    test.equals(2, hist.length);
    game.takeBack();
    hist = game.getHistory();
    test.equals(1,hist.length);
    game.mm('g1f3');
    game.mm('d7d6');
    game.takeBack();
    hist = game.getHistory();
    var last = hist.pop();
    test.equals('g1f3',last.move);
    test.done();
};
