const { expect, assert } = require("chai");

describe("Alleybox", function() {
  it("Should create default walls on deploy", async function() {
    const Alleybox = await ethers.getContractFactory("PixelBoard");
    const alleybox = await Alleybox.deploy();
    
    await alleybox.deployed();
    const wallRow = await alleybox.getWall(0)
    const bricksLength = await alleybox.bricksLength()
    expect(wallRow.length).to.equal(bricksLength);
  });

  it("Should support getWallRows to be queried", async function() {
    const Alleybox = await ethers.getContractFactory("Alleybox");
    const alleybox = await Alleybox.deploy();
    
    await alleybox.deployed();
    const wallRow = await alleybox.getWallRows(0, 0)
    const bricksLength = await alleybox.brickRowCount50()
    expect(wallRow.length).to.equal(bricksLength);
  });

  it("Should be able to update bricks", async function() {
    const Alleybox = await ethers.getContractFactory("Alleybox");
    const alleybox = await Alleybox.deploy();
    
    await alleybox.deployed();
    const brick = await alleybox.getBrick(0, 0, 0)
    expect(brick.rgb).to.equal('0x000000');

    const brick1 = {
      w: 0,
      x: 0,
      y: 0
    }
    const newColor = '0x1122ff'
    await alleybox.updateBricks([brick1.w], [brick1.x], [brick1.y], [newColor], ['1'], {value: '1'})

    const updatedBrick = await alleybox.getBrick(brick1.w, brick1.x, brick1.y)
    expect(updatedBrick.rgb).to.equal(newColor);

    const wallRows = await alleybox.getWallRows(0,0)
    expect(wallRows[0]).to.equal(newColor)

    const brick2 = {
      w: 1,
      x: 23,
      y: 24
    }
    await alleybox.updateBricks([brick2.w], [brick2.x], [brick2.y], [newColor], ['1'], {value: '1'})
    const updatedBrick2 = await alleybox.getBrick(brick2.w, brick2.x, brick2.y)

    expect(updatedBrick2.rgb).to.equal(newColor);

    const wallRows2 = await alleybox.getWallRows(1,0)
    const brick2Index = brick2.y * 150 + brick2.x
    
    expect(wallRows2[brick2Index]).to.equal(newColor)

  });

  it("Should not be able to update out of range bricks", async function() {
    const revertError = 'VM Exception while processing transaction: revert'
    const newColor = '0x1122ff'

    const Alleybox = await ethers.getContractFactory("Alleybox");
    const alleybox = await Alleybox.deploy();
    
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