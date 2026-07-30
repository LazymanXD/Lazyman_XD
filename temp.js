// Elements
const loadingScreen = document.getElementById("loadingScreen");
const desktop = document.getElementById("desktop");
const middleTab = document.getElementById("middleTab");
const tabContent = document.getElementById("tabContent");
const roadmapToggleBtn = document.getElementById("roadmapToggleBtn");
const roadmapOverlay = document.getElementById("roadmapOverlay");

const BASE_SOUND_VOLUME = 0.18;
const TYPING_SOUND_VOLUME = 0.1;

function createAudioWithFallback(fileName) {
  const audio = new Audio(fileName);
  audio.preload = "auto";
  audio.volume = BASE_SOUND_VOLUME;
  audio.addEventListener("error", function tryParentFolder() {
    if (audio.dataset.usedFallback === "1") return;
    audio.dataset.usedFallback = "1";
    audio.src = "../" + fileName;
    audio.load();
  });
  return audio;
}

// 🎵 UI SOUNDS - Click sounds for buttons
const sounds = {
  open: createAudioWithFallback(
    "sounds/universfield-new-notification-09-352705.mp3",
  ),
  enter: createAudioWithFallback(
    "sounds/universfield-new-notification-09-352705.mp3",
  ),
  close: createAudioWithFallback(
    "sounds/dragon-studio-new-notification-3-398649.mp3",
  ),
  exit: createAudioWithFallback(
    "sounds/dragon-studio-new-notification-3-398649.mp3",
  ),
  back: createAudioWithFallback(
    "sounds/dragon-studio-new-notification-3-398649.mp3",
  ),
  minimize: createAudioWithFallback(
    "sounds/dragon-studio-new-notification-3-398649.mp3",
  ),
  maximize: createAudioWithFallback(
    "sounds/dragon-studio-new-notification-3-398649.mp3",
  ),
  click: createAudioWithFallback(
    "sounds/dragon-studio-new-notification-3-398649.mp3",
  ),
  infinite: createAudioWithFallback(
    "sounds/universfield-new-notification-09-352705.mp3",
  ),
  tabClick: createAudioWithFallback(
    "sounds/universfield-new-notification-09-352705.mp3",
  ),
  qaClick1: createAudioWithFallback(
    "sounds/floraphonic-newspaper-foley-15-196732.mp3",
  ),
  qaClick2: createAudioWithFallback(
    "sounds/koiroylers-click-bubble-351951.mp3",
  ),
  qaClick3: createAudioWithFallback("sounds/linhmitto-bubblepop-254773.mp3"),
  qaClick4: createAudioWithFallback(
    "sounds/virtual_vibes-pop-tap-click-fx-383733.mp3",
  ),
  typing: createAudioWithFallback("sounds/koiroylers-click-bubble-351951.mp3"),
};

let audioUnlocked = false;
let qaSoundIndex = 0;
const qaSoundKeys = ["qaClick1", "qaClick2", "qaClick3", "qaClick4"];

function isQAPage() {
  const currentContent = tabContent.innerHTML;
  return (
    currentContent.includes("qa-container") ||
    currentContent.includes("qa-top-nav")
  );
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  Object.values(sounds).forEach((sound) => {
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

  if (soundKey === "typing") {
    sound.volume = TYPING_SOUND_VOLUME;
  } else {
    sound.volume = BASE_SOUND_VOLUME;
  }

  sound.currentTime = 0;
  setTimeout(() => {
    sound.play().catch((err) => {
      console.warn("Sound play failed:", err.message);
    });
  }, delay);
}

document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

const settingsDrawer = document.getElementById("settingsDrawer");
const settingsRoadmapBtn = document.getElementById("settingsRoadmapBtn");
const settingsUpdateBtn = document.getElementById("settingsUpdateBtn");
const updatePanel = document.getElementById("updatePanel");
const updatePanelCloseBtn = document.getElementById("updatePanelCloseBtn");

function toggleSettingsDrawer() {
  if (!settingsDrawer) return;
  settingsDrawer.classList.toggle("show");
}

function closeSettingsDrawer() {
  if (!settingsDrawer) return;
  settingsDrawer.classList.remove("show");
}

function toggleRoadmapOverlay() {
  if (!roadmapOverlay) return;
  roadmapOverlay.classList.toggle("show");
}

function openUpdatePanel() {
  if (!updatePanel) return;
  updatePanel.classList.add("show");
  document.body.classList.add("update-panel-open");
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = "none";
  closeSettingsDrawer();
  const homeContent = document.getElementById("homeContentOutside");
  const navButtonsContainer = document.getElementById("navButtonsContainer");
  if (homeContent) homeContent.style.display = "none";
  if (navButtonsContainer) navButtonsContainer.style.display = "none";
}

function closeUpdatePanel() {
  if (!updatePanel) return;
  updatePanel.classList.remove("show");
  document.body.classList.remove("update-panel-open");
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = "";
  const homeContent = document.getElementById("homeContentOutside");
  const navButtonsContainer = document.getElementById("navButtonsContainer");
  if (homeContent) homeContent.style.display = "";
  if (navButtonsContainer) navButtonsContainer.style.display = "";
}

if (roadmapToggleBtn) {
  roadmapToggleBtn.addEventListener("click", () => {
    playSound("click", 0);
    toggleSettingsDrawer();
  });
}

if (settingsRoadmapBtn) {
  settingsRoadmapBtn.addEventListener("click", () => {
    playSound("click", 0);
    toggleRoadmapOverlay();
    closeSettingsDrawer();
  });
}

if (settingsUpdateBtn) {
  settingsUpdateBtn.addEventListener("click", () => {
    playSound("click", 0);
    openUpdatePanel();
  });
}

if (updatePanelCloseBtn) {
  updatePanelCloseBtn.addEventListener("click", () => {
    playSound("close", 0);
    closeUpdatePanel();
  });
}

// --- Slow Reveal Loading ---
window.addEventListener("load", () => {
  // Initialize mobile detection
  updateParticleCount();

  // Ensure AI companion is hidden on page load
  dismissAIForNav();

  // Safety fallback - always hide loading screen after max 3 seconds
  const safetyTimeout = setTimeout(() => {
    const loadingScreen = document.getElementById("loadingScreen");
    const desktop = document.getElementById("desktop");
    if (loadingScreen && !loadingScreen.classList.contains("hidden")) {
      loadingScreen.classList.add("hidden");
      if (desktop) desktop.classList.add("loaded");
    }
  }, 3000);

  try {
    // Load saved data from localStorage first
    loadSavedData();

    // Update UI galleries after loading data
    updateArtworkSelect();

    // Create fast reveal effect using loading screen
    setTimeout(() => {
      const loadingScreen = document.getElementById("loadingScreen");
      const desktop = document.getElementById("desktop");
      if (loadingScreen) loadingScreen.classList.add("hidden");
      if (desktop) desktop.classList.add("loaded");
      showPage("home"); // Always start with home page
      // Note: Welcome sound will play on first user interaction
      clearTimeout(safetyTimeout); // Cancel safety timeout since we succeeded
    }, 100); // Start reveal after 0.1 seconds

    // Defer non-critical optimizations
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setupImageLoadingOptimizations());
    } else {
      setTimeout(() => setupImageLoadingOptimizations(), 1000);
    }
  } catch (error) {
    console.error("Error during initialization:", error);
    // Even if there's an error, hide the loading screen and show the page
    const loadingScreen = document.getElementById("loadingScreen");
    const desktop = document.getElementById("desktop");
    if (loadingScreen) loadingScreen.classList.add("hidden");
    if (desktop) desktop.classList.add("loaded");
    showPage("home");
    clearTimeout(safetyTimeout);
  }
});

// Update artwork galleries after loading saved data
function updateArtworkSelect() {
  // Update the front artwork display if it exists
  const frontArtworkDisplay = document.getElementById("front-artwork-display");
  if (frontArtworkDisplay && window.frontSelectedArtwork) {
    frontArtworkDisplay.textContent = "";
    const artworkImage = document.createElement("img");
    artworkImage.src = window.frontSelectedArtwork;
    artworkImage.alt = "Selected Front Artwork";
    artworkImage.style.cssText =
      "width: 100%; height: 100%; object-fit: cover; border-radius: 10px;";
    frontArtworkDisplay.appendChild(artworkImage);
  }
}

// --- ESC Key Handler for Easy Exit ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllExpanded();
  }
});

// --- Wallpaper Mouse Movement (Smooth) ---
let wallpaperX = 50;
let wallpaperY = 50;
let targetX = 50;
let targetY = 50;

document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX;
  const windowWidth = window.innerWidth;
  const mouseY = e.clientY;
  const windowHeight = window.innerHeight;

  // Calculate target position (-10% to +10% for subtle effect)
  targetX = 50 + (mouseX / windowWidth - 0.5) * 20;
  targetY = 50 + (mouseY / windowHeight - 0.5) * 10;

  // Calculate wallpaper target position (inverted for parallax)
  wallpaperTargetX = (mouseX / windowWidth - 0.5) * -40;
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
  const wallpaper = document.querySelector(".wallpaper");
  if (wallpaper) {
    wallpaper.style.transform = `translateX(${wallpaperCurrentX}px)`;
  }

  requestAnimationFrame(animateWallpaper);
}

// Start the smooth animation
animateWallpaper();

// --- Particle System: Atmospheric Floating Dust ---
const particleCanvas = document.getElementById("particle-canvas");
let particleCtx = null;
let particles = [];
let PARTICLE_COUNT = 400;

// Frame throttling for mobile
let lastFrameTime = 0;
let FRAME_INTERVAL = 0;

// Global mobile detection (updated dynamically)
let isMobile = window.innerWidth < 768;

// Update particle count and mobile detection based on screen size
function updateParticleCount() {
  isMobile = window.innerWidth < 768;
  PARTICLE_COUNT = isMobile ? 50 : 400;
  FRAME_INTERVAL = isMobile ? 33 : 0;
}

// Pull-to-refresh state for mobile
let ptrStartY = 0;
let ptrCurrentY = 0;
let ptrActive = false;
let ptrTriggered = false;
let ptrIndicator = null;
let ptrTouchId = null;
const PTR_THRESHOLD = 80;
const PTR_MAX_PULL = 130;

function createPullToRefreshIndicator() {
  if (ptrIndicator) return ptrIndicator;
  ptrIndicator = document.createElement("div");
  ptrIndicator.id = "pullToRefreshIndicator";
  ptrIndicator.innerHTML = `
    <div class="ptr-icon">↻</div>
    <div class="ptr-text">Pull to refresh</div>
  `;
  document.body.appendChild(ptrIndicator);
  return ptrIndicator;
}

function updatePullToRefreshIndicator(pullDistance) {
  const indicator = createPullToRefreshIndicator();
  const offset = Math.min(PTR_MAX_PULL, pullDistance);
  const pct = Math.min(1, offset / PTR_THRESHOLD);
  const y = -120 + offset;
  indicator.style.transform = `translate(-50%, ${y}%)`;
  indicator.style.opacity = "1";
  const icon = indicator.querySelector(".ptr-icon");
  if (icon) {
    icon.style.transform = `rotate(${pct * 720}deg) scale(${0.9 + pct * 0.2})`;
  }
  const text = indicator.querySelector(".ptr-text");
  if (text) {
    text.textContent = ptrTriggered ? "Release to refresh" : "Pull to refresh";
  }
}

function resetPullToRefreshIndicator() {
  if (!ptrIndicator) return;
  ptrIndicator.style.transform = "translate(-50%, -120%)";
  ptrIndicator.style.opacity = "0";
  const icon = ptrIndicator.querySelector(".ptr-icon");
  if (icon) icon.style.transform = "rotate(0deg) scale(0.9)";
  const text = ptrIndicator.querySelector(".ptr-text");
  if (text) text.textContent = "Pull to refresh";
}

function shouldStartPullToRefresh() {
  return (
    window.scrollY <= 0 &&
    (document.documentElement.scrollTop || document.body.scrollTop) <= 0
  );
}

function initPullToRefresh() {
  createPullToRefreshIndicator();

  document.addEventListener(
    "touchstart",
    (e) => {
      if (!isMobile || ptrActive) return;
      if (!shouldStartPullToRefresh()) return;
      const touch = e.changedTouches[0];
      ptrStartY = touch.clientY;
      ptrCurrentY = ptrStartY;
      ptrActive = true;
      ptrTriggered = false;
      ptrTouchId = touch.identifier;
      updatePullToRefreshIndicator(0);
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!ptrActive || ptrTouchId === null) return;
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === ptrTouchId,
      );
      if (!touch) return;
      if (!shouldStartPullToRefresh()) {
        resetPullToRefreshIndicator();
        ptrActive = false;
        return;
      }
      const deltaY = touch.clientY - ptrStartY;
      if (deltaY <= 0) return;
      const pull = Math.min(PTR_MAX_PULL, deltaY);
      ptrTriggered = pull >= PTR_THRESHOLD;
      updatePullToRefreshIndicator(pull);
      e.preventDefault();
    },
    { passive: false },
  );

  document.addEventListener(
    "touchend",
    (e) => {
      if (!ptrActive || ptrTouchId === null) return;
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === ptrTouchId,
      );
      if (!touch) return;
      if (ptrTriggered) {
        const indicator = createPullToRefreshIndicator();
        const text = indicator.querySelector(".ptr-text");
        if (text) text.textContent = "Refreshing...";
        indicator.style.transform = "translate(-50%, 0%)";
        indicator.style.opacity = "1";
        setTimeout(() => window.location.reload(), 180);
      } else {
        resetPullToRefreshIndicator();
      }
      ptrActive = false;
      ptrTriggered = false;
      ptrTouchId = null;
    },
    { passive: true },
  );

  document.addEventListener("touchcancel", () => {
    resetPullToRefreshIndicator();
    ptrActive = false;
    ptrTriggered = false;
    ptrTouchId = null;
  });
}

