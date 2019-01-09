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
  t.deepEqual(game.last().capturedPiece,{piece:'p', row:3, col:3},'should capture black pawn p');
});

test('testCapturePieceWhiteKnight',function(t) {
  var movelist = ['g1f3','d7d6','f3e5','d6e5'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  t.plan(1);
  t.deepEqual(game.last().capturedPiece,{piece:'N', row:3,col:4},'should capture white knight N');
});

test('testCapturePiece No capture taking place',function(t) {
  var movelist = ['g1f3','d7d6'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  t.plan(1);
  t.deepEqual(game.last().capturedPiece,{ piece: '1', row: 2, col: 3 },'should capture empty space 1');
//  test.deepEqual(newboard.board,game.board());
});

test('testCapturePiece No capture taking place',function(t) {
  var movelist = ['g1f3','d7d5'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
  }
  t.plan(1);
  t.deepEqual(game.last().capturedPiece,{ piece: '1', row: 3, col: 3 },'should capture empty space 1');
//  test.deepEqual(newboard.board,game.board());
});

test('testCapturePiece enpassant - white captures black',function(t) {
  t.plan(3);

  var movelist = ['e2e4','b8a6','e4e5', 'd7d5', 'e5d6'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
    if (i === 3) {
      // on d7d5 we check that black pawn is at row 3 col 3
      t.equals(game.board()[3][3], 'p', 'should be black pawn here')
    }
  }
  t.deepEqual(game.last().capturedPiece,{ piece: 'p', row: 2, col: 3 },'should capture empty enpassant square');
  t.equals(game.board()[3][3], '1', 'should remove the black pawn');
});


test('testCapturePiece enpassant - black captures white',function(t) {
  t.plan(3);

  var movelist = ['b1a3','d7d5', 'a3b1', 'd5d4', 'e2e4', 'd4e3'];
  var game = new fen;
  for (var i = 0; i < movelist.length; i++) {
    game.mm(movelist[i]);
    if (i === 4) {
      // on e2e4 we check that white pawn is at row 5 col 4
      t.equals(game.board()[4][4], 'P', 'should be black pawn here')
    }
  }
  t.deepEqual(game.last().capturedPiece,{ piece: 'P', row: 5, col: 4 },'should capture empty enpassant square');
  t.equals(game.board()[4][4], '1', 'should remove the white pawn');
});
