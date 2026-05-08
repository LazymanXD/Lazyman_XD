// Elements
const loadingScreen = document.getElementById('loadingScreen');
const desktop = document.getElementById('desktop');
const middleTab = document.getElementById('middleTab');
const tabContent = document.getElementById('tabContent');
const roadmapToggleBtn = document.getElementById('roadmapToggleBtn');
const roadmapOverlay = document.getElementById('roadmapOverlay');

function createAudioWithFallback(fileName) {
  const audio = new Audio(fileName);
  audio.preload = 'auto';
  audio.addEventListener('error', function tryParentFolder() {
    if (audio.dataset.usedFallback === '1') return;
    audio.dataset.usedFallback = '1';
    audio.src = '../' + fileName;
    audio.load();
  });
  return audio;
}

// ðŸŽµ UI SOUNDS - Click sounds for buttons
const sounds = {
  open: createAudioWithFallback('universfield-new-notification-09-352705.mp3'),
  enter: createAudioWithFallback('universfield-new-notification-09-352705.mp3'),
  close: createAudioWithFallback('dragon-studio-new-notification-3-398649.mp3'),
  exit: createAudioWithFallback('dragon-studio-new-notification-3-398649.mp3'),
  back: createAudioWithFallback('dragon-studio-new-notification-3-398649.mp3'),
  minimize: createAudioWithFallback('dragon-studio-new-notification-3-398649.mp3'),
  maximize: createAudioWithFallback('dragon-studio-new-notification-3-398649.mp3'),
  click: createAudioWithFallback('dragon-studio-new-notification-3-398649.mp3'),
  infinite: createAudioWithFallback('universfield-new-notification-09-352705.mp3'),
  tabClick: createAudioWithFallback('universfield-new-notification-09-352705.mp3'),
  qaClick1: createAudioWithFallback('floraphonic-newspaper-foley-15-196732.mp3'),
  qaClick2: createAudioWithFallback('koiroylers-click-bubble-351951.mp3'),
  qaClick3: createAudioWithFallback('linhmitto-bubblepop-254773.mp3'),
  qaClick4: createAudioWithFallback('virtual_vibes-pop-tap-click-fx-383733.mp3'),
  typing: createAudioWithFallback('koiroylers-click-bubble-351951.mp3')
};

let audioUnlocked = false;
let qaSoundIndex = 0;
const qaSoundKeys = ['qaClick1', 'qaClick2', 'qaClick3', 'qaClick4'];

function isQAPage() {
  const currentContent = tabContent.innerHTML;
  return currentContent.includes('qa-container') || currentContent.includes('qa-top-nav');
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  Object.values(sounds).forEach(sound => {
    sound.play().catch(() => {});
    sound.pause();
    sound.currentTime = 0;
  });
}

function playSound(soundKey, delay = 0) {
  if (!soundKey && isQAPage()) {
    soundKey = qaSoundKeys[qaSoundIndex];
    qaSoundIndex = (qaSoundIndex + 1) % qaSoundKeys.length;
  }
  const sound = sounds[soundKey];
  if (!sound) return;
  sound.volume = soundKey === 'typing' ? 0.12 : 0.3;
  sound.currentTime = 0;
  setTimeout(() => {
    sound.play().catch(err => {
      console.warn('Sound play failed:', err.message);
    });
  }, delay);
}

document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('touchstart', unlockAudio, { once: true });

function toggleRoadmapOverlay() {
  if (!roadmapOverlay) return;
  roadmapOverlay.classList.toggle('show');
}

if (roadmapToggleBtn) {
  roadmapToggleBtn.addEventListener('click', toggleRoadmapOverlay);
}

// --- Slow Reveal Loading ---
window.addEventListener('load', () => {
  // Clear any stale book cards from previous session
  document.querySelectorAll('.book-card').forEach(card => card.remove());
  booksCardElements = [];
  booksCardsShowing = false;

  // Safety fallback - always hide loading screen after max 3 seconds
  const safetyTimeout = setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    const desktop = document.getElementById('desktop');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
      if (desktop) desktop.classList.add('loaded');
    }
  }, 3000);
  
  try {
    // Load saved data from localStorage first
    loadSavedData();

    // Update UI galleries after loading data
    updateArtworkSelect();

    // Create fast reveal effect using loading screen
    setTimeout(() => {
      const loadingScreen = document.getElementById('loadingScreen');
      const desktop = document.getElementById('desktop');
      if (loadingScreen) loadingScreen.classList.add('hidden');
      if (desktop) desktop.classList.add('loaded');
      showPage('home'); // Always start with home page
      // Note: Welcome sound will play on first user interaction
      clearTimeout(safetyTimeout); // Cancel safety timeout since we succeeded
    }, 100); // Start reveal after 0.1 seconds

    // Defer non-critical optimizations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setupImageLoadingOptimizations());
    } else {
      setTimeout(() => setupImageLoadingOptimizations(), 1000);
    }
  } catch (error) {
    console.error('Error during initialization:', error);
    // Even if there's an error, hide the loading screen and show the page
    const loadingScreen = document.getElementById('loadingScreen');
    const desktop = document.getElementById('desktop');
    if (loadingScreen) loadingScreen.classList.add('hidden');
    if (desktop) desktop.classList.add('loaded');
    showPage('home');
    clearTimeout(safetyTimeout);
  }
});

