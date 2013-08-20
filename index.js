var h = require('./lib/help');
exports = module.exports = fenPGN;
function fenPGN(history) {
    if (history === undefined) {
        history = [];
        history.push(h.start);
    }
    var last = function() {
        return history[history.length - 1];
    }
    this.enpassantsquare = undefined;
    this.isKingMated = function(params) {
        return h.isKingMated(params.board || last().board,params.color);
    };
    this.isKingCheckedOnMove = function(move) {
        var myboard = h.updateBoardMSAN(last().board, move);
        return h.isKingChecked(myboard);
    };
    this.isKingChecked = function(board) {
        return h.isKingChecked(board || last().board);
    };
    this.convertMoveToPosition = function(msanMove) {
        return h.convertMoveToPosition(msanMove);
    };
    this.getStartPieceInfo = function(params) {
        var theboard = params.board || last().board; 
        return h.getStartPieceInfo(theboard,params.msanMove);
    };
    this.getActivePlayer = function() {
        if (last().activeplayer == 'w') {
            return 'white';
        } 
        if (last().activeplayer == 'b') {
            return 'black';
        }
    };
	this.getHistory = function() {
		return history;
	};
    this.setHistory = function(newhistory) {
        history = newhistory;
    }
    this.getLastHistory = function() {
        return history[history.length-1];
    };
    this.getAvailableSquares = function(params) {
        var theboard = last().board;
        return h.getAvailableSquares(params.board || theboard, params.row,params.col,this.enpassantsquare);   
    };
    this.piecesUnicode = function() {
        return h.piecesUnicode;
    };
    this.reset = function() {
        history = [];
        history.push(h.start);
    };
	this.showHistory = function() {
	    history.forEach(function(obj) {
			console.log(obj);
		});
	};
    this.takeBack = function() {
        history.pop();
    };
    this.toFenPos = function(newboard) {
        return h.boardToFenPos(newboard || last().board);
    };
	this.mm = function(moveStr) {
		var templast = h.moveMSAN.apply(this,[last(),moveStr]);
        history.push(templast);
        return this;
	};
    this.move = function(moveStr) {
        this.mm(moveStr);
        return this;
    };
    this.totalmovestring = function() {
        return last.totalmovestring;
    };
	this.view = function() {
        console.log(last().board);
	};
    this.board = function() { 
        return last().board;
    };
    this.setWhiteSeat = function(obj) {
        last.whiteSeat.name = obj.name;
    };
    this.setBlackSeat = function(obj){
        last.blackSeat.name = obj.name;
    };
    this.isPawnPromotionMove = function(board,msanMove) {
        return h.isPawnPromotionMove(board,msanMove);
    }
    this.getSeated = function() {
        var seated = {};
        if (last.blackSeat.name !== undefined) {
            seated.blackSeat = last.blackSeat;
        };
        if (last.whiteSeat.name !== undefined) {
            seated.whiteSeat = last.whiteSeat;
        };
        return seated;
    };
};
