var convertMoveToPosition = function(msanMove) {
	var colHash = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
	var start = msanMove.slice(0,2).trim(); var end = msanMove.slice(2,4).trim();
	var startrow = parseInt(start.slice(1,2)); var endrow = parseInt(end.slice(1,2));
	var startcol = colHash[start.slice(0,1)]; var endcol = colHash[end.slice(0,1)];
    return {start:{row:startrow,col:startcol},end:{row:endrow,col:endcol}}
}
exports.convertMoveToPosition = convertMoveToPosition;

var getPawns = function(b) {
    var white = [];
    var black = [];
    for (var row = 0; row <= 7; row++) {
        for (var col = 0; col <= 7; col++) {
            var piece = b[row][col];
            if (piece == 'P') {
                white.push({piece:'P',row:row,col:col});
            } else if (piece == 'p') {
                black.push({piece:'p',row:row,col:col});
            }
        }
    }
    return {white:white,black:black}
}
exports.getPawns = getPawns;
