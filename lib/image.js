var Canvas = require('canvas');
var imgSet = function(src) {
    var img = new Canvas.Image;
    img.src = src;
    return img;
};
var pieces = {};
pieces['b'] = imgSet('img/bishop_b200.png');
pieces['B'] = imgSet('img/bishop_w200.png');
pieces['r'] = imgSet('img/rook_b200.png');
pieces['R'] = imgSet('img/rook_w200.png');
pieces['p'] = imgSet('img/pawn_b200.png');
pieces['P'] = imgSet('img/pawn_w200.png');
pieces['q'] = imgSet('img/queen_b200.png');
pieces['Q'] = imgSet('img/queen_w200.png');
pieces['k'] = imgSet('img/king_b200.png');
pieces['K'] = imgSet('img/king_w200.png');
pieces['n'] = imgSet('img/knight_b200.png');
pieces['N'] = imgSet('img/knight_w200.png');

var strokeRect = function(ct, x,y,w,h,strokeStyle,lineWidth) {
    ct.save();
    ct.strokeStyle = strokeStyle;
    ct.lineWidth = lineWidth || 1;
    ct.strokeRect(x,y,w,h);
    ct.restore();
};
var drawRect = function(ct, x,y,w,h, color,linewidth) {
    ct.save();
    ct.linewidth = linewidth || 1;
    ct.fillStyle = color;
    ct.fillRect(x,y,w,h);
    ct.restore();
};
var roundedRect = function(ctx,x,y,width,height,radius, strokestyle) {
    ctx.save();
    ctx.strokeStyle = strokestyle;
    ctx.lineWidth = 3;
    ctx.beginPath();  
    ctx.moveTo(x,y+radius);  
    ctx.lineTo(x,y+height-radius);  
    ctx.quadraticCurveTo(x,y+height,x+radius,y+height);  
    ctx.lineTo(x+width-radius,y+height);  
    ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);  
    ctx.lineTo(x+width,y+radius);  
    ctx.quadraticCurveTo(x+width,y,x+width-radius,y);  
    ctx.lineTo(x+radius,y);  
    ctx.quadraticCurveTo(x,y,x,y+radius);  
    ctx.stroke();  
};
var Board = function(params) {
    this.board = params.board;
    this.canvas = params.canvas;
    this.squareWidth = params.squareWidth;
    this.canvasHeight = params.squareWidth * 8;
    this.canvasWidth = params.squareWidth * 8;
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
    this.drawAll = function() {
        this.drawBoardView();
        this.drawPieces(this.pieces);
    };
    this.illuminateChessBox = function(params) {
        var row = params.row;
        var col = params.col;   
        var fillStyle = params.color;
        var strokeStyle = params.stroke;
        var squarewidth = this.squareWidth;
        var x = col* squarewidth;
        var y = row * squarewidth;
        if (params.buffer !== undefined) {
            var newCt = params.buffer.getContext('2d');
            drawRect(newCt,x,y,squarewidth,squarewidth,fillStyle);
            if (strokeStyle !== undefined) {
                this.strokeRect(newCt,x+1,y+1,squarewidth-2,squarewidth-2,strokeStyle,2);
            }
        } 
    };
    this.drawBoardView = function() {
        if (this.boardView !== undefined) {
            var boardViewCopy = copy(this.boardView);
            if (this.view == 'white') {
                boardViewCopy.reverse();
            }
            var modvalue = 1;
            for (var row = 0; row < 8; row++) {
                for (var col = 0; col < 8; col++) {
                    // draw bg color (dark/light)
                    if (((col+row) % 2) === modvalue) {
                        this.illuminateChessBox({buffer:boardBuffer,row:row,col:col,color:'rgb(209,138,71)'});
                    } else { 
                        this.illuminateChessBox({buffer:boardBuffer,row:row,col:col,color:'rgb(255,206,158)'});
                    } 
                }
            }
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
        if (typeof board === 'object') {
            Object.keys(board).forEach(function(key,val) {
                var rownum = parseInt(key);
                var rowArray = board[key];
                rowArray.forEach(function(val,index) {
                    if ((val !== '1') && (chessPieces[val] !== undefined)) {
                        newCtx.drawImage(chessPieces[val],index*squarewidth,rownum*squarewidth,squarewidth,squarewidth);
                    }
                });  
            }); 
        }
        this.ctx.drawImage(boardBuffer,0,0);
    };
};

var obj = {};
obj.image = function(board) {
    var myCanvas = new Canvas();
    var fs = require('fs')
      , out = fs.createWriteStream(__dirname + '/text.png')
      , stream = myCanvas.createPNGStream();

    stream.on('data', function(chunk){
      out.write(chunk);
    });

    stream.on('end', function(){
      console.log('saved png');
    });
console.log(Board);
    var myBoard = new Board({
        board: board,
        canvas : myCanvas,
        squareWidth: 32,
        pieces:pieces 
    });
    myBoard.drawAll();
};
module.exports = obj;
