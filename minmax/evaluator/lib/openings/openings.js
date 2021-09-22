var openings = {};
//1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e6
// sicilian
openings.sicilian = ['e2e4','c7c5','g1f3','d7d6','d2d4', 'c5d4','f3d4','g8f6','b1c3','e7e6'];

//1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.Nf3 d6 5.g3 O-O
// kings indian defense
openings.kid = [
'd2d4','g8f6',
'c2c4','g7g6',
'b1c3','f8g7',
'g1f3','d7d6',
'g2g3','e8g8'
];

//1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7
// queens gambit
openings.queensgambit = [
'd2d4','d7d5',
'c2c4','e7e6',
'b1c3','g8f6',
'c1g5','f8e7'
];

// full development
// 1. e2e4 e7e5
// 2. f1c4 f8c5
// 3. g1f3 g8f6
// 4. e2g2 e8g8
// 5. d2d3 d7d6
// 6. c1g5 c8g4
openings.fulldev = [
'e2e4','e7e5',
'f1c4','f8c5',
'g1f3', 'g8f6',
'e1g1','e8g8',
'd2d3','d7d6',
'c1g5','c8g4',
'f1e1','f8e8',
'd1d2','d8d7',
'b1c3','b8c6',
'a1d1','a8d8'
];

// special case type developement

// case 1 
// where bishop pawn is opened but a second bishop pawn
// for the same bishop is moved, before the bishop pawn is moved

// case 2 
// where bishop pawn is opened, and also the bishop move 
// then the other bishop pawn is moved.

// both cases are already covered since i don't add but
// instead do a single = 1 if that bishop pawn is moved
// i.e. queen's bishop pawn or king's bishop pawn.
// there are no concept of "two" queen's bishop pawn
// for the purpose of development.

// case 1
// 1. g2g3 g7g6
// 2. e2e4 e7e5
openings.specialbishop = [
'g2g3','g7g6',
'e2e4','e7e5'
];
module.exports = exports = openings;
