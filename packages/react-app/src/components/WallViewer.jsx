import React, { useEffect, useState } from 'react'
import WallPicker from './PixelPicker/WallPicker'
import {defaultSquares} from './PixelPicker'

const WallViewer = ({readContracts}) => {
  const [wall, setWall] = useState('north')
  const [wallColors, setWallColors] = useState(null)
  const [loadingWall, setLoadingWall] = useState(false)
  const walls = Object.keys(defaultSquares)

  useEffect(() => {
    const fetchWallColors = async (wall) => {
      setLoadingWall(true)
      const colors = await readContracts.PixelBoard.getWallColors([wall])
      setLoadingWall(false)
      setWallColors(colors)
    }
    fetchWallColors(walls.indexOf(wall))
  }, [wall])

  return (
    <div>
      <WallPicker walls={walls} activeWall={wall} onWallSelect={setWall} />
      <div>
        {loadingWall ? 'Loading' : wallColors}
      </div>
    </div>
  )
}

export default WallViewer