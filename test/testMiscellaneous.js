var fen = require("../index");
var t = require("tape");
t("test not declaring new is okay", function (test) {
  test.plan(1);
  const game = fen();
  game.setBoardId("123");
  test.equal(game.getBoardId(), "123");
});

t("test setBoardId", function (test) {
  test.plan(1);
  const game = new fen();
  game.setBoardId("123");
  test.equal(game.getBoardId(), "123");
});

t("test boardSeat", function (test) {
  test.plan(3);
  const game = new fen();
  const whiteSeat = { foo: "baz" };
  const blackSeat = { foo: "bar" };
  game.setBlackSeat(blackSeat);
  game.setWhiteSeat(whiteSeat);
  test.deepEqual(game.blackSeat, blackSeat);
  test.deepEqual(game.whiteSeat, whiteSeat);
  test.deepEqual(game.getSeated(), { whiteSeat, blackSeat });
});

t("test empty", function (test) {
  test.plan(2);
  const game = new fen();
  game.empty();
  const game2 = new fen({ lite: true });
  game2.empty();
  test.deepEqual(game.board(), [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ]);
  test.deepEqual(game2.board(), [
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
  ]);
});

t("test getPieceAtPosition", function (test) {
  test.plan(1);
  const game = new fen();
  test.equal(game.getPieceAtPosition({ row: 7, col: 4 }), "K");
});
