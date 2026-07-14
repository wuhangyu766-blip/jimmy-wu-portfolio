# Fullscreen CSS 3D Flower Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the small SVG bouquet with a large translucent CSS 3D flower and simplify the first screen to essential resume information.

**Architecture:** `index.html` will contain three static petal rings with CSS variables for each petal angle and delay. `assets/styles.css` will own perspective, translucency, unfolding motion, responsive placement, themes, and reduced-motion behavior. Existing JavaScript remains responsible only for language, theme, and year preferences.

**Tech Stack:** Semantic HTML, CSS custom properties, CSS 3D transforms/keyframes, Node.js built-in tests.

## Global Constraints

- No SVG flower, canvas, video, WebGL, third-party dependency, or external model.
- The first screen contains only the bilingual identity, profile, three highlights, and GitHub action.
- The flower is decorative and the open state remains visible with reduced motion.
- Existing privacy, bilingual, theme, responsive, build, and deployment behavior remains intact.

---

### Task 1: Define the full-screen 3D flower contract

**Files:**
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: static `index.html` and `assets/styles.css` source.
- Produces: regression requirements for the new hero and flower.

- [ ] **Step 1: Add a failing test**

```js
test('renders a full-screen three-ring translucent CSS 3D flower', () => {
  assert.match(page, /class="hero-flower-stage"/);
  assert.match(page, /class="petal-ring petal-ring-outer"/);
  assert.match(page, /class="petal-ring petal-ring-middle"/);
  assert.match(page, /class="petal-ring petal-ring-inner"/);
  assert.ok((page.match(/class="flower-petal/g) ?? []).length >= 20);
  assert.match(page, /class="hero-highlights"/);
  assert.doesNotMatch(page, /class="hero-bouquet"/);
  assert.match(styles, /min-height:calc\(100svh - 68px\)/);
  assert.match(styles, /transform-style:preserve-3d/);
  assert.match(styles, /backdrop-filter:blur/);
  assert.match(styles, /@keyframes petal-unfurl/);
  assert.match(styles, /@keyframes flower-float/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});
```

- [ ] **Step 2: Verify the test fails**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL because the current hero still contains `.hero-bouquet` SVG markup.

### Task 2: Replace hero markup with compact highlights and petal rings

**Files:**
- Modify: `index.html`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Produces: `.hero-highlights`, `.hero-actions`, `.hero-flower-stage`, `.petal-ring-*`, `.flower-petal`, and `.flower-heart`.

- [ ] **Step 1: Replace quick facts with highlights**

Use three bilingual highlight spans for `SWUFE MFin`, `CFA Level I`, and `Python · Stata · Codex`, followed by the existing GitHub hyperlink.

- [ ] **Step 2: Replace SVG bouquet with 24 CSS petals**

Create 10 outer, 8 middle, and 6 inner `<span class="flower-petal">` elements. Give each element `--angle`, `--delay`, and `--tilt` values through its `style` attribute and add one `.flower-heart` element.

- [ ] **Step 3: Keep the component decorative**

The wrapping `.hero-flower-stage` must use `aria-hidden="true"`; no petal receives focus or accessible text.

### Task 3: Add full-screen layout, transparent materials, and natural motion

**Files:**
- Modify: `assets/styles.css`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: Task 2 class names and inline petal variables.
- Produces: full-screen positioning, glass petals, 3D opening, theme variants, mobile behavior, and reduced-motion fallback.

- [ ] **Step 1: Make the hero full-screen and foreground the text**

Set `.hero` to `position:relative`, `min-height:calc(100svh - 68px)`, and an isolated stacking context. Place `.hero-copy` above the flower with a readable maximum width.

- [ ] **Step 2: Define the flower material and depth**

Use `perspective`, `transform-style:preserve-3d`, semi-transparent gradients, borders, `backdrop-filter:blur`, and multi-layer shadows. Outer, middle, and inner rings receive different petal sizes and target opening angles.

- [ ] **Step 3: Define natural motion**

`petal-unfurl` opens each petal from a near-vertical closed angle, slightly overshoots, and settles. Inline delays stagger the petals. `flower-float` adds a subtle slow post-bloom movement without changing the petal open state.

- [ ] **Step 4: Add mobile and reduced-motion behavior**

Move and fade the flower behind the lower hero on narrow screens. In `prefers-reduced-motion: reduce`, disable animation and apply the final open transform directly.

- [ ] **Step 5: Verify and publish**

Run: `node --test tests/portfolio.test.mjs`, `node scripts/build.mjs`, and `git diff --check`. Commit the source changes, merge to `main`, rerun tests/build, and push `main` to the `github` remote for EdgeOne deployment.
