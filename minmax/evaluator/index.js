var pawnstructure = require("./lib/pawnstructure.js");
var development = require("./lib/development.js");
var material = require("./lib/material.js");
var kingsafety = require("./lib/kingsafety.js");
var mobility = require("./lib/mobility.js");

exports.pawnstructure = pawnstructure.analyze;
exports.development = development.development;
exports.material = material;
exports.kingsafety = kingsafety.kingsafety;
exports.mobility = mobility.mobility;

exports.evaluateBoard = material;
