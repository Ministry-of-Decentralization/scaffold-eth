import React, { useEffect, useState, useRef } from 'react'
import WallPicker from './PixelPicker/WallPicker'
import { drawSquare, drawGrid } from './PixelPicker/'
import { defaultSquares } from './PixelPicker'
import { useGetWallBricks } from './queries/pixelBoardSubgraph'

const transformWallColors = (wallColors, rowLength) => {
  return wallColors.map((wallColor, i) => {
    const x = i % rowLength
    const y = Math.floor(i/rowLength)
    const color = {
      r: parseInt(wallColor.slice(2,4), 16),
      g: parseInt(wallColor.slice(4,6), 16),
      b: parseInt(wallColor.slice(6,8), 16)
    }
    return {
      coords: [x, y],
      color
    }
  })
}

const WallViewer = ({readContracts}) => {
  const [wall, setWall] = useState('ceiling')
  const [wallColors, setWallColors] = useState(null)
  const [loadingWall, setLoadingWall] = useState(false)
  const canvasRef = useRef(null)
  const wallBricks = useGetWallBricks(wall, 150)

  const walls = Object.keys(defaultSquares)

  const updateSelectedWall = (wall) => {
    setWall(wall)
    setWallColors(null)
  }

  /** 
  useEffect(() => {
    const fetchWallRows = async (wall) => {
      setLoadingWall(true)

      const rowCount = 150
      const rows = Array.apply(null, Array(rowCount)).map(async (_, i) => readContracts.PixelBoard.getWallRow(wall, i))
      // const wallColors = await Promise.all(rows)
      const wallColors = (await Promise.all(rows)).map((r) => r.colors).reduce((acc, row) => acc.concat(row), []).reduce((acc, row) => acc.concat(row), [])
      console.log('{{{{{{{{got row colors', JSON.stringify(wallColors))
      setLoadingWall(false)
      setWallColors(transformWallColors(wallColors, 150))

    }
    fetchWallRows(walls.indexOf(wall))
  }, [wall])

 */
  useEffect(() => {
    if (wallBricks.wallColors) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      context.clearRect(0,0, canvas.width, canvas.height)
      drawGrid(context, 150, 7)
      console.log(`!!!!!!!!!!!!!!!!!!!!${wallBricks.wallColors.length} ----`)
      wallBricks.wallColors.forEach((square) => drawSquare(context, 7, square.coords, square.color))
    }
  }, [wallBricks.wallColors])


  return (
    <div>
      <WallPicker walls={walls} activeWall={wall} onWallSelect={updateSelectedWall} />
      <div>
        {wallBricks.loading ? 
          'Loading'
          :
          null}
          <div style={{border: 'black 2px solid'}}>
          <canvas
            height={`950px`}
            width={`950px`}
            ref={canvasRef}
          />
          </div>
      </div>
    </div>
  )
}

export default WallViewer