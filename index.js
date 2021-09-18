const h = require("./lib/help");
const deep = require("deep-copy");
const nanostate = require("nanostate");

exports = module.exports = fenPGN;
function fenPGN({
  lite = false,
  history = [],
  useTestBoard = false,
  id = "",
} = {}) {
  if (!(this instanceof fenPGN)) return new fenPGN();

  this.lite = lite;
  this.id = id;
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
  // make sure we start with blank history
  this.history = [];

  let initialState;
  if (lite) {
    initialState = h.getInitialStateLite();
  } else {
    initialState = h.getInitialState({ useTestBoard });
  }
  this.history.push(initialState);

  if (history.length) {
    history.split(" ").forEach((move) => {
      this.mm(move);
    });
  }
}

fenPGN.minmax = require("./lib/evaluate.js");
fenPGN.lib = h;
fenPGN.prototype.allMoves = function () {
  return h.allMoves(this.stateLive());
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
fenPGN.prototype.getStartPieceInfo = function ({ board, msanMove }) {
  return h.getStartPieceInfo({ board, msanMove });
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
  const { safeSquares, threatenedSquares, passedSquares } =
    h.getAvailableSquares({
      board: state.board,
      row,
      col,
      opts: {
        enpassantsquare: state.enpassantsquare,
        whiteKingsideCastleAvailable: state.whiteKingsideCastleAvailable,
        whiteQueensideCastleAvailable: state.whiteQueensideCastleAvailable,
        blackKingsideCastleAvailable: state.blackKingsideCastleAvailable,
        blackQueensideCastleAvailable: state.blackQueensideCastleAvailable,
        ...opts,
      },
    });
  return { safeSquares, threatenedSquares, passedSquares };
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
  // for lite we just mm without checking for promotion, without updating state machine, winner etc..
  if (this.lite) {
    return this.mm(moveStr);
  }
  // incoming move is just point A to B i.e. e2e4.
  // however we first check if it is pawn Promotion in which case we have to NOT update the board  until
  // they make a decision as it can show a revealed check etc.

  const startPiece = h.getStartPieceInfo({
    board: this.stateLive().board,
    msanMove: moveStr,
  });
  const isPromotionMove = h.isPromotionMove(moveStr);
  if (!isPromotionMove) {
    // check for promotion
    if (
      startPiece.startpiece.toLowerCase() == "p" &&
      (startPiece.endRow == 7 || startPiece.endRow == 0)
    ) {
      if (startPiece.color === "white") {
        this.stateLive().promoPiece = { color: "white", msanMove: moveStr };
        this.status.emit("promoWhite");
      } else if (startPiece.color === "black") {
        this.stateLive().promoPiece = { color: "black", msanMove: moveStr };
        this.status.emit("promoBlack");
      }
      return false;
    }
  }
  const isValidMove = this.mm(moveStr);
  const last = this.history[this.history.length - 1];
  const { winner, moveNum } = last;
  if (isValidMove) {
    if (winner.length) {
      if (winner === "w") {
        this.status.emit("whiteWins_checkmate");
      } else if (winner === "b") {
        this.status.emit("blackWins_checkmate");
      }
    }
    if (isPromotionMove) {
      this.status.emit("selected");
    } else if (moveNum === 1 && winner.length === 0) {
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
fenPGN.prototype.convertPositionToMove = h.convertPositionToMove;
