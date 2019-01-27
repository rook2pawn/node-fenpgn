var fen = require('../index');
var t = require('tape');

t('test analyze fenstring', function(test) {
  test.plan(2);
  var analyze = fen.minmax.analyzeFenstring;
  const result = analyze("8/8/8/8/8/r7/n1b5/1B6", "black");
  test.equals(result, "c2b1")
  const result2 = analyze("8/8/8/8/8/r7/n1b5/1B6", "white");
  test.equals(result2, "b1c2")
});


t('test analyze board', function(test) {
  test.plan(1);
  var analyze = fen.minmax.analyzeBoard;
  const board = fen.minmax.fenPosToBoard("8/8/8/8/8/r7/n1b5/1B6");
  const result = analyze(board, "black");
  test.equals(result, "c2b1")
})


t('test pawn promo', function(test) {
  test.plan(2);
  var analyze = fen.minmax.analyzeFenstring;
  const result = analyze("8/8/8/8/8/1b6/PP5p/8", "black");
  test.equals(result, "h2h1q")
  const result2 = analyze("8/8/8/8/8/1b6/PP5p/1R6", "black");
  test.equals(result2, "b3a2", "black does not want promotion because of rook retake")
})


t('test no move available', function(test) {
  test.plan(5);
  var analyze = fen.minmax.analyzeFenstring;
  test.equal(analyze("8/8/3p4/8/8/1p6/8/1P6", "black"), "b3b2", "black will stop white from moving");
  test.equal(analyze("8/8/3p4/8/8/1p6/8/1P6", "white"), "b1b2", "white only has this move");

  test.equal(analyze("8/8/3p4/8/8/1p6/1P6/8", "white"), undefined, "white has no moves");
  test.equal(analyze("8/8/3p4/8/8/1p6/1P6/8", "black"), "d6d5", "blacks only move");
  test.equal(analyze("8/8/3p4/8/8/6pp/8/1P4P1", "white"), "b1b2", "black will retaliate against g1g2");

})
