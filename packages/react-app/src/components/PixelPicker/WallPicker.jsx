import React from 'react'
import { Button } from 'antd'

const WallButton = ({label, isActive, onClick}) => <Button type={isActive ? 'primary' : ''} onClick={onClick}>{label}</Button>

const WallPicker = ({activeWall, onWallSelect, walls}) => (
  <div style={{ display: 'flex', justifyContent: 'space-around', width: '70%', margin: 'auto'}}>
    {walls.map((wall) => <WallButton key={wall} label={wall} isActive={activeWall === wall} onClick={() => onWallSelect(wall)} />)}
  </div>
)

export default WallPicker