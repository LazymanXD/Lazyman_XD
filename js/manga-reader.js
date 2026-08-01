/**
 * Manga Reader Module
 * Handles manga cards display and manga page viewer
 */

const mangaImagePool = {
  showerThoughts: "./assets/SHOWERTHOUGHTS.webp",
  witchesEnd: "./assets/manga-card-2.webp",
  lastIllsins: "./assets/manga-card-3.webp",
  last3sisns1: "./1/1.webp",
  last3sisns2: "./1/3.webp",
  last3sisns3: "./1/2.webp",
  last3sisns4: "./1/4.webp",
  last3sisns5: "./1/5.webp",
  last3sisns6: "./1/6.webp",
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
  last3sisnsIllust1: "./1/illustration folder/3.1 - Copy.webp",
  last3sisnsIllust2: "./1/illustration folder/5.2.webp",
  last3sisnsIllust3: "./1/illustration folder/5.3.webp",
  last3sisnsIllust4: "./1/illustration folder/6.1.webp",
  last3sisnsIllust5: "./1/illustration folder/6.2.webp",
  last3sisnsIllust6: "./1/illustration folder/6.3111.webp",
  last3sisnsIllust7: "./1/illustration folder/HFhGar0bQAETqpE.webp",
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
  msSilhouetteCover: "./4/PAGE_001.webp",
  msSilhouette1: "./4/Ms silhouette_002.webp",
  msSilhouette2: "./4/Ms silhouette_003.webp",
  msSilhouette3: "./4/Ms silhouette_004.webp",
  msSilhouette4: "./4/Ms silhouette_005.webp",
  msSilhouette5: "./4/Ms silhouette_006.webp",
  msSilhouette6: "./4/Ms silhouette_007.webp",
  msSilhouette7: "./4/Ms silhouette_008.webp",
  msSilhouette8: "./4/Ms silhouette_009.webp",
  msSilhouette9: "./4/Ms silhouette_010.webp",
  msSilhouetteTest: "./4/PAGE_001.webp",
};

const mangaGalleryData = [
  {
    coverKey: "witchesEnd",
    src: mangaImagePool.witchesEnd,
    title: "Witch's End",
    synopsis: "In a world where magic fades, one witch must face her final days. A tale of legacy, memory, and the end of an era.",
    customBackground: "linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)), #292929 url('./assets/witches-end-background.png') center/cover no-repeat fixed",
    customSidebarBackground: "linear-gradient(rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)), #292929 url('./assets/witches-end-background.png') center/cover no-repeat fixed",
    pageKeys: ["witchesEnd1", "witchesEnd2", "witchesEnd3", "witchesEnd4", "witchesEnd5", "witchesEnd6", "witchesEnd7", "witchesEnd8", "witchesEnd9", "witchesEnd10"],
    illustrations: ["witchesEndIllust1", "witchesEndIllust2", "witchesEndIllust3", "witchesEndIllust4", "witchesEndIllust5", "witchesEndIllust6", "witchesEndIllust7", "witchesEndIllust8", "witchesEndIllust9", "witchesEndIllust10", "witchesEndIllust11", "witchesEndIllust12", "witchesEndIllust13", "witchesEndIllust14", "witchesEndIllust15", "witchesEndIllust16", "witchesEndIllust17", "witchesEndIllust18", "witchesEndIllust19", "witchesEndIllust20", "witchesEndIllust21", "witchesEndIllust22", "witchesEndIllust23", "witchesEndIllust24", "witchesEndIllust25", "witchesEndIllust26"],
  },
  {
    coverKey: "lastIllsins",
    src: mangaImagePool.lastIllsins,
    title: "Last IIIsins",
    synopsis: "Three sins, three stories, one interconnected fate.",
    customBackground: "linear-gradient(135deg, #291919 0%, #190e0e 50%, #0e0909 100%)",
    customSidebarBackground: "linear-gradient(180deg, #190e0e 0%, #0e0909 100%)",
    sections: [
      { name: "Section 1", pageKeys: ["last3sisns1", "last3sisns2", "last3sisns3", "last3sisns4", "last3sisns5", "last3sisns6"] },
      { name: "Section 2", pageKeys: ["last3sisnsOne1", "last3sisnsOne2", "last3sisnsOne3", "last3sisnsOne3_1", "last3sisnsOne4", "last3sisnsOne5", "last3sisnsOne6", "last3sisnsOne7", "last3sisnsOne8", "last3sisnsOne9"] },
    ],
    illustrations: ["last3sisnsIllust1", "last3sisnsIllust2", "last3sisnsIllust3", "last3sisnsIllust4", "last3sisnsIllust5", "last3sisnsIllust6", "last3sisnsIllust7"],
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
    coverKey: "msSilhouette",
    src: mangaImagePool.msSilhouetteCover,
    title: "Ms. Silhouette",
    synopsis: "Fired, broke, and drowning in debt, Mary Silhouette takes in a stray black cat—only to discover it's the living key to the CEO's throne of a sky-piercing megacorporation.",
    customBackground: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    customSidebarBackground: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
    pageKeys: ["msSilhouette1", "msSilhouette2", "msSilhouette3", "msSilhouette4", "msSilhouette5", "msSilhouette6", "msSilhouette7", "msSilhouette8", "msSilhouette9"],
    illustrations: [],
  },
];

