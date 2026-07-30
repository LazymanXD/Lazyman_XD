/**
 * Wiki Module
 * Handles wiki editing functionality
 */

/**
 * Enable wiki editing mode
 */
function enableWikiEditing() {
  setTimeout(() => {
    const wikiMainContent = document.querySelector('.wiki-main-content');

    if (wikiMainContent) {
      wikiMainContent.contentEditable = true;
      wikiMainContent.style.border = '2px dashed #ffd700';
      wikiMainContent.style.padding = '10px';
      
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
      
      setupImageDragAndDrop();
    }
  }, 2500);
}

/**
 * Format text with command
 * @param {string} command - Format command
 */
function formatText(command) {
  document.execCommand(command, false, null);
}

/**
 * Change font size
 */
function changeFontSize() {
  const size = prompt('Enter font size (1-7):', '3');
  if (size) {
    document.execCommand('fontSize', false, size);
  }
}

/**
 * Change font
 */
function changeFont() {
  const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS'];
  const fontList = fonts.map((font, index) => `${index + 1}. ${font}`).join('\n');
  const choice = prompt(`Choose font:\n${fontList}\nEnter number (1-${fonts.length}):`, '1');
  
  if (choice && choice >= 1 && choice <= fonts.length) {
    document.execCommand('fontName', false, fonts[choice - 1]);
  }
}

/**
 * Add link
 */
function addLink() {
  const url = prompt('Enter URL:', 'https://');
  const text = prompt('Enter link text:', 'Click here');
  
  if (url && text) {
    const link = `<a href="${url}" target="_blank" style="color: #ffd700; text-decoration: underline;">${text}</a>`;
    document.execCommand('insertHTML', false, link);
  }
}

/**
 * Add new wiki page
 */
function addNewPage() {
  const pageTitle = prompt('Enter new page title:', 'New Page');
  if (!pageTitle) return;
  
  let wikiPages = JSON.parse(localStorage.getItem('wikiPages') || '[]');
  
  const newPage = {
    id: Date.now(),
    title: pageTitle,
    content: `<h2>${pageTitle}</h2><p>This is a new wiki page. Start editing!</p>`,
    created: new Date().toISOString()
  };
  
  wikiPages.push(newPage);
  localStorage.setItem('wikiPages', JSON.stringify(wikiPages));
  
  const pageLink = `<a href="#" onclick="openWikiPage(${newPage.id})" style="color: #ffd700; text-decoration: underline;">${pageTitle}</a>`;
  document.execCommand('insertHTML', false, `<p>📄 ${pageLink}</p>`);
  
  alert(`Page "${pageTitle}" created! Click the link to open it.`);
}

/**
 * Open wiki page
 * @param {number} pageId - Page ID
 */
function openWikiPage(pageId) {
  const wikiPages = JSON.parse(localStorage.getItem('wikiPages') || '[]');
  const page = wikiPages.find(p => p.id === pageId);
  
  if (page) {
    const wikiMainContent = document.querySelector('.wiki-main-content');
    if (wikiMainContent) {
      wikiMainContent.innerHTML = page.content;
      
      const titleIndicator = document.createElement('div');
      titleIndicator.style.cssText = 'background: #ffd700; color: #222; padding: 10px; margin-bottom: 20px; border-radius: 5px; font-weight: bold;';
      titleIndicator.textContent = `📄 ${page.title}`;
      wikiMainContent.insertBefore(titleIndicator, wikiMainContent.firstChild);
    }
    
    enableWikiEditing();
  }
}

/**
 * Toggle full edit mode
 */
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

/**
 * Add image
 */
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

/**
 * Setup image drag and drop
 */
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

/**
 * Save wiki changes
 */
function saveWikiChanges() {
  const wikiContainer = document.querySelector('.wiki-container');
  if (wikiContainer) {
    const newContent = wikiContainer.innerHTML;
    
    localStorage.setItem('customWikiContent', newContent);
    
    if (typeof pages !== 'undefined') {
      pages.wiki.content = newContent;
      saveData();
    }
    
    alert('Wiki changes saved permanently! They will appear when you reload the page.');
  }
}

