var common = require('./common');
var backwards = require('./backwardspawn');
var isolated = require('./isolatedpawn');
var candidatepassed = require('./candidatepassedpawn');
var doubledpawn = require('./doubledpawn');
var pawnanalysis = function(b) {
    var pawns = common.getPawns(b);
    var bbp = backwards.blackBackwardsPawn(b);
    var wbp = backwards.whiteBackwardsPawn(b);
    var bip = isolated.blackIsolatedPawn(b,pawns.black);
    var wip = isolated.whiteIsolatedPawn(b,pawns.white);
    var wcp = candidatepassed.whiteCandidatePassedPawn(b,pawns.white); 
    var bcp = candidatepassed.blackCandidatePassedPawn(b,pawns.black); 
    var wdp = doubledpawn.whiteDoubledPawn(b,pawns.white);
    var bdp = doubledpawn.blackDoubledPawn(b,pawns.black);
    return {
        bbp: bbp,
        wbp:wbp,
        bip:bip,
        wip:wip,
        wcp:wcp,
        bcp:bcp,
        wdp:wdp,
        bdp:bdp
    }
};
exports.analyze = pawnanalysis;
