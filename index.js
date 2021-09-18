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

  const isDev = true;
  const startState = isDev ? "open_dev" : "open";
  const terminalState = isDev ? { reset: "reset" } : {};
  const fsm_status = nanostate(startState, {
    open: { start: "inprogress", abandoned: "abandoned" },
    open_dev: {
      start: "inprogress",
      abandoned: "abandoned",
      reset: "reset",
      promoWhite: "promoSelectionWhite",
      promoBlack: "promoSelectionBlack",
    },
    reset: { open: "open_dev" },
    inprogress: {
      draw: "draw",
      whiteWins_checkmate: "whiteWins_checkmate",
      blackWins_checkmate: "blackWins_checkmate",
      blackConcedes: "blackConcedes",
      whiteConcedes: "whiteConcedes",
      blackForfeits: "blackForfeits",
      whiteForfeits: "whiteForfeits",
      blackAbandons: "blackAbandons",
      whiteAbandons: "whiteAbandons",
      whiteWins_time: "whiteWins_time",
      blackWins_time: "blackWins_time",
      promoWhite: "promoSelectionWhite",
      promoBlack: "promoSelectionBlack",
    },
    promoSelectionWhite: { selected: "inprogress" },
    promoSelectionBlack: { selected: "inprogress" },
    draw: terminalState,
    whiteWins_checkmate: terminalState,
    blackWins_checkmate: terminalState,
    blackConcedes: terminalState,
    whiteConcedes: terminalState,
    blackForfeits: terminalState,
    whiteForfeits: terminalState,
    whiteWins_time: terminalState,
    blackWins_time: terminalState,
    blackAbandons: terminalState,
    whiteAbandons: terminalState,
    abandoned: terminalState,
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
fenPGN.prototype.getPieceAtPosition = function ({ row, col }) {
  return this.history[this.history.length - 1].board[row][col];
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
fenPGN.prototype.getAvailableSquares = function ({ row, col, opts = {} }) {
  const state = this.stateLive();
  return h.getAvailableSquares(state.board, row, col, {
    enpassantsquare: state.enpassantsquare,
    whiteKingsideCastleAvailable: state.whiteKingsideCastleAvailable,
    whiteQueensideCastleAvailable: state.whiteQueensideCastleAvailable,
    blackKingsideCastleAvailable: state.blackKingsideCastleAvailable,
    blackQueensideCastleAvailable: state.blackQueensideCastleAvailable,
    ...opts,
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
  if (templast !== false) {
    this.history.push(templast);
    return true;
  }
  return false;
};
fenPGN.prototype.move = function (moveStr) {
  // incoming move is just point A to B i.e. e2e4.
  // however we first check if it is pawn Promotion in which case we have to NOT update the board  until
  // they make a decision as it can show a revealed check etc.

  console.log("move:", moveStr);
  const startPiece = h.getStartPieceInfo(this.stateLive().board, moveStr);
  console.log("startPiece", startPiece);
  if (!h.isPromotionMove(moveStr)) {
    console.log("not a promotion move. Checking to see if there is a promotion");
    // check for promotion
    if (
      startPiece.startpiece.toLowerCase() == "p" &&
      (startPiece.endRow == 7 || startPiece.endRow == 0)
    ) {
      if (startPiece.color === "white") {
        this.stateLive().promoPiece = { color: "white", msanMove: moveStr };
        console.log("it is a promotion move");
        this.status.emit("promoWhite");
      } else if (startPiece.color === "black") {
        console.log("it is a promotion move");
        this.stateLive().promoPiece = { color: "black", msanMove: moveStr };

        this.status.emit("promoBlack");
      }
      return false;
    }
  }
  const isValidMove = this.mm(moveStr);
  const last = this.history[this.history.length - 1];
  console.log("msanMove:", moveStr, "isValidMove:", isValidMove,  " move last:", last);
  const { winner, moveNum } = last;
  if (isValidMove) {
    if (winner.length) {
      if (winner === "w") {
        this.status.emit("whiteWins_checkmate");
      } else if (winner === "b") {
        this.status.emit("blackWins_checkmate");
      }
    }
    if (moveNum === 1) {
      this.status.emit("start");
    }
  }
  return this;
};
fenPGN.prototype.totalmovestring = function () {
  return this.history[this.history.length - 1].totalmovestring;
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
fenPGN.prototype.convertPositionToMove = h.convertPositionToMove;
