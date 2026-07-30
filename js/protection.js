/**
 * Content Protection Module
 * Disables right-click, drag, text selection, and keyboard shortcuts
 */

// Disable right-click on entire page
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
}, false);

// Disable dragging anything
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
  return false;
}, false);

// Disable text selection
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
  return false;
}, false);

// Block keyboard shortcuts for screenshots and DevTools
document.addEventListener('keydown', function(e) {
  // Print Screen
  if (e.key === 'PrintScreen' || e.keyCode === 44) {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+I (DevTools)
  if (e.shiftKey && e.key === 'I' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+J (Console)
  if (e.shiftKey && e.key === 'J' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+C (Inspect Element)
  if (e.shiftKey && e.key === 'C' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+U (View Source)
  if (e.key === 'U' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+S (Save Page)
  if (e.key === 'S' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
  // Ctrl+P (Print)
  if (e.key === 'P' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    return false;
  }
}, false);

// Clear clipboard when window loses focus (anti-screenshot)
document.addEventListener('blur', function() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText('').catch(function(){});
  }
});

// CSS protection
(function() {
  const s = document.createElement('style');
  s.innerHTML = '*{-webkit-user-drag:none;-moz-user-drag:none;-o-user-drag:none;user-drag:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-touch-callout:none;font-family:"Press Start 2P",cursive !important;-webkit-font-smoothing:none;-moz-osx-font-smoothing:grayscale;}img{pointer-events:none;}';
  document.head.appendChild(s);
})();