// Mouse tracking for particle interaction
let mouseX = -1000;
let mouseY = -1000;

if (particleCanvas) {
  particleCtx = particleCanvas.getContext("2d");
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
  updateParticleCount();

  // Track mouse position
  particleCanvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  particleCanvas.addEventListener("mouseleave", () => {
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
      opacity: Math.random() * 0.1 + 0.9,
      pulse: Math.random() * Math.PI * 2,
      sweptSpeedX: 0,
      sweptSpeedY: 0,
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
      const force = ((sweepRadius - dist) / sweepRadius) * 3;
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
    const triangleWidth = particleCanvas.width * 0.9;
    const triangleHeight = particleCanvas.height * 0.4;
    const inTriangle =
      p.x < triangleWidth && p.y < triangleHeight * (1 - p.x / triangleWidth);
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
    particleCtx.arc(
      p.x + parallaxX,
      p.y + parallaxY,
      p.size * 2,
      0,
      Math.PI * 2,
    );
    particleCtx.fillStyle = `rgba(255, 250, 220, ${pulseOpacity * 0.3})`;
    particleCtx.fill();
  }
}

window.addEventListener("resize", () => {
  if (particleCanvas) {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Resize canvas
    particleCanvas.width = newWidth;
    particleCanvas.height = newHeight;

    // Update particle count based on new screen size
    updateParticleCount();

    // Regenerate particles to fill entire new canvas area
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * newWidth,
        y: Math.random() * newHeight,
        size: Math.random() * 0.8 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 - 0.1,
        opacity: Math.random() * 0.1 + 0.9,
        pulse: Math.random() * Math.PI * 2,
        sweptSpeedX: 0,
        sweptSpeedY: 0,
      });
    }
  }
});

// --- Nested Parallax Effect for Layers 1-5 ---
// Layer 1 moves slightly, Layer 2 moves more (within Layer 1), etc.
// Each layer stays constrained within its parent layer
const layerElements = {
  2: document.querySelector(".bg-layer-2"),
  3: document.querySelector(".bg-layer-3"),
  4: document.querySelector(".bg-layer-4"),
  5: document.querySelector(".bg-layer-5"),
};

// Movement multipliers - increasing from slowest (layer 1) to fastest (layer 5)
const layerSpeeds = {
  2: 4,
  3: 8,
  4: 12,
  5: 16,
};

// Current positions for smooth animation
const layerPositions = {
  2: { x: 0, y: 0 },
  3: { x: 0, y: 0 },
  4: { x: 0, y: 0 },
  5: { x: 0, y: 0 },
};

// Target positions
const layerTargets = {
  2: { x: 0, y: 0 },
  3: { x: 0, y: 0 },
  4: { x: 0, y: 0 },
  5: { x: 0, y: 0 },
};

// Max offset each layer can move (circular radius constraint)
const layerMaxRadius = {
  2: 15,
  3: 20,
  4: 25,
  5: 30,
};

// Throttled mouse tracking for performance
let mouseNormX = 0;
let mouseNormY = 0;

// Simple mouse tracking - no expensive calculations here
document.addEventListener("mousemove", (e) => {
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
  const shine = document.querySelector(".bg-layer-shine");
  if (shine) {
    const shineMove = mouseNormX * 20; // Move 20px left/right
    shine.style.transform = `translateX(${shineMove}px) translateZ(0)`;
  }

  // Animate FORGROUND - very slow movement
  const foreground = document.querySelector(".bg-layer-foreground");
  if (foreground) {
    const foregroundMove = mouseNormX * 2; // Very slow - only 2px
    foreground.style.transform = `translateX(${foregroundMove}px) translateZ(0)`;
  }

  // Update dust particles drifting through sunlight (with throttling on mobile)
  const now = performance.now();
  if (FRAME_INTERVAL === 0 || now - lastFrameTime >= FRAME_INTERVAL) {
    updateParticles();
    lastFrameTime = now;
  }

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
    layerElements[i].style.transform =
      `translate(calc(-50% + ${layerPositions[i].x}px), ${layerPositions[i].y}px)`;
  }

  // Skip parallax animation on mobile for performance
  if (!isMobile) {
    requestAnimationFrame(animateNestedParallax);
  }
}

// Start nested parallax animation
animateNestedParallax();

// ðŸŽ® ENHANCED Window controls - Multi-layered playful sounds
function closeMiddleTab(e) {
  e.stopPropagation();
  playSound("close", 0);
  playSound("click", 100);
  setTimeout(() => middleTab.classList.add("minimized"), 150);
  // Show roadmap button when returning to home
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = "";
}

function minimizeMiddleTab(e) {
  e.stopPropagation();
  playSound("tabClick", 0);
  setTimeout(() => {
    if (middleTab.classList.contains("maximized")) {
      // Add slow minimize animation
      middleTab.classList.add("slow-minimize");

      // Set final minimized state after animation
      setTimeout(() => {
        middleTab.classList.remove("slow-minimize");
        middleTab.classList.remove("maximized");
        middleTab.classList.add("minimized");
        document.body.classList.remove("window-maximized");
      }, 400);
    }
  }, 150);
}

function openMiddleTab() {
  playSound("infinite", 0);
  setTimeout(() => middleTab.classList.remove("minimized"), 150);
}

function maximizeMiddleTab(e) {
  e.stopPropagation();
  playSound("tabClick", 0);

  // Check if we're on the main/home page - if so, don't allow expansion
  const currentContent = tabContent.innerHTML;
  if (
    currentContent.includes("middle-tab-title") ||
    currentContent.includes("Lazyman_XD")
  ) {
    // We're on the home page, don't allow expansion
    return;
  }

  setTimeout(() => {
    if (middleTab.classList.contains("minimized"))
      middleTab.classList.remove("minimized");
    middleTab.classList.toggle("maximized");

    // Add/remove class to body for hiding icons
    if (middleTab.classList.contains("maximized")) {
      document.body.classList.add("window-maximized");
    } else {
      document.body.classList.remove("window-maximized");
    }
  }, 150);
}

// --- Drag (Smooth & Fast) ---
let isDragging = false;
let dragElement = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function dragStart(e, element) {
  if (!element || element.classList.contains("maximized")) return;
  if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;

  isDragging = true;
  dragElement = element;
  e.preventDefault();
  element.classList.add("dragging");
  document.body.style.userSelect = "none";

  const rect = element.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;

  // Smooth dragging with immediate updates
  function moveHandler(ev) {
    if (!isDragging || !dragElement) return;

    const newX = ev.clientX - dragOffsetX;
    const newY = ev.clientY - dragOffsetY;

    // Apply position immediately for fast response
    dragElement.style.left = newX + "px";
    dragElement.style.top = newY + "px";
  }

  function stop() {
    isDragging = false;
    dragElement = null;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", stop);

    // Remove dragging class from any element
    document.querySelectorAll(".dragging").forEach((el) => {
      el.classList.remove("dragging");
    });
  }

  document.addEventListener("mousemove", moveHandler);
  document.addEventListener("mouseup", stop, { once: true });
}

// --- Pages ---
const pages = {
  home: {
    title: "Lazyman_XD",
    subtitle: "manga artist and illustrator",
    buttons: [
      {
        icon: "<img src='./assets/me.webp' alt='Books' class='about-icon' style='object-fit: contain; background: transparent; border: none; padding: 0; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges;'>",
        label: "books",
        page: "books",
      },
      {
        icon: "<img src='./assets/folder-icon.webp' alt='Work' class='work-btn-shake' style='object-fit: contain; background: transparent; border: none; padding: 0;'>",
        label: "work",
        page: "work",
      },
      {
        icon: "<img src='./assets/manga.webp' alt='Manga' class='manga-icon' style='object-fit: contain; background: transparent; border: none; padding: 0; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges;'>",
        label: "manga",
        page: "manga",
      },
      {
        icon: "<img src='./assets/question.webp' alt='Q&A' style='object-fit: contain; background: transparent; border: none; padding: 0;'>",
        label: "Q&A",
        page: "faq",
        class: "qa-btn",
      },
      {
        icon: "<img src='./assets/wiki-logog.webp' alt='Wiki' style='object-fit: contain; background: transparent; border: none; padding: 0;'>",
        label: "wiki",
        page: "wiki",
      },
    ],
  },
  about: {
    content: `<style>.about-content { font-size: clamp(8px, 2vw, 11px); line-height: 1.5; width: 100%; max-width: 100%; margin: 0 auto; padding: 15px; box-sizing: border-box; overflow-wrap: break-word; word-wrap: break-word; } .about-content h2 { font-size: clamp(10px, 3vw, 14px); margin-bottom: 10px; } .about-content p { margin-top: 10px; }</style><div class="about-content"><h2>About Me</h2><p><strong>Lazyman</strong> is a passionate manga artist and illustrator dedicated to creating captivating visual stories. With a unique artistic style that blends traditional manga aesthetics with modern digital techniques, Lazyman brings characters and worlds to life.</p><p>I specialize in creating manga, character illustrations, and concept art. My work spans various genres from fantasy and adventure to slice-of-life and emotional dramas. Each piece is crafted with attention to detail and a deep love for storytelling.</p><p>Over the years, I've created numerous manga series and illustrations. Some of my notable works include fantasy epics, character-driven dramas, and experimental art pieces. Every project is a new adventure in creativity.</p><p>I'm always open to collaborations, commissions, and connecting with fellow artists. Feel free to explore my work and reach out if you'd like to work together!</p></div>`,
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
          <img src="./assets/CA.webp" class="wiki-ca-img" alt="CA">
          <img src="./assets/girl 1.webp" class="wiki-girl-img wiki-girl-wiggle" alt="Girl">
        </div>
        <div class="wiki-text">WIKI COMING SOON</div>
        <button class="wiki-back-btn" onclick="showPage('home')">← Back</button>
      </div>
    `,
  },
  manga: {
    content: "",
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
          <button class="qa-nav-btn active" onclick="showQASection('why', event)">WHY MAKE THIS?</button>
          <button class="qa-nav-btn" onclick="showQASection('contact', event)">WHERE TO CONTACT YOU?</button>
          <button class="qa-nav-btn" onclick="showQASection('social', event)">YOUR SOCIAL?</button>
          <button class="qa-nav-btn" onclick="showQASection('commissions', event)">YOU DO ART COMMISSIONS?</button>
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
              <p>Discord: <a href="https://discord.com/users/781458513603198986" target="_blank" rel="noopener noreferrer" class="social-link">lazyman_XD</a></p>
              <p>For business inquiries and commissions, please include details about your project including timeline, budget, and specific requirements.</p>
              <h4 style="margin-top: 25px; margin-bottom: 15px; color: #fff; font-family: 'Press Start 2P', cursive; font-size: 16px; font-weight: 600; text-align: center;">supportme/ payme</h4>
              <div class="payment-buttons" style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                <a href="https://paypal.me/LazymanXDPay" target="_blank" rel="noopener noreferrer" class="payment-btn paypal-btn" style="padding: 20px 40px; background: linear-gradient(135deg, #0070ba 0%, #005ea6 100%); border: 1px solid rgba(255,255,255,0.2); border-radius: 25px; color: #fff; text-decoration: none; font-family: 'Press Start 2P', cursive; font-size: 18px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,112,186,0.3);">PayPal</a>
                <a href="https://ko-fi.com/lazyman_xd" target="_blank" rel="noopener noreferrer" class="payment-btn kofi-btn" style="padding: 20px 40px; background: linear-gradient(135deg, #ff5e5b 0%, #ff4500 100%); border: 1px solid rgba(255,255,255,0.2); border-radius: 25px; color: #fff; text-decoration: none; font-family: 'Press Start 2P', cursive; font-size: 18px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255,94,91,0.3);">Ko-fi</a>
              </div>
            </div>
          </div>
          <!-- SOCIAL -->
          <div id="qa-social" class="qa-section">
            <div class="qa-text-content">
              <h3>YOUR SOCIAL?</h3>
              <div class="social-links">
                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #1da1f2 0%, #0d8ecf 100%); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(29,161,242,0.3);">TWITTER / X</a>
                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #e1306c 0%, #c13584 50%, #833ab4 100%); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(225,48,108,0.3);">INSTAGRAM</a>
                <a href="https://www.deviantart.com/lazyman2020" class="social-link" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #05cc47 0%, #04a238 100%); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(5,204,71,0.3);">DEVIANTART</a>
                <a href="https://www.reddit.com/user/Top-Pizza-8795/submitted/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button" class="social-link" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #ff4500 0%, #ff5722 100%); color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255,69,0,0.3);">REDDIT</a>
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
                  <img id="character-image" src="./assets/character1_sketch.webp" alt="Character" class="character-image" onerror="this.src='./assets/girl 1.webp'">
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
    `,
  },
  contact: {
    content: "<h2>Contact</h2><p>Contact me at: your@email.com</p>",
  },
};

