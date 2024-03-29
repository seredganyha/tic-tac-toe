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
