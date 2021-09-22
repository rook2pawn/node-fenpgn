var openings = require('./openings/openings.js');
var Fenpgn = require('fenpgn');
var util = require('util');
var log = function(obj) {
    console.log(util.inspect(obj,{colors:true,depth:null}));
};


var pawnshield = function(b,kingobj) {
    var getUpperLeft = function(row,col) {
        if ((row <= 6) && (col >= 1))
            return b[row+1][col-1]
        return undefined
    }
    var getUpperMid = function(row,col) {
        if ((row <= 6) && (col <= 6))
            return b[row+1][col]
        return undefined
    }
    var getUpperRight = function(row,col) {
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
    var getLowerLeft = function(row,col) {
        if ((row >= 1) && (col >= 1))
            return b[row-1][col-1]
        return undefined
    }
    var getLowerMid = function(row,col) {
        if ((row >= 1) && (col >= 1))
            return b[row-1][col]
        return undefined
    }
    var getLowerRight = function(row,col) {
        if ((row >= 1) && (col <= 6))
            return b[row-1][col+1]
        return undefined
    }
    var shieldLevels = function(shield1,shield2) {
        var total = 0;
        if (shield1.left.toLowerCase() == 'p') {
            total += 3;
        } else if (shield2.left.toLowerCase() == 'p') {
            total += 1;
        }
        if (shield1.middle.toLowerCase() == 'p') {
            total += 3;
        } else if (shield2.middle.toLowerCase() == 'p') {
            total += 1;
        }
        if (shield1.right.toLowerCase() == 'p') {
            total += 3; 
        } else if (shield2.right.toLowerCase() == 'p') {
            total += 1;
        }
        if (total >= 7) {
            total = 7;
        }
        return Math.floor((total / 7) * 100);
    }
    if (kingobj.king == 'K') {
        var shield1 = {
            left  :getUpperLeft(kingobj.row,kingobj.col),
            middle:getUpperMid(kingobj.row,kingobj.col),
            right :getUpperRight(kingobj.row,kingobj.col)
        };
        var shield2 = {
            left  :getUpperLeft(kingobj.row+1,kingobj.col),
            middle:getUpperMid(kingobj.row+1,kingobj.col),
            right :getUpperRight(kingobj.row+1,kingobj.col)
        }
        return {shield1:shield1,shield2:shield2,shieldLevels:shieldLevels(shield1,shield2)}
    } else if (kingobj.king == 'k') {
        var shield1 = {
            left  :getLowerLeft(kingobj.row,kingobj.col),
            middle:getLowerMid(kingobj.row,kingobj.col),
            right :getLowerRight(kingobj.row,kingobj.col)
        };
        var shield2 = {
            left  :getLowerLeft(kingobj.row-1,kingobj.col),
            middle:getLowerMid(kingobj.row-1,kingobj.col),
            right :getLowerRight(kingobj.row-1,kingobj.col)
        }
        return {shield1:shield1,shield2:shield2,shieldLevels:shieldLevels(shield1,shield2)}
    }
};

var kingsafety = function(b) {
    var ps = {};
    for (var row = 0; row <= 7; row++) {
        for (var col = 0; col <= 7; col++) {
            if (b[row][col] == 'K') {
//                b[row+1][col+1] = '1';
//                b[row+2][col+1] = '1';
//                console.log(b.slice().reverse());
                ps.white = pawnshield(b,{row:row,col:col,king:'K'});
            } else if (b[row][col] == 'k') {
                ps.black = pawnshield(b,{row:row,col:col,king:'k'});
            }
        }
    }
    
    return {pawnshield:ps}
};


var difference = function(obj1,obj2) {
    var diffset = {pawnshield:{}};
    diffset.pawnshield.white = obj1.pawnshield.white.shieldLevels - obj2.pawnshield.white.shieldLevels;
    diffset.pawnshield.black = obj1.pawnshield.black.shieldLevels - obj2.pawnshield.black.shieldLevels;
    return diffset;
};

exports.difference = difference;
exports.kingsafety = kingsafety;
