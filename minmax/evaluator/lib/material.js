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

const evaluate_material = function (board) {
  var totalEvaluation = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j]);
    }
  }
  return totalEvaluation;
};
module.exports = exports = evaluate_material;
