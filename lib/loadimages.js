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

module.exports = pieces;
