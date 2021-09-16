var fen = require("../index");
var t = require("tape");
const uuid = require("uuid");

t("test status", function (test) {
  test.plan(2);
  var game = new fen();
  test.equals("open_dev", game.getStatus());
  game.setAction("start");
  test.equals("inprogress", game.getStatus());
});