/**
 * Disable wiki editing
 */
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
  
  if (typeof showPage === 'function') {
    showPage('wiki');
  }
}

/**
 * Update wiki with manga data
 */
function updateWikiWithMangaData() {
  localStorage.removeItem('customWikiContent');
  localStorage.removeItem('wikiContent');
  
  const wikiContentHtml = `
    <div class="fandom-top-nav" style="background: #fff; border-bottom: 1px solid #ccc; padding: 12px 20px; display: flex; align-items: center; gap: 15px; margin-top: -10px;">
      <img src="./wiki-logo.webp" alt="Logo" style="width: 32px; height: 32px;">
      <span style="font-weight: bold; color: #333;">Manga Wiki</span>
      <input type="text" placeholder="Search..." style="flex: 1; max-width: 300px; padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px; margin-left: 20px;">
      <a href="#" onclick="showPage('home')" style="color: #3366cc; text-decoration: none;">Home</a>
      <a href="#" onclick="showPage('manga')" style="color: #3366cc; text-decoration: none;">Explore</a>
    </div>
    <div class="fandom-main-layout" style="display: flex; min-height: calc(100vh - 60px);">
      <div class="fandom-left-sidebar" style="width: 200px; background: #f5f5f5; border-right: 1px solid #ccc; padding: 20px;">
        <h4 style="margin: 0 0 15px 0; color: #333; font-size: 14px;">Navigation</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 8px;"><a href="#" style="color: #3366cc; text-decoration: none; font-size: 13px;">Main Page</a></li>
          <li style="margin-bottom: 8px;"><a href="#" style="color: #3366cc; text-decoration: none; font-size: 13px;">Recent Changes</a></li>
          <li style="margin-bottom: 8px;"><a href="#" style="color: #3366cc; text-decoration: none; font-size: 13px;">All Manga</a></li>
          <li style="margin-bottom: 8px;"><a href="#" style="color: #3366cc; text-decoration: none; font-size: 13px;">Characters</a></li>
        </ul>
      </div>
      <div class="fandom-article-content" style="flex: 1; padding: 30px; background: #fff; max-width: 800px;">
        <h1 style="margin: 0 0 10px 0; color: #222; font-size: 28px;">Manga Universe Wiki</h1>
        <p style="color: #666; margin-bottom: 30px;">Welcome to the Manga Universe Wiki - your complete guide to all manga series!</p>
        <div style="background: #f8f9fa; border: 1px solid #eaecf0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📊 Wiki Stats</h3>
          <p style="color: #666; margin: 0;">Content coming soon...</p>
        </div>
        <h2 style="color: #222; font-size: 20px; margin-bottom: 15px;">📚 Manga</h2>
        <p style="color: #666;">Manga system coming soon...</p>
      </div>
      <div class="fandom-right-sidebar" style="width: 250px; background: #f5f5f5; border-left: 1px solid #ccc; padding: 20px;">
        <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">Quick Links</h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 6px;"><a href="#" style="color: #3366cc; font-size: 12px; text-decoration: none;">Latest Updates</a></li>
            <li style="margin-bottom: 6px;"><a href="#" style="color: #3366cc; font-size: 12px; text-decoration: none;">Popular Manga</a></li>
            <li style="margin-bottom: 6px;"><a href="#" style="color: #3366cc; font-size: 12px; text-decoration: none;">New Releases</a></li>
          </ul>
        </div>
        <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px;">
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
  
  const wikiContentElement = document.querySelector('.middle-tab-content #wikiContent');
  if (wikiContentElement) {
    wikiContentElement.innerHTML = wikiContentHtml;
    wikiContentElement.closest('.middle-tab-content').classList.add('wiki-active');
    
    setTimeout(() => {
      const loadingScreen = document.querySelector('.middle-tab-content #wikiLoadingScreen');
      if (loadingScreen) loadingScreen.classList.add('fade-out');
      
      setTimeout(() => {
        wikiContentElement.classList.add('show');
      }, 250);
    }, 500);
  }
}