// Update artwork galleries after loading saved data
function updateArtworkSelect() {
  // Update the front artwork display if it exists
  const frontArtworkDisplay = document.getElementById('front-artwork-display');
  if (frontArtworkDisplay && window.frontSelectedArtwork) {
    frontArtworkDisplay.innerHTML = `<img src="${window.frontSelectedArtwork}" alt="Selected Front Artwork" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
  }
}

// --- ESC Key Handler for Easy Exit ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllExpanded();
  }
});

// --- Wallpaper Mouse Movement (Smooth) ---
let wallpaperX = 50;
let wallpaperY = 50;
let targetX = 50;
let targetY = 50;

document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const windowWidth = window.innerWidth;
  const mouseY = e.clientY;
  const windowHeight = window.innerHeight;
  
  // Calculate target position (-10% to +10% for subtle effect)
  targetX = 50 + ((mouseX / windowWidth) - 0.5) * 20;
  targetY = 50 + ((mouseY / windowHeight) - 0.5) * 10;
  
  // Calculate wallpaper target position (inverted for parallax)
  wallpaperTargetX = ((mouseX / windowWidth) - 0.5) * -40;
});

let wallpaperCurrentX = 0;
let wallpaperTargetX = 0;

// Smooth animation loop for wallpaper
function animateWallpaper() {
  // Smooth easing towards target position
  wallpaperX += (targetX - wallpaperX) * 0.1;
  wallpaperY += (targetY - wallpaperY) * 0.1;
  
  // Apply smooth background position
  document.body.style.backgroundPosition = `${wallpaperX}% ${wallpaperY}%`;
  
  // Smooth wallpaper parallax movement
  wallpaperCurrentX += (wallpaperTargetX - wallpaperCurrentX) * 0.05;
  const wallpaper = document.querySelector('.wallpaper');
  if (wallpaper) {
    wallpaper.style.transform = `translateX(${wallpaperCurrentX}px)`;
  }
  
  requestAnimationFrame(animateWallpaper);
}

// Start the smooth animation
animateWallpaper();

// --- Particle System: Atmospheric Floating Dust ---
const particleCanvas = document.getElementById('particle-canvas');
let particleCtx = null;
let particles = [];
// Reduce particles on mobile/low-power devices
const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 200 : 400;

// Mouse tracking for particle interaction
let mouseX = -1000;
let mouseY = -1000;

if (particleCanvas) {
  particleCtx = particleCanvas.getContext('2d');
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  
  // Track mouse position
  particleCanvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  particleCanvas.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });
  
  // Create atmospheric dust particles scattered everywhere
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      size: Math.random() * 0.8 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.2 - 0.1,
      opacity: Math.random() * 0.10 + 0.9,
      pulse: Math.random() * Math.PI * 2,
      sweptSpeedX: 0,
      sweptSpeedY: 0
    });
  }
}

function updateParticles() {
  if (!particleCtx || !particleCanvas) return;
  
  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  
  for (let p of particles) {
    // Check if mouse is near particle (sweep effect)
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const sweepRadius = 60; // pixels
    
    if (dist < sweepRadius && dist > 0) {
      // Push particle away from mouse
      const force = (sweepRadius - dist) / sweepRadius * 3;
      p.sweptSpeedX += (dx / dist) * force;
      p.sweptSpeedY += (dy / dist) * force;
    }
    
    // Apply normal movement + swept momentum
    p.x += p.speedX + p.sweptSpeedX;
    p.y += p.speedY + p.sweptSpeedY;
    p.pulse += 0.02;
    
    // Decay swept momentum (lasts about a second)
    p.sweptSpeedX *= 0.92;
    p.sweptSpeedY *= 0.92;
    
    // Wrap around edges
    if (p.x < 0) p.x = particleCanvas.width;
    if (p.x > particleCanvas.width) p.x = 0;
    if (p.y < 0) p.y = particleCanvas.height;
    if (p.y > particleCanvas.height) p.y = 0;
    
    // Pulsing opacity for atmospheric effect
    const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
    
    // Triangle boundary check - red zone (top-left triangle = invisible)
    const triangleWidth = particleCanvas.width * 0.90;
    const triangleHeight = particleCanvas.height * 0.40;
    const inTriangle = p.x < triangleWidth && p.y < triangleHeight * (1 - p.x / triangleWidth);
    if (inTriangle) continue; // In red zone, skip this particle only
    
    // Draw glowing dust particle with parallax offset matching background layer 3
    const parallaxX = layerPositions[3].x;
    const parallaxY = layerPositions[3].y;
    particleCtx.beginPath();
    particleCtx.arc(p.x + parallaxX, p.y + parallaxY, p.size, 0, Math.PI * 2);
    particleCtx.fillStyle = `rgba(255, 250, 220, ${pulseOpacity})`;
    particleCtx.fill();
    
    // Add subtle glow
    particleCtx.beginPath();
    particleCtx.arc(p.x + parallaxX, p.y + parallaxY, p.size * 2, 0, Math.PI * 2);
    particleCtx.fillStyle = `rgba(255, 250, 220, ${pulseOpacity * 0.3})`;
    particleCtx.fill();
  }
}

window.addEventListener('resize', () => {
  if (particleCanvas) {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    // Resize canvas
    particleCanvas.width = newWidth;
    particleCanvas.height = newHeight;
    
    // Regenerate particles to fill entire new canvas area
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * newWidth,
        y: Math.random() * newHeight,
        size: Math.random() * 0.8 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 - 0.1,
        opacity: Math.random() * 0.10 + 0.9,
        pulse: Math.random() * Math.PI * 2,
        sweptSpeedX: 0,
        sweptSpeedY: 0
      });
    }
  }
});

// --- Nested Parallax Effect for Layers 1-5 ---
// Layer 1 moves slightly, Layer 2 moves more (within Layer 1), etc.
// Each layer stays constrained within its parent layer
const layerElements = {
  2: document.querySelector('.bg-layer-2'),
  3: document.querySelector('.bg-layer-3'),
  4: document.querySelector('.bg-layer-4'),
  5: document.querySelector('.bg-layer-5')
};

// Movement multipliers - increasing from slowest (layer 1) to fastest (layer 5)
const layerSpeeds = {
  2: 4,
  3: 8,
  4: 12,
  5: 16
};

// Current positions for smooth animation
const layerPositions = {
  2: { x: 0, y: 0 },
  3: { x: 0, y: 0 },
  4: { x: 0, y: 0 },
  5: { x: 0, y: 0 }
};

// Target positions
const layerTargets = {
  2: { x: 0, y: 0 },
  3: { x: 0, y: 0 },
  4: { x: 0, y: 0 },
  5: { x: 0, y: 0 }
};

// Max offset each layer can move (circular radius constraint)
const layerMaxRadius = {
  2: 15,
  3: 20,
  4: 25,
  5: 30
};

// Throttled mouse tracking for performance
let mouseNormX = 0;
let mouseNormY = 0;

// Simple mouse tracking - no expensive calculations here
document.addEventListener('mousemove', (e) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Just store normalized values (-1 to 1)
  mouseNormX = (e.clientX / windowWidth) * 2 - 1;
  mouseNormY = (e.clientY / windowHeight) * 2 - 1;
});

// Smooth animation loop - all calculations happen here
function animateNestedParallax() {
  // Simple parallax for layers 2-5
  const smoothing = 0.08;
  
  // Animate shine layer - move left/right with mouse
  const shine = document.querySelector('.bg-layer-shine');
  if (shine) {
    const shineMove = mouseNormX * 20; // Move 20px left/right
    shine.style.transform = `translateX(${shineMove}px) translateZ(0)`;
  }
  
  // Animate FORGROUND - very slow movement
  const foreground = document.querySelector('.bg-layer-foreground');
  if (foreground) {
    const foregroundMove = mouseNormX * 2; // Very slow - only 2px
    foreground.style.transform = `translateX(${foregroundMove}px) translateZ(0)`;
  }
  
  // Update dust particles drifting through sunlight
  updateParticles();
  
  for (let i = 2; i <= 5; i++) {
    if (!layerElements[i]) continue;
    
    const maxRadius = layerMaxRadius[i];
    const speed = layerSpeeds[i];
    
    // Calculate target based on mouse with circular constraint
    let targetX = mouseNormX * speed * 2;
    let targetY = mouseNormY * speed * 2;
    
    // Clamp to circular boundary
    const dist = Math.sqrt(targetX * targetX + targetY * targetY);
    if (dist > maxRadius) {
      const ratio = maxRadius / dist;
      targetX *= ratio;
      targetY *= ratio;
    }
    
    // Smooth easing
    layerPositions[i].x += (targetX - layerPositions[i].x) * smoothing;
    layerPositions[i].y += (targetY - layerPositions[i].y) * smoothing;
    
    // Apply transform
    layerElements[i].style.transform = `translate(calc(-50% + ${layerPositions[i].x}px), ${layerPositions[i].y}px)`;
  }
  
  requestAnimationFrame(animateNestedParallax);
}

// Start nested parallax animation
animateNestedParallax();

// ðŸŽ® ENHANCED Window controls - Multi-layered playful sounds
function closeMiddleTab(e) {
  e.stopPropagation();
  playSound('close', 0);       // Instant pop
  playSound('hover', 100);     // Layered tail
  setTimeout(() => middleTab.classList.add('minimized'), 150);
  // Show roadmap button when returning to home
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = '';
}

function minimizeMiddleTab(e) {
  e.stopPropagation();
  playSound('tabClick', 0);
  setTimeout(() => {
    if (middleTab.classList.contains('maximized')) {
      // Add slow minimize animation
      middleTab.classList.add('slow-minimize');
      
      // Set final minimized state after animation
      setTimeout(() => {
        middleTab.classList.remove('slow-minimize');
        middleTab.classList.remove('maximized');
        middleTab.classList.add('minimized');
        document.body.classList.remove('window-maximized');
      }, 400);
    }
  }, 150);
}

function openMiddleTab() {
  playSound('infinite', 0);
  setTimeout(() => middleTab.classList.remove('minimized'), 150);
}

function maximizeMiddleTab(e) {
  e.stopPropagation();
  playSound('tabClick', 0);
  
  // Check if we're on the main/home page - if so, don't allow expansion
  const currentContent = tabContent.innerHTML;
  if (currentContent.includes('middle-tab-title') || currentContent.includes('Lazyman_XD')) {
    // We're on the home page, don't allow expansion
    return;
  }
  
  setTimeout(() => {
    if(middleTab.classList.contains('minimized')) middleTab.classList.remove('minimized');
    middleTab.classList.toggle('maximized');
    
    // Add/remove class to body for hiding icons
    if (middleTab.classList.contains('maximized')) {
      document.body.classList.add('window-maximized');
    } else {
      document.body.classList.remove('window-maximized');
    }
  }, 150);
}

// --- Drag (Smooth & Fast) ---
let isDragging = false;
let dragElement = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function dragStart(e, element){
  if(!element || element.classList.contains('maximized')) return;
  if(e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
  
  isDragging = true;
  dragElement = element;
  e.preventDefault();
  element.classList.add('dragging');
  document.body.style.userSelect = 'none';
  
  const rect = element.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  
  // Smooth dragging with immediate updates
  function moveHandler(ev){
    if(!isDragging || !dragElement) return;
    
    const newX = ev.clientX - dragOffsetX;
    const newY = ev.clientY - dragOffsetY;
    
    // Apply position immediately for fast response
    dragElement.style.left = newX + 'px';
    dragElement.style.top = newY + 'px';
  }
  
  function stop(){
    isDragging = false;
    dragElement = null;
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', stop);
    
    // Remove dragging class from any element
    document.querySelectorAll('.dragging').forEach(el => {
      el.classList.remove('dragging');
    });
  }
  
  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('mouseup', stop, {once: true});
}

// --- Pages ---
const pages = {
  home: {
    title: "Lazyman_XD",
    subtitle: "manga artist and illustrator",
    buttons: [
      {icon: "<img src='./me.webp' alt='Books' class='about-icon' style='object-fit: contain; background: transparent; border: none; padding: 0; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges;'>", label: "books", page: "books"},
      {icon: "<img src='./folder-icon.webp' alt='Work' class='work-btn-shake' style='object-fit: contain; background: transparent; border: none; padding: 0;'>", label: "work", page: "work"},
      {icon: "<img src='./manga.webp' alt='Manga' class='manga-icon' style='object-fit: contain; background: transparent; border: none; padding: 0; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges;'>", label: "manga", page: "manga"},
      {icon: "<img src='./question.webp' alt='Q&A' style='object-fit: contain; background: transparent; border: none; padding: 0;'>", label: "Q&A", page: "faq", class: "qa-btn"},
      {icon: "<img src='./wiki-logog.webp' alt='Wiki' style='object-fit: contain; background: transparent; border: none; padding: 0; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges; image-rendering: pixelated; image-rendering: crisp-edges; -webkit-font-smoothing: none; -moz-osx-font-smoothing: grayscale; font-smooth: never; image-rendering: optimize-contrast; filter: contrast(1.2) brightness(1.1);'>", label: "wiki", page: "wiki"}
    ]
  },
  about: {
    content: `<style>.about-content { font-size: clamp(8px, 2vw, 11px); line-height: 1.5; width: 100%; max-width: 100%; margin: 0 auto; padding: 15px; box-sizing: border-box; overflow-wrap: break-word; word-wrap: break-word; } .about-content h2 { font-size: clamp(10px, 3vw, 14px); margin-bottom: 10px; } .about-content p { margin-top: 10px; }</style><div class="about-content"><h2>About Me</h2><p><strong>Lazyman</strong> is a passionate manga artist and illustrator dedicated to creating captivating visual stories. With a unique artistic style that blends traditional manga aesthetics with modern digital techniques, Lazyman brings characters and worlds to life.</p><p>I specialize in creating manga, character illustrations, and concept art. My work spans various genres from fantasy and adventure to slice-of-life and emotional dramas. Each piece is crafted with attention to detail and a deep love for storytelling.</p><p>Over the years, I've created numerous manga series and illustrations. Some of my notable works include fantasy epics, character-driven dramas, and experimental art pieces. Every project is a new adventure in creativity.</p><p>I'm always open to collaborations, commissions, and connecting with fellow artists. Feel free to explore my work and reach out if you'd like to work together!</p></div>`
  },
  wiki: {
    content: `
      <style>
        .wiki-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 5vh;
          z-index: 1;
        }
        .wiki-images {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 100%;
          max-width: 800px;
          height: 50vh;
        }
        .wiki-ca-img {
          width: 700px;
          max-width: 90%;
          height: auto;
          object-fit: contain;
          position: absolute;
          z-index: 1;
          transition: all 0.3s ease;
        }
        .wiki-girl-img {
          width: 650px;
          max-width: 85%;
          height: auto;
          object-fit: contain;
          position: absolute;
          z-index: 2;
          margin-left: 5%;
          transition: all 0.3s ease;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .wiki-girl-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
        .wiki-text {
          color: #FFD700;
          font-family: 'Press Start 2P', cursive;
          font-size: 28px;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.9);
          text-align: center;
          z-index: 10;
          margin-top: 2vh;
          margin-bottom: 2vh;
        }
        .wiki-back-btn {
          padding: 12px 30px;
          background: #fff;
          border: none;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }
        .wiki-back-btn:hover {
          background: #f0f0f0;
        }
        @media (max-width: 768px) {
          .wiki-ca-img {
            width: 500px;
          }
          .wiki-girl-img {
            width: 450px;
            margin-left: 3%;
          }
          .wiki-text {
            font-size: 22px;
          }
        }
        @media (max-width: 480px) {
          .wiki-images {
            height: 40vh;
          }
          .wiki-ca-img {
            width: 320px;
            transform: translateX(-15%);
          }
          .wiki-girl-img {
            width: 300px;
            transform: translateX(-15%);
            margin-left: 2%;
          }
          .wiki-text {
            font-size: 16px;
          }
          .wiki-back-btn {
            padding: 10px 20px;
            font-size: 14px;
          }
        }
      </style>
      <div class="wiki-wrapper">
        <div class="wiki-images">
          <img src="./CA.webp" class="wiki-ca-img" alt="CA">
          <img src="./girl 1.webp" class="wiki-girl-img wiki-girl-wiggle" alt="Girl">
        </div>
        <div class="wiki-text">WIKI COMING SOON</div>
        <button class="wiki-back-btn" onclick="showPage('home')">← Back</button>
      </div>
    `
  },
  manga: {
    content: ""
  },
  faq: {
    content: `
      <style>
        .qa-container {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          display: flex;
          flex-direction: column;
          font-family: 'Press Start 2P', cursive;
          overflow: hidden;
          position: relative;
          max-width: 100vw;
        }
        .qa-exit-btn {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          cursor: pointer;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .qa-exit-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        .qa-exit-btn::before,
        .qa-exit-btn::after {
          content: '';
          position: absolute;
          width: 15px;
          height: 2px;
          background: #fff;
        }
        .qa-exit-btn::before {
          transform: rotate(45deg);
        }
        .qa-exit-btn::after {
          transform: rotate(-45deg);
        }
        .qa-top-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          padding: 20px 15px;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
          position: relative;
        }
        .qa-nav-btn {
          padding: 12px 24px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 25px;
          font-family: 'Press Start 2P', cursive;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.5px;
        }
        .qa-nav-btn:hover {
          background: rgba(255,255,255,0.2);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .qa-nav-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .qa-content-area {
          flex: 1;
          overflow-y: hidden;
          padding: 20px;
        }
        .qa-section {
          display: none;
        }
        .qa-section.active {
          display: block;
        }
        /* Character Sheets Layout - PC */
        .character-sheets-container {
          display: grid;
          grid-template-columns: minmax(200px, 300px) 1fr minmax(200px, 350px);
          gap: 10px;
          max-width: 95vw;
          margin: 0 auto;
          height: calc(100vh - 100px);
          align-items: start;
          padding: 20px;
        }
        .character-display {
          grid-column: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-width: 0;
          width: 100%;
          height: 100%;
          padding-top: 20px;
        }
        .pricing-panel {
          grid-column: 1;
          width: 100%;
          max-width: 300px;
          min-width: 0;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 25px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .pricing-title {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 25px;
          color: #fff;
          letter-spacing: 1px;
        }
        .pricing-category {
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .pricing-category h4 {
          font-size: 13px;
          margin: 0 0 12px 0;
          color: #a78bfa;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pricing-item {
          font-size: 14px;
          margin: 8px 0;
          display: flex;
          justify-content: space-between;
          color: rgba(255,255,255,0.8);
        }
        .pricing-item span:last-child {
          color: #fff;
          font-weight: 600;
        }
        .character-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .character-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 25px;
          margin-top: -40px;
          text-align: center;
          color: #fff;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .character-image-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          height: calc(100vh - 200px);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .style-switcher {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 10;
        }
        .style-switcher-mobile {
          display: none;
        }
        .left-side-panel {
          display: none;
        }
        .right-side-panel {
          display: none;
        }
        .style-switcher-desktop {
          display: none;
        }
        .pricing-tab-btn {
          display: none;
        }
        .style-circle {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255,255,255,0.1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .style-circle:hover,
        .style-circle.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        .character-buttons {
          grid-column: 3;
          display: flex;
          flex-direction: column;
          gap: 12px;
          justify-content: center;
          padding-top: 0;
          width: 100%;
          height: 100%;
          align-items: stretch;
        }
        .char-btn {
          width: 100%;
          padding: 25px 40px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          font-family: 'Press Start 2P', cursive;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          color: rgba(255,255,255,0.8);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
          box-sizing: border-box;
        }
        .char-btn:hover,
        .char-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        /* Other sections */
        .qa-text-content {
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Press Start 2P', cursive;
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255,255,255,0.9);
        }
        .qa-text-content h3 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 25px;
          letter-spacing: 1px;
        }
        .qa-text-content p {
          margin-bottom: 20px;
          color: rgba(255,255,255,0.8);
        }
        .social-links {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 400px;
          margin: 0 auto;
        }
        .social-link {
          padding: 18px 25px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          font-family: 'Press Start 2P', cursive;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          text-decoration: none;
          color: rgba(255,255,255,0.9);
          display: block;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .social-link:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        /* Phone Responsive */
        @media (max-width: 1100px) {
          .character-sheets-container {
            grid-template-columns: 55px 1fr 120px;
            gap: 15px;
          }
          .pricing-panel {
            display: none;
          }
          .left-side-panel {
            grid-column: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            width: 55px;
          }
          .pricing-tab-btn {
            display: block;
            padding: 20px 10px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            font-family: 'Press Start 2P', cursive;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            letter-spacing: 2px;
            min-height: 120px;
            color: rgba(255,255,255,0.9);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          }
          .pricing-tab-btn:hover,
          .pricing-tab-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border-color: transparent;
          }
          .char-btn {
            width: 100%;
            padding: 20px 15px;
            font-size: 14px;
          }
          .character-buttons {
            margin-left: 0;
            width: 100%;
          }
        }
        @media (max-width: 768px) {
          .qa-top-nav {
            padding: 12px 50px 12px 8px;
            gap: 6px;
            flex-wrap: wrap;
            justify-content: center;
            overflow-x: hidden;
          }
          .qa-exit-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 35px;
            height: 35px;
            min-width: 35px;
          }
          .qa-exit-btn:hover {
            transform: translateY(-50%);
          }
          .qa-nav-btn {
            padding: 8px 10px;
            font-size: 9px;
            flex: 1;
            min-width: 0;
            white-space: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          .character-sheets-container {
            display: grid;
            grid-template-columns: 55px 1fr 50px;
            align-items: start;
            height: calc(100vh - 80px);
            padding: 10px;
            gap: 10px;
          }
          .pricing-panel {
            display: none;
          }
          .pricing-panel.mobile-visible {
            display: block;
            position: fixed;
            top: 60px;
            left: 70px;
            right: 70px;
            width: auto;
            height: calc(100vh - 100px);
            z-index: 200;
            background: rgba(26,26,46,0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 20px;
            overflow-y: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          }
          .pricing-close-btn {
            display: block;
            position: absolute;
            top: 80px;
            left: -50px;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            cursor: pointer;
            z-index: 201;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: #fff;
            backdrop-filter: blur(10px);
          }
          .pricing-close-btn::before,
          .pricing-close-btn::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 2px;
            background: #fff;
          }
          .pricing-close-btn::before {
            transform: rotate(45deg);
          }
          .pricing-close-btn::after {
            transform: rotate(-45deg);
          }
          .left-side-panel {
            grid-column: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            width: 55px;
          }
          .pricing-tab-btn {
            display: block;
            padding: 20px 10px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            font-family: 'Press Start 2P', cursive;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            letter-spacing: 2px;
            min-height: 120px;
            color: rgba(255,255,255,0.9);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          }
          .pricing-tab-btn:hover,
          .pricing-tab-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border-color: transparent;
          }
          .pricing-title {
            font-size: 20px;
            margin-bottom: 20px;
          }
          .pricing-category {
            margin-bottom: 20px;
            padding: 12px;
          }
          .pricing-category h4 {
            font-size: 12px;
            margin: 0 0 8px 0;
          }
          .pricing-item {
            font-size: 13px;
            margin: 6px 0;
          }
          .character-display {
            grid-column: 2;
            grid-row: 1 / span 2;
            max-width: none;
            width: 100%;
            height: 100%;
          }
          .character-title {
            font-size: 16px;
            margin-bottom: 15px;
            font-weight: 600;
            margin-top: -30px;
          }
          .character-image-container {
            width: 100%;
            max-width: none;
            height: calc(100vh - 140px);
            border-radius: 15px;
            position: relative;
            overflow: hidden;
          }
          .character-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            position: relative;
            z-index: 1;
          }
          .character-buttons {
            grid-column: 3;
            grid-row: 2;
            display: flex;
            flex-direction: column;
            gap: 8px;
            justify-content: flex-start;
            z-index: 10;
            position: relative;
            width: 100%;
            padding-top: 10px;
            margin-left: 0;
          }
          .char-btn {
            padding: 10px 4px;
            font-size: 12px;
            border-radius: 8px;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            min-height: 50px;
            letter-spacing: 1px;
            width: 100%;
          }
          .style-switcher {
            display: none;
          }
          .style-switcher-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
            margin-bottom: 15px;
          }
          .right-side-panel {
            grid-column: 3;
            grid-row: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 50px;
            z-index: 10;
            justify-content: flex-start;
          }
          .style-circle {
            width: 28px;
            height: 28px;
          }
          .qa-text-content {
            font-size: 14px;
            padding: 15px;
          }
          .qa-text-content h3 {
            font-size: 22px;
          }
          .social-link {
            padding: 16px;
            font-size: 13px;
          }
        }
      </style>
      <div class="qa-container">
        <div class="qa-top-nav">
          <div class="qa-exit-btn" onclick="closeQATab()" title="Close"></div>
          <button class="qa-nav-btn active" onclick="showQASection('why')">WHY MAKE THIS?</button>
          <button class="qa-nav-btn" onclick="showQASection('contact')">WHERE TO CONTACT YOU?</button>
          <button class="qa-nav-btn" onclick="showQASection('social')">YOUR SOCIAL?</button>
          <button class="qa-nav-btn" onclick="showQASection('commissions')">YOU DO ART COMMISSIONS?</button>
        </div>
        <div class="qa-content-area">
          <!-- WHY MAKE THIS -->
          <div id="qa-why" class="qa-section active">
            <div class="qa-text-content">
              <h3>WHY MAKE THIS?</h3>
              <p>This website was created to showcase my artwork, manga, and creative projects in a unique, interactive way. I wanted to create something different from standard portfolio sites - something that reflects my personality and love for retro gaming aesthetics.</p>
              <p>The pixel art style and interactive elements are inspired by classic video games and visual novels that influenced my artistic journey.</p>
            </div>
          </div>
          <!-- WHERE TO CONTACT -->
          <div id="qa-contact" class="qa-section">
            <div class="qa-text-content">
              <h3>WHERE TO CONTACT YOU?</h3>
              <p>You can reach me through the following channels:</p>
              <p>Discord: <a href="https://discord.com/users/781458513603198986" target="_blank" class="social-link">lazyman_XD</a></p>
              <p>For business inquiries and commissions, please include details about your project including timeline, budget, and specific requirements.</p>
              <h4 style="margin-top: 25px; margin-bottom: 15px; color: #fff; font-family: 'Press Start 2P', cursive; font-size: 16px; font-weight: 600; text-align: center;">supportme/ payme</h4>
              <div class="payment-buttons" style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                <a href="https://paypal.me/LazymanXDPay" target="_blank" class="payment-btn paypal-btn" style="padding: 20px 40px; background: linear-gradient(135deg, #0070ba 0%, #005ea6 100%); border: 1px solid rgba(255,255,255,0.2); border-radius: 25px; color: #fff; text-decoration: none; font-family: 'Press Start 2P', cursive; font-size: 18px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,112,186,0.3);">PayPal</a>
                <a href="https://ko-fi.com/lazyman_xd" target="_blank" class="payment-btn kofi-btn" style="padding: 20px 40px; background: linear-gradient(135deg, #ff5e5b 0%, #ff4500 100%); border: 1px solid rgba(255,255,255,0.2); border-radius: 25px; color: #fff; text-decoration: none; font-family: 'Press Start 2P', cursive; font-size: 18px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255,94,91,0.3);">Ko-fi</a>
              </div>
            </div>
          </div>
          <!-- SOCIAL -->
          <div id="qa-social" class="qa-section">
            <div class="qa-text-content">
              <h3>YOUR SOCIAL?</h3>
              <div class="social-links">
                <a href="#" class="social-link" target="_blank" style="background: linear-gradient(135deg, #1da1f2 0%, #0d8ecf 100%); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29,161,242,0.3);">TWITTER / X</a>
                <a href="#" class="social-link" target="_blank" style="background: linear-gradient(135deg, #e1306c 0%, #c13584 50%, #833ab4 100%); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(225,48,108,0.3);">INSTAGRAM</a>
                <a href="https://www.deviantart.com/lazyman2020" class="social-link" target="_blank" style="background: linear-gradient(135deg, #05cc47 0%, #04a238 100%); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(5,204,71,0.3);">DEVIANTART</a>
                <a href="https://www.reddit.com/user/Top-Pizza-8795/submitted/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button" class="social-link" target="_blank" style="background: linear-gradient(135deg, #ff4500 0%, #ff5722 100%); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255,69,0,0.3);">REDDIT</a>
              </div>
            </div>
          </div>
          <!-- COMMISSIONS / CHARACTER SHEETS -->
          <div id="qa-commissions" class="qa-section">
            <div class="character-sheets-container">
              <!-- Pricing Panel -->
              <div class="pricing-panel">
                <div class="pricing-close-btn" onclick="togglePricingPanel()"></div>
                <div class="pricing-title">PRICING</div>
                <div class="pricing-category">
                  <h4>BUST (HEAD TO CHEST)</h4>
                  <div class="pricing-item"><span>SKETCH</span><span>$15</span></div>
                  <div class="pricing-item"><span>FLAT COLOR</span><span>$25</span></div>
                  <div class="pricing-item"><span>FULLY RENDERED</span><span>$40</span></div>
                </div>
                <div class="pricing-category">
                  <h4>HALF BODY (WAIST UP)</h4>
                  <div class="pricing-item"><span>SKETCH</span><span>$30</span></div>
                  <div class="pricing-item"><span>FLAT COLOR</span><span>$50</span></div>
                  <div class="pricing-item"><span>FULLY RENDERED</span><span>$80</span></div>
                </div>
                <div class="pricing-category">
                  <h4>THIGH UP (3/4 BODY)</h4>
                  <div class="pricing-item"><span>SKETCH</span><span>$40</span></div>
                  <div class="pricing-item"><span>FLAT COLOR</span><span>$65</span></div>
                  <div class="pricing-item"><span>FULLY RENDERED</span><span>$105</span></div>
                </div>
                <div class="pricing-category">
                  <h4>FULL BODY</h4>
                  <div class="pricing-item"><span>SKETCH</span><span>$45</span></div>
                  <div class="pricing-item"><span>FLAT COLOR</span><span>$80</span></div>
                  <div class="pricing-item"><span>FULLY RENDERED</span><span>$150</span></div>
                </div>
              </div>
              <!-- Left Side Panel with Pricing Button -->
              <div class="left-side-panel">
                <button class="pricing-tab-btn" onclick="togglePricingPanel()">PRICING</button>
              </div>
              <!-- Character Display -->
              <div class="character-display">
                <div class="character-title">CHARACTER SHEETS</div>
                <div class="character-image-container">
                  <img id="character-image" src="./character1_sketch.webp" alt="Character" class="character-image" onerror="this.src='./girl 1.webp'">
                  <div class="style-switcher">
                    <div class="style-circle active" onclick="switchCharacterStyle('sketch')" title="Sketch"></div>
                    <div class="style-circle" onclick="switchCharacterStyle('flat')" title="Flat Color"></div>
                    <div class="style-circle" onclick="switchCharacterStyle('rendered')" title="Fully Rendered"></div>
                  </div>
                </div>
              </div>
              <!-- Right Side Panel -->
              <div class="right-side-panel">
                <div class="style-switcher-mobile">
                  <div class="style-circle active" onclick="switchCharacterStyle('sketch')" title="Sketch"></div>
                  <div class="style-circle" onclick="switchCharacterStyle('flat')" title="Flat Color"></div>
                  <div class="style-circle" onclick="switchCharacterStyle('rendered')" title="Fully Rendered"></div>
                </div>
              </div>
              <div class="character-buttons">
                <button class="char-btn active" onclick="switchCharacter(1)">C1</button>
                <button class="char-btn" onclick="switchCharacter(2)">C2</button>
                <button class="char-btn" onclick="switchCharacter(3)">C3</button>
                <button class="char-btn" onclick="switchCharacter(4)">C4</button>
                <button class="char-btn" onclick="switchCharacter(5)">C5</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },
  contact: {
    content: "<h2>Contact</h2><p>Contact me at: your@email.com</p>"
  }
};

function showPage(pageKey) {
  // Show roadmap button on home, hide on other pages
  const roadmapBtn = document.getElementById('roadmapToggleBtn');
  if (roadmapBtn) roadmapBtn.style.display = pageKey === 'home' ? '' : 'none';

  // For Q&A page, open AI companion instead - don't open tab
  if(pageKey === "faq") {
    if (workCardsShowing) hideWorkCards();
    if (mangaCardsShowing) hideMangaCards();
    if (booksCardsShowing) hideBooksCards();
    openAICompanion();
    return;
  }

  // Books button acts as a floating shelf toggle, not a middle-tab page
  if (pageKey === "books") {
    const booksBtn = document.querySelector('.nav-btn[data-page="books"]');
    if (workCardsShowing) hideWorkCards();
    if (mangaCardsShowing) hideMangaCards();
    if (booksCardsShowing) {
      hideBooksCards(booksBtn || undefined);
    } else {
      closeBookReader();
      if (booksBtn) showBooksCards(booksBtn);
    }
    return;
  }

  // Manga button acts as a floating-card toggle, not a page
  if (pageKey === "manga") {
    const mangaBtn = document.querySelector('.nav-btn[data-page="manga"]');
    if (workCardsShowing) {
      hideWorkCards();
    }
    if (mangaCardsShowing) {
      hideMangaCards(mangaBtn || undefined);
    } else if (mangaBtn) {
      showMangaCards(mangaBtn);
    }
    return;
  }

  const page = pages[pageKey];
  if (!page) return;

  /* Close floating work/manga/books cards when opening a middle-tab page so covers cannot stick on screen */
  if (pageKey !== "home") {
    if (workCardsShowing) hideWorkCards();
    if (mangaCardsShowing) hideMangaCards();
    if (booksCardsShowing) hideBooksCards();
  }
  
  // Remove wiki-active class when switching away from wiki
  tabContent.classList.remove('wiki-active');
  
  // Save last opened page to localStorage
  lastOpenedPage = pageKey;
  localStorage.setItem('lastOpenedPage', pageKey);
  
  if(pageKey === "home"){
    // FORCE home page to NEVER be fullscreen
    const middleTab = document.querySelector('.middle-tab');
    middleTab.classList.remove('maximized');
    document.body.classList.remove('window-maximized');
    
    // Hide the entire tab window
    middleTab.style.display = 'none';
    
    // Create title at center
    const homeContent = document.createElement('div');
    homeContent.id = 'homeContentOutside';
    homeContent.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 95vw;
      max-height: 95vh;
      overflow: hidden;
      padding: 20px;
      box-sizing: border-box;
    `;
    
    let html = `<h1 class="middle-tab-title" style="margin-bottom: 1px;">${page.title}</h1>`;
    html += `<p class="middle-tab-subtitle" style="margin-bottom: 40px; color: white !important;">${page.subtitle}</p>`;
    
    homeContent.innerHTML = html;
    document.body.appendChild(homeContent);
    
    // Create buttons container at bottom for desktop
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'navButtonsContainer';
    buttonsContainer.className = 'nav-buttons';
    
    let buttonsHtml = '';
    page.buttons.forEach(btn => {
      const btnClass = btn.class ? ` ${btn.class}` : '';
      buttonsHtml += `<div class="nav-btn${btnClass}" data-page="${btn.page}"><div class="nav-btn-icon">${btn.icon}</div>${btn.label}</div>`;
    });
    buttonsContainer.innerHTML = buttonsHtml;
    document.body.appendChild(buttonsContainer);
    
    // Re-attach event listeners to new buttons
    attachNavListeners();
    
    tabContent.classList.remove('popup-enter');
  } else {
    // Remove the outside home content and buttons when switching to other pages
    const outsideHomeContent = document.getElementById('homeContentOutside');
    if (outsideHomeContent) {
      outsideHomeContent.remove();
    }
    const navButtonsContainer = document.getElementById('navButtonsContainer');
    if (navButtonsContainer) {
      navButtonsContainer.remove();
    }
    
    // Show the tab window again for other pages
    const middleTab = document.querySelector('.middle-tab');
    if (middleTab) {
      middleTab.style.display = 'flex';
      const tabHeader = document.querySelector('.middle-tab-header');
      if (tabHeader) {
        tabHeader.style.display = 'none';
      }
    }
    
    tabContent.innerHTML = page.content;
    
    if(pageKey === "wiki") {
      // For wiki page - fade in with blur backdrop
      middleTab.style.width = '100vw';
      middleTab.style.height = '100vh';
      middleTab.style.left = '0';
      middleTab.style.top = '0';
      middleTab.style.transform = 'scale(0.9)';
      middleTab.style.opacity = '0';
      middleTab.style.background = 'transparent';
      middleTab.style.boxShadow = 'none';
      tabContent.style.padding = '0';
      tabContent.style.overflow = 'hidden';
      
      // Animate in
      requestAnimationFrame(() => {
        middleTab.style.transition = 'all 0.4s ease-out';
        middleTab.style.transform = 'scale(1)';
        middleTab.style.opacity = '1';
      });
    } else if(pageKey === "manga") {
      // Manga page - transparent background, just the cover
      middleTab.style.background = 'transparent';
      middleTab.style.boxShadow = 'none';
      middleTab.style.width = '500px';
      middleTab.style.height = 'auto';
      middleTab.style.left = 'calc(50% - 250px)';
      middleTab.style.top = 'calc(50% - 250px)';
      middleTab.style.transform = 'scale(1)';
      middleTab.style.opacity = '1';
      tabContent.style.padding = '0';
      tabContent.style.overflow = 'hidden';
    } else {
      middleTab.style.background = '#ffffff';
      middleTab.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
      middleTab.style.width = '700px';
      middleTab.style.height = '200px';
      middleTab.style.left = 'calc(50% - 350px)';
      middleTab.style.top = 'calc(50% - 100px)';
      middleTab.style.transform = 'none';
      middleTab.style.opacity = '1';
      tabContent.style.padding = '40px';
      tabContent.style.overflowY = 'auto';
    }
    
  }
  attachNavListeners();
}

// --- Nav buttons ---
// Track last opened page for session restore
let lastOpenedPage = 'home';

// Track if work cards are currently showing
let workCardsShowing = false;
let workCardElements = [];
let workCardsShowTimeoutId = null;
let lastWorkCardsButton = null;
let mangaCardsShowing = false;
let mangaCardElements = [];
let mangaCardsShowTimeoutId = null;
let lastMangaCardsButton = null;
let mangaShowingConcept = false;
let booksCardsShowing = false;
let booksCardElements = [];
let lastBooksCardsButton = null;
let bookReaderPages = [];
const bookPagesCache = new Map();
const bookFileBufferCache = new Map();
let docxPreviewAssetsPromise = null;

let cardsResizeRafId = null;
window.addEventListener('resize', () => {
  if (cardsResizeRafId !== null) cancelAnimationFrame(cardsResizeRafId);
  cardsResizeRafId = requestAnimationFrame(() => {
    cardsResizeRafId = null;
    if (workCardsShowing && lastWorkCardsButton) showWorkCards(lastWorkCardsButton);
    if (mangaCardsShowing && lastMangaCardsButton) showMangaCards(lastMangaCardsButton);
    if (booksCardsShowing && lastBooksCardsButton) showBooksCards(lastBooksCardsButton);
  });
});

function showWorkCards(button) {
  return window.__showWorkCardsImpl(button);
}

function hideWorkCards(button) {
  return window.__hideWorkCardsImpl(button);
}

