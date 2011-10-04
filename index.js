var h = require('./help');
exports = module.exports = fenPGN;
function fenPGN(obj) {
	var moveHistory = [];
	var board = startboard = h.startboard;
	var moveSAN = function(san) {
//		h.addSANMove(moveHistory,sanMove);
	};
	var totalmovestring = '';
	var currentHistObj = {};
	var moveMSAN = function(msanMove) {
		totalmovestring += " " + msanMove; 
		board = h.updateBoardMSAN(board,msanMove);
		var histObj = {board:board,move:msanMove,totalmovestring:totalmovestring,moveNum:moveHistory.length,time:Date()};
		moveHistory = h.addMSANMove(moveHistory,histObj);
		currentHistObj = histObj;
	};
	var self = {};
	self.getHistory = function() {
		return moveHistory;
	};
	self.showHistory = function() {
		moveHistory.forEach(function(obj) {
			console.log(obj);
		});
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
		return self;
	};
	self.view = function() {
		var copy = board.slice(0);
		console.log("Move #" + currentHistObj.moveNum + " : "  + currentHistObj.move + " at " + currentHistObj.time);
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
