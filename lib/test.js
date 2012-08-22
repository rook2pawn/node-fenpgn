var img = require('./image');
var fenpgn = require('../index');
var fen = new fenpgn;

fen.mm('e2e4');
console.log(fen.board());
img.image(fen.board());

