var fen = require("../index");
var t = require("tape");

t("test reset", function (test) {
  test.plan(2);
  const game = new fen();
  game.move("e2e4");
  const b = game.board();
  test.equal("1", b[6][4]);
  game.reset();
  const c = game.board();
  test.equal("P", c[6][4]);
});

t("test reset - lite", function (test) {
  test.plan(2);
  const game = new fen({ lite: true });
  game.move("e2e4");
  const b = game.board();
  console.log(JSON.stringify(b));
  test.equal("1", b[6][4]);
  game.reset();
  const c = game.board();
  test.equal("P", c[6][4]);
});
