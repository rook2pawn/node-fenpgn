var h = require('./help');
exports = module.exports = fenPGN;
function fenPGN(obj) {
    if (obj === undefined) {
        obj = {
            fullmovenum : 0,
            totalmovestring : ""
        };
    }
    var whiteSeat = {};
    whiteSeat.name = undefined;
    var blackSeat = {};
    blackSeat.name = undefined;
	var history = obj.history || [];
	var board = obj.board || h.startboard;
	var moveSAN = function(san) {
//		h.addSANMove();
	};
	var currentHistory = obj.currentHistory || {};
	var moveMSAN = function(msanMove) {
		obj.totalmovestring += " " + msanMove; 
        obj.totalmovestring = obj.totalmovestring.trim();
		obj.board = board = h.updateBoardMSAN(board,msanMove);
        var fenpos = h.boardToFenPos(board);
        var activeplayer = 'w';
        if ((history.length % 2) === 0) { 
           activeplayer = 'b'; 
        }
        if (activeplayer == 'w') {
            obj.fullmovenum++;
        }
		var histObj = {board:obj.board,move:msanMove,totalmovestring:obj.totalmovestring,moveNum:history.length,time:Date(),activeplayer:activeplayer,fullmovenum:obj.fullmovenum};
		obj.history = h.addMSANMove(history,histObj);
		obj.currentHistory = histObj;
	};
	var self = {};
	self.getHistory = function() {
		return history.slice();
	};
    self.getAvailableSquares = function(board,row,col) {
        return h.getAvailableSquares(board,row,col);   
    };
    self.piecesUnicode = function() {
        return h.piecesUnicode;
    };
    self.reset = function() {
        obj.totalmovestring = '';
        history = obj.history = [];
        board = obj.board = h.startboard;
        return self;
    };
	self.showHistory = function() {
	    history.forEach(function(obj) {
			console.log(obj);
		});
	};
    self.boardToFenPos = function(board) {
        return h.boardToFenPos(board);
    };
	self.moveSAN = function(moveStr) {
		moveSAN(moveStr);
	};
	self.moveMSAN = function(moveStr) {
		moveMSAN(moveStr);
	};
	self.move = function(moveStr) {
		this.moveSAN(moveStr);
	};
	self.mm = function(moveStr) {
		this.moveMSAN(moveStr);
		return fenPGN(obj);
	};
    self.totalmovestring = function() {
        return obj.totalmovestring;
    };
	self.view = function() {
		var copy = board.slice(0);
        console.log(copy);
		return self;
	};
    self.board = function() { 
        return board;
    };
    self.boardView = function() { 
        return board.slice(0).reverse();
    };
    self.setWhiteSeat = function(obj) {
        whiteSeat.name = obj.name;
        return self;
    };
    self.setBlackSeat = function(obj){
        blackSeat.name = obj.name;
        return self;
    };
    self.getSeated = function() {
        var seated = {};
        if (blackSeat.name !== undefined) {
            seated.blackSeat = {};
            seated.blackSeat = blackSeat;
        };
        if (whiteSeat.name !== undefined) {
            seated.whiteSeat = {};
            seated.whiteSeat = whiteSeat;
        };
        return seated;
    };
	return self;	
}
fenPGN.view = function (gamestr) {
	return fenPGN(gamestr).view();
}
