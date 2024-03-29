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
