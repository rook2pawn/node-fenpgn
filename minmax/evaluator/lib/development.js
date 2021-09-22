var Fenpgn = require('fenpgn');
var common = require('./common.js');
var openings = require('./openings/openings.js');
var util = require('util');


// award one point for development 
// when a knight, bishop, or rook move
// when the queen moves,
// when the king moves
// bishop developing pawn moves.

var development = function(history) {
    var white = { qr : 0, qn : 0, qb : 0, q : 0, k : 0, kb : 0, kn :0, kr :0, qbp : 0, kbp : 0 ,movenum:0};
    var black = { qr : 0, qn : 0, qb : 0, q : 0, k : 0, kb : 0, kn :0, kr :0, qbp : 0, kbp : 0 ,movenum:0};
    for (var idx = 1; idx < history.length; idx++) {
        var hist = history[idx];
        // the first is always startpos, which we skip
        var pos = common.convertMoveToPosition(hist.move);
        var movecolor= (hist.activeplayer == 'b') ? 'white' : 'black';
        var piece = hist.board[pos.end.row-1][pos.end.col-1];
        // isDev = is developing move
        var isDev = false;
        switch (piece.toLowerCase()) {
            case 'r' :
                if ((movecolor == 'white') && (pos.start.row == 1)){
                    if (pos.start.col == 1) {
                        white.qr = 1;
                        isDev = true;
                    }
                    else if (pos.start.col == 8) {
                        white.kr = 1;
                        isDev = true;
                    }
                } else if ((movecolor == 'black') && (pos.start.row == 8)) {
                    if (pos.start.col == 1) {
                        black.qr = 1;
                        isDev = true;
                    }
                    else if (pos.start.col == 8) {
                        black.kr = 1;
                        isDev = true;
                    }
                }
            break;
            case 'b' :
                if ((movecolor == 'white')  && (pos.start.row == 1)){
                    if (pos.start.col == 3) {
                        white.qb = 1;
                        isDev = true;
                    }
                    else if (pos.start.col == 6) {
                        white.kb = 1;
                        isDev = true;
                    }
                } else if ((movecolor == 'black') && (pos.start.row == 8)) {
                    if (pos.start.col == 3) {
                        black.qb = 1;
                        isDev = true;
                    }
                    else if (pos.start.col == 6) {
                        black.kb = 1;
                        isDev = true;
                    }
                }
            break;
            case 'n' :
                if ((movecolor == 'white')  && (pos.start.row == 1)){
                    if (pos.start.col == 2) {
                        white.qn = 1;
                        isDev = true;
                    }
                    else if (pos.start.col == 7) {
                        white.kn = 1;
                        isDev = true;
                    }
                } else if ((movecolor == 'black') && (pos.start.row == 8)) {
                    if (pos.start.col == 2) {
                        black.qn = 1;
                        isDev = true;
                    }
                    else if (pos.start.col == 7) {
                        black.kn = 1;
                        isDev = true;
                    }
                }
            break;
            case 'q' :
                if ((movecolor == 'white')  && (pos.start.row == 1)){
                    if (pos.start.col == 4) {
                        white.q = 1;
                        isDev = true;
                    }
                } else if ((movecolor == 'black') && (pos.start.row == 8)) {
                    if (pos.start.col == 4) {
                        black.q = 1;
                        isDev = true;
                    }
                }
            break;
            case 'k' :
                if ((movecolor == 'white')  && (pos.start.row == 1)){
                    if (pos.start.col == 5) {
                        white.k = 1;
                        isDev = true;
                    }
                } else if ((movecolor == 'black') && (pos.start.row == 8)) {
                    if (pos.start.col == 5) {
                        black.k = 1;
                        isDev = true;
                    }
                }
                if (hist.rooks[movecolor].kr.moved == true) {
                    if (movecolor == 'white') {
                        white.kr = 1;
                        isDev = true;
                    } else {
                        black.kr = 1;
                        isDev = true;
                    }
                } else if (hist.rooks[movecolor].qr.moved == true) {
                    if (movecolor == 'white') {
                        white.qr = 1;
                        isDev = true;
                    } else {
                        black.qr = 1;
                        isDev = true;
                    }
                }
            break;
            case 'p' :
                if (movecolor == 'white') {
                    if (pos.start.row == 2) 
                        switch (pos.start.col) {
                            case 5 :
                                white.kbp= 1;
                                isDev = true;
                            break; 
                            case 4 :
                                white.qbp= 1;
                                isDev = true;
                            break; 
                            case 2 :
                                white.qbp= 1;
                                isDev = true;
                            break; 
                            case 7 :
                                white.kbp = 1;
                                isDev = true;
                            break; 
                            default: 
                            break;
                        }
                } else if (movecolor == 'black') {
                    if (pos.start.row == 7) 
                        switch (pos.start.col) {
                            case 5 :
                                black.kbp= 1;
                                isDev = true;
                            break; 
                            case 4 :
                                black.qbp= 1;
                                isDev = true;
                            break; 
                            case 2 :
                                black.qbp= 1;
                                isDev = true;
                            break; 
                            case 7 :
                                black.kbp = 1;
                                isDev = true;
                            break; 
                            default: 
                            break;
                        }
                }
            break;
            default:
            break;
        }
        if (isDev) {
            if (movecolor == 'white')     
                white.movenum = hist.fullmovenum;
            else 
                black.movenum = hist.fullmovenum;
        }
    };
    var count = function(obj) {
        var num = 0;
        Object.keys(obj).forEach(function(key) {
            if (key !== 'movenum') 
                num += obj[key]
        });
        return num
    }
    var wc = count(white);
    var bc = count(black);
    return {white:white,wc:wc,bc:bc,black:black}
};
var difference = function(obj1,obj2) {
    var diffset = {};
    diffset.wc = obj1.wc - obj2.wc;
    diffset.bc = obj1.bc - obj2.bc;
    return diffset;
}
exports.development = development; 
exports.difference = difference;
