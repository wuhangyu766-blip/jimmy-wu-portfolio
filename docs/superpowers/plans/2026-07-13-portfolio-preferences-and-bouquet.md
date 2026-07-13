# Portfolio Preferences and Bouquet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual resume, persistent light/dark theme preferences, and an accessible animated hero bouquet to the static portfolio.

**Architecture:** Keep the page dependency-free. `index.html` stores visible Chinese and English strings in paired data attributes and includes the decorative inline SVG. `assets/site.js` renders persisted language/theme state, while `assets/styles.css` maps theme tokens and creates the responsive bloom animation.

**Tech Stack:** Semantic HTML, CSS custom properties/keyframes, vanilla ES modules, Node.js built-in test runner.

## Global Constraints

- Do not add third-party packages, a canvas, external images, a 3D engine, an email address, or a phone number.
- Default to Chinese and light mode; valid `localStorage` values are `zh`/`en` and `light`/`dark`.
- Keep the existing GitHub profile as a hyperlink, without rendering its raw URL in visible copy.
- Use the confirmed education dates, company names, CFA Level I passed status, and separate Internship Experience / Campus Experience labels.
- Preserve a static final bouquet for users who prefer reduced motion.

---

### Task 1: Define regression tests for resume preferences and bouquet

**Files:**
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: static source text from `index.html`, `assets/site.js`, and `assets/styles.css`.
- Produces: regression coverage that later tasks satisfy.

- [ ] **Step 1: Add failing content and component tests**

Append these tests after the existing static-site tests:

```js
test('includes bilingual controls and confirmed English resume facts', async () => {
  const script = await readFile(new URL('../assets/site.js', import.meta.url), 'utf8');
  assert.match(page, /data-language-toggle/);
  assert.match(page, /data-theme-toggle/);
  assert.match(page, /data-en="Yichen Fund"/);
  assert.match(page, /data-en="Orient Securities Investment Banking Co\.?, Ltd\."/);
  assert.match(page, /data-en="Sinowisdom Investment"/);
  assert.match(page, /data-en="CFA Program Level I, Passed"/);
  assert.match(page, /Zhejiang Gongshang University/);
  assert.match(page, /Sep 2021 - Jun 2025/);
  assert.match(page, /Sep 2025 - Jun 2027/);
  assert.match(script, /localStorage/);
  assert.match(script, /data-theme/);
  assert.match(script, /data-language-toggle/);
});

test('includes a decorative reduced-motion bouquet without external assets', async () => {
  const styles = await readFile(new URL('../assets/styles.css', import.meta.url), 'utf8');
  assert.match(page, /class="hero-bouquet"/);
  assert.match(page, /aria-hidden="true"/);
  assert.doesNotMatch(page, /<img[^>]+hero-bouquet/);
  assert.match(styles, /@keyframes bloom/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.hero-bouquet/);
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL because the current page has no language/theme controls, bilingual attributes, or bouquet markup.

### Task 2: Add semantic bilingual resume markup and the hero bouquet

**Files:**
- Modify: `index.html`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `data-zh` and `data-en` string attributes rendered by Task 3.
- Produces: `[data-i18n]`, `[data-language-toggle]`, `[data-theme-toggle]`, and `.hero-bouquet` elements used by JavaScript and CSS.

- [ ] **Step 1: Replace visible strings with paired language strings**

For each visible navigation, heading, employer, role, date label, body paragraph, tag, and button string, use a safe text-only element shape:

```html
<span data-i18n data-zh="实习经历" data-en="Internship Experience">实习经历</span>
```

For named facts, use the confirmed content:

```html
<span data-i18n data-zh="弋宸基金" data-en="Yichen Fund">弋宸基金</span>
<span data-i18n data-zh="CFA 一级已通过" data-en="CFA Program Level I, Passed">CFA 一级已通过</span>
<span data-i18n data-zh="浙江工商大学<br>2021.09 - 2025.06" data-en="Zhejiang Gongshang University<br>Sep 2021 - Jun 2025">浙江工商大学<br>2021.09 - 2025.06</span>
```

Use paired elements rather than HTML in attributes for paragraphs that need line breaks or multiple inline elements.

- [ ] **Step 2: Add the controls to the header**

Place controls after the navigation, using buttons with no form submission behavior:

```html
<div class="preference-controls" aria-label="网站设置" data-controls-label-zh="网站设置" data-controls-label-en="Website settings">
  <button type="button" class="preference-button" data-language-toggle aria-label="Switch to English">EN</button>
  <button type="button" class="preference-button" data-theme-toggle aria-label="切换至深色模式">◐</button>