function showPage(pageKey) {
  // Show roadmap button on home, hide on other pages
  const roadmapBtn = document.getElementById("roadmapToggleBtn");
  if (roadmapBtn) {
    if (window.innerWidth < 768) {
      // Mobile: only show on home, hide everywhere else including work
      roadmapBtn.style.display = pageKey === "home" ? "" : "none";
    } else {
      // Desktop: show on home, hide on other pages
      roadmapBtn.style.display = pageKey === "home" ? "" : "none";
    }
  }

  // Close AI companion when leaving Q&A
  if (pageKey !== "faq") {
    dismissAIForNav();
  }

  // For Q&A page, open AI companion instead - don't open tab
  if (pageKey === "faq") {
    if (workCardsShowing) hideWorkCards();
    if (mangaCardsShowing) hideMangaCards();
    if (bookOverlayOpen) closeInfiniteBook();
    openAICompanion();
    return;
  }

  // Books button opens the infinite book overlay, not a middle-tab page
  if (pageKey === "books") {
    if (workCardsShowing) hideWorkCards();
    if (mangaCardsShowing) hideMangaCards();
    openInfiniteBook();
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
    if (bookOverlayOpen) closeInfiniteBook();
  }

  // Remove wiki-active class when switching away from wiki
  tabContent.classList.remove("wiki-active");

  // Save last opened page to localStorage
  lastOpenedPage = pageKey;
  localStorage.setItem("lastOpenedPage", pageKey);

  if (pageKey === "home") {
    // FORCE home page to NEVER be fullscreen
    const middleTab = document.querySelector(".middle-tab");
    middleTab.classList.remove("maximized");
    document.body.classList.remove("window-maximized");

    // Hide the entire tab window
    middleTab.style.display = "none";

    // Create title at center
    const homeContent = document.createElement("div");
    homeContent.id = "homeContentOutside";
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
    const buttonsContainer = document.createElement("div");
    buttonsContainer.id = "navButtonsContainer";
    buttonsContainer.className = "nav-buttons";

    let buttonsHtml = "";
    page.buttons.forEach((btn) => {
      const btnClass = btn.class ? ` ${btn.class}` : "";
      buttonsHtml += `<div class="nav-btn${btnClass}" data-page="${btn.page}"><div class="nav-btn-icon">${btn.icon}</div>${btn.label}</div>`;
    });
    buttonsContainer.innerHTML = buttonsHtml;
    document.body.appendChild(buttonsContainer);

    // Re-attach event listeners to new buttons
    attachNavListeners();

    tabContent.classList.remove("popup-enter");
  } else {
    // Remove the outside home content and buttons when switching to other pages
    const outsideHomeContent = document.getElementById("homeContentOutside");
    if (outsideHomeContent) {
      outsideHomeContent.remove();
    }
    const navButtonsContainer = document.getElementById("navButtonsContainer");
    if (navButtonsContainer) {
      navButtonsContainer.remove();
    }

    // Show the tab window again for other pages
    const middleTab = document.querySelector(".middle-tab");
    if (middleTab) {
      middleTab.style.display = "flex";
      const tabHeader = document.querySelector(".middle-tab-header");
      if (tabHeader) {
        tabHeader.style.display = "none";
      }
    }

    tabContent.innerHTML = page.content;

    if (pageKey === "wiki") {
      // For wiki page - fade in with blur backdrop
      middleTab.style.width = "100vw";
      middleTab.style.height = "100vh";
      middleTab.style.left = "0";
      middleTab.style.top = "0";
      middleTab.style.transform = "scale(0.9)";
      middleTab.style.opacity = "0";
      middleTab.style.background = "transparent";
      middleTab.style.boxShadow = "none";
      tabContent.style.padding = "0";
      tabContent.style.overflow = "hidden";

      // Animate in
      requestAnimationFrame(() => {
        middleTab.style.transition = "all 0.4s ease-out";
        middleTab.style.transform = "scale(1)";
        middleTab.style.opacity = "1";
      });
    } else if (pageKey === "manga") {
      // Manga page - transparent background, just the cover
      middleTab.style.background = "transparent";
      middleTab.style.boxShadow = "none";
      middleTab.style.width = "500px";
      middleTab.style.height = "auto";
      middleTab.style.left = "calc(50% - 250px)";
      middleTab.style.top = "calc(50% - 250px)";
      middleTab.style.transform = "scale(1)";
      middleTab.style.opacity = "1";
      tabContent.style.padding = "0";
      tabContent.style.overflow = "hidden";
    } else {
      middleTab.style.background = "#ffffff";
      middleTab.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)";
      middleTab.style.width = "700px";
      middleTab.style.height = "200px";
      middleTab.style.left = "calc(50% - 350px)";
      middleTab.style.top = "calc(50% - 100px)";
      middleTab.style.transform = "none";
      middleTab.style.opacity = "1";
      tabContent.style.padding = "40px";
      tabContent.style.overflowY = "auto";
    }
  }
  attachNavListeners();
}

// --- Nav buttons ---
// Track last opened page for session restore
let lastOpenedPage = "home";

// Track if work cards are currently showing
let workCardsShowing = false;
let workCardElements = [];
let workCardsShowTimeoutId = null;
let lastWorkCardsButton = null;
let mangaCardsShowing = false;
let mangaCardElements = [];
let mangaCardsShowTimeoutId = null;
let lastMangaCardsButton = null;
let cardsResizeRafId = null;
window.addEventListener("resize", () => {
  if (cardsResizeRafId !== null) cancelAnimationFrame(cardsResizeRafId);
  cardsResizeRafId = requestAnimationFrame(() => {
    cardsResizeRafId = null;
    if (workCardsShowing && lastWorkCardsButton)
      showWorkCards(lastWorkCardsButton);
    if (mangaCardsShowing && lastMangaCardsButton)
      showMangaCards(lastMangaCardsButton);
  });
});

function showWorkCards(button) {
  return window.__showWorkCardsImpl(button);
}

function hideWorkCards(button) {
  return window.__hideWorkCardsImpl(button);
}

// Add glow beat animation keyframes
const style = document.createElement("style");
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

  #pullToRefreshIndicator {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translate(-50%, -120%);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 160px;
    max-width: 240px;
    padding: 10px 14px;
    border-radius: 24px;
    background: rgba(12, 12, 18, 0.92);
    color: #fff;
    font-family: 'Press Start 2P', cursive;
    font-size: 11px;
    z-index: 10050;
    pointer-events: none;
    transition: transform 0.2s ease, opacity 0.2s ease;
    box-shadow: 0 8px 28px rgba(0,0,0,0.45);
  }

  #pullToRefreshIndicator .ptr-icon {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: rgba(255, 215, 0, 0.14);
    color: #ffd700;
    display: grid;
    place-items: center;
    font-size: 16px;
    transition: transform 0.2s ease;
  }

  #pullToRefreshIndicator .ptr-text {
    line-height: 1.2;
    white-space: nowrap;
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

function dismissAIForNav() {
  // Always hide AI options regardless of AI companion state
  const aiOptions = document.getElementById("aiOptions");
  if (aiOptions) aiOptions.classList.remove("show");

  // Close AI companion if active
  if (aiCompanionActive) {
    closeAICompanion();
  }
}

function attachNavListeners() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.onclick = function (e) {
      e.stopPropagation();
      playSound("tabClick", 0);
      const pageKey = this.dataset.page;

      // Close AI companion when switching away from Q&A
      if (pageKey !== "faq") {
        dismissAIForNav();
      }

      // Handle work button specially
      if (pageKey === "work") {
        // Only animate the icon, not the whole button
        const workIcon = this.querySelector(".work-btn-shake, img");
        if (workIcon) {
          workIcon.classList.remove("work-btn-animate");
          void workIcon.offsetWidth;
          workIcon.classList.add("work-btn-animate");
        }

        // If cards are showing, hide them
        if (workCardsShowing) {
          hideWorkCards(this);
          return;
        }

        // Opening work: close manga popup and the book overlay so only one is open
        if (mangaCardsShowing) hideMangaCards();
        if (bookOverlayOpen) closeInfiniteBook();

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
        const mangaIcon = this.querySelector("img");
        if (mangaIcon) {
          mangaIcon.classList.remove("manga-btn-spin");
          void mangaIcon.offsetWidth;
          mangaIcon.classList.add("manga-btn-spin");
        }
        // If cards are currently showing, hide them
        if (mangaCardsShowing) {
          hideMangaCards(this);
          return;
        }
        // If there's a pending timeout to show cards, cancel it (user clicked again before cards appeared)
        if (mangaCardsShowTimeoutId !== null) {
          clearTimeout(mangaCardsShowTimeoutId);
          mangaCardsShowTimeoutId = null;
          return;
        }
        if (workCardsShowing) hideWorkCards();
        if (bookOverlayOpen) closeInfiniteBook();
        mangaCardsShowTimeoutId = setTimeout(() => {
          mangaCardsShowTimeoutId = null;
          showMangaCards(this);
        }, 350);
        return;
      }

      // Handle books button: open the infinite book overlay
      if (pageKey === "books") {
        if (workCardsShowing) hideWorkCards();
        if (mangaCardsShowing) hideMangaCards();
        openInfiniteBook();
        return;
      }

      // For other buttons, hide work/manga cards and the book overlay if open
      if (workCardsShowing) {
        hideWorkCards();
      }
      if (mangaCardsShowing) {
        hideMangaCards();
      }
      if (bookOverlayOpen) {
        closeInfiniteBook();
      }

      proceedWithPageOpen(pageKey);
    };
  });
}

// Artwork data
let artworkData = [
  { src: "./illustrations/1.webp", title: "Artwork 1" },
  { src: "./illustrations/2.webp", title: "Artwork 2" },
  { src: "./illustrations/3.webp", title: "Artwork 3" },
  { src: "./illustrations/4.webp", title: "Artwork 4" },
  { src: "./illustrations/5.webp", title: "Artwork 5" },
  { src: "./illustrations/6.webp", title: "Artwork 6" },
  { src: "./illustrations/7.webp", title: "Artwork 7" },
  { src: "./illustrations/8.webp", title: "Artwork 8" },
  { src: "./illustrations/9.webp", title: "Artwork 9" },
  { src: "./illustrations/10.webp", title: "Artwork 10" },
  { src: "./illustrations/11.webp", title: "Artwork 11" },
  { src: "./illustrations/12.webp", title: "Artwork 12" },
  { src: "./illustrations/13.webp", title: "Artwork 13" },
  { src: "./illustrations/14.webp", title: "Artwork 14" },
  { src: "./illustrations/15.webp", title: "Artwork 15" },
  { src: "./illustrations/dave.webp", title: "Dave" },
  { src: "./illustrations/linda.webp", title: "Linda" },
  { src: "./illustrations/mike.webp", title: "Mike" },
  { src: "./illustrations/susan.webp", title: "Susan" },
];

// Shared image pool - each image stored only once
const mangaImagePool = {
  // Main images - no duplicates!
  showerThoughts: "./assets/SHOWERTHOUGHTS.webp",
  witchesEnd: "./assets/manga-card-2.webp", // Using webp version
  lastIllsins: "./assets/manga-card-3.webp", // Using webp version
  // Concept manga 1 - cover and pages
  concept1Cover: "./3/concept 1/0.webp",
  concept1_1: "./3/concept 1/0.webp",
  concept1_2: "./3/concept 1/1.webp",
  concept1_3: "./3/concept 1/2.webp",
  concept1_4: "./3/concept 1/3.webp",
  // Concept manga 2 - cover and pages
  concept2Cover: "./illustrations/2.webp", // TODO: Verify this is the correct replacement for marry.webp
  concept2_1: "./3/concept 2/4.webp",
  concept2_2: "./3/concept 2/5.webp",
  concept2_3: "./3/concept 2/6.webp",
  concept2_4: "./3/concept 2/7.webp",
  // Last 3 Sins images from folder 1
  last3sisns1: "./1/1.webp",
  last3sisns2: "./1/3.webp",
  last3sisns3: "./1/2.webp",
  last3sisns4: "./1/4.webp",
  last3sisns5: "./1/5.webp",
  last3sisns6: "./1/6.webp",
  // Last 3 Sins images from folder 1/one/
  last3sisnsOne1: "./1/one/1.webp",
  last3sisnsOne2: "./1/one/2.webp",
  last3sisnsOne3: "./1/one/3.webp",
  last3sisnsOne3_1: "./1/one/3.1.webp",
  last3sisnsOne4: "./1/one/4.webp",
  last3sisnsOne5: "./1/one/5-resized.webp",
  last3sisnsOne6: "./1/one/6.webp",
  last3sisnsOne7: "./1/one/7.webp",
  last3sisnsOne8: "./1/one/8-resized.webp",
  last3sisnsOne9: "./1/one/9.webp",
  // Last 3 Sins illustrations from folder 1/illustration folder/
  last3sisnsIllust1: "./1/illustration folder/3.1 - Copy.webp",
  last3sisnsIllust2: "./1/illustration folder/5.2.webp",
  last3sisnsIllust3: "./1/illustration folder/5.3.webp",
  last3sisnsIllust4: "./1/illustration folder/6.1.webp",
  last3sisnsIllust5: "./1/illustration folder/6.2.webp",
  last3sisnsIllust6: "./1/illustration folder/6.3111.webp",
  last3sisnsIllust7: "./1/illustration folder/HFhGar0bQAETqpE.webp",
  // Witch's End images from folder 2
  witchesEnd1: "./2/manga (1)_002.webp",
  witchesEnd2: "./2/manga (1)_003.webp",
  witchesEnd3: "./2/manga (1)_004.webp",
  witchesEnd4: "./2/manga (1)_005.webp",
  witchesEnd5: "./2/manga (1)_006.webp",
  witchesEnd6: "./2/manga (1)_007.webp",
  witchesEnd7: "./2/manga (1)_008.webp",
  witchesEnd8: "./2/manga (1)_009.webp",
  witchesEnd9: "./2/manga (1)_010.webp",
  witchesEnd10: "./2/manga (1)_011.webp",
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
};