// Add glow beat animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes mangaGlowBeat {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    25% { transform: translate(-50%, -50%) scale(1.05); }
    50% { transform: translate(-50%, -50%) scale(1); }
    75% { transform: translate(-50%, -50%) scale(1.05); }
  }
  
  .manga-icon {
    display: inline-block;
    font-size: 50px;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  
  .manga-btn-spin {
    animation: mangaSpin 0.3s ease-in-out;
  }
  
  @keyframes mangaSpin {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(90deg) scale(1.1); }
    50% { transform: rotate(180deg) scale(1); }
    75% { transform: rotate(270deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }
  
  .manga-label {
    font-family: 'Press Start 2P', cursive;
    font-size: 14px;
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    margin-top: 8px;
  }
  
  .work-btn-animate {
    animation: workGlow 0.5s ease-in-out;
  }
  
  @keyframes workGlow {
    0%, 100% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); }
    25% { transform: translate(-50%, -50%) scale(1.05); filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
    50% { transform: translate(-50%, -50%) scale(1); filter: brightness(1); }
    75% { transform: translate(-50%, -50%) scale(1.05); filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
  }
  
  @keyframes workShake {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    10% { transform: translateX(-5px) rotate(-5deg); }
    20% { transform: translateX(5px) rotate(5deg); }
    30% { transform: translateX(-5px) rotate(-5deg); }
    40% { transform: translateX(5px) rotate(5deg); }
    50% { transform: translateX(-3px) rotate(-3deg); }
    60% { transform: translateX(3px) rotate(3deg); }
    70% { transform: translateX(-2px) rotate(-2deg); }
    80% { transform: translateX(2px) rotate(2deg); }
    90% { transform: translateX(-1px) rotate(-1deg); }
  }
  
  .work-btn-shake {
    display: inline-block;
  }
  
  /* Black Fog Effect */
  .black-fog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 100%);
    z-index: 5000;
    opacity: 0;
    pointer-events: none;
    animation: fogExpand 2s ease-out forwards;
  }
  
  @keyframes fogExpand {
    0% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  /* Screen Flicker Effect */
  .screen-flicker {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    z-index: 5001;
    opacity: 0;
    pointer-events: none;
    animation: flicker 0.5s ease-in-out;
  }
  
  @keyframes flicker {
    0%, 100% { opacity: 0; }
    10% { opacity: 0.8; }
    20% { opacity: 0; }
    30% { opacity: 0.6; }
    40% { opacity: 0; }
    50% { opacity: 0.9; }
    60% { opacity: 0; }
    70% { opacity: 0.4; }
    80% { opacity: 0; }
    90% { opacity: 0.7; }
  }
  
  /* Diary Book Styles - 3D Animated */
  .diary-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.9);
    z-index: 5002;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1500px;
    opacity: 1;
  }
  
  /* 3D Book Container */
  .diary-book-3d {
    width: 500px;
    height: 700px;
    position: relative;
    transform-style: preserve-3d;
    opacity: 0;
    transform: scale(0.5);
  }

  /* Animation: Appear (fade-in + scale-up) */
  .diary-book-3d.animating {
    animation: diaryAppear 0.6s ease-out forwards;
  }
  
  @keyframes diaryAppear {
    0% { opacity: 0; transform: scale(0.5); }
    100% { opacity: 1; transform: scale(1) rotateY(-30deg); }
  }
  
  /* Phase 2: Rotate to show front cover */
  .diary-book-3d.phase-rotate {
    animation: diaryRotateToCover 0.8s ease-in-out forwards;
    opacity: 1;
  }
  
  @keyframes diaryRotateToCover {
    0% { opacity: 1; transform: scale(1) rotateY(-30deg); }
    100% { opacity: 1; transform: scale(1) rotateY(0deg); }
  }
  
  /* Phase 3: Open the book - cover just fades without rotation */
  .diary-book-3d.phase-open {
    animation: diaryOpenBook 1s ease-in-out forwards;
    opacity: 1;
  }
  
  .diary-book-3d.phase-open .diary-front-cover {
    animation: coverFadeOut 1s ease-out forwards;
  }
  
  @keyframes diaryOpenBook {
    0% { opacity: 1; transform: scale(1) rotateY(0deg); }
    50% { opacity: 1; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  /* Phase 4: Reading mode - cover fades, page faces user */
  .diary-book-3d.phase-reading .diary-front-cover {
    animation: coverFadeOut 0.5s ease-out forwards;
  }
  
  @keyframes coverFadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; pointer-events: none; }
  }
  
  .diary-book-3d.phase-reading {
    transform: rotateY(0deg) !important;
    opacity: 1;
    transition: transform 0.6s ease-in-out;
    overflow: visible;
    transform-style: flat;
  }
  
  /* Book Parts */
  .diary-front-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
    border-radius: 5px 15px 15px 5px;
    box-shadow: 
      0 10px 30px rgba(0,0,0,0.5),
      inset 2px 0 10px rgba(0,0,0,0.3),
      inset -2px 0 10px rgba(255,255,255,0.1);
    transform-origin: 0% center;
    transform: translateZ(15px);
    z-index: 3;
    backface-visibility: hidden;
  }
  
  /* Inside cover (backface) - completely blank */
  .diary-front-cover::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f5dc 0%, #faf8e8 50%, #f5f5dc 100%);
    border-radius: 5px 15px 15px 5px;
    transform: rotateY(180deg);
    backface-visibility: hidden;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
  }
  
  /* Cover texture/decoration */
  .diary-front-cover::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    border: 2px solid rgba(255, 215, 0, 0.4);
    border-radius: 3px;
    pointer-events: none;
  }
  
  .diary-cover-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Caveat', cursive;
    font-size: 48px;
    font-weight: 700;
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    text-align: center;
    line-height: 1.2;
  }
  
  /* Spine */
  .diary-spine-3d {
    position: absolute;
    width: 30px;
    height: 100%;
    left: -15px;
    background: linear-gradient(90deg, #5c3a1e 0%, #8B4513 50%, #654321 100%);
    border-radius: 3px 0 0 3px;
    transform: rotateY(-90deg);
    transform-origin: right center;
    z-index: 2;
  }
  
  .diary-spine-text-3d {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    color: #ffd700;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    letter-spacing: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  /* Back cover */
  .diary-back-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #654321 0%, #8B4513 100%);
    border-radius: 5px 15px 15px 5px;
    transform: translateZ(-15px);
    z-index: 1;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  
  /* Pages container */
  .diary-pages-container {
    position: absolute;
    width: 95%;
    height: 96%;
    left: 2.5%;
    top: 2%;
    background: linear-gradient(90deg, #f5f5dc 0%, #faf8e8 50%, #f5f5dc 100%);
    border-radius: 2px 10px 10px 2px;
    transform: translateZ(0px);
    z-index: 2;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
  }
  
  /* Individual pages for fan effect */
  .diary-page-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f5f5dc 0%, #faf8e8 50%, #f5f5dc 100%);
    border-radius: 2px 10px 10px 2px;
    transform-origin: left center;
    transition: transform 0.3s ease;
  }
  
  .diary-page-layer:nth-child(1) { transform: translateZ(1px); }
  .diary-page-layer:nth-child(2) { transform: translateZ(2px); }
  .diary-page-layer:nth-child(3) { transform: translateZ(3px); }
  .diary-page-layer:nth-child(4) { transform: translateZ(4px); }
  .diary-page-layer:nth-child(5) { transform: translateZ(5px); }
  
  /* Page fan animation during opening */
  .diary-book-3d.phase-open .diary-page-layer:nth-child(1) {
    animation: pageFan1 1s ease-in-out forwards;
  }
  .diary-book-3d.phase-open .diary-page-layer:nth-child(2) {
    animation: pageFan2 1s ease-in-out 0.1s forwards;
  }
  .diary-book-3d.phase-open .diary-page-layer:nth-child(3) {
    animation: pageFan3 1s ease-in-out 0.15s forwards;
  }
  .diary-book-3d.phase-open .diary-page-layer:nth-child(4) {
    animation: pageFan4 1s ease-in-out 0.2s forwards;
  }
  .diary-book-3d.phase-open .diary-page-layer:nth-child(5) {
    animation: pageFan5 1s ease-in-out 0.25s forwards;
  }
  
  @keyframes pageFan1 {
    0%, 100% { transform: translateZ(1px) rotateY(0deg); }
    50% { transform: translateZ(1px) rotateY(-5deg); }
  }
  @keyframes pageFan2 {
    0%, 100% { transform: translateZ(2px) rotateY(0deg); }
    50% { transform: translateZ(2px) rotateY(-8deg); }
  }
  @keyframes pageFan3 {
    0%, 100% { transform: translateZ(3px) rotateY(0deg); }
    50% { transform: translateZ(3px) rotateY(-10deg); }
  }
  @keyframes pageFan4 {
    0%, 100% { transform: translateZ(4px) rotateY(0deg); }
    50% { transform: translateZ(4px) rotateY(-6deg); }
  }
  @keyframes pageFan5 {
    0%, 100% { transform: translateZ(5px) rotateY(0deg); }
    50% { transform: translateZ(5px) rotateY(-4deg); }
  }
  
  /* Content page (visible in reading mode) */
  .diary-content-page {
    position: absolute;
    width: 79%;
    height: 85%;
    left: 5%;
    top: 3%;
    background: #faf8e8;
    border-radius: 2px 8px 8px 2px;
    z-index: 10;
    padding: 25px;
    padding-bottom: 40px;
    padding-right: 15px;
    overflow-y: scroll;
    overflow-x: hidden;
    font-family: 'Georgia', serif;
    font-size: 12px;
    line-height: 1.8;
    color: #333;
    box-shadow: inset 5px 0 15px rgba(0,0,0,0.05);
    opacity: 0;
    box-sizing: border-box;
    scroll-behavior: smooth;
    pointer-events: auto;
    -webkit-overflow-scrolling: touch;
    display: block;
  }
  
  .diary-book-3d.phase-reading .diary-content-page {
    animation: contentPageAppear 0.8s ease-out 0.3s forwards;
    transform: none !important;
  }

  @keyframes contentPageAppear {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  /* Close Animation Sequence */
  .diary-book-3d.closing {
    animation: diaryCloseSequence 1.5s ease-in-out forwards;
  }
  
  .diary-book-3d.closing .diary-front-cover {
    animation: coverReappear 0.5s ease-out forwards;
  }
  
  @keyframes coverReappear {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes diaryCloseSequence {
    0% { transform: scale(1) rotateY(0deg); opacity: 1; }
    30% { transform: scale(1.02) rotateY(-25deg); }
    60% { transform: scale(1) rotateY(0deg); }
    80% { transform: scale(0.9) rotateY(15deg); opacity: 0.7; }
    100% { transform: scale(0.5) rotateY(30deg); opacity: 0; }
  }
  
  /* Legacy styles for compatibility */
  .diary-book {
    display: none;
  }
  
  .diary-spine {
    display: none;
  }
  
  .diary-pages {
    display: none;
  }
  
  /* Close button */
  .diary-close-btn-3d {
    position: absolute;
    top: -40px;
    right: -40px;
    background: #8B4513;
    color: #ffd700;
    border: 2px solid #ffd700;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 100;
    opacity: 0;
  }
  
  .diary-book-3d.phase-reading .diary-close-btn-3d {
    animation: closeBtnAppear 0.5s ease-out 0.8s forwards;
  }
  
  @keyframes closeBtnAppear {
    0% { opacity: 0; transform: scale(0.5); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  .diary-close-btn-3d:hover {
    background: #ffd700;
    color: #8B4513;
    transform: scale(1.1);
  }
  
  /* Page indicator and navigation */
  .diary-page-indicator-3d {
    position: absolute;
    bottom: -35px;
    right: 0;
    font-family: 'Press Start 2P', cursive;
    font-size: 6px;
    color: #000;
    text-shadow: none;
    opacity: 0;
  }
  
  .diary-book-3d.phase-reading .diary-page-indicator-3d {
    animation: navAppear 0.5s ease-out 0.6s forwards;
  }
  
  .diary-navigation-3d {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 15px;
    opacity: 0;
  }
  
  .diary-book-3d.phase-reading .diary-navigation-3d {
    animation: navAppear 0.5s ease-out 0.7s forwards;
  }
  
  @keyframes navAppear {
    0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
    100% { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  
  .diary-nav-btn-3d {
    background: #8B4513;
    color: #ffd700;
    border: 2px solid #ffd700;
    padding: 6px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Press Start 2P', cursive;
    font-size: 8px;
    transition: all 0.3s ease;
  }
  
  .diary-nav-btn-3d:hover {
    background: #ffd700;
    color: #8B4513;
  }
  
  .diary-nav-btn-3d:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Diary content styles */
  .diary-content-3d {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 5px;
    scrollbar-width: thin;
    scrollbar-color: #8B4513 #e8e8d0;
  }

  .diary-content-3d::-webkit-scrollbar {
    width: 10px;
  }

  .diary-content-3d::-webkit-scrollbar-track {
    background: #e8e8d0;
    border-radius: 5px;
  }

  .diary-content-3d::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
    border-radius: 5px;
  }

  .diary-content-3d::-webkit-scrollbar-thumb:hover {
    background: #A0522D;
  }

  .diary-content-3d h1, .diary-content-3d h2, .diary-content-3d h3 {
    font-family: 'Press Start 2P', cursive;
    color: #8B4513;
    margin-top: 20px;
    margin-bottom: 15px;
    font-size: 12px;
  }
  
  .diary-content-3d h2 {
    font-size: 10px;
  }
  
  .diary-content-3d h3 {
    font-size: 9px;
  }
  
  .diary-content-3d p {
    margin-bottom: 12px;
    text-align: justify;
  }
  
  .diary-content-3d img {
    max-width: 100%;
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    margin: 10px 0;
  }
  
  /* Content scrollbar */
  .diary-content-page::-webkit-scrollbar {
    width: 10px;
  }

  .diary-content-page::-webkit-scrollbar-track {
    background: #e8e8d0;
    border-radius: 5px;
    border: 1px solid #d0d0b0;
  }

  .diary-content-page::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
    border-radius: 5px;
    border: 1px solid #6B3510;
  }

  .diary-content-page::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #A0522D 0%, #B8630F 50%, #A0522D 100%);
  }

  /* Firefox scrollbar */
  .diary-content-page {
    scrollbar-width: thin;
    scrollbar-color: #8B4513 #e8e8d0;
  }

  /* Responsive diary sizing for mobile */
  @media (max-width: 768px) {
    .diary-book-3d {
      width: 350px;
      height: 500px;
    }
    .diary-cover-title {
      font-size: 36px;
    }
    .diary-spine-text-3d {
      font-size: 8px;
    }
  }
  
  @media (max-width: 480px) {
    .diary-book-3d {
      width: 280px;
      height: 400px;
    }
    .diary-cover-title {
      font-size: 28px;
    }
    .diary-spine-text-3d {
      font-size: 7px;
    }
    .diary-content-page {
      padding: 15px;
      font-size: 10px;
    }
    .diary-content-3d h1 {
      font-size: 10px;
    }
    .diary-content-3d h2 {
      font-size: 9px;
    }
    .diary-close-btn-3d {
      top: -30px;
      right: -30px;
      width: 35px;
      height: 35px;
      font-size: 16px;
    }
  }
  
  /* Black Fog Effect */
  .black-fog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 100%);
    z-index: 5000;
    opacity: 0;
    pointer-events: none;
    animation: fogExpand 2s ease-out forwards;
  }
  
  @keyframes fogExpand {
    0% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  /* Screen Flicker Effect */
  .screen-flicker {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    z-index: 5001;
    opacity: 0;
    pointer-events: none;
    animation: flicker 0.5s ease-in-out;
  }
  
  @keyframes flicker {
    0%, 100% { opacity: 0; }
    10% { opacity: 0.8; }
    20% { opacity: 0; }
    30% { opacity: 0.6; }
    40% { opacity: 0; }
    50% { opacity: 0.9; }
    60% { opacity: 0; }
    70% { opacity: 0.4; }
    80% { opacity: 0; }
    90% { opacity: 0.7; }
  }
`;

document.head.appendChild(style);

function attachNavListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = function() {
      playSound('tabClick', 0);
      const pageKey = this.dataset.page;
      
      // Handle work button specially
      if (pageKey === "work") {
        // Only animate the icon, not the whole button
        const workIcon = this.querySelector('.work-btn-shake, img');
        if (workIcon) {
          workIcon.classList.remove('work-btn-animate');
          void workIcon.offsetWidth;
          workIcon.classList.add('work-btn-animate');
        }
        
        // If cards are showing, hide them
        if (workCardsShowing) {
          hideWorkCards(this);
          return;
        }

        // Opening work: close manga / books popups so only one shelf is open
        if (mangaCardsShowing) hideMangaCards();
        if (booksCardsShowing) hideBooksCards();
        
        // Show cards after animation
        if (workCardsShowTimeoutId !== null) {
          clearTimeout(workCardsShowTimeoutId);
          workCardsShowTimeoutId = null;
        }
        workCardsShowTimeoutId = setTimeout(() => {
          workCardsShowTimeoutId = null;
          showWorkCards(this);
        }, 500);
        return;
      }
      
      // Handle manga button with normal page flow
      if (pageKey === "manga") {
        const mangaIcon = this.querySelector('img');
        if (mangaIcon) {
          mangaIcon.classList.remove('manga-btn-spin');
          void mangaIcon.offsetWidth;
          mangaIcon.classList.add('manga-btn-spin');
        }
        if (mangaCardsShowing) {
          hideMangaCards(this);
          return;
        }
        if (workCardsShowing) hideWorkCards();
        if (booksCardsShowing) hideBooksCards();
        if (mangaCardsShowTimeoutId !== null) {
          clearTimeout(mangaCardsShowTimeoutId);
          mangaCardsShowTimeoutId = null;
        }
        mangaCardsShowTimeoutId = setTimeout(() => {
          mangaCardsShowTimeoutId = null;
          showMangaCards(this);
        }, 350);
        return;
      }
      
      // Handle books button specially
      if (pageKey === "books") {
        // Hide work cards if showing
        if (workCardsShowing) {
          hideWorkCards();
        }
        if (mangaCardsShowing) {
          hideMangaCards();
        }
        if (booksCardsShowing) {
          hideBooksCards(this);
          return;
        }
        setTimeout(() => {
          showBooksCards(this);
        }, 350);
        return;
      }
      
      // For other buttons, hide work cards if showing
      if (workCardsShowing) {
        hideWorkCards();
      }
      if (mangaCardsShowing) {
        hideMangaCards();
      }
      if (booksCardsShowing) {
        hideBooksCards();
      }
      
      proceedWithPageOpen(pageKey);
    };
  });
}

// Artwork data
const artworkData = [
  {src: "./3.1 (2).webp", title: "Artwork 1"},
  {src: "./marry.webp", title: "Artwork 2"},
  {src: "./angelist.webp", title: "Artwork 3"},
  {src: "./BFF forever.webp", title: "Artwork 4"},
  {src: "./dancing in the rain of blood.webp", title: "Artwork 5"},
  {src: "./milestone with hornet.webp", title: "Artwork 6"},
  {src: "./sketch of ya shit - Copy - Copy - Copy (15) - Copy - Copy.webp", title: "Artwork 7"},
  {src: "./the paler king.webp", title: "Artwork 8"},
  {src: "./SHOWERTHOUGHTS2.webp", title: "Artwork 9"},
  {src: "./490114687_9595337863888220_562112844725561463_n.webp", title: "Artwork 10"},
  {src: "./work-artwork-11.webp", title: "Artwork 11"},
  {src: "./work-artwork-12.webp", title: "Artwork 12"},
  {src: "./work-artwork-13.webp", title: "Artwork 13"}
];

// Shared image pool - each image stored only once
const mangaImagePool = {
  // Main images - no duplicates!
  showerThoughts: "./SHOWERTHOUGHTS.webp",
  witchesEnd: "./manga-card-2.webp",  // Using webp version
  lastIllsins: "./manga-card-3.webp",  // Using webp version
  // Last 3 Sins images from folder 1
  last3sisns1: "./1/1.webp",
  last3sisns2: "./1/2.webp",
  last3sisns3: "./1/3.webp",
  last3sisns4: "./1/4.webp",
  last3sisns5: "./1/5.webp",
  last3sisns6: "./1/6.webp",
  // Last 3 Sins images from folder 1/one/
  last3sisnsOne1: "./1/one/1.webp",
  last3sisnsOne2: "./1/one/2.webp",
  last3sisnsOne3: "./1/one/3.webp",
  last3sisnsOne3_1: "./1/one/3.1.webp",
  last3sisnsOne4: "./1/one/4.webp",
  last3sisnsOne5: "./1/one/5.webp",
  last3sisnsOne6: "./1/one/6.webp",
  last3sisnsOne7: "./1/one/7.webp",
  last3sisnsOne8: "./1/one/8.webp",
  last3sisnsOne9: "./1/one/9.webp",
  // Last 3 Sins illustrations from folder 1/illustration folder
  last3sisnsIllust1: "./1/illustration folder/3.1 - Copy.webp",
  last3sisnsIllust2: "./1/illustration folder/5.2.webp",
  last3sisnsIllust3: "./1/illustration folder/5.3.webp",
  last3sisnsIllust4: "./1/illustration folder/6.1.webp",
  last3sisnsIllust5: "./1/illustration folder/6.2.webp",
  last3sisnsIllust6: "./1/illustration folder/6.3111.webp",
  last3sisnsIllust7: "./1/illustration folder/HFhGar0bQAETqpE.webp",
  // Witch's End images from folder 2
  witchesEnd1: "./2/manga (1)_003.webp",
  witchesEnd2: "./2/manga (1)_004.webp",
  witchesEnd3: "./2/manga (1)_005.webp",
  witchesEnd4: "./2/manga (1)_006.webp",
  witchesEnd5: "./2/manga (1)_007.webp",
  witchesEnd6: "./2/manga (1)_008.webp",
  witchesEnd7: "./2/manga (1)_009.webp",
  witchesEnd8: "./2/manga (1)_010.webp",
  witchesEnd9: "./2/manga (1)_011.webp",
  // Witch's End illustrations from folder 2/illustrations
  witchesEndIllust1: "./2/illustrations/Untitled6_20260404160901.webp",
  witchesEndIllust2: "./2/illustrations/image.webp",
  witchesEndIllust3: "./2/illustrations/manga (1).webp",
  witchesEndIllust4: "./2/illustrations/manga (1)_001.webp",
  witchesEndIllust5: "./2/illustrations/manga (1)_002.webp",
  witchesEndIllust6: "./2/illustrations/manga (1)_003.webp",
  witchesEndIllust7: "./2/illustrations/manga (1)_004.webp",
  witchesEndIllust8: "./2/illustrations/manga (1)_005.webp",
  witchesEndIllust9: "./2/illustrations/manga (1)_006.webp",
  witchesEndIllust10: "./2/illustrations/manga (1)_007.webp",
  witchesEndIllust11: "./2/illustrations/manga (1)_012.webp",
  witchesEndIllust12: "./2/illustrations/manga (1)_013.webp",
  witchesEndIllust13: "./2/illustrations/manga (1)_014.webp",
  witchesEndIllust14: "./2/illustrations/manga (1)_015.webp",
  witchesEndIllust15: "./2/illustrations/manga (1)_017.webp",
  witchesEndIllust16: "./2/illustrations/manga (1)_018.webp",
  witchesEndIllust17: "./2/illustrations/manga (1)_019.webp",
  witchesEndIllust18: "./2/illustrations/manga (1)_020.webp",
  witchesEndIllust19: "./2/illustrations/manga (1)_021.webp",
  witchesEndIllust20: "./2/illustrations/manga (1)_022.webp",
  witchesEndIllust21: "./2/illustrations/manga (1)_023.webp",
  witchesEndIllust22: "./2/illustrations/manga (1)_025.webp",
  witchesEndIllust23: "./2/illustrations/manga (1)_026.webp",
  witchesEndIllust24: "./2/illustrations/manga (1)_027.webp",
  witchesEndIllust25: "./2/illustrations/manga (1)_028.webp",
  witchesEndIllust26: "./2/illustrations/manga (1)_030.webp",
  // Concept manga 1
  concept1Cover: "./3/0.webp",
  concept1Page1: "./3/1.webp",
  concept1Page2: "./3/2.webp",
  concept1Page3: "./3/3.webp",
  // Concept manga 2
  concept2Cover: "./016826d6-1d68-409f-b770-a8ea4a3a289d.webp",
  concept2Page1: "./3/4.webp",
  concept2Page2: "./3/5.webp",
  concept2Page3: "./3/6.webp",
  concept2Page4: "./3/7.webp"
};

const mangaGalleryData = [
  {
    coverKey: "witchesEnd",
    src: mangaImagePool.witchesEnd,
    title: "Witch's End",
    synopsis: "In a world where magic fades, one witch must face her final days. A tale of legacy, memory, and the end of an era.",
    pageKeys: ["witchesEnd1", "witchesEnd2", "witchesEnd3", "witchesEnd4", "witchesEnd5", "witchesEnd6", "witchesEnd7", "witchesEnd8", "witchesEnd9"],
    illustrations: ["witchesEndIllust1", "witchesEndIllust2", "witchesEndIllust3", "witchesEndIllust4", "witchesEndIllust5", "witchesEndIllust6", "witchesEndIllust7", "witchesEndIllust8", "witchesEndIllust9", "witchesEndIllust10", "witchesEndIllust11", "witchesEndIllust12", "witchesEndIllust13", "witchesEndIllust14", "witchesEndIllust15", "witchesEndIllust16", "witchesEndIllust17", "witchesEndIllust18", "witchesEndIllust19", "witchesEndIllust20", "witchesEndIllust21", "witchesEndIllust22", "witchesEndIllust23", "witchesEndIllust24", "witchesEndIllust25", "witchesEndIllust26"]
  },
  {
    coverKey: "lastIllsins",
    src: mangaImagePool.lastIllsins,
    title: "Last IIIsins",
    synopsis: "Three sins, three stories, one interconnected fate. Explore the darker corners of human nature through this gripping narrative.",
    sections: [
      {
        name: "Section 1",
        pageKeys: ["last3sisns1", "last3sisns2", "last3sisns3", "last3sisns4", "last3sisns5", "last3sisns6"]
      },
      {
        name: "Section 2",
        pageKeys: ["last3sisnsOne1", "last3sisnsOne2", "last3sisnsOne3", "last3sisnsOne3_1", "last3sisnsOne4", "last3sisnsOne5", "last3sisnsOne6", "last3sisnsOne7", "last3sisnsOne8", "last3sisnsOne9"]
      }
    ],
    illustrations: ["last3sisnsIllust1", "last3sisnsIllust2", "last3sisnsIllust3", "last3sisnsIllust4", "last3sisnsIllust5", "last3sisnsIllust6", "last3sisnsIllust7"]
  },
  {
    coverKey: "showerThoughts",
    src: mangaImagePool.showerThoughts,
    title: "Shower Thoughts",
    synopsis: "Coming soon...",
    comingSoon: true,
    pageKeys: []
  }
];

const conceptMangaGalleryData = [
  {
    coverKey: "concept1",
    src: mangaImagePool.concept1Cover,
    title: "Concept Manga 1",
    synopsis: "A concept manga exploring new ideas and worlds.",
    pageKeys: ["concept1Page1", "concept1Page2", "concept1Page3"]
  },
  {
    coverKey: "concept2",
    src: mangaImagePool.concept2Cover,
    title: "Concept Manga 2",
    synopsis: "Another concept manga with its own unique story.",
    pageKeys: ["concept2Page1", "concept2Page2", "concept2Page3", "concept2Page4"]
  }
];

// Helper function to get actual pages array from keys
function getMangaPages(manga, sectionIndex = 0) {
  if (manga.sections && manga.sections[sectionIndex]) {
    return manga.sections[sectionIndex].pageKeys.map(key => mangaImagePool[key]).filter(Boolean);
  }
  if (!manga.pageKeys) return [];
  return manga.pageKeys.map(key => mangaImagePool[key]).filter(Boolean);
}

// Get all pages from all sections for grid view
function getAllMangaPages(manga) {
  if (manga.sections) {
    return manga.sections.flatMap(section => 
      section.pageKeys.map(key => mangaImagePool[key]).filter(Boolean)
    );
  }
  return getMangaPages(manga);
}

// Preload images for instant display when cards open
function preloadImages(imageList) {
  imageList.forEach(item => {
    if (item && item.src) {
      const img = new Image();
      img.src = item.src;
    }
  });
}

// Preload all manga images (covers, pages, illustrations) from image pool keys
function preloadMangaImages() {
  mangaGalleryData.forEach(manga => {
    if (manga.src) {
      const img = new Image();
      img.src = manga.src;
    }
    if (manga.pageKeys) {
      manga.pageKeys.forEach(key => {
        if (mangaImagePool[key]) {
          const img = new Image();
          img.src = mangaImagePool[key];
        }
      });
    }
    if (manga.sections) {
      manga.sections.forEach(section => {
        if (section.pageKeys) {
          section.pageKeys.forEach(key => {
            if (mangaImagePool[key]) {
              const img = new Image();
              img.src = mangaImagePool[key];
            }
          });
        }
      });
    }
    if (manga.illustrations) {
      manga.illustrations.forEach(key => {
        if (mangaImagePool[key]) {
          const img = new Image();
          img.src = mangaImagePool[key];
        }
      });
    }
  });
  // Also preload concept manga images
  conceptMangaGalleryData.forEach(manga => {
    if (manga.src) {
      const img = new Image();
      img.src = manga.src;
    }
    if (manga.pageKeys) {
      manga.pageKeys.forEach(key => {
        if (mangaImagePool[key]) {
          const img = new Image();
          img.src = mangaImagePool[key];
        }
      });
    }
  });
}

// Preload CSS background images and other critical UI assets
function preloadCriticalAssets() {
  const criticalImages = [
    './background-back.webp',
    './shine-1.webp',
    './FORGROUND.webp',
    './profile website.webp',
    './roadmap.webp',
    './manga-card-2.webp',
    './manga-card-3.webp',
    './SHOWERTHOUGHTS.webp',
    './folder-icon.webp',
    './CA.webp',
    './girl 1.webp',
    './wiki-logog.webp',
    './3/0.webp',
    './016826d6-1d68-409f-b770-a8ea4a3a289d.webp'
  ];
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Preload all images as early as possible
function runAllPreloads() {
  preloadCriticalAssets();
  preloadMangaImages();
  preloadImages(artworkData);
}

// Start preloading on DOMContentLoaded for maximum speed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllPreloads);
} else {
  runAllPreloads();
}

const booksData = [
  {
    id: "empire-age-magic",
    title: "A History of the Empire and the Age of Magic",
    cover: "./manga-card-2.webp",
    sourceFile: "./A History of the Empire and the Age of Magic.docx",
    sourceType: "docx"
  },
  {
    id: "valerian-empire",
    title: "The Valerian Empire: Order, Control, and Collapse",
    cover: "./manga-card-3.webp",
    sourceFile: "./THE VALERIAN EMPIRE ORDER, CONTROL, AND COLLAPSE.docx",
    sourceType: "docx"
  }
];

function optimizeImageElement(img) {
  if (!img || img.dataset.optimized === '1') return;
  img.dataset.optimized = '1';
  if (!img.loading) img.loading = 'lazy';
  img.decoding = 'async';
  if (!img.fetchPriority || img.fetchPriority === 'auto') {
    img.fetchPriority = 'low';
  }
}

function optimizeAllImagesIn(root) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('img').forEach(optimizeImageElement);
}

function setupImageLoadingOptimizations() {
  optimizeAllImagesIn(document);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === 'IMG') optimizeImageElement(node);
        optimizeAllImagesIn(node);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function warmBookAssets() {
  ensureDocxPreviewAssets().catch(() => {});
  booksData.forEach((book) => {
    if (!book || !book.sourceFile || book.sourceType !== 'docx') return;
    const key = book.sourceFile;
    if (bookFileBufferCache.has(key)) return;
    fetch(new URL(key, window.location.href))
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .then((buf) => {
        if (buf) bookFileBufferCache.set(key, buf);
      })
      .catch(() => {});
  });
}

function scheduleWarmBookAssets() {
  // Disabled: Only load book assets when user actually opens a book
  // This prevents unnecessary network requests on initial page load
}

window.__showWorkCardsImpl = function showWorkCards(button) {
  lastWorkCardsButton = button;
  workCardElements.forEach(el => el.remove());
  workCardElements = [];
  workCardsShowing = false;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Get button position to ensure we don't cover it
  const buttonRect = button.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonTopY = buttonRect.top;
  
  // Responsive card size based on screen
  let cardSize, spacingX, spacingY, cardsPerRow;
  const totalCards = artworkData.length;
  
  if (viewportWidth <= 480) {
    // Phone
    cardSize = 80;
    spacingX = 90;
    spacingY = 100;
    cardsPerRow = 3;
  } else if (viewportWidth <= 768) {
    // Tablet
    cardSize = 100;
    spacingX = 115;
    spacingY = 125;
    cardsPerRow = 4;
  } else {
    // PC
    cardSize = 120;
    spacingX = 140;
    spacingY = 150;
    cardsPerRow = 5;
  }
  
  // Calculate how many rows we need
  const totalRows = Math.ceil(totalCards / cardsPerRow);
  
  // Calculate the grid dimensions
  const gridWidth = Math.min(cardsPerRow, totalCards) * spacingX;
  const gridHeight = totalRows * spacingY;
  
  // Center the grid on screen
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  
  // Adjust position if it would cover the button
  const buttonBuffer = 100; // Space to keep around the button
  let gridTopY = centerY - (gridHeight / 2);
  let gridLeftX = centerX - (gridWidth / 2);
  
  // If grid would cover button, move it up
  if (gridTopY + gridHeight > buttonTopY - buttonBuffer && 
      gridLeftX < buttonCenterX + buttonBuffer && 
      gridLeftX + gridWidth > buttonCenterX - buttonBuffer) {
    gridTopY = buttonTopY - gridHeight - buttonBuffer;
  }
  
  // Ensure grid stays within viewport
  gridTopY = Math.max(20, Math.min(gridTopY, viewportHeight - gridHeight - 20));
  gridLeftX = Math.max(20, Math.min(gridLeftX, viewportWidth - gridWidth - 20));
  
  workCardElements = [];
  
  artworkData.forEach((artwork, index) => {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.dataset.src = artwork.src;
    card.dataset.title = artwork.title;
    card.dataset.index = index;
    
    // Calculate position in grid
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    
    // Calculate grid width for this row
    const cardsInThisRow = Math.min(cardsPerRow, totalCards - (row * cardsPerRow));
    const rowWidth = cardsInThisRow * spacingX;
    const rowStartX = gridLeftX + (gridWidth - rowWidth) / 2 + (spacingX / 2);
    
    const cardX = rowStartX + (col * spacingX);
    const cardY = gridTopY + (row * spacingY) + (spacingY / 2);
    
    // Start at button position for animation
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY_btn = buttonRect.top + buttonRect.height / 2;
    
    card.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY_btn}px;
      width: ${cardSize}px;
      height: ${cardSize}px;
      transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
      opacity: 0;
      z-index: 3000;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      pointer-events: auto;
      border: 2px solid transparent;
    `;
    
    // Add hover effects
    card.onmouseenter = function() {
      this.style.transform = this.style.transform.replace('scale(1)', 'scale(1.15)');
      this.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)';
      this.style.borderColor = 'rgba(255, 215, 0, 0.8)';
      this.style.zIndex = '3001';
    };
    
    card.onmouseleave = function() {
      const currentTransform = this.style.transform;
      this.style.transform = currentTransform.replace('scale(1.15)', 'scale(1)');
      this.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)';
      this.style.borderColor = 'transparent';
      this.style.zIndex = '3000';
    };
    
    const img = document.createElement('img');
    img.src = artwork.src;
    img.alt = artwork.title;
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    `;
    
    card.appendChild(img);
    
    // Click to fullscreen
    card.onclick = (e) => {
      e.stopPropagation();
      playSound('tabClick', 0);
      openWorkCardFullscreen(card, artwork.src, artwork.title);
    };
    
    document.body.appendChild(card);
    workCardElements.push(card);
    
    // Animate to position
    setTimeout(() => {
      const rotate = (index % 2 === 0 ? -3 : 3);
      card.style.left = `${cardX}px`;
      card.style.top = `${cardY}px`;
      card.style.transform = `translate(-50%, -50%) scale(1) rotate(${rotate}deg)`;
      card.style.opacity = '1';
    }, 50 + (index * 80));
  });
  
  workCardsShowing = true;
};

window.__hideWorkCardsImpl = function hideWorkCards(button) {
  if (workCardsShowTimeoutId !== null) {
    clearTimeout(workCardsShowTimeoutId);
    workCardsShowTimeoutId = null;
  }

  if (workCardElements.length === 0) {
    workCardsShowing = false;
    return;
  }
  
  let targetX, targetY;
  
  if (button) {
    const buttonRect = button.getBoundingClientRect();
    targetX = buttonRect.left + buttonRect.width / 2;
    targetY = buttonRect.top + buttonRect.height / 2;
  } else {
    // Default to center if no button
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
  }
  
  workCardElements.forEach((card, index) => {
    // Animate back to button
    setTimeout(() => {
      card.style.transform = `translate(-50%, -50%) scale(0.1) rotate(0deg)`;
      card.style.left = `${targetX}px`;
      card.style.top = `${targetY}px`;
      card.style.opacity = '0';
    }, index * 50);
    
    // Remove after animation
    setTimeout(() => {
      if (card.parentNode) {
        card.remove();
      }
    }, 600 + (index * 50));
  });
  
  workCardElements = [];
  workCardsShowing = false;
};

function showMangaCards(button) {
  lastMangaCardsButton = button;
  mangaCardElements.forEach(el => el.remove());
  mangaCardElements = [];
  mangaCardsShowing = false;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const buttonRect = button.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonTopY = buttonRect.top;

  let cardWidth, cardHeight, spacingX, spacingY, cardsPerRow;
  const activeData = mangaShowingConcept ? conceptMangaGalleryData : mangaGalleryData;
  const totalCards = activeData.length;

  if (viewportWidth <= 480) {
    cardWidth = 95;
    cardHeight = 150;
    spacingX = 120;
    spacingY = 175;
    cardsPerRow = 2;
  } else if (viewportWidth <= 768) {
    cardWidth = 125;
    cardHeight = 190;
    spacingX = 155;
    spacingY = 220;
    cardsPerRow = 3;
  } else {
    cardWidth = 145;
    cardHeight = 220;
    spacingX = 185;
    spacingY = 250;
    cardsPerRow = 3;
  }

  const totalRows = Math.ceil(totalCards / cardsPerRow);
  const gridWidth = Math.min(cardsPerRow, totalCards) * spacingX;
  const gridHeight = totalRows * spacingY;
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  const buttonBuffer = 110;
  let gridTopY = centerY - (gridHeight / 2);
  let gridLeftX = centerX - (gridWidth / 2);

  if (gridTopY + gridHeight > buttonTopY - buttonBuffer &&
      gridLeftX < buttonCenterX + buttonBuffer &&
      gridLeftX + gridWidth > buttonCenterX - buttonBuffer) {
    gridTopY = buttonTopY - gridHeight - buttonBuffer;
  }

  gridTopY = Math.max(20, Math.min(gridTopY, viewportHeight - gridHeight - 20));
  gridLeftX = Math.max(20, Math.min(gridLeftX, viewportWidth - gridWidth - 20));

  mangaCardElements = [];

  activeData.forEach((manga, index) => {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.dataset.src = manga.src;
    card.dataset.title = manga.title;

    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    const cardsInThisRow = Math.min(cardsPerRow, totalCards - (row * cardsPerRow));
    const rowWidth = cardsInThisRow * spacingX;
    const rowStartX = gridLeftX + (gridWidth - rowWidth) / 2 + (spacingX / 2);
    const cardX = rowStartX + (col * spacingX);
    const cardY = gridTopY + (row * spacingY) + (spacingY / 2);

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    card.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: ${cardWidth}px;
      height: ${cardHeight}px;
      transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
      opacity: 0;
      z-index: 3000;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      pointer-events: auto;
      border: 2px solid rgba(255, 215, 0, 0.3);
    `;

    card.onmouseenter = function() {
      this.style.transform = this.style.transform.replace('scale(1)', 'scale(1.1)');
      this.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)';
      this.style.borderColor = 'rgba(255, 215, 0, 0.9)';
      this.style.zIndex = '3001';
    };

    card.onmouseleave = function() {
      this.style.transform = this.style.transform.replace('scale(1.1)', 'scale(1)');
      this.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)';
      this.style.borderColor = 'rgba(255, 215, 0, 0.3)';
      this.style.zIndex = '3000';
    };

    const img = document.createElement('img');
    img.src = manga.src;
    img.alt = manga.title;
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      background: #0e0e16;
    `;

    card.appendChild(img);
    
    // Add coming soon overlay if applicable
    if (manga.comingSoon) {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      `;
      const badge = document.createElement('div');
      badge.textContent = 'SOON';
      badge.style.cssText = `
        background: linear-gradient(135deg, #ffd700 0%, #ffec8b 100%);
        color: #1a1a2e;
        padding: 8px 16px;
        border-radius: 20px;
        font-family: 'Press Start 2P', cursive;
        font-size: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      `;
      overlay.appendChild(badge);
      card.appendChild(overlay);
    }
    
    card.onclick = function(e) {
      e.stopPropagation();
      playSound('tabClick', 0);
      if (manga.comingSoon) {
        // Show coming soon message
        const toast = document.createElement('div');
        toast.className = 'coming-soon-toast';
        toast.textContent = 'Coming soon...';
        toast.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.9);
          color: #ffd700;
          padding: 20px 40px;
          border-radius: 12px;
          border: 2px solid #ffd700;
          font-family: 'Press Start 2P', cursive;
          font-size: 14px;
          z-index: 10000;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.3s ease';
          setTimeout(() => toast.remove(), 300);
        }, 1500);
      } else {
        openMangaReader(manga);
      }
    };

    document.body.appendChild(card);
    mangaCardElements.push(card);

    setTimeout(() => {
      card.style.left = `${cardX}px`;
      card.style.top = `${cardY}px`;
      card.style.transform = 'translate(-50%, -50%) scale(1)';
      card.style.opacity = '1';
    }, 60 + (index * 90));
  });

  // Add Concept Manga toggle button below the grid
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = mangaShowingConcept ? 'Back to Manga' : 'Concept Manga';
  toggleBtn.style.cssText = `
    position: fixed;
    left: 50%;
    top: ${gridTopY + gridHeight + 30}px;
    transform: translateX(-50%);
    z-index: 3000;
    background: rgba(255, 215, 0, 0.15);
    border: 2px solid rgba(255, 215, 0, 0.5);
    color: #ffd700;
    font-family: 'Press Start 2P', cursive;
    font-size: 10px;
    padding: 10px 20px;
    border-radius: 24px;
    cursor: pointer;
    backdrop-filter: blur(6px);
    transition: all 0.25s ease;
    opacity: 0;
    pointer-events: auto;
  `;
  toggleBtn.onmouseenter = function() {
    this.style.background = 'rgba(255, 215, 0, 0.35)';
    this.style.borderColor = '#ffd700';
    this.style.transform = 'translateX(-50%) scale(1.05)';
  };
  toggleBtn.onmouseleave = function() {
    this.style.background = 'rgba(255, 215, 0, 0.15)';
    this.style.borderColor = 'rgba(255, 215, 0, 0.5)';
    this.style.transform = 'translateX(-50%) scale(1)';
  };
  toggleBtn.onclick = function(e) {
    e.stopPropagation();
    playSound('click', 0);
    mangaShowingConcept = !mangaShowingConcept;
    showMangaCards(button);
  };

  document.body.appendChild(toggleBtn);
  mangaCardElements.push(toggleBtn);

  setTimeout(() => {
    toggleBtn.style.opacity = '1';
    toggleBtn.style.transition = 'opacity 0.4s ease, transform 0.25s ease, background 0.25s ease, border-color 0.25s ease';
  }, 60 + (totalCards * 90));

  mangaCardsShowing = true;
}

