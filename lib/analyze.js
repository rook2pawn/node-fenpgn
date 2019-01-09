const lib = require("./help");

const generateAllMoves = function(board, color) {
  const moves = [];
  var list = getAllPieces(board, color);
  for (var i = 0; i < list.length; i++) {
    var row = list[i].row;
    var col = list[i].col;
    var piece = list[i].piece;
    var results = getAvailableSquares(board, row, col);
    var squares = results.availableSquares;
    for (var j = 0; j < squares.length; j++) {
      var newRow = squares[j].row;
      var newCol = squares[j].col;
      var fromPos = { row: row, col: col };
      var toPos = { row: newRow, col: newCol };
      var move = generateMove(fromPos, toPos);
      var resp = updateBoardMSAN(last, move);
      var isCheckedColor = isKingCheckedColor(resp.board, color);
      if (isCheckedColor === false) {
        moves.push(move);
      }
    }
  }
  return moves;
}
// returns a list of moveable squares
var getAvailableSquares = function(board, row, col, opts) {
  opts = opts || {};
  const blackKingsideCastleAvailable = opts.blackKingsideCastleAvailable;
  const blackQueensideCastleAvailable = opts.blackQueensideCastleAvailable;
  const whiteKingsideCastleAvailable = opts.whiteKingsideCastleAvailable;
  const whiteQueensideCastleAvailable = opts.whiteQueensideCastleAvailable;
  const enpassantsquare = opts.enpassantsquare;

  var piece = board[row][col];
  var color = undefined;
  if (isUpperCase(piece)) {
    color = "white";
  } else {
    color = "black";
  }
  var squares = [];
  var threatenedSquares = [];
  var psquares = []; // potentialsquares
  switch (piece) {
    case "p":
      if (row - 1 < 0) {
        break;
      }
      if (board[row - 1][col] === "1") {
        psquares.push({ row: row - 1, col: col });
        if (row === 6 && board[row - 2][col] === "1") {
          psquares.push({ row: row - 2, col: col });
        }
      }
      if (board[row - 1][col - 1] !== undefined) {
        if (
          board[row - 1][col - 1] !== "1" &&
          isUpperCase(board[row - 1][col - 1])
        ) {
          psquares.push({ row: row - 1, col: col - 1 });
        }
      }
      if (board[row - 1][col + 1] !== undefined) {
        if (
          board[row - 1][col + 1] !== "1" &&
          isUpperCase(board[row - 1][col + 1])
        ) {
          psquares.push({ row: row - 1, col: col + 1 });
        }
      }
      if (row - 1 == 2 && enpassantsquare !== undefined) {
        if (enpassantsquare.availableFor == "black") {
          if (board[row][col - 1] == "P")
            squares.push({ row: row - 1, col: col - 1 });
          if (board[row][col + 1] == "P")
            squares.push({ row: row - 1, col: col + 1 });
        }
      }
      psquares.forEach(function(pos) {
        if (pos.row >= 0 && pos.row <= 7 && (pos.col >= 0 && pos.col <= 7)) {
          squares.push(pos);
        }
      });
      break;
    case "P":
      if (row + 1 > 7) {
        break;
      }
      if (board[row + 1][col] === "1") {
        psquares.push({ row: row + 1, col: col });
        if (row === 1 && board[row + 2][col] === "1") {
          psquares.push({ row: row + 2, col: col });
        }
      }
      if (board[row + 1][col - 1] !== undefined) {
        if (
          board[row + 1][col - 1] !== "1" &&
          !isUpperCase(board[row + 1][col - 1])
        ) {
          psquares.push({ row: row + 1, col: col - 1 });
        }
      }
      if (board[row + 1][col + 1] !== undefined) {
        if (
          board[row + 1][col + 1] !== "1" &&
          !isUpperCase(board[row + 1][col + 1])
        ) {
          psquares.push({ row: row + 1, col: col + 1 });
        }
      }
      if (row + 1 == 5 && enpassantsquare !== undefined) {
        if (enpassantsquare.availableFor == "white") {
          if (board[row][col - 1] == "p")
            squares.push({ row: row + 1, col: col - 1 });
          if (board[row][col + 1] == "p")
            squares.push({ row: row + 1, col: col + 1 });
        }
      }
      psquares.forEach(function(pos) {
        if (pos.row >= 0 && pos.row <= 7 && (pos.col >= 0 && pos.col <= 7)) {
          squares.push(pos);
        }
      });
      break;
    case "n":
      psquares.push({ row: row - 1, col: col - 2 });
      psquares.push({ row: row + 1, col: col - 2 });

      psquares.push({ row: row - 2, col: col - 1 });
      psquares.push({ row: row + 2, col: col - 1 });

      psquares.push({ row: row - 1, col: col + 2 });
      psquares.push({ row: row + 1, col: col + 2 });

      psquares.push({ row: row - 2, col: col + 1 });
      psquares.push({ row: row + 2, col: col + 1 });

      psquares.forEach(function(pos) {
        if (pos.row >= 0 && pos.row <= 7 && (pos.col >= 0 && pos.col <= 7)) {
          if (
            board[pos.row][pos.col] === "1" ||
            board[pos.row][pos.col].toUpperCase() === board[pos.row][pos.col]
          ) {
            squares.push(pos);
          }
        }
      });
      break;
    case "N":
      psquares.push({ row: row - 1, col: col - 2 });
      psquares.push({ row: row + 1, col: col - 2 });

      psquares.push({ row: row - 2, col: col - 1 });
      psquares.push({ row: row + 2, col: col - 1 });

      psquares.push({ row: row - 1, col: col + 2 });
      psquares.push({ row: row + 1, col: col + 2 });

      psquares.push({ row: row - 2, col: col + 1 });
      psquares.push({ row: row + 2, col: col + 1 });

      psquares.forEach(function(pos) {
        if (pos.row >= 0 && pos.row <= 7 && (pos.col >= 0 && pos.col <= 7)) {
          if (
            board[pos.row][pos.col] === "1" ||
            board[pos.row][pos.col].toLowerCase() === board[pos.row][pos.col]
          ) {
            squares.push(pos);
          }
        }
      });
      break;
    case "r":
      for (var i = row - 1; i >= 0; i--) {
        if (board[i][col] === "1") {
          psquares.push({ row: i, col: col });
        } else if (isUpperCase(board[i][col])) {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var i = row + 1; i <= 7; i++) {
        if (board[i][col] === "1") {
          psquares.push({ row: i, col: col });
        } else if (isUpperCase(board[i][col])) {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var j = col - 1; j >= 0; j--) {
        if (board[row][j] === "1") {
          psquares.push({ row: row, col: j });
        } else if (isUpperCase(board[row][j])) {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      for (var j = col + 1; j <= 7; j++) {
        if (board[row][j] === "1") {
          psquares.push({ row: row, col: j });
        } else if (isUpperCase(board[row][j])) {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      squares = psquares;
      break;
    case "R":
      for (var i = row - 1; i >= 0; i--) {
        if (board[i][col] === "1") {
          psquares.push({ row: i, col: col });
        } else if (!isUpperCase(board[i][col])) {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var i = row + 1; i <= 7; i++) {
        if (board[i][col] === "1") {
          psquares.push({ row: i, col: col });
        } else if (!isUpperCase(board[i][col])) {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var j = col - 1; j >= 0; j--) {
        if (board[row][j] === "1") {
          psquares.push({ row: row, col: j });
        } else if (!isUpperCase(board[row][j])) {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      for (var j = col + 1; j <= 7; j++) {
        if (board[row][j] === "1") {
          psquares.push({ row: row, col: j });
        } else if (!isUpperCase(board[row][j])) {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      squares = psquares;
      break;
    case "b":
      // up and left
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col - index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // up and right
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col + index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // down and left
      var index = 0;
      for (var i = row + 1; i <= 7; i++) {
        index++;
        var j = col - index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // down and right
      var index = 0;
      for (var i = row + 1; i <= 7; i++) {
        index++;
        var j = col + index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      squares = psquares;
      break;
    case "B":
      // up and left
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col - index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (!isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // up and right
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col + index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (!isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // down and left
      var index = 0;
      for (var i = row + 1; i <= 7; i++) {
        index++;
        var j = col - index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (!isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // down and right
      var index = 0;
      for (var i = row + 1; i <= 7; i++) {
        index++;
        var j = col + index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (!isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      squares = psquares;
      break;
    case "q":
      for (var i = row - 1; i >= 0; i--) {
        if (board[i][col] === "1") {
          psquares.push({ row: i, col: col });
        } else if (isUpperCase(board[i][col])) {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var i = row + 1; i <= 7; i++) {
        if (board[i][col] === "1") {
          psquares.push({ row: i, col: col });
        } else if (isUpperCase(board[i][col])) {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var j = col - 1; j >= 0; j--) {
        if (board[row][j] === "1") {
          psquares.push({ row: row, col: j });
        } else if (isUpperCase(board[row][j])) {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      for (var j = col + 1; j <= 7; j++) {
        if (board[row][j] === "1") {
          psquares.push({ row: row, col: j });
        } else if (isUpperCase(board[row][j])) {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      // up and left
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col - index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // up and right
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col + index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // down and left
      var index = 0;
      for (var i = row + 1; i <= 7; i++) {
        index++;
        var j = col - index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // down and right
      var index = 0;
      for (var i = row + 1; i <= 7; i++) {
        index++;
        var j = col + index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      squares = psquares;
      break;
    case "Q":
      for (var i = row - 1; i >= 0; i--) {
        if (board[i][col] === "1") {
          psquares.push({ row: i, col: col });
        } else if (!isUpperCase(board[i][col])) {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var i = row + 1; i <= 7; i++) {
        if (board[i][col] === "1") {
          psquares.push({ row: i, col: col });
        } else if (!isUpperCase(board[i][col])) {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var j = col - 1; j >= 0; j--) {
        if (board[row][j] === "1") {
          psquares.push({ row: row, col: j });
        } else if (!isUpperCase(board[row][j])) {
          psquares.push({ row: row, col: j });
        } else {
          break;
        }
      }
      for (var j = col + 1; j <= 7; j++) {
        if (board[row][j] === "1") {
          psquares.push({ row: row, col: j });
        } else if (!isUpperCase(board[row][j])) {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      // up and left
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col - index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (!isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // up and right
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col + index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (!isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // down and left
      var index = 0;
      for (var i = row + 1; i <= 7; i++) {
        index++;
        var j = col - index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (!isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      // down and right
      var index = 0;
      for (var i = row + 1; i <= 7; i++) {
        index++;
        var j = col + index;
        if (board[i][j] === "1") {
          psquares.push({ row: i, col: j });
        } else if (!isUpperCase(board[i][j]) && board[i][j] !== undefined) {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      squares = psquares;
      break;
    case "k":
      if (row !== 0) {
        // bot
        if (board[row - 1][col] === "1" || isUpperCase(board[row - 1][col])) {
          psquares.push({ row: row - 1, col: col });
        }
        // bot left
        if (
          board[row - 1][col - 1] === "1" ||
          isUpperCase(board[row - 1][col - 1])
        ) {
          psquares.push({ row: row - 1, col: col - 1 });
        }
        // bot right
        if (
          board[row - 1][col + 1] === "1" ||
          isUpperCase(board[row - 1][col + 1])
        ) {
          psquares.push({ row: row - 1, col: col + 1 });
        }
      }
      if (row !== 7) {
        // top
        if (board[row + 1][col] === "1" || isUpperCase(board[row + 1][col])) {
          psquares.push({ row: row + 1, col: col });
        }
        // top left
        if (
          board[row + 1][col - 1] === "1" ||
          isUpperCase(board[row + 1][col - 1])
        ) {
          psquares.push({ row: row + 1, col: col - 1 });
        }
        // top right
        if (
          board[row + 1][col + 1] === "1" ||
          isUpperCase(board[row + 1][col + 1])
        ) {
          psquares.push({ row: row + 1, col: col + 1 });
        }
      }
      if (col !== 0) {
        // left
        if (board[row][col - 1] === "1" || isUpperCase(board[row][col - 1])) {
          psquares.push({ row: row, col: col - 1 });
        }
      }
      if (col !== 7) {
        // right
        if (board[row][col + 1] === "1" || isUpperCase(board[row][col + 1])) {
          psquares.push({ row: row, col: col + 1 });
        }
      }
      if (blackCastleAvailable !== undefined) {
        if (row === 7) {
          if (
            board[row][4] == "k" &&
            board[row][5] === "1" &&
            board[row][6] === "1" &&
            board[row][7] == "r"
          ) {
            //kingside castle
            if (blackCastleAvailable == true)
              psquares.push({ row: row, col: 6 });
          }
          if (
            board[row][4] == "k" &&
            board[row][3] === "1" &&
            board[row][2] === "1" &&
            board[row][1] == "1" &&
            board[row][0] == "r"
          ) {
            //queenside castle
            if (blackCastleAvailable == true)
              psquares.push({ row: row, col: 2 });
          }
        }
      }
      /*
      psquares.forEach(function(pos) {
        var threateningPieces = [];
        threateningPieces = threatenedBy(board, pos, "white");
        if (threateningPieces.length >= 1) {
          threatenedSquares.push(pos);
          //threateningPieces.forEach(function(blackPiecePos) {});
        } else {
          squares.push(pos);
        }
      });
      */
      break;
    case "K":
      if (row !== 0) {
        // top
        if (board[row - 1][col] === "1" || !isUpperCase(board[row - 1][col])) {
          psquares.push({ row: row - 1, col: col });
        }
        // top left
        if (
          board[row - 1][col - 1] === "1" ||
          !isUpperCase(board[row - 1][col - 1])
        ) {
          psquares.push({ row: row - 1, col: col - 1 });
        }
        // top right
        if (
          board[row - 1][col + 1] === "1" ||
          !isUpperCase(board[row - 1][col - 1])
        ) {
          psquares.push({ row: row - 1, col: col + 1 });
        }
      }
      if (row !== 7) {
        // bottom
        if (board[row + 1][col] === "1" || !isUpperCase(board[row + 1][col])) {
          psquares.push({ row: row + 1, col: col });
        }
        // bottom left
        if (
          board[row + 1][col - 1] === "1" ||
          !isUpperCase(board[row + 1][col - 1])
        ) {
          psquares.push({ row: row + 1, col: col - 1 });
        }
        // bottom right
        if (
          board[row + 1][col + 1] === "1" ||
          !isUpperCase(board[row + 1][col + 1])
        ) {
          psquares.push({ row: row + 1, col: col + 1 });
        }
      }
      if (col !== 0) {
        // left
        if (board[row][col - 1] === "1" || !isUpperCase(board[row][col - 1])) {
          psquares.push({ row: row, col: col - 1 });
        }
      }
      if (col !== 7) {
        // right
        if (board[row][col + 1] === "1" || !isUpperCase(board[row][col + 1])) {
          psquares.push({ row: row, col: col + 1 });
        }
      }
      if (whiteCastleAvailable !== undefined) {
        if (row === 0) {
          if (
            board[row][4] == "K" &&
            board[row][5] === "1" &&
            board[row][6] === "1" &&
            board[row][7] == "R"
          ) {
            //kingside castle
            if (whiteCastleAvailable == true)
              psquares.push({ row: row, col: 6 });
          }
          if (
            board[row][4] == "K" &&
            board[row][3] === "1" &&
            board[row][2] === "1" &&
            board[row][1] == "1" &&
            board[row][0] == "R"
          ) {
            //queenside castle
            if (whiteCastleAvailable == true)
              psquares.push({ row: row, col: 2 });
          }
        }
      }
      /*
      psquares.forEach(function(pos) {
        var threateningPieces = [];
        threateningPieces = threatenedBy(board, pos, "black");
        if (threateningPieces.length >= 1) {
          threatenedSquares.push(pos);
        } else {
          squares.push(pos);
        }
      });
      */
      break;
    default:
      break;
  }
  var passedSquares = [];
  psquares.forEach(function(pos) {
    if (pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7) {
      if (color == "white" && !isUpperCase(board[pos.row][pos.col])) {
        passedSquares.push(pos);
      }
      if (
        color == "black" &&
        (isUpperCase(board[pos.row][pos.col]) || board[pos.row][pos.col] == "1")
      ) {
        passedSquares.push(pos);
      }
    }
  });
  return passedSquares;
};

function isUpperCase(character) {
  if (character !== undefined && character !== "1") {
    if (character.toUpperCase() === character) {
      return true;
    }
  }
  return false;
};
function colorOf(piece) {
  if (isUpperCase(piece)) {
    return "white";
  }
  if (piece !== "1") {
    return "black";
  }
  return undefined;
};
function getAllPieces(board, color) {
  var list = [];
  for (var row = 0; row <= 7; row++) {
    for (var col = 0; col <= 7; col++) {
      if (colorOf(board[row][col]) == color) {
        list.push({ row: row, col: col, piece: board[row][col] });
      }
    }
  }
  return list;
};
// for board states without King
const generateAllMoves_Alt = function(board, color) {
  const moves = [];
  var list = getAllPieces(board, color);
  for (var i = 0; i < list.length; i++) {
    var row = list[i].row;
    var col = list[i].col;
    var piece = list[i].piece;
    var results = getAvailableSquares(last, row, col);
    var squares = results.availableSquares;
    for (var j = 0; j < squares.length; j++) {
      var newRow = squares[j].row;
      var newCol = squares[j].col;
      var fromPos = { row: row, col: col };
      var toPos = { row: newRow, col: newCol };
      var move = generateMove(fromPos, toPos);
      var resp = updateBoardMSAN(last, move);
      moves.push(move);
    }
  }
  return moves;
}


const fenPosToBoard = function(fenPos) {
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
  const moves = generateAllMoves_Alt(board,'white');
  return moves;
}

module.exports = exports = analyze;
