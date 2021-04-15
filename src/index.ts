const bodyParser = require('body-parser')
const express = require('express')
import * as model from './models';
import { Directions } from './constants';

const PORT = process.env.PORT || 3000


const app = express();
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)


app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))

//npm start
//battlesnake play -W 11 -H 11 --name RBCSnek --url http://127.0.0.1:3000/ -g solo -v

function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: '',
    color: '#888888',
    head: 'default',
    tail: 'default'
  }
  response.status(200).json(battlesnakeInfo)
}

// Game Functions

function handleStart(request, response) {
  response.status(200).send('ok')
}

function handleMove(request, response) {
  const gameData = request.body as model.GameData;

  //Check if we have an opponent
  const opponentSnake = gameData.board.snakes.filter(snake => snake.id != gameData.you.id)[0]

  if (opponentSnake == null) {
    const validMoves = foo(gameData.you.head, gameData.you.body)

    response.status(200).send({
      move: validMoves[0][1]
    })
  } else {
    const validMoves = foo(gameData.you.head, gameData.you.body.concat(opponentSnake.body))

    response.status(200).send({
      move: validMoves[0][1]
    })
  }
  //else we are solo 

  //concat perf may suck?

  console.log(opponentSnake)

  // determine if we need to eat (for now lets eat at 50 or below)
  if (gameData.you.health < 50) {
    // based on closest 5 food - pick the one that is A) Closest and B) is ideally farthest from opponent
    const fiveClosestFood = getClosestFood(gameData.you.head, gameData.board)
    // Then move towards food
    // We need a direction that matches safe directions
  } else {
    
  }

  // If we don't need to eat, chase tail

  
}

function handleEnd(request, response) {
  console.log('END')
  response.status(200).send('ok')
}


// Specific Snake Functions

//TODO change return signature to provide all valid moves and directions as a Tuple
// ie: return (Coordinate, Directions) []
// TODO update {body} to be an array of bodies? since we need to evalute against both our body and opponent
function nextSafeMove(head: model.Coordinate, body: model.Coordinate[]): Directions {

  // Up
  const up = new model.Coordinate(head.x, head.y + 1)
  // Down
  const down = new model.Coordinate(head.x, head.y - 1)
  // Left
  const left = new model.Coordinate(head.x - 1, head.y)
  // Right
  const right = new model.Coordinate(head.x + 1, head.y)

  const possibleMoves: model.Coordinate[] = [up, down, left, right]

  const validMoves = possibleMoves.filter(move => isValidCoordinate(move) && isNotCollision(move, body))

  switch (validMoves[0]) {
    case up:
      console.log(Directions.UP)
      return Directions.UP
    case down:
      console.log(Directions.DOWN)
      return Directions.DOWN
    case left:
      console.log(Directions.LEFT)
      return Directions.LEFT
    case right:
      console.log(Directions.RIGHT)
      return Directions.RIGHT
    default:
      //GG - we're ded
      console.log("GG")
      return Directions.UP
  }

}


//TODO change return signature to provide all valid moves and directions as a Tuple
// ie: return (Coordinate, Directions) []
// TODO update {body} to be an array of bodies? since we need to evalute against both our body and opponent
function foo(head: model.Coordinate, body: model.Coordinate[]) : [model.Coordinate, Directions][] {

  const possibleMoves: [model.Coordinate, Directions][] = [
    [new model.Coordinate(head.x, head.y + 1), Directions.UP],
    [new model.Coordinate(head.x, head.y - 1), Directions.DOWN],
    [new model.Coordinate(head.x - 1, head.y), Directions.LEFT],
    [new model.Coordinate(head.x + 1, head.y), Directions.RIGHT]
  ]

  return possibleMoves.filter(([move]) => isValidCoordinate(move) && isNotCollision(move, body))
}


// TODO - determine conditions that would push for and against food moves
function isFoodNeeded(): boolean {
  return true
}


// TODO - consider other snakes in proximity of the closet food - especially if they're closer
// TODO UPDATE - Wrote isFoodCloserToOurSnakeVsOpponentSnake() but still need a func to handle all the decisions
function getClosestFood(head: model.Coordinate, board: model.Board,) {
  let startingPoint = head

  //determine closest food in reference to the starting point

  // naive approach - subtract all food coordinates from head
  // populate a map via amount of turns by coordinate of food
  // convert map to array and sort by lowest turns - and take (n) amount from array
  // then return (n) amount array

  let map = new Map<number, model.Coordinate>()

  for (let coordinate of board.food) {
    map.set(getDistanceBetweenTwoPoints(head, coordinate), coordinate)
  }

  // Array.from(map).filter { ([distance, food]) =>  }
  // determine (n) 
  let fiveOfTheClosestFood = Array.from(map).sort(([distanceA], [distanceB]) => distanceA - distanceB).slice(5)

  console.log(fiveOfTheClosestFood)

  return fiveOfTheClosestFood
}

function getOpponentDistanceToFood(board: model.Board, myId: string, food: model.Coordinate): number {
  //NPE?
  // board.snakes will return all snakes including ourself so we need to filter ourself out
  let opponentSnake = board.snakes.filter(snake => snake.id != myId)[0]
  return getDistanceBetweenTwoPoints(opponentSnake.head, food)
}


//TODO name this better? Do we even need this function? Inline might be better overall
// FUNC - Depending on the distance from our snake head and food, and opponent snake head and food - either return true or false
function isFoodCloserToOurSnakeVsOpponentSnake(distanceFromOurSnakeHead: number, distanceFromOpponentSnakeHead: number): boolean {
  return distanceFromOurSnakeHead > distanceFromOpponentSnakeHead
}


// --------------------- General Functions ------------------------------

// Standard Board size is 11 by 11 (0 indexed ie 0-10 by 0-10)
function isValidCoordinate(coordinate: model.Coordinate): boolean {
  return !(coordinate.x < 0 || coordinate.x > 10 || coordinate.y < 0 || coordinate.y > 10)
}

//TODO can probably refactor and use it for both self collision and opponent collision?
function isNotCollision(coordinate: model.Coordinate, body: Array<model.Coordinate>): boolean {
  for (let bodyCoordinate of body) {
    // would result in a collision
    if (coordinate.x == bodyCoordinate.x && coordinate.y == bodyCoordinate.y) {
      return false
    }
  }

  return true
}

function getDistanceBetweenTwoPoints(pointA: model.Coordinate, pointB: model.Coordinate): number {
  return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)
}