const mangaGalleryData = [
  {
    coverKey: "folder2",
    src: mangaImagePool.witchesEnd,
    title: "Witch's End",
    synopsis:
      "In a world where magic fades, one witch must face her final days. A tale of legacy, memory, and the end of an era.",
    customBackground:
      "linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)), #292929 url('./assets/witches-end-background.png') center/cover no-repeat fixed",
    customSidebarBackground:
      "linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)), #292929 url('./assets/witches-end-background.png') center/cover no-repeat fixed",
    pageKeys: [
      "witchesEnd1",
      "witchesEnd2",
      "witchesEnd3",
      "witchesEnd4",
      "witchesEnd5",
      "witchesEnd6",
      "witchesEnd7",
      "witchesEnd8",
      "witchesEnd9",
      "witchesEnd10",
    ],
    illustrations: [
      "witchesEndIllust1",
      "witchesEndIllust2",
      "witchesEndIllust3",
      "witchesEndIllust4",
      "witchesEndIllust5",
      "witchesEndIllust6",
      "witchesEndIllust7",
      "witchesEndIllust8",
      "witchesEndIllust9",
      "witchesEndIllust10",
      "witchesEndIllust11",
      "witchesEndIllust12",
      "witchesEndIllust13",
      "witchesEndIllust14",
      "witchesEndIllust15",
      "witchesEndIllust16",
      "witchesEndIllust17",
      "witchesEndIllust18",
      "witchesEndIllust19",
      "witchesEndIllust20",
      "witchesEndIllust21",
      "witchesEndIllust22",
      "witchesEndIllust23",
      "witchesEndIllust24",
      "witchesEndIllust25",
      "witchesEndIllust26",
    ],
  },
  {
    coverKey: "showerThoughts",
    src: mangaImagePool.showerThoughts,
    title: "Shower Thoughts",
    synopsis: "Coming soon...",
    comingSoon: true,
    pageKeys: [],
  },
  {
    coverKey: "folder1",
    src: mangaImagePool.lastIllsins,
    title: "Last 3 Sins",
    synopsis:
      "Three sins, three stories, one interconnected fate. Explore the darker corners of human nature through this gripping narrative.",
    customBackground:
      "linear-gradient(135deg, #291919 0%, #190e0e 50%, #0e0909 100%)",
    customSidebarBackground:
      "linear-gradient(180deg, #190e0e 0%, #0e0909 100%)",
    sections: [
      {
        name: "Section 1",
        pageKeys: [
          "last3sisns1",
          "last3sisns2",
          "last3sisns3",
          "last3sisns4",
          "last3sisns5",
          "last3sisns6",
        ],
      },
      {
        name: "Section 2",
        pageKeys: [
          "last3sisnsOne1",
          "last3sisnsOne2",
          "last3sisnsOne3",
          "last3sisnsOne3_1",
          "last3sisnsOne4",
          "last3sisnsOne5",
          "last3sisnsOne6",
          "last3sisnsOne7",
          "last3sisnsOne8",
          "last3sisnsOne9",
        ],
      },
    ],
    illustrations: [
      "last3sisnsIllust1",
      "last3sisnsIllust2",
      "last3sisnsIllust3",
      "last3sisnsIllust4",
      "last3sisnsIllust5",
      "last3sisnsIllust6",
      "last3sisnsIllust7",
    ],
  },
  {
    coverKey: "concept1",
    src: mangaImagePool.concept1Cover,
    title: "Concept Manga 1",
    synopsis:
      "A concept manga exploring new ideas and storytelling techniques.",
    customBackground:
      "linear-gradient(135deg, #5f666b 0%, #444a4f 50%, #2f3438 100%)",
    customSidebarBackground:
      "linear-gradient(180deg, #444a4f 0%, #2f3438 100%)",
    pageKeys: ["concept1_1", "concept1_2", "concept1_3", "concept1_4"],
    illustrations: [],
    isConcept: true,
  },
  {
    coverKey: "concept2",
    src: mangaImagePool.concept2Cover,
    title: "Concept Manga 2",
    synopsis:
      "Another concept manga with unique visual style and narrative approach.",
    customBackground: "#000000",
    customSidebarBackground: "#000000",
    pageKeys: ["concept2_1", "concept2_2", "concept2_3", "concept2_4"],
    illustrations: [],
    isConcept: true,
  },
];

// Helper function to get actual pages array from keys
function getMangaPages(manga, sectionIndex = 0) {
  if (manga.sections && manga.sections[sectionIndex]) {
    return manga.sections[sectionIndex].pageKeys
      .map((key) => mangaImagePool[key])
      .filter(Boolean);
  }
  if (!manga.pageKeys) return [];
  return manga.pageKeys.map((key) => mangaImagePool[key]).filter(Boolean);
}

// Preload images for instant display when cards open
function preloadImages(imageList) {
  imageList.forEach((item) => {
    const img = new Image();
    img.src = item.src;
  });
}

let artworkImagesPrimed = false;

function primeArtworkImages() {
  if (artworkImagesPrimed) return;
  artworkImagesPrimed = true;
  const run = () => preloadImages(artworkData);
  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 0);
  }
}

function optimizeImageElement(img) {
  if (!img || img.dataset.optimized === "1") return;
  img.dataset.optimized = "1";
  if (!img.loading) img.loading = "lazy";
  img.decoding = "async";
  if (!img.fetchPriority || img.fetchPriority === "auto") {
    img.fetchPriority = "low";
  }
}

function optimizeAllImagesIn(root) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll("img").forEach(optimizeImageElement);
}

function setupImageLoadingOptimizations() {
  optimizeAllImagesIn(document);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === "IMG") optimizeImageElement(node);
        optimizeAllImagesIn(node);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

window.__showWorkCardsImpl = function showWorkCards(button) {
  lastWorkCardsButton = button;
  workCardElements.forEach((el) => el.remove());
  workCardElements = [];
  workCardsShowing = false;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Get button position to ensure we don't cover it
  const buttonRect = button.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonTopY = buttonRect.top;

  // Responsive card size based on screen
  let cardSize, spacingX, spacingY, cardsPerRow, buttonBuffer;
  const totalCards = artworkData.length;

  if (viewportWidth <= 480) {
    cardSize = 80; spacingX = 90; spacingY = 100; cardsPerRow = 3; buttonBuffer = 200;
  } else if (viewportWidth <= 768) {
    cardSize = 100; spacingX = 115; spacingY = 125; cardsPerRow = 4; buttonBuffer = 180;
  } else {
    cardSize = 120; spacingX = 140; spacingY = 150; cardsPerRow = 5; buttonBuffer = 100;
  }

  // Calculate grid dimensions
  const totalRows = Math.ceil(totalCards / cardsPerRow);
  const gridWidth = Math.min(cardsPerRow, totalCards) * spacingX;
  const gridHeight = totalRows * spacingY;
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  let gridTopY = centerY - gridHeight / 2;
  let gridLeftX = centerX - gridWidth / 2;

  // If grid would cover button, move it up
  if (
    gridTopY + gridHeight > buttonTopY - buttonBuffer &&
    gridLeftX < buttonCenterX + buttonBuffer &&
    gridLeftX + gridWidth > buttonCenterX - buttonBuffer
  ) {
    gridTopY = buttonTopY - gridHeight - buttonBuffer;
  }

  // Ensure grid stays within viewport
  gridTopY = Math.max(20, Math.min(gridTopY, viewportHeight - gridHeight - 20));
  gridLeftX = Math.max(20, Math.min(gridLeftX, viewportWidth - gridWidth - 20));

  // Helper function to create work card
  function createWorkCard(artwork, index, cardX, cardY, startX, startY) {
    const card = document.createElement("div");
    card.className = "work-card";
    card.dataset.src = artwork.src;
    card.dataset.title = artwork.title;
    card.dataset.index = index;

    card.style.cssText = `
      position: fixed; left: ${startX}px; top: ${startY}px;
      width: ${cardSize}px; height: ${cardSize}px;
      transform: translate(-50%, -50%) scale(0.1) rotate(0deg);
      opacity: 0; z-index: 3000; cursor: pointer;
      transition: all 0.3s ease; border-radius: 12px;
      overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      pointer-events: auto; border: 2px solid transparent;
    `;

    card.onmouseenter = function () {
      this.style.transform = this.style.transform.replace("scale(1)", "scale(1.15)");
      this.style.boxShadow = "0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)";
      this.style.borderColor = "rgba(255, 215, 0, 0.8)";
      this.style.zIndex = "3001";
    };

    card.onmouseleave = function () {
      this.style.transform = this.style.transform.replace("scale(1.15)", "scale(1)");
      this.style.boxShadow = "0 8px 32px rgba(0,0,0,0.6)";
      this.style.borderColor = "transparent";
      this.style.zIndex = "3000";
    };

    const img = document.createElement("img");
    img.src = artwork.src;
    img.alt = artwork.title;
    img.loading = "eager";
    img.decoding = "async";
    img.style.cssText = "width: 100%; height: 100%; object-fit: cover; display: block;";
    card.appendChild(img);

    card.onclick = (e) => {
      e.stopPropagation();
      playSound("tabClick", 0);
      openWorkCardFullscreen(card, artwork.src, artwork.title);
    };

    document.body.appendChild(card);
    workCardElements.push(card);

    // Animate to position
    setTimeout(() => {
      const rotate = index % 2 === 0 ? -3 : 3;
      card.style.left = `${cardX}px`;
      card.style.top = `${cardY}px`;
      card.style.transform = `translate(-50%, -50%) scale(1) rotate(${rotate}deg)`;
      card.style.opacity = "1";
    }, 50 + index * 80);
  }

  artworkData.forEach((artwork, index) => {
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    const cardsInThisRow = Math.min(cardsPerRow, totalCards - row * cardsPerRow);
    const rowWidth = cardsInThisRow * spacingX;
    const rowStartX = gridLeftX + (gridWidth - rowWidth) / 2 + spacingX / 2;
    const cardX = rowStartX + col * spacingX;
    const cardY = gridTopY + row * spacingY + spacingY / 2;
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    createWorkCard(artwork, index, cardX, cardY, startX, startY);
  });

  workCardsShowing = true;
  primeArtworkImages();
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

  const targetX = button ? button.getBoundingClientRect().left + button.getBoundingClientRect().width / 2 : window.innerWidth / 2;
  const targetY = button ? button.getBoundingClientRect().top + button.getBoundingClientRect().height / 2 : window.innerHeight / 2;

  workCardElements.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = `translate(-50%, -50%) scale(0.1) rotate(0deg)`;
      card.style.left = `${targetX}px`;
      card.style.top = `${targetY}px`;
      card.style.opacity = "0";
    }, index * 50);

    setTimeout(() => {
      if (card.parentNode) card.remove();
    }, 600 + index * 50);
  });

  workCardElements = [];
  workCardsShowing = false;
};

function showMangaCards(button) {
  lastMangaCardsButton = button;
  mangaCardElements.forEach((el) => el.remove());
  mangaCardElements = [];
  mangaCardsShowing = false;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const buttonRect = button.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonTopY = buttonRect.top;

  // Filter manga based on concept toggle
  const mangaToShow = showingConceptOnly
    ? mangaGalleryData.filter((m) => m.isConcept)
    : mangaGalleryData.filter((m) => !m.isConcept);

  const totalCards = mangaToShow.length;

  let cardWidth, cardHeight, spacingX, spacingY, cardsPerRow;

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
  const isMobile = viewportWidth <= 768;

  // Always center cards in the middle of the screen
  let gridTopY = centerY - gridHeight / 2;
  const gridLeftX = centerX - gridWidth / 2;

  // On mobile, shift cards up to avoid toggle button at bottom (140px from bottom)
  if (isMobile) {
    gridTopY = Math.min(gridTopY, viewportHeight - gridHeight - 220);
  }

  mangaCardElements = [];

  mangaToShow.forEach((manga, index) => {
    const card = document.createElement("div");
    card.className = "work-card";
    card.dataset.src = manga.src;
    card.dataset.title = manga.title;

    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    const cardsInThisRow = Math.min(
      cardsPerRow,
      totalCards - row * cardsPerRow,
    );
    const rowWidth = cardsInThisRow * spacingX;
    const rowStartX = gridLeftX + (gridWidth - rowWidth) / 2 + spacingX / 2;
    const cardX = rowStartX + col * spacingX;
    const cardY = gridTopY + row * spacingY + spacingY / 2;

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

    card.onmouseenter = function () {
      this.style.transform = this.style.transform.replace(
        "scale(1)",
        "scale(1.1)",
      );
      this.style.boxShadow =
        "0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)";
      this.style.borderColor = "rgba(255, 215, 0, 0.9)";
      this.style.zIndex = "3001";
    };

    card.onmouseleave = function () {
      this.style.transform = this.style.transform.replace(
        "scale(1.1)",
        "scale(1)",
      );
      this.style.boxShadow = "0 8px 32px rgba(0,0,0,0.6)";
      this.style.borderColor = "rgba(255, 215, 0, 0.3)";
      this.style.zIndex = "3000";
    };

    const img = document.createElement("img");
    img.src = manga.src;
    img.alt = manga.title;
    img.loading = "eager";
    img.decoding = "async";
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
      const overlay = document.createElement("div");
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
      const badge = document.createElement("div");
      badge.textContent = "SOON";
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

    card.onclick = function (e) {
      e.stopPropagation();
      playSound("tabClick", 0);
      if (manga.comingSoon) {
        // Show coming soon message
        const toast = document.createElement("div");
        toast.className = "coming-soon-toast";
        toast.textContent = "Coming soon...";
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
          toast.style.opacity = "0";
          toast.style.transition = "opacity 0.3s ease";
          setTimeout(() => toast.remove(), 300);
        }, 1500);
      } else {
        openMangaReader(manga);
      }
    };

    document.body.appendChild(card);
    mangaCardElements.push(card);

    setTimeout(
      () => {
        card.style.left = `${cardX}px`;
        card.style.top = `${cardY}px`;
        card.style.transform = "translate(-50%, -50%) scale(1)";
        card.style.opacity = "1";
      },
      60 + index * 90,
    );
  });

  mangaCardsShowing = true;

  // Add concept manga toggle button
  addConceptMangaToggle();
}

