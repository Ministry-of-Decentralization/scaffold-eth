require('dotenv').config()
import { utils } from 'ethers';
import { getAllWallBricks } from "./queries/getWallBricks"
import { generateWallImage } from './utils/imageGenerator';

const DEFAULT_RGB = '0xffffff'
const DEFAULT_OWNER = '0x0000000000000000000000000000000000000000'
const DEFAULT_PRICE = utils.parseUnits('0.1')
const WALLS = [
  'north',
  'south',
  'east',
  'west',
  'floor',
  'ceiling'
]

const generateDefaultBrick = (x: number, y: number) => {
  return {
    x,
    y,
    owner: DEFAULT_OWNER,
    rgb: DEFAULT_RGB,
    price: DEFAULT_PRICE
  }
}

const getColorsFromBricks = (bricks: any, rowLength: number) => {
  return bricks.map((brick: any,i: number) => {
    const x = i % rowLength
    const y = Math.floor(i / rowLength)
    return {
      color: brick.rgb,
      coords: [x,y]
    }
  })
}

const formatWallBricks = (bricks: any, rowLength: number, rowCount: number) => {
  return Array(rowLength * rowCount).fill(0).map((_,i) => {
    const x = i % rowLength
    const y = Math.floor(i / rowLength)
    const brick = bricks.find((brick: any) => brick.x === x && brick.y ===y)
    return brick || generateDefaultBrick(x, y)
  })
}

const fetchWallBricks = async (wallId: string) => {
  console.log(`fetching wall ${wallId}`)
  const response = await getAllWallBricks(wallId)
  console.log(`got all bricks for ${wallId} wall ${response.bricks.length}`)
  if (response.error) {
    console.log(`Error fetching ${wallId} wall bricks : ${response.error}`)
    return 
  }
  const bricks = formatWallBricks(response.bricks, 150, 150)
  const wallColors = getColorsFromBricks(bricks, 150)

  generateWallImage(wallId, wallColors)
}

const fetchAllWalls = () => {
  console.log(`fetching all walls`)
  WALLS.forEach(fetchWallBricks)
}

console.log(`fetch interval ${process.env.FETCH_INTERVAL}`)

const interval = parseInt(process.env.FETCH_INTERVAL || '60000', 10)
setInterval(fetchAllWalls, interval)
