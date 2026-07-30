/**
 * Work Cards Module
 * Handles artwork card display and fullscreen viewer
 */

const artworkData = [
  {src: "./illustrations/3.1 (2).webp", title: "Artwork 1"},
  {src: "./illustrations/marry.webp", title: "Artwork 2"},
  {src: "./illustrations/angelist.webp", title: "Artwork 3"},
  {src: "./illustrations/BFF forever.webp", title: "Artwork 4"},
  {src: "./illustrations/dancing in the rain of blood.webp", title: "Artwork 5"},
  {src: "./illustrations/milestone with hornet.webp", title: "Artwork 6"},
  {src: "./illustrations/sketch of ya shit - Copy - Copy - Copy (15) - Copy - Copy.webp", title: "Artwork 7"},
  {src: "./illustrations/the paler king.webp", title: "Artwork 8"},
  {src: "./illustrations/SHOWERTHOUGHTS2.webp", title: "Artwork 9"},
  {src: "./illustrations/490114687_9595337863888220_562112844725561463_n.webp", title: "Artwork 10"},
  {src: "./illustrations/work-artwork-11.webp", title: "Artwork 11"},
  {src: "./illustrations/work-artwork-12.webp", title: "Artwork 12"},
  {src: "./illustrations/work-artwork-13.webp", title: "Artwork 13"},
  {src: "./illustrations/dave.webp", title: "Dave"},
  {src: "./illustrations/linda.webp", title: "Linda"},
  {src: "./illustrations/mike.webp", title: "Mike"}
];

let workCardsShowing = false;
let workCardElements = [];
let workCardsShowTimeoutId = null;
let lastWorkCardsButton = null;

/**
 * Show work cards in a grid layout
 * @param {HTMLElement} button - Button that triggered the action
 */
window.__showWorkCardsImpl = function showWorkCards(button) {
  lastWorkCardsButton = button;
  workCardElements.forEach(el => el.remove());
  workCardElements = [];
  workCardsShowing = false;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const buttonRect = button.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonTopY = buttonRect.top;
  
  let cardSize, spacingX, spacingY, cardsPerRow;
  const totalCards = artworkData.length;
  
  if (viewportWidth <= 480) {
    cardSize = 80;
    spacingX = 90;
    spacingY = 100;
    cardsPerRow = 3;
  } else if (viewportWidth <= 768) {
    cardSize = 100;
    spacingX = 115;
    spacingY = 125;
    cardsPerRow = 4;
  } else {
    cardSize = 120;
    spacingX = 140;
    spacingY = 150;
    cardsPerRow = 5;
  }
  
  const totalRows = Math.ceil(totalCards / cardsPerRow);
  const gridWidth = Math.min(cardsPerRow, totalCards) * spacingX;
  const gridHeight = totalRows * spacingY;
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  
  const buttonBuffer = 100;
  let gridTopY = centerY - (gridHeight / 2);
  let gridLeftX = centerX - (gridWidth / 2);
  
  if (gridTopY + gridHeight > buttonTopY - buttonBuffer && 
      gridLeftX < buttonCenterX + buttonBuffer && 
      gridLeftX + gridWidth > buttonCenterX - buttonBuffer) {
    gridTopY = buttonTopY - gridHeight - buttonBuffer;
  }
  
  gridTopY = Math.max(20, Math.min(gridTopY, viewportHeight - gridHeight - 20));
  gridLeftX = Math.max(20, Math.min(gridLeftX, viewportWidth - gridWidth - 20));
  
  workCardElements = [];
  
  artworkData.forEach((artwork, index) => {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.dataset.src = artwork.src;
    card.dataset.title = artwork.title;
    card.dataset.index = index;
    
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    const cardsInThisRow = Math.min(cardsPerRow, totalCards - (row * cardsPerRow));
    const rowWidth = cardsInThisRow * spacingX;
    const rowStartX = gridLeftX + (gridWidth - rowWidth) / 2 + (spacingX / 2);
    
    const cardX = rowStartX + (col * spacingX);
    const cardY = gridTopY + (row * spacingY) + (spacingY / 2);
    
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
    
    card.onclick = (e) => {
      e.stopPropagation();
      if (typeof playSound === 'function') playSound('tabClick', 0);
      openWorkCardFullscreen(card, artwork.src, artwork.title);
    };
    
    document.body.appendChild(card);
    workCardElements.push(card);
    
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

/**
 * Hide work cards with animation
 * @param {HTMLElement} button - Button that triggered the action
 */
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
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
  }
  
  workCardElements.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = `translate(-50%, -50%) scale(0.1) rotate(0deg)`;
      card.style.left = `${targetX}px`;
      card.style.top = `${targetY}px`;
      card.style.opacity = '0';
    }, index * 50);
    
    setTimeout(() => {
      if (card.parentNode) {
        card.remove();
      }
    }, 600 + (index * 50));
  });
  
  workCardElements = [];
  workCardsShowing = false;
};

/**
 * Open artwork in fullscreen viewer
 * @param {HTMLElement} card - Card element
 * @param {string} src - Image source
 * @param {string} title - Artwork title
 */
function openWorkCardFullscreen(card, src, title) {
  const rect = card.getBoundingClientRect();
  card.dataset.returnX = rect.left;
  card.dataset.returnY = rect.top;
  card.dataset.returnTransform = card.style.transform;
  
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
  
  const closeViewer = () => {
    viewer.remove();
    if (typeof playSound === 'function') playSound('tabClick', 0);
  };
  
  closeBtn.onclick = closeViewer;
  viewer.onclick = (e) => {
    if (e.target === viewer) closeViewer();
  };
  
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeViewer();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Artwork images are loaded when the work shelf is opened.
