var fen = require("../index");
var h = require("../lib/help");
var t = require("tape");

t("testFenPos board2FenPos and FenPosToboard", function (test) {
  test.plan(2);
  var game = new fen();
  const intialFenPos = game.getFenPos();
  const calculatedFenPos = h.boardToFenPos(game.stateLive());
  test.equal(calculatedFenPos, intialFenPos);
  test.deepEqual(h.fenPosToBoard(intialFenPos), game.board());
});

t("testFenPos Position - first move", function (test) {
  test.plan(1);
  const historyMSAN = "e2e4";
  var game = new fen({ historyMSAN });
  test.equals(
    game.getFenPos(),
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
  );
});

t("testFenPos Position - first and second move", function (test) {
  test.plan(1);
  const historyMSAN = "e2e4 c7c5";
  var game = new fen({ historyMSAN });
  test.equals(
    game.getFenPos(),
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2"
  );
});

t("testFenPos Position - first, second, third move", function (test) {
  test.plan(1);
  const historyMSAN = "e2e4 c7c5 g1f3";
  var game = new fen({ historyMSAN });
  test.equals(
    game.getFenPos(),
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
  );
});

t("testFenPos Position - basic test", function (test) {
  test.plan(1);
  const historyMSAN = "g1f3 b8c6 e2e4 g8f6 e4e5 f6e4 d2d3 e4c5 d3d4 c5e4";
  var game = new fen({ historyMSAN });
  test.equals(
    game.getFenPos(),
    "r1bqkb1r/pppppppp/2n5/4P3/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq - 1 6"
  );
});

t("testFenPos Position - white kingside castle", function (test) {
  test.plan(1);
  const historyMSAN =
    "g1f3 b8c6 e2e4 g8f6 e4e5 f6e4 d2d3 e4c5 d3d4 c5e4 f1e2 a7a6 e1g1";
  var game = new fen({ historyMSAN });
  test.equals(
    game.getFenPos(),
    "r1bqkb1r/1ppppppp/p1n5/4P3/3Pn3/5N2/PPP1BPPP/RNBQ1RK1 b kq - 1 7"
  );
});

t(
  "testFenPos Position - white kingside castle no longer available but queenside open",
  function (test) {
    test.plan(1);
    const historyMSAN = "g1f3 g8f6 e2e4 g7g6 f1e2 f8g7 h1f1";
    var game = new fen({ historyMSAN });
    test.equals(
      game.getFenPos(),
      "rnbqk2r/ppppppbp/5np1/8/4P3/5N2/PPPPBPPP/RNBQKR2 b Qkq - 3 4"
    );
  }
);

t("testFenPos Position - black kingside castle", function (test) {
  test.plan(1);
  const historyMSAN = "g1f3 g8f6 e2e4 g7g6 f1e2 f8g7 h1f1 e8g8";
  var game = new fen({ historyMSAN });
  test.equals(
    game.getFenPos(),
    "rnbq1rk1/ppppppbp/5np1/8/4P3/5N2/PPPPBPPP/RNBQKR2 w Q - 4 5"
  );
});

t("testFenPos Position - no castle available", function (test) {
  test.plan(1);
  const historyMSAN = "g1f3 g8f6 e2e4 g7g6 f1e2 f8g7 h1g1 e8g8 e1f1";
  var game = new fen({ historyMSAN });
  test.equals(
    game.getFenPos(),
    "rnbq1rk1/ppppppbp/5np1/8/4P3/5N2/PPPPBPPP/RNBQ1KR1 b - - 5 5"
  );
});

t("testFenPos Position - white queenside castle", function (test) {
  test.plan(1);
  const historyMSAN = "b1c3 b8c6 b2b3 b7b6 c1b2 c8b7 e2e3 e7e6 d1e2 d8e7 e1c1";
  var game = new fen({ historyMSAN });
  test.equals(
    game.getFenPos(),
    "r3kbnr/pbppqppp/1pn1p3/8/8/1PN1P3/PBPPQPPP/2KR1BNR b kq - 3 6"
  );
});

t(
  "testFenPos Position - white queenside castle not available",
  function (test) {
    test.plan(1);
    const historyMSAN =
      "b1c3 b8c6 b2b3 b7b6 c1b2 c8b7 e2e3 e7e6 d1e2 d8e7 a1b1";
    var game = new fen({ historyMSAN });
    test.equals(
      game.getFenPos(),
      "r3kbnr/pbppqppp/1pn1p3/8/8/1PN1P3/PBPPQPPP/1R2KBNR b Kkq - 3 6"
    );
  }
);