function hideMangaCards(button) {
  if (mangaCardsShowTimeoutId !== null) {
    clearTimeout(mangaCardsShowTimeoutId);
    mangaCardsShowTimeoutId = null;
  }

  if (mangaCardElements.length === 0) return;

  let targetX, targetY;
  if (button) {
    const buttonRect = button.getBoundingClientRect();
    targetX = buttonRect.left + buttonRect.width / 2;
    targetY = buttonRect.top + buttonRect.height / 2;
  } else {
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
  }

  mangaCardElements.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = 'translate(-50%, -50%) scale(0.1)';
      card.style.left = `${targetX}px`;
      card.style.top = `${targetY}px`;
      card.style.opacity = '0';
    }, index * 50);

    setTimeout(() => {
      if (card.parentNode) card.remove();
    }, 520 + (index * 50));
  });

  mangaCardElements = [];
  mangaCardsShowing = false;
  mangaShowingConcept = false;
}

// Manga Reader Functions
let currentMangaReader = null;
let currentMangaPages = [];
let currentMangaPageIndex = 0;
let currentMangaTitle = '';

function openMangaReader(manga) {
  // Hide manga cards
  hideMangaCards();

  // Get pages using helper (avoids duplicate image storage)
  const pages = getMangaPages(manga);

  // Create manga reader container
  const reader = document.createElement('div');
  reader.id = 'mangaReader';
  reader.className = 'manga-reader-container';

  // Check if manga has illustrations OR multiple sections (for toggle button)
  const hasIllustrations = manga.illustrations && manga.illustrations.length > 0;
  const hasSections = manga.sections && manga.sections.length > 1;
  const showToggle = hasIllustrations || hasSections;
  
  reader.innerHTML = `
    <div class="manga-reader-sidebar">
      <button class="manga-reader-exit" onclick="closeMangaReader()" title="Exit">✕</button>
      <div class="manga-reader-cover">
        <img src="${manga.src}" alt="${manga.title}" loading="eager">
      </div>
      <div class="manga-reader-info">
        <h2 class="manga-reader-title">${manga.title}</h2>
        <p class="manga-reader-synopsis">${manga.synopsis || ''}</p>
      </div>
      ${showToggle ? `<button class="manga-section-toggle" id="mangaSectionToggle" onclick="toggleMangaSection()" data-manga-key="${manga.coverKey}">${hasIllustrations ? 'Manga' : 'Section 1'}</button>` : ''}
    </div>
    <div class="manga-reader-main">
      <div class="manga-reader-grid" id="mangaReaderGrid"></div>
      <div class="manga-section-dots" id="mangaSectionDots"></div>
    </div>
  `;

  document.body.appendChild(reader);
  currentMangaReader = reader;

  // Reset global toggle state when opening new reader
  currentMangaSection = 'manga';

  let currentSectionIndex = 0;
  let currentViewMode = 'manga'; // 'manga' or 'illustrations'

  // Function to populate grid with pages or illustrations
  function populateGrid(sectionIdx, viewMode = 'manga') {
    const grid = document.getElementById('mangaReaderGrid');
    const dotsContainer = document.getElementById('mangaSectionDots');
    
    let itemsToShow = [];
    
    if (viewMode === 'illustrations' && manga.illustrations) {
      // Show illustrations
      itemsToShow = manga.illustrations.map(key => mangaImagePool[key]).filter(Boolean);
      dotsContainer.style.display = 'none'; // Hide section dots for illustrations
    } else {
      // Show manga pages
      itemsToShow = manga.sections ? getMangaPages(manga, sectionIdx) : pages;
      // Show/hide section dots based on sections
      dotsContainer.style.display = (manga.sections && manga.sections.length > 1) ? 'flex' : 'none';
    }
    
    grid.innerHTML = '';
    
    if (itemsToShow && itemsToShow.length > 0) {
      const fragment = document.createDocumentFragment();
      itemsToShow.forEach((itemSrc, index) => {
        const panel = document.createElement('div');
        panel.className = 'manga-panel';
        
        const img = document.createElement('img');
        img.src = itemSrc;
        img.alt = viewMode === 'illustrations' ? `Illustration ${index + 1}` : `Page ${index + 1}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        
        panel.appendChild(img);
        panel.dataset.index = index;
        panel.dataset.sectionIndex = sectionIdx;
        panel.dataset.viewMode = viewMode;
        
        fragment.appendChild(panel);
      });
      grid.appendChild(fragment);
    } else {
      // Show empty message
      grid.innerHTML = `<div style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px; font-family: 'Press Start 2P', cursive; font-size: 12px;">No ${viewMode} available</div>`;
    }
    
    // Update dots active state (only for manga sections)
    if (viewMode === 'manga') {
      const dots = document.querySelectorAll('.section-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === sectionIdx);
      });
    }
    
    currentSectionIndex = sectionIdx;
    currentViewMode = viewMode;
  }

  // Populate initial section
  populateGrid(0);

  // Single click handler for all panels using delegation
  const grid = document.getElementById('mangaReaderGrid');
  grid.addEventListener('click', (e) => {
    const panel = e.target.closest('.manga-panel');
    if (panel) {
      const index = parseInt(panel.dataset.index);
      const viewMode = panel.dataset.viewMode || 'manga';
      
      if (viewMode === 'illustrations' && manga.illustrations) {
        // Open illustration viewer
        const illustPages = manga.illustrations.map(key => mangaImagePool[key]).filter(Boolean);
        playSound('tabClick', 0);
        openMangaPageViewer(illustPages, index, `${manga.title} - Illustrations`, null, 0);
      } else {
        // Open manga page viewer
        const sectionIdx = parseInt(panel.dataset.sectionIndex) || 0;
        playSound('tabClick', 0);
        const sectionPages = getMangaPages(manga, sectionIdx);
        openMangaPageViewer(sectionPages, index, manga.title, manga.sections || null, sectionIdx);
      }
    }
  });

  // Add section dots if manga has sections
  if (manga.sections && manga.sections.length > 1) {
    const dotsContainer = document.getElementById('mangaSectionDots');
    manga.sections.forEach((section, idx) => {
      const dot = document.createElement('div');
      dot.className = `section-dot ${idx === 0 ? 'active' : ''}`;
      dot.dataset.section = idx;
      dot.innerHTML = `<span class="dot-number">${idx + 1}</span>`;
      dot.addEventListener('click', () => {
        playSound('tabClick', 0);
        populateGrid(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Listen for view mode toggle events
  reader.addEventListener('switchViewMode', (e) => {
    const mode = e.detail.mode;
    const sectionIdx = e.detail.section !== undefined ? e.detail.section : currentSectionIndex;
    if (mode === 'illustrations') {
      populateGrid(0, 'illustrations');
    } else {
      populateGrid(sectionIdx, 'manga');
    }
  });

  // Hide roadmap button
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = 'none';

  // Play sound
  playSound('open', 0);

  // Escape key handler
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeMangaReader();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

function closeMangaReader() {
  if (currentMangaReader) {
    currentMangaReader.remove();
    currentMangaReader = null;
  }

  // Show roadmap button
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = '';

  // Show manga cards again
  const mangaBtn = document.querySelector('.nav-btn[data-page="manga"]');
  if (mangaBtn) {
    showMangaCards(mangaBtn);
  }

  // Play sound
  playSound('close', 0);
}

let currentMangaSection = 'manga';
function toggleMangaSection() {
  const btn = document.getElementById('mangaSectionToggle');
  const reader = document.getElementById('mangaReader');
  if (!btn || !reader) return;
  
  // Get manga key from button and find manga data
  const mangaKey = btn.dataset.mangaKey;
  const currentManga = mangaKey ? mangaGalleryData.find(m => m.coverKey === mangaKey) : null;
  
  if (!currentManga) return;
  
  const hasIllustrations = currentManga.illustrations && currentManga.illustrations.length > 0;
  const hasSections = currentManga.sections && currentManga.sections.length > 1;
  
  if (hasIllustrations) {
    // Toggle between manga and illustrations
    if (currentMangaSection === 'manga') {
      currentMangaSection = 'illustrations';
      btn.textContent = 'Illustrations';
      reader.dispatchEvent(new CustomEvent('switchViewMode', { detail: { mode: 'illustrations' } }));
    } else {
      currentMangaSection = 'manga';
      btn.textContent = 'Manga';
      reader.dispatchEvent(new CustomEvent('switchViewMode', { detail: { mode: 'manga' } }));
    }
  } else if (hasSections) {
    // Toggle between sections
    const maxSection = currentManga.sections.length - 1;
    let nextSection = parseInt(btn.dataset.section || '0') + 1;
    if (nextSection > maxSection) nextSection = 0;
    
    btn.dataset.section = nextSection;
    btn.textContent = `Section ${nextSection + 1}`;
    reader.dispatchEvent(new CustomEvent('switchViewMode', { detail: { mode: 'manga', section: nextSection } }));
  }
  
  playSound('tabClick', 0);
}

let mangaNavDebounceTimer = null;
let currentMangaKeyHandler = null;

let currentMangaSections = null;
let currentMangaSectionIndex = 0;

function openMangaPageViewer(pages, startIndex, title, sections = null, initialSectionIndex = 0) {
  currentMangaPages = pages;
  currentMangaPageIndex = startIndex;
  currentMangaTitle = title;
  currentMangaSections = sections;
  currentMangaSectionIndex = initialSectionIndex;

  const viewer = document.createElement('div');
  viewer.id = 'mangaPageViewer';
  viewer.className = 'manga-page-viewer';

  // Create optimized image with priority loading
  const img = document.createElement('img');
  img.id = 'mangaViewerImage';
  img.src = pages[startIndex];
  img.alt = `Page ${startIndex + 1}`;
  img.decoding = 'async';
  img.fetchPriority = 'high';
  img.style.cssText = 'max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);';

  viewer.innerHTML = `
    <div class="manga-viewer-header">
      <span class="manga-viewer-title">${title}</span>
      <span class="manga-viewer-counter" id="mangaPageCounter">Page ${startIndex + 1} of ${pages.length}</span>
      <button class="manga-viewer-close" id="mangaViewerClose" title="Close">✕</button>
    </div>
    <div class="manga-viewer-content" id="mangaViewerContent">
      <button class="manga-nav-arrow manga-nav-prev" id="mangaNavPrev" title="Previous">‹</button>
      <div class="manga-viewer-image-container" id="mangaViewerImageContainer"></div>
      <button class="manga-nav-arrow manga-nav-next" id="mangaNavNext" title="Next">›</button>
    </div>
    <div class="manga-viewer-click-zones">
      <div class="manga-click-zone manga-click-left" id="mangaClickLeft"></div>
      <div class="manga-click-zone manga-click-right" id="mangaClickRight"></div>
    </div>
  `;

  document.body.appendChild(viewer);
  
  // Append image to container
  document.getElementById('mangaViewerImageContainer').appendChild(img);

  // Preload all pages in the current section for instant navigation
  preloadAllPages(pages);

  // Preload adjacent pages with low priority
  preloadAdjacentPages(startIndex);

  // Play sound
  playSound('open', 0);

  // Debounced navigation function
  const debouncedNavigate = (direction) => {
    if (mangaNavDebounceTimer) return; // Prevent rapid navigation
    navigateMangaPage(direction);
    mangaNavDebounceTimer = setTimeout(() => {
      mangaNavDebounceTimer = null;
    }, 150); // 150ms debounce
  };

  // Use event delegation for all click handlers
  viewer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.id === 'mangaViewerClose' || target.closest('#mangaViewerClose')) {
      closeMangaPageViewer();
    } else if (target.id === 'mangaNavPrev' || target.closest('#mangaNavPrev') || 
               target.id === 'mangaClickLeft' || target.closest('#mangaClickLeft')) {
      debouncedNavigate(-1);
    } else if (target.id === 'mangaNavNext' || target.closest('#mangaNavNext') || 
               target.id === 'mangaClickRight' || target.closest('#mangaClickRight')) {
      debouncedNavigate(1);
    }
  });

  // Keyboard handler with cleanup reference
  currentMangaKeyHandler = (e) => {
    if (e.key === 'Escape') {
      closeMangaPageViewer();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      debouncedNavigate(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      debouncedNavigate(1);
    }
  };
  document.addEventListener('keydown', currentMangaKeyHandler);

  // Swipe support with throttling
  let touchStartX = 0;
  let touchStartTime = 0;
  let isSwiping = false;

  viewer.addEventListener('touchstart', (e) => {
    if (isSwiping) return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartTime = Date.now();
  }, { passive: true });

  viewer.addEventListener('touchend', (e) => {
    if (isSwiping) return;
    const touchEndX = e.changedTouches[0].screenX;
    const touchDuration = Date.now() - touchStartTime;
    const diff = touchStartX - touchEndX;
    
    // Only handle quick swipes, not slow drags
    if (touchDuration < 300 && Math.abs(diff) > 50) {
      isSwiping = true;
      if (diff > 0) {
        debouncedNavigate(1);
      } else {
        debouncedNavigate(-1);
      }
      setTimeout(() => { isSwiping = false; }, 200);
    }
  }, { passive: true });
}

function closeMangaPageViewer() {
  const viewer = document.getElementById('mangaPageViewer');
  if (viewer) {
    // Cancel any pending image loads
    const img = document.getElementById('mangaViewerImage');
    if (img) {
      img.src = '';
    }
    viewer.remove();
  }
  
  // Clean up keyboard handler
  if (currentMangaKeyHandler) {
    document.removeEventListener('keydown', currentMangaKeyHandler);
    currentMangaKeyHandler = null;
  }
  
  // Clear any pending timers
  if (mangaNavDebounceTimer) {
    clearTimeout(mangaNavDebounceTimer);
    mangaNavDebounceTimer = null;
  }
  
  // Clear data
  currentMangaPages = [];
  currentMangaPageIndex = 0;
  currentMangaTitle = '';
  currentMangaSections = null;
  currentMangaSectionIndex = 0;
  
  playSound('close', 0);
}

function switchMangaSection(sectionIndex, section) {
  // Get new pages from section pageKeys
  const newPages = section.pageKeys.map(key => mangaImagePool[key]).filter(Boolean);

  // Update state
  currentMangaPages = newPages;
  currentMangaPageIndex = 0;
  currentMangaSectionIndex = sectionIndex;

  // Update image
  const img = document.getElementById('mangaViewerImage');
  const counter = document.getElementById('mangaPageCounter');

  if (img && counter && newPages.length > 0) {
    showMangaViewerLoader();
    img.style.opacity = '0.7';

    // Preload all pages in this section immediately
    preloadAllPages(newPages);

    const preloadImg = new Image();
    preloadImg.decoding = 'async';
    preloadImg.fetchPriority = 'high';

    preloadImg.onload = () => {
      img.src = newPages[0];
      counter.textContent = `Page 1 of ${newPages.length}`;
      img.style.opacity = '1';
      hideMangaViewerLoader();
    };

    preloadImg.onerror = () => {
      img.src = newPages[0];
      counter.textContent = `Page 1 of ${newPages.length}`;
      img.style.opacity = '1';
      hideMangaViewerLoader();
    };

    preloadImg.src = newPages[0];
  }
}

function navigateMangaPage(direction) {
  const newIndex = currentMangaPageIndex + direction;
  if (newIndex >= 0 && newIndex < currentMangaPages.length) {
    currentMangaPageIndex = newIndex;
    const img = document.getElementById('mangaViewerImage');
    const counter = document.getElementById('mangaPageCounter');

    if (img && counter) {
      showMangaViewerLoader();
      // Use requestAnimationFrame for smooth image transition
      requestAnimationFrame(() => {
        img.style.opacity = '0.7';

        // Preload the new image first
        const preloadImg = new Image();
        preloadImg.decoding = 'async';
        preloadImg.fetchPriority = 'high';

        preloadImg.onload = () => {
          requestAnimationFrame(() => {
            img.src = currentMangaPages[newIndex];
            counter.textContent = `Page ${newIndex + 1} of ${currentMangaPages.length}`;
            img.style.opacity = '1';
            hideMangaViewerLoader();
          });
        };

        preloadImg.onerror = () => {
          // Fallback: load anyway
          requestAnimationFrame(() => {
            img.src = currentMangaPages[newIndex];
            counter.textContent = `Page ${newIndex + 1} of ${currentMangaPages.length}`;
            img.style.opacity = '1';
            hideMangaViewerLoader();
          });
        };

        preloadImg.src = currentMangaPages[newIndex];

        // Preload adjacent pages in background
        setTimeout(() => preloadAdjacentPages(newIndex), 100);
      });
    }
  }
}

function preloadAllPages(pages) {
  // Preload every page in the section so switching is instant
  pages.forEach((src, i) => {
    const img = new Image();
    img.decoding = 'async';
    img.fetchPriority = i < 3 ? 'high' : 'low';
    img.src = src;
  });
}

function preloadAdjacentPages(currentIndex) {
  // Preload next and previous pages with low priority
  const preloadIndexes = [currentIndex - 1, currentIndex + 1];
  preloadIndexes.forEach(index => {
    if (index >= 0 && index < currentMangaPages.length) {
      const img = new Image();
      img.decoding = 'async';
      img.fetchPriority = 'low';
      img.src = currentMangaPages[index];
    }
  });
}

function showMangaViewerLoader() {
  const container = document.getElementById('mangaViewerImageContainer');
  if (!container) return;
  let loader = document.getElementById('mangaViewerLoader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'mangaViewerLoader';
    loader.className = 'manga-viewer-loader';
    loader.innerHTML = `
      <div class="manga-viewer-loader-dots">
        <div class="manga-viewer-loader-dot"></div>
        <div class="manga-viewer-loader-dot"></div>
        <div class="manga-viewer-loader-dot"></div>
      </div>
      <span class="manga-viewer-loader-text">Loading...</span>
    `;
    container.appendChild(loader);
  }
  loader.classList.remove('hidden');
}

function hideMangaViewerLoader() {
  const loader = document.getElementById('mangaViewerLoader');
  if (loader) loader.classList.add('hidden');
}

function showBooksCards(button) {
  lastBooksCardsButton = button;
  booksCardElements.forEach(el => el.remove());
  booksCardElements = [];
  booksCardsShowing = false;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const buttonRect = button.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonTopY = buttonRect.top;

  let cardWidth, cardHeight, spacingX, spacingY, cardsPerRow;
  const totalCards = booksData.length;

  if (viewportWidth <= 480) {
    cardWidth = 105;
    cardHeight = 165;
    spacingX = 130;
    spacingY = 190;
    cardsPerRow = 2;
  } else if (viewportWidth <= 768) {
    cardWidth = 140;
    cardHeight = 205;
    spacingX = 175;
    spacingY = 235;
    cardsPerRow = 3;
  } else {
    cardWidth = 165;
    cardHeight = 240;
    spacingX = 205;
    spacingY = 275;
    cardsPerRow = 3;
  }

  const totalRows = Math.ceil(totalCards / cardsPerRow);
  const gridWidth = Math.min(cardsPerRow, totalCards) * spacingX;
  const gridHeight = totalRows * spacingY;
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  const buttonBuffer = 110;
  let gridTopY = centerY - (gridHeight / 2);
  let gridLeftX = centerX - (gridWidth / 2);

  if (gridTopY + gridHeight > buttonTopY - buttonBuffer &&
      gridLeftX < buttonCenterX + buttonBuffer &&
      gridLeftX + gridWidth > buttonCenterX - buttonBuffer) {
    gridTopY = buttonTopY - gridHeight - buttonBuffer;
  }

  gridTopY = Math.max(20, Math.min(gridTopY, viewportHeight - gridHeight - 20));
  gridLeftX = Math.max(20, Math.min(gridLeftX, viewportWidth - gridWidth - 20));

  booksCardElements = [];

  booksData.forEach((book, index) => {
    const card = document.createElement('div');
    card.className = 'books-shelf-card';
    card.dataset.bookId = book.id;

    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    const cardsInThisRow = Math.min(cardsPerRow, totalCards - (row * cardsPerRow));
    const rowWidth = cardsInThisRow * spacingX;
    const rowStartX = gridLeftX + (gridWidth - rowWidth) / 2 + (spacingX / 2);
    const cardX = rowStartX + (col * spacingX);
    const cardY = gridTopY + (row * spacingY) + (spacingY / 2);

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    card.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: ${cardWidth}px;
      height: ${cardHeight}px;
      transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
      opacity: 0;
      z-index: 3000;
      cursor: pointer;
      transition: all 0.35s ease;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 34px rgba(0,0,0,0.65);
      pointer-events: auto;
      border: 2px solid rgba(255, 214, 122, 0.5);
      background: #0f1118;
    `;

    card.onmouseenter = function() {
      this.style.transform = this.style.transform.replace('scale(1)', 'scale(1.08)');
      this.style.boxShadow = '0 0 26px rgba(255, 214, 122, 0.75), 0 10px 34px rgba(0,0,0,0.75)';
      this.style.borderColor = 'rgba(255, 214, 122, 0.95)';
      this.style.zIndex = '3001';
    };

    card.onmouseleave = function() {
      this.style.transform = this.style.transform.replace('scale(1.08)', 'scale(1)');
      this.style.boxShadow = '0 10px 34px rgba(0,0,0,0.65)';
      this.style.borderColor = 'rgba(255, 214, 122, 0.5)';
      this.style.zIndex = '3000';
    };

    const img = document.createElement('img');
    img.src = book.cover;
    img.alt = book.title;
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    `;

    const titleOverlay = document.createElement('div');
    titleOverlay.className = 'books-card-title';
    titleOverlay.textContent = book.title;
    titleOverlay.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px 6px;
      background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.25));
      color: #f6e7bf;
      font-size: 9px;
      line-height: 1.35;
      text-align: center;
      text-shadow: 0 1px 2px rgba(0,0,0,0.9);
    `;

    card.appendChild(img);
    card.appendChild(titleOverlay);
    card.onclick = function(e) {
      e.stopPropagation();
      playSound('tabClick', 0);
      startBookSequence(book, button);
    };

    document.body.appendChild(card);
    booksCardElements.push(card);

    setTimeout(() => {
      const rotate = (index % 2 === 0 ? -2 : 2);
      card.style.left = `${cardX}px`;
      card.style.top = `${cardY}px`;
      card.style.transform = `translate(-50%, -50%) scale(1) rotate(${rotate}deg)`;
      card.style.opacity = '1';
    }, 60 + (index * 90));
  });

  booksCardsShowing = true;
}

function hideBooksCards(button) {
  if (booksCardElements.length === 0) return;

  let targetX;
  let targetY;
  if (button) {
    const rect = button.getBoundingClientRect();
    targetX = rect.left + rect.width / 2;
    targetY = rect.top + rect.height / 2;
  } else {
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
  }

  booksCardElements.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = 'translate(-50%, -50%) scale(0.1) rotate(0deg)';
      card.style.left = `${targetX}px`;
      card.style.top = `${targetY}px`;
      card.style.opacity = '0';
    }, index * 45);

    setTimeout(() => {
      if (card.parentNode) card.remove();
    }, 560 + (index * 45));
  });

  booksCardElements = [];
  booksCardsShowing = false;
  closeBookReader();
}

function startBookSequence(book, sourceButton) {
  hideBooksCards(sourceButton);

  const existing = document.getElementById('bookTransitionOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'bookTransitionOverlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 3500;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.12);
  `;

  overlay.innerHTML = `
    <div id="bookTransitionCard" style="
      width: min(30vw, 260px);
      height: min(45vw, 380px);
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid rgba(255, 214, 122, 0.7);
      box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 25px rgba(255, 214, 122, 0.5);
      transform-style: preserve-3d;
      transition: transform 0.9s ease, box-shadow 0.9s ease, opacity 0.5s ease;
      background: #111;
      opacity: 1;
    ">
      <img src="${book.cover}" alt="${book.title}" style="width:100%;height:100%;object-fit:cover;display:block;">
    </div>
  `;

  document.body.appendChild(overlay);
  const card = document.getElementById('bookTransitionCard');
  if (!card) return;

  requestAnimationFrame(() => {
    card.style.transform = 'rotateY(360deg) scale(1.03)';
  });

  setTimeout(() => {
    card.style.transform = 'rotateY(720deg) scale(1.08)';
    card.style.boxShadow = '0 20px 55px rgba(0,0,0,0.78), 0 0 35px rgba(255, 214, 122, 0.7)';
  }, 850);

  setTimeout(async () => {
    card.style.opacity = '0';
    await openBookReader(book);
    overlay.remove();
  }, 1800);
}

function ensureDocxPreviewAssets() {
  if (window.JSZip && window.docx && typeof window.docx.renderAsync === 'function') {
    return Promise.resolve();
  }
  if (docxPreviewAssetsPromise) return docxPreviewAssetsPromise;

  docxPreviewAssetsPromise = new Promise((resolve, reject) => {
    const cssHref = 'https://unpkg.com/docx-preview@0.3.6/dist/docx-preview.min.css';
    const jszipSrc = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    const docxSrc = 'https://unpkg.com/docx-preview@0.3.6/dist/docx-preview.min.js';

    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      link.onerror = () => console.warn('docx-preview CSS failed to load, using fallback styles');
      document.head.appendChild(link);
    }

    const waitForScript = (src, errorMessage) => new Promise((res, rej) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        // If already loaded, continue immediately.
        if (existing.dataset.loaded === '1') {
          res();
          return;
        }
        existing.addEventListener('load', () => {
          existing.dataset.loaded = '1';
          res();
        }, { once: true });
        existing.addEventListener('error', () => rej(new Error(errorMessage)), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        script.dataset.loaded = '1';
        res();
      };
      script.onerror = () => rej(new Error(errorMessage));
      document.head.appendChild(script);
    });

    (async () => {
      await waitForScript(jszipSrc, 'Failed to load JSZip dependency.');
      await waitForScript(docxSrc, 'Failed to load DOCX renderer.');
      if (!window.JSZip) {
        throw new Error('JSZip not available after loading.');
      }
      if (!window.docx || typeof window.docx.renderAsync !== 'function') {
        throw new Error('DOCX renderer not available after loading.');
      }
      resolve();
    })().catch(reject);
  });

  return docxPreviewAssetsPromise;
}

function splitDocxHostOnWordPageBreaks(hostEl) {
  const kids = Array.from(hostEl.children);
  if (!kids.length) return null;

  const isPageBreakStart = (el) => {
    const st = (el.getAttribute('style') || '').toLowerCase().replace(/\s+/g, '');
    return st.includes('page-break-before:always') || st.includes('break-before:page');
  };

  const chunks = [];
  let current = [];
  kids.forEach((el) => {
    if (isPageBreakStart(el) && current.length) {
      chunks.push(current.map((n) => n.outerHTML).join(''));
      current = [];
    }
    current.push(el);
  });
  if (current.length) {
    chunks.push(current.map((n) => n.outerHTML).join(''));
  }
  return chunks.length > 1 ? chunks : null;
}

function extractDocxPageHtml(hiddenMount) {
  const wrapper = hiddenMount.querySelector('.docx-wrapper');
  if (!wrapper) return [];

  const selectors = [
    () => Array.from(wrapper.querySelectorAll(':scope > section.docx')),
    () => Array.from(wrapper.querySelectorAll(':scope > section')),
    () => Array.from(hiddenMount.querySelectorAll('.docx-wrapper > section.docx')),
    () => Array.from(hiddenMount.querySelectorAll('.docx-wrapper > section')),
    () => Array.from(hiddenMount.querySelectorAll('.docx-wrapper section.docx')),
  ];

  for (const pick of selectors) {
    const nodes = pick();
    if (nodes.length > 0) {
      return nodes.map((el) => el.outerHTML);
    }
  }

  let host = wrapper;
  if (wrapper.children.length === 1 && wrapper.children[0].tagName === 'SECTION') {
    host = wrapper.children[0];
  }
  const split = splitDocxHostOnWordPageBreaks(host);
  if (split) return split;

  return [wrapper.outerHTML];
}

async function loadBookPages(book) {
  if (bookPagesCache.has(book.id)) {
    return bookPagesCache.get(book.id);
  }

  if (book.sourceType !== 'docx') {
    throw new Error('Unsupported book source type.');
  }

  await ensureDocxPreviewAssets();

  let arrayBuffer = null;
  if (bookFileBufferCache.has(book.sourceFile)) {
    arrayBuffer = bookFileBufferCache.get(book.sourceFile).slice(0);
  } else {
    const response = await fetch(new URL(book.sourceFile, window.location.href));
    if (!response.ok) {
      throw new Error('Could not load book file.');
    }
    arrayBuffer = await response.arrayBuffer();
    bookFileBufferCache.set(book.sourceFile, arrayBuffer.slice(0));
  }
  const hiddenMount = document.createElement('div');
  hiddenMount.style.cssText = 'position:fixed;left:-99999px;top:-99999px;width:900px;opacity:0;pointer-events:none;z-index:-1;';
  document.body.appendChild(hiddenMount);

  await window.docx.renderAsync(arrayBuffer, hiddenMount, null, {
    inWrapper: true,
    breakPages: true,
    experimental: true
  });

  const pages = extractDocxPageHtml(hiddenMount);

  hiddenMount.remove();

  if (!pages.length) {
    throw new Error('No readable pages found in book file.');
  }

  bookPagesCache.set(book.id, pages);
  return pages;
}

function renderBookReaderPages() {
  const singlePage = document.getElementById('bookReaderSinglePage');
  if (!singlePage) return;

  const blocks = bookReaderPages.map((html, i) => {
    const pageContent = html || '<p style="opacity:.6">No content</p>';
    const n = i + 1;
    return `<section class="book-reader-page-block" aria-label="Page ${n}"><div class="book-page-fit">${pageContent}</div></section>`;
  });
  singlePage.innerHTML = blocks.join('');
  fitBookPageContent(singlePage);
}

function fitBookPageContent(pageContainer) {
  if (!pageContainer) return;
  const availableWidth = Math.max(pageContainer.clientWidth - 12, 1);
  pageContainer.querySelectorAll('.book-page-fit').forEach((fitRoot) => {
    fitRoot.style.transformOrigin = 'top left';
    fitRoot.style.margin = '0';
    fitRoot.style.padding = '0';
    fitRoot.style.display = 'inline-block';
    const contentWidth = Math.max(fitRoot.scrollWidth, 1);
    const scale = Math.min(1, availableWidth / contentWidth);
    fitRoot.style.transform = `scale(${scale})`;
  });
}

function closeBookReader() {
  const overlay = document.getElementById('bookReaderOverlay');
  if (overlay) overlay.remove();
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = '';
}

async function openBookReader(book) {
  const existing = document.getElementById('bookReaderOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'bookReaderOverlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 3600;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    padding: 24px;
    box-sizing: border-box;
  `;

  overlay.innerHTML = `
    <div id="bookReaderFrame" style="
      width: min(1100px, 94vw);
      height: min(720px, 90vh);
      background: linear-gradient(135deg, #1c1b24 0%, #111018 100%);
      border: 2px solid rgba(255, 214, 122, 0.55);
      border-radius: 16px;
      box-shadow: 0 25px 75px rgba(0,0,0,0.78);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0.9);
      opacity: 0;
      transition: transform .35s ease, opacity .35s ease;
    ">
      <div style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,0.12);color:#f6e7bf;font-size:10px;">
        <div style="max-width:75%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${book.title}</div>
        <button id="bookReaderClose" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:8px;padding:8px 10px;cursor:pointer;font-size:10px;">Close</button>
      </div>
      <div id="bookReaderLoading" style="flex:1;min-height:0;display:flex;align-items:center;justify-content:center;color:#e8d8ad;font-size:10px;padding:20px;">Loading book pages...</div>
      <div id="bookReaderBody" style="display:none;flex:1;min-height:0;flex-direction:column;gap:0;padding:0;background:rgba(0,0,0,0.2);overflow:hidden;">
        <div id="bookReaderSinglePage" style="flex:1;min-height:0;width:min(780px,100%);margin:0 auto;background:#f6efdf;border:1px solid #c8b48a;border-radius:0;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none;padding:0;color:#222;font-family:Georgia,serif;font-size:14px;line-height:1.55;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = 'none';
  const frame = document.getElementById('bookReaderFrame');
  const closeBtn = document.getElementById('bookReaderClose');
  const loading = document.getElementById('bookReaderLoading');
  const body = document.getElementById('bookReaderBody');

  requestAnimationFrame(() => {
    if (frame) {
      frame.style.transform = 'scale(1)';
      frame.style.opacity = '1';
    }
  });

  closeBtn.addEventListener('click', closeBookReader);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeBookReader();
  });

  try {
    bookReaderPages = await loadBookPages(book);
    loading.style.display = 'none';
    body.style.display = 'flex';
    renderBookReaderPages();
  } catch (error) {
    loading.textContent = `Failed to load book: ${error.message}`;
    loading.style.color = '#ffb3b3';
  }
}

window.addEventListener('resize', () => {
  const singlePage = document.getElementById('bookReaderSinglePage');
  if (singlePage && singlePage.innerHTML.trim() !== '') {
    fitBookPageContent(singlePage);
  }
});

function openWorkCardFullscreen(card, src, title) {
  // Store the card's current position for return
  const rect = card.getBoundingClientRect();
  card.dataset.returnX = rect.left;
  card.dataset.returnY = rect.top;
  card.dataset.returnTransform = card.style.transform;
  
  // Create fullscreen viewer
  const viewer = document.createElement('div');
  viewer.id = 'workCardViewer';
  viewer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.95);
    z-index: 5000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
  `;
  
  const img = document.createElement('img');
  img.src = src;
  img.alt = title;
  img.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    border: none;
    color: white;
    font-size: 30px;
    cursor: pointer;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  viewer.appendChild(img);
  viewer.appendChild(closeBtn);
  document.body.appendChild(viewer);
  
  // Close function
  const closeViewer = () => {
    viewer.remove();
    playSound('tabClick', 0);
  };
  
  closeBtn.onclick = closeViewer;
  viewer.onclick = (e) => {
    if (e.target === viewer) closeViewer();
  };
  
  // Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeViewer();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

function proceedWithPageOpen(pageKey) {
  // Auto-maximize only wiki tab (not manga, about, faq, home)
  if (pageKey === "wiki") {
    setTimeout(() => {
      if (!middleTab.classList.contains('maximized')) {
        // New smooth animation only for wiki tab
        middleTab.classList.add('slow-maximize');
        
        // Set final maximized state after animation
        setTimeout(() => {
          middleTab.classList.remove('slow-maximize');
          middleTab.classList.add('maximized');
          document.body.classList.add('window-maximized');
        }, 600);
      }
    }, 100);
  }
  
  // NEVER maximize these tabs - keep them normal size PERMANENTLY
  if (pageKey === "manga" || pageKey === "home" || pageKey === "books" || pageKey === "faq") {
    // Force ensure these tabs are NEVER maximized
    middleTab.classList.remove('maximized');
    document.body.classList.remove('window-maximized');
  }
  
  showPage(pageKey);
}

// ðŸ“– DIARY FUNCTIONS
let diaryData = {
  pages: [
    {
      id: 1,
      title: "Lazyman_XD",
      content: `
        <h2>Who is Lazyman_XD?</h2>
        <p>Lazyman_XD is a passionate manga artist and illustrator dedicated to creating captivating visual stories. With a unique artistic style that blends traditional manga aesthetics with modern digital techniques, Lazyman brings characters and worlds to life.</p>

        <h2>What I Do</h2>
        <p>I specialize in creating manga, character illustrations, and concept art. My work spans various genres from fantasy and adventure to slice-of-life and emotional dramas. Each piece is crafted with attention to detail and a deep love for storytelling.</p>

        <h2>My Work</h2>
        <p>Over the years, I've created illustrations, manga on progress. Some of my notable works, character-driven dramas, and experimental art pieces. Every project is a new adventure in creativity.</p>

        <h2>Get In Touch</h2>
        <p>I'm always open to collaborations, commissions, and connecting with fellow artists. Feel free to explore my work and reach out if you'd like to work together!</p>

        <h2>My Journey</h2>
        <p>My artistic journey began at a young age, doodling characters from my favorite anime and manga. Over time, those doodles evolved into original characters and stories of my own. Each drawing taught me something new about anatomy, perspective, and storytelling.</p>

        <h2>Inspiration</h2>
        <p>I draw inspiration from various sources - nature, music, other artists, and everyday life. The way light filters through leaves, the emotion in a song, the story in a stranger's eyes - all these moments fuel my creativity and find their way into my art.</p>

        <h2>Future Goals</h2>
        <p>My dream is to publish my own manga series and share my stories with the world. I want to create characters that resonate with readers, worlds they can get lost in, and stories that stay with them long after they've finished reading.</p>

        <h2>Thank You</h2>
        <p>Thank you for visiting my website and taking the time to learn about me. Your support means the world to me. Keep creating, keep dreaming, and never give up on your passions!</p>
      `
    }
  ],
  currentPage: 0
};

let isDiaryEditing = false;
let diaryOverlay = null;

// Load diary data from localStorage
function loadDiaryData() {
  const saved = localStorage.getItem('diaryData');
  if (saved) {
    diaryData = JSON.parse(saved);
  }
}

// Save diary data to localStorage
function saveDiaryData() {
  localStorage.setItem('diaryData', JSON.stringify(diaryData));
}

// Show diary with effects
function showDiary() {
  createDiaryOverlay();
}

// Create diary overlay
function createDiaryOverlay() {
  // Remove existing if any
  if (diaryOverlay) {
    diaryOverlay.remove();
  }
  
  diaryOverlay = document.createElement('div');
  diaryOverlay.className = 'diary-overlay';
  diaryOverlay.innerHTML = `
    <div class="diary-book-3d" id="diaryBook3d">
      <!-- Back Cover -->
      <div class="diary-back-cover"></div>
      
      <!-- Pages Stack -->
      <div class="diary-pages-container">
        <div class="diary-page-layer"></div>
        <div class="diary-page-layer"></div>
        <div class="diary-page-layer"></div>
        <div class="diary-page-layer"></div>
        <div class="diary-page-layer"></div>
      </div>
      
      <!-- Spine -->
      <div class="diary-spine-3d">
        <div class="diary-spine-text-3d">Lazyman_XD</div>
      </div>
      
      <!-- Front Cover -->
      <div class="diary-front-cover">
        <div class="diary-cover-title">LAZYMAN_XD<br>DIARY</div>
      </div>
      
      <!-- Content Page (visible when open) -->
      <div class="diary-content-page" id="diaryContentPage">
        <div class="diary-content-3d" id="diaryContent"></div>
      </div>
      
      <!-- Close Button -->
      <button class="diary-close-btn-3d" onclick="closeDiary()">✕</button>
      
      <!-- Page Indicator -->
      <div class="diary-page-indicator-3d" id="pageIndicator">1 / ${diaryData.pages.length}</div>
      
      <!-- Navigation -->
      <div class="diary-navigation-3d" id="diaryNav">
        <button class="diary-nav-btn-3d" onclick="prevDiaryPage()" id="prevBtn">Previous</button>
        <button class="diary-nav-btn-3d" onclick="nextDiaryPage()" id="nextBtn">Next</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(diaryOverlay);
  
  // Trigger animation sequence
  setTimeout(() => {
    const book = document.getElementById('diaryBook3d');
    
    // Phase 1: Appear (fade-in + scale-up + rotate to show angle)
    book.classList.add('animating');
    
    // Phase 2: Rotate to show front cover straight on
    setTimeout(() => {
      book.classList.remove('animating');
      book.classList.add('phase-rotate');
      
      // Phase 3: Open the book
      setTimeout(() => {
        book.classList.remove('phase-rotate');
        book.classList.add('phase-open');
        
        // Phase 4: Reading mode (cover fades, page faces user)
        setTimeout(() => {
          book.classList.remove('phase-open');
          book.classList.add('phase-reading');
          
          // Load content after book opens
          loadDiaryPage(diaryData.currentPage);
        }, 800);
      }, 800);
    }, 600);
  }, 100);
  
  // Close on escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeDiary();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Load diary page content
function loadDiaryPage(pageIndex) {
  const contentDiv = document.getElementById('diaryContent');
  const pageIndicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (pageIndex >= 0 && pageIndex < diaryData.pages.length) {
    const page = diaryData.pages[pageIndex];
    contentDiv.innerHTML = `<h1 class="diary-title">${page.title}</h1>${page.content}`;
    pageIndicator.textContent = `${pageIndex + 1} / ${diaryData.pages.length}`;

    // Update button states
    prevBtn.disabled = pageIndex === 0;
    nextBtn.disabled = pageIndex === diaryData.pages.length - 1;

    diaryData.currentPage = pageIndex;

    // Reset scroll to top when changing pages
    contentDiv.scrollTop = 0;
  }
}

// Navigate to previous page
function prevDiaryPage() {
  if (diaryData.currentPage > 0) {
    loadDiaryPage(diaryData.currentPage - 1);
  }
}

// Navigate to next page
function nextDiaryPage() {
  if (diaryData.currentPage < diaryData.pages.length - 1) {
    loadDiaryPage(diaryData.currentPage + 1);
  }
}

// Scroll to top of diary page
function scrollDiaryToTop() {
  const contentPage = document.getElementById('diaryContentPage');
  if (contentPage) {
    contentPage.scrollTop = 0;
    contentPage.classList.remove('scrolled');
  }
}

// Scroll to bottom of diary page
function scrollDiaryToBottom() {
  const contentPage = document.getElementById('diaryContentPage');
  if (contentPage) {
    contentPage.scrollTop = contentPage.scrollHeight;
    contentPage.classList.add('scrolled');
  }
}

// Close diary
function closeDiary() {
  if (diaryOverlay) {
    const book = document.getElementById('diaryBook3d');
    
    if (book) {
      // Remove reading mode and add closing animation
      book.classList.remove('phase-reading');
      book.classList.add('closing');
      
      // Wait for close animation to complete then remove overlay
      setTimeout(() => {
        if (diaryOverlay && diaryOverlay.parentNode) {
          diaryOverlay.remove();
        }
        diaryOverlay = null;
        isDiaryEditing = false;
      }, 1500); // Match the CSS animation duration
    } else {
      // Fallback if book element not found
      diaryOverlay.style.opacity = '0';
      diaryOverlay.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        if (diaryOverlay && diaryOverlay.parentNode) {
          diaryOverlay.remove();
        }
        diaryOverlay = null;
        isDiaryEditing = false;
      }, 500);
    }
  }
  playSound('tabClick', 0);
}

