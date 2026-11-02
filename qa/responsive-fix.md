# Responsive refinement — 02 November 2026

Completed one inspection pass and one confirmation pass, following the mobile review. No redesign of identity/content or backend changes.

- Mobile 390×844: inspected hero, vertical album, invitation and captions. No horizontal overflow. Role text 11px, invitation welcome 12px. Card phone target has 44px layout height (brief perspective transform can affect its projected rectangle during entrance).
- Mobile 360×740: hero height 740px, date/cue bottom 720px, all primary opening details fit. Photo and diploma stay inside the composition. No horizontal overflow.
- Desktop 1440×900: horizontal filmstrip works; larger photos and 13px captions; no horizontal document overflow. Verified resize back from mobile creates desktop sticky/flex layout. Confirmation on production build shows mobile grid/relative layout with `transform:none` and desktop sticky/flex layout.
- Mobile reduced-motion query: grid album, shutters hidden, no horizontal overflow. All motion remains inside the parent reduced-motion media context.
- Source syntax and production build pass. No new UI-only tests; existing backend untouched.
- Mechanical detector run once: flat-type-hierarchy is a verified false positive from imported CSS; actual display sizes are visibly/computationally distinct.
- Evidence: responsive-fixed-hero.png, responsive-fixed-album.png, responsive-fixed-desktop.png.
- Not tested on physical phones or with native touch synthesis; viewport emulation and browser scrolling only. No GPU/battery benchmark.
