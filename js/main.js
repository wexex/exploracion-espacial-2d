const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Player object with inertia
const player = {
    x: 0,
    y: 0,
    angle: 0,
    velX: 0,
    velY: 0,
    rotationSpeed: 0.05,
    acceleration: 0.1,
    friction: 0.99
};

// Keyboard input state
const keys = {};

// Generate stars
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
    // Rotate left/right
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.angle -= player.rotationSpeed;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        player.angle += player.rotationSpeed;
    }

    // Apply thrust forward/backward
    if (keys['ArrowUp'] || keys['KeyW']) {
        player.velX += Math.cos(player.angle) * player.acceleration;
        player.velY += Math.sin(player.angle) * player.acceleration;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        player.velX -= Math.cos(player.angle) * player.acceleration;
        player.velY -= Math.sin(player.angle) * player.acceleration;
    }

    // Update position with velocity
    player.x += player.velX;
    player.y += player.velY;

    // Apply friction
    player.velX *= player.friction;
    player.velY *= player.friction;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Draw stars relative to player position
    ctx.fillStyle = 'white';
    for (const star of stars) {
        const screenX = (star.x - player.x) + width / 2;
        const screenY = (star.y - player.y) + height / 2;
        if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
            ctx.fillRect(screenX, screenY, 2, 2);
        }
    }

    // Draw player's ship rotated
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(player.angle);
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, -7);
    ctx.lineTo(-10, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start the game loop
loop();
