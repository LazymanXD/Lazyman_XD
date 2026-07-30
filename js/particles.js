/**
 * Particle System Module
 * Handles particle effects and parallax background animations
 */

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;
let animationId;

/**
 * Initialize canvas and resize handler
 */
function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/**
 * Create a single particle
 * @returns {Object} Particle object
 */
function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speedX: Math.random() * 0.5 - 0.25,
    speedY: Math.random() * 0.5 - 0.25,
    opacity: Math.random() * 0.5 + 0.2
  };
}

/**
 * Initialize particle system
 */
function initParticles() {
  const particleCount = window.innerWidth <= 768 ? 200 : 400;
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }
}

/**
 * Update particle positions
 */
function updateParticles() {
  particles.forEach(particle => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Mouse interaction
    const dx = mouseX - particle.x;
    const dy = mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      particle.x -= dx * 0.01;
      particle.y -= dy * 0.01;
    }

    // Wrap around screen
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;
  });
}

/**
 * Draw particles on canvas
 */
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
    ctx.fill();
  });
}

/**
 * Main animation loop
 */
function animateParticles() {
  updateParticles();
  drawParticles();
  animationId = requestAnimationFrame(animateParticles);
}

/**
 * Handle mouse movement
 */
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

/**
 * Initialize particle system
 */
function initParticleSystem() {
  initCanvas();
  initParticles();
  animateParticles();
}

// Initialize on load
if (canvas) {
  initParticleSystem();
}
