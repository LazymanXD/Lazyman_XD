/**
 * Navigation Module
 * Handles page navigation, window controls, and drag functionality
 */

let lastOpenedPage = 'home';
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

/**
 * Page content definitions
 */
const pages = {
  home: {
    title: "Lazyman_XD",
    subtitle: "Digital Artist & Storyteller",
    buttons: [
      { page: "books", icon: "📚", label: "Books", class: "books-btn" },
      { page: "work", icon: "🎨", label: "Work", class: "work-btn" },
      { page: "manga", icon: "📖", label: "Manga", class: "manga-btn" },
      { page: "faq", icon: "❓", label: "Q&A", class: "faq-btn" },
      { page: "wiki", icon: "🌐", label: "Wiki", class: "wiki-btn" }
    ]
  },
  about: {
    title: "About",
    content: "<h2>About</h2><p>Welcome to my portfolio!</p>"
  },
  wiki: {
    title: "Wiki",
    content: `<div id="wikiLoadingScreen" class="wiki-loading-screen">
      <div class="wiki-loading-spinner"></div>
      <p>Loading wiki...</p>
    </div>
    <div id="wikiContent" class="wiki-content"></div>`
  },
  manga: {
    title: "Manga",
    content: "<h2>Manga</h2><p>Coming soon...</p>"
  },
  faq: {
    title: "Q&A",
    content: ``
  },
  work: {
    title: "Work",
    content: "<h2>My Work</h2><p>Artwork gallery coming soon...</p>"
  },
  contact: {
    title: "Contact",
    content: "<h2>Contact</h2><p>Contact me at: your@email.com</p>"
  }
};

/**
 * Show a specific page
 * @param {string} pageKey - Key of the page to show
 */
function showPage(pageKey) {
  const roadmapBtn = document.getElementById('roadmapToggleBtn');
  if (roadmapBtn) roadmapBtn.style.display = pageKey === 'home' ? '' : 'none';

  // For Q&A page, open AI companion instead
  if (pageKey === "faq") {
    if (typeof openAICompanion === 'function') {
      openAICompanion();
    }
    return;
  }

  // Books button opens the infinite book overlay
  if (pageKey === "books") {
    if (typeof openInfiniteBook === 'function') {
      openInfiniteBook();
    }
    return;
  }

  // Manga button acts as a floating-card toggle
  if (pageKey === "manga") {
    const mangaBtn = document.querySelector('.nav-btn[data-page="manga"]');
    if (typeof showMangaCards === 'function' && typeof hideMangaCards === 'function') {
      if (mangaCardsShowing) {
        hideMangaCards(mangaBtn || undefined);
      } else if (mangaBtn) {
        showMangaCards(mangaBtn);
      }
    }
    return;
  }

  const page = pages[pageKey];
  if (!page) return;

  // Close floating cards when opening a middle-tab page
  if (pageKey !== "home") {
    if (typeof hideWorkCards === 'function') hideWorkCards();
    if (typeof hideMangaCards === 'function') hideMangaCards();
    if (typeof closeInfiniteBook === 'function') closeInfiniteBook();
  }

  const tabContent = document.querySelector('.middle-tab-content');
  tabContent.classList.remove('wiki-active');

  // Save last opened page to localStorage
  lastOpenedPage = pageKey;
  localStorage.setItem('lastOpenedPage', pageKey);

  if (pageKey === "home") {
    // Force home page to NEVER be fullscreen
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

    if (pageKey === "wiki") {
      // Wiki page - fade in with blur backdrop
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

      requestAnimationFrame(() => {
        middleTab.style.transition = 'all 0.4s ease-out';
        middleTab.style.transform = 'scale(1)';
        middleTab.style.opacity = '1';
      });
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

/**
 * Attach event listeners to navigation buttons
 */
function attachNavListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.onclick = function() {
      const pageKey = this.dataset.page;
      if (typeof playSound === 'function') playSound('tabClick', 0);

      // Hide all floating cards
      if (typeof hideWorkCards === 'function') hideWorkCards();
      if (typeof hideMangaCards === 'function') hideMangaCards();
      if (typeof closeInfiniteBook === 'function') closeInfiniteBook();

      // Clear any pending timeouts
      if (workCardsShowTimeoutId !== null) { clearTimeout(workCardsShowTimeoutId); workCardsShowTimeoutId = null; }
      if (mangaCardsShowTimeoutId !== null) { clearTimeout(mangaCardsShowTimeoutId); mangaCardsShowTimeoutId = null; }

      // Handle special button behaviors
      if (pageKey === "work") {
        if (typeof showWorkCards === 'function' && !workCardsShowing) {
          workCardsShowTimeoutId = setTimeout(() => { workCardsShowTimeoutId = null; showWorkCards(this); }, 500);
        }
        return;
      }

      if (pageKey === "manga") {
        const mangaIcon = this.querySelector('img');
        if (mangaIcon) {
          mangaIcon.classList.remove('manga-btn-spin');
          void mangaIcon.offsetWidth;
          mangaIcon.classList.add('manga-btn-spin');
        }
        if (typeof showMangaCards === 'function' && !mangaCardsShowing) {
          mangaCardsShowTimeoutId = setTimeout(() => { mangaCardsShowTimeoutId = null; showMangaCards(this); }, 350);
        }
        return;
      }

      if (pageKey === "books") {
        if (typeof openInfiniteBook === 'function') openInfiniteBook();
        return;
      }

      proceedWithPageOpen(pageKey);
    };
  });
}

