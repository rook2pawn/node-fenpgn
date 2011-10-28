var mlib = require('matrixlib');
//position startpos moves b1c3 c7c5 e2e4 g7g6 g1f3 f8g7 d2d4 c5d4
exports.processMSANHistory = function(msanHistory) {
	
};
exports.addMSANMove = function(moveHistory,msanMove) {
	moveHistory.push(msanMove);
	return moveHistory;
};
exports.piecesUnicode = {
    K: '♔', // U+2654
    Q: '♕', // U+2655
    R: '♖', // U+2656
    B: '♗', // U+2657
    N: '♘', // U+2658
    P: '♙', // U+2659

    k: '♚', //U+265A
    q: '♛', //U+265B
    r: '♜', // U+265C
    b: '♝', // U+265D
    n: '♞',// U+265E
    p: '♟',// U+265F

    1: ' ' // blank
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
	var boardcopy = mlib.copy(board);
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
exports.getStartPieceInfo = function(board,msanMove) {
    msanMove = msanMove.toString();
	var colHash = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
	var start = msanMove.slice(0,2).trim(); var end = msanMove.slice(2,4).trim();
	var startrow = start.slice(1,2); var endrow = end.slice(1,2);
	var startcol = colHash[start.slice(0,1)]; var endcol = colHash[end.slice(0,1)];
	var startpiece = board[startrow-1][startcol-1];
    var color = undefined;
    if (isUpperCase(startpiece)) 
        color = 'white';
    else 
        color = 'black'; 
    return {startpiece:startpiece,color:color,startRow:startrow,startCol:startcol,endRow:endrow,endCol:endcol}
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
		if (endcol == 3) { // queenside castle
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
var isIn = function(list,pos) {
    var match = false;
    if (list !== undefined) { 
        list.forEach(function(obj) {
            if ((obj.row === pos.row) && (obj.col === pos.col)) {
                match = true; 
            }   
        }); 
    }   
    return match;
};  
var isUpperCase = function(character) {
    if ((character !== undefined) && (character !== '1')) {
        if (character.toUpperCase() === character) {
            return true;
        }
    }
    return false;
};
// example
// threatenedBy(board,{row:3,col:5},'black') 
// returns a list of black positions (pieces that are black)
// that threaten that square.
var threatenedBy = function(board,pos,color) { 
    var threateningSquares = []; // squares that threaten pos 
    for (var row = 0; row <= 7; row++) {
        for (var col =0; col <= 7; col++) {
            if (color === 'black') {
                if ((!isUpperCase(board[row][col])) && (board[row][col] !== 'k')) {
                    var available = getThreatenSquares(board,row,col);
                    if (isIn(available,{row:pos.row,col:pos.col})) {
                        threateningSquares.push({row:row,col:col});
                    }
                }
            }
            if (color === 'white') {
                if ((isUpperCase(board[row][col])) && (board[row][col] !== 'K')) {
                    var available = getThreatenSquares(board,row,col);
                    if (isIn(available,{row:pos.row,col:pos.col})) {
                        threateningSquares.push({row:row,col:col});
                    }
                }
            }
        }
    }
    return threateningSquares;
};
// returns a list of squares that piece at row col on board can in fact THREATEN (not necessarily move! i.e. 
// the pawn can THREATEN but not necessarily move.. important because of king safe place to move checking..)
var getThreatenSquares = function(board,row,col) {
    var piece = board[row][col];
    var squares = [];
    var psquares = []; // potentialsquares
    switch (piece) {
        case 'p': 
                    psquares.push({row:row-1,col:col-1});
                    psquares.push({row:row-1,col:col+1});
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) { 
                            squares.push(pos);
                        } 
                    });
                    break;
        case 'P':   
                    psquares.push({row:row+1,col:col-1});
                    psquares.push({row:row+1,col:col+1});
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) { 
                            squares.push(pos);
                        } 
                    });
                    break;
        case 'n': 
                    psquares.push({row:row-1,col:col-2});
                    psquares.push({row:row+1,col:col-2});

                    psquares.push({row:row-2,col:col-1});
                    psquares.push({row:row+2,col:col-1});

                    psquares.push({row:row-1,col:col+2});
                    psquares.push({row:row+1,col:col+2});

                    psquares.push({row:row-2,col:col+1});
                    psquares.push({row:row+2,col:col+1});
                    
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) {
                            if ((board[pos.row][pos.col] === '1') || (board[pos.row][pos.col].toUpperCase() === board[pos.row][pos.col])) {
                                squares.push(pos);
                            }
                        }
                    });
                    break;
        case 'N': 
                    psquares.push({row:row-1,col:col-2});
                    psquares.push({row:row+1,col:col-2});

                    psquares.push({row:row-2,col:col-1});
                    psquares.push({row:row+2,col:col-1});

                    psquares.push({row:row-1,col:col+2});
                    psquares.push({row:row+1,col:col+2});

                    psquares.push({row:row-2,col:col+1});
                    psquares.push({row:row+2,col:col+1});
                    
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) {
                            if ((board[pos.row][pos.col] === '1') || (board[pos.row][pos.col].toLowerCase() === board[pos.row][pos.col])) {
                                squares.push(pos);
                            }
                        }
                    });
                    break;
        case 'r':   
                    for (var i = row-1; i >= 0; i--) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var i = row+1; i <= 7; i++) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col-1; j >= 0; j--) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col+1; j <= 7; j++) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    }
                    squares = psquares;
                    break; 
        case 'R':   
                    for (var i = row-1; i >= 0; i--) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (!isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var i = row+1; i <= 7; i++) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (!isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col-1; j >= 0; j--) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (!isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col+1; j <= 7; j++) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (!isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    }
                    squares = psquares;
                    break;
        case 'b':   
                    // up and left
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if (isUpperCase(board[i][j])) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // up and right
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if (isUpperCase(board[i][j])) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and left
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if (isUpperCase(board[i][j])) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and right
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if (isUpperCase(board[i][j])) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    squares = psquares;
                    break; 
        case 'B':    
                    // up and left
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if (!isUpperCase(board[i][j])) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // up and right
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if (!isUpperCase(board[i][j])) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and left
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if (!isUpperCase(board[i][j])) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and right
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col + index;
                            if (board[i][j] === '1') {
                                psquares.push({row:i,col:j});
                            } else if (!isUpperCase(board[i][j])) { 
                                psquares.push({row:i,col:j});
                                break;
                            } else {
                                break;
                            }
                    };
                    squares = psquares;
                    break; 
        case 'q': 
                    for (var i = row-1; i >= 0; i--) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var i = row+1; i <= 7; i++) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col-1; j >= 0; j--) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col+1; j <= 7; j++) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    }
                    // up and left
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // up and right
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and left
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and right
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    squares = psquares;
                    break;
        case 'Q': 
                    for (var i = row-1; i >= 0; i--) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (!isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var i = row+1; i <= 7; i++) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (!isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col-1; j >= 0; j--) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (!isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                        } else {
                            break;
                        }
                    } 
                    for (var j = col+1; j <= 7; j++) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (!isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    }
                    // up and left
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // up and right
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined))  { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and left
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and right
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col + index;
                            if (board[i][j] === '1') {
                                psquares.push({row:i,col:j});
                            } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                                psquares.push({row:i,col:j});
                                break;
                            } else {
                                break;
                            }
                    };
                    squares = psquares;
                    break;
        case 'k':
                    if (row !== 0) {
                        // top
                        if ((board[row-1][col] === '1') || (isUpperCase(board[row-1][col]))) {
                            psquares.push({row:row-1,col:col});
                        } 
                        // top left
                        if ((board[row-1][col-1] === '1') || (isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col-1});
                        } 
                        // top right
                        if ((board[row-1][col+1] === '1') || (isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col+1});
                        }
                    }   
                    if (row !== 7) {  
                        // bottom
                        if ((board[row+1][col] === '1') || (isUpperCase(board[row+1][col]))) {
                            psquares.push({row:row+1,col:col});
                        } 
                        // bottom left
                        if ((board[row+1][col-1] === '1') || (isUpperCase(board[row+1][col-1]))) {
                            psquares.push({row:row+1,col:col-1});
                        } 
                        // bottom right
                        if ((board[row+1][col+1] === '1') || (isUpperCase(board[row+1][col+1]))) {
                            psquares.push({row:row+1,col:col+1});
                        } 
                    }
                    if (col !== 0) {
                        // left
                        if ((board[row][col-1] === '1') || (isUpperCase(board[row][col-1]))) {
                            psquares.push({row:row,col:col-1});
                        } 
                    }
                    if (col !== 7) {
                        // right
                        if ((board[row][col+1] === '1') || (isUpperCase(board[row][col+1]))) {
                            psquares.push({row:row,col:col+1});
                        }
                    } 
                    if (row === 7) { 
                        if ((board[row][4] == 'k') && (board[row][5] === '1') && (board[row][6] === '1') && (board[row][7] == 'r')) {
                            //kingside castle
                            psquares.push({row:row,col:6});
                        }   
                        if ((board[row][4] == 'k') && (board[row][3] === '1') && (board[row][2] === '1') && (board[row][1] == '1') && (board[row][0] == 'r')) {
                            //queenside castle
                            psquares.push({row:row,col:2});
                        }   
                    }
                    psquares.forEach(function(pos) {
                        var threateningPieces = [];
                        threateningPieces = threatenedBy(board,pos,'black');
                        if (threateningPieces.length >= 1) {
                            threatenedSquares.push(pos);
                            //threateningPieces.forEach(function(blackPiecePos) {}); 
                        } else {
                            squares.push(pos);
                        }
                    });
                    break;
        case 'K':
                    if (row !== 0) {
                        // top
                        if ((board[row-1][col] === '1') || (!isUpperCase(board[row-1][col]))) {
                            psquares.push({row:row-1,col:col});
                        } 
                        // top left
                        if ((board[row-1][col-1] === '1') || (!isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col-1});
                        } 
                        // top right
                        if ((board[row-1][col+1] === '1') || (!isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col+1});
                        }
                    }   
                    if (row !== 7) {  
                        // bottom
                        if ((board[row+1][col] === '1') || (!isUpperCase(board[row+1][col]))) {
                            psquares.push({row:row+1,col:col});
                        } 
                        // bottom left
                        if ((board[row+1][col-1] === '1') || (!isUpperCase(board[row+1][col-1]))) {
                            psquares.push({row:row+1,col:col-1});
                        } 
                        // bottom right
                        if ((board[row+1][col+1] === '1') || (!isUpperCase(board[row+1][col+1]))) {
                            psquares.push({row:row+1,col:col+1});
                        } 
                    }
                    if (col !== 0) {
                        // left
                        if ((board[row][col-1] === '1') || (!isUpperCase(board[row][col-1]))) {
                            psquares.push({row:row,col:col-1});
                        } 
                    }
                    if (col !== 7) {
                        // right
                        if ((board[row][col+1] === '1') || (!isUpperCase(board[row][col+1]))) {
                            psquares.push({row:row,col:col+1});
                        }
                    }
                    if (row === 0) { 
                        if ((board[row][4] == 'K') && (board[row][5] === '1') && (board[row][6] === '1') && (board[row][7] == 'R')) {
                            //kingside castle
                            psquares.push({row:row,col:6});
                        }   
                        if ((board[row][4] == 'K') && (board[row][3] === '1') && (board[row][2] === '1') && (board[row][1] == '1') && (board[row][0] == 'R')) {
                            //queenside castle
                            psquares.push({row:row,col:2});
                        }   
                    }
                    psquares.forEach(function(pos) {
                        var threateningPieces = [];
                        threateningPieces = threatenedBy(board,pos,'white');
                        if (threateningPieces.length >= 1) {
                            threatenedSquares.push(pos);
                            //threateningPieces.forEach(function(whitePiecePos) {}); 
                        } else {
                            squares.push(pos);
                        }
                    });
                    break;
        default :   
                    break;
    }
    // now delete any out of bound squares..
    return squares;
};
// returns a list of moveable squares
var getAvailableSquares = function(board,row,col) {
    var piece = board[row][col];
    var squares = [];
    var threatenedSquares = [];
    var psquares = []; // potentialsquares
    switch (piece) {
        case 'p': 
                    if (board[row-1][col] === '1') {
                        psquares.push({row:row-1,col:col}); 
                        if ((row === 6) && (board[row-2][col] === '1')) {
                            psquares.push({row:row-2,col:col});
                        }
                    }
                    if (board[row-1][col-1] !== undefined) { 
                        if ((board[row-1][col-1] !== '1') && (isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col-1});
                        }
                    }
                    if (board[row-1][col+1] !== undefined) {
                        if ((board[row-1][col+1] !== '1') && (isUpperCase(board[row-1][col+1]))) { 
                            psquares.push({row:row-1,col:col+1});
                        }
                    }
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) { 
                            squares.push(pos);
                        } 
                    });
                    break;
        case 'P':   
                    if (board[row+1][col] === '1') {
                        psquares.push({row:row+1,col:col}); 
                        if ((row === 1) && (board[row+2][col] === '1')) {
                            psquares.push({row:row+2,col:col});
                        }
                    }
                    if (board[row+1][col-1] !== undefined) {
                        if ((board[row+1][col-1] !== '1') && (!isUpperCase(board[row+1][col-1]))) { 
                            psquares.push({row:row+1,col:col-1});
                        }
                    }
                    if (board[row+1][col+1] !== undefined) {
                        if ((board[row+1][col+1] !== '1') && (!isUpperCase(board[row+1][col+1]))) {
                            psquares.push({row:row+1,col:col+1});
                        }
                    }
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) { 
                            squares.push(pos);
                        } 
                    });
                    break;
        case 'n': 
                    psquares.push({row:row-1,col:col-2});
                    psquares.push({row:row+1,col:col-2});

                    psquares.push({row:row-2,col:col-1});
                    psquares.push({row:row+2,col:col-1});

                    psquares.push({row:row-1,col:col+2});
                    psquares.push({row:row+1,col:col+2});

                    psquares.push({row:row-2,col:col+1});
                    psquares.push({row:row+2,col:col+1});
                    
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) {
                            if ((board[pos.row][pos.col] === '1') || (board[pos.row][pos.col].toUpperCase() === board[pos.row][pos.col])) {
                                squares.push(pos);
                            }
                        }
                    });
                    break;
        case 'N': 
                    psquares.push({row:row-1,col:col-2});
                    psquares.push({row:row+1,col:col-2});

                    psquares.push({row:row-2,col:col-1});
                    psquares.push({row:row+2,col:col-1});

                    psquares.push({row:row-1,col:col+2});
                    psquares.push({row:row+1,col:col+2});

                    psquares.push({row:row-2,col:col+1});
                    psquares.push({row:row+2,col:col+1});
                    
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) {
                            if ((board[pos.row][pos.col] === '1') || (board[pos.row][pos.col].toLowerCase() === board[pos.row][pos.col])) {
                                squares.push(pos);
                            }
                        }
                    });
                    break;
        case 'r':   
                    for (var i = row-1; i >= 0; i--) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var i = row+1; i <= 7; i++) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col-1; j >= 0; j--) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col+1; j <= 7; j++) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    }
                    squares = psquares;
                    break; 
        case 'R':   
                    for (var i = row-1; i >= 0; i--) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (!isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var i = row+1; i <= 7; i++) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (!isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col-1; j >= 0; j--) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (!isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col+1; j <= 7; j++) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (!isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    }
                    squares = psquares;
                    break;
        case 'b':   
                    // up and left
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // up and right
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)){ 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and left
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)){ 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and right
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)){ 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    squares = psquares;
                    break; 
        case 'B':    
                    // up and left
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)){ 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // up and right
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)){ 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and left
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)){ 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and right
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col + index;
                            if (board[i][j] === '1') {
                                psquares.push({row:i,col:j});
                            } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)){ 
                                psquares.push({row:i,col:j});
                                break;
                            } else {
                                break;
                            }
                    };
                    squares = psquares;
                    break; 
        case 'q': 
                    for (var i = row-1; i >= 0; i--) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var i = row+1; i <= 7; i++) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col-1; j >= 0; j--) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col+1; j <= 7; j++) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    }
                    // up and left
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // up and right
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and left
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and right
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    squares = psquares;
                    break;
        case 'Q': 
                    for (var i = row-1; i >= 0; i--) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (!isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var i = row+1; i <= 7; i++) {
                        if (board[i][col] === '1') {
                            psquares.push({row:i,col:col});
                        } else if (!isUpperCase(board[i][col])) { 
                            psquares.push({row:i,col:col});
                            break;
                        } else {
                            break;
                        }
                    } 
                    for (var j = col-1; j >= 0; j--) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (!isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                        } else {
                            break;
                        }
                    } 
                    for (var j = col+1; j <= 7; j++) {
                        if (board[row][j] === '1') {
                            psquares.push({row:row,col:j});
                        } else if (!isUpperCase(board[row][j])) { 
                            psquares.push({row:row,col:j});
                            break;
                        } else {
                            break;
                        }
                    }
                    // up and left
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // up and right
                    var index = 0;
                    for (var i = row-1; i >= 0; i--) {
                        index++; 
                        var j = col + index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined))  { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and left
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col - index;
                        if (board[i][j] === '1') {
                            psquares.push({row:i,col:j});
                        } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                            psquares.push({row:i,col:j});
                            break;
                        } else {
                            break;
                        }
                    };
                    // down and right
                    var index = 0;
                    for (var i = row+1; i <= 7; i++) {
                        index++; 
                        var j = col + index;
                            if (board[i][j] === '1') {
                                psquares.push({row:i,col:j});
                            } else if ((!isUpperCase(board[i][j])) && (board[i][j] !== undefined)) { 
                                psquares.push({row:i,col:j});
                                break;
                            } else {
                                break;
                            }
                    };
                    squares = psquares;
                    break;
        case 'k':
                    if (row !== 0) {
                        // top
                        if ((board[row-1][col] === '1') || (isUpperCase(board[row-1][col]))) {
                            psquares.push({row:row-1,col:col});
                        } 
                        // top left
                        if ((board[row-1][col-1] === '1') || (isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col-1});
                        } 
                        // top right
                        if ((board[row-1][col+1] === '1') || (isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col+1});
                        }
                    }   
                    if (row !== 7) {  
                        // bottom
                        if ((board[row+1][col] === '1') || (isUpperCase(board[row+1][col]))) {
                            psquares.push({row:row+1,col:col});
                        } 
                        // bottom left
                        if ((board[row+1][col-1] === '1') || (isUpperCase(board[row+1][col-1]))) {
                            psquares.push({row:row+1,col:col-1});
                        } 
                        // bottom right
                        if ((board[row+1][col+1] === '1') || (isUpperCase(board[row+1][col+1]))) {
                            psquares.push({row:row+1,col:col+1});
                        } 
                    }
                    if (col !== 0) {
                        // left
                        if ((board[row][col-1] === '1') || (isUpperCase(board[row][col-1]))) {
                            psquares.push({row:row,col:col-1});
                        } 
                    }
                    if (col !== 7) {
                        // right
                        if ((board[row][col+1] === '1') || (isUpperCase(board[row][col+1]))) {
                            psquares.push({row:row,col:col+1});
                        }
                    } 
                    if (row === 7) { 
                        if ((board[row][4] == 'k') && (board[row][5] === '1') && (board[row][6] === '1') && (board[row][7] == 'r')) {
                            //kingside castle
                            psquares.push({row:row,col:6});
                        }   
                        if ((board[row][4] == 'k') && (board[row][3] === '1') && (board[row][2] === '1') && (board[row][1] == '1') && (board[row][0] == 'r')) {
                            //queenside castle
                            psquares.push({row:row,col:2});
                        }   
                    }
                    psquares.forEach(function(pos) {
                        var threateningPieces = [];
                        threateningPieces = threatenedBy(board,pos,'white');
                        if (threateningPieces.length >= 1) {
                            threatenedSquares.push(pos);
                            //threateningPieces.forEach(function(blackPiecePos) {}); 
                        } else {
                            squares.push(pos);
                        }
                    });
                    break;
        case 'K':
                    if (row !== 0) {
                        // top
                        if ((board[row-1][col] === '1') || (!isUpperCase(board[row-1][col]))) {
                            psquares.push({row:row-1,col:col});
                        } 
                        // top left
                        if ((board[row-1][col-1] === '1') || (!isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col-1});
                        } 
                        // top right
                        if ((board[row-1][col+1] === '1') || (!isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col+1});
                        }
                    }   
                    if (row !== 7) {  
                        // bottom
                        if ((board[row+1][col] === '1') || (!isUpperCase(board[row+1][col]))) {
                            psquares.push({row:row+1,col:col});
                        } 
                        // bottom left
                        if ((board[row+1][col-1] === '1') || (!isUpperCase(board[row+1][col-1]))) {
                            psquares.push({row:row+1,col:col-1});
                        } 
                        // bottom right
                        if ((board[row+1][col+1] === '1') || (!isUpperCase(board[row+1][col+1]))) {
                            psquares.push({row:row+1,col:col+1});
                        } 
                    }
                    if (col !== 0) {
                        // left
                        if ((board[row][col-1] === '1') || (!isUpperCase(board[row][col-1]))) {
                            psquares.push({row:row,col:col-1});
                        } 
                    }
                    if (col !== 7) {
                        // right
                        if ((board[row][col+1] === '1') || (!isUpperCase(board[row][col+1]))) {
                            psquares.push({row:row,col:col+1});
                        }
                    }
                    if (row === 0) { 
                        if ((board[row][4] == 'K') && (board[row][5] === '1') && (board[row][6] === '1') && (board[row][7] == 'R')) {
                            //kingside castle
                            psquares.push({row:row,col:6});
                        }   
                        if ((board[row][4] == 'K') && (board[row][3] === '1') && (board[row][2] === '1') && (board[row][1] == '1') && (board[row][0] == 'R')) {
                            //queenside castle
                            psquares.push({row:row,col:2});
                        }   
                    }
                    psquares.forEach(function(pos) {
                        var threateningPieces = [];
                        threateningPieces = threatenedBy(board,pos,'black');
                        if (threateningPieces.length >= 1) {
                            threatenedSquares.push(pos);
                            //threateningPieces.forEach(function(whitePiecePos) {}); 
                        } else {
                            squares.push(pos);
                        }
                    });
                    break;
        default :   
                    break;
    }
    // to do: now delete any out of bound squares
    // if any are left over
    return {availableSquares:squares, threatenedSquares:threatenedSquares};
};
// isCheckMove(board, msanMove)
exports.isCheckMove = function(board,msanMove) {
	var colHash = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
    var end = msanMove.slice(2,4).trim();
	var endrow = end.slice(1,2);
	var endcol = colHash[end.slice(0,1)];
	var piece = board[endrow-1][endcol-1];
    var color = undefined;
    if (isUpperCase(piece)) 
        color = 'white';
    else 
        color = 'black'; 
    var results = getAvailableSquares(board,endrow-1,endcol-1); 
    var squares = results.availableSquares;
    var isCheck = false;
    for (var i = 0; i < squares.length; i++) {
        var row = squares[i].row;
        var col = squares[i].col;
        if ((board[row][col] == 'K') && (color == 'black')) {
            isCheck = true; 
        }
        if ((board[row][col] == 'k') && (color == 'white')) {
            isCheck = true; 
        }
    }
    return isCheck;
};
exports.getAvailableSquares = getAvailableSquares;
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
