const startElement = document.querySelector('.start');
const turnElement = document.querySelector('.turn');
const gameElement = document.querySelector('.game');
const winElement = document.querySelector('.win');
const loseElement = document.querySelector('.lose');
const tieElement = document.querySelector('.tie');
const resultElement = document.querySelector('.result');

let changeTurn = () => {
  if(turnElement.textContent === "Ваш Ход!") {
    turnElement.textContent = "Ход оппонента!";
  }
  else {
    turnElement.textContent = "Ваш Ход!";
  }
}

function changeVisibility(element) {
  element.classList.toggle('invisible');
}

let animationFrameWrapper = (fn) => {
  requestAnimationFrame( function(){ requestAnimationFrame(()=> fn); })
}

function delay(func, delay, args, context = null, ) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(func.apply(context, args));
    }, delay);
  });
}

function getArrayFillNull () {
    return Array(3).fill(null)
}

function getInitBoard() {
    return [
        [...getArrayFillNull()],
        [...getArrayFillNull()],
        [...getArrayFillNull()],
    ]
}

const PlayerType = {
    computer: 0,
    human: 1,
}

const row = {
    first: 0,
    second: 1,
    third: 2
}

const gameResultsPlayers = {
  win: -10,
  lose: 10,
  tie: 1
}

const aiPlayer = 'O'
const huPlayer = 'X'

const boardConfig = {
    cell: {
        width: 150,
        height: 150,
    },
    cross: {
        size: 20,
    },
    circle: {
        size: 20,
    },
    delay: {
      move: 1000,
      finish: 1000,
      restart: 5000,
    }
}

startElement.addEventListener('click', () => {
  start();
})

function initCanvas() {
    let board = document.querySelector("#board");
    board.width = 450;
    board.height = 450;
    ctx = board.getContext('2d');
    ctx.lineWidth = 2.0;
  
    for(let i = 0; i <= 9; i++) {
      if(i > 0 && i <= 3) {
          ctx.strokeRect(
            (i - 1) * boardConfig.cell.width, 
            boardConfig.cell.height * row.first, 
            boardConfig.cell.width, 
            boardConfig.cell.height
          );
      }
      else if(i > 3 && i <= 6) {
          ctx.strokeRect(
            (i - 4) * boardConfig.cell.width, 
            boardConfig.cell.height * row.second, 
            boardConfig.cell.width, 
            boardConfig.cell.height
          );
      }
      else if(i > 6 && i <= 9) {
          ctx.strokeRect(
            (i - 7) * boardConfig.cell.width, 
            boardConfig.cell.height * row.third, 
            boardConfig.cell.width, 
            boardConfig.cell.height
          );
      }
  }
  ctx.lineWidth = 2.6;
}

function drawCross(context, x, y, size) {
    context.beginPath();
    context.moveTo(x - size, y - size);
    context.lineTo(x + size, y + size);
    context.moveTo(x + size, y - size);
    context.lineTo(x - size, y + size);
    context.stroke();
}

function drawCircle(context, x, y, size) {
    context.lineJoin = 'bevel'
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.stroke();
}

function calculateCoordinates(row, column, cellWidth, cellHeight) {
  var x = (column + 0.5) * cellWidth;
  var y = (row + 0.5) * cellHeight;
  return { x: x, y: y };
}

function minimax(board, depth, isMax, alpha, beta) {
  let score = evaluate(board);

  if (score === 10) {
      return score - depth; // Max player (AI) WIN
  }

  if (score === -10) {
      return score + depth; // Min player (HU) WIN
  }

  if (!isMovesLeft(board)) {
      return 0; // TIE
  }

  if (isMax) {
      let best = -1000;

      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
              if (board[i][j] === null) {
                  board[i][j] = aiPlayer;
                  best = Math.max(best, minimax(board, depth + 1, !isMax, alpha, beta));
                  board[i][j] = null;
                  alpha = Math.max(alpha, best);
                  if (beta <= alpha) {
                      break;
                  }
              }
          }
      }
      return best;
  } else {
      let best = 1000;

      for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
              if (board[i][j] === null) {
                  board[i][j] = huPlayer;
                  best = Math.min(best, minimax(board, depth + 1, !isMax, alpha, beta));
                  board[i][j] = null;
                  beta = Math.min(beta, best);
                  if (beta <= alpha) {
                      break;
                  }
              }
          }
      }

      return best;
  }
}

