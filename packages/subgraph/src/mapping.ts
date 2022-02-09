import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  BrickUpdated,
  PixelBoardInit,
} from "../generated/PixelBoard/PixelBoard";
import { Brick, Wall } from "../generated/schema";

let wallPositions = [
  'north',
  'south',
  'east',
  'west',
  'floor',
  'ceiling'
]

let brickRowCount = 150;

function getOrCreateWall(id: string): Wall {
  let wall = Wall.load(id)
  if (wall == null) {
    wall = new Wall(id);
    wall.rowCount = brickRowCount;
    wall.save()
  }

  return wall
}

function getOrCreateBrick(_wall: i32, _x:i32, _y: i32 ): Brick {
  let wallId = wallPositions[_wall]
  let wall = getOrCreateWall(wallId)
  let id = wall.id.toString() + '_' + BigInt.fromI32(_x).toString() + '_' + BigInt.fromI32(_y).toString()
  let brick = Brick.load(id)

  if (brick == null) {
    brick = new Brick(id)
    brick.wall = wallId
    brick.x = _x
    brick.y = _y
    brick.rgb = '0x000000'
    brick.owner = Address.fromString('0x0')
    brick.price = BigInt.fromI32(0)
    brick.lastUpdated = BigInt.fromI32(0)
    brick.save()
  }

  return brick
}

export function handleBrickUpdated(event: BrickUpdated): void {
  let brick = getOrCreateBrick(event.params.wall, event.params.x, event.params.y);

  brick.owner = event.transaction.from
  brick.rgb = event.params.rgb.toString()
  brick.price = event.params.price
  brick.lastUpdated = event.block.timestamp

  brick.save()
}

export function handlePixelBoardInit(event: PixelBoardInit): void {
  for (let i = 0; i < wallPositions.length;i++) {
    getOrCreateWall(wallPositions[i])
  }
}
