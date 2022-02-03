
const wallLength = 8
const halfWallLength = wallLength / 2
const quarterWallLength = wallLength / 4
const wallScale = new Vector3(8, 8, .1)
//@ts-ignore
const eastRotation = new Quaternion.Euler(0, 90, 0)
//@ts-ignore
const northRotation = new Quaternion.Euler(0,0,0)
//@ts-ignore
const floorRotation = new Quaternion.Euler(90,0,0)


const wallShape = new PlaneShape()
wallShape.withCollisions = false
const westWall = new Entity()

westWall.addComponent(wallShape)
westWall.addComponent(
  new Transform({
    position: new Vector3(halfWallLength, halfWallLength, wallLength),
    rotation: eastRotation,
    scale: wallScale
  })
)
engine.addEntity(westWall)

const eastWall = new Entity()
eastWall.addComponent(wallShape)
eastWall.addComponent(
  new Transform({
    position: new Vector3(wallLength + halfWallLength, halfWallLength, wallLength),
    rotation: eastRotation,
    scale: wallScale
  })
)
engine.addEntity(eastWall)

const northWall = new Entity()
northWall.addComponent(wallShape)
northWall.addComponent(
  new Transform({
    position: new Vector3(wallLength, halfWallLength, wallLength + halfWallLength),
    rotation: northRotation,
    scale: wallScale
  })
)
engine.addEntity(northWall)

const southWall = new Entity()
southWall.addComponent(wallShape)
southWall.addComponent(
  new Transform({
    position: new Vector3(wallLength, halfWallLength, halfWallLength),
    rotation: northRotation,
    scale: wallScale
  })
)
engine.addEntity(southWall)

const floor = new Entity()
floor.addComponent(wallShape)
floor.addComponent(
  new Transform({
    position: new Vector3(wallLength, 0, wallLength),
    rotation: floorRotation,
    scale: wallScale
  })
)
engine.addEntity(floor)

const ceiling = new Entity()
ceiling.addComponent(wallShape)
ceiling.addComponent(
  new Transform({
    position: new Vector3(wallLength, wallLength, wallLength),
    rotation: floorRotation,
    scale: wallScale
  })
)
engine.addEntity(ceiling)

