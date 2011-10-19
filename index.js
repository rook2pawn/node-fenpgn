var h = require('./help');
exports = module.exports = fenPGN;
function fenPGN(obj) {
    if (obj === undefined) {
        obj = {
            history:[{whiteSeat:{name:undefined},blackSeat:{name:undefined},board:h.startboard,move:'',totalmovestring:'',moveNum:0,time:Date(),activeplayer:'w',fullmovenum:0}]
        };
    }
    var props = {};
    var last = obj.history[obj.history.length - 1];
    for (var name in last) {
        if (last.hasOwnProperty(name)) {
            props[name] = last[name];
        }
    }
	var moveMSAN = function(msanMove) {
        props.moveNum++;
        props.move = msanMove;
		props.totalmovestring += " " + msanMove; 
        props.totalmovestring = props.totalmovestring.trim();
		props.board = h.updateBoardMSAN(props.board,msanMove);
        if ((obj.history.length % 2) === 1) { 
            props.activeplayer = 'b';
        } else {
            props.activeplayer = 'w';
        }
        if (props.activeplayer == 'w') {
            props.fullmovenum++;
        }
		var histObj = {board:props.board,move:msanMove,totalmovestring:props.totalmovestring,moveNum:obj.history.length,time:Date(),activeplayer:props.activeplayer,fullmovenum:props.fullmovenum};
		obj.history = h.addMSANMove(obj.history,histObj);
	};
	var self = {};
    self.getStartPieceInfo = function(board,msanMove) {
        return h.getStartPieceInfo(board,msanMove);
    };
    self.getProps = function() {
        return props;
    }
    self.getActivePlayer = function() {
        if (props.activeplayer == 'w') {
            return 'white';
        } 
        if (props.activeplayer == 'b') {
            return 'black';
        }
    };
	self.getHistory = function() {
		return obj.history.slice();
	};
    self.getAvailableSquares = function(board,row,col) {
        return h.getAvailableSquares(board,row,col);   
    };
    self.piecesUnicode = function() {
        return h.piecesUnicode;
    };
    self.reset = function() {
        for (var name in obj) {
            delete obj[name];
        };
        obj.history = [];
        obj.history.push({board:board,move:'',totalmovestring:'',moveNum:0,time:Date(),activeplayer:'w',fullmovenum:0});
        return self;
    };
	self.showHistory = function() {
	    obj.history.forEach(function(obj) {
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
        return self;
	};
    self.totalmovestring = function() {
        return props.totalmovestring;
    };
	self.view = function() {
		var copy = props.board.slice(0);
        console.log(copy.reverse());
		return self;
	};
    self.board = function() { 
        return props.board;
    };
    self.boardView = function() { 
        return props.board.slice(0).reverse();
    };
    self.setWhiteSeat = function(obj) {
        props.whiteSeat.name = obj.name;
        return self;
    };
    self.setBlackSeat = function(obj){
        props.blackSeat.name = obj.name;
        return self;
    };
    self.getSeated = function() {
        var seated = {};
        if (props.blackSeat.name !== undefined) {
            seated.blackSeat = props.blackSeat;
        };
        if (props.whiteSeat.name !== undefined) {
            seated.whiteSeat = props.whiteSeat;
        };
        return seated;
    };
	return self;	
};
