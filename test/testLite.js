var fen = require("../index");
var t = require("tape");
const uuid = require("uuid");

t("test lite", function (test) {
  test.plan(1);
  const history = "e2e4";
  var game = new fen({ history, lite: true });
  test.equals("b", game.getHistory().pop().activeplayer);
});
