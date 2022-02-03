//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;


contract Alleybox {
  enum Walls { north, south, east, west, floor, ceiling }
  uint8 constant public brickRowCount = 150;
  uint16 constant public brickRowCount50 = 150 * 50;
  uint16 constant public bricksLength = 150 * 150;
  uint16 constant public bricksColorRowLength = 3 * brickRowCount;
  uint32 constant public bricksColorLength = 150 * 150;
  
  struct Brick {
    address owner;
    bytes3 rgb;
    uint lastUpdated;
    uint lastPrice;
  }

  struct Wall {
    Brick[brickRowCount][brickRowCount] bricks;
    bytes3[bricksColorLength] brickColors;
  }

  event BrickUpdated(address owner, bytes3 rgb, uint256 price);

  mapping(uint8 => Wall) walls;

  function updateBrick(uint8 _wall, uint16 _x, uint16 _y, bytes3 _rgb, uint _price) internal {
    require(_x < brickRowCount && _y < brickRowCount && _wall < 6, "Coordinates are out of bounds");
    Wall storage wall = walls[_wall];
    Brick storage brick = wall.bricks[_x][_y];
    require(_price > brick.lastPrice, "Bid too low");
    brick.lastPrice = _price;
    brick.lastUpdated = block.timestamp;
    brick.rgb = _rgb;
    brick.owner = msg.sender;

    uint16 brickColorIndex = _y * brickRowCount + _x;

    wall.brickColors[brickColorIndex] = _rgb;

    emit BrickUpdated(msg.sender, _rgb, _price);

  }

  function updateBricks(
    uint8[] memory _wall,
    uint16[] memory _x,
    uint16[] memory _y,
    bytes3[] memory _rgb,
    uint[] memory _price
  ) public payable {
    uint transactionValue = msg.value;
    uint updateCount = _wall.length;
    for (uint i = 0; i < updateCount; i++) {
      require(transactionValue >= _price[i], "Not enough funds");
      transactionValue -= _price[i];
      updateBrick(_wall[i], _x[i], _y[i], _rgb[i], _price[i]);
    }
  }

  function getBrick(
    uint8 _wall,
    uint16 _x,
    uint16 _y
  ) public view returns (
    address owner,
    bytes3 rgb,
    uint lastUpdated,
    uint lastPrice
  ) {
    Brick memory brick = walls[_wall].bricks[_x][_y];
    owner = brick.owner;
    rgb = brick.rgb;
    lastUpdated = brick.lastUpdated;
    lastPrice =  brick.lastPrice;
  }

  // get an entire wall array, requires ~28MM gas
  function getWall(
    uint8 _wall
  ) public view returns (
    bytes3[bricksLength] memory
  ) {
    return walls[_wall].brickColors;
  }

  function getWallRow(
    uint8 _wall,
    uint8 _row
  ) public view returns (
    bytes3[brickRowCount] memory row
  ) {
    Wall storage wall = walls[_wall];
    uint32 start = _row * brickRowCount;
    for (uint32 i = 0; i < brickRowCount; i++) {
      uint32 copyIndex = start + i;
      // console.log("copying wall:", copyIndex, i, wall.brickColors[start + i]);

      row[i] = wall.brickColors[copyIndex];
    }
  }

  // this function can be used to get a wall if a full wall query is unavailable because of gas limitations
  function getWallRows(
    uint8 _wall,
    uint8 _start
    //uint8 _count
  ) public view returns (
    bytes3[brickRowCount50] memory row
  ) {
    Wall storage wall = walls[_wall];
    uint32 start = _start * brickRowCount;  
    // uint32 end = brickRowCount * 5;// * _count;
    // console.log("copying wall starting at :", start,  end, _start, _count);
    for (uint32 i = 0; i < brickRowCount50; i++) {
      uint32 copyIndex = start + i;
      // console.log("copying wall:", copyIndex, i, wall.brickColors[start + i]);

      row[i] = wall.brickColors[copyIndex];
    }
  }

}