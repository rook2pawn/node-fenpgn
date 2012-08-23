var fen = require('../index');
var h = require('../lib/help');
exports.testGetActivePlayer = function(test) {
    test.expect(4);
    var active = undefined;
    var game = new fen();
    active = game.getActivePlayer();
    test.equals('white',active);
    game.mm('e2e4');
    active = game.getActivePlayer();
    test.equals('black',active);
    game.mm('e7e5').mm('g1f3');
    active = game.getActivePlayer();
    test.equals('black',active);
    game.mm('d7d6');
    active = game.getActivePlayer();
    test.equals('white',active);
    test.done();
};
