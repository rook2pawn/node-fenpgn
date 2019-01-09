var fen = require('../index');
var h = require('../lib/help');
var test = require('tape');
test('testIsMate',function(t) {
  t.plan(1);
  var game = new fen();
  // white just moved f4g5... killing mate move is d6e5
  var moves = 'e2e4 d7d5 d1h5 g8f6 h5h7 h8h7 e1e2 b8c6 e2e3 f6g4 e3f4 d8d6 f4g5 d6e5';
  moves.split(' ').forEach(function(move) {
    game.mm(move);
  });
  t.equals(game.isWhiteKingMated(),true,'white king is mated');
});

test('testIsNotMate',function(t) {
  t.plan(1);
  var game = new fen();
  // white just moved f4g5... killing mate move is d6e5
  var moves = 'e2e4 d7d5 d1h5 g8f6 h5h7 h8h7 e1e2 b8c6 e2e3 f6g4 e3f4 d8d6';
  moves.split(' ').forEach(function(move) {
    game.mm(move);
  });
  t.equals(game.isWhiteKingMated(),false,'white king is NOT mated');
});
