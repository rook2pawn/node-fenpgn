var mlib = require('matrixlib');
//position startpos moves b1c3 c7c5 e2e4 g7g6 g1f3 f8g7 d2d4 c5d4
exports.processMSANHistory = function(msanHistory) {
	
};
exports.addMSANMove = function(moveHistory,msanMove) {
	moveHistory.push(msanMove);
	return moveHistory;
};
exports.startboard = [['R','N','B','Q','K','B','N','R'],
['P','P','P','P','P','P','P','P'],
['1','1','1','1','1','1','1','1'],
['1','1','1','1','1','1','1','1'],
['1','1','1','1','1','1','1','1'],
['1','1','1','1','1','1','1','1'],
['p','p','p','p','p','p','p','p'],
['r','n','b','q','k','b','n','r']];
exports.boardToFenPos = function(board) {
	var fenPos = '';
	var boardcopy = board.slice();
	boardcopy.reverse().forEach(function(row) {
		fenPos += row.join('') + '/';
	});
	var rep = function(substring,index,original) {
		return substring.length;
	};
	fenPos = fenPos.replace(/1+/g,rep);
	return fenPos.slice(0,-1).trim();	
};
exports.fenPosToBoard = function(fenPos) {
	var lines = fenPos.split('/');
	// like haskell's replicate function
	var replicate = function(val,num) {
		var out = [];
		for (var i = 0; i < num; i++) {
			out.push(val);
		}
		return out;
	};
	var rep = function(substring,index,original) {
		var length = parseInt(substring);
		return replicate(1, length).join('');
	};
	var board = lines.map(function(val) { val = val.replace(/\d+/g, rep); return val.split('')});
	return board;
};
// minimally we have to check for enpassant, but not castling rights.
// if the e1g1 move is issued, we assume we had already done move validation
// and we go ahead and resolve the castle. we also have to check for promotion.
exports.updateBoardMSAN = function(board,msanMove){
    msanMove = msanMove.toString();
	var _board = mlib.copy(board); // work on a copy 
	var colHash = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
	var start = msanMove.slice(0,2).trim(); var end = msanMove.slice(2,4).trim();
	var startrow = start.slice(1,2); var endrow = end.slice(1,2);
	var startcol = colHash[start.slice(0,1)]; var endcol = colHash[end.slice(0,1)];
	var startpiece = _board[startrow-1][startcol-1];
	var endpiece = _board[endrow-1][endcol-1];
	_board[startrow-1][startcol-1] = '1';
	_board[endrow-1][endcol-1] = startpiece;
	// check for enpassant capture. if so, make the correction.
	if ((startpiece.toLowerCase() == 'p') && (startrow == 5 || startrow == 4)
	&& (endpiece == '1') && (startcol != endcol)) {
		if (startpiece == 'P') {
			_board[endrow-2][endcol-1] = '1';
		} 
		if (startpiece == 'p') {
			_board[endrow][endcol-1] = '1';
		}
	}
	// its a castle
	if ((startpiece.toLowerCase() == 'k') && (Math.abs(endcol,startcol) > 1)) {
		if (endcol == 7) { // kingside castle
			_board[endrow-1][5] = _board[endrow-1][7];
			_board[endrow-1][7] = '1';
		} 
		if (endcol == 2) { // queenside castle
			_board[endrow-1][3] = _board[endrow-1][0];
			_board[endrow-1][0] = '1';
		};
	} 
	// check for promotion
	if ((startpiece.toLowerCase() == 'p') && ((endrow == 8) || (endrow == 1)) && (msanMove.length == 5)) {
		var promopiece = msanMove.slice(4,5);
		if (endrow == 8) promopiece = promopiece.toUpperCase();
		if (endrow == 1) promopiece = promopiece.toLowerCase();
		_board[endrow-1][endcol-1] = promopiece;
	}
	return _board;
};
exports.getFenFields = function(fenstring) {
	if (fenstring === undefined) { fenstring = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";};
	var fields = fenstring.split(' ');
	var fenProps = {
		pos : fields[0],
		activeColor : fields[1],
		castling : fields[2],
		enPassant : fields[3],
		halfmove : fields[4],
		fullmove :fields[5]
	};
	return fenProps;
};
