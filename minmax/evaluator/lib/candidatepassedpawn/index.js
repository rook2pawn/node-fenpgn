// we will define candidate passed pawn
// 1. half open
// 2. if its advancing square is controlled by no more enemy pawns
// than friendly pawns
// 3. OR do a count of friendlies (on adjacent columns)  on all ranks 
// equal to and behind candidate potential. 
// Count all enemies (on adjacent columns) on all ranks
// ahead of candidate potential
// Ensure that friendly # is at least equal to enemy #

// i am going to combine steps 2 and 3 by cheating on 3 a bit
// by taking a Upper right/left, left/right, lower right/left sample
// and doing a calcuation

var isHalfOpen = function(b,pawn) {
    if (pawn.piece == 'p') {
        for (var row = pawn.row-1; row >= 0; row--) {
            var piece = b[row][pawn.col]; 
            if (piece ==  'P')
                return false;
        }    
        return true;
    }
    else if (pawn.piece == 'P') {
        for (var row = pawn.row+1; row <= 7; row++) {
            var piece = b[row][pawn.col]; 
            if (piece ==  'p')
                return false;
        }    
        return true;
    }
};
var whiteCandidatePassedPawn = function(b,pawns) {
    // from POV of white
    var getUpperLeft = function(row,col) {
        if ((row <= 6) && (col >= 1))
            return b[row+1][col-1]
        return undefined
    }
    // from POV of white
    var getUpperRight = function(row,col) {
        if ((row <= 6) && (col <= 6))
            return b[row+1][col+1]
        return undefined
    }
    // from POV of white
    var getLowerLeft = function(row,col) {
        if ((row >= 1) && (col >= 1))
            return b[row-1][col-1]
        return undefined
    }
    // from POV of white
    var getLowerRight = function(row,col) {
        if ((row >= 1) && (col <= 6))
            return b[row-1][col+1]
        return undefined
    }
    // from POV of white
    var getLeft = function(row,col) {
        if (col >= 1)
            return b[row][col-1]
        return undefined
    }
    // from POV of white
    var getRight = function(row,col) {
        if (col <= 6)
            return b[row][col+1]
        return undefined
    }
    
    var candidate = [];
    pawns.forEach(function(pawn) {
        var half = isHalfOpen(b,pawn);
        if (half) {
            var obj = {
            ul : getUpperLeft(pawn.row+1,pawn.col),
            ur : getUpperRight(pawn.row+1,pawn.col),
            l : getLeft(pawn.row,pawn.col),
            r : getRight(pawn.row,pawn.col),
            ll : getLowerLeft(pawn.row,pawn.col),
            lr : getLowerRight(pawn.row,pawn.col)
            }
            var count = 0;
            Object.keys(obj).forEach(function(key) {
                if (obj[key] == 'P') {
                    count++;
                } else if (obj[key] == 'p') {
                    count--;
                }
            });
            if (count >= 0) {
                candidate.push(pawn);
            }
        }
    });
    return candidate;
};
var blackCandidatePassedPawn = function(b,pawns) {
    // from POV of black
    var getUpperLeft = function(row,col) {
        if ((row >= 1) && (col >= 1))
            return b[row-1][col-1]
        return undefined
    }
    // from POV of black
    var getUpperRight = function(row,col) {
        if ((row >= 1) && (col <= 6))
            return b[row-1][col+1]
        return undefined
    }
    // from POV of black
    var getLowerLeft = function(row,col) {
        if ((row <= 6) && (col >= 1))
            return b[row+1][col-1]
        return undefined
    }
    // from POV of black
    var getLowerRight = function(row,col) {
        if ((row <= 6) && (col <= 6))
            return b[row+1][col+1]
        return undefined
    }
    // from POV of black
    var getLeft = function(row,col) {
        if (col >= 1)
            return b[row][col-1]
        return undefined
    }
    // from POV of black
    var getRight = function(row,col) {
        if (col <= 6)
            return b[row][col+1]
        return undefined
    }
    
    var candidate = [];
    pawns.forEach(function(pawn) {
        var half = isHalfOpen(b,pawn);
        if (half) {
            var obj = {
            ul : getUpperLeft(pawn.row-1,pawn.col),
            ur : getUpperRight(pawn.row-1,pawn.col),
            l : getLeft(pawn.row,pawn.col),
            r : getRight(pawn.row,pawn.col),
            ll : getLowerLeft(pawn.row,pawn.col),
            lr : getLowerRight(pawn.row,pawn.col)
            }
            var count = 0;
            Object.keys(obj).forEach(function(key) {
                if (obj[key] == 'p') {
                    count++;
                } else if (obj[key] == 'P') {
                    count--;
                }
            });
            if (count >= 0) {
                candidate.push(pawn);
            }
        }
    });
    return candidate;
};
exports.whiteCandidatePassedPawn = whiteCandidatePassedPawn;
exports.blackCandidatePassedPawn = blackCandidatePassedPawn;
