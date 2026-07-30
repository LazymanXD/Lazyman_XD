# Book performance fix — what changed and how to deploy it

## Files in this folder
- `temp.js` — your full temp.js with the book-opening logic patched (search for "Book (Infinite Book)" if you want to see the diff yourself)
- `js/infinite.js` — replacement for your existing `js/infinite.js`
- `css/infinite.css` — replacement for your existing `css/infinite.css`
- `temp.js.book-patch.txt` — plain-English before/after of just the temp.js change, in case you'd rather hand-patch it into a newer version of temp.js yourself instead of overwriting the whole file

## How to deploy
1. Replace your repo's `temp.js` with the one here (or apply the patch in `temp.js.book-patch.txt` manually if you've changed temp.js since this upload).
2. Replace `js/infinite.js` with the one here.
3. Replace `css/infinite.css` with the one here.
4. Push to GitHub Pages as usual. No HTML changes are needed — `infinite.html` and `index.html` reference these files by the same paths already.

## What actually changed (and why)

**1. The book's iframe is now warmed up in the background instead of rebuilt every time.**
Previously, every tap on the book button created a brand-new `<iframe src="infinite.html">` and destroyed it on close. That means: new browsing context, re-parse HTML/CSS/JS, re-fetch/decode the cover image, rebuild 9 page layers — every single time. Now the iframe is built once, quietly, a couple seconds after the main page finishes loading (via `requestIdleCallback`), and just fades in/out afterward. This is the fix for "the cover takes too long to load."

**2. The book now renders at a smaller intrinsic size on mobile instead of scaling down a giant canvas.**
The old code always laid the book out at 1240×1754px and shrank it visually with `transform: scale()` — the phone's GPU still had to paint at the full 1240×1754 resolution first. Mobile now renders at 680×962 (same aspect ratio, so nothing looks different), which is a big cut in the number of pixels being composited every time a page flips.

**3. `will-change: transform` is no longer applied to every page all the time.**
It's now only applied to whichever page is actually mid-flip. Previously every page in the book was permanently promoted to its own GPU layer, which adds up on a phone's limited layer memory.

**4. Box-shadow blur radius is reduced on mobile.**
Large blurred shadows are one of the more GPU-expensive things to repaint, and the book had several stacked layers of them. Mobile now uses roughly half the blur/spread — visually very close, noticeably cheaper to render.

## A note on "keeping the book open in the background"
Because the iframe now stays alive after you close the book (it just fades out), it also remembers what page you were on. I added a small `resetBookToStart()` hook so it resets to the cover every time you reopen it, matching the old behavior. If you'd actually rather it *remember* your page (like a real bookmark), just remove the `resetBookToStart()` call in `openInfiniteBook()` inside temp.js — that's a one-line deletion.
