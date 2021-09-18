const deep = require("deep-copy");
const CONSTANTS = require("./const.js");
const chess = {};
chess.moveMSAN = function (last, msanMove) {
  var info = chess.getStartPieceInfo({ board: last.board, msanMove });
  if (last.activeplayer === "w" && info.color === "black") return false;
  if (last.activeplayer === "b" && info.color === "white") return false;
  var newstate = Object.assign({}, last);
  newstate.time = new Date().getTime();
  newstate.moveNum = last.moveNum + 1;
  if (newstate.moveNum % 2 === 1) {
    newstate.activeplayer = "b";
  } else {
    newstate.fullmovenum = last.fullmovenum + 1;
    newstate.activeplayer = "w";
  }
  newstate.move = msanMove;
  newstate.totalmovestring = last.totalmovestring + " " + msanMove;
  newstate.totalmovestring = newstate.totalmovestring.trim();
  // make sure you check for pawn Double move before you move.
  if (chess.isPawnDoubleMove(last.board, msanMove)) {
    if (last.activeplayer == "w") {
      var obj = {
        row: info.endRow + 1,
        col: info.endCol,
        color: "white",
        availableFor: "black",
      };
      newstate.enpassantsquare = obj;
    } else {
      var obj = {
        row: info.endRow - 1,
        col: info.endCol,
        color: "black",
        availableFor: "white",
      };
      newstate.enpassantsquare = obj;
    }
  } else {
    newstate.enpassantsquare = "-";
  }

  const opts = {};
  opts.blackKingsideCastleAvailable = last.blackKingsideCastleAvailable;
  opts.blackQueensideCastleAvailable = last.blackQueensideCastleAvailable;
  opts.whiteKingsideCastleAvailable = last.whiteKingsideCastleAvailable;
  opts.whiteQueensideCastleAvailable = last.whiteQueensideCastleAvailable;
  opts.enpassantsquare = last.enpassantsquare;
  const updateResponse = chess.updateBoardMSAN(last.board, msanMove, opts);
  newstate.halfmove++;
  if (updateResponse.isCapture) {
    newstate.halfmove = 0;
  }
  if (updateResponse.movedpiece.piece.toLowerCase() == "p") {
    newstate.halfmove = 0;
  }
  newstate = { ...newstate, ...updateResponse };

  if (info.startpiece == "R" && info.startRow == 7) {
    if (info.startCol == 0) {
      newstate.whiteQueensideCastleAvailable = false;
    }
    if (info.startCol == 7) {
      newstate.whiteKingsideCastleAvailable = false;
    }
  }
  if (info.startpiece == "r" && info.startRow == 0) {
    if (info.startCol == 0) {
      newstate.blackQueensideCastleAvailable = false;
    }
    if (info.startCol == 7) {
      newstate.blackKingsideCastleAvailable = false;
    }
  }

  if (newstate.activeplayer === "w") {
    // this is for the black player "actively" putting white INTO check, but does not cover if the move puts himself into check
    // that check is done in the availableSquares examination.
    newstate.whiteChecked = chess.isWhiteKingChecked(newstate.board);
    if (newstate.whiteChecked) {
      if (chess.isKingMated(newstate)) {
        newstate.winner = "b";
      }
    }
  } else if (newstate.activeplayer === "b") {
    // this is for the white player "actively" putting black INTO check
    newstate.blackChecked = chess.isBlackKingChecked(newstate.board);
    if (newstate.blackChecked) {
      if (chess.isKingMated(newstate)) {
        newstate.winner = "w";
      }
    }
  }
  var fenpos = chess.boardToFenPos(newstate);
  newstate.fenpos = fenpos;
  return newstate;
};

chess.getInitialState = CONSTANTS.generateInitialState;
chess.getInitialStateLite = CONSTANTS.generateInitialStateLite;