function findBestMove(board) {
  let bestVal = -1000;
  let bestMove = {
      row: -1,
      column: -1
  };

  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (board[i][j] === null) {
              board[i][j] = aiPlayer;
              let moveVal = minimax(board, 0, false, -1000, 1000);
              board[i][j] = null;

              if (moveVal > bestVal) {
                  bestMove.row = i;
                  bestMove.column = j;
                  bestVal = moveVal;
              } else if (moveVal === bestVal) {
                  let defensiveVal = minimax(board, 0, true, -1000, 1000);
                  if (defensiveVal < moveVal) {
                      bestMove.row = i;
                      bestMove.column = j;
                      bestVal = moveVal;
                  }
              }
          }
      }
  }

  return bestMove;
}

function isMovesLeft(board) {
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (board[i][j] === null) {
              return true;
          }
      }
  }
  return false;
}

function evaluate(board) {
  // Rows
  for (let row = 0; row < 3; row++) {
      if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
          if (board[row][0] === aiPlayer) {
              return 10; // AI WIN
          } else if (board[row][0] === huPlayer) {
              return -10; // HU WIN
          }
      }
  }

  // Columns
  for (let col = 0; col < 3; col++) {
      if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
          if (board[0][col] === aiPlayer) {
              return 10; // AI WIN
          } else if (board[0][col] === huPlayer) {
              return -10; // HU WIN
          }
      }
  }

  // Diagonals
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] === aiPlayer) {
          return 10; // AI WIN
      } else if (board[0][0] === huPlayer) {
          return -10; // HU WIN
      }
  }

  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[0][2] === aiPlayer) {
          return 10; // AI WIN
      } else if (board[0][2] === huPlayer) {
          return -10; // HU WIN
      }
  }

  // Tie
  let tie = true;
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (board[i][j] === null) {
              tie = false;
              break;
          }
      }
  }

  if (tie) {
      return 1; // TIE (positive to MIN PLAYER)
  }

  // Game is not over
  return null;
}

class AudioManager {
  audios = {
    move: new Audio('./audio/move.mp3'),
    lose: new Audio('./audio/lose.mp3'),
    win: new Audio('./audio/win.mp3'),
    tie: new Audio('./audio/tie.mp3')
  }

  constructor() {}

  play(audioName) {
    this.audios[audioName].play();
  }
}

class Game {
    isStart = false;
    board = [];
    boardElementHtml;
    currentMove = PlayerType.human;
    audioService;

    constructor(AudioService, boardElementHtml) {
      this.audioService = AudioService;
      this.boardElementHtml = boardElementHtml
    }

