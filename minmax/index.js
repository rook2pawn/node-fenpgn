const lib = require("../lib/help");
const fen = require("../index");
const Evaluator = require("./evaluator");

const LOGGING = false;
const useAB = true;
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

var minimaxRoot = function ({ depth, board, color }) {
  let count = 0;
  let movesMade = 0;

  const minimax = function ({
    depth,
    game,
    isMaximizingPlayer,
    move,
    alpha,
    beta,
  }) {
    var color = isMaximizingPlayer ? "white" : "black";

    LOGGING &&
      console.log(
        "\n****\nminimax depth, color, isMaximizingPlayer, move that brought us here:",
        depth,
        color,
        isMaximizingPlayer,
        move
      );
    LOGGING && console.log("totalMoves so Far:", game.totalmovestring());
    LOGGING && game.displayBoard();

    if (depth === 0) {
      let num = Evaluator.evaluateBoard({ last: game.stateLive() });
      count++;
      return num;
    }
    var newGameMoves = game.allMoves();
    LOGGING && console.log("newGameMoves:", newGameMoves);
    if (isMaximizingPlayer) {
      var bestMove = -9999;
      for (var i = 0; i < newGameMoves.length; i++) {
        game.mm(newGameMoves[i]);
        movesMade++;
        let value = minimax({
          depth: depth - 1,
          game,
          isMaximizingPlayer: !isMaximizingPlayer,
          move: newGameMoves[i],
          alpha,
          beta,
        });
        alpha = Math.max(alpha, value);
        bestMove = Math.max(bestMove, value);
        game.takeBack();
        if (useAB && beta <= alpha) {
          break;
        }
      }
      return bestMove;
    } else {
      var bestMove = 9999;
      for (var i = 0; i < newGameMoves.length; i++) {
        game.mm(newGameMoves[i]);
        movesMade++;
        let value = minimax({
          depth: depth - 1,
          game,
          isMaximizingPlayer: !isMaximizingPlayer,
          move: newGameMoves[i],
          alpha,
          beta,
        });
        beta = Math.min(beta, value);
        bestMove = Math.min(bestMove, value);
        game.takeBack();
        if (useAB && beta <= alpha) {
          break;
        }
      }
      return bestMove;
    }
  };

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
        movesMade++;
        const value = minimax({
          depth: depth - 1,
          game,
          isMaximizingPlayer: !isMaximizingPlayer,
          move: newGameMove,
          alpha: -50000,
          beta: 50000,
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
        movesMade++;
        const value = minimax({
          depth: depth - 1,
          game,
          isMaximizingPlayer: !isMaximizingPlayer,
          move: newGameMove,
          alpha: -50000,
          beta: 50000,
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
    return resolve({ bestMove: bestMoveFound, movesMade, count });
  });
};

function analyzeFenstring({ fenstring, color, depth = 2 }) {
  const startTime = Date.now();
  const board = fenPosToBoard(fenstring);
  return minimaxRoot({ depth, board, color }).then(
    ({ bestMove, movesMade, count }) => {
      const finishTime = Date.now();
      const diff = finishTime - startTime;
      return Promise.resolve({
        depth,
        bestMove,
        movesMade,
        positionsEvaluated: count,
        ms: diff,
      });
    }
  );
}
exports.analyzeFenstring = analyzeFenstring;

function analyzeBoard({ board, color, depth = 2 }) {
  const startTime = Date.now();
  return minimaxRoot({ depth, board, color }).then(
    ({ bestMove, movesMade, count }) => {
      const finishTime = Date.now();
      const diff = finishTime - startTime;
      return Promise.resolve({
        depth,
        bestMove,
        movesMade,
        positionsEvaluated: count,
        ms: diff,
      });
    }
  );
}
exports.analyzeBoard = analyzeBoard;