let mangaCardsShowing = false, mangaCardElements = [], mangaCardsShowTimeoutId = null, lastMangaCardsButton = null, currentMangaReader = null, currentMangaPages = [], currentMangaPageIndex = 0, currentMangaTitle = "", currentMangaSections = null, currentMangaSectionIndex = 0, currentMangaSection = "manga", currentManga = null, mangaNavDebounceTimer = null, currentMangaKeyHandler = null;

function getMangaPages(manga, sectionIndex = 0) {
  if (manga.sections && manga.sections[sectionIndex]) {
    return manga.sections[sectionIndex].pageKeys.map(k => mangaImagePool[k]).filter(Boolean);
  }
  if (!manga.pageKeys) return [];
  return manga.pageKeys.map(k => mangaImagePool[k]).filter(Boolean);
}

function getMangaGridConfig(w) {
  if (w <= 480) return { cardWidth: 95, cardHeight: 150, spacingX: 120, spacingY: 175, cardsPerRow: 2 };
  if (w <= 768) return { cardWidth: 125, cardHeight: 190, spacingX: 155, spacingY: 220, cardsPerRow: 2 };
  return { cardWidth: 145, cardHeight: 220, spacingX: 185, spacingY: 250, cardsPerRow: 4 };
}

function showMangaCards(button) {
  lastMangaCardsButton = button;
  mangaCardElements.forEach(el => el.remove());
  mangaCardElements = [];
  mangaCardsShowing = false;
  
  console.log('=== DEBUG: Total manga cards in gallery:', mangaGalleryData.length);
  console.log('=== DEBUG: Manga gallery data:', JSON.stringify(mangaGalleryData.map(m => ({ title: m.title, src: m.src }))));
  
  const { cardWidth, cardHeight, spacingX, spacingY, cardsPerRow } = getMangaGridConfig(window.innerWidth);
  const totalCards = mangaGalleryData.length;
  const totalRows = Math.ceil(totalCards / cardsPerRow);
  const gridWidth = Math.min(cardsPerRow, totalCards) * spacingX;
  const gridHeight = totalRows * spacingY;
  
  console.log('=== DEBUG: Grid config:', { cardWidth, cardHeight, spacingX, spacingY, cardsPerRow, totalCards, totalRows, gridWidth, gridHeight });
  
  const buttonRect = button.getBoundingClientRect();
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonTopY = buttonRect.top;
  
  let gridTopY = centerY - gridHeight / 2;
  let gridLeftX = centerX - gridWidth / 2;
  
  if (gridTopY + gridHeight > buttonTopY - 110 && gridLeftX < buttonCenterX + 110 && gridLeftX + gridWidth > buttonCenterX - 110) {
    gridTopY = buttonTopY - gridHeight - 110;
  }
  
  gridTopY = Math.max(20, Math.min(gridTopY, window.innerHeight - gridHeight - 20));
  gridLeftX = Math.max(20, Math.min(gridLeftX, window.innerWidth - gridWidth - 20));
  
  const startX = buttonRect.left + buttonRect.width / 2;
  const startY = buttonRect.top + buttonRect.height / 2;
  
  mangaGalleryData.forEach((manga, index) => {
    console.log(`Creating card ${index}: ${manga.title}, src: ${manga.src}, comingSoon: ${manga.comingSoon}`);
    
    const card = document.createElement("div");
    card.className = "manga-card";
    card.dataset.src = manga.src;
    card.dataset.title = manga.title;
    card.id = `manga-card-${index}`;
    
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    const cardsInThisRow = Math.min(cardsPerRow, totalCards - row * cardsPerRow);
    const rowWidth = cardsInThisRow * spacingX;
    const rowStartX = gridLeftX + (gridWidth - rowWidth) / 2 + spacingX / 2;
    const cardX = rowStartX + col * spacingX;
    const cardY = gridTopY + row * spacingY + spacingY / 2;
    
    console.log(`Card ${index} (${manga.title}) position: row=${row}, col=${col}, cardX=${cardX}, cardY=${cardY}, cardsInThisRow=${cardsInThisRow}`);
    
    card.style.cssText = `position:fixed;left:${startX}px;top:${startY}px;width:${cardWidth}px;height:${cardHeight}px;transform:translate(-50%,-50%) scale(0.1) rotate(0deg);opacity:0;z-index:3000;cursor:pointer;transition:all 0.3s ease;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.6);pointer-events:auto;border:2px solid rgba(255, 215, 0, 0.3);background:#1a1a2e;`;
    
    card.onmouseenter = () => {
      card.style.transform = card.style.transform.replace("scale(1)", "scale(1.1)");
      card.style.boxShadow = "0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)";
      card.style.borderColor = "rgba(255, 215, 0, 0.9)";
      card.style.zIndex = "3001";
    };
    
    card.onmouseleave = () => {
      card.style.transform = card.style.transform.replace("scale(1.1)", "scale(1)");
      card.style.boxShadow = "0 8px 32px rgba(0,0,0,0.6)";
      card.style.borderColor = "rgba(255, 215, 0, 0.3)";
      card.style.zIndex = "3000";
    };
    
    const img = document.createElement("img");
    img.src = manga.src;
    img.alt = manga.title;
    img.loading = "eager";
    img.decoding = "async";
    img.style.cssText = "width:100%;height:100%;object-fit:contain;display:block;background:#0e0e16";
    img.onerror = () => {
      console.error(`=== ERROR: Failed to load image for ${manga.title}: ${manga.src}`);
      card.style.background = '#ff0000';
      // Keep the card visible even if image fails
      card.style.opacity = '1';
    };
    img.onload = () => console.log(`=== SUCCESS: Loaded image for ${manga.title}`);
    card.appendChild(img);
    
    const titleOverlay = document.createElement("div");
    titleOverlay.textContent = manga.title;
    titleOverlay.style.cssText = "position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.7);color:#fff;padding:5px;font-size:12px;text-align:center;z-index:10";
    card.appendChild(titleOverlay);
    
    if (manga.comingSoon) {
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;pointer-events:none";
      const badge = document.createElement("div");
      badge.textContent = "SOON";
      badge.style.cssText = "background:linear-gradient(135deg,#ffd700 0%,#ffec8b 100%);color:#1a1a2e;padding:8px 16px;border-radius:20px;font-family:'Press Start 2P',cursive;font-size:10px;box-shadow:0 4px 15px rgba(0,0,0,0.5)";
      overlay.appendChild(badge);
      card.appendChild(overlay);
    }
    
    card.onclick = (e) => {
      e.stopPropagation();
      if (typeof playSound === "function") playSound("tabClick", 0);
      if (manga.comingSoon) {
        const toast = document.createElement("div");
        toast.className = "coming-soon-toast";
        toast.textContent = "Coming soon...";
        toast.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:#ffd700;padding:20px 40px;border-radius:12px;border:2px solid #ffd700;font-family:'Press Start 2P',cursive;font-size:14px;z-index:10000;box-shadow:0 10px 40px rgba(0,0,0,0.8)";
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = "0"; toast.style.transition = "opacity 0.3s ease"; setTimeout(() => toast.remove(), 300); }, 1500);
      } else {
        openMangaReader(manga);
      }
    };
    
    document.body.appendChild(card);
    mangaCardElements.push(card);
    console.log(`=== DEBUG: Card ${index} (${manga.title}) appended to DOM. Total manga cards in DOM: ${document.querySelectorAll('.manga-card').length}`);
    
    setTimeout(() => {
      card.style.left = `${cardX}px`;
      card.style.top = `${cardY}px`;
      card.style.transform = "translate(-50%,-50%) scale(1)";
      card.style.opacity = "1";
      console.log(`=== DEBUG: Card ${index} (${manga.title}) animated to position: ${cardX}, ${cardY}`);
      
      // Add position debugging
      const rect = card.getBoundingClientRect();
      console.log(`=== DEBUG: Card ${index} final position:`, { left: rect.left, top: rect.top, width: rect.width, height: rect.height, visible: rect.width > 0 && rect.height > 0 });
    }, 60 + index * 90);
  });
  
  console.log(`=== DEBUG: Finished creating ${mangaCardElements.length} manga cards`);
  console.log(`=== DEBUG: All card IDs:`, mangaCardElements.map(el => el.id));
  mangaCardsShowing = true;
}

