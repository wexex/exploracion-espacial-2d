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
    friction: 0.99,
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

// Generate planets
const planets = [];
const PLANET_COUNT = 100;
const PLANET_AREA_SIZE = 8000;
function generatePlanets() {
    for (let i = 0; i < PLANET_COUNT; i++) {
        const x = Math.random() * PLANET_AREA_SIZE - PLANET_AREA_SIZE / 2;
        const y = Math.random() * PLANET_AREA_SIZE - PLANET_AREA_SIZE / 2;
        const radius = Math.random() * 50 + 20;
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30 + 50);
        const lightness = Math.floor(Math.random() * 30 + 40);
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        planets.push({ x, y, radius, color });
    }
}

generatePlanets();

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

    // Draw planets relative to player position
    for (const planet of planets) {
        const screenX = (planet.x - player.x) + width / 2;
        const screenY = (planet.y - player.y) + height / 2;
        // Only draw if within visible area to optimize
        if (screenX + planet.radius >= 0 && screenX - planet.radius < width &&
            screenY + planet.radius >= 0 && screenY - planet.radius < height) {
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, planet.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw player's ship rotated at center
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
