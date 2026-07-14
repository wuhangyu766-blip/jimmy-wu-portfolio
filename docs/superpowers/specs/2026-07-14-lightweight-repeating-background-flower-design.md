# Lightweight Repeating Background Flower Design

## Goal

Replace the current GPU-heavy foreground flower with a centered, translucent background flower that reads naturally from the front, repeats its bloom animation, and stops after mouse movement without compromising page responsiveness.

## Confirmed Direction

- Use a lightweight CSS implementation rather than SVG or WebGL.
- Render exactly 16 petals in two rings.
- Place the flower center in the middle of the hero as a background plate.
- Use a near-front-facing orientation with about 8 degrees of tilt instead of the current 58-degree tilt.
- Arrange important profile copy in the flower's visual whitespace.
- Remove Stata from the homepage highlight only; retain it in the detailed skills section.

## Layout

The flower occupies roughly 80 percent of the hero viewport and sits behind all copy. The hero uses two text islands:

- Upper-left: name, professional direction, and one-sentence profile.
- Lower-right: SWUFE Master of Finance, CFA Level I, `Python · Codex · Claude Code`, and the GitHub action.

On narrow screens, both text islands return to a single readable column while the flower remains centered behind them at lower opacity.

## Flower Structure and Appearance

- Two petal rings with 8 petals each.
- Large outer petals and shorter inner petals create modest depth without extreme perspective.
- Translucency comes from RGBA gradients and borders, not `backdrop-filter`.
- Use light inset shading only; remove blurred pseudo-element highlights, large external shadows, and persistent `will-change` declarations.
- Light theme uses a restrained rose tint. Dark theme uses a cool blue tint.
- The flower is decorative, non-interactive, and remains `aria-hidden`.

## Animation and Interaction

Each cycle lasts approximately 8 seconds:

1. Petals unfold over roughly 1.6 seconds using only `transform` and `opacity`.
2. The flower remains fully open for roughly 4.5 seconds.
3. Petals close gently before the next cycle.

The first bloom always completes. After the first bloom is complete, the page arms a one-time passive `pointermove` listener. The first subsequent mouse movement adds a stable state marker to the document, removes the repeating animation, and forces all petals into their fully open final state. The flower stays open for the rest of the page visit. Refreshing the page starts the cycle again.

For touch devices, the flower remains lightweight and repeats without relying on hover. Reduced-motion users receive the fully open static flower immediately and no listener is armed.

## Performance Requirements

- Exactly 16 flower-petal elements.
- No `backdrop-filter` on petals or the flower stage.
- No CSS `filter: blur(...)` on flower elements.
- No persistent `will-change` on petals.
- No continuous 3D floating or translateZ animation after the bloom cycle.
- Animate only `transform` and `opacity`.
- Mobile may hide selected petals or reduce opacity, but must not add animation work.

## Script Behavior

The existing preference script will gain a small isolated flower-motion initializer:

- Exit if the flower is absent or reduced motion is requested.
- Wait until the first 1.6-second bloom completes.
- Register one passive, once-only `pointermove` listener.
- On movement, set `data-flower-static="true"` on the root element.

No timers continue after the listener is armed, and no per-frame JavaScript is used.

## Testing

Automated tests will verify:

- The hero contains exactly 16 petals and two rings.
- Homepage highlights exclude Stata and include `Python · Codex · Claude Code`.
- Flower CSS contains no petal/stage backdrop blur, blur filter, persistent `will-change`, or old `flower-float` animation.
- The flower uses a near-front-facing orientation and a repeating bloom cycle.
- The script arms interaction only after the first bloom and sets the static state marker on pointer movement.
- Reduced-motion CSS forces the final open state.
- The existing bilingual, theme, privacy, build, and deployment tests remain green.

## Release

Run the full test suite, syntax check, static build, and diff check. Commit the source change to `main`, push through the repository-scoped GitHub proxy already configured, and verify that the public page contains the new background-flower structure.
