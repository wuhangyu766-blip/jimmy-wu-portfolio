# Portfolio Preferences and Bouquet Design

## Goal

Upgrade Jimmy Wu's public portfolio with bilingual resume content, a persistent light/dark theme control, and a lightweight animated bouquet in the hero section, without adding runtime dependencies.

## Content

- The website defaults to Simplified Chinese and can switch every visible resume label and entry to English.
- English identity is `Jimmy Wu (Hangyu Wu)`.
- Education is:
  - Southwestern University of Finance and Economics (SWUFE), Master of Finance, Sep 2025 - Jun 2027.
  - Zhejiang Gongshang University, Bachelor's Degree, Sep 2021 - Jun 2025.
- Internship employers use the confirmed names: Yichen Fund, Orient Securities Investment Banking Co., Ltd., and Sinowisdom Investment.
- CFA Program Level I is shown as passed.
- Work history is labeled Internship Experience / 实习经历; competition and research work is labeled Campus Experience / 校园经历.
- The public site continues to omit phone numbers and email addresses.

## Interface

- The header gains two compact, accessible buttons: Chinese/English and light/dark.
- Button labels, `aria-label` values, document language, and navigation labels update with the selected language.
- The selected language and colour theme are stored in `localStorage`; invalid or unavailable stored values fall back to Chinese and light mode.
- The document root exposes state through `lang` and a `data-theme` attribute so CSS owns colour changes.

## Hero Bouquet

- The hero section includes a decorative inline SVG bouquet beside the profile text.
- CSS transforms, gradients, and staged keyframe delays create a dimensional flower arrangement that blooms once on page load.
- The bouquet has no external image, network request, canvas, or JavaScript animation dependency.
- It is decorative (`aria-hidden`) and shrinks or reflows cleanly on mobile.
- `prefers-reduced-motion: reduce` disables the bloom motion while retaining the final visual state.

## Architecture

- `index.html` keeps semantic resume structure but supplies language-specific strings with `data-zh` and `data-en` attributes. Content that contains markup is represented by dedicated paired elements, not injected as HTML.
- `assets/site.js` owns a small preference controller: read safe saved preferences, render language/theme state, attach button handlers, and persist valid changes.
- `assets/styles.css` defines colour tokens for both themes and styles the controls and bouquet. It keeps the existing responsive layout intact.
- Tests assert the bilingual content, confirmed education/employer names, controls, storage-backed controller surface, bouquet markup, reduced-motion stylesheet, and deploy build output.

## Constraints

- No third-party package, 3D engine, external image, email address, or phone number is added.
- Existing GitHub link remains a hyperlink and its raw URL is not shown as visible page copy.
- The implementation is limited to the portfolio page and its existing build/deploy pipeline.

## Verification

1. New static tests fail before the interface exists, then pass after implementation.
2. `npm test` passes and `npm run build` produces `dist/client` with the updated assets.
3. A local browser check confirms that both controls update the page, preferences survive refresh, the bouquet blooms normally, and reduced-motion users receive a static bouquet.
4. Changes are committed and pushed to `main`; EdgeOne Pages deploys the existing repository integration.
