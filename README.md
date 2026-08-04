# Lazyman_XD

## Changelog

### June 26, 2026
- **Book System Improvements**
  - Fixed book centering issues by restructuring HTML with `.book-wrapper` and flexbox centering
  - Replaced book cover image with `assets/noumenon.webp`
  - Replaced book card image with `assets/noumenon.webp` for consistency
  - Reduced page text font-size from 0.82rem to 0.7rem for better readability
  - Increased book size (width: 420px→520px, max-height: 86vh→90vh)
  - Optimized book animation performance:
    - Added page content caching to avoid regenerating HTML
    - Implemented event delegation for page clicks
    - Reduced rendered pages from 9 to 5 for better performance
    - Simplified depth offset calculations
    - Wrapped renderBook in requestAnimationFrame for smoother updates
    - Reduced animation duration from 0.7s to 0.5s
  - Fixed `removeChild` error by checking parentNode before removal
  - Adjusted front cover flip position (translateX: -18px→-5px) for better centering

- **Work Section Improvements**
  - Added previous/next navigation buttons to illustrations viewer
  - Implemented keyboard arrow key navigation for illustrations
  - Added hover effects on navigation buttons
  - Enabled cycling through images at boundaries

