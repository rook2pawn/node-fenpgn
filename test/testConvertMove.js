var fen = require("../index");
var t = require("tape");
const uuid = require("uuid");

t("test convertMove", function (test) {
  test.plan(1);
  var game = new fen();
  let x = game.convertMoveToPosition("e2e4");
  test.deepEqual(x, { start: { row: 2, col: 5 }, end: { row: 4, col: 5 } });
});
