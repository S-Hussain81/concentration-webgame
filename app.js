/*-------------------------------- Constants --------------------------------*/
const symbols = ['👻', '💀', '👽', '🤖', '🎃', '🤡', '👹', '👾']
const cardSymbols = [...symbols, ...symbols]
const TIME_LIMIT = 60

/*---------------------------- Variables (state) ----------------------------*/
let flippedCards
let shuffledSymbols
let matchedCards
let timerId
let timeLeft
let gameOver = false

/*------------------------ Cached Element References ------------------------*/
const grid = document.querySelectorAll('.gridbox')
const messageEl = document.querySelector('#message')
const resetButton = document.querySelector('.reset')
const startButton = document.querySelector('#start-game')
const timerEl = document.querySelector('#timer')

/*-------------------------------- Functions --------------------------------*/
const init = () => {
  shuffledSymbols = shuffle([...cardSymbols])
  flippedCards = []
  matchedCards = []
  gameOver = false
  render()
  updateMessage()
}

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.3)
}

const render = () => {
  grid.forEach((card, index) => {
    card.innerHTML = ''
    card.dataset.symbols = shuffledSymbols[index]
    card.classList.remove('flipped')
    card.classList.remove('matched')
  })
}

const updateMessage = () => {
  if (matchedCards.length === grid.length) {
    messageEl.textContent = 'You won! All pairs matched!'
    endGame(true)
  } else {
    messageEl.textContent = 'Find the matching pairs!'
  }
}

const handleCardClick = (event) => {
  const clickedCard = event.target
  if (
    flippedCards.length >= 2 ||
    clickedCard.classList.contains('flipped') ||
    matchedCards.includes(clickedCard) ||
    gameOver
  ) {
    return
  }

  clickedCard.classList.add('flipped')
  clickedCard.innerHTML = clickedCard.dataset.symbols
  flippedCards.push(clickedCard)

  if (flippedCards.length === 2) {
    checkForMatch()
  }
}

const checkForMatch = () => {
  const [card1, card2] = flippedCards

  if (card1.dataset.symbols === card2.dataset.symbols) {
    matchedCards.push(card1, card2)
    flippedCards = []
    updateMessage()
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped')
      card1.innerHTML = ''
      card2.classList.remove('flipped')
      card2.innerHTML = ''
      flippedCards = []
    }, 1000)
  }
}

const startTimer = () => {
  clearInterval(timerId)
  timeLeft = TIME_LIMIT
  timerEl.textContent = `Time Left: ${timeLeft}s`

  timerId = setInterval(() => {
    timeLeft--
    timerEl.textContent = `Time Left: ${timeLeft}s`

    if (timeLeft <= 0) {
      endGame(false)
    }
  }, 1000)
}

const endGame = (won) => {
  clearInterval(timerId)
  gameOver = true

  if (!won && matchedCards.length < grid.length) {
    messageEl.textContent = 'Time is up! You lost the game.'
  }

  grid.forEach((card) => {
    card.removeEventListener('click', handleCardClick)
  })
}

/*----------------------------- Event Listeners -----------------------------*/

const enableCardClicks = () => {
  grid.forEach((card) => {
    card.addEventListener('click', handleCardClick)
  })
}

startButton.addEventListener('click', () => {
  init()
  enableCardClicks()
  startTimer()
  startButton.disabled = true
})

resetButton.addEventListener('click', () => {
  init()
  startButton.disabled = false
})

init()
