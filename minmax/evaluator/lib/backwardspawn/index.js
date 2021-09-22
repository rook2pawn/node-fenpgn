// a backwards pawn is specifically the wikipedia definition
// of a backwards pawn with the added caveat that
// the square if pushed forward is controlled by a sentry,
// i.e. an enemy pawn. Not another non-pawn enemy piece.
// chessprogramming.wikispaces.com/Backward+Pawns+%28Bitboards%29
var whiteBackwardsPawn = function(b) {
    var getUpperLeft = function(row,col) {
        if ((row >= 1) && (col >= 1))
            return b[row-1][col-1]
        return undefined
    }
    var getUpperRight = function(row,col) {
        if ((row >= 1) && (col <= 6))
            return b[row-1][col+1]
        return undefined
    }
    var getLeft = function(row,col) {
        if (col >= 1)
            return b[row][col-1]
        return undefined
    }
    var getRight = function(row,col) {
        if (col <= 6)
            return b[row][col+1]
        return undefined
    }
    // a candidate is unsupported.
    // a candidate has a forward pawn
    // a candidate has no help on its push square
    // its push square is open to move forward
    var candidates = [];
    for (var row = 1; row <= 6; row++) {
        for (var col = 0; col <= 7; col++) {
            var piece = b[row][col];
            if (piece == 'P') {
                // is adjacent and behind
                if (getUpperLeft(row,col) == 'P') {
                    // has no help on push square
                    if ((getLeft(row-1,col-1) != 'P') && (getRight(row-1,col-1) != 'P')) 
                    // is unsupported
                    if ((getUpperLeft(row-1,col-1) != 'P') && (getUpperRight(row-1,col-1) != 'P'))
                    // square is open to push into
                    //if (getLeft(row,col) == '1') 
                        candidates.push({piece:'P',row:row-1,col:col-1});
                }
                // is adjacent and behind
                if (getUpperRight(row,col) == 'P') {
                    // has no help on push square
                    if (getRight(row-1,col+1) != 'p') 
                    // is unsupported
                    if ((getUpperLeft(row-1,col+1) != 'P') && (getUpperRight(row-1,col+1) != 'P'))
                    // square is open to push into
                    //if (getRight(row,col) == '1') 
                        candidates.push({piece:'P',row:row-1,col:col+1});
                }
            }
        }
    }
    // to be backwards the controlled square is controlled
    // by a sentry.
    var backwards = [];
    candidates.forEach(function(candidate) {
        var row = candidate.row + 2;
        var isBackwards = false;
        if (row + 2 <= 7) {
            if (candidate.col + 1 <= 7) {
                if (b[row][candidate.col + 1] == 'p')
                    isBackwards = true;
            }
            if ((candidate.col - 1 >= 0) && (!isBackwards)) {
                if (b[row][candidate.col - 1] == 'p')
                    isBackwards = true;
            }
            if (isBackwards)
                backwards.push(candidate);
        }
    });
    return backwards;
};
// a backwards pawn is specifically the wikipedia definition
// of a backwards pawn with the added caveat that
// the square if pushed forward is controlled by a sentry,
// i.e. an enemy pawn. Not another non-pawn enemy piece.
// chessprogramming.wikispaces.com/Backward+Pawns+%28Bitboards%29
var blackBackwardsPawn = function(b) {
    var getLowerLeft = function(row,col) {
        if ((row <= 6) && (col >= 1))
            return b[row+1][col-1]
        return undefined
    }
    var getLowerRight = function(row,col) {
        if ((row <= 6) && (col <= 6))
            return b[row+1][col+1]
        return undefined
    }
    var getLeft = function(row,col) {
        if (col >= 1)
            return b[row][col-1]
        return undefined
    }
    var getRight = function(row,col) {
        if (col <= 6)
            return b[row][col+1]
        return undefined
    }
    // a candidate is unsupported.
    // a candidate has a forward pawn
    // a candidate has no help on its push square
    // its push square is open to move forward
    var candidates = [];
    for (var row = 6; row >= 1; row--) {
        for (var col = 0; col <= 7; col++) {
            var piece = b[row][col];
            if (piece == 'p') {
                // is adjacent and behind
                if (getLowerLeft(row,col) == 'p') {
                    // has no help on push square
                    if (getLeft(row+1,col-1) != 'p')
                    // is unsupported
                    if ((getLowerLeft(row+1,col-1) != 'p') && (getLowerRight(row+1,col-1) != 'p'))
                    // square is open to push into
                    //if (getLeft(row,col) == '1')
                        candidates.push({piece:'p',row:row+1,col:col-1});
                }
                // is adjacent and behind
                if (getLowerRight(row,col) == 'p') {
                    // has no help on push square
                    if (getRight(row+1,col+1) != 'p') 
                    // is unsupported
                    if ((getLowerLeft(row+1,col+1) != 'p') && (getLowerRight(row+1,col+1) != 'p'))
                    // square is open to push into
                    //if (getRight(row,col) == '1')
                        candidates.push({piece:'p',row:row+1,col:col+1});
                }
            }
        }
    }
    // to be backwards the controlled square is controlled
    // by a sentry.
    var backwards = [];
    candidates.forEach(function(candidate) {
        var row = candidate.row - 2;
        var isBackwards = false;
        if (row - 2 >= 0) {
            if (candidate.col + 1 <= 7) {
                if (b[row][candidate.col + 1] == 'P')
                    isBackwards = true;
            }
            if ((candidate.col - 1 >= 0) && (!isBackwards)) {
                if (b[row][candidate.col - 1] == 'P')
                    isBackwards = true;
            }
            if (isBackwards)
                backwards.push(candidate);
        }
    });
    return backwards;
};
exports.blackBackwardsPawn = blackBackwardsPawn;
exports.whiteBackwardsPawn = whiteBackwardsPawn;
