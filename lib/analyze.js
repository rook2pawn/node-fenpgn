const lib = require("./help");
const CONSTANTS = require("./const");
exports.generateEmptyBoard = CONSTANTS.generateEmptyBoard;
exports.getAvailableSquares = lib.getAvailableSquares;
exports.getStartPieceInfo = lib.getStartPieceInfo;


function getPieceValue(piece) {
  if (piece === "1") {
    return 0;
  }

  let color = 1; // 'white'
  let lc = piece.toLowerCase();
  if (piece === lc) {
    color = -1; // 'black'
  }
  switch (lc) {
    case "p":
      return 10 * color;
      break;
    case "r":
      return 50 * color;
      break;
    case "n":
      return 30 * color;
      break;
    case "b":
      return 30 * color;
      break;
    case "q":
      return 90 * color;
      break;
    case "k":
      return 900 * color;
      break;
    default:
      return 0;
      break;
  }
}

const evaluateBoard = function(board) {
  var totalEvaluation = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j]);
    }
  }
  return totalEvaluation;
};

const fenPosToBoard = function(fenPos) {
//  console.log("fenPosToBoard:", fenPos);
  var lines = fenPos.split("/");
  // like haskell's replicate function
  var replicate = function(val, num) {
    var out = [];
    for (var i = 0; i < num; i++) {
      out.push(val);
    }
    return out;
  };
  var rep = function(substring, index, original) {
    var length = parseInt(substring);
    return replicate(1, length).join("");
  };
  var board = lines.map(function(val) {
    val = val.replace(/\d+/g, rep);
    return val.split("");
  });
  return board;
};
exports.fenPosToBoard = fenPosToBoard;

function displayBoard (board) {
  board.forEach((row, idx) => {
    console.log(`${8-idx}: ${row.join("")}`);
  })
}
var minimax = function(depth, board, isMaximizingPlayer) {
  var color = (isMaximizingPlayer) ? "white" : "black"
  if (depth === 0) {
    let num = evaluateBoard(board)
//    console.log(`depth is 0, returning eval:${num}`)
    return num;
  }
  var newGameMoves = lib.generateAllMovesNoKingSafety(board, color);
//  console.log("generated ", newGameMoves.length, " for color:", color);

  if (isMaximizingPlayer) {
//    console.log("isMaximizingPlayer")
    var bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
//      console.log(`trying ${newGameMoves[i]}`)
      let result = lib.updateBoardMSAN(board, newGameMoves[i]);
//      displayBoard(result.board)
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, result.board, !isMaximizingPlayer));
    }
    return bestMove;
  } else {
//    console.log("is NOT MaximizingPlayer")
    var bestMove = 9999;
    for (var i = 0; i < newGameMoves.length; i++) {
//      console.log(`trying ${newGameMoves[i]}`)
      let result = lib.updateBoardMSAN(board, newGameMoves[i]);
      bestMove = Math.min(
        bestMove,
        minimax(depth - 1, result.board, !isMaximizingPlayer)
      );
    }
    return bestMove;
  }
};

var minimaxRoot =function(depth, board, isMaximizingPlayer) {

    const color = isMaximizingPlayer ? "white" : "black"
    const newGameMoves = lib.generateAllMovesNoKingSafety(board, color);
//    console.log("newGameMoves:", newGameMoves, "isMaximizingPlayer:", isMaximizingPlayer)
    let bestMoveFound;
    let bestMove;

    if (isMaximizingPlayer) {
      bestMove = -9999;
      for(let i = 0; i < newGameMoves.length; i++) {
          let newGameMove = newGameMoves[i]
//          console.log("minimaxRoot: trying", newGameMove);
          let result = lib.updateBoardMSAN(board, newGameMove);
//          displayBoard(result.board)
          const value = minimax(depth - 1, result.board, !isMaximizingPlayer);
//          console.log("minimaxRoot: color:", color, " value for ", newGameMove, " is :", value);
          if(value >= bestMove) {
              bestMove = value;
              bestMoveFound = newGameMove;
          }
      }
    } else {
      bestMove = 9999;
      for(let i = 0; i < newGameMoves.length; i++) {
          let newGameMove = newGameMoves[i]
//          console.log("minimaxRoot: trying", newGameMove);
          let result = lib.updateBoardMSAN(board, newGameMove);
//          displayBoard(result.board)
          const value = minimax(depth - 1, result.board, !isMaximizingPlayer);
//          console.log("minimaxRoot: color:", color, " value for ", newGameMove, " is :", value);
          if(value <= bestMove) {
              bestMove = value;
              bestMoveFound = newGameMove;
          }
      }

    }
//    console.log("bestMove value:", bestMove, bestMoveFound);
    return bestMoveFound;
};

function analyzeFenstring(fenstring, color, depth) {
  depth = depth || 2;
  // color means find the best move for that color
  const isMaximizingPlayer = (color == "white") ? true : false;
  const board = fenPosToBoard(fenstring);
//  displayBoard(board)
  return minimaxRoot(depth, board, isMaximizingPlayer)
}
exports.analyzeFenstring = analyzeFenstring;

function analyzeBoard(board, color, depth) {
  depth = depth || 2;
  // color means find the best move for that color
  const isMaximizingPlayer = (color == "white") ? true : false;
  return minimaxRoot(depth, board, isMaximizingPlayer)
}
exports.analyzeBoard = analyzeBoard;
