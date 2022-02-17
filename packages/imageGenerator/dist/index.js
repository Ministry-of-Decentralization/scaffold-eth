"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var ethers_1 = require("ethers");
var getWallBricks_1 = require("./queries/getWallBricks");
var imageGenerator_1 = require("./utils/imageGenerator");
var DEFAULT_RGB = '0xffffff';
var DEFAULT_OWNER = '0x0000000000000000000000000000000000000000';
var DEFAULT_PRICE = ethers_1.utils.parseUnits('0.1');
var WALLS = [
    'north',
    'south',
    'east',
    'west',
    'floor',
    'ceiling'
];
var generateDefaultBrick = function (x, y) {
    return {
        x: x,
        y: y,
        owner: DEFAULT_OWNER,
        rgb: DEFAULT_RGB,
        price: DEFAULT_PRICE
    };
};
var getColorsFromBricks = function (bricks, rowLength) {
    return bricks.map(function (brick, i) {
        var x = i % rowLength;
        var y = Math.floor(i / rowLength);
        return {
            color: brick.rgb,
            coords: [x, y]
        };
    });
};
var formatWallBricks = function (bricks, rowLength, rowCount) {
    return Array(rowLength * rowCount).fill(0).map(function (_, i) {
        var x = i % rowLength;
        var y = Math.floor(i / rowLength);
        var brick = bricks.find(function (brick) { return brick.x === x && brick.y === y; });
        return brick || generateDefaultBrick(x, y);
    });
};
var fetchWallBricks = function (wallId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, bricks, wallColors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("fetching wall ".concat(wallId));
                return [4 /*yield*/, (0, getWallBricks_1.getAllWallBricks)(wallId)];
            case 1:
                response = _a.sent();
                console.log("got all bricks for ".concat(wallId, " wall ").concat(response.bricks.length));
                if (response.error) {
                    console.log("Error fetching ".concat(wallId, " wall bricks : ").concat(response.error));
                    return [2 /*return*/];
                }
                bricks = formatWallBricks(response.bricks, 150, 150);
                wallColors = getColorsFromBricks(bricks, 150);
                (0, imageGenerator_1.generateWallImage)(wallId, wallColors);
                return [2 /*return*/];
        }
    });
}); };
var fetchAllWalls = function () {
    console.log("fetching all walls");
    WALLS.forEach(fetchWallBricks);
};
console.log("fetch interval ".concat(process.env.FETCH_INTERVAL));
var interval = parseInt(process.env.FETCH_INTERVAL || '60000', 10);
setInterval(fetchAllWalls, interval);
