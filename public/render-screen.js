export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {

  const context = screen.getContext('2d')
  context.fillStyle = 'white'
  context.clearRect(0, 0, 10, 10)

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId]
    context.fillStyle = 'black'
    context.fillRect(player.x, player.y, 1, 1)
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId]
    context.fillStyle = 'green'
    context.fillRect(fruit.x, fruit.y, 1, 1)
  }

  const currentPlayer = game.state.players[currentPlayerId]

  if(currentPlayer) {
    context.fillStyle = '#550000'
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
  }

  // score
  let scoreText = ''
  for (const playerId in game.state.players) {
    const player = game.state.players[playerId]
    let pType = player === currentPlayer ? '<p class="name">' : '<p>'
    scoreText += `${pType}${playerId.substring(0,5)}: ${player.score}</p>`
    document.getElementById('score-board').innerHTML = scoreText

  }

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
  })

}