function hideMangaCards(button) {
  if (mangaCardsShowTimeoutId !== null) {
    clearTimeout(mangaCardsShowTimeoutId);
    mangaCardsShowTimeoutId = null;
  }
  if (mangaCardElements.length === 0) return;
  
  const targetX = button ? button.getBoundingClientRect().left + button.getBoundingClientRect().width / 2 : window.innerWidth / 2;
  const targetY = button ? button.getBoundingClientRect().top + button.getBoundingClientRect().height / 2 : window.innerHeight / 2;
  
  mangaCardElements.forEach((card, index) => {
    setTimeout(() => {
      card.style.transform = "translate(-50%,-50%) scale(0.1)";
      card.style.left = `${targetX}px`;
      card.style.top = `${targetY}px`;
      card.style.opacity = "0";
    }, index * 50);
    
    setTimeout(() => { if (card.parentNode) card.remove(); }, 520 + index * 50);
  });
  
  mangaCardElements = [];
  mangaCardsShowing = false;
}

function renderMangaGrid(grid, imageList, labelPrefix) {
  grid.innerHTML = "";
  if (!imageList || !imageList.length) return;
  
  const fragment = document.createDocumentFragment();
  imageList.forEach((pageSrc, index) => {
    const panel = document.createElement("div");
    panel.className = "manga-panel";
    const img = document.createElement("img");
    img.src = pageSrc;
    img.alt = `${labelPrefix} ${index + 1}`;
    img.loading = "lazy";
    img.decoding = "async";
    panel.appendChild(img);
    panel.dataset.index = index;
    fragment.appendChild(panel);
  });
  grid.appendChild(fragment);
}

