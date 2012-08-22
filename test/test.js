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
exports.testActivePlayerAsPropertyOfHistory = function(test) {
    test.expect(3);
    var game = new fen();
    var tempGame = history = undefined;
//move 1
    tempGame = game.mm('e2e4');
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
exports.testfullmovenum = function(test) {
    test.expect(4);
    var game = new fen();
    var tempGame = game.mm('e2e4');
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
};
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
exports.testBoardToFenPos = function(test) {
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
    var game2 = new fen();
    var history = game.getHistory();
    history.shift(); // slide off the startposition
    var firsthistory = history.shift();// first history where there is a move
    var lasthistory = history.pop();
    test.expect(4);
    test.equals('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',game.toFenPos(h.startboard));
    test.equals('rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R',game.toFenPos(firsthistory.board));
    test.equals(game.toFenPos(newboard),game.toFenPos(lasthistory.board));
    test.equals('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',game2.toFenPos());
    test.done();
};
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
    test.equals(true,last.isCheckMove); 
    // check that history hasn't been screwed with
    var hist = game.getHistory();
    // 7 moves + 1 startpos history
    test.equals(8,hist.length);
    test.done();
};
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