function hideMangaCards(button, skipToggleRemoval = false) {
  // Remove concept manga toggle button (unless skipping)
  if (!skipToggleRemoval) {
    removeConceptMangaToggle();
  }

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
      card.style.transform = "translate(-50%, -50%) scale(0.1)";
      card.style.left = `${targetX}px`;
      card.style.top = `${targetY}px`;
      card.style.opacity = "0";
    }, index * 50);

    setTimeout(
      () => {
        if (card.parentNode) card.remove();
      },
      520 + index * 50,
    );
  });

  mangaCardElements = [];
  mangaCardsShowing = false;
}

// Concept Manga Toggle Functions
let conceptMangaToggleElement = null;
let showingConceptOnly = false;

function addConceptMangaToggle() {
  // Remove existing toggle if present
  removeConceptMangaToggle();

  // Create toggle button
  const toggle = document.createElement("button");
  toggle.id = "conceptMangaToggle";
  toggle.textContent = showingConceptOnly ? "Back to Manga" : "Concept Manga";
  const isMobile = window.innerWidth <= 768;
  toggle.style.cssText = `
    position: fixed;
    ${isMobile ? "top: 20px; bottom: auto;" : "bottom: 200px; top: auto;"}
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    min-width: 180px;
    max-width: calc(100% - 32px);
    box-sizing: border-box;
    font-size: 14px;
    font-weight: bold;
    color: #222;
    background: linear-gradient(135deg, #ffd700 0%, #ffec8b 100%);
    border: 2px solid rgba(255, 215, 0, 0.8);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Press Start 2P', cursive;
    z-index: 3000;
  `;

  toggle.onmouseenter = function () {
    this.style.background = "linear-gradient(135deg, #ffec8b 0%, #ffd700 100%)";
    this.style.transform = "translateX(-50%) scale(1.05)";
  };

  toggle.onmouseleave = function () {
    this.style.background = "linear-gradient(135deg, #ffd700 0%, #ffec8b 100%)";
    this.style.transform = "translateX(-50%) scale(1)";
  };

  if (isMobile) {
    // Keep the toggle just above the fixed nav buttons on mobile
    toggle.style.left = "50%";
    toggle.style.bottom = "140px";
    toggle.style.top = "auto";
    toggle.style.transform = "translateX(-50%)";
    toggle.style.zIndex = "5000";
  }

  toggle.onclick = function () {
    showingConceptOnly = !showingConceptOnly;
    playSound("tabClick", 0);
    // Refresh button text
    toggle.textContent = showingConceptOnly ? "Back to Manga" : "Concept Manga";
    // Refresh manga cards (skip toggle removal to keep button visible)
    const mangaBtn = document.querySelector('.nav-btn[data-page="manga"]');
    if (mangaBtn) {
      hideMangaCards(null, true); // Skip toggle removal
      setTimeout(() => showMangaCards(mangaBtn), 300);
    }
  };

  document.body.appendChild(toggle);
  conceptMangaToggleElement = toggle;
}

function removeConceptMangaToggle() {
  if (conceptMangaToggleElement) {
    conceptMangaToggleElement.remove();
    conceptMangaToggleElement = null;
  }
}

// Manga Reader Functions
let currentMangaReader = null;
let currentMangaPages = [];
let currentMangaPageIndex = 0;
let currentMangaTitle = "";

// Helper function to create manga panel (global scope for toggleMangaSection access)
function createMangaPanel(src, index, sectionIdx, altPrefix = "Page") {
  const panel = document.createElement("div");
  panel.className = "manga-panel";
  const img = document.createElement("img");
  img.src = src;
  img.alt = `${altPrefix} ${index + 1}`;
  img.loading = "eager";
  img.decoding = "async";
  img.fetchPriority = "high";
  panel.appendChild(img);
  panel.dataset.index = index;
  panel.dataset.sectionIndex = sectionIdx;
  return panel;
}

