var h = require('./lib/help');
exports = module.exports = fenPGN;
function fenPGN(history) {
    if (!(this instanceof fenPGN)) 
        return new fenPGN
    if (history === undefined) {
        this.history = [];
        this.history.push(h.start);
    }

    // this flag is for mobile/lite cpu / client
    this.lite = false; // if this is set to true, some processor intensive instructions will not be carried out
    // namely no checking check status
    // also not checking 3 move reptition
    //etc...
    
    this.last = function() {
        return this.history[this.history.length - 1];
    }
    this.matchid = undefined;
    this.whiteSeat = undefined;
    this.blackSeat = undefined;
    this.result = 'open'; // can be draw, open (unfinished/inprogress), black, white, blackconcedes,whiteconcedes
    this.setResult = function(result) {
        this.result = result;
    };
    this.getResult = function() {
        return this.result;
    }
    this.enpassantsquare = undefined;
    this.isKingMated = function(params) {
        return h.isKingMated(params.board || this.last().board,params.color);
    };
    this.isKingCheckedOnMove = function(move) {
        var myboard = h.updateBoardMSAN(this.last().board, move);
        return h.isKingChecked(myboard);
    };
    this.isKingChecked = function(board) {
        return h.isKingChecked(board || this.last().board);
    };
    this.convertMoveToPosition = function(msanMove) {
        return h.convertMoveToPosition(msanMove);
    };
    this.getStartPieceInfo = function(params) {
        var theboard = params.board || this.last().board; 
        return h.getStartPieceInfo(theboard,params.msanMove);
    };
    this.getActivePlayer = function() {
        if (this.last().activeplayer == 'w') {
            return 'white';
        } 
        if (this.last().activeplayer == 'b') {
            return 'black';
        }
    };
	this.getHistory = function() {
		return this.history;
	};
    this.setHistory = function(newhistory) {
        this.history = newhistory;
    }
    this.getLastHistory = function() {
        return this.history[this.history.length-1];
    };
    this.getAvailableSquares = function(params) {
        var theboard = this.last().board;
        return h.getAvailableSquares(params.board || theboard, params.row,params.col,this.enpassantsquare);   
    };
    this.piecesUnicode = function() {
        return h.piecesUnicode;
    };
    this.reset = function() {
        this.history = [];
        this.history.push(h.start);
    };
	this.showHistory = function() {
	    this.history.forEach(function(obj) {
			console.log(obj);
		});
	};
    this.takeBack = function() {
        this.history.pop();
    };
    this.toFenPos = function(newboard) {
        return h.boardToFenPos(newboard || this.last().board);
    };
	this.mm = function(moveStr) {
        var oldlast = this.last(); 
		var templast = h.moveMSAN.apply(this,[oldlast,moveStr]);
        this.history.push(templast);
        return this;
	};
    this.move = function(moveStr) {
        this.mm(moveStr);
        return this;
    };
    this.totalmovestring = function() {
        return this.last().totalmovestring;
    };
	this.view = function() {
        console.log(this.last().board);
	};
    this.board = function() { 
        return this.last().board;
    };
    this.setMatchId = function(id) {
        this.matchid = id;
    }
    this.getMatchId = function(id) {
        return this.matchid;
    }
    this.setWhiteSeat = function(obj) {
        this.whiteSeat = obj;
    };
    this.setBlackSeat = function(obj){
        this.blackSeat = obj;
    };
    this.isPawnPromotionMove = function(board,msanMove) {
        return h.isPawnPromotionMove(board,msanMove);
    }
    this.getSeated = function() {
        return {whiteSeat:this.whiteSeat,blackSeat:this.blackSeat}
    };
};
