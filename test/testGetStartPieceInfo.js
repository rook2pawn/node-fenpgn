var fen = require("../index");
var t = require("tape");
const uuid = require("uuid");

t("test getStartPieceInfo", function (test) {
  test.plan(1);
  const game = new fen();
  const info = game.getStartPieceInfo({
    msanMove: "e2e4",
    board: game.board(),
  });
  test.deepEqual(info, {
    startpiece: "P",
    color: "white",
    startRow: 6,
    startCol: 4,
    endRow: 4,
    endCol: 4,
  });
});