// Enable diary editing mode
function enableDiaryEditing() {
  if (!diaryOverlay) {
    // Create diary if not open
    createDiaryOverlay();
  }
  
  isDiaryEditing = true;
  
  const pagesDiv = document.getElementById('diaryPages');
  const contentDiv = document.getElementById('diaryContent');
  
  pagesDiv.classList.add('editing');
  contentDiv.contentEditable = true;
  
  // Create editing toolbar
  let toolbar = document.getElementById('diaryEditToolbar');
  if (!toolbar) {
    toolbar = document.createElement('div');
    toolbar.id = 'diaryEditToolbar';
    toolbar.className = 'diary-edit-toolbar';
    toolbar.innerHTML = `
      <button onclick="diaryFormat('bold')">Bold</button>
      <button onclick="diaryFormat('italic')">Italic</button>
      <button onclick="diaryFormat('underline')">Underline</button>
      <select onchange="diaryChangeFont(this.value)">
        <option value="Georgia">Georgia</option>
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Verdana">Verdana</option>
        <option value="'Press Start 2P'">Press Start 2P</option>
      </select>
      <select onchange="diaryChangeSize(this.value)">
        <option value="12px">Small</option>
        <option value="16px" selected>Normal</option>
        <option value="20px">Large</option>
        <option value="24px">X-Large</option>
      </select>
      <input type="color" onchange="diaryChangeColor(this.value)" value="#333333">
      <button onclick="diaryAddImage()">Add Image</button>
      <button onclick="diaryAddPage()">+ Page</button>
      <button onclick="diaryDeletePage()">Delete Page</button>
      <button onclick="saveDiary()" style="background: #4CAF50; color: white;">Save</button>
      <button onclick="closeDiaryEditToolbar()">Close Edit</button>
    `;
    document.body.appendChild(toolbar);
  }
  
  // Setup image drag and resize
  setupDiaryImageEditing();
}

