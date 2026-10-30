const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird
let birdX = 50;
let birdY = 150;
let birdVelocity = 0;
const gravity = 0.4;
const jumpStrength = -7;

// Pipes
let pipes = [];
const pipeWidth = 60;
const pipeGap = 150;
const pipeSpeed = 2;

// Game state
let score = 0;
let gameOver = false;

// Create pipes
function createPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 50);
    const bottomHeight = canvas.height - topHeight - pipeGap;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: bottomHeight
    });
}

// Game loop
function update() {
    if (gameOver) return;

    birdVelocity += gravity;
    birdY += birdVelocity;

    // Bird collision with ground/ceiling
    if (birdY > canvas.height || birdY < 0) {
        gameOver = true;
    }

    // Move pipes
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Collision detection
        if (
            birdX + 20 > pipe.x &&
            birdX < pipe.x + pipeWidth &&
            (birdY < pipe.top || birdY + 20 > canvas.height - pipe.bottom)
        ) {
            gameOver = true;
        }

        // Score
        if (pipe.x + pipeWidth === birdX) {
            score++;
        }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Add new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    draw();
    requestAnimationFrame(update);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird
    ctx.fillStyle = "yellow";
    ctx.fillRect(birdX, birdY, 20, 20);

    // Pipes
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });

    // Score
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    if (gameOver) {
        ctx.fillText("Game Over!", 140, 300);
    }
}

// Controls
document.addEventListener("keydown", () => {
    birdVelocity = jumpStrength;
});

// Start game
createPipe();
update();