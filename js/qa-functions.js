/**
 * Q&A Functions Module
 * Handles Q&A page functionality including character display and pricing
 */

let qaCurrentCharacter = 1;
let qaCurrentStyle = 'sketch';

const qaCharacterImages = {
  1: { sketch: './character1_sketch.webp', flat: './character1_flat.webp', rendered: './character1_rendered.webp' },
  2: { sketch: './character2_sketch.webp', flat: './character2_flat.webp', rendered: './character2_rendered.webp' },
  3: { sketch: './character3_sketch.webp', flat: './character3_flat.webp', rendered: './character3_rendered.webp' },
  4: { sketch: './character4_sketch.webp', flat: './character4_flat.webp', rendered: './character4_rendered.webp' },
  5: { sketch: './character5_sketch.webp', flat: './character5_flat.webp', rendered: './character5_rendered.webp' }
};

/**
 * Get QA character image based on character and style
 * @param {number} char - Character number
 * @param {string} style - Style (sketch, flat, rendered)
 * @returns {string} Image path
 */
function getQACharacterImage(char, style) {
  const img = qaCharacterImages[char] && qaCharacterImages[char][style] ? qaCharacterImages[char][style] : './girl 1.webp';
  return img;
}

/**
 * Show QA section
 * @param {string} section - Section name
 */
function showQASection(section) {
  document.querySelectorAll('.qa-nav-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.qa-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('qa-' + section).classList.add('active');
  if (typeof playSound === 'function') {
    playSound('qaClick1', 0);
  }
}

/**
 * Switch character
 * @param {number} charNum - Character number
 */
function switchCharacter(charNum) {
  qaCurrentCharacter = charNum;
  document.querySelectorAll('.char-btn').forEach((btn, index) => {
    btn.classList.toggle('active', index + 1 === charNum);
  });
  const img = document.getElementById('character-image');
  if (img) img.src = getQACharacterImage(charNum, qaCurrentStyle);
  if (typeof playSound === 'function') {
    playSound('qaClick2', 0);
  }
}

/**
 * Switch character style
 * @param {string} style - Style name (sketch, flat, rendered)
 */
function switchCharacterStyle(style) {
  qaCurrentStyle = style;
  document.querySelectorAll('.style-circle').forEach((circle, index) => {
    const styles = ['sketch', 'flat', 'rendered'];
    circle.classList.toggle('active', styles[index] === style);
  });
  const img = document.getElementById('character-image');
  if (img) img.src = getQACharacterImage(qaCurrentCharacter, style);
  if (typeof playSound === 'function') {
    playSound('qaClick3', 0);
  }
}

/**
 * Close Q&A tab
 */
function closeQATab() {
  if (typeof playSound === 'function') {
    playSound('close', 0);
  }
  if (typeof showPage === 'function') {
    showPage('home');
  }
}

/**
 * Toggle pricing panel
 */
function togglePricingPanel() {
  const panel = document.querySelector('.pricing-panel');
  const btn = document.querySelector('.pricing-tab-btn');
  if (panel) {
    panel.classList.toggle('mobile-visible');
    if (btn) {
      btn.classList.toggle('active', panel.classList.contains('mobile-visible'));
    }
    if (typeof playSound === 'function') {
      playSound('qaClick4', 0);
    }
  }
}