//position startpos moves b1c3 c7c5 e2e4 g7g6 g1f3 f8g7 d2d4 c5d4
chess.processMSANHistory = function (msanHistory) {};
chess.boardToFenPos = function (last) {
  var fenPos = "";
  last.board.forEach(function (row) {
    fenPos += row.join("") + "/";
  });
  var rep = function (substring, index, original) {
    return substring.length;
  };
  fenPos = fenPos.replace(/1+/g, rep).slice(0, -1).trim();
  fenPos = fenPos.concat(" ").concat(last.activeplayer).concat(" ");
  let canAnyoneCastle = false;
  if (last.whiteKingsideCastleAvailable) {
    canAnyoneCastle = true;
    fenPos = fenPos.concat("K");
  }
  if (last.whiteQueensideCastleAvailable) {
    canAnyoneCastle = true;
    fenPos = fenPos.concat("Q");
  }
  if (last.blackKingsideCastleAvailable) {
    canAnyoneCastle = true;
    fenPos = fenPos.concat("k");
  }
  if (last.blackQueensideCastleAvailable) {
    canAnyoneCastle = true;
    fenPos = fenPos.concat("q");
  }
  if (canAnyoneCastle === false) {
    fenPos = fenPos.concat("-");
  }
  if (last.enpassantsquare == "-") {
    fenPos = fenPos.concat(" ").concat("-");
  } else {
    var colHash = ["a", "b", "c", "d", "e", "f", "g", "h"];
    var col = colHash[last.enpassantsquare.col];
    var row = 8 - last.enpassantsquare.row;
    fenPos = fenPos.concat(" ").concat(col).concat(row);
  }
  fenPos = fenPos
    .concat(" ")
    .concat(last.halfmove)
    .concat(" ")
    .concat(last.fullmovenum);
  return fenPos;
};
chess.fenPosToBoard = function (fenPos) {
  var result = fenPos.match(/^(.+)\s[bw]/);
  fenPos = result[1];
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
chess.convertMoveToPosition = function (msanMove) {
  var colHash = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
  var start = msanMove.slice(0, 2).trim();
  var end = msanMove.slice(2, 4).trim();
  var startrow = parseInt(start.slice(1, 2));
  var endrow = parseInt(end.slice(1, 2));
  var startcol = colHash[start.slice(0, 1)];
  var endcol = colHash[end.slice(0, 1)];
  return {
    start: { row: startrow, col: startcol },
    end: { row: endrow, col: endcol },
  };
};
chess.convertPositionToMove = function (start, end) {
  var startrow = start.row;
  var endrow = end.row;
  var startcol = start.col;
  var endcol = end.col;

  var columns = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const msanMove = `${columns[startcol]}${8 - startrow}${columns[endcol]}${
    8 - endrow
  }`;
  return msanMove;
};
chess.getStartPieceInfo = function ({ board, msanMove }) {
  var colHash = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
  var start = msanMove.slice(0, 2).trim();
  var end = msanMove.slice(2, 4).trim();
  var startrow = 8 - parseInt(start.slice(1, 2));
  var endrow = 8 - parseInt(end.slice(1, 2));
  var startcol = colHash[start.slice(0, 1)];
  var endcol = colHash[end.slice(0, 1)];
  var startpiece = board[startrow][startcol];
  var color = colorOf(startpiece);
  return {
    startpiece: startpiece,
    color: color,
    startRow: startrow,
    startCol: startcol,
    endRow: endrow,
    endCol: endcol,
  };
};
chess.isPawnDoubleMove = function (board, msanMove) {
  const info = chess.getStartPieceInfo({ board, msanMove });
  var diff = Math.abs(info.startRow - info.endRow);
  if (info.startpiece.toLowerCase() == "p" && diff == 2) {
    return true;
  }
  return false;
};
function displayBoard(board) {
  board.forEach((row, idx) => {
    console.log(`${8 - idx}: ${row.join("")}`);
  });
}

// minimally we have to check for enpassant, but not castling rights.
// if the e1g1 move is issued, we assume we had already done move validation
// and we go ahead and resolve the castle. we also have to check for promotion.
var updateBoardMSAN = function (board, msanMove, opts = {}) {
  var whiteKingsideCastleAvailable = opts.whiteKingsideCastleAvailable;
  var whiteQueensideCastleAvailable = opts.whiteQueensideCastleAvailable;
  var blackKingsideCastleAvailable = opts.blackKingsideCastleAvailable;
  var blackQueensideCastleAvailable = opts.blackQueensideCastleAvailable;
  msanMove = msanMove.toString();
  var _board = deep(board); // work on a copy

  const info = chess.getStartPieceInfo({ board, msanMove });
  const isPromotionMove = chess.isPromotionMove(msanMove);
  const movedpiece = {
    row: info.startRow,
    col: info.startCol,
    piece: info.startpiece,
  };
  const color = info.color;
  var capturedpiece = {
    piece: _board[info.endRow][info.endCol],
    row: info.endRow,
    col: info.endCol,
  };

  var isCapture = capturedpiece.piece != "1";

  _board[info.startRow][info.startCol] = "1";
  if (!isPromotionMove) {
    _board[info.endRow][info.endCol] = info.startpiece;
  } else {
    _board[info.endRow][info.endCol] = msanMove.slice(-1);
  }

  var response = {};
  // check for enpassant capture. if so, make the correction.
  if (
    info.startpiece.toLowerCase() == "p" &&
    (info.startRow == 3 || info.startRow == 4) &&
    capturedpiece.piece == "1" &&
    info.startCol != info.endCol
  ) {
    if (info.startpiece == "P") {
      isCapture = true;
      capturedpiece.piece = "p";
      capturedpiece.row = info.endRow;
      capturedpiece.col = info.endCol;
      _board[info.endRow + 1][info.endCol] = "1";
    }
    if (info.startpiece == "p") {
      isCapture = true;
      capturedpiece.piece = "P";
      capturedpiece.row = info.endRow;
      capturedpiece.col = info.endCol;
      _board[info.endRow - 1][info.endCol] = "1";
    }
  }
  // its a possible castle
  if (info.startpiece.toLowerCase() == "k") {
    if (colorOf(info.startpiece) == "white") {
      whiteKingsideCastleAvailable = false;
      whiteQueensideCastleAvailable = false;
    }
    if (colorOf(info.startpiece) == "black") {
      blackKingsideCastleAvailable = false;
      blackQueensideCastleAvailable = false;
    }
    if (Math.abs(info.endCol - info.startCol) > 1) {
      // just move the rooks since the king already moved
      if (info.endCol == 6) {
        // kingside castle
        _board[info.endRow][5] = _board[info.endRow][7];
        _board[info.endRow][7] = "1";
      }
      if (info.endCol == 2) {
        // queenside castle
        _board[info.endRow][3] = _board[info.endRow][0];
        _board[info.endRow][0] = "1";
      }
    }
  }
  // check for promotion
  const promoPiece = {};
  if (
    info.startpiece.toLowerCase() == "p" &&
    (info.endRow == 7 || info.endRow == 0)
  ) {
    promoPiece.col = info.endCol;
    promoPiece.row = info.endRow;
    promoPiece.color = info.startpiece === "P" ? "white" : "black";
  }

  return {
    movedpiece,
    capturedpiece,
    board: _board,
    whiteKingsideCastleAvailable,
    whiteQueensideCastleAvailable,
    blackKingsideCastleAvailable,
    blackQueensideCastleAvailable,
    isCapture,
    promoPiece,
  };
};
chess.updateBoardMSAN = updateBoardMSAN;
// positionOf useful for only K, Q.
var positionOf = function (piece, board) {
  for (var row = 0; row <= 7; row++) {
    for (var col = 0; col <= 7; col++) {
      if (board[row][col] == piece) {
        return { row: row, col: col };
      }
    }
  }
  return undefined;
};
var isIn = function (list, pos) {
  var match = false;
  if (list !== undefined) {
    list.forEach(function (obj) {
      if (obj.row === pos.row && obj.col === pos.col) {
        match = true;
      }
    });
  }
  return match;
};
var colorOf = function (piece) {
  if (piece === "1") return "empty";
  if (piece.toUpperCase() === piece) {
    return "white";
  } else {
    return "black";
  }
};
// returns a list of moveable squares. excludeSelfCheckMoves means we do not search if a move would
// put the player into self check.
function getAvailableSquares({
  board,
  row,
  col,
  opts = {},
  excludeSelfCheckMoves = false,
}) {
  const blackKingsideCastleAvailable = opts.blackKingsideCastleAvailable;
  const blackQueensideCastleAvailable = opts.blackQueensideCastleAvailable;
  const whiteKingsideCastleAvailable = opts.whiteKingsideCastleAvailable;
  const whiteQueensideCastleAvailable = opts.whiteQueensideCastleAvailable;
  const { enpassantsquare = "-" } = opts;

  const piece = board[row][col];
  const psquares = []; // potentialsquares

  switch (piece) {
    case "p":
      if (row + 1 <= 7 && board[row + 1][col] === "1") {
        psquares.push({ row: row + 1, col: col });
        if (row === 1 && board[3][col] === "1") {
          psquares.push({ row: 3, col: col });
        }
      }
      if (row + 1 <= 7 && col - 1 >= 0) {
        if (colorOf(board[row + 1][col - 1]) === "white") {
          psquares.push({ row: row + 1, col: col - 1 });
        }
      }
      if (row + 1 <= 7 && col + 1 <= 7) {
        if (colorOf(board[row + 1][col + 1]) === "white") {
          psquares.push({ row: row + 1, col: col + 1 });
        }
      }
      if (row === 4 && enpassantsquare !== "-") {
        if (enpassantsquare.availableFor == "black") {
          if (col - 1 >= 0 && board[4][col - 1] == "P")
            psquares.push({ row: 5, col: col - 1 });
          if (col + 1 <= 7 && board[4][col + 1] == "P")
            psquares.push({ row: 5, col: col + 1 });
        }
      }
      break;
    case "P":
      if (row - 1 >= 0 && colorOf(board[row - 1][col]) === "empty") {
        psquares.push({ row: row - 1, col: col });
        if (row === 6 && board[4][col] === "1") {
          psquares.push({ row: 4, col: col });
        }
      }
      if (row - 1 >= 0 && col - 1 >= 0) {
        if (colorOf(board[row - 1][col - 1]) === "black") {
          psquares.push({ row: row - 1, col: col - 1 });
        }
      }
      if (row - 1 >= 0 && col + 1 <= 7) {
        if (colorOf(board[row - 1][col + 1]) === "black") {
          psquares.push({ row: row - 1, col: col + 1 });
        }
      }
      if (row === 3 && enpassantsquare !== "-") {
        if (enpassantsquare.availableFor == "white") {
          if (col - 1 >= 0 && board[3][col - 1] == "p")
            psquares.push({ row: 2, col: col - 1 });
          if (col + 1 <= 7 && board[3][col + 1] == "p")
            psquares.push({ row: 2, col: col + 1 });
        }
      }
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
      break;
    case "r":
      for (var i = row - 1; i >= 0; i--) {
        if (colorOf(board[i][col]) === "empty") {
          psquares.push({ row: i, col: col });
        } else if (colorOf(board[i][col]) === "white") {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var i = row + 1; i <= 7; i++) {
        if (colorOf(board[i][col]) === "empty") {
          psquares.push({ row: i, col: col });
        } else if (colorOf(board[i][col]) === "white") {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var j = col - 1; j >= 0; j--) {
        if (colorOf(board[row][j]) === "empty") {
          psquares.push({ row: row, col: j });
        } else if (colorOf(board[row][j]) === "white") {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      for (var j = col + 1; j <= 7; j++) {
        if (colorOf(board[row][j]) === "empty") {
          psquares.push({ row: row, col: j });
        } else if (colorOf(board[row][j]) === "white") {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      break;
    case "R":
      for (var i = row - 1; i >= 0; i--) {
        if (colorOf(board[i][col]) === "empty") {
          psquares.push({ row: i, col: col });
        } else if (colorOf(board[i][col]) === "black") {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var i = row + 1; i <= 7; i++) {
        if (colorOf(board[i][col]) === "empty") {
          psquares.push({ row: i, col: col });
        } else if (colorOf(board[i][col]) === "black") {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var j = col - 1; j >= 0; j--) {
        if (colorOf(board[row][j]) === "empty") {
          psquares.push({ row: row, col: j });
        } else if (colorOf(board[row][j]) === "black") {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      for (var j = col + 1; j <= 7; j++) {
        if (colorOf(board[row][j]) === "empty") {
          psquares.push({ row: row, col: j });
        } else if (colorOf(board[row][j]) === "black") {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      break;
    case "b":
      // up and left
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col - index;
        if (j < 0) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "white") {
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
        if (j > 7) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "white") {
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
        if (j < 0) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "white") {
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
        if (j > 7) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "white") {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      break;
    case "B":
      // up and left
      var index = 0;
      for (var i = row - 1; i >= 0; i--) {
        index++;
        var j = col - index;
        if (j < 0) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "black") {
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
        if (j > 7) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "black") {
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
        if (j < 0) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "black") {
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
        if (j > 7) break;

        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "black") {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      break;
    case "q":
      for (var i = row - 1; i >= 0; i--) {
        if (colorOf(board[i][col]) === "empty") {
          psquares.push({ row: i, col: col });
        } else if (colorOf(board[i][col]) === "white") {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var i = row + 1; i <= 7; i++) {
        if (colorOf(board[i][col]) === "empty") {
          psquares.push({ row: i, col: col });
        } else if (colorOf(board[i][col]) === "white") {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var j = col - 1; j >= 0; j--) {
        if (colorOf(board[row][j]) === "empty") {
          psquares.push({ row: row, col: j });
        } else if (colorOf(board[row][j]) === "white") {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      for (var j = col + 1; j <= 7; j++) {
        if (colorOf(board[row][j]) === "empty") {
          psquares.push({ row: row, col: j });
        } else if (colorOf(board[row][j]) === "white") {
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
        if (j < 0) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "white") {
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
        if (j > 7) break;

        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "white") {
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
        if (j < 0) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "white") {
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
        if (j > 7) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "white") {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      break;
    case "Q":
      for (var i = row - 1; i >= 0; i--) {
        if (colorOf(board[i][col]) === "empty") {
          psquares.push({ row: i, col: col });
        } else if (colorOf(board[i][col]) === "black") {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }

      for (var i = row + 1; i <= 7; i++) {
        if (colorOf(board[i][col]) === "empty") {
          psquares.push({ row: i, col: col });
        } else if (colorOf(board[i][col]) === "black") {
          psquares.push({ row: i, col: col });
          break;
        } else {
          break;
        }
      }
      for (var j = col - 1; j >= 0; j--) {
        if (colorOf(board[row][j]) === "empty") {
          psquares.push({ row: row, col: j });
        } else if (colorOf(board[row][j]) === "black") {
          psquares.push({ row: row, col: j });
          break;
        } else {
          break;
        }
      }
      for (var j = col + 1; j <= 7; j++) {
        if (colorOf(board[row][j]) === "empty") {
          psquares.push({ row: row, col: j });
        } else if (colorOf(board[row][j]) === "black") {
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
        if (j < 0) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "black") {
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
        if (j > 7) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "black") {
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
        if (j < 0) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "black") {
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
        if (j > 7) break;
        if (colorOf(board[i][j]) === "empty") {
          psquares.push({ row: i, col: j });
        } else if (colorOf(board[i][j]) === "black") {
          psquares.push({ row: i, col: j });
          break;
        } else {
          break;
        }
      }
      break;
    case "k":
      if (row !== 0) {
        // bot
        if (
          board[row - 1][col] === "1" ||
          colorOf(board[row - 1][col]) === "white"
        ) {
          psquares.push({ row: row - 1, col: col });
        }
        // bot left
        if (
          board[row - 1][col - 1] === "1" ||
          colorOf(board[row - 1][col - 1]) === "white"
        ) {
          psquares.push({ row: row - 1, col: col - 1 });
        }
        // bot right
        if (
          board[row - 1][col + 1] === "1" ||
          colorOf(board[row - 1][col + 1]) === "white"
        ) {
          psquares.push({ row: row - 1, col: col + 1 });
        }
      }
      if (row !== 7) {
        // top
        if (
          board[row + 1][col] === "1" ||
          colorOf(board[row + 1][col]) === "white"
        ) {
          psquares.push({ row: row + 1, col: col });
        }
        // top left
        if (
          board[row + 1][col - 1] === "1" ||
          colorOf(board[row + 1][col - 1]) === "white"
        ) {
          psquares.push({ row: row + 1, col: col - 1 });
        }
        // top right
        if (
          board[row + 1][col + 1] === "1" ||
          colorOf(board[row + 1][col + 1]) === "white"
        ) {
          psquares.push({ row: row + 1, col: col + 1 });
        }
      }
      if (col !== 0) {
        // left
        if (
          board[row][col - 1] === "1" ||
          colorOf(board[row][col - 1]) === "white"
        ) {
          psquares.push({ row: row, col: col - 1 });
        }
      }
      if (col !== 7) {
        // right
        if (
          board[row][col + 1] === "1" ||
          colorOf(board[row][col + 1]) === "white"
        ) {
          psquares.push({ row: row, col: col + 1 });
        }
      }
      if (row === 0) {
        if (
          board[0][4] == "k" &&
          board[0][5] === "1" &&
          board[0][6] === "1" &&
          board[0][7] == "r"
        ) {
          //kingside castle
          if (blackKingsideCastleAvailable == true)
            psquares.push({ row: 0, col: 6 });
        }
        if (
          board[0][4] == "k" &&
          board[0][3] === "1" &&
          board[0][2] === "1" &&
          board[0][1] == "1" &&
          board[0][0] == "r"
        ) {
          //queenside castle
          if (blackQueensideCastleAvailable == true)
            psquares.push({ row: 0, col: 2 });
        }
      }
      break;
    case "K":
      if (row !== 0) {
        // top
        if (
          board[row - 1][col] === "1" ||
          colorOf(board[row - 1][col]) === "black"
        ) {
          psquares.push({ row: row - 1, col: col });
        }
        // top left
        if (
          board[row - 1][col - 1] === "1" ||
          colorOf(board[row - 1][col - 1]) === "black"
        ) {
          psquares.push({ row: row - 1, col: col - 1 });
        }
        // top right
        if (
          board[row - 1][col + 1] === "1" ||
          colorOf(board[row - 1][col + 1]) === "black"
        ) {
          psquares.push({ row: row - 1, col: col + 1 });
        }
      }
      if (row !== 7) {
        // bottom
        if (
          board[row + 1][col] === "1" ||
          colorOf(board[row + 1][col]) === "black"
        ) {
          psquares.push({ row: row + 1, col: col });
        }
        // bottom left
        if (
          board[row + 1][col - 1] === "1" ||
          colorOf(board[row + 1][col - 1]) === "black"
        ) {
          psquares.push({ row: row + 1, col: col - 1 });
        }
        // bottom right
        if (
          board[row + 1][col + 1] === "1" ||
          colorOf(board[row + 1][col + 1]) === "black"
        ) {
          psquares.push({ row: row + 1, col: col + 1 });
        }
      }
      if (col !== 0) {
        // left
        if (
          board[row][col - 1] === "1" ||
          colorOf(board[row][col - 1]) === "black"
        ) {
          psquares.push({ row: row, col: col - 1 });
        }
      }
      if (col !== 7) {
        // right
        if (
          board[row][col + 1] === "1" ||
          colorOf(board[row][col + 1]) === "black"
        ) {
          psquares.push({ row: row, col: col + 1 });
        }
      }
      if (row === 7) {
        if (
          board[7][4] == "K" &&
          board[7][5] === "1" &&
          board[7][6] === "1" &&
          board[7][7] == "R"
        ) {
          //kingside castle
          if (whiteKingsideCastleAvailable == true)
            psquares.push({ row: 7, col: 6 });
        }
        if (
          board[7][4] == "K" &&
          board[7][3] === "1" &&
          board[7][2] === "1" &&
          board[7][1] == "1" &&
          board[7][0] == "R"
        ) {
          //queenside castle
          if (whiteQueensideCastleAvailable == true)
            psquares.push({ row: 7, col: 2 });
        }
      }
      console.log(JSON.stringify(psquares));
      break;
    default:
      break;
  }
  const passedSquares = [];
  const color = colorOf(piece);

  // FILTER 1. this filter ensures a piece doesnt go into a square of the same color
  // as well as boundary filter.
  psquares.forEach(function (pos) {
    if (pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7) {
      const destination = board[pos.row][pos.col];
      if (color == "white") {
        if (colorOf(destination) !== "white") {
          passedSquares.push(pos);
        }
      }
      if (color == "black") {
        if (colorOf(destination) !== "black") {
          passedSquares.push(pos);
        }
      }
    }
  });

  // this function, getAvailableSquares has two modes and hinges upon if excludeSelfCheckMoves is true
  // or false. Mode 1: get all squares a piece can logically move to regardless if the move puts the
  // player in self-check. The first mode is for when a move is made (moveMSAN) you want to see if
  // that move put the enemy player in check, through say discovered check.

  // Mode 2. same as 1 but add a self-check restriction. The second mode is for when you click on a piece
  // and identify all the places you can go but that also wouldn't put yourself in check.

  // if the use case of mode1 was made and had the self-check restriction, it would go into an infinite loop.
  // you check to see if you put the enemy into check, which calls this function, then call itself (is<Black/White>KingChecked) for each
  // possible move, and then each call there would call itself, etc.
  if (excludeSelfCheckMoves) {
    return { passedSquares, safeSquares: [], restrictedSquares: [] };
  }
  // FILTER 2. check each passedSquare that if executed would not put the
  // player in check.
  const safeSquares = [];
  const restrictedSquares = []; // squares that we can mark in red to indicate they could go there but that would put the player into
  // SELF-CHECK
  passedSquares.forEach((pos) => {
    const b = deep(board);
    b[pos.row][pos.col] = b[row][col];
    b[row][col] = "1";
    if (color === "white") {
      const isSelfCheck_white = chess.isWhiteKingChecked(b); // isSelfCheck - move that would put the player into SELF-check.
      if (!isSelfCheck_white) {
        safeSquares.push(pos);
      } else {
        restrictedSquares.push(pos);
      }
    } else if (color === "black") {
      const isSelfCheck_black = chess.isBlackKingChecked(b);
      if (!isSelfCheck_black) {
        safeSquares.push(pos);
      } else {
        restrictedSquares.push(pos);
      }
    }
  });

  // safeSquares - squares that can be moved that would not put the player into check
  // restrictedSquares - squares that could be moved to but would put the player into self-check
  // passedSquares - squares that a piece can move to regardless of self-check.
  return { safeSquares, restrictedSquares, passedSquares };
}

chess.isWhiteKingChecked = function (board) {
  const pieces = getAllPieces(board, "black");
  for (var i = 0; i < pieces.length; i++) {
    let piece = pieces[i];
    // we really need to pass in opts to getAvailableSquares.. which means we need to pass it into isBlackkingChecked..
    const { passedSquares: squares } = getAvailableSquares({
      board,
      row: piece.row,
      col: piece.col,
      excludeSelfCheckMoves: true,
    });
    for (var j = 0; j < squares.length; j++) {
      let square = squares[j];
      let item = board[square.row][square.col];
      if (item === "K") return true;
    }
  }
  return false;
};
chess.isBlackKingChecked = function (board) {
  const pieces = getAllPieces(board, "white");
  for (var i = 0; i < pieces.length; i++) {
    let piece = pieces[i];
    // we really need to pass in opts to getAvailableSquares.. which means we need to pass it into isBlackkingChecked..
    const { passedSquares: squares } = getAvailableSquares({
      board,
      row: piece.row,
      col: piece.col,
      excludeSelfCheckMoves: true,
    });
    for (var j = 0; j < squares.length; j++) {
      let square = squares[j];
      let item = board[square.row][square.col];
      if (item === "k") return true;
    }
  }
  return false;
};
// given a board, checks status of king-in-check status
// for a specific color
function isKingCheckedColor(board, color) {
  if (color == "w") color = "white";
  else if (color == "b") color = "black";

  if (color === "white") {
    return chess.isWhiteKingChecked(board);
  } else if (color === "black") {
    return chess.isBlackKingChecked(board);
  } else {
    throw new Error("isKingCheckedColor parameter error");
  }
}
function getAllPieces(board, color) {
  if (color == "w") color = "white";
  else if (color == "b") color = "black";
  var list = [];
  for (var row = 0; row <= 7; row++) {
    for (var col = 0; col <= 7; col++) {
      if (colorOf(board[row][col]) === color) {
        list.push({ row: row, col: col, piece: board[row][col] });
      }
    }
  }
  return list;
}
function generateMove(fromPos, toPos) {
  fromPos.row = 8 - fromPos.row;
  toPos.row = 8 - toPos.row;
  var colHash = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
  var colList = ["a", "b", "c", "d", "e", "f", "g", "h"];
  var move = "";
  move = move.concat(colList[fromPos.col]).concat(fromPos.row);
  move = move.concat(colList[toPos.col]).concat(toPos.row);
  return move;
}

const generateAllMoves = function (board, color, opts) {
  const moves = [];
  var list = getAllPieces(board, color);
  for (var i = 0; i < list.length; i++) {
    var row = list[i].row;
    var col = list[i].col;
    var piece = list[i].piece;

    const { safeSquares: squares } = getAvailableSquares({
      board,
      row,
      col,
      opts,
    });
    for (var j = 0; j < squares.length; j++) {
      var newRow = squares[j].row;
      var newCol = squares[j].col;
      var fromPos = { row: row, col: col };
      var toPos = { row: newRow, col: newCol };
      var move = generateMove(fromPos, toPos);
      // promo logic
      if (piece === "p" && newRow === 7) {
        move = move.concat("q");
      }
      if (piece === "P" && newRow === 0) {
        move = move.concat("Q");
      }

      if (opts.doNotCheck === undefined) {
        var resp = updateBoardMSAN(board, move, opts);
        var isCheckedColor = isKingCheckedColor(resp.board, color);
        if (isCheckedColor === false) {
          moves.push(move);
        }
      } else {
        moves.push(move);
      }
    }
  }
  return moves;
};
chess.generateAllMoves = generateAllMoves;

const generateAllMovesNoKingSafety = function (board, color) {
  return generateAllMoves(board, color, { doNotCheck: true });
};
chess.generateAllMovesNoKingSafety = generateAllMovesNoKingSafety;

const allMoves = function (last) {
  const opts = {};
  opts.blackKingsideCastleAvailable = last.blackKingsideCastleAvailable;
  opts.blackQueensideCastleAvailable = last.blackQueensideCastleAvailable;
  opts.whiteKingsideCastleAvailable = last.whiteKingsideCastleAvailable;
  opts.whiteQueensideCastleAvailable = last.whiteQueensideCastleAvailable;
  opts.enpassantsquare = last.enpassantsquare;
  return generateAllMoves(last.board, last.activeplayer, opts);
};
chess.allMoves = allMoves;

chess.isKingMated = function (last) {
  const moves = allMoves(last);
  return moves.length <= 0;
};
chess.getAvailableSquares = getAvailableSquares;
chess.getFenFields = function (fenstring) {
  if (fenstring === undefined) {
    fenstring = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  }
  var fields = fenstring.split(" ");
  var fenProps = {
    pos: fields[0],
    activeColor: fields[1],
    castling: fields[2],
    enPassant: fields[3],
    halfmove: fields[4],
    fullmove: fields[5],
  };
  return fenProps;
};
chess.piecesUnicode = CONSTANTS.piecesUnicode;
chess.isPromotionMove = (msanMove) => {
  //a promotion move looks like b7a8Q
  return msanMove.match(/[a-h]\d[a-h]\d[qnrbQNRB]/) !== null;
};
module.exports = chess;
