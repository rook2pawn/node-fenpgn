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
  t.equals(game.last().capturedPiece,'p','should capture black pawn p');
//  test.deepEqual(newboard.board,game.board());
});

test('testCapturePieceWhiteKnight',function(t) {
  var movelist = ['g1f3','d7d6','f3e5','d6e5'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  t.plan(1);
  t.equals(game.last().capturedPiece,'N','should capture white knight N');
//  test.deepEqual(newboard.board,game.board());
});

test('testCapturePiece No capture taking place',function(t) {
  var movelist = ['g1f3','d7d6'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  t.plan(1);
  t.equals(game.last().capturedPiece,'1','should capture empty space 1');
//  test.deepEqual(newboard.board,game.board());
});