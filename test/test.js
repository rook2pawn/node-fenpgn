var fen = require('../index');
var h = require('../help');
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

var game = 
fen()
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
exports.testStateCheck = function(test) {
    test.expect(2);
    test.deepEqual(newboard,game.board());
    test.deepEqual(newboard.slice(0).reverse(),game.boardView());
    test.done();
};
exports.testActivePlayer = function(test) {
    test.expect(3);
    var tempGame = history = undefined;
//move 1
    tempGame = fen().mm('e2e4');
    history = tempGame.getHistory();
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
exports.testBoardToFenPos = function(test) {
    var history = game.getHistory();
    var firsthistory = history.shift();
    var lasthistory = history.pop();
    test.expect(3);
    test.equals('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',game.boardToFenPos(h.startboard));
    test.equals('rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R',game.boardToFenPos(firsthistory.board));
    test.equals(game.boardToFenPos(newboard),game.boardToFenPos(lasthistory.board));
    test.done();
};
exports.testfullmovenum = function(test) {
    test.expect(4);
    var tempGame = fen().mm('e2e4');
    var lasthist = tempGame.getHistory().pop();
    test.equals(0,lasthist.fullmovenum);
    tempGame = tempGame.mm('e7e5');
    lasthist = tempGame.getHistory().pop();
    test.equals(1,lasthist.fullmovenum);
    tempGame = tempGame.mm('g1f3');
    lasthist = tempGame.getHistory().pop();
    test.equals(1,lasthist.fullmovenum);
    tempGame = tempGame.mm('d6d5');
    lasthist = tempGame.getHistory().pop();
    test.equals(2,lasthist.fullmovenum);
    test.done();
}
