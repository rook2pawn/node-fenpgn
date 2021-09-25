var openings = require("./openings/openings.js");
var mobility = function (histitem) {
  var black = 0;
  var white = 0;
  var b = histitem.board;
  for (var row = 0; row <= 7; row++) {
    for (var col = 0; col <= 7; col++) {
      var piece = b[row][col];
      if (piece !== "1") {
        var color = piece == piece.toLowerCase() ? "black" : "white";
        var squares = fen.getAvailableSquares({
          histitem: histitem,
          row: row,
          col: col,
          enpassantsquare: fen.enpassantsquare,
        });
        if (color == "black") black += squares.availableSquares.length;
        else white += squares.availableSquares.length;
      }
    }
  }
  return { black: black, white: white };
};
var difference = function (obj1, obj2) {
  var diffset = {};
  diffset.black = obj1.black - obj2.black;
  diffset.white = obj1.white - obj2.white;
  return diffset;
};
exports.mobility = mobility;
exports.difference = difference;
