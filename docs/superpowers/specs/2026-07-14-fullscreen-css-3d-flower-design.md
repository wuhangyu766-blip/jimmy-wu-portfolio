# Fullscreen CSS 3D Flower Design

## Goal

Replace the small SVG bouquet with one large, translucent CSS 3D flower that fills the first screen, opens automatically with natural motion, and leaves only the most important resume information on the homepage.

## Hero Content

- Keep the bilingual name, three research directions, and one-sentence profile.
- Replace the detailed quick-facts column with three compact highlights: SWUFE Master of Finance, CFA Level I, and Python / Stata / Codex.
- Keep one GitHub link as the primary hero action.
- Detailed education, internship, campus, and capability content remains below the first screen.

## Flower

- Use a dependency-free HTML/CSS 3D structure, not SVG, canvas, video, WebGL, or an external model.
- Render one flower with an outer ring, middle ring, inner ring, translucent petals, and a dimensional centre.
- Each petal uses independent rotation, depth, delay, highlight, and shadow values.
- On load, petals unfold from a vertical closed state to a layered open state over roughly 2.6 seconds, with staggered timing and a restrained overshoot.
- After opening, the flower keeps a subtle slow floating motion.
- Light theme petals are transparent blush-white; dark theme petals are transparent cool-white / pale blue.

## Layout and Accessibility

- The hero fills at least the visible viewport below the header.
- Text stays on the left foreground; the flower occupies roughly 60-70% of the right and centre background.
- The flower is decorative and excluded from the accessibility tree.
- Mobile layout moves the flower behind the lower half of the hero with reduced opacity so text remains readable.
- `prefers-reduced-motion: reduce` skips opening and floating animation while keeping the final open flower visible.

## Verification

- Static tests require the three petal rings, at least twenty petals, translucent petal styles, CSS perspective / preserve-3d, staggered bloom animation, full-screen hero sizing, reduced-motion handling, and compact homepage highlights.
- Existing bilingual, theme, privacy, build, and deployment tests must continue to pass.