/**
 * Proceed with opening a page (handles maximization logic)
 * @param {string} pageKey - Key of the page to open
 */
function proceedWithPageOpen(pageKey) {
  const middleTab = document.querySelector('.middle-tab');
  
  // Auto-maximize only wiki tab
  if (pageKey === "wiki") {
    setTimeout(() => {
      if (!middleTab.classList.contains('maximized')) {
        middleTab.classList.add('slow-maximize');
        setTimeout(() => {
          middleTab.classList.remove('slow-maximize');
          middleTab.classList.add('maximized');
          document.body.classList.add('window-maximized');
        }, 600);
      }
    }, 100);
  }

  // NEVER maximize these tabs
  if (pageKey === "manga" || pageKey === "home" || pageKey === "books" || pageKey === "faq") {
    middleTab.classList.remove('maximized');
    document.body.classList.remove('window-maximized');
  }

  showPage(pageKey);
}

/**
 * Start dragging the middle tab
 * @param {Event} event - Mouse event
 * @param {HTMLElement} element - Element being dragged
 */
function dragStart(event, element) {
  isDragging = true;
  const rect = element.getBoundingClientRect();
  dragOffset.x = event.clientX - rect.left;
  dragOffset.y = event.clientY - rect.top;
  element.style.cursor = 'grabbing';
}

/**
 * Handle drag movement
 * @param {Event} event - Mouse event
 * @param {HTMLElement} element - Element being dragged
 */
function dragMove(event, element) {
  if (!isDragging) return;
  element.style.left = (event.clientX - dragOffset.x) + 'px';
  element.style.top = (event.clientY - dragOffset.y) + 'px';
}

/**
 * Stop dragging
 * @param {HTMLElement} element - Element being dragged
 */
function dragEnd(element) {
  isDragging = false;
  element.style.cursor = 'grab';
}

/**
 * Open middle tab
 */
function openMiddleTab() {
  const middleTab = document.querySelector('.middle-tab');
  middleTab.style.display = 'flex';
}

/**
 * Close middle tab
 * @param {Event} event - Event object
 */
function closeMiddleTab(event) {
  event.stopPropagation();
  const middleTab = document.querySelector('.middle-tab');
  middleTab.style.display = 'none';
  if (typeof playSound === 'function') playSound('close', 0);
}

/**
 * Maximize middle tab
 * @param {Event} event - Event object
 */
function maximizeMiddleTab(event) {
  event.stopPropagation();
  const middleTab = document.querySelector('.middle-tab');
  middleTab.classList.add('maximized');
  document.body.classList.add('window-maximized');
  if (typeof playSound === 'function') playSound('maximize', 0);
}

/**
 * Minimize middle tab
 * @param {Event} event - Event object
 */
function minimizeMiddleTab(event) {
  event.stopPropagation();
  const middleTab = document.querySelector('.middle-tab');
  middleTab.classList.remove('maximized');
  document.body.classList.remove('window-maximized');
  if (typeof playSound === 'function') playSound('minimize', 0);
}

// Initialize drag functionality
const middleTab = document.querySelector('.middle-tab');
if (middleTab) {
  const tabHeader = middleTab.querySelector('.middle-tab-header');
  if (tabHeader) {
    tabHeader.addEventListener('mousedown', (e) => dragStart(e, middleTab));
    document.addEventListener('mousemove', (e) => dragMove(e, middleTab));
    document.addEventListener('mouseup', () => dragEnd(middleTab));
  }
}