    start() {
        this.isStart = true;
        changeVisibility(gameElement)
        this.board = getInitBoard();
    }
    playerMove(cellCoards) {
        if(this.isStart) {
            this.move(cellCoards.row, cellCoards.column, huPlayer)
            this.nextMove();
        }
    }
    getCurrentMove() {
      return this.currentMove;
    }
    isCellAvailable(cell) {
      return this.board[cell.row][cell?.column] === null;
    }
    async computerMove() {
        if(this.isStart) {
          debugger
            const move = findBestMove(this.board)
            await delay(this.move, boardConfig.delay.move, [move.row, move.column, aiPlayer], this)
            this.nextMove()
        }
    }
    move(row, column, player) {
      this.board[row][column] = player;
      this.audioService.play('move');
    }
    nextMove() {
      this.render();
      if(this.checkGameIsOver()) {
        this.finish();
      } else {
        if(this.currentMove === PlayerType.human) {
          this.passMove()
          this.computerMove();
        }
        else {
          this.passMove();
        }

      }
    }
    checkGameIsOver() {
      const isGameOn = evaluate(this.board) === null;
      if(!isGameOn) {
        return true;
      }
      return false
    }
    render() {
          this.board.forEach((elem, i) => {
            elem.forEach((cell, j ) => {
                let coards = calculateCoordinates(i, j, boardConfig.cell.width, boardConfig.cell.height);
                if(cell === huPlayer) {
                  drawCross(this.boardElementHtml, coards.x, coards.y, boardConfig.cross.size)
                }
                else if(cell === aiPlayer) {
                  drawCircle(this.boardElementHtml, coards.x, coards.y,boardConfig.cross.size)
                }
            })
        })
    }
    async finish() {
      this.isStart = false;
      await delay(changeVisibility, boardConfig.delay.finish, [gameElement])
      this.viewResult();
      await delay(restart, boardConfig.delay.restart);
    }
    viewResult () {
      const score = evaluate(this.board);
      changeVisibility(resultElement);
      switch (score) {
        case gameResultsPlayers.win:
          changeVisibility(winElement)
          this.audioService.play('win');
          break;
        case gameResultsPlayers.lose:
          changeVisibility(loseElement);
          this.audioService.play('lose');
          break;
        case gameResultsPlayers.tie:
          changeVisibility(tieElement);
          this.audioService.play('tie');
          break;
      }
    }
    passMove() {
      if(this.currentMove === PlayerType.human) {
        this.currentMove = PlayerType.computer;
        changeTurn()
      }
      else {
        this.currentMove = PlayerType.human;
        changeTurn()
      }
    }
}

function getCellByCoards(x, y) {
    let row = Math.floor(y / boardConfig.cell.height);
    let column = Math.floor(x / boardConfig.cell.width);

    return { row: row, column: column };
}

function boardClick(gameContext) {
  let { x, y } = getCoordsFromGameContext(gameContext);

  const isAllChecks = allChecks(
    [
      isClickInsideGameArea,
      isPlayerMove,
      isCellAvailable
    ]
  );

  if(isAllChecks(gameContext)) {
    gameContext?.game?.playerMove(getCellByCoards(x, y))
  }
}

function allChecks(funcs) {
  return function(value) {
    for (const func of funcs) {
      if (typeof func !== 'function') {
        throw new Error('Argument is not a function');
      }
      if (!func(value)) {
        return false;
      }
    }
    return true;
  }
}

const getCoordsFromGameContext = (gameContext) => {
  let elemLeft = gameContext?.boardView?.offsetLeft + gameContext?.boardView?.clientLeft;
  let elemTop = gameContext?.boardView?.offsetTop + gameContext?.boardView?.clientTop;
  let x = gameContext?.event?.pageX - elemLeft;
  let y = gameContext?.event?.pageY - elemTop;
  return { x, y };
}

const isClickInsideGameArea = (gameContext) => {
  let { x, y } = getCoordsFromGameContext(gameContext);

  if((x >= 0 && x <= boardConfig.cell.width*3) && (y >=0 && y <=boardConfig.cell.height*3)) {
    return true;
  }
  return false;
}

const isPlayerMove = (gameContext) => {
  return gameContext?.game?.getCurrentMove() === PlayerType.human;
}

const isCellAvailable = (gameContext) => {
  let {x, y} = getCoordsFromGameContext(gameContext);
  let cell = getCellByCoards(x, y)
  return gameContext?.game?.isCellAvailable(cell);
}

function start() {
  initCanvas()

  const boardView = document.querySelector('#board');
  const boardCtx = boardView.getContext('2d');
  const audioManager = new AudioManager();
  const game = new Game(audioManager, boardCtx);

  const gameContext = {
    boardView,
    boardCtx,
    audioManager,
    game
  };

  changeVisibility(startElement);
  gameContext.game.start();

  gameContext.boardView.addEventListener('click', (event) => {
    boardClick({...gameContext, event});
  });
}

function restart() {
  location.reload();
}