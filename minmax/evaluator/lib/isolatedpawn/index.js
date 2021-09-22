// isolated pawn is no friendly pawns on adjacent files
// AND at least one enemy pawn on an an adjacent file
var whiteIsolatedPawn = function(b,pawns) {
    var isolated = [];
    pawns.forEach(function(pawn) {
        var hasFriend = false;
        if (pawn.col == 0) {
           for (var row = 0; row <= 7; row++ ) {
                if (b[row][1] == 'P') {
                    hasFriend = true;
                    break;
                }
           } 
        } else if (pawn.col == 7) {
           for (var row = 0; row <= 7; row++ ) {
                if (b[row][6] == 'P') {
                    hasFriend = true;
                    break;
                }
           } 
        } else {
           for (var row = 0; row <= 7; row++ ) {
                if (b[row][pawn.col - 1] == 'P') {
                    hasFriend = true;
                    break;
                }
                if (b[row][pawn.col + 1] == 'P') {
                    hasFriend = true;
                    break;
                }
           } 
        }
        if (!hasFriend) {
            isolated.push(pawn);
        }
    });
    return isolated;
};
var blackIsolatedPawn = function(b,pawns) {
    var isolated = [];
    pawns.forEach(function(pawn) {
        var hasFriend = false;
        if (pawn.col == 0) {
           for (var row = 0; row <= 7; row++ ) {
                if (b[row][1] == 'p') {
                    hasFriend = true;
                    break;
                }
           } 
        } else if (pawn.col == 7) {
           for (var row = 0; row <= 7; row++ ) {
                if (b[row][6] == 'p') {
                    hasFriend = true;
                    break;
                }
           } 
        } else {
           for (var row = 0; row <= 7; row++ ) {
                if (b[row][pawn.col - 1] == 'p') {
                    hasFriend = true;
                    break;
                }
                if (b[row][pawn.col + 1] == 'p') {
                    hasFriend = true;
                    break;
                }
           } 
        }
        if (!hasFriend) {
            isolated.push(pawn);
        }
    });
    return isolated;
};
exports.whiteIsolatedPawn = whiteIsolatedPawn;
exports.blackIsolatedPawn = blackIsolatedPawn;
