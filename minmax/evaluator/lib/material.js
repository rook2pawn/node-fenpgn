var materialanalysis = function(b) {
    var pointvalues = {
        'p' : 100,
        'n' : 400,
        'b' : 400,
        'r' : 600,
        'q' : 1200,
        'k' : 10000
    };
    var black = 0;
    var white = 0;
    for (var row = 0; row <= 7; row++) {
        for (var col = 0; col <= 7; col++) {
            var piece = b[row][col];
                if (piece !== '1') {
                    if (piece == piece.toLowerCase())
                        black += pointvalues[piece];
                    else 
                        white += pointvalues[piece.toLowerCase()];        
                }
        }
    }
    return { black: black, white:white }
};
var difference = function(obj1,obj2) {
    var diffset = {};
    diffset.black = obj1.black - obj2.black;
    diffset.white = obj1.white - obj2.white;
    return diffset;
};
exports.materialanalysis = materialanalysis;
exports.difference = difference;
