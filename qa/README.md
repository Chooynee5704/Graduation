# Visual and interaction QA — 24 October 2026

Browser: Codex in-app browser, Windows, Three.js r186. Viewport overrides: desktop 1440×900, tablet 768×1024 and phone 390×844. These are browser viewport checks, not physical-device tests.

Checked:

- Hero visual and mortarboard silhouette on desktop and phone; darker fabric, visible cap band, thicker tassel and a calmer name area after review.
- Scene anchor navigation forward and reverse; hash reload at invitation and graduation. Fixed a fractional-pixel scene-boundary classification error with a 1px anchor tolerance.
- Fixed the hero intro/scroll fade ownership conflict so name/date return when scrolling back to the opening frame.
- No horizontal overflow at the checked sizes.
- Invitation name, date, address and map link preserved; mobile background receives a local scrim for stable text contrast.
- Pause button sets aria-pressed and stops autonomous drawing, with scroll still available.
- Reproducible `?motion=reduce` check: canvas hidden, ordinary section flow, poster visible, event details available and no horizontal overflow. Same implementation is selected by OS reduced motion.
- No JavaScript error logs in the checked run. Windows ANGLE reported non-fatal floating-point precision warnings during environment shader compilation; scene rendered correctly.
- Production Vite build passes. Three.js world is dynamically loaded, 146–147 KB gzipped; main code about 53 KB gzipped. Vite reports the expected >500 KB raw minified world chunk warning. No extra smooth-scroll engine.

Observed lightweight render diagnostics: hero around 13 draw calls / 7,450 triangles; a transition around 14 calls / 17,170 triangles. CPU render submission snapshots about 0.3–0.5 ms on this host after warmup. These are not GPU timings or an FPS guarantee. Mobile draw ranges are bounded at 900 glyphs and 1,000 compilation points; DPR cap 1.35, automatically reduced to 1 in the observed run.

Evidence PNGs in this folder show actual viewport renders. Ambient poses may differ because the ribbon and cap are animated. Full-page captures are deliberately avoided for a sticky/WebGL experience.

Not measured: physical phone thermals, battery use, GPU timing, a long-duration heap profile, real browser context-loss recovery and OS-setting reduced-motion emulation. No video AI generation tool was available; the background is genuine realtime WebGL animation over an original ImageGen texture.

## Formal invitation refinement

Replaced only the event panel with an opaque black/copper double-rule invitation, a PM monogram, Noto Serif ceremonial typography, formal salutation, full graduate name, semantic date, venue, welcome and map link. Phone uses normal document flow for the taller card so the closing and link remain reachable. Checked desktop 1440×900 and phone 390×844 with no horizontal overflow. The mechanical Impeccable scan was run once; its flat-type-hierarchy warning was a static-parser false positive (external CSS is imported by JS). Browser-computed role sizes were title 40px / name 28.8px / body 10px on desktop, and title 32px / name 23px on phone. Existing world, camera and other scenes were preserved.
