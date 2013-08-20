var Fenpgn = require('./');
var util = require('util');
//  .time
//  .moveNum
//  .activeplayer
//  .fullmovenum
//  .move
//  .totalmovestring
//  .board
//  .checkstatus
var log = function(obj) {
    obj.forEach(function(slice) {
        console.log("Movenum:" + slice.moveNum + " active:" + slice.activeplayer + " " + slice.move);
        console.log(slice.board);
        
    });
//console.log(util.inspect(obj, { colors:true,showHidden:false,depth: null }));
};
var fen = new Fenpgn;
fen.move('e2e4');
fen.move("e7e5");
fen.move("g1f3");
fen.move("b8c6");
fen.move('f1c4');
fen.move('g8f6');
fen.move('f3g5');
fen.move('d7d6');

log(fen.getHistory());
console.log(fen.isKingCheckedOnMove("c4f7"));
