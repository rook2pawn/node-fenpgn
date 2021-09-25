const lib = require("../lib/help");
const fen = require("../index");
const Evaluator = require("./evaluator");

const LOGGING = false;
const fenPosToBoard = function (fenPos) {
  var lines = fenPos.split("/");
  // like haskell's replicate function
  var replicate = function (val, num) {
    var out = [];
    for (var i = 0; i < num; i++) {
      out.push(val);
    }
    return out;
  };
  var rep = function (substring, index, original) {
    var length = parseInt(substring);
    return replicate(1, length).join("");
  };
  var board = lines.map(function (val) {
    val = val.replace(/\d+/g, rep);
    return val.split("");
  });
  return board;
};
exports.fenPosToBoard = fenPosToBoard;

const generateMoves = function (board, color) {
  const moves = [];
  var list = lib.getAllPieces(board, color);
  for (var i = 0; i < list.length; i++) {
    var row = list[i].row;
    var col = list[i].col;
    var piece = list[i].piece;

    const { safeSquares: squares } = lib.getAvailableSquares({
      board,
      row,
      col,
      opts: {},
      filterSelfCheckMoves: true,
    });
    for (var j = 0; j < squares.length; j++) {
      var newRow = squares[j].row;
      var newCol = squares[j].col;
      var fromPos = { row: row, col: col };
      var toPos = { row: newRow, col: newCol };
      var move = lib.generateMove(fromPos, toPos);
      // promo logic
      if (piece === "p" && newRow === 7) {
        move = move.concat("q");
      }
      if (piece === "P" && newRow === 0) {
        move = move.concat("Q");
      }
      moves.push(move);
    }
  }
  return moves;
};
let count = 0;
var minimax = function ({ depth, game, isMaximizingPlayer, move }) {
  var color = isMaximizingPlayer ? "white" : "black";

  LOGGING &&
    console.log(
      "minimax depth, color, isMaximizingPlayer, move that brought us here:",
      depth,
      color,
      isMaximizingPlayer,
      move
    );
  LOGGING && console.log("totalMoves so Far:", game.totalmovestring());
  LOGGING && game.displayBoard();

  if (depth === 0) {
    let num = Evaluator.evaluateBoard(game.stateLive().board);
    count++;
    return num;
  }
  var newGameMoves = game.allMoves();
  LOGGING && console.log("newGameMoves:", newGameMoves);
  if (isMaximizingPlayer) {
    var bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.mm(newGameMoves[i]);
      bestMove = Math.max(
        bestMove,
        minimax({
          depth: depth - 1,
          game,
          isMaximizingPlayer: !isMaximizingPlayer,
          move: newGameMoves[i],
        })
      );
      game.takeBack();
    }
    return bestMove;
  } else {
    var bestMove = 9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.mm(newGameMoves[i]);
      bestMove = Math.min(
        bestMove,
        minimax({
          depth: depth - 1,
          game,
          isMaximizingPlayer: !isMaximizingPlayer,
          move: newGameMoves[i],
        })
      );
      game.takeBack();
    }
    return bestMove;
  }
};

var minimaxRoot = function ({ depth, board, color }) {
  const game = new fen({ customStartBoard: board, startingColor: color });

  LOGGING && game.displayBoard();
  return new Promise((resolve) => {
    const isMaximizingPlayer = color === "white" ? true : false;
    const newGameMoves = game.allMoves();
    LOGGING && console.log("newGameMoves ROOT:", newGameMoves);

    let bestMoveFound;
    let bestMove;

    if (isMaximizingPlayer) {
      bestMove = -9999;
      for (let i = 0; i < newGameMoves.length; i++) {
        let newGameMove = newGameMoves[i];
        game.mm(newGameMove);
        const value = minimax({
          depth: depth - 1,
          game,
          isMaximizingPlayer: !isMaximizingPlayer,
          move: newGameMove,
        });
        LOGGING && console.log("value:", value, "move:", newGameMove);
        game.takeBack();
        if (value >= bestMove) {
          bestMove = value;
          bestMoveFound = newGameMove;
        }
      }
    } else {
      bestMove = 9999;
      for (let i = 0; i < newGameMoves.length; i++) {
        let newGameMove = newGameMoves[i];
        game.mm(newGameMove);
        const value = minimax({
          depth: depth - 1,
          game,
          isMaximizingPlayer: !isMaximizingPlayer,
          move: newGameMove,
        });

        LOGGING && console.log("value:", value, "move:", newGameMove);
        game.takeBack();
        if (value <= bestMove) {
          bestMove = value;
          bestMoveFound = newGameMove;
        }
      }
    }
    LOGGING && console.log("COUNT:", count);
    count = 0;
    return resolve(bestMoveFound);
  });
};

function analyzeFenstring({ fenstring, color, depth = 2 }) {
  const board = fenPosToBoard(fenstring);
  return minimaxRoot({ depth, board, color });
}
exports.analyzeFenstring = analyzeFenstring;

function analyzeBoard({ board, color, depth = 2 }) {
  return minimaxRoot({ depth, board, color });
}
exports.analyzeBoard = analyzeBoard;
