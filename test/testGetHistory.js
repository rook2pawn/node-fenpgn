var fen = require("../index");
var t = require("tape");

t("test getHistory", function (test) {
  test.plan(1);
  const game = new fen();
  game.move("e2e4");
  const history = game.getHistory();
  test.deepEqual(history[history.length - 1].movedPiece, {
    row: 6,
    col: 4,
    piece: "P",
  });
});
