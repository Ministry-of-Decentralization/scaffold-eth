"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWallImage = exports.drawSquare = void 0;
var fs = require('fs');
var createCanvas = require('canvas').createCanvas;
var getCanvasContext = function (height, width) {
    var canvas = createCanvas(width, height);
    var context = canvas.getContext('2d');
    return {
        canvas: canvas,
        context: context
    };
};
var getRgb = function (color) {
    if (typeof color === 'string') {
        return {
            r: parseInt(color.slice(2, 4), 16),
            g: parseInt(color.slice(4, 6), 16),
            b: parseInt(color.slice(6), 16)
        };
    }
    else {
        return color;
    }
};
var drawSquare = function (context, stepSize, coords, color) {
    context.beginPath();
    var _a = getRgb(color), r = _a.r, g = _a.g, b = _a.b;
    context.fillStyle = "rgba(".concat(r, ",").concat(g, ",").concat(b, ",1)");
    context.fillRect(coords[0] * stepSize, coords[1] * stepSize, stepSize, stepSize);
    context.stroke();
};
exports.drawSquare = drawSquare;
var generateWallImage = function (wallId, bricks) {
    console.log("generating image for ".concat(wallId, " wall"));
    var _a = getCanvasContext(1000, 1000), canvas = _a.canvas, context = _a.context;
    bricks.forEach(function (brick) { return (0, exports.drawSquare)(context, 7, brick.coords, brick.color); });
    var buffer = canvas.toBuffer('image/png');
    fs.writeFileSync("./images/".concat(wallId, ".png"), buffer);
    console.log("image for ".concat(wallId, " wall generated"));
};
exports.generateWallImage = generateWallImage;
