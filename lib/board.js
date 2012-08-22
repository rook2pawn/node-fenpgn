var Canvas = require('canvas');
var Board = function(params) {
    this.board = params.board;
    this.canvas = params.canvas;
    this.squareWidth = params.squareWidth;
    this.canvasHeight = params.squareWidth * 8;
    this.canvasWidth = params.squareWidth * 8;
    this.startx = params.startx || 0;
    this.starty = params.starty || 0;
    this.pieces = params.pieces;
    
    // board but at view layer
    this.boardView = undefined;
    var copy = function(matrix) {
        var newMatrix = []; 
        matrix.forEach(function(row) {
            newMatrix.push(row.slice(0));
        }); 
        return newMatrix;
    };  
    var createBoardView = function(board) {
        var boardView = undefined;
        if (board !== undefined) {
            boardView = copy(board);
            for (var row = 0; row <= 7; row++) {
                for (var col = 0; col <= 7; col++) {
                    var piece = board[row][col];
                    var square = {};
                    square.piece = piece;
                    boardView[row][col] = square;
                }
            }
        }
        return boardView;
    }
    this.boardView = createBoardView(this.board);
    this.view = 'white';
    this.ctx = this.canvas.getContext('2d');
    // an internal canvas buffer for chessboard 
    var boardBuffer = new Canvas();
    boardBuffer.width = this.canvasWidth;
    boardBuffer.height = this.canvasHeight;
    
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvasMinX = function() { 
        return 0;
    }
    this.canvasMaxX = this.canvasMinX() + this.canvasWidth; 
    this.canvasMinY = function() {
        return 0;
    }
    this.canvasMaxY = this.canvasMinY() + this.canvasHeight;
    this.setBoard = function(board) {
        if (board !== undefined) {
            this.board = board;
            this.boardView = createBoardView(board);
        }
    };
    this.drawStatus = function() {
        this.ctx.drawImage(statusBuffer,0,0);
    };
    this.drawAll = function() {
        this.drawBoardView();
        this.drawPieces(this.pieces);
    };
    this.isIn = function(x,y) {
        return ((x > this.canvasMinX() && x < this.canvasMaxX) && (y > this.canvasMinY() && y < this.canvasMaxY))
    };
    // x, y are mouse event pageX and pageY  coordinates i.e. evt.pageX,evt.pageY
    this.screen_coordinates = function(x,y) {
        var canvasx = x - this.canvasMinX();
        var canvasy = y - this.canvasMinY();
        var col = Math.floor(canvasx / this.squareWidth);
        var row = Math.floor(canvasy / this.squareWidth);
        return {col:col,row:row};
    };
    this.blackView_coordinates = function(x,y) {
        var canvasx = x - this.canvasMinX();
        var canvasy = y - this.canvasMinY();
        var col = Math.floor(canvasx / this.squareWidth);
        var row = Math.floor(canvasy / this.squareWidth);
        return {col:col,row:row};
    };
    this.whiteView_coordinates = function(x,y) {
        var canvasx = x - this.canvasMinX();
        var canvasy = y - this.canvasMinY();
        var col = Math.floor(canvasx / this.squareWidth);
        var row = Math.floor(canvasy / this.squareWidth);
        row = 7 - row;
        return {col:col,row:row};
    };
    this.drawBoardView = function() {
        if (this.boardView !== undefined) {
            var boardViewCopy = copy(this.boardView);
            if (this.view == 'white') {
                boardViewCopy.reverse();
            }
            var ctx = this.ctx;
            var startx = this.startx;
            var starty = this.starty;
            var modvalue = 1;
            this.ctx.drawImage(boardBuffer,0,0);
        }
    };
    this.drawPieces = function(pieces) {
        if (this.board === undefined) {
            return undefined;
        }
        var board = copy(this.board);
        if (this.view == 'white') {
            board.reverse();
        }
        var chessPieces = pieces;
        var newCtx = boardBuffer.getContext('2d');
        var squarewidth = this.squareWidth;
        var startx = this.startx;
        var starty = this.starty;
        if (typeof board === 'object') {
            Object.keys(board).forEach(function(key,val) {
                var rownum = parseInt(key);
                var rowArray = board[key];
                rowArray.forEach(function(val,index) {
                    if ((val !== '1') && (chessPieces[val] !== undefined)) {
                        newCtx.drawImage(chessPieces[val],index*squarewidth+startx,rownum*squarewidth+starty,squarewidth,squarewidth);
                    }
                });  
            }); 
        }
        this.ctx.drawImage(boardBuffer,0,0);
    };
};
module.exports = Board;