// Close diary edit toolbar
function closeDiaryEditToolbar() {
  isDiaryEditing = false;
  
  const pagesDiv = document.getElementById('diaryPages');
  const contentDiv = document.getElementById('diaryContent');
  
  if (pagesDiv) pagesDiv.classList.remove('editing');
  if (contentDiv) contentDiv.contentEditable = false;
  
  const toolbar = document.getElementById('diaryEditToolbar');
  if (toolbar) toolbar.remove();
}

// Format text in diary
function diaryFormat(command) {
  document.execCommand(command, false, null);
}

// Change font in diary
function diaryChangeFont(font) {
  document.execCommand('fontName', false, font);
}

// Change font size in diary
function diaryChangeSize(size) {
  document.execCommand('fontSize', false, '7');
  // Apply custom size via CSS
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = size;
    range.surroundContents(span);
  }
}

// Change text color in diary
function diaryChangeColor(color) {
  document.execCommand('foreColor', false, color);
}

// Add image to diary
function diaryAddImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.maxWidth = '100%';
        img.style.cursor = 'move';
        img.style.border = '2px dashed #8B4513';
        img.style.margin = '15px 0';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        
        document.execCommand('insertHTML', false, img.outerHTML);
        setupDiaryImageEditing();
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

// Setup image drag and resize in diary
function setupDiaryImageEditing() {
  const images = document.querySelectorAll('#diaryContent img');
  images.forEach(img => {
    if (isDiaryEditing) {
      img.style.cursor = 'move';
      img.draggable = true;
      
      // Simple drag handling
      img.ondragstart = function(e) {
        e.dataTransfer.setData('text/plain', 'dragging');
      };
      
      // Double click to resize
      img.ondblclick = function() {
        const newWidth = prompt('Enter width (px or %):', '100%');
        if (newWidth) {
          this.style.width = newWidth;
          this.style.height = 'auto';
        }
      };
    }
  });
}

// Add new page to diary
function diaryAddPage() {
  if (!isDiaryEditing) {
    alert('Please enable editing mode first!');
    return;
  }
  
  const title = prompt('Enter page title:', 'New Page');
  if (title) {
    const newPage = {
      id: Date.now(),
      title: title,
      content: '<p>Start writing here...</p>'
    };
    diaryData.pages.push(newPage);
    
    // Navigate to new page
    loadDiaryPage(diaryData.pages.length - 1);
    saveDiaryData();
  }
}

// Delete current page
function diaryDeletePage() {
  if (!isDiaryEditing) {
    alert('Please enable editing mode first!');
    return;
  }
  
  if (diaryData.pages.length <= 1) {
    alert('Cannot delete the last page!');
    return;
  }
  
  if (confirm('Delete this page? This cannot be undone.')) {
    diaryData.pages.splice(diaryData.currentPage, 1);
    
    // Adjust current page if needed
    if (diaryData.currentPage >= diaryData.pages.length) {
      diaryData.currentPage = diaryData.pages.length - 1;
    }
    
    loadDiaryPage(diaryData.currentPage);
    saveDiaryData();
  }
}

// Save diary changes
function saveDiary() {
  const contentDiv = document.getElementById('diaryContent');
  if (contentDiv) {
    // Clone the content to work with it
    const tempDiv = contentDiv.cloneNode(true);
    
    // Get the title from the h1 element
    const titleElement = tempDiv.querySelector('h1.diary-title');
    let title = "Untitled";
    if (titleElement) {
      title = titleElement.textContent || titleElement.innerText || "Untitled";
      // Remove the title element from the clone
      titleElement.remove();
    }
    
    // Update the data
    diaryData.pages[diaryData.currentPage].title = title.trim();
    diaryData.pages[diaryData.currentPage].content = tempDiv.innerHTML;
    
    saveDiaryData();
    
    // Reload the page to show the saved title
    loadDiaryPage(diaryData.currentPage);
    
    alert('Diary saved successfully!');
  }
}

// Open diary from admin panel
function openDiaryEditor() {
  // Show diary page
  showPage('diary');
  playSound('tabClick', 0);
  
  // Enable editing after diary opens
  setTimeout(() => {
    enableDiaryEditing();
  }, 1000);
}

// Global variable to track current artwork index
let currentArtworkIndex = 0;

// Update the overlay onclick to handle artwork only
function closeAllExpanded() {
  // Artwork expansion functionality has been removed
}

