export default function createGame() {

  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  const fruitFrequency = 2000
  const fruitPoint = 1

  const observers = []

  function start() {
    setInterval(addFruit, fruitFrequency)
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function setState(newState) {
    Object.assign(state, newState)
  }

  function addPlayer(command) {
    const playerId = command.playerId
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)
    const score = 'score' in command ? command.score : 0

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      score
    }

    notifyAll({
      type: 'add-player',
      playerId,
      playerX,
      playerY,
      score
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId

    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId
    })
  }

  function addFruit(command) {

    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
    const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
    const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }

    notifyAll({
      type: 'add-fruit',
      fruitId,
      fruitX,
      fruitY
    })
  }

  function removeFruit(command) {
    const fruitId = command.fruitId

    delete state.fruits[fruitId]

    notifyAll({
      type: 'remove-fruit',
      fruitId
    })
  }

  const acceptedMoves = {
    ArrowUp(player) {
      player.y = Math.max(player.y - 1, 0)
      return
    },
    ArrowRight(player) {
      player.x = Math.min(player.x + 1, state.screen.width - 1)
      return
    },
    ArrowDown(player) {
      player.y = Math.min(player.y + 1, state.screen.height - 1)
      return
    },
    ArrowLeft(player) {
      player.x = Math.max(player.x - 1, 0)
      return
    }
  }

  function movePlayer(command) {
    notifyAll(command)

    // console.log(`game.movePlayer() -> Moving ${command.playerId} with ${command.keyPressed}`)

    const keyPressed = command.keyPressed
    const playerId = command.playerId
    const player = state.players[command.playerId]
    const moveFunction = acceptedMoves[keyPressed]
    
    if(player && moveFunction) {
      moveFunction(player)
      checkForFruitCollision(playerId)
    }

  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId]

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]
      // console.log(`Checking ${playerId} and ${fruitId}`)

      if (player.x === fruit.x && player.y === fruit.y) {
        // console.log(`collision between ${playerId} and ${fruitId}!!!`);
        removeFruit({ fruitId })
        addPoint(playerId)
      }
    }
  }

  function addPoint(playerId) {
    const player = state.players[playerId]
    player.score += fruitPoint

    notifyAll({ type: 'add-point' })
  }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    state,
    setState,
    subscribe,
    start
  }
}