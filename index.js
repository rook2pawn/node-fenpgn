var h = require('./help');
exports = module.exports = fenPGN;
function fenPGN(obj) {
    if (obj === undefined) {
        obj = {
            fullmovenum : 0,
            totalmovestring : ""
        };
    }
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
		console.log("Move #" + obj.currentHistory.moveNum + " : "  + obj.currentHistory.move + " at " + obj.currentHistory.time);
		console.log(copy.reverse());
		return self;
	};
    self.board = function() { 
        return board;
    };
    self.boardView = function() { 
        return board.slice(0).reverse();
    };
	return self;	
}
fenPGN.view = function (gamestr) {
	return fenPGN(gamestr).view();
}
