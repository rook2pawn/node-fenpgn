# node-fenpgn

## Usage

```js
const fen = require("./index2.js");
const gameId = fen.createGame(); // this gameId can be used for persistance on later calls
fen.move("e2e4");
let board = fen.board();
```

## Test

npm test

## LICENSE

MIT
