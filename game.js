const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameActive = false;

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

function gameLoop() {
    if (!gameActive) return;
    
    if (isGameOver()) {
        gameActive = false;
        startButton.style.display = 'none';
        gameOverEffect();
        return;
    }

    setTimeout(() => {
        clearCanvas();
        moveSnake();
        checkFoodCollision();
        drawFood();
        drawSnake();
        drawGrid();
        gameLoop();
    }, 100);
}

function isGameOver() {
    const head = snake[0];
    
    // Collision avec les murs
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Collision avec soi-même
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function resetGame() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.style.display = 'none';
    
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameActive = true;
    startButton.style.display = 'none';
    gameLoop();
}

function clearCanvas() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (!checkFoodCollision()) {
        snake.pop();
    }
}

function checkFoodCollision() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        celebrationEffect();
        setTimeout(generateFood, 100);
        return true;
    }
    return false;
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#ff00ff' : '#00ff00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = index === 0 ? '#ff00ff' : '#00ff00';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    ctx.shadowBlur = 0;
}

function drawGrid() {
    ctx.strokeStyle = '#00ff0022';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function celebrationEffect() {
    const canvasRect = canvas.getBoundingClientRect();
    const foodX = (food.x * gridSize + canvasRect.left) / window.innerWidth;
    const foodY = (food.y * gridSize + canvasRect.top) / window.innerHeight;
    
    confetti({
        particleCount: 20,
        spread: 30,
        origin: { 
            x: foodX,
            y: foodY
        },
        colors: ['#00ff00', '#ff00ff'],
        gravity: 1,
        scalar: 0.7,
        ticks: 50,
        shapes: ['circle']
    });
}

function gameOverEffect() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScore = document.getElementById('finalScore');
    
    // Effet de confettis plus léger pour game over
    confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#ff0000', '#ff00ff'],
        gravity: 1,
        scalar: 1,
        ticks: 200
    });
    
    // Afficher l'écran de game over
    finalScore.textContent = score;
    gameOverScreen.style.display = 'block';
}

startButton.addEventListener('click', () => {
    resetGame();
    gameLoop();
});

drawGrid(); 