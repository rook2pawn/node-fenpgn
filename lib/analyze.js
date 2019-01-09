const lib = require("./help");


function getPieceValue (piece) {
    if (piece === '1') {
        return 0;
    }

    let color = 1; // 'white'
    let lc = piece.toLowerCase();
    if (piece === lc) {
      color = -1; // 'black'
    }
    switch (lc) {
      case 'p' :
      return 10*color;
      break;
      case 'r' :
      return 50*color;
      break;
      case 'n' :
      return 30*color;
      break;
      case 'b' :
      return 30*color;
      break;
      case 'q' :
      return 90*color;
      break;
      case 'k' :
      return 900*color;
      break;
      default:
      break;
    }
};

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
  console.log("fenPosToBoard:", fenPos)
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

function analyze(fenstring) {
  const board = fenPosToBoard(fenstring);
  const moves = lib.generateAllMoves(board,'white', {doNotCheck:true});
  return moves;
}

module.exports = exports = analyze;