function openMangaReader(manga) {
  hideMangaCards();
  const pages = getMangaPages(manga);
  currentManga = manga;
  currentMangaSection = "manga";
  
  const reader = document.createElement("div");
  reader.id = "mangaReader";
  reader.className = "manga-reader-container";
  if (manga.customBackground) reader.style.background = manga.customBackground;
  
  reader.innerHTML = `
    <div class="manga-reader-sidebar">
      <button class="manga-reader-exit" onclick="closeMangaReader()" title="Exit">✕</button>
      <div class="manga-reader-cover"><img src="${manga.src}" alt="${manga.title}" loading="eager"></div>
      <div class="manga-reader-info"><h2 class="manga-reader-title">${manga.title}</h2><p class="manga-reader-synopsis">${manga.synopsis || ""}</p></div>
      ${manga.illustrations && manga.illustrations.length > 0 ? '<button class="manga-section-toggle" id="mangaSectionToggle" onclick="toggleMangaSection()">To Illustration</button>' : ""}
    </div>
    <div class="manga-reader-main"><div class="manga-reader-grid" id="mangaReaderGrid"></div></div>
  `;
  
  document.body.appendChild(reader);
  currentMangaReader = reader;
  
  if (manga.customSidebarBackground) {
    const sidebar = reader.querySelector(".manga-reader-sidebar");
    if (sidebar) {
      sidebar.style.background = manga.customSidebarBackground;
      sidebar.classList.add("manga-reader-sidebar-dark");
    }
  }
  
  const grid = document.getElementById("mangaReaderGrid");
  renderMangaGrid(grid, pages, "Page");
  
  grid.addEventListener("click", (e) => {
    const panel = e.target.closest(".manga-panel");
    if (panel) {
      const index = parseInt(panel.dataset.index);
      if (typeof playSound === "function") playSound("tabClick", 0);
      const activeImages = currentMangaSection === "illustration" && currentManga.illustrations ? currentManga.illustrations.map(k => mangaImagePool[k]).filter(Boolean) : pages;
      const activeTitle = currentMangaSection === "illustration" ? `${manga.title} - Illustrations` : manga.title;
      openMangaPageViewer(activeImages, index, activeTitle);
    }
  });
  
  const roadmapToggleBtn = document.getElementById("roadmapToggleBtn");
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = "none";
  if (typeof playSound === "function") playSound("open", 0);
  
  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      closeMangaReader();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);
}

function toggleMangaSection() {
  if (!currentManga) return;
  const toggleBtn = document.getElementById("mangaSectionToggle");
  const grid = document.getElementById("mangaReaderGrid");
  if (!toggleBtn || !grid) return;
  
  if (currentMangaSection === "manga") {
    const illustrationImages = (currentManga.illustrations || []).map(k => mangaImagePool[k]).filter(Boolean);
    if (!illustrationImages.length) return;
    currentMangaSection = "illustration";
    toggleBtn.textContent = "To Manga";
    renderMangaGrid(grid, illustrationImages, "Illustration");
  } else {
    currentMangaSection = "manga";
    toggleBtn.textContent = "To Illustration";
    renderMangaGrid(grid, getMangaPages(currentManga), "Page");
  }
  
  if (typeof playSound === "function") playSound("tabClick", 0);
}

