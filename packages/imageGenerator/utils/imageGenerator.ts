const fs = require('fs')
const { createCanvas } = require('canvas')

const getCanvasContext = (height: number, width: number) => {
  const canvas = createCanvas(width, height)
  return canvas.getContext('2d')
}

const getRgb = (color: any) => {
  if (typeof color === 'string') {
    return {
      r: parseInt(color.slice(2,4), 16),
      g: parseInt(color.slice(4,6), 16),
      b: parseInt(color.slice(6), 16)
    }
  } else {
    return color
  }
}
export const drawSquare = (context: any, stepSize: number, coords: any, color: any) => {
  context.beginPath();
  const {r, g,b} = getRgb(color)
  context.fillStyle = `rgba(${r}, ${g}, ${b})`
  context.fillRect(coords[0] * stepSize, coords[1] * stepSize, stepSize, stepSize);

  context.stroke();
}

export const generateWallImage = (wallId: string, bricks: any) => {
  const context = getCanvasContext(600, 600)
  bricks.forEach((brick: any) => drawSquare(context, 7, brick.coords, brick.color))

  const buffer = context.toBuffer('image/png')
  fs.writeFileSync(`../images/${wallId}.png`, buffer)
}
