"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.getAllWallBricks = exports.getWallBricks = exports.GET_WALL_BRICKS = void 0;
var client_1 = require("@apollo/client");
var client_2 = require("../client");
var QUERY_LIMIT = 1000;
exports.GET_WALL_BRICKS = (0, client_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query bricks($wallId: ID!, $lastBrickId: ID!, $queryLimit: Int!) {\n    bricks(first: $queryLimit, where:{id_gt: $lastBrickId, wall: $wallId}) {\n      id\n      owner\n      x\n      y\n      rgb\n      price\n      lastUpdated\n    }\n  }\n"], ["\n  query bricks($wallId: ID!, $lastBrickId: ID!, $queryLimit: Int!) {\n    bricks(first: $queryLimit, where:{id_gt: $lastBrickId, wall: $wallId}) {\n      id\n      owner\n      x\n      y\n      rgb\n      price\n      lastUpdated\n    }\n  }\n"])));
var getWallBricks = function (wallId, lastBrickId) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client_2.subgraphClient.query({
                    query: exports.GET_WALL_BRICKS,
                    variables: { wallId: wallId, lastBrickId: lastBrickId, queryLimit: QUERY_LIMIT },
                    fetchPolicy: "network-only"
                })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
exports.getWallBricks = getWallBricks;
var getAllWallBricks = function (wallId) { return __awaiter(void 0, void 0, void 0, function () {
    var bricks, lastBrickId, remainingBricks, error, response, responseLength;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bricks = [];
                lastBrickId = '';
                remainingBricks = true;
                error = null;
                _a.label = 1;
            case 1:
                if (!remainingBricks) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.getWallBricks)(wallId, lastBrickId)];
            case 2:
                response = _a.sent();
                if (response.error) {
                    remainingBricks = false;
                    error = response.error;
                }
                responseLength = response.data.bricks.length;
                bricks = bricks.concat(response.data.bricks);
                if (responseLength < QUERY_LIMIT) {
                    remainingBricks = false;
                }
                else {
                    lastBrickId = response.data.bricks[responseLength - 1].id;
                }
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, {
                    bricks: bricks,
                    error: error
                }];
        }
    });
}); };
exports.getAllWallBricks = getAllWallBricks;
var templateObject_1;
