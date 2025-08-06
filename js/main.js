const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// Player position and speed
let player = { x: 0, y: 0, speed: 3 };

// Keyboard input state
const keys = {};

// Generate stars in a large area around the origin
const stars = [];
const STAR_COUNT = 200;
for (let i = 0; i < STAR_COUNT; i++) {
    const x = Math.random() * 4000 - 2000;
    const y = Math.random() * 4000 - 2000;
    stars.push({ x, y });
}

// Handle keydown and keyup events
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function update() {
    if (keys['ArrowUp'] || keys['KeyW']) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        player.y += player.speed;
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        player.x += player.speed;
    }
}

function draw() {
    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Draw stars relative to the player position
    ctx.fillStyle = 'white';
    for (const star of stars) {
        const screenX = (star.x - player.x) + width / 2;
        const screenY = (star.y - player.y) + height / 2;
        if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
            ctx.fillRect(screenX, screenY, 2, 2);
        }
    }

    // Draw the player's ship as a small triangle
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2 - 10);
    ctx.lineTo(width / 2 - 6, height / 2 + 8);
    ctx.lineTo(width / 2 + 6, height / 2 + 8);
    ctx.closePath();
    ctx.fill();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start the game loop
loop();