function closeMangaReader() {
  if (currentMangaReader) {
    currentMangaReader.remove();
    currentMangaReader = null;
  }
  
  const roadmapToggleBtn = document.getElementById("roadmapToggleBtn");
  if (roadmapToggleBtn) roadmapToggleBtn.style.display = "";
  
  const mangaBtn = document.querySelector('.nav-btn[data-page="manga"]');
  if (mangaBtn) showMangaCards(mangaBtn);
  
  if (typeof playSound === "function") playSound("close", 0);
}

function openMangaPageViewer(pages, startIndex, title) {
  currentMangaPages = pages;
  currentMangaPageIndex = startIndex;
  currentMangaTitle = title;
  
  const viewer = document.createElement("div");
  viewer.id = "mangaPageViewer";
  viewer.className = "manga-page-viewer";
  
  const img = document.createElement("img");
  img.id = "mangaViewerImage";
  img.src = pages[startIndex];
  img.alt = `Page ${startIndex + 1}`;
  img.decoding = "async";
  img.fetchPriority = "high";
  img.style.cssText = "max-width:100%;max-height:85vh;object-fit:contain;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8)";
  
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
  `;
  
  document.body.appendChild(viewer);
  document.getElementById("mangaViewerImageContainer").appendChild(img);
  preloadAdjacentPages(startIndex);
  
  if (typeof playSound === "function") playSound("open", 0);
  
  const debouncedNavigate = (direction) => {
    if (mangaNavDebounceTimer) return;
    navigateMangaPage(direction);
    mangaNavDebounceTimer = setTimeout(() => { mangaNavDebounceTimer = null; }, 150);
  };
  
  viewer.addEventListener("click", (e) => {
    const target = e.target;
    if (target.id === "mangaViewerClose" || target.closest("#mangaViewerClose")) closeMangaPageViewer();
    else if (target.id === "mangaNavPrev" || target.closest("#mangaNavPrev")) debouncedNavigate(-1);
    else if (target.id === "mangaNavNext" || target.closest("#mangaNavNext")) debouncedNavigate(1);
  });
  
  currentMangaKeyHandler = (e) => {
    if (e.key === "Escape") closeMangaPageViewer();
    else if (e.key === "ArrowLeft") { e.preventDefault(); debouncedNavigate(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); debouncedNavigate(1); }
  };
  document.addEventListener("keydown", currentMangaKeyHandler);
}

function closeMangaPageViewer() {
  const viewer = document.getElementById("mangaPageViewer");
  if (viewer) {
    const img = document.getElementById("mangaViewerImage");
    if (img) img.src = "";
    viewer.remove();
  }
  
  if (currentMangaKeyHandler) {
    document.removeEventListener("keydown", currentMangaKeyHandler);
    currentMangaKeyHandler = null;
  }
  
  if (mangaNavDebounceTimer) {
    clearTimeout(mangaNavDebounceTimer);
    mangaNavDebounceTimer = null;
  }
  
  currentMangaPages = [];
  currentMangaPageIndex = 0;
  currentMangaTitle = "";
  currentMangaSections = null;
  currentMangaSectionIndex = 0;
  
  if (typeof playSound === "function") playSound("close", 0);
}

function navigateMangaPage(direction) {
  const newIndex = currentMangaPageIndex + direction;
  if (newIndex >= 0 && newIndex < currentMangaPages.length) {
    currentMangaPageIndex = newIndex;
    const img = document.getElementById("mangaViewerImage");
    const counter = document.getElementById("mangaPageCounter");
    
    if (img && counter) {
      requestAnimationFrame(() => {
        img.style.opacity = "0.7";
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
          requestAnimationFrame(() => {
            img.src = currentMangaPages[newIndex];
            counter.textContent = `Page ${newIndex + 1} of ${currentMangaPages.length}`;
            img.style.opacity = "1";
          });
        };
        
        preloadImg.src = currentMangaPages[newIndex];
        setTimeout(() => preloadAdjacentPages(newIndex), 100);
      });
    }
  }
}

function preloadAdjacentPages(currentIndex) {
  [currentIndex - 1, currentIndex + 1].forEach(index => {
    if (index >= 0 && index < currentMangaPages.length) {
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = "low";
      img.src = currentMangaPages[index];
    }
  });
}
