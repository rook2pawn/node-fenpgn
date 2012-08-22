var Canvas = require('canvas');
var images = require('./loadimages');
var Board = require('./board');
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
        pieces: images
    });
    myBoard.drawAll();
};
module.exports = obj;
