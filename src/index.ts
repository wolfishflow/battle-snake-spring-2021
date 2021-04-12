const bodyParser = require('body-parser')
const express = require('express')

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
  var gameData = request.body

  console.log(gameData)


  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body

  var possibleMoves = ['up', 'down', 'left', 'right']
  var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}

interface Game {
  id: string,
  ruleset: RuleSet,
  timeout: number
}

interface RuleSet {
  name: string,
  version: string
}

interface Coordinate {
  x: number,
  y: number
}

interface BattleSnake {
  id: string,
  name: string,
  health: number,
  body: Array<Coordinate>,
  latency: string,
  head: Coordinate,
  length: number,
  shout: string,
  squad: string
}

interface Board {
  height: number,
  width: number,
  food: Array<Coordinate>
  hazards: Array<Coordinate>
  snakes: Array<BattleSnake>
}

interface Move {
  move: string,
  shout: string,
}
