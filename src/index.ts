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
    color: '#E80978',
    head: 'default',
    tail: 'bolt'
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
    var validDirection : Directions
    var validMoves = foo(gameData.you.head, gameData.you.body.concat(opponentSnake.body))

    //TODO only using the closest food rn versus 5
    const closestFood = getClosestFood(gameData.you.head, gameData.board)
    // Technically there might not be food?
    if (closestFood.length != 0) {
        let directionsToFood = getDirectionsFromTwoCoordinates(gameData.you.head, closestFood[0][1])
        let foo = Array.from(validMoves).filter(([ , direction]) => directionsToFood[0].includes(direction))
        console.log(foo)
        if(foo.length == 0) {
          //noop
        } else {
          validDirection = foo[0][1]
        }
    }

    if (validDirection == null) {
      if (validMoves.length == 0) {
        validDirection = getSuicideDirection(gameData.you.body.concat(opponentSnake.body))
      } else {
        validDirection = validMoves[0][1]
      }
    }

    response.status(200).send({
      move: validDirection
    })
  }
}

function handleEnd(request, response) {
  console.log('END')
  response.status(200).send('ok')
}


// Specific Snake Functions

//TODO change return signature to provide all valid moves and directions as a Tuple
// ie: return (Coordinate, Directions) []
// TODO update {body} to be an array of bodies? since we need to evalute against both our body and opponent
function foo(head: model.Coordinate, body: model.Coordinate[]): [model.Coordinate, Directions][] {

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
function getClosestFood(head: model.Coordinate, board: model.Board) : [number, model.Coordinate][] {

  //determine closest food in reference to the starting point

  // naive approach - subtract all food coordinates from head
  // populate a map via amount of turns by coordinate of food
  // convert map to array and sort by lowest turns - and take (n) amount from array
  // then return (n) amount array

  let map = new Map<number, model.Coordinate>()

  for (let coordinate of board.food) {
    map.set(getDistanceBetweenTwoPoints(head, coordinate), coordinate)
  }
  console.log(map)
  // Array.from(map).filter { ([distance, food]) =>  }
  // determine (n) 
  return Array.from(map).sort(([distanceA], [distanceB]) => distanceA - distanceB)
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

function getDirectionsFromTwoCoordinates(start: model.Coordinate, end: model.Coordinate): Directions[] {
  var directions = new Array();
  let coordinateA = start
  let coordinateB = end

  while (coordinateA.x != coordinateB.x) {
    if (coordinateA.x < coordinateB.x) {
      directions.push(Directions.RIGHT)
      coordinateA.x++
    } else {
      directions.push(Directions.LEFT)
      coordinateA.x--
    }
  }


  while (coordinateA.y != coordinateB.y) {
    if (coordinateA.y < coordinateB.y) {
      directions.push(Directions.UP)
      coordinateA.y++
    } else {
      directions.push(Directions.DOWN)
      coordinateA.y--
    }
  }

  return directions
}

function getSuicideDirection(body: model.Coordinate[]): Directions {
  let head = body[0]
  let neck = body[1]
  //same row
  if (head.x == neck.x) {
    if (head.y > neck.y) {
      return Directions.DOWN
    } else {
      return Directions.UP
    }
  } else {
    if (head.x > neck.x) {
      return Directions.LEFT
    } else {
      return Directions.RIGHT
    }
  }
}
