import React, { useRef, useEffect, useState} from 'react'
import { RgbColorPicker } from "react-colorful";
import { Checkbox } from 'antd'

import './App.css';
import WallPicker from './WallPicker';
import FunctionButton from './FunctionButton';
const { utils, BigNumber } = require("ethers");

const STEP_SIZE = 7
const STEPS = 150

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return [
    evt.clientX - rect.left,
    evt.clientY - rect.top
  ];
}

const getRgb = (color) => {
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
export const drawSquare = (context, stepSize, coords, color) => {
  context.beginPath();
  const {r, g,b} = getRgb(color)
  context.fillStyle = `rgba(${r}, ${g}, ${b})`
  context.fillRect(coords[0] * stepSize, coords[1] * stepSize, stepSize, stepSize);

  context.stroke();
}

export const drawGrid = (context, steps, stepLength, color = "red") => {
  context.beginPath()
  for ( let i = 0; i < steps - 1; i++) {
    context.moveTo((i+1) * stepLength, 0)
    context.lineTo((i+1) * stepLength, steps * stepLength)

    context.moveTo(0, (i+1) * stepLength)
    context.lineTo(steps * stepLength, (i+1) * stepLength)
  }
  context.strokeStyle = color;
  context.stroke();

  context.beginPath()
  for ( let i = 10; i < steps; i = (i/10 + 1) * 10) {
    context.moveTo((i+1) * stepLength, 0)
    context.lineTo((i+1) * stepLength, steps * stepLength)

    context.moveTo(0, (i+1) * stepLength)
    context.lineTo(steps * stepLength, (i+1) * stepLength)
  }
  context.strokeStyle = "blue";
  context.stroke();

}
const Canvas = ({squares, squaresHash, steps, stepSize, setCoords, setCanvasUrl, showGrid }) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null)

  function mouseToWallCoords(coords) {
    return [Math.floor(coords[0] / stepSize), Math.floor(coords[1] / stepSize)]
  }
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0,0, canvas.width, canvas.height)
    if (showGrid) drawGrid(context, steps, stepSize)

    squares.forEach((square) => drawSquare(context, stepSize, square.coords, square.color))
  }, [squaresHash, showGrid])

  const handleUpdate = (ev) => {

    const canvas = canvasRef.current
    setCoords(
      mouseToWallCoords(
        getMousePos(canvas, ev)
      )
    )
    setCanvasUrl(canvas.toDataURL())

  }

  const handleMouseOver = (ev) => {
    if (isDrawing) {
      handleUpdate(ev)
    }
  }

  const handleClick = (ev) => {

    handleUpdate(ev)

  }


  return (
    <canvas
      height={`${STEP_SIZE * STEPS}px`}
      width={`${STEP_SIZE * STEPS}px`}
      onMouseMoveCapture={handleMouseOver}
      onMouseDownCapture={() => setIsDrawing(true)}
      onMouseUpCapture={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
      onClick={handleClick}
      ref={canvasRef}
    />
  )
}

export const defaultSquares = {
  north: {},
  south: {},
  east: {},
  west: {},
  floor: {},
  ceiling: {}
}

const walls = ['north', 'south', 'east', 'west', 'floor', 'ceiling']

const formUpdateBricksArgs = (_wall, _wallSquares, _price) => {
  const wall = []
  const x = []
  const y = []
  const rgb = []
  const price = []

  Object.values(_wallSquares).forEach((square) => {
    const coords = square.coords
    const colors = square.color
    const hexColor = `0x${colors.r.toString(16)}${colors.g.toString(16)}${colors.b.toString(16)}`
    wall.push(walls.indexOf(_wall))
    x.push(coords[0])
    y.push(coords[1])
    rgb.push(hexColor)
    price.push(utils.parseUnits(_price).toString())
  })

  return [wall, x, y, rgb, price]
}

function App({ provider, writeContracts}) {
  const [color, setColor] = useState({"r":176,"g":84,"b":84})
  const [canvasUrl, setCanvasUrl] = useState(null)
  const [squares, setSquares] =  useState(defaultSquares)
  const [wall, setWall] = useState('north')
  const [showGrid, setShowGrid] = useState(true)


  const wallSquares = squares[wall]
  const squareValues = Object.values(wallSquares)
  const selectedCount = squareValues.length
  const squaresHash = utils.id(JSON.stringify(wallSquares))

  const clickSquare = (color) => (coords) => {
    const coordsKey = `${coords[0]}_${coords[1]}`
    const updatedWall = {...wallSquares, [coordsKey]: {color, coords} }
    setSquares({...squares, [wall]: updatedWall})
  }
  const validUpdateBricksArgs = squareValues.length > 0
  const updateBrickArgs = validUpdateBricksArgs ?
    formUpdateBricksArgs(wall, wallSquares, '0.1') : []
  const updateBricksTxValue = validUpdateBricksArgs ?
    updateBrickArgs[4].reduce((acc, p) => acc.add(p), BigNumber.from(0)).toString() : '0'

  const updateBricks = writeContracts && writeContracts.PixelBoard ? writeContracts.PixelBoard.updateBricks : null
  console.log('args: ', updateBrickArgs, 'txValue: ', updateBricksTxValue)
  return (
    <div className="App"  style={{display: "flex", margin: '1em'}}>
      <div>
        <div>
          <WallPicker walls={Object.keys(defaultSquares)} activeWall={wall} onWallSelect={setWall} />
        </div>
        <div style={{border: `${STEP_SIZE}px solid gray`, height: `${STEP_SIZE * STEPS + STEP_SIZE * 2}px`, width: `${STEP_SIZE * STEPS + STEP_SIZE * 2}px`, margin: '1em'}}>
          <Canvas squaresHash={squaresHash} showGrid={showGrid} setCoords={clickSquare(color)} squares={squareValues} setCanvasUrl={setCanvasUrl} steps={STEPS} stepSize={STEP_SIZE} />
        </div>
      </div>

      <div>
        <h3>
          Update the Alley
        </h3>
        <div style={{display: 'flex'}}>
          <div>
            <Checkbox checked={showGrid} onChange={() => setShowGrid(!showGrid)}>Show Grid</Checkbox>
            <RgbColorPicker color={color} onChange={setColor} />
            <FunctionButton
              contractFunction={updateBricks}
              provider={provider}
              args={updateBrickArgs}
              txValue={updateBricksTxValue}
              onSuccess={() => {}}
              isDisabled={!validUpdateBricksArgs} />
            <div>
              Selections - {squareValues.length}
              {
                squareValues
                  .slice(0)
                  .reverse()
                  .map( (s, i) => {
                    const color = `rgb(${s.color.r}, ${s.color.g}, ${s.color.b})`
                    console.log(color)
                    return (
                      <div style={{backgroundColor: color}}>
                        {selectedCount - i + 1}. X: {s.coords[0]} Y: {s.coords[1]}
                      </div>
                    )
                  }
                )
              }
            </div>

          </div>
 
          <div>
            <a href={canvasUrl} download={`griddysmile${STEPS/10}.png`}>Dl</a>
            <br />
            <img style={{height: '300px', width: '300px'}} src={canvasUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
