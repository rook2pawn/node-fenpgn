var fen = require('../index');
var t = require('tape');

t('test analyze', function(test) {
    test.plan(1);
    var analyze = fen.analyze;
    let result = analyze("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    console.log("result:", result)
    test.pass();
});
