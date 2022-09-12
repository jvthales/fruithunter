export default function createGame() {

  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  }

  function addPlayer(command) {
    const playerId = command.playerId
    const playerX = command.playerX
    const playerY = command.playerY

    state.players[playerId] = {
      x: playerX,
      y: playerY
    }
  }

  function removePlayer(command) {
    const playerId = command.playerId

    delete state.players[playerId]
  }

  function addFruit(command) {
    const fruitId = command.fruitId
    const fruitX = command.fruitX
    const fruitY = command.fruitY

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }
  }

  function removeFruit(command) {
    const fruitId = command.fruitId

    delete state.fruits[fruitId]
  }

  function movePlayer(command) {

    // console.log(`game.movePlayer() -> Moving ${command.playerId} with ${command.keyPressed}`)

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
      console.log(`Checking ${playerId} and ${fruitId}`)

      if (player.x === fruit.x && player.y === fruit.y) {
        console.log(`collision between ${playerId} and ${fruitId}!!!`);
        removeFruit({ fruitId })
      }
    }
  }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    state
  }
}