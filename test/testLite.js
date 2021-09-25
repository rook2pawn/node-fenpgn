var fen = require("../index");
var t = require("tape");
const uuid = require("uuid");

t("test lite", function (test) {
  test.plan(1);
  const historyMSAN = "e2e4";
  var game = new fen({ historyMSAN, lite: true });
  test.equals("b", game.getHistory().pop().activeplayer);
});
