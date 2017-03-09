var fen = require('../index');
var h = require('../lib/help');
var t = require('tape');
t('testfullmovenum', function(test) {
  test.plan(10);
  var game = new fen();
  test.equals(game.last().fullmovenum,1);
  test.equals(game.getActivePlayer(),'white');
  game.mm('e2e4');
  test.equals(game.last().fullmovenum,1);  
  test.equals(game.getActivePlayer(),'black');
  game.mm('e7e5');
  test.equals(game.last().fullmovenum,2);
  test.equals(game.getActivePlayer(),'white');  
  game.mm('g1f3');
  test.equals(game.last().fullmovenum,2);
  test.equals(game.getActivePlayer(),'black');  
  game.mm('d6d5');
  test.equals(game.last().fullmovenum,3);
  test.equals(game.getActivePlayer(),'white');  

});