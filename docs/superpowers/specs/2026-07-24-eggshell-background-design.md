# Replace wood-grain background with smokey eggshell on Products & Wines

## Context

The `#products` and `#wines` sections currently share a background image —
an end-grain cutting board photo hotlinked from `hollandandoak.com`
(`css/style.css:100`), blended with a tan `#d4b88a` multiply tint. A
carved-gold heading treatment (gold text, dark drop-shadow, radial vignette)
was added specifically so headings stay legible over that busy, dark
wood-grain image.

Goal: drop the wood image entirely (removes an external hotlink dependency
along with the visual clutter) and replace it with a solid, smokey-eggshell
background — lighter, cleaner, still tied to the site's smoke motif. This
requires re-tuning the heading style and one section subtitle, since both
were built for a dark, busy background that will no longer exist.

## Background treatment

- Add a new CSS variable, `--eggshell-deep: #ece3d4` (a warm cream deeper
  than the card's existing `--eggshell: #f5f0e8`), so cards visually
  separate from the section behind them using color alone, on top of the
  existing card box-shadow.
- Replace the `#products, #wines` rule (`css/style.css:99-102`) — drop the
  image and `background-blend-mode`, set `background: var(--eggshell-deep)`.
- Add a `#products::before, #wines::before` rule reusing the existing
  `smokeDrift` `@keyframes` animation, but recolored: a soft warm-smoke
  radial gradient (e.g. `rgba(60, 47, 40, 0.06)` at center fading to
  transparent) instead of the current white glow that was tuned for dark
  backgrounds. This keeps the subtle drifting-smoke motion as a brand touch
  without it disappearing against a light background.

## Heading treatment

- Split the existing combined selector `#products h2, #wines h2, #location
  h2` (`css/style.css:104-123`) so `#location h2` keeps its current gold +
  dark-vignette styling untouched (it stays on a dark `smoke-bg`).
- `#products h2, #wines h2` get a new rule: dark warm text color (`--accent:
  #8c4a2f`), no text-shadow, no vignette pseudo-element — plain, legible
  serif heading against the light background.

## HTML cleanup

- Remove the `smoke-bg` class from `<section id="wines">` (`index.html:90`).
  It's already fully overridden by the `#wines` ID rule for both background
  and (after this change) the `::before` pseudo, so leaving the class on is
  just confusing/dead weight.
- Fix `<p class="text-center text-white-50 mb-4">Perfectly paired with our
  smoked delicacies</p>` (`index.html:95`) — currently white-on-dark text
  that would become equally invisible white-on-cream. Change to a muted dark
  tone consistent with the new heading color (e.g. `text-muted` or a custom
  class using `--accent`).

## Explicitly unchanged

- Hero section and `#location` keep their existing dark `smoke-bg`
  treatment and gold/vignette headings — this change is scoped to
  `#products` and `#wines` only.
- `.origin-pill` / `.pairing-pill` filter pills need no change — they carry
  their own dark semi-transparent background regardless of the page
  background behind them.

## Testing

Manual verification only, consistent with existing project conventions:
- Open `index.html` in a browser, confirm the wood-grain image is gone from
  both Products and Wines sections, replaced by the eggshell tone.
- Confirm product/wine cards are visually distinguishable from the section
  background (color difference + shadow).
- Confirm the subtle smoke-drift animation is visible but understated on the
  new light background.
- Confirm `#products h2` / `#wines h2` headings are legible in dark
  `--accent` text with no leftover vignette artifacts.
- Confirm `#location` section is visually unchanged (still dark background,
  gold heading).
- Confirm the wines subtitle ("Perfectly paired with our smoked delicacies")
  is legible against the new light background.
- Confirm filter pills (origin pills on Products, type pills on Wines) still
  read clearly.
