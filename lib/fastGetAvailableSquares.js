var isUpperCase = function(character) {
  return (character.toUpperCase() === character);
};

var fastGetAvailableSquares = function(board,piece,whiteKingsideCastleAvailable,whiteQueensideCastleAvailable,
  blackKingsideCastleAvailable,blackQueensideCastleAvailable,row,col,enpassantsquare) {
  var as = [];
  var color = undefined;
  if (piece == '1') {
    return as;
  }
  if (isUpperCase(piece)) {
    color = 'w';
  } else {
    color = 'b';
  }
  switch (piece) {
    case 'p': 
      if (row == 0) {
        break;
      }
      if (board[row-1][col] === '1') {
        as.push({row:row-1,col:col}); 
        if ((row === 6) && (board[row-2][col] === '1')) {
          as.push({row:row-2,col:col});
        }
      }
      if ((row > 0) && (col > 0)) { 
        var diag = board[row-1][col-1];
        if ((diag !== '1') && isUpperCase(diag)) {
          as.push({row:row-1,col:col-1});
        }
      }
      if ((row > 0) && (col < 7)) { 
        var diag = board[row-1][col+1];
        if ((diag !== '1') && isUpperCase(diag)) {
          as.push({row:row-1,col:col+1});
        }
      }
      if ((row === 3) && (enpassantsquare !== '-')) { 
        if (enpassantsquare.availableFor == 'black') {
          as.push({row:enpassantsquare.row,col:enpassantsquare.col});
        }
      }
      break;
    case 'P': 
      if (row == 7) {
        break;
      }
      if (board[row+1][col] === '1') {
        as.push({row:row+1,col:col}); 
        if ((row === 1) && (board[row+2][col] === '1')) {
          as.push({row:row+2,col:col});
        }
      }
      if ((row < 7) && (col > 0)) { 
        var diag = board[row+1][col-1];
        if ((diag !== '1') && !isUpperCase(diag)) {
          as.push({row:row+1,col:col-1});
        }
      }
      if ((row < 7) && (col < 7)) { 
        var diag = board[row+1][col+1];
        if ((diag !== '1') && !isUpperCase(diag)) {
          as.push({row:row+1,col:col+1});
        }
      }
      if ((row === 4) && (enpassantsquare !== '-')) { 
        if (enpassantsquare.availableFor == 'white') {
          as.push({row:enpassantsquare.row,col:enpassantsquare.col});
        }
      }
      break;
    case 'n': 
      if ((row-1) >= 0) {
        if ((col-2) >= 0)
          as.push({row:row-1,col:col-2});
        if ((col+2) <=7)
          as.push({row:row-1,col:col+2});                     
      }
      if ((row+1) <= 7) {
        if ((col-2) >= 0)
          as.push({row:row+1,col:col-2});
        if ((col+2) <=7)
          as.push({row:row+1,col:col+2});                     
      }
      if ((row-2) >= 0) {
        if ((col-1) >= 0)
          as.push({row:row-2,col:col-1});
        if ((col+1) <=7)
          as.push({row:row-2,col:col+1});                     
      }
      if ((row+2) <= 7) {
        if ((col-1) >= 0)
          as.push({row:row+2,col:col-1});
        if ((col+1) <=7)
          as.push({row:row+2,col:col+1});                     
      }
      break;
    case 'N': 
      if ((row-1) >= 0) {
        if ((col-2) >= 0)
          as.push({row:row-1,col:col-2});
        if ((col+2) <=7)
          as.push({row:row-1,col:col+2});                     
      }
      if ((row+1) <= 7) {
        if ((col-2) >= 0)
          as.push({row:row+1,col:col-2});
        if ((col+2) <=7)
          as.push({row:row+1,col:col+2});                     
      }
      if ((row-2) >= 0) {
        if ((col-1) >= 0)
          as.push({row:row-2,col:col-1});
        if ((col+1) <=7)
          as.push({row:row-2,col:col+1});                     
      }
      if ((row+2) <= 7) {
        if ((col-1) >= 0)
          as.push({row:row+2,col:col-1});
        if ((col+1) <=7)
          as.push({row:row+2,col:col+1});                     
      }
      break;
    case 'r':
      for (var i = row-1; i >= 0; i--) {
        if (board[i][col] === '1') {
          as.push({row:i,col:col});
        } else if (isUpperCase(board[i][col])) { 
          as.push({row:i,col:col});
            break;
        } else {
          break;
        }
      } 
      for (var i = row+1; i <= 7; i++) {
        if (board[i][col] === '1') {
          as.push({row:i,col:col});
        } else if (isUpperCase(board[i][col])) { 
          as.push({row:i,col:col});
          break;
        } else {
          break;
        }
      } 
      for (var j = col-1; j >= 0; j--) {
        if (board[row][j] === '1') {
          as.push({row:row,col:j});
        } else if (isUpperCase(board[row][j])) { 
          as.push({row:row,col:j});
          break;
        } else {
          break;
        }
      } 
      for (var j = col+1; j <= 7; j++) {
        if (board[row][j] === '1') {
          as.push({row:row,col:j});
        } else if (isUpperCase(board[row][j])) { 
          as.push({row:row,col:j});
          break;
        } else {
          break;
        }
      }
      break; 
    case 'R':   
      for (var i = row-1; i >= 0; i--) {
        if (board[i][col] === '1') {
          as.push({row:i,col:col});
        } else if (!isUpperCase(board[i][col])) { 
          as.push({row:i,col:col});
            break;
        } else {
          break;
        }
      } 
      for (var i = row+1; i <= 7; i++) {
        if (board[i][col] === '1') {
          as.push({row:i,col:col});
        } else if (!isUpperCase(board[i][col])) { 
          as.push({row:i,col:col});
          break;
        } else {
          break;
        }
      } 
      for (var j = col-1; j >= 0; j--) {
        if (board[row][j] === '1') {
          as.push({row:row,col:j});
        } else if (!isUpperCase(board[row][j])) { 
          as.push({row:row,col:j});
          break;
        } else {
          break;
        }
      } 
      for (var j = col+1; j <= 7; j++) {
        if (board[row][j] === '1') {
          as.push({row:row,col:j});
        } else if (!isUpperCase(board[row][j])) { 
          as.push({row:row,col:j});
          break;
        } else {
          break;
        }
      }
      break; 
    case 'b':
      // up and left
      var index = 0;
      for (var i = row-1; i >= 0; i--) {
        index++; 
        var j = col - index;
        if (j < 0) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // up and right
      var index = 0;
      for (var i = row-1; i >= 0; i--) {
        index++; 
        var j = col + index;
        if (j > 7) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // down and left
      var index = 0;
      for (var i = row+1; i <= 7; i++) {
        index++; 
        var j = col - index;
        if (j < 0) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // down and right
      var index = 0;
      for (var i = row+1; i <= 7; i++) {
        index++; 
        var j = col + index;
        if (j > 7) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      break; 
    case 'B':    
      // up and left
      var index = 0;
      for (var i = row-1; i >= 0; i--) {
        index++; 
        var j = col - index;
        if (j < 0) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (!isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // up and right
      var index = 0;
      for (var i = row-1; i >= 0; i--) {
        index++; 
        var j = col + index;
        if (j > 7) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (!isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // down and left
      var index = 0;
      for (var i = row+1; i <= 7; i++) {
        index++; 
        var j = col - index;
        if (j < 0) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (!isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // down and right
      var index = 0;
      for (var i = row+1; i <= 7; i++) {
        index++; 
        var j = col + index;
        if (j > 7) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (!isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      break;
    case 'q': 
      for (var i = row-1; i >= 0; i--) {
        if (board[i][col] === '1') {
          as.push({row:i,col:col});
        } else if (isUpperCase(board[i][col])) { 
          as.push({row:i,col:col});
          break;
        } else {
          break;
        }
      } 
      for (var i = row+1; i <= 7; i++) {
        if (board[i][col] === '1') {
          as.push({row:i,col:col});
        } else if (isUpperCase(board[i][col])) { 
          as.push({row:i,col:col});
          break;
        } else {
          break;
        }
      } 
      for (var j = col-1; j >= 0; j--) {
        if (board[row][j] === '1') {
          as.push({row:row,col:j});
        } else if (isUpperCase(board[row][j])) { 
          as.push({row:row,col:j});
          break;
        } else {
          break;
        }
      } 
      for (var j = col+1; j <= 7; j++) {
        if (board[row][j] === '1') {
          as.push({row:row,col:j});
        } else if (isUpperCase(board[row][j])) { 
          as.push({row:row,col:j});
          break;
        } else {
          break;
        }
      }
      // up and left
      var index = 0;
      for (var i = row-1; i >= 0; i--) {
        index++; 
        var j = col - index;
        if (j < 0) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // up and right
      var index = 0;
      for (var i = row-1; i >= 0; i--) {
        index++; 
        var j = col + index;
        if (j > 7) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // down and left
      var index = 0;
      for (var i = row+1; i <= 7; i++) {
        index++; 
        var j = col - index;
        if (j < 0) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // down and right
      var index = 0;
      for (var i = row+1; i <= 7; i++) {
        index++; 
        var j = col + index;
        if (j > 7) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      break;
      case 'Q':
      for (var i = row-1; i >= 0; i--) {
        if (board[i][col] === '1') {
          as.push({row:i,col:col});
        } else if (!isUpperCase(board[i][col])) { 
          as.push({row:i,col:col});
          break;
        } else {
          break;
        }
      } 
      for (var i = row+1; i <= 7; i++) {
        if (board[i][col] === '1') {
          as.push({row:i,col:col});
        } else if (!isUpperCase(board[i][col])) { 
          as.push({row:i,col:col});
          break;
        } else {
          break;
        }
      } 
      for (var j = col-1; j >= 0; j--) {
        if (board[row][j] === '1') {
          as.push({row:row,col:j});
        } else if (!isUpperCase(board[row][j])) { 
          as.push({row:row,col:j});
          break;
        } else {
          break;
        }
      } 
      for (var j = col+1; j <= 7; j++) {
        if (board[row][j] === '1') {
          as.push({row:row,col:j});
        } else if (!isUpperCase(board[row][j])) { 
          as.push({row:row,col:j});
          break;
        } else {
          break;
        }
      }
      // up and left
      var index = 0;
      for (var i = row-1; i >= 0; i--) {
        index++; 
        var j = col - index;
        if (j < 0) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (!isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // up and right
      var index = 0;
      for (var i = row-1; i >= 0; i--) {
        index++; 
        var j = col + index;
        if (j > 7) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (!isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // down and left
      var index = 0;
      for (var i = row+1; i <= 7; i++) {
        index++; 
        var j = col - index;
        if (j < 0) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (!isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      // down and right
      var index = 0;
      for (var i = row+1; i <= 7; i++) {
        index++; 
        var j = col + index;
        if (j > 7) 
          break;
        if (board[i][j] === '1') {
          as.push({row:i,col:j});
        } else if (!isUpperCase(board[i][j])) { 
          as.push({row:i,col:j});
          break;
        } else {
          break;
        }
      };
      break;
    case 'k':
      if (row !== 0) {
        // bot 
        if ((board[row-1][col] === '1') || (isUpperCase(board[row-1][col]))) {
          as.push({row:row-1,col:col});
        } 
        // bot left
        if ((board[row-1][col-1] === '1') || (isUpperCase(board[row-1][col-1]))) {
          as.push({row:row-1,col:col-1});
        } 
        // bot right
        if ((board[row-1][col+1] === '1') || (isUpperCase(board[row-1][col+1]))) {
          as.push({row:row-1,col:col+1});
        }
      }   
      if (row !== 7) {  
        // top 
        if ((board[row+1][col] === '1') || (isUpperCase(board[row+1][col]))) {
          as.push({row:row+1,col:col});
        } 
        // top left
        if ((board[row+1][col-1] === '1') || (isUpperCase(board[row+1][col-1]))) {
          as.push({row:row+1,col:col-1});
        } 
        // top right
        if ((board[row+1][col+1] === '1') || (isUpperCase(board[row+1][col+1]))) {
          as.push({row:row+1,col:col+1});
        } 
      }
      if (col !== 0) {
        // left
        if ((board[row][col-1] === '1') || (isUpperCase(board[row][col-1]))) {
          as.push({row:row,col:col-1});
        } 
      }
      if (col !== 7) {
        // right
        if ((board[row][col+1] === '1') || (isUpperCase(board[row][col+1]))) {
          as.push({row:row,col:col+1});
        }
      } 
      if (row === 7) { 
        if ((board[row][4] == 'k') && (board[row][5] === '1') && (board[row][6] === '1') && (board[row][7] == 'r')) {
          //kingside castle
          if (blackKingsideCastleAvailable == true)
            as.push({row:row,col:6});
        }   
        if ((board[row][4] == 'k') && (board[row][3] === '1') && (board[row][2] === '1') && (board[row][1] == '1') && (board[row][0] == 'r')) {
          //queenside castle
          if (blackQueensideCastleAvailable == true)
            as.push({row:row,col:2});
        }   
      }
      break;
    case 'K':
      if (row !== 0) {
        // bot 
        if ((board[row-1][col] === '1') || (isUpperCase(board[row-1][col]))) {
          as.push({row:row-1,col:col});
        } 
        // bot left
        if ((board[row-1][col-1] === '1') || (isUpperCase(board[row-1][col-1]))) {
          as.push({row:row-1,col:col-1});
        } 
        // bot right
        if ((board[row-1][col+1] === '1') || (isUpperCase(board[row-1][col+1]))) {
          as.push({row:row-1,col:col+1});
        }
      }   
      if (row !== 7) {  
        // top 
        if ((board[row+1][col] === '1') || (isUpperCase(board[row+1][col]))) {
          as.push({row:row+1,col:col});
        } 
        // top left
        if ((board[row+1][col-1] === '1') || (isUpperCase(board[row+1][col-1]))) {
          as.push({row:row+1,col:col-1});
        } 
        // top right
        if ((board[row+1][col+1] === '1') || (isUpperCase(board[row+1][col+1]))) {
          as.push({row:row+1,col:col+1});
        } 
      }
      if (col !== 0) {
        // left
        if ((board[row][col-1] === '1') || (isUpperCase(board[row][col-1]))) {
          as.push({row:row,col:col-1});
        } 
      }
      if (col !== 7) {
        // right
        if ((board[row][col+1] === '1') || (isUpperCase(board[row][col+1]))) {
          as.push({row:row,col:col+1});
        }
      } 
      if (row === 0) { 
        if ((board[row][4] == 'K') && (board[row][5] === '1') && (board[row][6] === '1') && (board[row][7] == 'R')) {
          //kingside castle
          if (whiteKingsideCastleAvailable == true)
            as.push({row:row,col:6});
        }   
        if ((board[row][4] == 'K') && (board[row][3] === '1') && (board[row][2] === '1') && (board[row][1] == '1') && (board[row][0] == 'R')) {
          //queenside castle
          if (whiteQueensideCastleAvailable == true)
            as.push({row:row,col:2});
        }   
      }
      break;
    default :   
      break;
  }
  return as;
};
module.exports = exports = fastGetAvailableSquares;