function openArtwork(imageSrc, title) {
  // Check if imageSrc is valid
  if (!imageSrc || imageSrc === 'undefined') {
    return;
  }
  
  // Find current index based on imageSrc
  currentArtworkIndex = artworkData.findIndex(artwork => artwork.src === imageSrc);
  if (currentArtworkIndex === -1) currentArtworkIndex = 0;
  
  // Remove any existing viewer
  const existingViewer = document.getElementById('artworkViewer');
  if (existingViewer) {
    existingViewer.remove();
  }
  
  // Create new viewer
  const viewer = document.createElement('div');
  viewer.id = 'artworkViewer';
  viewer.className = 'artwork-viewer show';
  viewer.innerHTML = `
    <div class="artwork-viewer-content">
      <button class="artwork-viewer-close">✕</button>
      <button class="artwork-nav artwork-nav-prev">‹</button>
      <img src="${imageSrc}" alt="${title}">
      <button class="artwork-nav artwork-nav-next">›</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(viewer);
  
  // Force a reflow to ensure the show class takes effect
  viewer.offsetHeight;
  
  // Add close functionality
  const closeBtn = viewer.querySelector('.artwork-viewer-close');
  closeBtn.addEventListener('click', function() {
    viewer.remove();
    playSound('tabClick', 0);
  });
  
  // Add navigation functionality
  const prevBtn = viewer.querySelector('.artwork-nav-prev');
  const nextBtn = viewer.querySelector('.artwork-nav-next');
  
  prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navigateArtwork(-1);
  });
  
  nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navigateArtwork(1);
  });
  
  // Close on background click
  viewer.addEventListener('click', function(e) {
    if (e.target === viewer) {
      viewer.remove();
      playSound('tabClick', 0);
    }
  });
  
  // Close on escape key
  const escapeHandler = function(e) {
    if (e.key === 'Escape') {
      viewer.remove();
      document.removeEventListener('keydown', escapeHandler);
      playSound('tabClick', 0);
    }
    // Arrow key navigation
    if (e.key === 'ArrowLeft') {
      navigateArtwork(-1);
    }
    if (e.key === 'ArrowRight') {
      navigateArtwork(1);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

function navigateArtwork(direction) {
  if (!artworkData || artworkData.length === 0) return;
  
  currentArtworkIndex += direction;
  
  // Cycle through artworks
  if (currentArtworkIndex < 0) {
    currentArtworkIndex = artworkData.length - 1;
  } else if (currentArtworkIndex >= artworkData.length) {
    currentArtworkIndex = 0;
  }
  
  const artwork = artworkData[currentArtworkIndex];
  if (artwork) {
    const img = document.querySelector('#artworkViewer img');
    if (img) {
      img.src = artwork.src;
      img.alt = artwork.title || '';
    }
  }
}

function closeArtworkViewer() {
  const viewer = document.getElementById('artworkViewer');
  if (viewer) {
    viewer.classList.remove('show');
  }
  playSound('tabClick', 0);
}

function loadSavedData() {
  // Clear any old wiki content that might be cached
  localStorage.removeItem('wikiContent');
  
  // Load artwork data from localStorage
  const savedArtwork = localStorage.getItem('artworkData');
  if (savedArtwork) {
    try {
      const parsed = JSON.parse(savedArtwork);
      if (Array.isArray(parsed) && parsed.length > 0) {
        artworkData = parsed;
      }
    } catch (e) {
      console.error('Error loading artwork data:', e);
    }
  }
  
  const savedData = localStorage.getItem('websiteData');
  if (savedData) {
    const data = JSON.parse(savedData);
    
    // Update pages with saved data
    if (data.home) {
      pages.home.title = data.home.title || pages.home.title;
      pages.home.subtitle = data.home.subtitle || pages.home.subtitle;
    }
    // Skip loading old wiki content to prevent conflicts
    if (data.about) {
      pages.about.content = data.about.content || pages.about.content;
    }
  }
}

// Save data to localStorage
function saveData() {
  const data = {
    home: pages.home,
    about: pages.about
    // Skip saving wiki to prevent old content conflicts
  };
  localStorage.setItem('websiteData', JSON.stringify(data));
}

function enableWikiEditing() {
  // Make wiki content editable
  setTimeout(() => {
    const wikiMainContent = document.querySelector('.wiki-main-content');

    if (wikiMainContent) {
      wikiMainContent.contentEditable = true;
      wikiMainContent.style.border = '2px dashed #ffd700';
      wikiMainContent.style.padding = '10px';
      
      // Add editing toolbar
      const toolbar = document.createElement('div');
      toolbar.id = 'wikiEditToolbar';
      toolbar.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        border: 2px solid #ffd700;
        border-radius: 10px;
        padding: 10px;
        z-index: 10000;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        max-width: 300px;
      `;
      
      toolbar.innerHTML = `
        <button onclick="formatText('bold')" style="background: #ffd700; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Bold</button>
        <button onclick="formatText('italic')" style="background: #ffd700; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Italic</button>
        <button onclick="formatText('underline')" style="background: #ffd700; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Underline</button>
        <button onclick="changeFont()" style="background: #ffd700; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Font</button>
        <button onclick="changeFontSize()" style="background: #ffd700; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Size</button>
        <button onclick="addImage()" style="background: #ffd700; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Image</button>
        <button onclick="addLink()" style="background: #ffd700; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Link</button>
        <button onclick="addNewPage()" style="background: #2196F3; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; color: white;">+ Page</button>
        <button onclick="toggleFullEdit()" style="background: #FF9800; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; color: white;">Edit All</button>
        <button onclick="saveWikiChanges()" style="background: #4CAF50; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; color: white;">Save</button>
      `;
      
      document.body.appendChild(toolbar);
      
      // Enable drag and drop for images
      setupImageDragAndDrop();
    }
  }, 2500); // Wait for wiki to load
}

function formatText(command) {
  document.execCommand(command, false, null);
}

function changeFontSize() {
  const size = prompt('Enter font size (1-7):', '3');
  if (size) {
    document.execCommand('fontSize', false, size);
  }
}

function changeFont() {
  const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS'];
  const fontList = fonts.map((font, index) => `${index + 1}. ${font}`).join('\n');
  const choice = prompt(`Choose font:\n${fontList}\nEnter number (1-${fonts.length}):`, '1');
  
  if (choice && choice >= 1 && choice <= fonts.length) {
    document.execCommand('fontName', false, fonts[choice - 1]);
  }
}

function addLink() {
  const url = prompt('Enter URL:', 'https://');
  const text = prompt('Enter link text:', 'Click here');
  
  if (url && text) {
    const link = `<a href="${url}" target="_blank" style="color: #ffd700; text-decoration: underline;">${text}</a>`;
    document.execCommand('insertHTML', false, link);
  }
}

function addNewPage() {
  const pageTitle = prompt('Enter new page title:', 'New Page');
  if (!pageTitle) return;
  
  // Get current wiki pages or create new array
  let wikiPages = JSON.parse(localStorage.getItem('wikiPages') || '[]');
  
  // Create new page
  const newPage = {
    id: Date.now(),
    title: pageTitle,
    content: `<h2>${pageTitle}</h2><p>This is a new wiki page. Start editing!</p>`,
    created: new Date().toISOString()
  };
  
  wikiPages.push(newPage);
  localStorage.setItem('wikiPages', JSON.stringify(wikiPages));
  
  // Add link to current page
  const pageLink = `<a href="#" onclick="openWikiPage(${newPage.id})" style="color: #ffd700; text-decoration: underline;">${pageTitle}</a>`;
  document.execCommand('insertHTML', false, `<p>ðŸ“„ ${pageLink}</p>`);
  
  alert(`Page "${pageTitle}" created! Click the link to open it.`);
}

function openWikiPage(pageId) {
  const wikiPages = JSON.parse(localStorage.getItem('wikiPages') || '[]');
  const page = wikiPages.find(p => p.id === pageId);
  
  if (page) {
    // Replace current wiki content with the page content
    const wikiMainContent = document.querySelector('.wiki-main-content');
    if (wikiMainContent) {
      wikiMainContent.innerHTML = page.content;
      
      // Add page title indicator
      const titleIndicator = document.createElement('div');
      titleIndicator.style.cssText = 'background: #ffd700; color: #222; padding: 10px; margin-bottom: 20px; border-radius: 5px; font-weight: bold;';
      titleIndicator.textContent = `ðŸ“„ ${page.title}`;
      wikiMainContent.insertBefore(titleIndicator, wikiMainContent.firstChild);
    }
    
    // Enable editing for this page
    enableWikiEditing();
  }
}

function toggleFullEdit() {
  const wikiContainer = document.querySelector('.wiki-container');
  const allElements = wikiContainer.querySelectorAll('*');
  
  allElements.forEach(element => {
    if (element.contentEditable !== 'inherit') {
      element.contentEditable = element.contentEditable === 'true' ? 'false' : 'true';
      if (element.contentEditable === 'true') {
        element.style.border = element.style.border || '1px dashed #ffd700';
        element.style.padding = element.style.padding || '5px';
      } else {
        element.style.border = '';
        element.style.padding = '';
      }
    }
  });
  
  alert('Full editing toggled! Now you can edit everything including headers, sidebar, and all elements.');
}

function addImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = `<img src="${event.target.result}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;">`;
      document.execCommand('insertHTML', false, img);
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function setupImageDragAndDrop() {
  const wikiMainContent = document.querySelector('.wiki-main-content');
  
  wikiMainContent.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
  });
  
  wikiMainContent.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '';
  });
  
  wikiMainContent.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.backgroundColor = '';
    
    const files = e.dataTransfer.files;
    for (let file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = `<img src="${event.target.result}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;">`;
          document.execCommand('insertHTML', false, img);
        };
        reader.readAsDataURL(file);
      }
    }
  });
}

function saveWikiChanges() {
  // Get the entire wiki container content
  const wikiContainer = document.querySelector('.wiki-container');
  if (wikiContainer) {
    const newContent = wikiContainer.innerHTML;
    
    // Save to localStorage with a specific wiki key
    localStorage.setItem('customWikiContent', newContent);
    
    // Also update the pages object
    pages.wiki.content = newContent;
    saveData();
    
    alert('Wiki changes saved permanently! They will appear when you reload the page.');
  }
}

function disableWikiEditing() {
  const wikiMainContent = document.querySelector('.wiki-main-content');
  if (wikiMainContent) {
    wikiMainContent.contentEditable = false;
    wikiMainContent.style.border = '';
    wikiMainContent.style.padding = '';
  }
  
  const toolbar = document.getElementById('wikiEditToolbar');
  if (toolbar) {
    toolbar.remove();
  }
  
  // Refresh the wiki page to show saved version
  showPage('wiki');
}

function updateWikiWithMangaData() {
  // Clear any old wiki content
  localStorage.removeItem('customWikiContent');
  localStorage.removeItem('wikiContent');
  
  // Calculate stats
  const totalManga = 0;
  const totalChapters = 0;
  
  // Clean Fandom wiki HTML
  const wikiContentHtml = `
    <!-- Fandom Top Nav -->
    <div class="fandom-top-nav" style="
      background: #fff;
      border-bottom: 1px solid #ccc;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      margin-top: -10px;
    ">
      <img src="./wiki-logo.webp" alt="Logo" style="width: 32px; height: 32px;">
      <span style="font-weight: bold; color: #333;">Manga Wiki</span>
      <input type="text" placeholder="Search..." style="
        flex: 1;
        max-width: 300px;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-left: 20px;
      ">
      <a href="#" onclick="showPage('home')" style="color: #3366cc; text-decoration: none;">Home</a>
      <a href="#" onclick="showPage('manga')" style="color: #3366cc; text-decoration: none;">Explore</a>
    </div>

    <!-- Main Layout -->
    <div class="fandom-main-layout" style="display: flex; min-height: calc(100vh - 60px);">
      
      <!-- Left Sidebar -->
      <div class="fandom-left-sidebar" style="
        width: 200px;
        background: #f5f5f5;
        border-right: 1px solid #ccc;
        padding: 20px;
      ">
        <h4 style="margin: 0 0 15px 0; color: #333; font-size: 14px;">Navigation</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 8px;"><a href="#" style="color: #3366cc; text-decoration: none; font-size: 13px;">Main Page</a></li>
          <li style="margin-bottom: 8px;"><a href="#" style="color: #3366cc; text-decoration: none; font-size: 13px;">Recent Changes</a></li>
          <li style="margin-bottom: 8px;"><a href="#" style="color: #3366cc; text-decoration: none; font-size: 13px;">All Manga</a></li>
          <li style="margin-bottom: 8px;"><a href="#" style="color: #3366cc; text-decoration: none; font-size: 13px;">Characters</a></li>
        </ul>
      </div>

      <!-- Center Content -->
      <div class="fandom-article-content" style="
        flex: 1;
        padding: 30px;
        background: #fff;
        max-width: 800px;
      ">
        <h1 style="margin: 0 0 10px 0; color: #222; font-size: 28px;">Manga Universe Wiki</h1>
        <p style="color: #666; margin-bottom: 30px;">Welcome to the Manga Universe Wiki - your complete guide to all manga series!</p>
        
        <!-- Stats Box -->
        <div style="
          background: #f8f9fa;
          border: 1px solid #eaecf0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        ">
          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">ðŸ“Š Wiki Stats</h3>
          <p style="color: #666; margin: 0;">Content coming soon...</p>
        </div>

        <!-- Manga List -->
        <h2 style="color: #222; font-size: 20px; margin-bottom: 15px;">ðŸ“š Manga</h2>
        <p style="color: #666;">Manga system coming soon...</p>
      </div>

      <!-- Right Sidebar -->
      <div class="fandom-right-sidebar" style="
        width: 250px;
        background: #f5f5f5;
        border-left: 1px solid #ccc;
        padding: 20px;
      ">
        <div style="
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        ">
          <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Quick Links</h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 6px;"><a href="#" style="color: #3366cc; font-size: 12px; text-decoration: none;">Latest Updates</a></li>
            <li style="margin-bottom: 6px;"><a href="#" style="color: #3366cc; font-size: 12px; text-decoration: none;">Popular Manga</a></li>
            <li style="margin-bottom: 6px;"><a href="#" style="color: #3366cc; font-size: 12px; text-decoration: none;">New Releases</a></li>
          </ul>
        </div>

        <div style="
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
        ">
          <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Categories</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 5px;">
            <span style="background: #e8f0ff; color: #3366cc; padding: 3px 8px; border-radius: 12px; font-size: 11px;">Action</span>
            <span style="background: #e8f0ff; color: #3366cc; padding: 3px 8px; border-radius: 12px; font-size: 11px;">Romance</span>
            <span style="background: #e8f0ff; color: #3366cc; padding: 3px 8px; border-radius: 12px; font-size: 11px;">Fantasy</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Set the wiki content
  const wikiContentElement = document.querySelector('.middle-tab-content #wikiContent');
  if (wikiContentElement) {
    wikiContentElement.innerHTML = wikiContentHtml;
    wikiContentElement.closest('.middle-tab-content').classList.add('wiki-active');
    
    // Fade out loading screen
    setTimeout(() => {
      const loadingScreen = document.querySelector('.middle-tab-content #wikiLoadingScreen');
      if (loadingScreen) loadingScreen.classList.add('fade-out');
      
      setTimeout(() => {
        wikiContentElement.classList.add('show');
      }, 250);
    }, 500);
  }
}
function addArtwork() {
  const fileInput = document.getElementById('artworkFile');
  const file = fileInput.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Create a temporary URL for the new artwork
      const imageUrl = e.target.result;
      
      // Add new artwork to the work page
      const artworkTitle = `Artwork ${Date.now()}`; // Unique title based on timestamp
      const newArtwork = `
        <div class="artwork-item" data-src="${imageUrl}" data-title="${artworkTitle}">
          <img src="${imageUrl}" alt="${artworkTitle}">
        </div>
      `;
      
      // Insert before the closing div
      const workContent = pages.work.content;
      const insertPoint = workContent.lastIndexOf('</div>');
      pages.work.content = workContent.slice(0, insertPoint) + newArtwork + workContent.slice(insertPoint);
      
      saveData(); // Save to localStorage
      
      // Refresh the work page if it's currently displayed to ensure new images work
      if (tabContent.innerHTML.includes('My Work')) {
        showPage('work');
      }
      
      // Update the artwork dropdown
      updateArtworkSelect();
      
      fileInput.value = '';
      playSound('tabClick', 0);
    };
    reader.readAsDataURL(file);
  }
}

function removeArtwork() {
  const select = document.getElementById('artworkSelect');
  const selectedIndex = parseInt(select.value);
  
  if (isNaN(selectedIndex)) {
    alert('Please select artwork to remove!');
    return;
  }
  
  // Remove the selected artwork
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = pages.work.content;
  const artworkItems = tempDiv.querySelectorAll('.artwork-item');
  
  if (artworkItems[selectedIndex]) {
    artworkItems[selectedIndex].remove();
    pages.work.content = tempDiv.innerHTML;
    
    saveData(); // Save to localStorage
    
    // Refresh the work page if it's currently displayed
    if (tabContent.innerHTML.includes('My Work')) {
      showPage('work');
    }
    
    // Update the artwork dropdown
    updateArtworkSelect();
    
    playSound('tabClick', 0);
  }
}

const mangaCoverImage = "./SHOWERTHOUGHTS.webp";

const mangaInfo = {
  title: "Shower Thoughts",
  cover: "./SHOWERTHOUGHTS.webp",
  synopsis: "A contemplative journey through the deepest thoughts that emerge in the most mundane moments. When the water runs and steam rises, profound revelations surface from the subconscious."
};

function showMangaCover() {
  // Remove any existing manga cover or modal
  const existingCover = document.getElementById('mangaCoverOverlay');
  if (existingCover) {
    existingCover.remove();
  }
  const existingModal = document.getElementById('mangaDetailModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create standalone manga cover
  const coverHTML = `
    <div id="mangaCoverOverlay" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.8);
    ">
      <button onclick="exitMangaCover()" style="
        position: absolute;
        top: 20px;
        left: 20px;
        padding: 10px 20px;
        background: rgba(255,0,0,0.8);
        border: 2px solid #ff0000;
        border-radius: 8px;
        color: white;
        font-family: 'Press Start 2P', cursive;
        font-size: 12px;
        cursor: pointer;
        z-index: 10000;
      ">✕ Exit</button>
      <img src="${mangaCoverImage}" alt="Manga Cover" style="
        max-width: 400px;
        max-height: 80vh;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.9);
        border: 3px solid rgba(255,215,0,0.5);
        animation: mangaCoverFadeIn 0.3s ease-out;
      " onclick="openMangaDetail()">
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', coverHTML);
  // Removed duplicate sound - only play when opening, not when closing
}

function closeMangaCover() {
  const overlay = document.getElementById('mangaCoverOverlay');
  if (overlay) {
    overlay.remove();
  }
}

function exitMangaCover() {
  playSound('exit', 0);
  const overlay = document.getElementById('mangaCoverOverlay');
  if (overlay) {
    overlay.remove();
  }
  const modal = document.getElementById('mangaDetailModal');
  if (modal) {
    modal.remove();
  }
}

