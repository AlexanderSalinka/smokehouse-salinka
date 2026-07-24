# Eggshell Background for Products & Wines Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the hotlinked wood-cutting-board background image from the `#products` and `#wines` sections and replace it with a solid smokey-eggshell background, re-tuning the headings and one subtitle that were built for the old dark/busy background.

**Architecture:** Pure CSS + one HTML class/text change in the existing single-page site (`index.html` / `css/style.css`). No new files, no build step, no JS changes.

**Tech Stack:** Plain CSS custom properties + keyframe animation (already established patterns in `css/style.css`). No test framework in this project — verification is manual, by opening `index.html` in a browser.

## Global Constraints

- New CSS variable: `--eggshell-deep: #ece3d4` (deeper cream than existing `--eggshell: #f5f0e8`, used only for section backgrounds, never for cards).
- New heading color for `#products h2` / `#wines h2`: `var(--accent)` (`#8c4a2f`), no text-shadow, no vignette pseudo-element.
- New smoke overlay tint (replaces the white glow tuned for dark backgrounds): `rgba(60, 47, 40, 0.06)` radial gradient, reusing the existing `smokeDrift` `@keyframes` (do not duplicate or rename the keyframe).
- Scope is strictly `#products` and `#wines`. Do not modify `.hero`, `#location`, `.smoke-bg` (as a class definition), or `.origin-pill`/`.pairing-pill`.
- No test framework — verify each step by opening `index.html` directly in a browser (`open index.html` on macOS) and visually confirming the described result.

---

### Task 1: CSS — eggshell background + smoke overlay for Products/Wines

**Files:**
- Modify: `css/style.css:1-7` (root variables)
- Modify: `css/style.css:99-102` (`#products, #wines` rule)

**Interfaces:**
- Produces: `--eggshell-deep` CSS variable, consumed by Task 1 only.
- Produces: `#products::before, #wines::before` rule using the existing `smokeDrift` keyframe (defined at `css/style.css:36-39`, untouched).

- [ ] **Step 1: Add the `--eggshell-deep` variable**

In `css/style.css`, in the `:root` block (currently lines 1-7), add the new variable after `--eggshell`:

```css
:root {
    --primary: #1a110c;
    --accent: #8c4a2f;
    --gold: #d4af88;
    --smoke: rgba(30, 25, 22, 0.96);
    --eggshell: #f5f0e8;
    --eggshell-deep: #ece3d4;
}
```

- [ ] **Step 2: Replace the wood-image background rule**

Replace the current rule (`css/style.css:99-102`):

```css
#products, #wines {
    background: #d4b88a url('https://hollandandoak.com/wp-content/uploads/2025/03/QCCI-5_endGrain_med_cropped.jpg') center/cover no-repeat;
    background-blend-mode: multiply;
}
```

with:

```css
#products, #wines {
    background: var(--eggshell-deep);
    position: relative;
}
#products::before, #wines::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, rgba(60, 47, 40, 0.06) 0%, transparent 70%);
    animation: smokeDrift 28s linear infinite;
    pointer-events: none;
}
```

Note: `position: relative` is required here — `#products` had no positioning context before (it never carried the `.smoke-bg` class), and the `::before` pseudo-element needs a positioned ancestor for `inset: 0` to work correctly.

- [ ] **Step 3: Manual verification**

Run: `open "index.html"` (from the project root) to load the page in the default browser.

Expected:
- The Products section background is a flat warm cream tone (no wood grain, no tan tint).
- The Wines section has the same cream background (previously it showed the wood image too, overriding its `.smoke-bg` class).
- Looking closely (or via browser DevTools computed styles on `#products`/`#wines`), a very faint warm smoke-colored glow is visible and drifts slowly — subtle, not distracting.

- [ ] **Step 4: Commit**

```bash
cd "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka"
git add css/style.css
git commit -m "Replace wood-grain background with eggshell + subtle smoke drift on Products/Wines"
```

---

### Task 2: CSS — split heading treatment so Products/Wines get dark text

**Files:**
- Modify: `css/style.css:104-123` (combined `#products h2, #wines h2, #location h2` rule)

**Interfaces:**
- Consumes: nothing from Task 1 (independent rule block), but should be applied after Task 1 so visual verification shows the full combined effect.
- Produces: `#products h2, #wines h2` styled with dark `var(--accent)` text and no vignette; `#location h2` unchanged (still gold + dark vignette).

