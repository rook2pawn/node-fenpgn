var h = require('./lib/help');
var fastGetAvailableSquares = require('./lib/fastGetAvailableSquares');
var deep = require('deep-copy');
exports = module.exports = fenPGN;
function fenPGN(params) {
  params = params || {};
  if (!(this instanceof fenPGN))
      return new fenPGN

  this.history = [];
  this.history.push(h.start());

  if (params.history !== undefined) {
    params.history.split(' ').forEach((move) => {
      this.mm(move);
    })
  }

  // this flag is for mobile/lite cpu / client
  this.lite = false; // if this is set to true, some processor intensive instructions will not be carried out
  // namely no checking check status
  // also not checking 3 move reptition
  //etc...
  this.boardId = undefined;
  if (params.id !== undefined) {
    this.boardId = params.id;
  }
  this.whiteSeat = undefined;
  this.blackSeat = undefined;
  this.status = 'open'; // can be draw, open (unfinished/inprogress), black, white, blackconcedes,whiteconcedes
};
fenPGN.prototype.fastGetAvailableSquares = function(params) {
  var last = this.history[this.history.length-1];
  return fastGetAvailableSquares(last.board,last.board[params.row][params.col],
    last.whiteKingsideCastleAvailable,last.whiteQueensideCastleAvailable,
    last.blackKingsideCastleAvailable,last.blackQueensideCastleAvailable,
    params.row,params.col,last.enpassantsquare);
}
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
  return deep(this.history[this.history.length-1]);
};
fenPGN.prototype.getAvailableSquares = function(params) {
  return h.getAvailableSquares(params.histitem || this.last(), params.row,params.col,params.enpassantsquare || this.enpassantsquare);
};
fenPGN.prototype.piecesUnicode = function() {
  return h.piecesUnicode;
};
fenPGN.prototype.reset = function() {
  this.history = [];
  this.history.push(h.start());
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
  var templast = h.moveMSAN(this.last(),moveStr);
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
  fenPGN.prototype.boardId = id;
}
fenPGN.prototype.getBoardId = function(id) {
  return this.boardId;
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
