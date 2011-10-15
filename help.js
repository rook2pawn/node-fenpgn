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
// returns a list of moveable squares
exports.getAvailableSquares = function(board,row,col) {
    var isUpperCase = function(character) {
        if (character !== undefined) {
            if (character.toUpperCase() === character) {
                return true;
            }
        }
        return false;
    };
    var piece = board[row][col];
    var squares = [];
    var psquares = []; // potentialsquares
    switch (piece) {
        case 'P': 
                    if (board[row-1][col] === '1') {
                        psquares.push({row:row-1,col:col}); 
                        if ((row === 6) && (board[row-2][col] === '1')) {
                            psquares.push({row:row-2,col:col});
                        }
                    }
                    if (board[row-1][col-1] !== undefined) { 
                        if ((board[row-1][col-1] !== '1') && (!isUpperCase(board[row-1][col-1]))) {
                            psquares.push({row:row-1,col:col-1});
                        }
                    }
                    if (board[row-1][col+1] !== undefined) {
                        if ((board[row-1][col+1] !== '1') && (!isUpperCase(board[row-1][col+1]))) { 
                            psquares.push({row:row-1,col:col+1});
                        }
                    }
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) { 
                            squares.push(pos);
                        } 
                    });
                    break;
        case 'p':   
                    if (board[row+1][col] === '1') {
                        psquares.push({row:row+1,col:col}); 
                        if ((row === 1) && (board[row+2][col] === '1')) {
                            psquares.push({row:row+2,col:col});
                        }
                    }
                    if (board[row+1][col-1] !== undefined) {
                        if ((board[row+1][col-1] !== '1') && (isUpperCase(board[row+1][col-1]))) { 
                            psquares.push({row:row+1,col:col-1});
                        }
                    }
                    if (board[row+1][col+1] !== undefined) {
                        if ((board[row+1][col+1] !== '1') && (isUpperCase(board[row+1][col+1]))) {
                            psquares.push({row:row+1,col:col+1});
                        }
                    }
                    psquares.forEach(function(pos) {
                        if ((pos.row >= 0 && pos.row <= 7) && (pos.col >= 0 && pos.col <= 7)) { 
                            squares.push(pos);
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
        case 'K':
                    if (row !== 0) {
                        // top
                        if (board[row-1][col] === '1') {
                            psquares.push({row:row-1,col:col});
                        } 
                        // top left
                        if (board[row-1][col-1] === '1') {
                            psquares.push({row:row-1,col:col-1});
                        } 
                        // top right
                        if (board[row-1][col+1] === '1') {
                            psquares.push({row:row-1,col:col+1});
                        }
                    }   
                    if (row !== 7) {  
                        // bottom
                        if (board[row+1][col] === '1') {
                            psquares.push({row:row+1,col:col});
                        } 
                        // bottom left
                        if (board[row+1][col-1] === '1') {
                            psquares.push({row:row+1,col:col-1});
                        } 
                        // bottom right
                        if (board[row+1][col+1] === '1') {
                            psquares.push({row:row+1,col:col+1});
                        } 
                    }
                    if (col !== 0) {
                        // left
                        if (board[row][col-1] === '1') {
                            psquares.push({row:row,col:col-1});
                        } 
                    }
                    if (col !== 7) {
                        // right
                        if (board[row][col+1] === '1') {
                            psquares.push({row:row,col:col+1});
                        }
                    } 
                    squares = psquares;
                    break;
        case 'k':
                    if (row !== 0) {
                        // top
                        if (board[row-1][col] === '1') {
                            psquares.push({row:row-1,col:col});
                        } 
                        // top left
                        if (board[row-1][col-1] === '1') {
                            psquares.push({row:row-1,col:col-1});
                        } 
                        // top right
                        if (board[row-1][col+1] === '1') {
                            psquares.push({row:row-1,col:col+1});
                        }
                    }   
                    if (row !== 7) {  
                        // bottom
                        if (board[row+1][col] === '1') {
                            psquares.push({row:row+1,col:col});
                        } 
                        // bottom left
                        if (board[row+1][col-1] === '1') {
                            psquares.push({row:row+1,col:col-1});
                        } 
                        // bottom right
                        if (board[row+1][col+1] === '1') {
                            psquares.push({row:row+1,col:col+1});
                        } 
                    }
                    if (col !== 0) {
                        // left
                        if (board[row][col-1] === '1') {
                            psquares.push({row:row,col:col-1});
                        } 
                    }
                    if (col !== 7) {
                        // right
                        if (board[row][col+1] === '1') {
                            psquares.push({row:row,col:col+1});
                        }
                    } 
                    squares = psquares;
                    break;
        default :   
                    break;
    }
    // now delete any out of bound squares..
    return squares;
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