- [ ] **Step 1: Split the combined heading rule**

Replace the current combined rule (`css/style.css:104-123`):

```css
#products h2,
#wines h2,
#location h2 {
    position: relative;
    display: inline-block;
    padding: 0.4rem 1.2rem;
    color: var(--gold);
    text-shadow:
        2px 3px 4px rgba(0, 0, 0, 0.85),
        -1px -1px 1px rgba(255, 255, 255, 0.15);
}
#products h2::before,
#wines h2::before,
#location h2::before {
    content: '';
    position: absolute;
    inset: -20px -30px;
    background: radial-gradient(ellipse at center, rgba(20, 14, 10, 0.55) 0%, rgba(20, 14, 10, 0) 75%);
    pointer-events: none;
}
```

with two separate rules — one for `#location` (unchanged styling, kept as its own rule since it no longer shares selectors with Products/Wines), and one new rule for `#products`/`#wines`:

```css
#location h2 {
    position: relative;
    display: inline-block;
    padding: 0.4rem 1.2rem;
    color: var(--gold);
    text-shadow:
        2px 3px 4px rgba(0, 0, 0, 0.85),
        -1px -1px 1px rgba(255, 255, 255, 0.15);
}
#location h2::before {
    content: '';
    position: absolute;
    inset: -20px -30px;
    background: radial-gradient(ellipse at center, rgba(20, 14, 10, 0.55) 0%, rgba(20, 14, 10, 0) 75%);
    pointer-events: none;
}

#products h2,
#wines h2 {
    color: var(--accent);
}
```

- [ ] **Step 2: Manual verification**

Run: `open "index.html"` (or refresh the already-open tab).

Expected:
- "The Smoked Collection" (Products) and "Curated Wines" (Wines) headings are now dark reddish-brown (`--accent`), no drop shadow, no dark vignette glow behind them, clearly legible against the cream background.
- "The Smokehouse" (Location) heading is visually unchanged — still gold text with the dark drop-shadow and vignette glow, since it's still on the dark `smoke-bg` background.

- [ ] **Step 3: Commit**

```bash
cd "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka"
git add css/style.css
git commit -m "Split heading treatment so Products/Wines headings use dark text on the new light background"
```

---

### Task 3: HTML — remove redundant smoke-bg class and fix wine subtitle contrast

**Files:**
- Modify: `index.html:90` (`<section id="wines">` tag)
- Modify: `index.html:95` (wine subtitle `<p>`)

**Interfaces:**
- Consumes: Task 1's `#wines` background rule (already fully overrides `.smoke-bg`'s background and, after Task 1, its `::before` too — this task just removes the now-misleading class name from the markup).
- Produces: no new interfaces; this is the final cleanup task.

- [ ] **Step 1: Remove the `smoke-bg` class from the Wines section**

Change (`index.html:90`):

```html
<section id="wines" class="section-padding smoke-bg">
```

to:

```html
<section id="wines" class="section-padding">
```

- [ ] **Step 2: Fix the wine subtitle text color**

Change (`index.html:95`):

```html
<p class="text-center text-white-50 mb-4">Perfectly paired with our smoked delicacies</p>
```

to:

```html
<p class="text-center text-muted mb-4">Perfectly paired with our smoked delicacies</p>
```

Bootstrap's `text-muted` renders a mid-gray that reads clearly against the light `--eggshell-deep` background (unlike `text-white-50`, which assumed a dark background).

- [ ] **Step 3: Manual verification**

Run: `open "index.html"` (or refresh the already-open tab).

Expected:
- The Wines section subtitle "Perfectly paired with our smoked delicacies" is clearly legible in muted gray, immediately below the "Curated Wines" heading.
- Inspecting `#wines` in DevTools shows only `class="section-padding"` (no `smoke-bg`), and the background/heading/smoke-overlay styling from Tasks 1-2 is still fully applied via the `#wines` ID selectors.
- Full end-to-end check: scroll through Products and Wines sections — cream background, faint smoke drift, dark headings, legible subtitle, cards still popping forward with their shadow. Hero and Location sections are unchanged (still dark, still gold headings).

- [ ] **Step 4: Commit**

```bash
cd "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka"
git add index.html
git commit -m "Remove redundant smoke-bg class from Wines section, fix subtitle contrast on light background"
```
