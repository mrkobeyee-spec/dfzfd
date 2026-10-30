<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Flappy Bird in JavaScript</title>
<style>
body {
    margin: 0;
    background: #70c5ce;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
canvas {
    border: 2px solid #000;
    background: #70c5ce;
}
</style>
</head>
<body>
<canvas id="gameCanvas" width="400" height="600"></canvas>

    <script>
// ===== Game Setup =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird properties
let bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.4,
    lift: -8,
    velocity: 0
};

// Pipes array
let pipes = [];
let frameCount = 0;
let score = 0;
let gameOver = false;

// ===== Event Listener =====
document.addEventListener("keydown", () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        resetGame();
    }
});

// ===== Game Functions =====
function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Collision with ground or ceiling
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;

        // Collision detection
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }

        // Score update
        if (pipe.x + pipe.width === bird.x) {
            score++;
        }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Add new pipes every 100 frames
    if (frameCount % 100 === 0) {
        let gap = 150;
        let top = Math.random() * (canvas.height - gap - 100) + 50;
        let bottom = canvas.height - top - gap;
        pipes.push({ x: canvas.width, width: 40, top: top, bottom: bottom });
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    gameOver = false;
}

// ===== Main Game Loop =====
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updateBird();
        updatePipes();
        drawBird();
        drawPipes();
        drawScore();
        frameCount++;
    } else {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press any key to restart", canvas.width / 2 - 110, canvas.height / 2 + 40);
    }

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
</script>
</body>
</html>
