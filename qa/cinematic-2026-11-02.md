# Cinematic photo redesign — 02 November 2026

Browser: Codex in-app browser on Windows. Desktop 1280×720; mobile viewport 390×844. Not a physical-phone test.

- Viewed desktop and mobile hero, checked portrait crop, typography, date and invitation navigation.
- Fixed desktop minimum height so the date and scroll prompt fit a 720px viewport.
- All five supplied photographs loaded successfully; original files untouched.
- Navigated source and graduation chapters. Observed reversible alternating shutter animation during scroll.
- Scrolled the memory track horizontally through second and third images, with position indicator advancing.
- Navigated forward to the invitation and back to the hero. No horizontal document overflow in measured desktop/mobile states.
- Viewed the mobile invitation and its RSVP anchor.
- Checked keyboard Tab focus: visible solid outline on the scroll link.
- Checked `?motion=reduce`: no motion-ready class, shutter hidden, album uses a vertical CSS grid, no horizontal overflow. OS preference uses the same static flow via CSS and GSAP matchMedia; OS settings were not changed.
- No-JavaScript document flow implemented through `html:not(.motion-ready)` with all three album figures visible; reviewed in source, not tested by disabling the browser's JavaScript setting.
- Production build passes; six existing RSVP backend tests pass. No production test names submitted.
- Production browser run had no JavaScript warnings/errors in inspected logs.
- Fixed a pre-existing Vinext dev CSS loading issue by also importing the same CSS in the client entry. Verified dev render is styled.
- No Three.js world is imported by the new entry point. Only GSAP, ScrollTrigger and Lenis are active. No continuous background renderer.

The local production preview must be restarted after rebuilding because Wrangler watches output while Vinext replaces modules. This is a preview lifecycle issue, not a production bundle failure.

Not measured: physical-device GPU/battery use, long-session memory profile, OS reduced-motion toggle, browser JavaScript disabled, screen-reader listening session.