function openMangaDetail() {
  // Close the cover overlay first
  closeMangaCover();
  const modalHTML = `
    <div id="mangaDetailModal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.95);
    ">
      <button onclick="exitMangaDetail()" style="
        position: absolute;
        top: 20px;
        left: 20px;
        padding: 10px 20px;
        background: rgba(255,0,0,0.8);
        border: 2px solid #ff0000;
        border-radius: 8px;
        color: white;
        font-family: 'Press Start 2P', cursive;
        font-size: 12px;
        cursor: pointer;
        z-index: 10001;
      ">✕ Exit</button>
      <button onclick="backToMangaCover()" style="
        position: absolute;
        top: 20px;
        left: 140px;
        padding: 10px 20px;
        background: rgba(255,215,0,0.8);
        border: 2px solid #ffd700;
        border-radius: 8px;
        color: #222;
        font-family: 'Press Start 2P', cursive;
        font-size: 12px;
        cursor: pointer;
        z-index: 10001;
      ">← Back</button>
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: mangaCoverFadeIn 0.3s ease-out;
      ">
        <h1 style="
          color: #ffd700;
          font-family: 'Press Start 2P', cursive;
          font-size: 36px;
          margin-bottom: 40px;
          text-align: center;
          text-shadow: 0 0 20px rgba(255,215,0,0.5);
        ">COMING SOON</h1>
        
        <div style="display: flex; gap: 40px; align-items: center;">
          <img src="${mangaInfo.cover}" alt="Manga Cover" style="
            max-width: 300px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.9);
            border: 3px solid rgba(255,215,0,0.5);
          ">
          
          <div style="max-width: 400px;">
            <h2 style="
              color: #ffd700;
              font-family: 'Press Start 2P', cursive;
              font-size: 20px;
              margin-bottom: 20px;
            ">${mangaInfo.title}</h2>
            
            <p style="
              color: white;
              font-size: 16px;
              line-height: 1.6;
            ">${mangaInfo.synopsis}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  // Removed duplicate sound - only play when opening the cover, not when opening detail
}

function closeMangaDetail() {
  const modal = document.getElementById('mangaDetailModal');
  if (modal) {
    modal.remove();
  }
}

function backToMangaCover() {
  playSound('back', 0);
  const modal = document.getElementById('mangaDetailModal');
  if (modal) {
    modal.remove();
  }
  showMangaCover();
}

function exitMangaDetail() {
  playSound('exit', 0);
  const modal = document.getElementById('mangaDetailModal');
  if (modal) {
    modal.remove();
  }
}

function openMangaTab(mangaId) {
  showMangaCover();
}

// --- Q&A Page Functions ---
let qaCurrentCharacter = 1;
let qaCurrentStyle = 'sketch';

const qaCharacterImages = {
  1: { sketch: './character1_sketch.webp', flat: './character1_flat.webp', rendered: './character1_rendered.webp' },
  2: { sketch: './character2_sketch.webp', flat: './character2_flat.webp', rendered: './character2_rendered.webp' },
  3: { sketch: './character3_sketch.webp', flat: './character3_flat.webp', rendered: './character3_rendered.webp' },
  4: { sketch: './character4_sketch.webp', flat: './character4_flat.webp', rendered: './character4_rendered.webp' },
  5: { sketch: './character5_sketch.webp', flat: './character5_flat.webp', rendered: './character5_rendered.webp' }
};

function getQACharacterImage(char, style) {
  const img = qaCharacterImages[char] && qaCharacterImages[char][style] ? qaCharacterImages[char][style] : './girl 1.webp';
  return img;
}

function showQASection(section) {
  document.querySelectorAll('.qa-nav-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.qa-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('qa-' + section).classList.add('active');
  if (typeof playSound === 'function') {
    playSound('qaClick1', 0); // Newspaper foley sound for top nav tabs
  }
}

function switchCharacter(charNum) {
  qaCurrentCharacter = charNum;
  document.querySelectorAll('.char-btn').forEach((btn, index) => {
    btn.classList.toggle('active', index + 1 === charNum);
  });
  const img = document.getElementById('character-image');
  if (img) img.src = getQACharacterImage(charNum, qaCurrentStyle);
  if (typeof playSound === 'function') {
    playSound('qaClick2', 0); // Click bubble sound for C1-C5 buttons
  }
}

function switchCharacterStyle(style) {
  qaCurrentStyle = style;
  document.querySelectorAll('.style-circle').forEach((circle, index) => {
    const styles = ['sketch', 'flat', 'rendered'];
    circle.classList.toggle('active', styles[index] === style);
  });
  const img = document.getElementById('character-image');
  if (img) img.src = getQACharacterImage(qaCurrentCharacter, style);
  if (typeof playSound === 'function') {
    playSound('qaClick3', 0); // Bubble pop sound for style circles
  }
}

function closeQATab() {
  if (typeof playSound === 'function') {
    playSound('close', 0);
  }
  if (typeof showPage === 'function') {
    showPage('home');
  }
}

function togglePricingPanel() {
  const panel = document.querySelector('.pricing-panel');
  const btn = document.querySelector('.pricing-tab-btn');
  if (panel) {
    panel.classList.toggle('mobile-visible');
    if (btn) {
      btn.classList.toggle('active', panel.classList.contains('mobile-visible'));
    }
    if (typeof playSound === 'function') {
      playSound('qaClick4', 0); // Pop tap sound for pricing toggle
    }
  }
}

// ðŸŽ¯ Create circular favicon from JPG
function createCircularFavicon() {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    
    // Create circular clip
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Draw image
    ctx.drawImage(img, 0, 0, size, size);
    
    // Set as favicon
    const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
    if (!document.querySelector('link[rel="icon"]')) {
      document.head.appendChild(link);
    }
  };
  img.src = './profile website.webp';
}

// Run when page loads
createCircularFavicon();

// ====== FULL CONTENT PROTECTION ======
// Disable right-click on entire page
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
}, false);

// Disable dragging anything
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
  return false;
}, false);

// Disable text selection
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
  return false;
}, false);

// Block keyboard shortcuts for screenshots and DevTools
document.addEventListener('keydown', function(e) {
  // Print Screen
  if (e.key === 'PrintScreen' || e.keyCode === 44) {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+I (DevTools)
  if (e.shiftKey && e.key === 'I' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+J (Console)
  if (e.shiftKey && e.key === 'J' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+C (Inspect Element)
  if (e.shiftKey && e.key === 'C' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+U (View Source)
  if (e.key === 'U' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+S (Save Page)
  if (e.key === 'S' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+P (Print)
  if (e.key === 'P' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
}, false);

// Clear clipboard when window loses focus (anti-screenshot)
document.addEventListener('blur', function() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText('').catch(function(){});
  }
});

// --- AI Companion Functions ---
let aiCompanionActive = false;
let aiTypingTimeout = null;
let aiBubbleHideTimeout = null;
let aiTypingSoundTimeout = null;
let aiIdleSmallTalkTimeout = null;
let aiIdleSpeakAbortToken = 0;
let aiUsedIdleScripts = new Set();

/** Five-line idle monologues when the user hasn't pressed a topic button (~5s quiet) */
const AI_IDLE_SMALL_TALK_SCRIPTS = [
  ['Alright... what was I saying again...', "No, wait, that doesn't sound right.", 'It made more sense a second ago.', "Whatever. I'll just go with it.", "It's not like anyone's correcting me."],
  ['I keep losing my train of thought lately.', "It's like it's there, then it just... gone.", "Maybe I'm overthinking it.", 'Yeah, I do that a lot.', 'Still, not the worst habit to have.'],
  ['I should probably say something more interesting.', 'That would help.', 'But then again, forcing it usually makes it worse.', 'So... this is fine.', 'I think this is fine.'],
  ["I'm kind of just talking to fill the space now.", "Not sure if that's a good thing.", 'Feels better than stopping, though.', 'Stopping makes it feel... empty.', "Yeah. I'll keep going."]
  ["Wow, that was not as smooth as I thought it'd be.", 'I really thought I had something there.', 'Nope.', 'Completely fell apart.', 'Impressive, honestly.'],
  ["It's weird how quiet things get.", "Like... suddenly there's too much room to think.", 'And then everything just kind of echoes.', "I don't always like that part.", 'But I stay anyway.'],
  ['I keep hearing myself talk.', "Even when I stop, it feels like it didn't end.", "Like something's still continuing.", "Maybe it's just me.", 'Yeah... probably just me.'],
  ['Okay, okay... just keep it simple.', 'No need to overdo it.', 'Just say what comes to mind.', 'That usually works.', 'Well... most of the time.'],
  ["It's been a pretty slow day.", 'Nothing really stood out, just the usual stuff.', 'I kinda like days like that, though.', 'Everything feels lighter when nothing big happens.', 'You can just exist for a bit.'],
  ["I was walking earlier and didn't really have anywhere to be.", 'Ended up taking the long way without thinking about it.', "Didn't even check the time.", 'It felt nice, not rushing for once.', "I don't do that enough."]
  ["I've been thinking about changing things up a little.", 'Not anything big, just small stuff.', 'Like routines, I guess.', 'Doing the same things every day gets kind of dull.', 'A small change might help.'],
  ["You don't really have to say anything.", "I'm okay just talking like this.", "It's kinda peaceful.", "Feels like the kind of quiet that isn't awkward.", 'Just... there.'],
  ["It's weird how some moments stick more than others.", 'Even small ones.', 'Like nothing special was happening, but it still felt important.', "I can't really explain why.", 'It just did.'],
  ['I tried to be productive earlier.', "Didn't go as planned.", 'Got distracted halfway through.', 'Honestly, not even surprised anymore.', "That's just how it goes sometimes."]
  ["I don't mind this kind of quiet.", "It feels different when someone's still here.", "Even if nothing's being said back.", "It's not empty.", 'Just calm.'],
  ["I'll keep talking for a bit.", 'No real reason to stop.', "This moment hasn't ended yet.", "So I'll stay in it.", 'At least a little longer.']
];

function clearAiIdleSmallTalkTimer() {
  if (aiIdleSmallTalkTimeout) {
    clearTimeout(aiIdleSmallTalkTimeout);
    aiIdleSmallTalkTimeout = null;
  }
}

function abortAiIdleMonologue() {
  aiIdleSpeakAbortToken += 1;
}

/** Stop pending idle timer and cancel any in-progress idle line chain (user acted or AI closed). */
function clearAiIdleSmallTalk() {
  clearAiIdleSmallTalkTimer();
  abortAiIdleMonologue();
  aiUsedIdleScripts.clear();
}

function scheduleAiIdleSmallTalk(delayMs) {
  clearAiIdleSmallTalkTimer();
  if (!aiCompanionActive) return;
  aiIdleSmallTalkTimeout = setTimeout(() => {
    aiIdleSmallTalkTimeout = null;
    runAiIdleSmallTalk();
  }, delayMs);
}

function speakIdleScriptLines(lines, index) {
  if (!aiCompanionActive) return;
  if (!lines || !Array.isArray(lines) || index >= lines.length) {
    scheduleAiIdleSmallTalk(10000);
    return;
  }
  const myToken = aiIdleSpeakAbortToken;
  aiSpeak(lines[index], () => {
    setTimeout(() => {
      if (myToken !== aiIdleSpeakAbortToken || !aiCompanionActive) return;
      speakIdleScriptLines(lines, index + 1);
    }, 400);
  });
}

function runAiIdleSmallTalk() {
  if (!aiCompanionActive) return;
  if (aiTypingTimeout) {
    scheduleAiIdleSmallTalk(1200);
    return;
  }

  // Get available scripts (not used yet)
  const availableIndices = AI_IDLE_SMALL_TALK_SCRIPTS.map((_, i) => i).filter(i => !aiUsedIdleScripts.has(i));

  // If all scripts used, reset the tracking
  if (availableIndices.length === 0) {
    aiUsedIdleScripts.clear();
    availableIndices.push(...AI_IDLE_SMALL_TALK_SCRIPTS.map((_, i) => i));
  }

  // Pick random available script
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  aiUsedIdleScripts.add(randomIndex);

  const script = AI_IDLE_SMALL_TALK_SCRIPTS[randomIndex];
  if (script && Array.isArray(script)) {
    speakIdleScriptLines(script, 0);
  } else {
    scheduleAiIdleSmallTalk(10000);
  }
}

function startAITypingSound() {
  stopAITypingSound();
  const playTypingTick = () => {
    if (!aiCompanionActive) return;
    playSound('typing', 0);
    aiTypingSoundTimeout = setTimeout(playTypingTick, 80 + Math.floor(Math.random() * 70));
  };
  playTypingTick();
}

function stopAITypingSound() {
  if (aiTypingSoundTimeout) {
    clearTimeout(aiTypingSoundTimeout);
    aiTypingSoundTimeout = null;
  }
}

const AI_GREETINGS = [
  "Hi! Lazyman_XD here. What can I do for you?",
  "Ohhh, you're back! What can I do for you this time?",
  "Back at it again, I see? What's up?",
  "Hey there, welcome back! Need anything?",
  "You just can't stay away, huh? What do you need?",
  "Here we go again! What can I help you with?",
  "Welcome back! Lazyman_XD at your service.",
  "Oh, it's you again! What's on your mind?"
];
const AI_VISIT_KEY = 'aiVisitCount_v1';

function getAIGreeting() {
  const count = parseInt(localStorage.getItem(AI_VISIT_KEY) || '0', 10);
  const idx = Math.min(count, AI_GREETINGS.length - 1);
  return AI_GREETINGS[idx];
}

function bumpAIVistCount() {
  const count = parseInt(localStorage.getItem(AI_VISIT_KEY) || '0', 10);
  localStorage.setItem(AI_VISIT_KEY, String(count + 1));
}

function openAICompanion() {
  clearAiIdleSmallTalk();
  const companion = document.getElementById('aiCompanion');
  const orb = document.getElementById('aiOrb');
  const optionsContainer = document.getElementById('aiOptions');
  const navButtons = document.querySelector('.nav-buttons');

  // Show companion in center
  companion.classList.add('active', 'center');
  companion.classList.remove('top-left');
  orb.classList.remove('speaking');
  aiCompanionActive = true;

  // Hide nav buttons
  if (navButtons) navButtons.classList.add('hidden');

  playSound('open', 0);

  // Hide options initially
  if (optionsContainer) optionsContainer.classList.remove('show');

  // Pick greeting based on how many times the user has returned
  const greeting = getAIGreeting();

  // After greeting, move to top-left
  setTimeout(() => {
    aiSpeak(greeting, () => {
      scheduleAiIdleSmallTalk(10000);
    });
  }, 500);

  // Move to top-left after speaking and show options
  setTimeout(() => {
    companion.classList.remove('center');
    companion.classList.add('top-left');
    if (optionsContainer) optionsContainer.classList.add('show');
  }, 3500);
}

function closeAICompanion() {
  clearAiIdleSmallTalk();
  const companion = document.getElementById('aiCompanion');
  const speechBubble = document.getElementById('aiSpeechBubble');
  const optionsContainer = document.getElementById('aiOptions');
  const navButtons = document.querySelector('.nav-buttons');

  companion.classList.remove('active', 'center', 'top-left');
  speechBubble.classList.remove('show');
  if (optionsContainer) optionsContainer.classList.remove('show');
  if (aiTypingTimeout) {
    clearTimeout(aiTypingTimeout);
    aiTypingTimeout = null;
  }
  if (aiBubbleHideTimeout) {
    clearTimeout(aiBubbleHideTimeout);
    aiBubbleHideTimeout = null;
  }
  stopAITypingSound();
  aiCompanionActive = false;

  // Track that the user visited the AI once; next open gets a return greeting
  bumpAIVistCount();

  // Show nav buttons again
  if (navButtons) navButtons.classList.remove('hidden');

  // Show roadmap button since we're back on home
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = '';

  // Clean up any AI overlays
  hideMangaCoversForAI();
  hidePopupImage();

  playSound('close', 0);
}

function aiSpeak(text, callback) {
  const speechBubble = document.getElementById('aiSpeechBubble');
  const speechText = document.getElementById('aiSpeechText');
  const typingCursor = document.getElementById('aiTypingCursor');
  const orb = document.getElementById('aiOrb');

  // Clear previous text
  if (aiTypingTimeout) {
    clearTimeout(aiTypingTimeout);
    aiTypingTimeout = null;
  }
  if (aiBubbleHideTimeout) {
    clearTimeout(aiBubbleHideTimeout);
    aiBubbleHideTimeout = null;
  }
  stopAITypingSound();
  speechText.textContent = '';
  typingCursor.style.display = 'inline-block';
  speechBubble.classList.add('show');
  orb.classList.add('speaking');
  startAITypingSound();

  // Typing effect
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      speechText.textContent += text.charAt(i);
      i++;
      aiTypingTimeout = setTimeout(typeChar, 50);
    } else {
      // Done typing
      aiTypingTimeout = null;
      typingCursor.style.display = 'none';
      orb.classList.remove('speaking');
      stopAITypingSound();
      aiBubbleHideTimeout = setTimeout(() => {
        speechBubble.classList.remove('show');
        aiBubbleHideTimeout = null;
      }, 3000);
      // Execute callback if provided
      if (callback && typeof callback === 'function') {
        setTimeout(callback, 500);
      }
      // Always schedule idle smalltalk if AI is still active
      if (aiCompanionActive) {
        scheduleAiIdleSmallTalk(10000);
      }
    }
  }
  typeChar();
}

let aiPopupOverlay = null;
let aiPopupTimeout = null;

function showPopupImage(src, label, durationMs = 3000) {
  // Reuse overlay DOM node instead of creating/destroying repeatedly
  if (!aiPopupOverlay) {
    aiPopupOverlay = document.createElement('div');
    aiPopupOverlay.className = 'ai-popup-overlay';
    aiPopupOverlay.style.display = 'none';
    document.body.appendChild(aiPopupOverlay);
  }

  // Cancel any pending hide
  if (aiPopupTimeout) {
    clearTimeout(aiPopupTimeout);
    aiPopupTimeout = null;
  }

  // Swap content fresh so CSS animation restarts
  aiPopupOverlay.innerHTML = '';
  aiPopupOverlay.style.display = 'flex';

  const img = document.createElement('img');
  img.src = src;
  img.className = 'ai-popup-image';
  img.alt = label || '';
  aiPopupOverlay.appendChild(img);

  if (label) {
    const lbl = document.createElement('div');
    lbl.className = 'ai-popup-label';
    lbl.textContent = label;
    aiPopupOverlay.appendChild(lbl);
  }

  aiPopupTimeout = setTimeout(() => {
    if (aiPopupOverlay) aiPopupOverlay.style.display = 'none';
  }, durationMs);
}

function hidePopupImage() {
  if (aiPopupTimeout) {
    clearTimeout(aiPopupTimeout);
    aiPopupTimeout = null;
  }
  if (aiPopupOverlay) {
    aiPopupOverlay.style.display = 'none';
  }
}

function showCommissionPricing() {
  // Hide AI options temporarily
  const optionsContainer = document.getElementById('aiOptions');
  if (optionsContainer) optionsContainer.classList.remove('show');
  
  // Create pricing dialog
  const pricingDialog = document.createElement('div');
  pricingDialog.id = 'commissionPricingDialog';
  pricingDialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(10, 20, 30, 0.98);
    border: 2px solid rgba(255, 215, 0, 0.5);
    border-radius: 15px;
    padding: 25px;
    max-width: 400px;
    width: 90%;
    z-index: 10001;
    box-shadow: 0 10px 40px rgba(255, 180, 0, 0.4);
  `;
  
  pricingDialog.innerHTML = `
    <h3 style="color: #ffd700; font-size: 14px; margin-bottom: 15px; text-align: center;">Commission Pricing</h3>
    <div style="color: #ffffff; font-size: 10px; line-height: 1.8;">
      <p><strong>Sketch:</strong> $25 - $50</p>
      <p><strong>Line Art:</strong> $50 - $100</p>
      <p><strong>Full Color:</strong> $100 - $250</p>
      <p><strong>Character Design:</strong> $150 - $300</p>
      <p><strong>Complex Scene:</strong> $250+</p>
      <br>
      <p style="color: #aaa; font-size: 9px;">Prices vary based on complexity and details. Contact me for a custom quote!</p>
    </div>
    <button onclick="closeCommissionPricing()" style="
      margin-top: 20px;
      width: 100%;
      padding: 12px;
      background: rgba(255, 200, 0, 0.2);
      border: 1px solid rgba(255, 215, 0, 0.5);
      border-radius: 8px;
      color: #ffffff;
      font-family: 'Press Start 2P', cursive;
      font-size: 10px;
      cursor: pointer;
    ">Got it!</button>
  `;
  
  document.body.appendChild(pricingDialog);
  playSound('tabClick', 0);
}

function closeCommissionPricing() {
  const dialog = document.getElementById('commissionPricingDialog');
  if (dialog) dialog.remove();
  
  // Show AI options again
  const optionsContainer = document.getElementById('aiOptions');
  if (optionsContainer) optionsContainer.classList.add('show');
  if (aiCompanionActive) {
    scheduleAiIdleSmallTalk(10000);
  }
}

let aiMangaCoversOverlay = null;

function showMangaCoversForAI() {
  if (aiMangaCoversOverlay) {
    aiMangaCoversOverlay.remove();
    aiMangaCoversOverlay = null;
  }

  const overlay = document.createElement('div');
  overlay.id = 'aiMangaCoversOverlay';

  const viewportWidth = window.innerWidth;
  const isMobile = viewportWidth <= 480;
  const cardW = isMobile ? 90 : (viewportWidth <= 768 ? 130 : 170);
  const cardH = isMobile ? 130 : (viewportWidth <= 768 ? 190 : 250);
  const gap = isMobile ? 10 : 20;
  const pad = isMobile ? 8 : 16;

  overlay.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: ${gap}px;
    z-index: 9999;
    padding: ${pad}px;
    background: rgba(10, 10, 25, 0.85);
    border-radius: 16px;
    border: 1px solid rgba(255, 215, 0, 0.3);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    max-width: 95vw;
    flex-wrap: wrap;
    justify-content: center;
  `;

  const mangaData = [
    { key: 'witchesEnd', title: "Witch's End" },
    { key: 'showerThoughts', title: 'Shower Thoughts' },
    { key: 'lastIllsins', title: 'Last 3 Sins' }
  ];

  mangaData.forEach(manga => {
    const data = mangaGalleryData.find(m => m.coverKey === manga.key);
    if (!data || !data.src) return;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      width: ${cardW}px;
      height: ${cardH}px;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid rgba(255, 215, 0, 0.4);
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      flex-shrink: 0;
    `;

    const img = document.createElement('img');
    img.src = data.src;
    img.alt = manga.title;
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';

    wrapper.appendChild(img);
    overlay.appendChild(wrapper);
  });

  document.body.appendChild(overlay);
  aiMangaCoversOverlay = overlay;

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
  });
}

function hideMangaCoversForAI() {
  if (aiMangaCoversOverlay) {
    aiMangaCoversOverlay.style.opacity = '0';
    setTimeout(() => {
      if (aiMangaCoversOverlay) {
        aiMangaCoversOverlay.remove();
        aiMangaCoversOverlay = null;
      }
    }, 400);
  }
}

function askAI(topic) {
  playSound('click', 0);
  clearAiIdleSmallTalk();

  // Hide any manga covers or popups from previous dialog
  hideMangaCoversForAI();
  hidePopupImage();

  if (topic === 'roadmap') {
    aiSpeak("I made a roadmap to organize my work!", function() {
      aiSpeak("So I don't try to do everything at once.", function() {
        aiSpeak("I don't expect these projects to be finished in a day or a week.", function() {
          aiSpeak("It may take years depending on my mood and pace.", function() {
            if (roadmapOverlay && !roadmapOverlay.classList.contains('show')) {
              toggleRoadmapOverlay();
            }
            aiSpeak("I'll keep sharing updates here on my website and on my Reddit.", function() {
              scheduleAiIdleSmallTalk(10000);
            });
          });
        });
      });
    });
    return;
  }

  if (topic === 'commissions') {
    aiSpeak("Yes! I do art commissions!", function() {
      aiSpeak("If you're interested, feel free to reach out! Check the Work section to see examples of my art style.", function() {
        aiSpeak("Here's my pricing info:", function() {
          showCommissionPricing();
          scheduleAiIdleSmallTalk(10000);
        });
      });
    });
    return;

  } else if (topic === 'artworks') {
    aiSpeak("I've created lots of artwork over the years!", function() {
      aiSpeak("From digital illustrations to character designs.", function() {
        showPopupImage('./folder-icon.webp', 'Work / Artworks');
        aiSpeak("Head over to the Work section to browse through my gallery!", function() {
          scheduleAiIdleSmallTalk(10000);
        });
      });
    });
    return;

  } else if (topic === 'mangas') {
    aiSpeak("Oh, the manga section! I've been working on some manga projects.", function() {
      aiSpeak("There are stories, characters, and worlds I've built. Check the Manga button to dive into my creations!", function() {
        showMangaCoversForAI();
        aiSpeak("Wondering why some pages look unfinished?", function() {
          aiSpeak("I organized everything through a roadmap! Witch's End is a shorter story, so I finished it first.", function() {
            aiSpeak("Shower Thoughts is a fun series with multiple random chapters.", function() {
              aiSpeak("And Last 3 Sins is a huge epic with 3 main characters, each with their own storyline.", function() {
                aiSpeak("So don't expect everything at once — though you can expect random creative bursts from time to time!", function() {
                  hideMangaCoversForAI();
                  scheduleAiIdleSmallTalk(10000);
                });
              });
            });
          });
        });
      });
    });
    return;

  } else if (topic === 'books') {
    aiSpeak("I've been writing some stories too!", function() {
      aiSpeak("From the history of magical empires to tales of order and collapse.", function() {
        // Show book covers one by one
        const showBook = (index) => {
          if (index >= booksData.length) {
            aiSpeak("Check the Books section to read what I've written so far!", function() {
              scheduleAiIdleSmallTalk(10000);
            });
            return;
          }
          const book = booksData[index];
          showPopupImage(book.cover, book.title, 2500);
          aiSpeak(book.title, function() {
            setTimeout(() => showBook(index + 1), 400);
          });
        };
        showBook(0);
      });
    });
    return;

  } else if (topic === 'social') {
    aiSpeak("You can find me on DeviantArt and Reddit!", function() {
      aiSpeak("That's where I post updates about my projects.", function() {
        aiSpeak("I also have Twitter/X and Instagram. Check the Q&A section for direct links if you want to follow along or reach out!", function() {
          scheduleAiIdleSmallTalk(10000);
        });
      });
    });
    return;

  } else if (topic === 'who') {
    aiSpeak("I'm Lazyman_XD!", function() {
      aiSpeak("A creative soul who loves art, coding, and storytelling.", function() {
        aiSpeak("I made this website to showcase my work and connect with people like you!", function() {
          scheduleAiIdleSmallTalk(10000);
        });
      });
    });
    return;

  } else if (topic === 'why') {
    aiSpeak("Why am I here? Great question!", function() {
      aiSpeak("I exist to create, express myself, and share my passion with the world.", function() {
        aiSpeak("Every piece of art, every line of code — it's all part of my journey.", function() {
          scheduleAiIdleSmallTalk(10000);
        });
      });
    });
    return;

  } else if (topic === 'effort') {
    aiSpeak("Haha, fair question!", function() {
      aiSpeak("I put effort into this AI because I wanted something unique.", function() {
        aiSpeak("A way to interact with visitors that feels personal and fun.", function() {
          aiSpeak("Plus, I just really enjoy building cool stuff! Hope you like it!", function() {
            scheduleAiIdleSmallTalk(10000);
          });
        });
      });
    });
    return;

  } else if (topic === 'characters') {
    aiSpeak("They're just characters that might be future cameos in my manga.", function() {
      aiSpeak("You never know who might show up in the story!", function() {
        scheduleAiIdleSmallTalk(10000);
      });
    });
    return;

  } else if (topic === 'freeart') {
    aiSpeak("Hmm... drawing for free?", function() {
      aiSpeak("Does it put food on my table? No, it does not.", function() {
        aiSpeak("I pour hours of heart and soul into every piece I make.", function() {
          aiSpeak("Art is my passion, but passion alone doesn't pay the bills.", function() {
            aiSpeak("If you want to support a struggling artist, commissions are always open!", function() {
              scheduleAiIdleSmallTalk(10000);
            });
          });
        });
      });
    });
    return;

  } else if (topic === 'software') {
    aiSpeak("I use Clip Studio Paint for almost everything!", function() {
      aiSpeak("It's got amazing brushes and a solid comic panel workflow.", function() {
        aiSpeak("Highly recommend it if you're getting into digital art.", function() {
          scheduleAiIdleSmallTalk(10000);
        });
      });
    });
    return;

  } else if (topic === 'drawtime') {
    aiSpeak("It depends on my mood and laziness level, honestly.", function() {
      aiSpeak("A simple illustration? Could be done in a day or less.", function() {
        aiSpeak("But sometimes I stare at the canvas for hours doing absolutely nothing.", function() {
          aiSpeak("Comic panels take longer because of layouts, dialogue, and all that jazz.", function() {
            aiSpeak("So yeah... anywhere from a few hours to forever.", function() {
              scheduleAiIdleSmallTalk(10000);
            });
          });
        });
      });
    });
    return;

  } else {
    aiSpeak("Hmm, let me think about that...", function() {
      scheduleAiIdleSmallTalk(10000);
    });
    return;
  }
}

// CSS protection
(function() {
  const s = document.createElement('style');
  s.innerHTML = '*{-webkit-user-drag:none;-moz-user-drag:none;-o-user-drag:none;user-drag:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;font-family:"Press Start 2P",cursive !important;-webkit-font-smoothing:none;-moz-osx-font-smoothing:grayscale;}img{pointer-events:none;}';
  document.head.appendChild(s);
})();

