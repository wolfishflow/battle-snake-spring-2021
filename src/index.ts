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

function handleStart(request, response) {
  response.status(200).send('ok')
}

function handleMove(request, response) {
  const gameData = request.body as model.GameData;

  console.log(JSON.stringify(gameData))

  const validMoves = nextSafeMove(gameData.you.head, gameData.you.body)
  response.status(200).send({
    move: validMoves
  })
}

function nextSafeMove(head: model.Coordinate, body: model.Coordinate[]): Directions {



  // Up
  const up = new model.Coordinate(head.x, head.y + 1)
  // Down
  const down = new model.Coordinate(head.x, head.y - 1)
  // Left
  const left = new model.Coordinate(head.x - 1, head.y)
  // Right
  const right = new model.Coordinate(head.x + 1, head.y)


  let possibleMoves: model.Coordinate[] = [up, down, left, right]


  let validMoves = possibleMoves.filter(move => isValidCoordinate(move) && isNotSelfCollision(move, body))

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

function isValidCoordinate(coordinate: model.Coordinate): boolean {
  return !(coordinate.x < 0 || coordinate.x > 10 || coordinate.y < 0 || coordinate.y > 10)
}

function isNotSelfCollision(coordinate: model.Coordinate, body: Array<model.Coordinate>): boolean {
  for (let bodyCoordinate of body) {
    // would result in self collision
    if (coordinate.x == bodyCoordinate.x && coordinate.y == bodyCoordinate.y) {
      return false
    }
  }

  return true
}


function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}




