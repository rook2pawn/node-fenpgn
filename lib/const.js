const deep = require("deep-copy");

const startboard = [
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["r", "n", "b", "q", "k", "b", "n", "r"]
];

const emptyboard = [
["1", "1", "1", "1", "1", "1", "1", "1"],
["1", "1", "1", "1", "1", "1", "1", "1"],
["1", "1", "1", "1", "1", "1", "1", "1"],
["1", "1", "1", "1", "1", "1", "1", "1"],
["1", "1", "1", "1", "1", "1", "1", "1"],
["1", "1", "1", "1", "1", "1", "1", "1"],
["1", "1", "1", "1", "1", "1", "1", "1"],
["1", "1", "1", "1", "1", "1", "1", "1"]
];

const piecesUnicode = {
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

  1: " " // blank
};

const generateInitialState = function() {
  return {
    board: deep(startboard),
    move: "",
    totalmovestring: "",
    halfmove: 0,
    moveNum: 0,
    time: new Date().getTime(),
    activeplayer: "w",
    fullmovenum: 1,
    enpassantsquare: "-",
    whiteKingsideCastleAvailable: true,
    whiteQueensideCastleAvailable: true,
    blackKingsideCastleAvailable: true,
    blackQueensideCastleAvailable: true,
    whiteChecked: false,
    blackChecked: false,
    capturedPiece: "",
    stalemate: false,
    winner: "",
    fenpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  };
}
exports.generateInitialState = generateInitialState;

const generateInitialStateLite = function() {
  return {
    board: deep(emptyboard),
    time: new Date().getTime(),
    move: "",
    totalmovestring : "",
    halfmove: 0,
    moveNum: 0,
    activeplayer: "w",
    fullmovenum: 1
  };
};
exports.generateInitialStateLite = generateInitialStateLite;
