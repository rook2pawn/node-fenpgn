var fen = require('../index');
var t = require('tape');

t('test analyze2', function(test) {
    test.plan(2);
    var analyze = fen.analyze;
    const result = analyze("8/8/8/8/8/r7/n1b5/1B6", "black");
    test.equals(result, "c2b1")
    const result2 = analyze("8/8/8/8/8/r7/n1b5/1B6", "white");
    test.equals(result2, "b1c2")
});
