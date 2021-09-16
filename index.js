const h = require("./lib/help");
const fastGetAvailableSquares = require("./lib/fastGetAvailableSquares");
const deep = require("deep-copy");
const nanostate = require("nanostate");

exports = module.exports = fenPGN;

function fenPGN(params) {
  params = params || {};
  if (!(this instanceof fenPGN)) return new fenPGN();

  this.lite = false;
  this.id = undefined;
  this.whiteSeat = undefined;
  this.blackSeat = undefined;

  // can be draw, open (unfinished/inprogress), black, white, blackconcedes,whiteconcedes

  const fsm_status = nanostate("open", {
    open: { start: "inprogress", abandoned: "abandoned" },
    inprogress: {
      draw: "draw",
      whiteWins_checkmate: "whiteWins_checkmate",
      blackWins_checkmate: "blackWins_checkmate",
      blackConcedes: "blackConcedes",
      whiteConcedes: "whiteConcedes",
      blackForfeits: "blackForfeits",
      whiteForfeits: "whiteForfeits",
      whiteWins_time: "whiteWins_time",
      blackWins_time: "blackWins_time",
    },
    draw: {},
    whiteWins_checkmate: {},
    blackWins_checkmate: {},
    blackConcedes: {},
    whiteConcedes: {},
    blackForfeits: {},
    whiteForfeits: {},
    whiteWins_time: {},
    blackWins_time: {},
    abandoned: {},
  });

  this.status = fsm_status;
  // relevant params 'lite', 'boardId'
  //  Object.assign(this, params);
  this.lite = params.lite;
  this.id = params.id;
  // make sure we start with blank history
  this.history = [];

  let initialState;
  if (params.lite) {
    initialState = h.getInitialStateLite();
  } else {
    initialState = h.getInitialState();
  }
  this.history.push(initialState);

  if (params.history !== undefined) {
    params.history.split(" ").forEach((move) => {
      this.mm(move);
    });
  }
}

fenPGN.minmax = require("./lib/analyze.js");
fenPGN.lib = h;
fenPGN.prototype.allMoves = function () {
  return h.allMoves(this.last());
};
fenPGN.prototype.stateLive = function () {
  return this.history[this.history.length - 1];
};
fenPGN.prototype.last = function () {
  return deep(this.history[this.history.length - 1]);
};
fenPGN.prototype.setAction = function (action) {
  this.status.emit(action);
};
fenPGN.prototype.getStatus = function () {
  return this.status.state;
};
fenPGN.prototype.isKingMated = function () {
  return h.isKingMated(this.last());
};
fenPGN.prototype.convertMoveToPosition = function (msanMove) {
  return h.convertMoveToPosition(msanMove);
};
fenPGN.prototype.getStartPieceInfo = function (params) {
  var theboard = params.board || this.history[this.history.length - 1].board;
  return h.getStartPieceInfo(theboard, params.msanMove);
};
fenPGN.prototype.getActivePlayer = function () {
  var activeplayer = this.history[this.history.length - 1].activeplayer;
  if (activeplayer == "w") {
    return "white";
  }
  if (activeplayer == "b") {
    return "black";
  }
};
fenPGN.prototype.getHistory = function () {
  return deep(this.history);
};
fenPGN.prototype.getAvailableSquares = function ({
  row,
  col,
  enpassantsquare,
}) {
  return h.getAvailableSquares(this.stateLive().board, row, col, {
    enpassantsquare: enpassantsquare || this.enpassantsquare,
  });
};
fenPGN.prototype.getPiecesUnicode = function () {
  return h.piecesUnicode;
};
fenPGN.prototype.reset = function () {
  this.history = [];
  if (this.lite) {
    this.history.push(h.getInitialStateLite());
  } else this.history.push(h.getInitialState());
};
fenPGN.prototype.takeBack = function () {
  if (this.history.length >= 2) {
    this.history.pop();
  }
};
fenPGN.prototype.getFenPos = function () {
  return this.history[this.history.length - 1].fenpos;
};
fenPGN.prototype.mm = function (moveStr) {
  var templast = h.moveMSAN(this.last(), moveStr);
  this.history.push(templast);
  return this;
};
fenPGN.prototype.move = function (moveStr) {
  this.mm(moveStr);
  return this;
};
fenPGN.prototype.totalmovestring = function () {
  return this.last().totalmovestring;
};
fenPGN.prototype.board = function () {
  return this.last().board;
};
fenPGN.prototype.setBoardId = function (id) {
  this.id = id;
};
fenPGN.prototype.getBoardId = function (id) {
  return this.id;
};
fenPGN.prototype.setWhiteSeat = function (obj) {
  this.whiteSeat = obj;
};
fenPGN.prototype.setBlackSeat = function (obj) {
  this.blackSeat = obj;
};
fenPGN.prototype.isPawnPromotionMove = function (board, msanMove) {
  return h.isPawnPromotionMove(board, msanMove);
};
fenPGN.prototype.getSeated = function () {
  return { whiteSeat: this.whiteSeat, blackSeat: this.blackSeat };
};
fenPGN.prototype.empty = function () {
  this.history = [];
  if (this.lite) {
    this.history.push(h.getInitialStateLite(true));
  } else {
    this.history.push(h.getInitialState());
  }
};
fenPGN.prototype.evaluateBoard = h.evaluateBoard;
