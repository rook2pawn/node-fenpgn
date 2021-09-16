var fen = require("../index");
var t = require("tape");
const uuid = require("uuid");

t("test getAvailableSquares", function (test) {
  test.plan(1);
  const game = new fen();
  const x = game.getAvailableSquares({ row: 7, col: 1 });
  test.deepEqual(x, [
    { row: 5, col: 0 },
    { row: 5, col: 2 },
  ]);
});
