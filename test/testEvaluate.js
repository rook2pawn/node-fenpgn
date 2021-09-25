var Evaluate = require("../minmax");
var t = require("tape");

t("test analyze fenstring", async function (test) {
  test.plan(2);
  const analyze = Evaluate.analyzeFenstring;
  const result = await analyze({
    fenstring: "8/8/8/8/8/r7/n1b5/1B6",
    color: "black",
  });
  test.equals(result, "c2b1");
  const result2 = await analyze({
    fenstring: "8/8/8/8/8/r7/n1b5/1B6",
    color: "white",
  });
  test.equals(result2, "b1c2");
});

t("test analyze board", async function (test) {
  test.plan(1);
  const board = Evaluate.fenPosToBoard("8/8/8/8/8/r7/n1b5/1B6");
  const result = await Evaluate.analyzeBoard({ board, color: "black" });
  test.equals(result, "c2b1");
});

t("test wanting pawn promo", async function (test) {
  test.plan(1);
  const result = await Evaluate.analyzeFenstring({
    fenstring: "8/8/8/8/8/1n4B1/PP5p/8",
    color: "black",
  });
  test.equals(result, "h2h1q");
});
t("test refusing pawn promo because of recapture", async function (test) {
  test.plan(1);
  const result2 = await Evaluate.analyzeFenstring({
    fenstring: "8/8/8/8/8/1b6/PP5p/1R6",
    color: "black",
  });
  test.equals(
    result2,
    "b3a2",
    "black does not want promotion because of rook retake but instead will take a pawn"
  );
});

t("test no move available", async function (test) {
  test.plan(4);
  var analyze = Evaluate.analyzeFenstring;
  test.equal(
    await analyze({ fenstring: "8/8/3p4/8/8/1p6/8/1P6", color: "black" }),
    "b3b2",
    "black will stop white from moving"
  );
  test.equal(
    await analyze({ fenstring: "8/8/3p4/8/8/1p6/8/1P6", color: "white" }),
    "b1b2",
    "white only has this move"
  );

  test.equal(
    await analyze({ fenstring: "8/8/3p4/8/8/1p6/1P6/8", color: "white" }),
    undefined,
    "white has no moves"
  );
  test.equal(
    await analyze({ fenstring: "8/8/3p4/8/8/1p6/1P6/8", color: "black" }),
    "d6d5",
    "blacks only move"
  );
});

t("test white must stop black promotion", async function (test) {
  test.plan(1);
  var analyze = Evaluate.analyzeFenstring;
  test.equal(
    await analyze({ fenstring: "8/8/3p4/8/8/8/r6p/1P4P1", color: "white" }),
    "g1h2",
    "black will retaliate against anything other than g1h2"
  );
});
