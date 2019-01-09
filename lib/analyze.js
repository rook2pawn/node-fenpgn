const lib = require("./help");

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
