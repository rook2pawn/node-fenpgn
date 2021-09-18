const deep = require("deep-copy");
const scenarioBoards = require("./testScenarioBoards");

const REFERENCE_START = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const TESTBOARD = scenarioBoards.BOARD3;
const emptyboard = [
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
  ["1", "1", "1", "1", "1", "1", "1", "1"],
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

  1: " ", // blank
};
exports.piecesUnicode = piecesUnicode;

const generateInitialState = function ({ useTestBoard = false } = {}) {
  return {
    board: deep(useTestBoard ? TESTBOARD : REFERENCE_START),
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
    promoPiece: {},
    winner: "",
    fenpos: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  };
};
exports.generateInitialState = generateInitialState;

const generateInitialStateLite = function (isEmpty = false) {
  return {
    board: deep(isEmpty ? emptyboard : REFERENCE_START),
    time: new Date().getTime(),
    move: "",
    totalmovestring: "",
    halfmove: 0,
    moveNum: 0,
    activeplayer: "w",
    fullmovenum: 1,
  };
};
exports.generateInitialStateLite = generateInitialStateLite;
