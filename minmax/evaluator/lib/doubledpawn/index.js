var whiteDoubledPawn = function(b,pawns) {
    var doubled = [];
    var comparepiece = 'P';
    pawns.forEach(function(pawn) {
        var piecebelow = '';
        var pieceabove = '';
        if (pawn.row > 0)
            piecebelow = b[pawn.row-1][pawn.col];
        if (pawn.row < 7) 
            pieceabove = b[pawn.row+1][pawn.col];
        if ((piecebelow == comparepiece) || (pieceabove == comparepiece))
            doubled.push(pawn);
    });
    return doubled;
};
var blackDoubledPawn = function(b,pawns) {
    var doubled = [];
    var comparepiece = 'p';
    pawns.forEach(function(pawn) {
        var piecebelow = '';
        var pieceabove = '';
        if (pawn.row > 0)
            piecebelow = b[pawn.row-1][pawn.col];
        if (pawn.row < 7) 
            pieceabove = b[pawn.row+1][pawn.col];
        if ((piecebelow == comparepiece) || (pieceabove == comparepiece))
            doubled.push(pawn);
    });
    return doubled;
};
exports.whiteDoubledPawn = whiteDoubledPawn;
exports.blackDoubledPawn = blackDoubledPawn;
