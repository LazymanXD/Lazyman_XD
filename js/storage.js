/**
 * Storage Module
 * Handles localStorage operations for saving/loading data
 */

/**
 * Load saved data from localStorage
 */
function loadSavedData() {
  // Clear any old wiki content that might be cached
  localStorage.removeItem('wikiContent');

  // Load artwork data from localStorage
  const savedArtwork = localStorage.getItem('artworkData');
  if (savedArtwork) {
    try {
      const parsed = JSON.parse(savedArtwork);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (typeof artworkData !== 'undefined') {
          artworkData = parsed;
        }
      }
    } catch (e) {
      console.error('Error loading artwork data:', e);
    }
  }

  const savedData = localStorage.getItem('websiteData');
  if (savedData) {
    const data = JSON.parse(savedData);

    // Update pages with saved data
    if (typeof pages !== 'undefined') {
      if (data.home) {
        pages.home.title = data.home.title || pages.home.title;
        pages.home.subtitle = data.home.subtitle || pages.home.subtitle;
      }
      if (data.about) {
        pages.about.content = data.about.content || pages.about.content;
      }
    }
  }
}

/**
 * Save data to localStorage
 */
function saveData() {
  if (typeof pages === 'undefined') return;
  
  const data = {
    home: pages.home,
    about: pages.about
  };
  localStorage.setItem('websiteData', JSON.stringify(data));
}

/**
 * Load diary data from localStorage
 */
function loadDiaryData() {
  if (typeof diaryData === 'undefined') return;
  
  const saved = localStorage.getItem('diaryData');
  if (saved) {
    diaryData = JSON.parse(saved);
  }
}

/**
 * Save diary data to localStorage
 */
function saveDiaryData() {
  if (typeof diaryData === 'undefined') return;
  
  localStorage.setItem('diaryData', JSON.stringify(diaryData));
}

// Initialize saved data on load
window.addEventListener('DOMContentLoaded', () => {
  loadSavedData();
  loadDiaryData();
});
