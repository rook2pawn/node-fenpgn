var h = require('./lib/help');
var fastGetAvailableSquares = require('./lib/fastGetAvailableSquares');
var deep = require('deep-copy');
exports = module.exports = fenPGN;

function fenPGN(params) {
  params = params || {};
  if (!(this instanceof fenPGN))
      return new fenPGN

  this.lite = false;
  this.id = undefined;
  this.whiteSeat = undefined;
  this.blackSeat = undefined;
  this.status = 'open'; // can be draw, open (unfinished/inprogress), black, white, blackconcedes,whiteconcedes

  // relevant params 'lite', 'boardId'
  Object.assign(this, params);
  // make sure we start with blank history
  this.history = [];

  let initialState;
  if (params.lite) {
    initialState = h.getInitialStateLite();
  } else {
    initialState = h.getInitialState();
  }
  this.history.push(initialState)

  if (params.history !== undefined) {
    params.history.split(' ').forEach((move) => {
      this.mm(move);
    })
  }
};

fenPGN.analyze = require("./lib/analyze.js");

fenPGN.prototype.placePieceLite = function(params) {
  if (this.lite === false)
    throw new Error("Not in lite mode")
  let row = params.row;
  let col = params.col;
  let piece = params.piece;
  let last = this.history[this.history.length-1];
  let board = last.board;
  board[row][col] = piece;
}
fenPGN.prototype.fastGetAvailableSquares = function(params) {
  var last = this.history[this.history.length-1];
  console.log("prototype fastGetAvailableSquares board:", last.board);
  return fastGetAvailableSquares(last.board,last.board[params.row][params.col],
    last.whiteKingsideCastleAvailable,last.whiteQueensideCastleAvailable,
    last.blackKingsideCastleAvailable,last.blackQueensideCastleAvailable,
    params.row,params.col,last.enpassantsquare);
}
fenPGN.prototype.allMoves = function() {
  return h.allMoves(this.last());
}
fenPGN.prototype.stateLive = function() {
  return this.history[this.history.length - 1];
};
fenPGN.prototype.last = function() {
  return deep(this.history[this.history.length - 1]);
};
fenPGN.prototype.setStatus = function(result) {
  this.status = result;
};
fenPGN.prototype.getStatus = function() {
  return this.status;
}
fenPGN.prototype.isWhiteKingMated = function() {
  return h.isKingMated(this.last(),'white');
};
fenPGN.prototype.isBlackKingMated = function() {
  return h.isKingMated(this.last(),'black');
};
fenPGN.prototype.isKingCheckedOnMove = function(move) {
  var state = h.updateBoardMSAN(this.last(), move);
  return h.isKingChecked(state.board);
};
fenPGN.prototype.isKingChecked = function(board) {
  return h.isKingChecked(board || this.last().board);
};
fenPGN.prototype.convertMoveToPosition = function(msanMove) {
  return h.convertMoveToPosition(msanMove);
};
fenPGN.prototype.getStartPieceInfo = function(params) {
  var theboard = params.board || this.last().board;
  return h.getStartPieceInfo(theboard,params.msanMove);
};
fenPGN.prototype.getActivePlayer = function() {
  var activeplayer = this.history[this.history.length - 1].activeplayer;
  if (activeplayer == 'w') {
    return 'white';
  }
  if (activeplayer == 'b') {
    return 'black';
  }
};
fenPGN.prototype.getHistory = function() {
  return deep(this.history);
};
fenPGN.prototype.setHistory = function(newhistory) {
  this.history = newhistory;
}
fenPGN.prototype.getLastHistory = function() {
  return this.last()
};
fenPGN.prototype.getAvailableSquares = function(params) {
  return h.getAvailableSquares(params.histitem || this.last(), params.row,params.col,params.enpassantsquare || this.enpassantsquare);
};
fenPGN.prototype.piecesUnicode = function() {
  return h.piecesUnicode;
};
fenPGN.prototype.reset = function() {
  this.history = [];
  this.history.push(h.getInitialState());
};
fenPGN.prototype.showHistory = function() {
  this.history.forEach(function(obj) {
    console.log(obj);
  });
};
fenPGN.prototype.takeBack = function() {
  if (this.history.length >= 2) {
    this.history.pop();
  }
};
fenPGN.prototype.getFenPos = function() {
  return this.history[this.history.length-1].fenpos;
};
fenPGN.prototype.mm = function(moveStr) {
  var templast = h.moveMSAN(this.last(),moveStr, this.lite);
  this.history.push(templast);
  return this;
};
fenPGN.prototype.move = function(moveStr) {
  this.mm(moveStr);
  return this;
};
fenPGN.prototype.totalmovestring = function() {
  return this.last().totalmovestring;
};
fenPGN.prototype.view = function() {
  console.log(this.last().board.reverse());
};
fenPGN.prototype.board = function() {
  return this.last().board;
};
fenPGN.prototype.setBoardId = function(id) {
  this.id = id;
}
fenPGN.prototype.getBoardId = function(id) {
  return this.id;
}
fenPGN.prototype.setWhiteSeat = function(obj) {
  this.whiteSeat = obj;
};
fenPGN.prototype.setBlackSeat = function(obj){
  this.blackSeat = obj;
};
fenPGN.prototype.isPawnPromotionMove = function(board,msanMove) {
  return h.isPawnPromotionMove(board,msanMove);
}
fenPGN.prototype.getSeated = function() {
  return {whiteSeat:this.whiteSeat,blackSeat:this.blackSeat}
};
fenPGN.prototype.evaluateBoard = h.evaluateBoard;
