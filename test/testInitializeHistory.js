var fen = require("../index");
var t = require("tape");
const uuid = require("uuid");

t(
  "testInitializeHistory - after first move active player is black",
  function (test) {
    test.plan(1);
    const historyMSAN = "e2e4";
    var game = new fen({ historyMSAN });
    test.equals("b", game.getHistory().pop().activeplayer);
  }
);

t(
  "testInitializeHistory - after first move active player is black",
  function (test) {
    test.plan(1);
    const id = uuid.v4();
    var game = new fen({ id });
    test.equals(id, game.getBoardId());
  }
);
