var fen = require("../index");
var t = require("tape");

t("testActivePlayerAsPropertyOfHistory", function (test) {
  test.plan(4);
  var game = new fen();

  test.equals("w", game.stateLive().activeplayer);
  //move 1
  game.mm("e2e4");
  test.equals("b", game.stateLive().activeplayer);
  //move 2
  game.mm("e7e5");
  test.equals("w", game.stateLive().activeplayer);
  //move3
  game.mm("g1f3");
  test.equals("b", game.stateLive().activeplayer);
});
