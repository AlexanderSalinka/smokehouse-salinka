# Restructure GROK_GOOD_STATE.html into a clean multi-file project

## Context

`~/Coding/Vibe Coded/GROK_GOOD_STATE.html` is a single-file (576-line) prototype
for Smokehouse Salinka, a real smoked-meats e-commerce site (Alexander's own
business, based in Trenčín, Slovakia). It was vibecoded with Grok and has a
working product/wine catalog, search/filter, and a localStorage-backed cart —
but all markup, CSS, and JS live in one HTML file.

Goal of this step: reorganize the existing code into a clean multi-file
project, with small correctness fixes along the way. No new features,
no image fixes, no real backend/checkout — those are explicitly deferred to
later work.

## Architecture

New project lives at `~/Coding/Vibe Coded/smokehouse-salinka/`:

```
smokehouse-salinka/
  index.html      → markup only
  css/style.css    → all styles (moved out of the <style> tag)
  js/data.js        → products[] and wines[] arrays
  js/app.js         → cart logic, rendering, filtering, event handlers
```

CDN dependencies (Bootstrap 5.3.3, Font Awesome 6.6.0, Google Fonts) stay as
`<link>`/`<script>` tags in `index.html`, unchanged. No build tools, no npm —
this machine doesn't have Node installed, and none is needed for a static
site like this.

## Components

- **`index.html`** — page structure (navbar, hero, story, products/wines
  sections, location, modal, cart offcanvas, footer). Links to
  `css/style.css`, and loads `js/data.js` before `js/app.js` before the
  closing `</body>`.
- **`css/style.css`** — everything currently in the `<style>` block:
  CSS custom properties, smoke-drift animation, product card styling,
  fly-to-cart animation, etc. No changes to selectors or values.
- **`js/data.js`** — the `products` and `wines` arrays, verbatim from the
  original file. Kept separate so editing the catalog later doesn't require
  touching logic code.
- **`js/app.js`** — everything else from the original `<script>` block:
  `saveCart`, `updateCartCount`, `filterProducts`, `renderProducts`,
  `renderWines`, `showProduct`, `addToCart`, `createFlyAnimation`,
  `renderCart`, `removeFromCart`, `changeQuantity`, `setQuantity`,
  `clearCart`, `toggleCart`, `closeCartAndScroll`, `showToast`, `checkout`,
  `init`, and the `window.onload = init` wire-up.

## Fixes included in this pass

- Add an `onerror` fallback handler on product/wine `<img>` tags so a dead
  hotlinked image degrades to a clean placeholder image instead of a broken
  image icon.
- Minor consistency cleanup (quote style, spacing) while the code is already
  being touched.

Explicitly **out of scope** for this pass: replacing hotlinked/placeholder
images with real photos, building a real checkout flow, adding a backend or
database. These are known follow-ups, tracked separately.

## Data flow

Unchanged from the current single-file version: `data.js` arrays are read by
render functions in `app.js`, which build DOM via template strings; cart
state is held in a `cart` array and persisted to `localStorage` on every
mutation. This step only relocates code — it does not change how the site
behaves.

## Testing

Manual verification only (no test framework, consistent with the existing
prototype):
- Open the new `index.html` directly in a browser
- Confirm search and origin-filter work on the product grid
- Confirm add-to-cart, quantity +/-, and remove-from-cart all update the
  cart badge and localStorage correctly
- Confirm the fly-to-cart animation and toast notifications still fire
- Confirm checkout (still the placeholder `alert()`) still clears the cart
- Compare visually against the original `GROK_GOOD_STATE.html` to confirm no
  visual regressions

## Infra note

This new `smokehouse-salinka/` folder will be initialized as its own git
repository (separate from the older experimental files still sitting in
`Vibe Coded/`), so this work has version history and a safety net going
forward. Alexander does not need to learn git to benefit from this — commits
will be handled as part of the workflow.
