var fen = require('../index');
var h = require('../lib/help');
var t = require('tape');

t('testStateCheck',function(test) {
  var movelist = ['g1f3','d7d5','f3g5','d5d4','e2e4','d4e3','f1e2','a7a6','e1g1','e3d2','a2a3','d2c1q'];
  var newboard = h.getInitialState();
  for (var i = 0; i < movelist.length; i++) {
    newboard = h.updateBoardMSAN(newboard,movelist[i]);
  }
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  test.plan(1);
  test.deepEqual(newboard.board,game.board());
});
