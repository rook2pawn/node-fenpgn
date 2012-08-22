var img = require('./image');
var fenpgn = require('../index');
var fen = new fenpgn;

console.log(fen.board());
img.image(fen.board());

