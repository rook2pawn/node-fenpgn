var fen = require("../index");
var t = require("tape");

t("test totalMoveString", function (test) {
  test.plan(1);
  const game = new fen();
  game.move("e2e4");
  game.move("d7d6");
  const ms = game.totalmovestring();
  test.equal(ms, "e2e4 d7d6");
});
