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

  const move = getWallSafeMove(gameData.you.head, gameData.you.body[1])

  response.status(200).send({
    move: move
  })
}

function getWallSafeMove(headCoordinate: model.Coordinate, bodyCoordinate: model.Coordinate): string {

  // Top Left Corner (0,0)
  if (headCoordinate.x == 0 && headCoordinate.y == 0) {
    // If the head shares the same x value as the second body part - they are in the same col 
    if (headCoordinate.x == bodyCoordinate.x) {
      // Go Right
      return Directions.RIGHT
    } else {
      // Go Down
      return Directions.DOWN
    }
  }

  // Top Right Corner (10,0)
  if (headCoordinate.x == 10 && headCoordinate.y == 0) {
    // If the head shares the same x value as the second body part - they are in the same col 
    if (headCoordinate.x == bodyCoordinate.x) {
      // Go Right
      return Directions.LEFT
    } else {
      // Go Down
      return Directions.DOWN
    }
  }

  // Bottom Left Corner (0,10)
  if (headCoordinate.x == 0 && headCoordinate.y == 10) {
    // If the head shares the same x value as the second body part - they are in the same col 
    if (headCoordinate.x == bodyCoordinate.x) {
      // Go Right
      return Directions.RIGHT
    } else {
      // Go Up
      return Directions.UP
    }
  }

  // Bottom Right Corner (10,10)
  if (headCoordinate.x == 10 && headCoordinate.y == 10) {
    // If the head shares the same x value as the second body part - they are in the same col 
    if (headCoordinate.x == bodyCoordinate.x) {
      // Go Left
      return Directions.LEFT
    } else {
      // Go Up
      return Directions.UP
    }
  }

  // Left Wall && Right Wall
  if (headCoordinate.x == 0 || headCoordinate.x == 10) {
    //This needs optimization based on an objective (food, hazard, other snake?)

    // Left Wall
    if (headCoordinate.x == 0) {
      // Avoid colliding with body
      // Same Col - TODO determine optimal up/down? 
      if (headCoordinate.x == bodyCoordinate.x) {
        return Directions.RIGHT //TODO determine if this is a safe move - could still hit own body
      } else {
        return Directions.DOWN
      }
    } else {
      // Right Wall
      if (headCoordinate.x == bodyCoordinate.x ) {
        return Directions.LEFT //TODO determine if this is a safe move - could still hit own body
      } else {
        return Directions.UP
      }
    }

  }

  // Up Wall && Down Wall
  if (headCoordinate.y == 0 || headCoordinate.y == 10) {
    //This needs optimization based on an objective (food, hazard, other snake?)

    // Up Wall
    if (headCoordinate.y == 0) {
      // Avoid colliding with body
      // Same Col - TODO determine optimal up/down? 
      if (headCoordinate.y == bodyCoordinate.y) {
        return Directions.DOWN //TODO determine if this is a safe move - could still hit own body
      } else {
        return Directions.RIGHT
      }
    } else {
      // Down Wall
      if (headCoordinate.y == bodyCoordinate.y) {
        return Directions.UP //TODO determine if this is a safe move - could still hit own body
      } else {
        return Directions.LEFT
      }
    }
  }

  return Directions.RIGHT
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}




