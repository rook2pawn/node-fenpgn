var h = require('./lib/help');
exports = module.exports = fenPGN;
function fenPGN(history) {
  if (!(this instanceof fenPGN)) 
      return new fenPGN
  if (history === undefined) {
      this.history = [];
      this.history.push(h.start());
  }

  // this flag is for mobile/lite cpu / client
  this.lite = false; // if this is set to true, some processor intensive instructions will not be carried out
  // namely no checking check status
  // also not checking 3 move reptition
  //etc...
  this.matchid = undefined;
  this.whiteSeat = undefined;
  this.blackSeat = undefined;
  this.status = 'open'; // can be draw, open (unfinished/inprogress), black, white, blackconcedes,whiteconcedes
};

fenPGN.prototype.last = function() {
      return h.clone(this.history[this.history.length - 1]);
  };
fenPGN.prototype.setStatus = function(result) {
    this.status = result;
  };
fenPGN.prototype.getStatus = function() {
      return this.status;
  }
fenPGN.prototype.enpassantsquare = undefined;
fenPGN.prototype.isKingMated = function(params) {
      return h.isKingMated(this.last(),params.color);
  };
fenPGN.prototype.isKingCheckedOnMove = function(move) {
      var myboard = h.updateBoardMSAN(this.last(), move);
      return h.isKingChecked(myboard);
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
      if (this.last().activeplayer == 'w') {
          return 'white';
      } 
      if (this.last().activeplayer == 'b') {
          return 'black';
      }
  };
fenPGN.prototype.getHistory = function() {
  return h.clone(this.history);
  };
fenPGN.prototype.setHistory = function(newhistory) {
  this.history = newhistory;
  }
fenPGN.prototype.getLastHistory = function() {
  return h.clone(this.history[this.history.length-1]);
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
  this.history.pop();
};
fenPGN.prototype.toFenPos = function(board) {
  return h.boardToFenPos(board || this.last().board);
};
fenPGN.prototype.mm = function(moveStr) {
  var oldlast = this.last(); 
  var templast = h.moveMSAN.apply(this,[oldlast,moveStr]);
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
  console.log(this.last().board);
};
fenPGN.prototype.board = function() { 
  return this.last().board;
};
fenPGN.prototype.setMatchId = function(id) {
  fenPGN.prototype.matchid = id;
}
fenPGN.prototype.getMatchId = function(id) {
  return this.matchid;
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