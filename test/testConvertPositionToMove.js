var fen = require("../index");
var t = require("tape");

t("test convertPositionToMove", function (test) {
  test.plan(1);
  const game = new fen();
  const msanMove = game.convertPositionToMove(
    { row: 6, col: 4 },
    { row: 4, col: 4 }
  );
  test.equal(msanMove, "e2e4");
});
