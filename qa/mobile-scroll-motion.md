# Mobile scroll motion — 02 November 2026

- Confirmed mobile motion is enabled when OS reduced motion is false.
- In 390×844 viewport, all three album photos start at image scale 1.14 and frame inset 10%/7%, and resolve to scale 1 with zero inset as scrolling advances. Read computed transforms and clip paths before/after UI scrolling. Scrolling back increased the photo scale again (e.g. 1.0588), confirming reversal rather than a one-off entrance.
- Native page scroll remains the input; no wheel/touch interception or pinning added to the mobile album. No animation loops/timers added.
- Resize to 1440×900 removes all mobile wrappers (count 0) and returns desktop flex filmstrip without horizontal document overflow. Resize back recreates exactly three wrappers, no duplicates or document overflow.
- `?motion=reduce` returns plain vertical grid, zero animation wrappers and no overflow. Existing static states remain intact.
- Browser console inspected: no warning/error entries.
- Evidence: mobile-scroll-motion.png (actual viewport render).
- Tested via browser viewport emulation and UI scrolling, not physical iOS/Android hardware or synthesized touch. No FPS or battery claim.