function openMangaReader(manga) {
  // Hide manga cards
  hideMangaCards();

  // Set current manga for toggle function
  currentManga = manga;
  currentMangaSection = "manga";

  // Get pages using helper (avoids duplicate image storage)
  const pages = getMangaPages(manga);

  // Create manga reader container
  const reader = document.createElement("div");
  reader.id = "mangaReader";
  reader.className = "manga-reader-container";
  reader.style.display = "flex"; // Make it visible

  // Apply custom background if specified
  if (manga.customBackground) {
    reader.style.background = manga.customBackground;
  }

  reader.innerHTML = `
    <div class="manga-reader-sidebar">
      <button class="manga-reader-exit" onclick="closeMangaReader()" title="Exit">✕</button>
      <div class="manga-reader-cover">
        <img src="${manga.src}" alt="${manga.title}" loading="eager">
      </div>
      <div class="manga-reader-info">
        <h2 class="manga-reader-title">${manga.title}</h2>
        <p class="manga-reader-synopsis">${manga.synopsis || ""}</p>
      </div>
      ${manga.illustrations && manga.illustrations.length > 0 ? '<button class="manga-section-toggle" id="mangaSectionToggle" onclick="toggleMangaSection()">To Illustration</button>' : ""}
    </div>
    <div class="manga-reader-main">
      <div class="manga-reader-grid" id="mangaReaderGrid"></div>
      <div class="manga-section-dots" id="mangaSectionDots"></div>
    </div>
  `;

  document.body.appendChild(reader);
  currentMangaReader = reader;

  // Apply custom sidebar background if specified
  if (manga.customSidebarBackground) {
    const sidebar = reader.querySelector(".manga-reader-sidebar");
    if (sidebar) {
      sidebar.style.background = manga.customSidebarBackground;
      sidebar.classList.add("manga-reader-sidebar-dark");
    }
  }

  if (window.innerWidth <= 768) {
    const sidebar = reader.querySelector(".manga-reader-sidebar");
    const cover = reader.querySelector(".manga-reader-cover");
    const info = reader.querySelector(".manga-reader-info");
    const title = reader.querySelector(".manga-reader-title");
    const synopsis = reader.querySelector(".manga-reader-synopsis");
    const toggle = reader.querySelector(".manga-section-toggle");
    const exitBtn = reader.querySelector(".manga-reader-exit");

    if (sidebar) {
      sidebar.style.padding =
        window.innerWidth <= 480 ? "14px 14px 12px" : "14px 16px";
      sidebar.style.gap = window.innerWidth <= 480 ? "8px 12px" : "10px 14px";
    }

    if (exitBtn) {
      exitBtn.style.position = "absolute";
      exitBtn.style.right = window.innerWidth <= 480 ? "10px" : "12px";
      exitBtn.style.left = "auto";
      exitBtn.style.top = window.innerWidth <= 480 ? "8px" : "10px";
    }

    if (cover) {
      if (window.innerWidth <= 480) {
        cover.style.width = "96px";
        cover.style.height = "128px";
      } else {
        cover.style.width = "90px";
        cover.style.height = "120px";
      }
      cover.style.borderRadius = "8px";
    }

    if (info) {
      info.style.gap = "4px";
    }

    if (title) {
      title.style.fontSize = window.innerWidth <= 480 ? "12px" : "13px";
      title.style.lineHeight = "1.35";
      title.style.textAlign = "left";
      title.style.margin = "0";
    }

    if (synopsis) {
      synopsis.style.fontSize = "8px";
      synopsis.style.lineHeight = "1.35";
      synopsis.style.textAlign = "left";
      synopsis.style.margin = "0";
      synopsis.style.maxHeight = window.innerWidth <= 480 ? "52px" : "54px";
      synopsis.style.overflow = "hidden";
      synopsis.style.display = "-webkit-box";
      synopsis.style.webkitBoxOrient = "vertical";
      synopsis.style.webkitLineClamp = "5";
    }

    if (toggle) {
      if (info && synopsis) {
        info.appendChild(toggle);
      }

      toggle.style.gridColumn = "auto";
      toggle.style.gridRow = "auto";
      toggle.style.alignSelf = "flex-end";
      toggle.style.justifySelf = "auto";
      toggle.style.margin =
        window.innerWidth <= 480 ? "2px 0 0 auto" : "4px 0 0 auto";
      toggle.style.transform = "none";
      toggle.style.maxWidth = window.innerWidth <= 480 ? "168px" : "180px";
      toggle.style.width = "fit-content";
      toggle.style.fontSize = window.innerWidth <= 480 ? "10px" : "11px";
      toggle.style.padding = window.innerWidth <= 480 ? "7px 10px" : "8px 12px";
      toggle.style.display = "inline-flex";
    }
  }

  let currentSectionIndex = 0;

  // Function to populate grid with section pages
  function populateGrid(sectionIdx) {
    const grid = document.getElementById("mangaReaderGrid");
    const sectionPages = manga.sections
      ? getMangaPages(manga, sectionIdx)
      : pages;

    grid.innerHTML = "";

    if (sectionPages && sectionPages.length > 0) {
      const fragment = document.createDocumentFragment();
      sectionPages.forEach((pageSrc, index) => {
        fragment.appendChild(createMangaPanel(pageSrc, index, sectionIdx));
      });
      grid.appendChild(fragment);
    }

    // Update dots active state
    const dots = document.querySelectorAll(".section-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === sectionIdx);
    });

    currentSectionIndex = sectionIdx;
    currentMangaSectionIndex = sectionIdx;
  }

  // Populate initial section
  populateGrid(0);

  // Single click handler for all panels using delegation
  const grid = document.getElementById("mangaReaderGrid");
  grid.addEventListener("click", (e) => {
    const panel = e.target.closest(".manga-panel");
    if (panel) {
      const index = parseInt(panel.dataset.index);
      const sectionIdx = parseInt(panel.dataset.sectionIndex) || 0;
      playSound("tabClick", 0);

      const activePages =
        currentMangaSection === "illustration" && currentManga?.illustrations
          ? currentManga.illustrations
              .map((key) => mangaImagePool[key])
              .filter(Boolean)
          : getMangaPages(manga, sectionIdx);

      const activeTitle =
        currentMangaSection === "illustration"
          ? `${manga.title} - Illustrations`
          : manga.title;

      openMangaPageViewer(
        activePages,
        index,
        activeTitle,
        currentMangaSection === "illustration" ? null : manga.sections || null,
        currentMangaSection === "illustration" ? 0 : sectionIdx,
      );
    }
  });

  // Add section dots if manga has sections
  if (manga.sections && manga.sections.length > 1) {
    const dotsContainer = document.getElementById("mangaSectionDots");
    manga.sections.forEach((section, idx) => {
      const dot = document.createElement("div");
      dot.className = `section-dot ${idx === 0 ? "active" : ""}`;
      dot.dataset.section = idx;
      dot.innerHTML = `<span class="dot-number">${idx + 1}</span>`;
      dot.addEventListener("click", () => {
        playSound("tabClick", 0);
        populateGrid(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  // Hide roadmap button
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = "none";

  // Play sound
  playSound("open", 0);

  // Escape key handler
  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      closeMangaReader();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);
}

function closeMangaReader() {
  if (currentMangaReader) {
    currentMangaReader.remove();
    currentMangaReader = null;
  }

  // Show roadmap button
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = "";

  // Show manga cards again
  const mangaBtn = document.querySelector('.nav-btn[data-page="manga"]');
  if (mangaBtn) {
    showMangaCards(mangaBtn);
  }

  // Play sound
  playSound("close", 0);
}

let currentMangaSection = "manga";
let currentManga = null;

function toggleMangaSection() {
  const btn = document.getElementById("mangaSectionToggle");
  const dotsContainer = document.getElementById("mangaSectionDots");
  if (!btn || !currentManga) return;

  if (currentMangaSection === "manga") {
    // Switch to illustrations
    if (currentManga.illustrations && currentManga.illustrations.length > 0) {
      currentMangaSection = "illustration";
      btn.textContent = "To Manga";

      // Load illustrations
      const grid = document.getElementById("mangaReaderGrid");
      grid.innerHTML = "";
      const fragment = document.createDocumentFragment();
      currentManga.illustrations.forEach((illustKey, index) => {
        const illustSrc = mangaImagePool[illustKey];
        if (illustSrc) {
          fragment.appendChild(createMangaPanel(illustSrc, index, 0, "Illustration"));
        }
      });
      grid.appendChild(fragment);

      // Hide section dots when showing illustrations
      if (dotsContainer) dotsContainer.style.display = "none";
    } else {
      // No illustrations available, show message
      alert("No illustrations available for this manga.");
      return;
    }
  } else {
    // Switch back to manga
    currentMangaSection = "manga";
    btn.textContent = "To Illustration";

    // Load manga pages
    const pages =
      currentManga.sections && currentManga.sections.length > 0
        ? getMangaPages(currentManga, currentMangaSectionIndex || 0)
        : currentManga.pageKeys
          ? currentManga.pageKeys
              .map((key) => mangaImagePool[key])
              .filter(Boolean)
          : [];
    const grid = document.getElementById("mangaReaderGrid");
    grid.innerHTML = "";
    if (pages && pages.length > 0) {
      const fragment = document.createDocumentFragment();
      pages.forEach((pageSrc, index) => {
        const panel = document.createElement("div");
        panel.className = "manga-panel";

        const img = document.createElement("img");
        img.src = pageSrc;
        img.alt = `Page ${index + 1}`;
        img.loading = "eager";
        img.decoding = "async";
        img.fetchPriority = "high";

        panel.appendChild(img);
        panel.dataset.index = index;
        panel.dataset.sectionIndex = 0;

        fragment.appendChild(panel);
      });
      grid.appendChild(fragment);
    }

    // Show section dots when showing manga
    if (dotsContainer) dotsContainer.style.display = "flex";
  }
  playSound("tabClick", 0);
}

let mangaNavDebounceTimer = null;
let currentMangaKeyHandler = null;

let currentMangaSections = null;
let currentMangaSectionIndex = 0;

function openMangaPageViewer(
  pages,
  startIndex,
  title,
  sections = null,
  initialSectionIndex = 0,
) {
  currentMangaPages = pages;
  currentMangaPageIndex = startIndex;
  currentMangaTitle = title;
  currentMangaSections = sections;
  currentMangaSectionIndex = initialSectionIndex;

  const viewer = document.createElement("div");
  viewer.id = "mangaPageViewer";
  viewer.className = "manga-page-viewer";

  // Create optimized image with priority loading
  const img = document.createElement("img");
  img.id = "mangaViewerImage";
  img.src = pages[startIndex];
  img.alt = `Page ${startIndex + 1}`;
  img.decoding = "async";
  img.fetchPriority = "high";
  img.style.cssText =
    "max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);";

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
  document.getElementById("mangaViewerImageContainer").appendChild(img);

  // Preload adjacent pages with low priority
  preloadAdjacentPages(startIndex);

  // Play sound
  playSound("open", 0);

  // Debounced navigation function
  const debouncedNavigate = (direction) => {
    if (mangaNavDebounceTimer) return; // Prevent rapid navigation
    navigateMangaPage(direction);
    mangaNavDebounceTimer = setTimeout(() => {
      mangaNavDebounceTimer = null;
    }, 150); // 150ms debounce
  };

  // Use event delegation for all click handlers
  viewer.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target.id === "mangaViewerClose" ||
      target.closest("#mangaViewerClose")
    ) {
      closeMangaPageViewer();
    } else if (
      target.id === "mangaNavPrev" ||
      target.closest("#mangaNavPrev") ||
      target.id === "mangaClickLeft" ||
      target.closest("#mangaClickLeft")
    ) {
      debouncedNavigate(-1);
    } else if (
      target.id === "mangaNavNext" ||
      target.closest("#mangaNavNext") ||
      target.id === "mangaClickRight" ||
      target.closest("#mangaClickRight")
    ) {
      debouncedNavigate(1);
    }
  });

  // Keyboard handler with cleanup reference
  currentMangaKeyHandler = (e) => {
    if (e.key === "Escape") {
      closeMangaPageViewer();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      debouncedNavigate(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      debouncedNavigate(1);
    }
  };
  document.addEventListener("keydown", currentMangaKeyHandler);

  // Swipe support with throttling
  let touchStartX = 0;
  let touchStartTime = 0;
  let isSwiping = false;

  viewer.addEventListener(
    "touchstart",
    (e) => {
      if (isSwiping) return;
      touchStartX = e.changedTouches[0].screenX;
      touchStartTime = Date.now();
    },
    { passive: true },
  );

  viewer.addEventListener(
    "touchend",
    (e) => {
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
        setTimeout(() => {
          isSwiping = false;
        }, 200);
      }
    },
    { passive: true },
  );
}

function closeMangaPageViewer() {
  const viewer = document.getElementById("mangaPageViewer");
  if (viewer) {
    // Cancel any pending image loads
    const img = document.getElementById("mangaViewerImage");
    if (img) {
      img.src = "";
    }
    viewer.remove();
  }

  // Clean up keyboard handler
  if (currentMangaKeyHandler) {
    document.removeEventListener("keydown", currentMangaKeyHandler);
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
  currentMangaTitle = "";
  currentMangaSections = null;
  currentMangaSectionIndex = 0;

  playSound("close", 0);
}

function switchMangaSection(sectionIndex, section) {
  // Get new pages from section pageKeys
  const newPages = section.pageKeys
    .map((key) => mangaImagePool[key])
    .filter(Boolean);

  // Update state
  currentMangaPages = newPages;
  currentMangaPageIndex = 0;
  currentMangaSectionIndex = sectionIndex;

  // Update image
  const img = document.getElementById("mangaViewerImage");
  const counter = document.getElementById("mangaPageCounter");

  if (img && counter && newPages.length > 0) {
    img.style.opacity = "0.7";

    const preloadImg = new Image();
    preloadImg.decoding = "async";
    preloadImg.fetchPriority = "high";

    preloadImg.onload = () => {
      img.src = newPages[0];
      counter.textContent = `Page 1 of ${newPages.length}`;
      img.style.opacity = "1";
    };

    preloadImg.onerror = () => {
      img.src = newPages[0];
      counter.textContent = `Page 1 of ${newPages.length}`;
      img.style.opacity = "1";
    };

    preloadImg.src = newPages[0];
  }
}

function navigateMangaPage(direction) {
  const newIndex = currentMangaPageIndex + direction;
  if (newIndex >= 0 && newIndex < currentMangaPages.length) {
    currentMangaPageIndex = newIndex;
    const img = document.getElementById("mangaViewerImage");
    const counter = document.getElementById("mangaPageCounter");

    if (img && counter) {
      // Use requestAnimationFrame for smooth image transition
      requestAnimationFrame(() => {
        img.style.opacity = "0.7";

        // Preload the new image first
        const preloadImg = new Image();
        preloadImg.decoding = "async";
        preloadImg.fetchPriority = "high";

        preloadImg.onload = () => {
          requestAnimationFrame(() => {
            img.src = currentMangaPages[newIndex];
            counter.textContent = `Page ${newIndex + 1} of ${currentMangaPages.length}`;
            img.style.opacity = "1";
          });
        };

        preloadImg.onerror = () => {
          // Fallback: load anyway
          requestAnimationFrame(() => {
            img.src = currentMangaPages[newIndex];
            counter.textContent = `Page ${newIndex + 1} of ${currentMangaPages.length}`;
            img.style.opacity = "1";
          });
        };

        preloadImg.src = currentMangaPages[newIndex];

        // Preload adjacent pages in background
        setTimeout(() => preloadAdjacentPages(newIndex), 100);
      });
    }
  }
}

function preloadAdjacentPages(currentIndex) {
  // Preload next and previous pages with low priority
  const preloadIndexes = [currentIndex - 1, currentIndex + 1];
  preloadIndexes.forEach((index) => {
    if (index >= 0 && index < currentMangaPages.length) {
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = "low";
      img.src = currentMangaPages[index];
    }
  });
}

function isLocalFileProtocol() {
  return String(window.location.protocol || "") === "file:";
}

// --- Book (Infinite Book) ---
// The "books" nav button opens the standalone infinite-book page inside a
// full-screen iframe overlay. The book's bookmark ribbon acts as an exit
// button: clicking it inside the iframe posts a message back to this page,
// which closes the overlay and returns to the main site.
let bookOverlayOpen = false;

function openInfiniteBook() {
  if (document.getElementById("infiniteBookOverlay")) return;
  if (workCardsShowing) hideWorkCards();
  if (mangaCardsShowing) hideMangaCards();

  const overlay = document.createElement("div");
  overlay.id = "infiniteBookOverlay";
  overlay.className = "infinite-book-overlay";
  overlay.innerHTML =
    '<iframe id="infiniteBookFrame" class="infinite-book-frame" src="infinite.html" title="Book"></iframe>';
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add("is-visible"));
  bookOverlayOpen = true;
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = "none";
  playSound("open", 0);
}

function closeInfiniteBook() {
  const overlay = document.getElementById("infiniteBookOverlay");
  if (!overlay) {
    bookOverlayOpen = false;
    return;
  }
  overlay.classList.remove("is-visible");
  setTimeout(() => overlay.remove(), 300);
  bookOverlayOpen = false;
  if (roadmapToggleBtn) {
    roadmapToggleBtn.style.display = lastOpenedPage === "home" ? "" : "none";
  }
  playSound("close", 0);
}

window.addEventListener("message", (event) => {
  if (event && event.data === "exit-infinite-book") {
    closeInfiniteBook();
  }
});

function openWorkCardFullscreen(card, src, title) {
  const rect = card.getBoundingClientRect();
  card.dataset.returnX = rect.left;
  card.dataset.returnY = rect.top;
  card.dataset.returnTransform = card.style.transform;

  // Find current index
  const currentIndex = artworkData.findIndex(artwork => artwork.src === src);
  let currentIdx = currentIndex >= 0 ? currentIndex : 0;

  const viewer = document.createElement("div");
  viewer.id = "workCardViewer";
  viewer.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:5000;display:flex;align-items:center;justify-content:center;";

  const img = document.createElement("img");
  img.src = src;
  img.alt = title;
  img.style.cssText = "max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8);";

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕";
  closeBtn.style.cssText = "position:absolute;top:20px;right:20px;background:transparent;border:none;color:white;font-size:30px;cursor:pointer;width:50px;height:50px;display:flex;align-items:center;justify-content:center;z-index:5001;";

  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "‹";
  prevBtn.style.cssText = "position:absolute;top:50%;left:20px;transform:translateY(-50%);background:transparent;border:none;width:50px;height:50px;font-size:40px;color:#ffd700;cursor:pointer;z-index:5001;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;";

  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "›";
  nextBtn.style.cssText = "position:absolute;top:50%;right:20px;transform:translateY(-50%);background:transparent;border:none;width:50px;height:50px;font-size:40px;color:#ffd700;cursor:pointer;z-index:5001;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;";

  viewer.appendChild(img);
  viewer.appendChild(closeBtn);
  viewer.appendChild(prevBtn);
  viewer.appendChild(nextBtn);
  document.body.appendChild(viewer);

  const updateImage = (index) => {
    if (index < 0) index = artworkData.length - 1;
    if (index >= artworkData.length) index = 0;
    currentIdx = index;
    img.src = artworkData[index].src;
    img.alt = artworkData[index].title;
  };

  const closeViewer = () => {
    viewer.remove();
    playSound("tabClick", 0);
  };

  closeBtn.onclick = closeViewer;
  prevBtn.onclick = (e) => { e.stopPropagation(); updateImage(currentIdx - 1); };
  nextBtn.onclick = (e) => { e.stopPropagation(); updateImage(currentIdx + 1); };
  
  prevBtn.onmouseenter = () => prevBtn.style.transform = "translateY(-50%) scale(1.2)";
  prevBtn.onmouseleave = () => prevBtn.style.transform = "translateY(-50%)";
  nextBtn.onmouseenter = () => nextBtn.style.transform = "translateY(-50%) scale(1.2)";
  nextBtn.onmouseleave = () => nextBtn.style.transform = "translateY(-50%)";

  viewer.onclick = (e) => {
    if (e.target === viewer) closeViewer();
  };

  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      closeViewer();
      document.removeEventListener("keydown", escapeHandler);
    } else if (e.key === "ArrowLeft") {
      updateImage(currentIdx - 1);
    } else if (e.key === "ArrowRight") {
      updateImage(currentIdx + 1);
    }
  };
  document.addEventListener("keydown", escapeHandler);
}

