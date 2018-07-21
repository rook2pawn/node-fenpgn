var fen = require('../index');
var h = require('../lib/help');
var test = require('tape');

test('testCapturePieceBlackPawn',function(t) {
  var movelist = ['e2e4','d7d5','e4d5'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  t.plan(1);
  t.deepEqual(game.last().capturedPiece,{piece:'p', row:4, col:3},'should capture black pawn p');
});

test('testCapturePieceWhiteKnight',function(t) {
  var movelist = ['g1f3','d7d6','f3e5','d6e5'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  t.plan(1);
  t.deepEqual(game.last().capturedPiece,{piece:'N', row:4,col:4},'should capture white knight N');
});

test('testCapturePiece No capture taking place',function(t) {
  var movelist = ['g1f3','d7d6'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  t.plan(1);
  t.deepEqual(game.last().capturedPiece,{ piece: '1', row: 5, col: 3 },'should capture empty space 1');
//  test.deepEqual(newboard.board,game.board());
});
