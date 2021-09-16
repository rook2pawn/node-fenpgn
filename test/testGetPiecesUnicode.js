var fen = require("../index");
var t = require("tape");
const uuid = require("uuid");

t("test getPiecesUnicode", function (test) {
  test.plan(1);
  const game = new fen();
  const x = game.getPiecesUnicode();
  test.deepEqual(x, {
    K: "♔", // U+2654
    Q: "♕", // U+2655
    R: "♖", // U+2656
    B: "♗", // U+2657
    N: "♘", // U+2658
    P: "♙", // U+2659

    k: "♚", //U+265A
    q: "♛", //U+265B
    r: "♜", // U+265C
    b: "♝", // U+265D
    n: "♞", // U+265E
    p: "♟", // U+265F

    1: " ", // blank
  });
});
