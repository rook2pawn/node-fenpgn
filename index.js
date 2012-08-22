var h = require('./lib/help');
exports = module.exports = fenPGN;
function fenPGN(obj) {
    if (obj === undefined) {
        obj = {};
        obj.history = [{whiteSeat:{name:undefined},blackSeat:{name:undefined},board:h.startboard,move:'',totalmovestring:'',moveNum:0,time:Date(),activeplayer:'w',fullmovenum:0,isCheckMove:false}]
    }
    var props = {};
    var last = obj.history[obj.history.length - 1];
    for (var name in last) {
        if (last.hasOwnProperty(name)) {
            props[name] = last[name];
        }
    }
    var board = last.board;
	var moveMSAN = function(msanMove) {
        props.moveNum++;
        if ((props.moveNum % 2) === 1) { 
            props.activeplayer = 'b';
        } else {
            props.activeplayer = 'w';
            props.fullmovenum++;
        }
        props.move = msanMove;
		props.totalmovestring += " " + msanMove; 
        props.totalmovestring = props.totalmovestring.trim();
		props.board = h.updateBoardMSAN(props.board,msanMove);
        board = props.board;
        props.isCheckMove = h.isCheckMove(props.board,props.move);
		var histObj = {board:props.board,move:msanMove,totalmovestring:props.totalmovestring,moveNum:obj.history.length,time:Date(),activeplayer:props.activeplayer,fullmovenum:props.fullmovenum,isCheckMove:props.isCheckMove};
		obj.history.push(histObj);
	};
    this.isKingMated = function(params) {
        var color = params.color;
        return h.isKingMated(board,color);
    };
    this.isKingCheckedOnMove = function(move) {
        var myboard = h.updateBoardMSAN(board, move);
        return h.isKingChecked(myboard);
    };
    this.getStartPieceInfo = function(params) {
        var theboard = params.board || board; 
        return h.getStartPieceInfo(theboard,params.msanMove);
    };
    this.getProps = function() {
        return props;
    }
    this.getActivePlayer = function() {
        if (props.activeplayer == 'w') {
            return 'white';
        } 
        if (props.activeplayer == 'b') {
            return 'black';
        }
    };
	this.getHistory = function() {
		return obj.history.slice();
	};
    this.getLastHistory = function() {
        if (obj.history.length > 0) {
            return obj.history[obj.history.length - 1];
        }
    };
    this.getAvailableSquares = function(params) {
        var theboard = params.board || board;
        return h.getAvailableSquares(theboard,params.row,params.col);   
    };
    this.piecesUnicode = function() {
        return h.piecesUnicode;
    };
    this.reset = function() {
        for (var name in obj) {
            delete obj[name];
        };
        obj.history = [];
        obj.history.push({board:board,move:'',totalmovestring:'',moveNum:0,time:Date(),activeplayer:'w',fullmovenum:0,isCheckMove:false});
    };
	this.showHistory = function() {
	    obj.history.forEach(function(obj) {
			console.log(obj);
		});
	};
    this.takeBack = function() {
        obj.history.pop();
    };
    this.toFenPos = function(newboard) {
        return h.boardToFenPos(newboard || board);
    };
	this.moveSAN = function(moveStr) {
		moveSAN(moveStr);
	};
	this.moveMSAN = function(moveStr) {
		moveMSAN(moveStr);
	};
	this.move = function(moveStr) {
		moveSAN(moveStr);
	};
	this.mm = function(moveStr) {
		moveMSAN(moveStr);
        return this;
	};
    this.totalmovestring = function() {
        return props.totalmovestring;
    };
	this.view = function() {
        console.log(board);
	};
    this.board = function() { 
        return board;
    };
    this.boardView = function() { 
        return board.slice(0).reverse();
    };
    this.setWhiteSeat = function(obj) {
        props.whiteSeat.name = obj.name;
    };
    this.setBlackSeat = function(obj){
        props.blackSeat.name = obj.name;
    };
    this.getSeated = function() {
        var seated = {};
        if (props.blackSeat.name !== undefined) {
            seated.blackSeat = props.blackSeat;
        };
        if (props.whiteSeat.name !== undefined) {
            seated.whiteSeat = props.whiteSeat;
        };
        return seated;
    };
};
