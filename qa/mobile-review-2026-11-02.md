# Mobile visual review — 02 November 2026

Reviewed current production build locally from the same deployed source, without editing site code. Browser viewport emulation, not physical iOS/Android testing. Sizes: 360×740, 390×844, 430×932. Inspected opening, source/code, graduation transition, horizontal album, invitation and RSVP.

Verdict: the opening portrait and warm-black palette are coherent and noticeably integrated. The whole mobile journey is not yet equally polished. The horizontal album's mobile framing is the largest visual weakness.

## Findings

1. P1, composition: album holds landscape media in a full-height sticky stage using object-fit:contain. At 390×844 the stage is 844px high, while the visible landscape image is only about 220px high. Large black areas surround it and the caption sits far below the photo. Correct the mobile stage height and keep image/caption together, or use a vertical editorial album on mobile. Evidence: mobile-review-album-gap.png.
2. P2, readability: computed Software Engineer role is 8px at 390px and 7px at 360px; venue line on hero is 9px; invitation introductory copy is 10px. Increase secondary information to a readable mobile scale, rather than preserving desktop microtype.
3. P2, touch: phone link inside the card has only about 78×15px hit area. Scroll cue is 135×34px. Map link is 150×44px and submit button 54px tall (good). Add padding/minimum hit area around phone and cue while preserving the visual design.
4. P2, short viewport: 360×740 uses a 780px minimum hero. The scroll cue and venue line extend below the first screen; reducing minimum height or rebalancing portrait/text would make the opening more complete on short phones. At 430×932 date and cue fit inside viewport (bottom 906px).
5. P3, motion pacing: entering the graduation chapter briefly presents a nearly all-black stage with the chapter labels; shutters/photo and heading reveal as the next scroll advances. Shorten this dark interval or keep a visible photo preview/hint so visitors know the page is responding.

## Verified positives

- No horizontal document overflow at the three inspected widths.
- Face unobscured; cutout and background integrate well. Diploma and red bow fit at 390px.
- Event time 10:00–12:30 is present in hero and formal invitation.
- Code chapter heading wraps cleanly; heading hierarchy is visibly distinct.
- RSVP input font is 16px and primary submit hit area is 54px tall.
- Source and graduation chapters, album and invitation are reachable with native page scrolling.

Mechanical Impeccable detector reported only flat-type-hierarchy, a false positive caused by external/imported styles: browser-computed mobile h1 is 73.8–88.2px, not the detector's inferred 16px. No code changes made.

Unknown: physical touch gestures, iOS browser chrome/keyboard, Android low-end rendering, long-session FPS/battery, screen reader session. This review is not a full accessibility or performance certification.