function proceedWithPageOpen(pageKey) {
  // Auto-maximize only wiki tab (not manga, about, faq, home)
  if (pageKey === "wiki") {
    setTimeout(() => {
      if (!middleTab.classList.contains("maximized")) {
        // New smooth animation only for wiki tab
        middleTab.classList.add("slow-maximize");

        // Set final maximized state after animation
        setTimeout(() => {
          middleTab.classList.remove("slow-maximize");
          middleTab.classList.add("maximized");
          document.body.classList.add("window-maximized");
        }, 600);
      }
    }, 100);
  }

  // NEVER maximize these tabs - keep them normal size PERMANENTLY
  if (
    pageKey === "manga" ||
    pageKey === "home" ||
    pageKey === "books" ||
    pageKey === "faq"
  ) {
    // Force ensure these tabs are NEVER maximized
    middleTab.classList.remove("maximized");
    document.body.classList.remove("window-maximized");
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
      `,
    },
  ],
  currentPage: 0,
};

let isDiaryEditing = false;
let diaryOverlay = null;

// Load diary data from localStorage
function loadDiaryData() {
  const saved = localStorage.getItem("diaryData");
  if (saved) {
    diaryData = JSON.parse(saved);
  }
}

// Save diary data to localStorage
function saveDiaryData() {
  localStorage.setItem("diaryData", JSON.stringify(diaryData));
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

  diaryOverlay = document.createElement("div");
  diaryOverlay.className = "diary-overlay";
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
    const book = document.getElementById("diaryBook3d");

    // Phase 1: Appear (fade-in + scale-up + rotate to show angle)
    book.classList.add("animating");

    // Phase 2: Rotate to show front cover straight on
    setTimeout(() => {
      book.classList.remove("animating");
      book.classList.add("phase-rotate");

      // Phase 3: Open the book
      setTimeout(() => {
        book.classList.remove("phase-rotate");
        book.classList.add("phase-open");

        // Phase 4: Reading mode (cover fades, page faces user)
        setTimeout(() => {
          book.classList.remove("phase-open");
          book.classList.add("phase-reading");

          // Load content after book opens
          loadDiaryPage(diaryData.currentPage);
        }, 800);
      }, 800);
    }, 600);
  }, 100);

  // Close on escape key
  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      closeDiary();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);
}

// Load diary page content
function loadDiaryPage(pageIndex) {
  const contentDiv = document.getElementById("diaryContent");
  const pageIndicator = document.getElementById("pageIndicator");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

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
  const contentPage = document.getElementById("diaryContentPage");
  if (contentPage) {
    contentPage.scrollTop = 0;
    contentPage.classList.remove("scrolled");
  }
}

// Scroll to bottom of diary page
function scrollDiaryToBottom() {
  const contentPage = document.getElementById("diaryContentPage");
  if (contentPage) {
    contentPage.scrollTop = contentPage.scrollHeight;
    contentPage.classList.add("scrolled");
  }
}

// Close diary
function closeDiary() {
  if (diaryOverlay) {
    const book = document.getElementById("diaryBook3d");

    if (book) {
      // Remove reading mode and add closing animation
      book.classList.remove("phase-reading");
      book.classList.add("closing");

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
      diaryOverlay.style.opacity = "0";
      diaryOverlay.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        if (diaryOverlay && diaryOverlay.parentNode) {
          diaryOverlay.remove();
        }
        diaryOverlay = null;
        isDiaryEditing = false;
      }, 500);
    }
  }
  playSound("tabClick", 0);
}

// Enable diary editing mode
function enableDiaryEditing() {
  if (!diaryOverlay) {
    // Create diary if not open
    createDiaryOverlay();
  }

  isDiaryEditing = true;

  const pagesDiv = document.getElementById("diaryPages");
  const contentDiv = document.getElementById("diaryContent");

  pagesDiv.classList.add("editing");
  contentDiv.contentEditable = true;

  // Create editing toolbar
  let toolbar = document.getElementById("diaryEditToolbar");
  if (!toolbar) {
    toolbar = document.createElement("div");
    toolbar.id = "diaryEditToolbar";
    toolbar.className = "diary-edit-toolbar";
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

  const pagesDiv = document.getElementById("diaryPages");
  const contentDiv = document.getElementById("diaryContent");

  if (pagesDiv) pagesDiv.classList.remove("editing");
  if (contentDiv) contentDiv.contentEditable = false;

  const toolbar = document.getElementById("diaryEditToolbar");
  if (toolbar) toolbar.remove();
}

// Format text in diary
function diaryFormat(command) {
  document.execCommand(command, false, null);
}

// Change font in diary
function diaryChangeFont(font) {
  document.execCommand("fontName", false, font);
}

// Change font size in diary
function diaryChangeSize(size) {
  document.execCommand("fontSize", false, "7");
  // Apply custom size via CSS
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = size;
    range.surroundContents(span);
  }
}

// Change text color in diary
function diaryChangeColor(color) {
  document.execCommand("foreColor", false, color);
}

// Add image to diary
function diaryAddImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = document.createElement("img");
        img.src = event.target.result;
        img.style.maxWidth = "100%";
        img.style.cursor = "move";
        img.style.border = "2px dashed #8B4513";
        img.style.margin = "15px 0";
        img.style.borderRadius = "8px";
        img.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";

        document.execCommand("insertHTML", false, img.outerHTML);
        setupDiaryImageEditing();
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

// Setup image drag and resize in diary
function setupDiaryImageEditing() {
  const images = document.querySelectorAll("#diaryContent img");
  images.forEach((img) => {
    if (isDiaryEditing) {
      img.style.cursor = "move";
      img.draggable = true;

      // Simple drag handling
      img.ondragstart = function (e) {
        e.dataTransfer.setData("text/plain", "dragging");
      };

      // Double click to resize
      img.ondblclick = function () {
        const newWidth = prompt("Enter width (px or %):", "100%");
        if (newWidth) {
          this.style.width = newWidth;
          this.style.height = "auto";
        }
      };
    }
  });
}

// Add new page to diary
function diaryAddPage() {
  if (!isDiaryEditing) {
    alert("Please enable editing mode first!");
    return;
  }

  const title = prompt("Enter page title:", "New Page");
  if (title) {
    const newPage = {
      id: Date.now(),
      title: title,
      content: "<p>Start writing here...</p>",
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
    alert("Please enable editing mode first!");
    return;
  }

  if (diaryData.pages.length <= 1) {
    alert("Cannot delete the last page!");
    return;
  }

  if (confirm("Delete this page? This cannot be undone.")) {
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
  const contentDiv = document.getElementById("diaryContent");
  if (contentDiv) {
    // Clone the content to work with it
    const tempDiv = contentDiv.cloneNode(true);

    // Get the title from the h1 element
    const titleElement = tempDiv.querySelector("h1.diary-title");
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

    alert("Diary saved successfully!");
  }
}

// Open diary from admin panel
function openDiaryEditor() {
  // Show diary page
  showPage("diary");
  playSound("tabClick", 0);

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
  if (!imageSrc || imageSrc === "undefined") {
    return;
  }

  // Find current index based on imageSrc
  currentArtworkIndex = artworkData.findIndex(
    (artwork) => artwork.src === imageSrc,
  );
  if (currentArtworkIndex === -1) currentArtworkIndex = 0;

  // Remove any existing viewer
  const existingViewer = document.getElementById("artworkViewer");
  if (existingViewer) {
    existingViewer.remove();
  }

  // Create new viewer
  const viewer = document.createElement("div");
  viewer.id = "artworkViewer";
  viewer.className = "artwork-viewer show";
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
  const closeBtn = viewer.querySelector(".artwork-viewer-close");
  closeBtn.addEventListener("click", function () {
    viewer.remove();
    playSound("tabClick", 0);
  });

  // Add navigation functionality
  const prevBtn = viewer.querySelector(".artwork-nav-prev");
  const nextBtn = viewer.querySelector(".artwork-nav-next");

  prevBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    navigateArtwork(-1);
  });

  nextBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    navigateArtwork(1);
  });

  // Close on background click
  viewer.addEventListener("click", function (e) {
    if (e.target === viewer) {
      viewer.remove();
      playSound("tabClick", 0);
    }
  });

  // Close on escape key
  const escapeHandler = function (e) {
    if (e.key === "Escape") {
      viewer.remove();
      document.removeEventListener("keydown", escapeHandler);
      playSound("tabClick", 0);
    }
    // Arrow key navigation
    if (e.key === "ArrowLeft") {
      navigateArtwork(-1);
    }
    if (e.key === "ArrowRight") {
      navigateArtwork(1);
    }
  };
  document.addEventListener("keydown", escapeHandler);
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
    const img = document.querySelector("#artworkViewer img");
    if (img) {
      img.src = artwork.src;
      img.alt = artwork.title || "";
    }
  }
}

function closeArtworkViewer() {
  const viewer = document.getElementById("artworkViewer");
  if (viewer) {
    viewer.classList.remove("show");
  }
  playSound("tabClick", 0);
}

function loadSavedData() {
  // Clear any old wiki content that might be cached
  localStorage.removeItem("wikiContent");

  // Load artwork data from localStorage
  const savedArtwork = localStorage.getItem("artworkData");
  if (savedArtwork) {
    try {
      const parsed = JSON.parse(savedArtwork);
      if (Array.isArray(parsed) && parsed.length > 0) {
        artworkData = parsed;
      }
    } catch (e) {
      // Error loading artwork data, using defaults
    }
  }

  const savedData = localStorage.getItem("websiteData");
  if (savedData) {
    try {
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
    } catch (e) {
      console.error("Error loading website data:", e);
    }
  }
}

// Save data to localStorage
function saveData() {
  const data = {
    home: pages.home,
    about: pages.about,
    // Skip saving wiki to prevent old content conflicts
  };
  localStorage.setItem("websiteData", JSON.stringify(data));
}

function addArtwork() {
  const fileInput = document.getElementById("artworkFile");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
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
      const insertPoint = workContent.lastIndexOf("</div>");
      pages.work.content =
        workContent.slice(0, insertPoint) +
        newArtwork +
        workContent.slice(insertPoint);

      saveData(); // Save to localStorage

      // Refresh the work page if it's currently displayed to ensure new images work
      if (tabContent.innerHTML.includes("My Work")) {
        showPage("work");
      }

      // Update the artwork dropdown
      updateArtworkSelect();

      fileInput.value = "";
      playSound("tabClick", 0);
    };
    reader.readAsDataURL(file);
  }
}

function removeArtwork() {
  const select = document.getElementById("artworkSelect");
  const selectedIndex = parseInt(select.value);

  if (isNaN(selectedIndex)) {
    alert("Please select artwork to remove!");
    return;
  }

  // Remove the selected artwork
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = pages.work.content;
  const artworkItems = tempDiv.querySelectorAll(".artwork-item");

  if (artworkItems[selectedIndex]) {
    artworkItems[selectedIndex].remove();
    pages.work.content = tempDiv.innerHTML;

    saveData(); // Save to localStorage

    // Refresh the work page if it's currently displayed
    if (tabContent.innerHTML.includes("My Work")) {
      showPage("work");
    }

    // Update the artwork dropdown
    updateArtworkSelect();

    playSound("tabClick", 0);
  }
}

const mangaCoverImage = "./SHOWERTHOUGHTS.webp";

const mangaInfo = {
  title: "Shower Thoughts",
  cover: "./SHOWERTHOUGHTS.webp",
  synopsis:
    "A contemplative journey through the deepest thoughts that emerge in the most mundane moments. When the water runs and steam rises, profound revelations surface from the subconscious.",
};

function showMangaCover() {
  // Remove any existing manga cover or modal
  const existingCover = document.getElementById("mangaCoverOverlay");
  if (existingCover) {
    existingCover.remove();
  }
  const existingModal = document.getElementById("mangaDetailModal");
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

  document.body.insertAdjacentHTML("beforeend", coverHTML);
  // Removed duplicate sound - only play when opening, not when closing
}

function closeMangaCover() {
  const overlay = document.getElementById("mangaCoverOverlay");
  if (overlay) {
    overlay.remove();
  }
}

function exitMangaCover() {
  playSound("exit", 0);
  const overlay = document.getElementById("mangaCoverOverlay");
  if (overlay) {
    overlay.remove();
  }
  const modal = document.getElementById("mangaDetailModal");
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

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  // Removed duplicate sound - only play when opening the cover, not when opening detail
}

function closeMangaDetail() {
  const modal = document.getElementById("mangaDetailModal");
  if (modal) {
    modal.remove();
  }
}

function backToMangaCover() {
  playSound("back", 0);
  const modal = document.getElementById("mangaDetailModal");
  if (modal) {
    modal.remove();
  }
  showMangaCover();
}

function exitMangaDetail() {
  playSound("exit", 0);
  const modal = document.getElementById("mangaDetailModal");
  if (modal) {
    modal.remove();
  }
}

function openMangaTab(mangaId) {
  showMangaCover();
}

// --- Q&A Page Functions ---
let qaCurrentCharacter = 1;
let qaCurrentStyle = "sketch";

const qaCharacterImages = {
  1: {
    sketch: "./character1_sketch.webp",
    flat: "./character1_flat.webp",
    rendered: "./character1_rendered.webp",
  },
  2: {
    sketch: "./character2_sketch.webp",
    flat: "./character2_flat.webp",
    rendered: "./character2_rendered.webp",
  },
  3: {
    sketch: "./character3_sketch.webp",
    flat: "./character3_flat.webp",
    rendered: "./character3_rendered.webp",
  },
  4: {
    sketch: "./character4_sketch.webp",
    flat: "./character4_flat.webp",
    rendered: "./character4_rendered.webp",
  },
  5: {
    sketch: "./character5_sketch.webp",
    flat: "./character5_flat.webp",
    rendered: "./character5_rendered.webp",
  },
};

function getQACharacterImage(char, style) {
  const img =
    qaCharacterImages[char] && qaCharacterImages[char][style]
      ? qaCharacterImages[char][style]
      : "./girl 1.webp";
  return img;
}

function showQASection(section, evt) {
  document
    .querySelectorAll(".qa-nav-btn")
    .forEach((btn) => btn.classList.remove("active"));
  if (evt && evt.target) evt.target.classList.add("active");
  document
    .querySelectorAll(".qa-section")
    .forEach((sec) => sec.classList.remove("active"));
  document.getElementById("qa-" + section).classList.add("active");
  if (typeof playSound === "function") {
    playSound("qaClick1", 0); // Newspaper foley sound for top nav tabs
  }
}

function switchCharacter(charNum) {
  qaCurrentCharacter = charNum;
  document.querySelectorAll(".char-btn").forEach((btn, index) => {
    btn.classList.toggle("active", index + 1 === charNum);
  });
  const img = document.getElementById("character-image");
  if (img) img.src = getQACharacterImage(charNum, qaCurrentStyle);
  if (typeof playSound === "function") {
    playSound("qaClick2", 0); // Click bubble sound for C1-C5 buttons
  }
}

function switchCharacterStyle(style) {
  qaCurrentStyle = style;
  document.querySelectorAll(".style-circle").forEach((circle, index) => {
    const styles = ["sketch", "flat", "rendered"];
    circle.classList.toggle("active", styles[index] === style);
  });
  const img = document.getElementById("character-image");
  if (img) img.src = getQACharacterImage(qaCurrentCharacter, style);
  if (typeof playSound === "function") {
    playSound("qaClick3", 0); // Bubble pop sound for style circles
  }
}

function closeQATab() {
  if (typeof playSound === "function") {
    playSound("close", 0);
  }
  if (typeof showPage === "function") {
    showPage("home");
  }
}

function togglePricingPanel() {
  const panel = document.querySelector(".pricing-panel");
  const btn = document.querySelector(".pricing-tab-btn");
  if (panel) {
    panel.classList.toggle("mobile-visible");
    if (btn) {
      btn.classList.toggle(
        "active",
        panel.classList.contains("mobile-visible"),
      );
    }
    if (typeof playSound === "function") {
      playSound("qaClick4", 0); // Pop tap sound for pricing toggle
    }
  }
}

// ðŸŽ¯ Create circular favicon from JPG
function createCircularFavicon() {
  if (isLocalFileProtocol()) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 64;
    canvas.width = size;
    canvas.height = size;

    // Create circular clip
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw image
    ctx.drawImage(img, 0, 0, size, size);

    // Set as favicon
    const link =
      document.querySelector('link[rel="icon"]') ||
      document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = canvas.toDataURL("image/png");
    if (!document.querySelector('link[rel="icon"]')) {
      document.head.appendChild(link);
    }
  };
  img.onerror = () => {};
  img.src = "./assets/profile website.webp";
}

// Run when page loads
createCircularFavicon();

// ====== FULL CONTENT PROTECTION ======
// Disable right-click on entire page
document.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
    return false;
  },
  false,
);

// Disable dragging anything
document.addEventListener(
  "dragstart",
  function (e) {
    e.preventDefault();
    return false;
  },
  false,
);

// Disable text selection
document.addEventListener(
  "selectstart",
  function (e) {
    e.preventDefault();
    return false;
  },
  false,
);

// Block keyboard shortcuts for screenshots and DevTools
document.addEventListener(
  "keydown",
  function (e) {
    // Print Screen
    if (e.key === "PrintScreen" || e.keyCode === 44) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I (DevTools)
    if (e.shiftKey && e.key === "I" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.shiftKey && e.key === "J" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C (Inspect Element)
    if (e.shiftKey && e.key === "C" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (View Source)
    if (e.key === "U" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+S (Save Page)
    if (e.key === "S" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return false;
    }
    // Ctrl+P (Print)
    if (e.key === "P" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      return false;
    }
  },
  false,
);

// Clear clipboard when window loses focus (anti-screenshot)
document.addEventListener("blur", function () {
  if (navigator.clipboard) {
    navigator.clipboard.writeText("").catch(function () {});
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
  [
    "Alright... what was I saying again...",
    "No, wait, that doesn't sound right.",
    "It made more sense a second ago.",
    "Whatever. I'll just go with it.",
    "It's not like anyone's correcting me.",
  ],
  [
    "I keep losing my train of thought lately.",
    "It's like it's there, then it just... gone.",
    "Maybe I'm overthinking it.",
    "Yeah, I do that a lot.",
    "Still, not the worst habit to have.",
  ],
  [
    "I should probably say something more interesting.",
    "That would help.",
    "But then again, forcing it usually makes it worse.",
    "So... this is fine.",
    "I think this is fine.",
  ],
  [
    "I'm kind of just talking to fill the space now.",
    "Not sure if that's a good thing.",
    "Feels better than stopping, though.",
    "Stopping makes it feel... empty.",
    "Yeah. I'll keep going.",
  ][
    ("Wow, that was not as smooth as I thought it'd be.",
    "I really thought I had something there.",
    "Nope.",
    "Completely fell apart.",
    "Impressive, honestly.")
  ],
  [
    "It's weird how quiet things get.",
    "Like... suddenly there's too much room to think.",
    "And then everything just kind of echoes.",
    "I don't always like that part.",
    "But I stay anyway.",
  ],
  [
    "I keep hearing myself talk.",
    "Even when I stop, it feels like it didn't end.",
    "Like something's still continuing.",
    "Maybe it's just me.",
    "Yeah... probably just me.",
  ],
  [
    "Okay, okay... just keep it simple.",
    "No need to overdo it.",
    "Just say what comes to mind.",
    "That usually works.",
    "Well... most of the time.",
  ],
  [
    "It's been a pretty slow day.",
    "Nothing really stood out, just the usual stuff.",
    "I kinda like days like that, though.",
    "Everything feels lighter when nothing big happens.",
    "You can just exist for a bit.",
  ],
  [
    "I was walking earlier and didn't really have anywhere to be.",
    "Ended up taking the long way without thinking about it.",
    "Didn't even check the time.",
    "It felt nice, not rushing for once.",
    "I don't do that enough.",
  ][
    ("I've been thinking about changing things up a little.",
    "Not anything big, just small stuff.",
    "Like routines, I guess.",
    "Doing the same things every day gets kind of dull.",
    "A small change might help.")
  ],
  [
    "You don't really have to say anything.",
    "I'm okay just talking like this.",
    "It's kinda peaceful.",
    "Feels like the kind of quiet that isn't awkward.",
    "Just... there.",
  ],
  [
    "It's weird how some moments stick more than others.",
    "Even small ones.",
    "Like nothing special was happening, but it still felt important.",
    "I can't really explain why.",
    "It just did.",
  ],
  [
    "I tried to be productive earlier.",
    "Didn't go as planned.",
    "Got distracted halfway through.",
    "Honestly, not even surprised anymore.",
    "That's just how it goes sometimes.",
  ][
    ("I don't mind this kind of quiet.",
    "It feels different when someone's still here.",
    "Even if nothing's being said back.",
    "It's not empty.",
    "Just calm.")
  ],
  [
    "I'll keep talking for a bit.",
    "No real reason to stop.",
    "This moment hasn't ended yet.",
    "So I'll stay in it.",
    "At least a little longer.",
  ],
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
  const availableIndices = AI_IDLE_SMALL_TALK_SCRIPTS.map((_, i) => i).filter(
    (i) => !aiUsedIdleScripts.has(i),
  );

  // If all scripts used, reset the tracking
  if (availableIndices.length === 0) {
    aiUsedIdleScripts.clear();
    availableIndices.push(...AI_IDLE_SMALL_TALK_SCRIPTS.map((_, i) => i));
  }

  // Pick random available script
  const randomIndex =
    availableIndices[Math.floor(Math.random() * availableIndices.length)];
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
    playSound("typing", 0);
    aiTypingSoundTimeout = setTimeout(
      playTypingTick,
      80 + Math.floor(Math.random() * 70),
    );
  };
  playTypingTick();
}

function stopAITypingSound() {
  if (aiTypingSoundTimeout) {
    clearTimeout(aiTypingSoundTimeout);
    aiTypingSoundTimeout = null;
  }
}

function openAICompanion() {
  clearAiIdleSmallTalk();
  const companion = document.getElementById("aiCompanion");
  const orb = document.getElementById("aiOrb");
  const optionsContainer = document.getElementById("aiOptions");
  const navButtons = document.querySelector(".nav-buttons");

  // Show companion in center
  companion.classList.add("active", "center");
  companion.classList.remove("top-left", "top-right");
  orb.classList.remove("speaking");
  aiCompanionActive = true;

  // Hide nav buttons
  if (navButtons) navButtons.classList.add("hidden");

  playSound("open", 0);

  // Hide options initially
  if (optionsContainer) optionsContainer.classList.remove("show");

  // After greeting, move to top-right
  setTimeout(() => {
    aiSpeak("Hi! Lazyman_XD here. What can I do for you?", () => {
      scheduleAiIdleSmallTalk(10000);
    });
  }, 500);

  // Move to top-right after speaking and show options
  setTimeout(() => {
    if (!aiCompanionActive) return;
    companion.classList.remove("center");
    companion.classList.add("top-right");
    if (optionsContainer) optionsContainer.classList.add("show");
  }, 3500);
}

function closeAICompanion() {
  clearAiIdleSmallTalk();
  const companion = document.getElementById("aiCompanion");
  const speechBubble = document.getElementById("aiSpeechBubble");
  const optionsContainer = document.getElementById("aiOptions");
  const navButtons = document.querySelector(".nav-buttons");

  companion.classList.remove("active", "center", "top-left", "top-right");
  speechBubble.classList.remove("show");
  if (optionsContainer) optionsContainer.classList.remove("show");
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

  // Show nav buttons again
  if (navButtons) navButtons.classList.remove("hidden");

  playSound("close", 0);
}

function aiSpeak(text, callback) {
  const speechBubble = document.getElementById("aiSpeechBubble");
  const speechText = document.getElementById("aiSpeechText");
  const typingCursor = document.getElementById("aiTypingCursor");
  const orb = document.getElementById("aiOrb");

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
  speechText.textContent = "";
  typingCursor.style.display = "inline-block";
  speechBubble.classList.add("show");
  orb.classList.add("speaking");
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
      typingCursor.style.display = "none";
      orb.classList.remove("speaking");
      stopAITypingSound();
      aiBubbleHideTimeout = setTimeout(() => {
        speechBubble.classList.remove("show");
        aiBubbleHideTimeout = null;
      }, 3000);
      // Execute callback if provided
      if (callback && typeof callback === "function") {
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

function showCommissionPricing() {
  // Hide AI options temporarily
  const optionsContainer = document.getElementById("aiOptions");
  if (optionsContainer) optionsContainer.classList.remove("show");

  // Create pricing dialog
  const pricingDialog = document.createElement("div");
  pricingDialog.id = "commissionPricingDialog";
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
  playSound("tabClick", 0);
}

function closeCommissionPricing() {
  const dialog = document.getElementById("commissionPricingDialog");
  if (dialog) dialog.remove();

  // Only show AI options again if AI companion is active
  const optionsContainer = document.getElementById("aiOptions");
  if (optionsContainer && aiCompanionActive) {
    optionsContainer.classList.add("show");
    scheduleAiIdleSmallTalk(10000);
  }
}

function askAI(topic) {
  playSound("click", 0);
  clearAiIdleSmallTalk();

  if (topic === "roadmap") {
    aiSpeak(
      "I made a roadmap to organize my work so I don't try to do everything at once. I don't expect these projects to be finished in a day or a week - it may take years depending on my mood and pace. I'll keep sharing updates here on my website and on my Reddit.",
      function () {
        if (roadmapOverlay && !roadmapOverlay.classList.contains("show")) {
          toggleRoadmapOverlay();
        }
        scheduleAiIdleSmallTalk(10000);
      },
    );
    return;
  }

  const responses = {
    commissions:
      "Yes! I do art commissions! If you're interested in getting some artwork done, feel free to reach out! Check the Work section to see examples of my art style.",
    artworks:
      "I've created lots of artwork over the years! From digital illustrations to character designs. Head over to the Work section to browse through my gallery!",
    mangas:
      "Oh, the manga section! I've been working on some manga projects. There are stories, characters, and worlds I've built. Check the Manga button to dive into my creations!",
    who: "I'm Lazyman_XD! A creative soul who loves art, coding, and storytelling. I made this website to showcase my work and connect with people like you!",
    why: "Why am I here? Great question! I exist to create, express myself, and share my passion with the world. Every piece of art, every line of code - it's all part of my journey.",
    effort:
      "Haha, fair question! I put effort into this AI because I wanted something unique - a way to interact with visitors that feels personal and fun. Plus, I just really enjoy building cool stuff! Hope you like it!",
    characters:
      "They're just characters that might be future characters that get a cameo on my manga. You never know who might show up in the story!",
  };

  const response = responses[topic] || "Hmm, let me think about that...";

  // Define callbacks for specific topics
  let callback = null;
  if (topic === "commissions") {
    callback = function () {
      aiSpeak("Here's my pricing info:", function () {
        showCommissionPricing();
        scheduleAiIdleSmallTalk(10000);
      });
    };
  } else if (topic === "artworks") {
    callback = function () {
      // Close AI and show work page
      closeAICompanion();
      setTimeout(() => {
        showPage("work");
      }, 300);
    };
  } else {
    // For all other topics, schedule idle small talk after responding
    callback = function () {
      scheduleAiIdleSmallTalk(10000);
    };
  }

  aiSpeak(response, callback);
}

// CSS protection
(function () {
  const s = document.createElement("style");
  s.innerHTML =
    '*{-webkit-user-drag:none;-moz-user-drag:none;-o-user-drag:none;user-drag:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;font-family:"Press Start 2P",cursive !important;-webkit-font-smoothing:none;-moz-osx-font-smoothing:grayscale;}img{pointer-events:none;}';
  document.head.appendChild(s);
})();
