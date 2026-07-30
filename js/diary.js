/**
 * Diary Module
 * Handles diary functionality with 3D book animation
 */

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

/**
 * Show diary with 3D animation
 */
function showDiary() {
  createDiaryOverlay();
}

/**
 * Create diary overlay with 3D book animation
 */
function createDiaryOverlay() {
  if (diaryOverlay) {
    diaryOverlay.remove();
  }
  
  diaryOverlay = document.createElement('div');
  diaryOverlay.className = 'diary-overlay';
  diaryOverlay.innerHTML = `
    <div class="diary-book-3d" id="diaryBook3d">
      <div class="diary-back-cover"></div>
      <div class="diary-pages-container">
        <div class="diary-page-layer"></div>
        <div class="diary-page-layer"></div>
        <div class="diary-page-layer"></div>
        <div class="diary-page-layer"></div>
        <div class="diary-page-layer"></div>
      </div>
      <div class="diary-spine-3d">
        <div class="diary-spine-text-3d">Lazyman_XD</div>
      </div>
      <div class="diary-front-cover">
        <div class="diary-cover-title">LAZYMAN_XD<br>DIARY</div>
      </div>
      <div class="diary-content-page" id="diaryContentPage">
        <div class="diary-content-3d" id="diaryContent"></div>
      </div>
      <button class="diary-close-btn-3d" onclick="closeDiary()">✕</button>
      <div class="diary-page-indicator-3d" id="pageIndicator">1 / ${diaryData.pages.length}</div>
      <div class="diary-navigation-3d" id="diaryNav">
        <button class="diary-nav-btn-3d" onclick="prevDiaryPage()" id="prevBtn">Previous</button>
        <button class="diary-nav-btn-3d" onclick="nextDiaryPage()" id="nextBtn">Next</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(diaryOverlay);
  
  setTimeout(() => {
    const book = document.getElementById('diaryBook3d');
    
    book.classList.add('animating');
    
    setTimeout(() => {
      book.classList.remove('animating');
      book.classList.add('phase-rotate');
      
      setTimeout(() => {
        book.classList.remove('phase-rotate');
        book.classList.add('phase-open');
        
        setTimeout(() => {
          book.classList.remove('phase-open');
          book.classList.add('phase-reading');
          
          loadDiaryPage(diaryData.currentPage);
        }, 800);
      }, 800);
    }, 600);
  }, 100);
  
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeDiary();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

/**
 * Load diary page content
 * @param {number} pageIndex - Page index
 */
function loadDiaryPage(pageIndex) {
  const contentDiv = document.getElementById('diaryContent');
  const pageIndicator = document.getElementById('pageIndicator');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (pageIndex >= 0 && pageIndex < diaryData.pages.length) {
    const page = diaryData.pages[pageIndex];
    contentDiv.innerHTML = `<h1 class="diary-title">${page.title}</h1>${page.content}`;
    pageIndicator.textContent = `${pageIndex + 1} / ${diaryData.pages.length}`;

    prevBtn.disabled = pageIndex === 0;
    nextBtn.disabled = pageIndex === diaryData.pages.length - 1;

    diaryData.currentPage = pageIndex;

    contentDiv.scrollTop = 0;
  }
}

/**
 * Navigate to previous page
 */
function prevDiaryPage() {
  if (diaryData.currentPage > 0) {
    loadDiaryPage(diaryData.currentPage - 1);
  }
}

/**
 * Navigate to next page
 */
function nextDiaryPage() {
  if (diaryData.currentPage < diaryData.pages.length - 1) {
    loadDiaryPage(diaryData.currentPage + 1);
  }
}

/**
 * Close diary with animation
 */
function closeDiary() {
  if (diaryOverlay) {
    const book = document.getElementById('diaryBook3d');
    
    if (book) {
      book.classList.remove('phase-reading');
      book.classList.add('closing');
      
      setTimeout(() => {
        if (diaryOverlay && diaryOverlay.parentNode) {
          diaryOverlay.remove();
        }
        diaryOverlay = null;
        isDiaryEditing = false;
      }, 1500);
    } else {
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
  if (typeof playSound === 'function') playSound('tabClick', 0);
}
