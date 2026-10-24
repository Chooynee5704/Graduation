# Hello, future — world bible

Travel from a suspended graduation cap, through its exploded layers and a corridor of source code, into a graduate's celebration, then land on a personal invitation. Native scroll owns the route; elapsed time owns only ambient drift. The same scroll position resolves the same authored camera/object state in reverse or after an anchor jump.

## Visual grammar

Black `#050505`, FPT orange `#ff681d`, white `#f2efe8`, copper highlights and a restrained cool fill. One unit is a stylized metre. The cap board is 2.7 units wide, with a 0.12-unit edge, 0.8-unit band, copper button, curved cord and 32 tassel strands. The black fabric has a baked woven normal map, restrained sheen and low dielectric specular. Copper ribbons have actual depth and lighting. Manrope display, Be Vietnam Pro Vietnamese copy, Space Mono code and small utility text.

One perspective camera, one renderer, one persistent world; no orbit controls, wheel capture, automatic audio or frame-sequence pretense. GSAP owns DOM typography and Lenis owns wheel smoothing. One GSAP ticker drives Lenis and WebGL.

## Chapters and spatial change

| Chapter | Visual change | Camera / material | DOM |
| --- | --- | --- | --- |
| Hello, future | suspended mortarboard within copper circuit portal | `[0,.7,8.5]`, 38°; slight pointer parallax | title, name, role, date |
| Hello world | approach and explode cap layers, pass through real terminal planes and code motes | move from `[1.4,1.7,5.2]` to `[.8,-.7,-3]`; seeded glyph field | two-line heading, short hello-world graphic |
| Graduate | particles resolve back into cap; satellite boards form a celebration | pull back to `[0,1.2,8.4]`, then arc to `[-1.6,2.3,6.6]` | STUDENT → GRADUATE, two lines of thanks |
| Invitation | object retires to the left; scene becomes calmer for event information | `[0,.7,10]`; background darkens, mobile scrim | date, full address, map link |
| Memories | full orange closing frame covers the world | WebGL stops once fully occluded | invitation link and signature |

All detailed route endpoints are exported as `shots` in `src/world.js`. The exact conductor is derived from measured semantic sections in `src/main.js`; camera interpolation is damped independently. Pointer range is ±0.18 units and ±0.065 radians, reduced on narrow screens. Mobile FOV 48°, portrait camera pullback 1 unit, cap scale chosen from aspect; no center-crop-only fallback.

## Scene graph

`scene → background shader, graduation-mortarboard, ribbons, code points, source-code-corridor, cap particles, instanced satellite boards, key/fill/rim/practical lights`.

Semantic HTML remains above canvas; decorative code canvases are not screen-reader content. Chapter anchors and map link are real links. Motion pause freezes ambient drawing while preserving scroll input. Reduced motion skips WebGL loading and GSAP/Lenis, returns sections to ordinary flow and keeps the still poster; `?motion=reduce` is a reproducible QA override.

## Assets and animation provenance

- `public/assets/data-portal.png`: original ImageGen still, copper circuit-etched ribbon portal; used as shader texture with animated UV flow, light streams and time-varying illumination. **This is not generated video footage.**
- `public/assets/graduation-hero.png`: original ImageGen graduation image from v1; static/no-WebGL/reduced-motion poster.
- Cap/ribbons: locally authored real Three.js geometry. Code textures are locally generated typography, not stock screenshots. Glyphs and spark attributes are seeded once.
- Fonts: Google Fonts. No personal photos, fabricated guests, testimonials or unprovided event time.

Portal prompt: “Monumental thin copper orange satin ribbon twists into an asymmetrical open circular portal in a pitch-black void, etched electrical circuit traces and fine woven metal texture, strong orange highlights, burnt-red underside, microscopic data dust, negative dark space, realistic luxury 3D cinematography, no text/people/cap/watermark.” Generated with the built-in ImageGen tool, copied into this project.

## Budgets, lifecycle and verification

Main library bundle is deferred: static/reduced motion does not download the Three.js world chunk. DPR cap 1.35 mobile / 1.75 desktop; quality steps down after sustained expensive draws. One draw per tick; no post-processing chain or shadow maps. Typical hero has about 13 draw calls and 7,450 triangles. Cap compilation and celebration add bounded point/instanced fields. The 1,800 glyphs, 1,800 compilation motes and 10 satellite boards use fixed GPU buffers.

Pause on document visibility and once the solid finale covers the canvas. Clamp dt to 1/30 s; resize renderer/camera from ResizeObserver. Dispose all owned geometry, material, texture, environment, observers and handlers. Context loss reveals the poster; restore returns the live scene.

Render submission timings exposed in canvas data attributes are CPU submission times, not GPU frame-time or certified FPS. QA screenshots and actual checked results live in `qa/`; unmeasured physical-device thermal/GPU performance must not be claimed.
