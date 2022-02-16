import { gql } from '@apollo/client';
import { responsePathAsArray } from 'graphql';
import { subgraphClient } from '../client';

const QUERY_LIMIT = 1000
export const GET_WALL_BRICKS = gql`
  query bricks($wallId: ID!, $lastBrickId: ID!, $queryLimit: number!) {
    bricks(first: $queryLimit, where:{id_gt: $lastBrickId, wall: $wallId}) {
      id
      owner
      x
      y
      rgb
      price
      lastUpdated
    }
  }
`;

interface GetWallBricksResponse {
  questionGroups: {
    id: string,
    owner: string,
    x: number,
    y: number,
    rgb: string
    price: string
    lastUpdated: string
  }
}

export const getWallBricks = async (wallId: string, lastBrickId: string) => {
  const response = await subgraphClient.query({
    query: GET_WALL_BRICKS,
    variables: {wallId, lastBrickId, queryLimit: QUERY_LIMIT},
    fetchPolicy: "network-only"
  })

  return response
  
}

export const getAllWallBricks = async (wallId: string) => {
  let bricks: any = []
  let lastBrickId = ''
  let remainingBricks = true
  let error = null
  while(remainingBricks) {
    const response = await getWallBricks(wallId, lastBrickId)
    if (response.error) {
      remainingBricks = false
      error = response.error
    }
    const responseLength = response.data.bricks.length
    bricks = bricks.concat(response.data.bricks)
    if (responseLength < QUERY_LIMIT) {
      remainingBricks = false
    } else {
      lastBrickId = response.data.bricks[responseLength-1].id
    }
  }
  return {
    bricks,
    error
  }
}