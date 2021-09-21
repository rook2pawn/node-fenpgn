// King starts off in check.
// This tests that the pawn cannot be taken
// AND that the knight can take the pawn
exports.BOARD1 = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "1", "p", "p", "p"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "b", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "N", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["P", "P", "P", "P", "1", "p", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

// tests that you can mate "before" the game starts
// since we allow the first move to implicitly allow open->inprogress
// and hence test that we can move to checkmate status.
exports.BOARD2 = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "B", "1", "P", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "Q", "1", "1"],
  ["P", "P", "P", "P", "1", "P", "P", "P"],
  ["R", "N", "B", "1", "K", "1", "N", "R"],
];

// test that computer response against a promoting pawn

exports.BOARD3 = [
  ["r", "n", "b", "1", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "1", "p", "p", "p"],
  ["1", "1", "1", "q", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "p", "1", "1", "1"],
  ["1", "1", "1", "1", "P", "1", "1", "1"],
  ["1", "1", "N", "1", "1", "N", "1", "1"],
  ["P", "p", "P", "P", "B", "P", "P", "P"],
  ["R", "1", "B", "Q", "1", "R", "K", "1"],
];

// test that computer response
// that white ignores capturing a rook in favor of mate
// that black will try to defend against mate

exports.BOARD4 = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "B", "1", "P", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "Q", "1", "r"],
  ["P", "P", "P", "P", "1", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "1", "N", "R"],
];
