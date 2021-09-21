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
      return 0;
      break;
  }
}

const evaluateBoard = function (board) {
  var totalEvaluation = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j]);
    }
  }
  return totalEvaluation;
};

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

function displayBoard(board) {
  board.forEach((row, idx) => {
    console.log(`${8 - idx}: ${row.join("")}`);
  });
}

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
var minimax = function (depth, board, isMaximizingPlayer) {
  var color = isMaximizingPlayer ? "white" : "black";
  if (depth === 0) {
    let num = evaluateBoard(board);
    count++;
    //    console.log(`depth is 0, returning eval:${num}`)
    return num;
  }
  var newGameMoves = generateMoves(board, color);
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
        minimax(depth - 1, result.board, !isMaximizingPlayer)
      );
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

var minimaxRoot = function ({ depth, board, isMaximizingPlayer }) {
  console.log("minimaxRoot:", depth, board, isMaximizingPlayer);
  return new Promise((resolve) => {
    const color = isMaximizingPlayer ? "white" : "black";
    const newGameMoves = generateMoves(board, color);
    let bestMoveFound;
    let bestMove;

    if (isMaximizingPlayer) {
      bestMove = -9999;
      for (let i = 0; i < newGameMoves.length; i++) {
        let newGameMove = newGameMoves[i];
        //          console.log("minimaxRoot: trying", newGameMove);
        let result = lib.updateBoardMSAN(board, newGameMove);
        console.log("result:", result);
        //          displayBoard(result.board)
        const value = minimax(depth - 1, result.board, !isMaximizingPlayer);
        //          console.log("minimaxRoot: color:", color, " value for ", newGameMove, " is :", value);
        if (value >= bestMove) {
          bestMove = value;
          bestMoveFound = newGameMove;
        }
      }
    } else {
      bestMove = 9999;
      for (let i = 0; i < newGameMoves.length; i++) {
        let newGameMove = newGameMoves[i];
        //          console.log("minimaxRoot: trying", newGameMove);
        let result = lib.updateBoardMSAN(board, newGameMove);
        //          displayBoard(result.board)
        const value = minimax(depth - 1, result.board, !isMaximizingPlayer);
        //          console.log("minimaxRoot: color:", color, " value for ", newGameMove, " is :", value);
        if (value <= bestMove) {
          bestMove = value;
          bestMoveFound = newGameMove;
        }
      }
    }
    console.log("COUNT:", count);
    count = 0;
    return resolve(bestMoveFound);
  });
};

function analyzeFenstring({ fenstring, color, depth = 2 }) {
  // color means find the best move for that color
  const isMaximizingPlayer = color == "white" ? true : false;
  const board = fenPosToBoard(fenstring);
  return minimaxRoot({ depth, board, isMaximizingPlayer });
}
exports.analyzeFenstring = analyzeFenstring;

function analyzeBoard({ board, color, depth = 2 }) {
  // color means find the best move for that color
  const isMaximizingPlayer = color == "white" ? true : false;
  return minimaxRoot({ depth, board, isMaximizingPlayer });
}
exports.analyzeBoard = analyzeBoard;
