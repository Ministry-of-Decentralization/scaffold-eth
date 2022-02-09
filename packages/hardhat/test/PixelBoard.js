const { expect, assert } = require("chai");
const { utils } = require("ethers")

describe("PixelBoard", function() {
  it("Should create default walls on deploy", async function() {
    const PixelBoard = await ethers.getContractFactory("PixelBoard");
    const alleybox = await PixelBoard.deploy();
    
    await alleybox.deployed();
    const row = await alleybox.getWallRow(0)
    const bricksLength = await alleybox.brickWallCount()
    expect(row.length).to.equal(bricksLength);
  });

  it("Should support getWallRow to be queried", async function() {
    const PixelBoard = await ethers.getContractFactory("PixelBoard");
    const alleybox = await PixelBoard.deploy();
    
    await alleybox.deployed();
    const {colors} = await alleybox.getWallRow(0, 0)
    const bricksLength = await alleybox.brickRowCount()
    expect(colors.length).to.equal(bricksLength);
  });

  it("Should be able to update bricks", async function() {
    const PixelBoard = await ethers.getContractFactory("PixelBoard");
    const alleybox = await PixelBoard.deploy();
    
    await alleybox.deployed();
    const brick = await alleybox.getBrick(0, 0, 0)
    expect(brick.rgb).to.equal('0x000000');

    const brick1 = {
      w: 0,
      x: 1,
      y: 2
    }
    const newColor = '0x1122ff'
    await alleybox.updateBricks([brick1.w], [brick1.x], [brick1.y], [newColor], ['1'], {value: '1'})
      
    
    const updatedBrick = await alleybox.getBrick(brick1.w, brick1.x, brick1.y)
    const updatedBrick1 = await alleybox.getBrick(brick1.w, brick1.y, brick1.x)
    console.log(`updated single brick ${updatedBrick.rgb} - ${updatedBrick1.rgb}`)


    expect(updatedBrick.rgb).to.equal(newColor);

    const {colors} = await alleybox.getWallRow(brick1.w,brick1.y)
    console.log(`updated single brick ${colors}`)

    expect(colors[brick1.x]).to.equal(newColor)

    const brick2 = [
      {
        w: 1,
        x: 2,
        y: 5
      },
      {
        w: 1,
        x: 3,
        y: 5
      }
    ]
    const newColor2 = '0xaa55bb'

    const txValue = utils.parseUnits(1).toString()
    console.log(`tx Value ${txValue}`)

    await alleybox.updateBricks(
      [brick2[0].w, brick2[1].w],
      [brick2[0].x, brick2[1].x],
      [brick2[0].y, brick2[1].y],
      [newColor2, newColor2],
      ['1','1'],
      {value: txValue}
    )
    const updatedBrick2 = await alleybox.getBrick(brick2[0].w, brick2[0].x, brick2[0].y)
    expect(updatedBrick2.rgb).to.equal(newColor2);

    const wallRow2 = await alleybox.getWallRow(brick2.w,brick2.y)

    expect(wallRow2.colors[brick2.x]).to.equal(newColor2)

  });

  it("Should not be able to update out of range bricks", async function() {
    const revertError = 'VM Exception while processing transaction: revert'
    const newColor = '0x1122ff'

    const PixelBoard = await ethers.getContractFactory("PixelBoard");
    const alleybox = await PixelBoard.deploy();
    
    await alleybox.deployed();
    const brick = await alleybox.getBrick(0, 0, 0)
    expect(brick.rgb).to.equal('0x000000');

    const brick1 = {
      w: 0,
      x: 151,
      y: 0
    }

    const brick2 = {
      w: 0,
      x: 0,
      y: 151
    }

    const brick3 = {
      w: 6,
      x: 0,
      y: 0
    }

    // out of bounds errors
    await expect(alleybox.updateBricks([brick1.w], [brick1.x], [brick1.y], [newColor], ['1'], {value: '1'})).to.be.revertedWith(revertError)
    await expect(alleybox.updateBricks([brick2.w], [brick2.x], [brick2.y], [newColor], ['1'], {value: '1'})).to.be.revertedWith(revertError)
    await expect(alleybox.updateBricks([brick3.w], [brick3.x], [brick3.y], [newColor], ['1'], {value: '1'})).to.be.revertedWith(revertError)

    // insufficient funds
    await expect(alleybox.updateBricks([brick3.w], [brick3.x], [brick3.y], [newColor], ['2'], {value: '1'})).to.be.revertedWith(revertError)
  });
});