const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const score_p = document.getElementById('score')
const highscore_p = document.getElementById('highscore')

const hammer = new Hammer(canvas);
hammer.get('swipe').set({direction: Hammer.DIRECTION_ALL});

const grid = 16;
let count = 0;
  
let snake = {
  x: 160,
  y: 160,
  
  dx: grid,
  dy: 0,
  
  cells: [],
  
  maxCells: 4,

  score: 0,
  highscore: 0 
};

let apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
  requestAnimationFrame(loop);

  if (++count < 6) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      snake.score++;
      if (snake.score >= snake.highscore) {
        snake.highscore++;
      }
      score_p.innerHTML = 'Score: ' + snake.score;
      highscore_p.innerHTML = 'Highscore: ' + snake.highscore;

      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        snake.score = 0;
        score_p.innerHTML = 'Score: ' + snake.score;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });

  hammer.on('swipeleft', () => {
    if (snake.dx === 0) {
      snake.dx = -grid;
      snake.dy = 0;
    }
  });
  
  hammer.on('swiperight', () => {
    if (snake.dx === 0) {
      snake.dx = grid;
      snake.dy = 0;
    }
  });
  
  hammer.on('swipeup', () => {
    if (snake.dy === 0) {
      snake.dy = -grid;
      snake.dx = 0;
    }
  });
  
  hammer.on('swipedown', () => {
    if (snake.dy === 0) {
      snake.dy = grid;
      snake.dx = 0;
    }
  });
}

document.addEventListener('keydown', function(e) {  
  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(loop);