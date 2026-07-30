/**
 * Main Initialization Module
 * Initializes all modules and handles page load events
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  if (typeof attachNavListeners === 'function') {
    attachNavListeners();
  }

  // Initialize audio unlock on first interaction
  document.addEventListener('click', () => {
    if (typeof unlockAudio === 'function') {
      unlockAudio();
    }
  }, { once: true });

  // Handle page visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause animations when tab is hidden
      if (typeof animationId !== 'undefined') {
        cancelAnimationFrame(animationId);
      }
    } else {
      // Resume animations when tab is visible
      if (typeof animateParticles === 'function') {
        animateParticles();
      }
    }
  });

  // Initialize slow reveal loading screen
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1500);
  }

  // Load saved page from localStorage
  const savedPage = localStorage.getItem('lastOpenedPage');
  if (savedPage && savedPage !== 'home') {
    setTimeout(() => {
      if (typeof showPage === 'function') {
        showPage(savedPage);
      }
    }, 2000);
  } else {
    // Show home page by default
    if (typeof showPage === 'function') {
      showPage('home');
    }
  }

  // Initialize wallpaper animation
  if (typeof animateWallpaper === 'function') {
    animateWallpaper();
  }

  // Initialize nested parallax
  if (typeof animateNestedParallax === 'function') {
    animateNestedParallax();
  }

  // Create circular favicon
  createCircularFavicon();
});

/**
 * Create circular favicon from image
 */
function createCircularFavicon() {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(img, 0, 0, size, size);
    
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

/**
 * Toggle roadmap overlay
 */
function toggleRoadmapOverlay() {
  const overlay = document.getElementById('roadmapOverlay');
  if (overlay) {
    overlay.classList.toggle('show');
    if (typeof playSound === 'function') {
      playSound('tabClick', 0);
    }
  }
}

/**
 * Slow reveal loading screen
 */
function slowRevealLoading() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('reveal');
  }
}

/**
 * Animate wallpaper with parallax effect
 */
function animateWallpaper() {
  const wallpaper = document.querySelector('.wallpaper');
  if (!wallpaper) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    wallpaper.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/**
 * Animate nested parallax layers
 */
function animateNestedParallax() {
  const layers = document.querySelectorAll('.bg-layer');
  if (layers.length === 0) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    
    layers.forEach((layer, index) => {
      const depth = (index + 1) * 10;
      const moveX = x * depth;
      const moveY = y * depth;
      layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
}

// Export functions for global access
window.toggleRoadmapOverlay = toggleRoadmapOverlay;
window.slowRevealLoading = slowRevealLoading;
window.animateWallpaper = animateWallpaper;
window.animateNestedParallax = animateNestedParallax;
