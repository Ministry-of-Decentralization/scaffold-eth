import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import { pixelBoardSubgraphClient as client } from '../../clients'

const QUERY_LIMIT = 1000
const DEFAULT_RGB = '0xffffff'
const DEFAULT_OWNER = '0x0000000000000000000000000000000000000000'
const DEFAULT_PRICE = utils.parseUnits('0.1')

const generateDefaultBrick = (x: number, y: number) => {
  return {
    x,
    y,
    owner: DEFAULT_OWNER,
    rgb: DEFAULT_RGB,
    price: DEFAULT_PRICE
  }
}

const formatWallBricks = (bricks: any, rowLength: number, rowCount: number) => {
  return Array(rowLength * rowCount).fill(0).map((_,i) => {
    const x = i % rowLength
    const y = Math.floor(i / rowLength)
    const brick = bricks.find((brick: any) => brick.x === x && brick.y ===y)
    return brick || generateDefaultBrick(x, y)
  })
}

export const GET_WALL_BRICKS = gql`
  query bricks($wallId: ID!, $lastBrickId: ID!) {
    bricks(first: 1000, where:{id_gt: $lastBrickId, wall: $wallId}) {
      id
      owner
      x
      y
      rgb
      price
      lastUpdated
      wall {
        id
      }
    }
  }
`;

const useGetRows = (wallId: string, lastBrickId: string) => {
  console.log(`getting rows ${wallId} -- ${lastBrickId}`)
  const {loading, error, data, fetchMore} = useQuery(
    GET_WALL_BRICKS,
    {
      client,
      variables: { wallId, lastBrickId }
    });
  return {
    loading,
    error,
    data,
    fetchMore
  } 
}

const wallIsLoaded = (data: any) => data && data.bricks.length < 1000

const getLastBrickId = (data: any) => {
  return wallIsLoaded(data) ?
    null
    :
    data.bricks[data.bricks.length - 1].id
}

export const useGetWallBricks = (wallId: string, rowLength: number) => {
  const { loading, data, error, fetchMore } = useGetRows(wallId, "")
  console.log(`>>>>>>>>>>>>>>>\n>>>>>>>>>>>>\nquerying data  ${data && data.bricks.length}`)

  const fetchAdditional = async (lastBrickId: string) => {
    console.log(`fetching more ${lastBrickId}`)
    const res = await fetchMore({ variables: { wallId, lastBrickId } });
    console.log(`got fetched more ${res.data.bricks.length}`)
  }

  useEffect(() => {
    if (data && fetchMore) {
        const nextPage = !wallIsLoaded(data);
        const lastBrickId = getLastBrickId(data);

        if (nextPage && lastBrickId !== null) {
          fetchAdditional(lastBrickId)
        }
    }
  }, [data, fetchMore]);

  // const requests = Array(batchCount).fill(0)
  // for (let i = 0; i < batchCount; i++) {
  //   requests.push(useGetRows(wallId, i * batchLength, (i+1) * batchLength))
  // }

  // const loading = requests.reduce((acc,req) => acc || req.loading , false)
  // const error = requests.map((req) => req.error).filter((e) => e)
  // const wallBricks = requests.map((req) => req.wall).filter((e) => e).reduce((acc, wall) => acc.concat(wall.bricks), [])
  const allBricks = data && data.bricks ? formatWallBricks(data.bricks.filter((b:any) => b.wall.id === wallId), rowLength, rowLength) : []
  const wallColors = allBricks.map((brick,i) => {
    const x = i % rowLength
    const y = Math.floor(i / rowLength)
    return {
      color: brick.rgb,
      coords: [x,y]
    }
  })
  console.log(`allBricks legnth ${allBricks.length} -- ${allBricks.length ? JSON.stringify(allBricks[0]) : ''} -- ${allBricks.length ? JSON.stringify(allBricks[0]) : ''}`)
  return {
    loading,
    error,
    bricks: data && data.bricks,
    allBricks,
    wallColors
  } 
}