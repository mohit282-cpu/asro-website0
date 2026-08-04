# Antigravity.google — Animation Spec
 
Reference: https://antigravity.google
 
This doc catalogs the motion/interaction patterns on the site so they can be
rebuilt. Exact JS is minified/bundled and not inspectable from a text fetch,
so timings below are best-practice defaults inferred from the DOM structure
and standard patterns used on this class of marketing site (Framer/GSAP-style
scroll reveals + custom cursor + video hero). Tune numbers by eye once you
have a live reference to compare against.
 
---
 
## 1. Global patterns used throughout
 
### 1.1 Scroll-reveal ("fade-up on enter viewport")
Almost every section (headline, product cards, use-case cards, blog cards,
CTA blocks) fades/slides in as it enters the viewport.
 
- Trigger: `IntersectionObserver`, threshold ~0.2, `rootMargin: "0px 0px -10% 0px"`
- Initial state: `opacity: 0; transform: translateY(24px);`
- Animate to: `opacity: 1; transform: translateY(0);`
- Duration: 600–800ms, `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo feel)
- Stagger children (e.g. 4 product cards, 3 use-case cards, blog grid) by
  ~80–120ms per item using `transition-delay` or a stagger helper.
- Unobserve after first trigger (animate once, not on every scroll).
```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(.16,1,.3,1),
              transform 0.7s cubic-bezier(.16,1,.3,1);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```
 
```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = `${i * 90}ms`;
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```
 
### 1.2 Custom cursor (`antigravity-cursor.png`)
A small custom cursor graphic replaces/augments the native cursor over
interactive media areas (hero canvas, use-case video thumbnails).
 
- On `mouseenter` of the zone: fade in a fixed/absolute-positioned `<img>`
  (the cursor asset) at `pointer-events: none`.
- On `mousemove`: translate the element to `clientX/clientY` (offset by
  half its width/height so it's centered on the pointer), using
  `requestAnimationFrame` or CSS `transform: translate3d()` for smoothness.
- Slight lag/spring is common: lerp the tracked position toward the mouse
  position each frame (factor ~0.15–0.25) rather than snapping directly,
  which gives a soft "trailing" feel.
- On `mouseleave`: fade out (150–200ms) and stop the rAF loop.
- Native cursor is hidden (`cursor: none`) inside the zone while active.
```js
function initCustomCursor(zone, cursorEl) {
  let mx = 0, my = 0, cx = 0, cy = 0, raf;
  const loop = () => {
    cx += (mx - cx) * 0.2;
    cy += (my - cy) * 0.2;
    cursorEl.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    raf = requestAnimationFrame(loop);
  };
  zone.addEventListener('mouseenter', () => {
    zone.style.cursor = 'none';
    cursorEl.style.opacity = 1;
    raf = requestAnimationFrame(loop);
  });
  zone.addEventListener('mousemove', (e) => {
    const r = zone.getBoundingClientRect();
    mx = e.clientX - r.left - cursorEl.offsetWidth / 2;
    my = e.clientY - r.top - cursorEl.offsetHeight / 2;
  });
  zone.addEventListener('mouseleave', () => {
    zone.style.cursor = '';
    cursorEl.style.opacity = 0;
    cancelAnimationFrame(raf);
  });
}
```
 
### 1.3 Sticky header
- Header is `position: sticky; top: 0;` with a subtle background/blur and
  bottom border that fades in once `scrollY > ~10px`
  (`backdrop-filter: blur(12px)`, background opacity 0 → ~0.8).
- Toggle a `.scrolled` class via a scroll listener (throttled with rAF).
### 1.4 Mega-menu dropdowns (Product / Use Cases / Resources)
- On hover/focus of the nav item: dropdown panel animates
  `opacity 0→1`, `translateY(-8px)→0`, `~200ms ease-out`.
- Chevron (`keyboard_arrow_down`) rotates 180° over the same duration.
- Only one panel open at a time — closing the previous panel is instant/fast
  (~120ms) while opening is slightly slower for a "settling" feel.
- Mobile: menu becomes a full-screen `hamburger → close (X)` icon morph;
  panel slides down/height-expands (`max-height` transition or
  `grid-template-rows: 0fr → 1fr` trick) rather than fading.
---
 
## 2. Hero section
 
### 2.1 Headline reveal (duplicated text = mask reveal)
The headline markup contains the sentence twice — this is the standard
"clip-path reveal" technique: one copy is visually hidden (used for layout/
SEO or as the animated duplicate), the visible copy is revealed via a
clipping mask that animates open, OR the two copies cross-fade with a
vertical mask "wipe."
 
Recommended implementation (line/word mask wipe):
```css
.hero-title { overflow: hidden; }
.hero-title .line {
  display: block;
  transform: translateY(110%);
  transition: transform 0.9s cubic-bezier(.16,1,.3,1);
}
.hero-title.is-visible .line { transform: translateY(0); }
```
- Split the headline into words or lines, wrap each in a `overflow:hidden`
  span, animate each inner span up from `translateY(110%)` to `0`.
- Stagger each line/word by ~40–60ms.
- Fires on page load (not scroll-triggered, since it's above the fold),
  ~300ms after hero mount.
### 2.2 Hero background: floating icon field
A scattered set of Material icons (`refresh`, `folder`, `code_blocks`,
`terminal`, `check_circle`, `plus_code`, `device_hub`, `search_spark`,
`spark`, `merge`, `keyboard_tab`, `file_copy`, `keyboard_command_key`,
`pen_spark`, `data_object`, `keyboard_return`, `dashboard_customize`,
`commit`, `deployed_code`, `spark`, `developer_mode_tv`, `code`) drifts
behind the hero copy.
 
- Each icon is absolutely positioned at a randomized (but seeded/fixed)
  coordinate around the hero, with randomized `opacity` (0.15–0.4) and
  `scale` (0.8–1.3).
- Idle motion: a slow continuous float — each icon has its own CSS
  keyframe `translateY(±10–20px)` + slight `rotate(±5deg)` loop, duration
  randomized 4–8s, `ease-in-out`, `alternate` direction, negative
  `animation-delay` so they're desynced from load.
- Parallax on mouse move: icons translate a few px opposite/with cursor
  movement (depth layers — icons closer to "front" move more), same
  lerp/rAF technique as §1.2.
- On scroll: whole field gets a subtle parallax `translateY` (moves slower
  than scroll, ~0.3–0.5×) as the hero scrolls out of view.
```css
@keyframes floatIcon {
  0%, 100% { transform: translate(0,0) rotate(0deg); }
  50% { transform: translate(6px,-14px) rotate(4deg); }
}
.hero-icon {
  animation: floatIcon 6s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.7s);
}
```
 
### 2.3 "Play intro" video modal
- Button (`play_arrow Play intro`) opens a full-screen/lightbox video
  (`hero_video.mp4`).
- Open transition: overlay backdrop fades in (`opacity 0→1`, 250ms) while
  the video panel scales up from ~0.92→1 and fades in, 350–400ms
  `cubic-bezier(.16,1,.3,1)`.
- `close` icon in the corner fades in slightly after the panel (small
  delay, ~150ms) so it doesn't feel like it "pops."
- Closing reverses the scale/opacity, faster (~200ms), and video pauses +
  resets `currentTime = 0` (or keeps position — verify against live site).
- Body scroll is locked (`overflow: hidden` on `<html>`) while open.
- Background hero content behind the modal gets a subtle blur
  (`filter: blur(4px)`) synced with the overlay fade.
---
 
## 3. Product feature showcase (Antigravity 2.0 / CLI / SDK / IDE)
 
This is a tabbed feature block: text list on one side, a large media panel
(image/video) on the other, that swaps per selection, ending on the IDE
video (`an-ai-ide-core.mp4`).
 
- Tabs are likely auto-advancing on a timer (common pattern, e.g. 5–6s per
  tab) with a **progress bar / underline** that fills left→right over that
  duration and resets on tab change — clicking a tab manually cancels/
  restarts the timer.
- Tab switch transition for the media panel: cross-fade (`opacity` 300ms)
  combined with a slight scale-in (0.98→1) of the incoming media, previous
  media fades out simultaneously (no layout shift — panel container has a
  fixed aspect ratio, media are stacked/absolute).
- Active tab label: color/weight change + optional left icon color pop;
  inactive tabs are dimmed (`opacity: 0.55`).
- Final panel (Antigravity IDE) plays a looping/muted autoplay video rather
  than swapping again — video fades in the same way as the images.
```css
.feature-panel { position: relative; aspect-ratio: 16/10; }
.feature-media {
  position: absolute; inset: 0;
  opacity: 0; transform: scale(0.98);
  transition: opacity .35s ease, transform .5s cubic-bezier(.16,1,.3,1);
}
.feature-media.is-active { opacity: 1; transform: scale(1); }
```
 
---
 
## 4. Use-case carousel (Full stack / Enterprise / Frontend developer)
 
Card-based carousel with thumbnail + custom-cursor "play" affordance per
card, plus left/right arrow controls (`keyboard_arrow_left/right`) and an
expanded detail panel per active card.
 
- Cards sit in a horizontal track; `keyboard_arrow_left/right` shift the
  active index and translate the track:
  `transform: translateX(-100% * activeIndex)` with
  `transition: transform 0.5s cubic-bezier(.16,1,.3,1)`.
- Alternatively (if not full-bleed) each arrow click scrolls the flex/track
  by one card width using `scrollTo({ left, behavior: 'smooth' })`.
- Inactive cards are visually de-emphasized: `opacity: 0.5–0.6`,
  slight `scale(0.96)`; the active card is full opacity/scale(1).
  Transition these together with the track move (~400–500ms).
- Hovering a card thumbnail: same custom-cursor treatment as §1.2, cursor
  shows a `play_arrow` bubble that follows the pointer; thumbnail itself
  may get a subtle `scale(1.02)` zoom on hover (`transition: 400ms ease`).
- Below the carousel, the text panel (title + description + "View case")
  cross-fades/slides when the active card changes, synced with the track
  animation (same duration).
- "Watch case" opens the same video-modal pattern as §2.3.
---
 
## 5. Blog / Latest posts rail
 
Horizontally scrollable card rail with `keyboard_arrow_left/right` nav
controls (same visual pattern reused from §4).
 
- Cards use `scroll-snap-type: x mandatory` / `scroll-snap-align: start`
  for clean paging; arrows call `scrollBy({ left: cardWidth, behavior:
  'smooth' })`.
- Cards fade/slide in on first scroll into view per §1.1, staggered.
- Card hover: thumbnail slight `scale(1.03)` zoom (400ms ease-out), title
  underline or color shift on hover (150ms).
- Arrow buttons disable/fade (`opacity: 0.3; pointer-events: none`) at the
  start/end of the scrollable range.
---
 
## 6. CTA / Download section
 
- "Achieve new heights" / "Level up your entire team" blocks: standard
  §1.1 fade-up reveal.
- Download button: on hover, subtle lift (`translateY(-2px)`) + shadow
  increase, ~150ms ease-out — typical Google-style button micro-interaction.
- Footer download bubble ("Download Google Antigravity") with split
  Apple Silicon / Intel buttons: same hover lift, fades in with §1.1 as the
  footer scrolls into view.
---
 
## 7. Micro-interactions (buttons, links, icons throughout)
 
- Text links with trailing icons (`keyboard_arrow_right`, `download`,
  `newspaper`): icon nudges right ~3–4px on hover, 150ms ease-out,
  paired with an underline-grow or color transition on the label.
- "Copy Logo as SVG" button: click triggers a label swap
  ("Copy Logo as SVG" → "Copied!") with a quick cross-fade (150ms), then
  reverts after ~1.5–2s (`setTimeout`).
- Primary buttons (Download, Explore use cases): background color
  transition 150–200ms on hover; some may have a small icon-only
  `scale(1.05)` pulse on click for tactile feedback.
---
 
## 8. Implementation notes / suggested stack
 
- **Scroll reveals**: IntersectionObserver + CSS transitions (no library
  needed) — see §1.1. For more control (stagger, timelines), GSAP +
  ScrollTrigger is a reasonable 1:1 swap.
- **Custom cursor / parallax icons**: plain JS rAF loop with lerp, no
  library required (see §1.2, §2.2).
- **Carousels** (§4, §5): CSS scroll-snap + JS-controlled `scrollTo` is
  the lightest approach; use a library (Embla/Swiper) only if you need
  infinite loop/autoplay behavior.
- **Video modal** (§2.3): a simple fixed-position overlay + `<video>` tag;
  no library needed.
- **Reduced motion**: wrap all non-essential animation (floating icons,
  parallax, autoplay carousels) in
  `@media (prefers-reduced-motion: reduce)` fallbacks — set durations to
  ~0 / disable the floating icon loop and cursor-follow parallax.
---
 
## 9. Open items to verify against the live site
 
Since this spec was written from a text-only fetch of the page (no access
to the actual bundled JS/CSS), confirm these against the rendered site
before finalizing:
- Exact easing curves and durations (numbers above are best-practice
  estimates, not measured values).
- Whether the product-feature tabs (§3) actually auto-advance or are
  click-only.
- Whether the hero floating icons (§2.2) react to cursor movement or are
  purely idle-animated.
- Exact stagger delay and reveal distance used in the real reveal-on-scroll
  system.
 