</div>
```

- [ ] **Step 3: Add the decorative SVG in the hero grid**

Insert a sibling to the profile copy with the required class and final-state flower groups:

```html
<div class="hero-bouquet" aria-hidden="true">
  <svg viewBox="0 0 360 420" role="presentation">
    <defs><linearGradient id="petal-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd6dc"/><stop offset="1" stop-color="#c95c77"/></linearGradient></defs>
    <g class="bouquet-stems"><path d="M180 390 C176 290 185 220 140 120"/><path d="M180 390 C190 285 180 205 225 110"/></g>
    <g class="flower flower-one"><circle class="flower-core" cx="140" cy="120" r="13"/><path class="petal petal-a" d="M140 120 C97 93 97 55 140 76 C183 55 183 93 140 120"/></g>
    <g class="flower flower-two"><circle class="flower-core" cx="225" cy="110" r="14"/><path class="petal petal-b" d="M225 110 C182 82 184 45 225 66 C266 45 268 82 225 110"/></g>
  </svg>
</div>
```

- [ ] **Step 4: Run the content tests**

Run: `node --test tests/portfolio.test.mjs`

Expected: bouquet markup assertions pass; the controls and script assertions still fail until Task 3.

### Task 3: Implement preference rendering and persistence

**Files:**
- Modify: `assets/site.js`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: root document element, `[data-i18n]`, `[data-language-toggle]`, `[data-theme-toggle]`, and browser `localStorage`.
- Produces: root `lang` and `data-theme` attributes plus updated button labels.

- [ ] **Step 1: Replace the current script with a small preference controller**

Implement safe preference reads and render functions using this shape:

```js
const supportedLanguages = new Set(['zh', 'en']);
const supportedThemes = new Set(['light', 'dark']);
const root = document.documentElement;

function getStoredPreference(key, supportedValues, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return supportedValues.has(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function renderLanguage(language) {
  root.lang = language === 'en' ? 'en' : 'zh-CN';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = element.dataset[language];
  });
  document.querySelector('[data-language-toggle]').textContent = language === 'en' ? '中文' : 'EN';
}

function renderTheme(theme) {
  root.dataset.theme = theme;
  document.querySelector('[data-theme-toggle]').setAttribute('aria-pressed', String(theme === 'dark'));
}
```

Keep the existing current-year behavior, use `textContent` only, toggle the chosen value on click, and wrap `localStorage.setItem` in `try/catch`.

- [ ] **Step 2: Run tests to verify controller coverage passes**

Run: `node --test tests/portfolio.test.mjs`

Expected: the bilingual-controls test passes; the reduced-motion style test remains failing until Task 4.

### Task 4: Style controls, themes, responsive bouquet, and reduced motion

**Files:**
- Modify: `assets/styles.css`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `html[data-theme="dark"]`, `.preference-controls`, `.hero-bouquet`, `.flower`, and `.petal` selectors.
- Produces: readable dark mode and a static final bouquet when motion is reduced.

- [ ] **Step 1: Extend colour tokens for dark mode**

Add the following root override near the existing `:root` declaration and change fixed white/blue colours to the existing tokens where they appear in component rules:

```css
html[data-theme="dark"] {
  --surface: #111722;
  --surface-muted: #192230;
  --ink: #edf3fb;
  --muted: #aab8ca;
  --accent: #80b8e7;
  --line: #2b3a4d;
}
```

- [ ] **Step 2: Add control and bouquet styles**

Define a compact `.preference-controls` flex row, a `.preference-button` with keyboard focus styling, and `.hero-bouquet` sizing. Define `@keyframes bloom` and delay individual `.flower` or `.petal` groups so flowers open once, ending in their default visual state.

```css
.hero-bouquet { width:min(100%, 330px); justify-self:end; }
.flower { transform-origin:center; animation:bloom .9s cubic-bezier(.2,.8,.2,1) both; }
.flower-two { animation-delay:.22s; }
@keyframes bloom { from { opacity:0; transform:scale(.28) rotate(-20deg); } to { opacity:1; transform:scale(1) rotate(0); } }
@media (prefers-reduced-motion: reduce) { .flower, .petal { animation:none; } }
```

At the existing mobile breakpoint, place the bouquet below the profile copy and reduce its maximum width.

- [ ] **Step 3: Run the complete suite**

Run: `npm test`

Expected: PASS with all existing and new tests green.

### Task 5: Build, browser-verify, and publish

**Files:**
- Generated: `dist/client/index.html`, `dist/client/assets/styles.css`, `dist/client/assets/site.js`

**Interfaces:**
- Consumes: completed source files and existing `scripts/build.mjs`.
- Produces: deployable static site consumed by EdgeOne Pages from `main`.

- [ ] **Step 1: Build the production site**

Run: `npm run build`

Expected: `Static portfolio build complete` and updated source assets in `dist/client`.

- [ ] **Step 2: Perform a local browser check**

Open the built site and verify: both controls work; language changes all visible resume content; theme is readable; a reload retains both choices; bouquet opens once; and reduced-motion mode leaves the bouquet visible without animation.

- [ ] **Step 3: Commit and push the implementation**

Run:

```bash
git add index.html assets/site.js assets/styles.css tests/portfolio.test.mjs
git commit -m "feat: add bilingual preferences and hero bouquet"
git push github main
```

Expected: a successful push to the repository connected to EdgeOne Pages. Wait for the Pages deployment to complete, then verify the production URL on desktop and mobile.
