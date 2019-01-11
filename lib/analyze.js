const lib = require("./help");

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
  console.log("fenPosToBoard:", fenPos);
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
function displayBoard (board) {
  board.forEach((row, idx) => {
    console.log(`${8-idx}: ${row.join("")}`);
  })
}
var minimax = function(depth, board, isWhite) {
  var color = (isWhite) ? "white" : "black"
  if (depth === 0) {
    return -evaluateBoard(board);
  }
  var newGameMoves = lib.generateAllMovesNoKingSafety(board, color);
  console.log("generated ", newGameMoves.length, " moves")
  if (isWhite) {
    var bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      let result = lib.updateBoardMSAN(board, newGameMoves[i]);
      displayBoard(result.board)
      bestMove = Math.max(
        bestMove,
        minimax(depth - 1, result.board, !isWhite));
    }
    return bestMove;
  } else {
    var bestMove = 9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      let result = lib.updateBoardMSAN(board, newGameMoves[i]);
      bestMove = Math.min(
        bestMove,
        minimax(depth - 1, result.board, !isWhite)
      );
    }
    return bestMove;
  }
};

var minimaxRoot =function(depth, board, isWhite) {

    const color = isWhite ? "white" : "black"
    var newGameMoves = lib.generateAllMovesNoKingSafety(board, color);
    console.log("newGameMoves:", newGameMoves)
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        console.log("minimaxRoot: trying", newGameMove);
        let result = lib.updateBoardMSAN(board, newGameMove);
        var value = minimax(depth - 1, result.board, !isWhite);
        console.log("minimaxRoot: color:", color, " value for ", newGameMove, " is :", value);
        //game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

function analyze(fenstring) {
  const board = fenPosToBoard(fenstring);
  console.log("original board:");
  displayBoard(board)
  let finalValue = minimaxRoot(2, board, true)
  console.log("finalValue:", finalValue)
//  return moves;
}

module.exports = exports = analyze;
