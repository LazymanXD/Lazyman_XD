/**
 * Main Initialization Module
 * Initializes all modules and handles page load events
 */

document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  
  console.log('DOM Content Loaded');
  console.log('Loading screen element:', loadingScreen);
  
  if (!loadingScreen) {
    console.error('Loading screen element not found!');
  } else {
    console.log('Loading screen styles:', window.getComputedStyle(loadingScreen).display);
  }
  
  if (typeof attachNavListeners === 'function') attachNavListeners();

  document.addEventListener('click', () => { if (typeof unlockAudio === 'function') unlockAudio(); }, { once: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (typeof animationId !== 'undefined') cancelAnimationFrame(animationId);
    } else {
      if (typeof animateParticles === 'function') animateParticles();
    }
  });

  const savedPage = localStorage.getItem('lastOpenedPage');
  if (savedPage && savedPage !== 'home') {
    setTimeout(() => { if (typeof showPage === 'function') showPage(savedPage); }, 2000);
  } else {
    if (typeof showPage === 'function') showPage('home');
  }

  if (typeof animateWallpaper === 'function') animateWallpaper();
  if (typeof animateNestedParallax === 'function') animateNestedParallax();
  createCircularFavicon();

  setTimeout(() => {
    console.log('Hiding loading screen after 2 seconds');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      console.log('Added hidden class to loading screen');
    }
    setTimeout(() => { if (loadingScreen) loadingScreen.style.display = 'none'; }, 600);
  }, 2000);
});

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
    if (!document.querySelector('link[rel="icon"]')) document.head.appendChild(link);
  };
  img.src = './profile website.webp';
}

function toggleRoadmapOverlay() {
  const overlay = document.getElementById('roadmapOverlay');
  if (overlay) {
    overlay.classList.toggle('show');
    if (typeof playSound === 'function') playSound('tabClick', 0);
  }
}

function slowRevealLoading() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) loadingScreen.classList.add('reveal');
}

function animateWallpaper() {
  const wallpaper = document.querySelector('.wallpaper');
  if (!wallpaper) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    wallpaper.style.transform = `translate(${x}px, ${y}px)`;
  });
}

function animateNestedParallax() {
  const layers = document.querySelectorAll('.bg-layer');
  if (layers.length === 0) return;

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    
    layers.forEach((layer, index) => {
      const depth = (index + 1) * 10;
      layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
}

window.toggleRoadmapOverlay = toggleRoadmapOverlay;
window.slowRevealLoading = slowRevealLoading;
window.animateWallpaper = animateWallpaper;
window.animateNestedParallax = animateNestedParallax;
