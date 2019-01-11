var fen = require('../index');
var t = require('tape');

t('test analyze', function(test) {
    test.plan(1);
    var analyze = fen.analyze;
    let result = analyze("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    test.pass();
});

t.only('test analyze2', function(test) {
    test.plan(1);
    var analyze = fen.analyze;
    let result = analyze("8/8/8/8/r7/n1b5/1B6/8");
    console.log("result:", result)
    test.pass();
});
