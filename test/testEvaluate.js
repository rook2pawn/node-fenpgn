var Evaluate = require("../minmax");
var t = require("tape");

t("test analyze fenstring", async function (test) {
  test.plan(2);
  const analyze = Evaluate.analyzeFenstring;
  const result = await analyze({
    fenstring: "8/8/8/8/8/r7/n1b5/1B6",
    color: "black",
  });
  test.equals(result.bestMove, "c2b1");
  const result2 = await analyze({
    fenstring: "8/8/8/8/8/r7/n1b5/1B6",
    color: "white",
  });
  test.equals(result2.bestMove, "b1c2");
});

t("test analyze board", async function (test) {
  test.plan(1);
  const board = Evaluate.fenPosToBoard("8/8/8/8/8/r7/n1b5/1B6");
  const result = await Evaluate.analyzeBoard({ board, color: "black" });
  test.equals(result.bestMove, "c2b1");
});

t("test wanting pawn promo", async function (test) {
  test.plan(1);
  const result = await Evaluate.analyzeFenstring({
    fenstring: "8/8/8/8/8/1n4B1/PP5p/8",
    color: "black",
  });
  test.equals(result.bestMove, "h2h1q");
});
t("test refusing pawn promo because of recapture", async function (test) {
  test.plan(1);
  const result = await Evaluate.analyzeFenstring({
    fenstring: "8/8/8/8/8/1b6/PP5p/1R6",
    color: "black",
  });
  test.equals(
    result.bestMove,
    "b3a2",
    "black does not want promotion because of rook retake but instead will take a pawn"
  );
});

t("test no move available", async function (test) {
  test.plan(4);
  var analyze = Evaluate.analyzeFenstring;
  const result = await await analyze({
    fenstring: "8/8/3p4/8/8/1p6/8/1P6",
    color: "black",
  });
  test.equal(result.bestMove, "b3b2", "black will stop white from moving");
  const result2 = await analyze({
    fenstring: "8/8/3p4/8/8/1p6/8/1P6",
    color: "white",
  });
  test.equal(result2.bestMove, "b1b2", "white only has this move");
  const result3 = await analyze({
    fenstring: "8/8/3p4/8/8/1p6/1P6/8",
    color: "white",
  });
  test.equal(result3.bestMove, undefined, "white has no moves");
  const result4 = await analyze({
    fenstring: "8/8/3p4/8/8/1p6/1P6/8",
    color: "black",
  });
  test.equal(result4.bestMove, "d6d5", "blacks only move");
});

t("test white must stop black promotion", async function (test) {
  test.plan(1);
  var analyze = Evaluate.analyzeFenstring;
  const result = await await analyze({
    fenstring: "8/8/3p4/8/8/8/r6p/1P4P1",
    color: "white",
  });
  test.equal(
    result.bestMove,
    "g1h2",
    "black will retaliate against anything other than g1h2"
  );
});

t("test white will ignore rook and go for mate", async function (test) {
  test.plan(1);
  var analyze = Evaluate.analyzeBoard;
  const board = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "B", "1", "P", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "Q", "1", "r"],
    ["P", "P", "P", "P", "1", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "1", "N", "R"],
  ];

  const result = await await analyze({ board, color: "white", depth: 1 });
  test.equal(result.bestMove, "f3f7", "white ignores rook and goes for mate");
});
