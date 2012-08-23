var fen = require('../index');

exports.testActivePlayerAsPropertyOfHistory = function(test) {
    test.expect(3);
    var game = new fen();
    var tempGame = history = undefined;
//move 1
    tempGame = game.mm('e2e4');
    history = tempGame.getHistory();
    console.log(history);
    test.equals('b',history.pop().activeplayer);
//move 2
    tempGame = tempGame.mm('e7e5');
    history = tempGame.getHistory();
    test.equals('w',history.pop().activeplayer);
//move3
    tempGame = tempGame.mm('g1f3');
    history = tempGame.getHistory();
    test.equals('b',history.pop().activeplayer);
    test.done();
};
