var fen = require('../index');
var h = require('../lib/help');
exports.testStateCheck = function(test) {
    var newboard = h.updateBoardMSAN(h.startboard,'g1f3');
    newboard = h.updateBoardMSAN(newboard,'d7d5');
    newboard = h.updateBoardMSAN(newboard,'f3g5');
    newboard = h.updateBoardMSAN(newboard,'d5d4');
    newboard = h.updateBoardMSAN(newboard,'e2e4');
    newboard = h.updateBoardMSAN(newboard,'d4e3');
    newboard = h.updateBoardMSAN(newboard,'f1e2');
    newboard = h.updateBoardMSAN(newboard,'a7a6');
    newboard = h.updateBoardMSAN(newboard,'e1g1');
    newboard = h.updateBoardMSAN(newboard,'e3d2');
    newboard = h.updateBoardMSAN(newboard,'a2a3');
    newboard = h.updateBoardMSAN(newboard,'d2c1q');

    var game = new fen();
    game 
        .mm('g1f3')
        .mm('d7d5')
        .mm('f3g5')
        .mm('d5d4')
        .mm('e2e4')
        .mm('d4e3')
        .mm('f1e2')
        .mm('a7a6')
        .mm('e1g1')
        .mm('e3d2')
        .mm('a2a3')
        .mm('d2c1q')
    ;
    test.expect(3);
    test.deepEqual(newboard,game.board());
    test.deepEqual(newboard.slice(0).reverse(),game.boardView());
    test.deepEqual(newboard,game.board());
    test.done();
};
