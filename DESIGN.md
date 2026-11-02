# The human behind the code

Direction: a personal graduation film told through native scrolling. The person leads; programming is the narrative language connecting student life with a new chapter. The supplied portrait, not a generic technology illustration, is the opening focal asset.

Palette: ink #080909, FPT-inspired orange #ff742e, chalk #f4f3ef, sage paper #e8e9e1, muted foliage #a6aaa7. Manrope carries English display type, Be Vietnam Pro carries Vietnamese text, Space Mono is confined to code and chapter notation. Noto Serif retains the ceremony of the formal invitation.

Layout: asymmetric portrait and oversized left-aligned title; two-column source chapter; full-viewport photographic reveal; horizontal memory filmstrip; formal invitation and RSVP. Mobile recomposes hero text below the face and stacks source and invitation columns.

Motion: one GSAP opening sequence; native-scroll progress compiles a symbolic journey; eight alternating vertical shutters uncover the graduate; memory filmstrip travels horizontally from vertical scroll. Lenis is the only smooth-scroll engine, chosen for its GSAP ticker integration and native anchors. Locomotive is not installed or initialized. No Three.js is loaded in this design: the real photos are the story and DOM transforms achieve the required depth without an extra render loop.

Only user-provided photographs are used. Original files stay untouched in ../image. Responsive WebP copies live in public/photos; quality 86, long-edge limits 960 and 1920, EXIF orientation normalized and metadata stripped. No generated portraits or stock assets.

| Asset | Original file | Role |
| --- | --- | --- |
| mai-1 | 1793621579901_181309247163765413_6960243538607137718_10b9ef3b1180db0f3613d9dcf12f5986.jpg | Opening portrait |
| mai-2 | 1793621579923_181309247163765413_6960243538607137718_3d0e213b12fbf3ede53052d240f30aaa.jpg | Sunlit hallway, memory 1 |
| mai-3 | 1793621579943_181309247163765413_6960243538607137718_8968a09cf8ec6cd6f5e3306620c99fd2.jpg | Graduation shutter reveal |
| mai-4 | 1793621579962_181309247163765413_6960243538607137718_a6238823b1c004ea0110faaadb97038b.jpg | Looking back, memory 2 |
| mai-5 | 1793621579976_181309247163765413_6960243538607137718_3af0e08e3072c212e53216b8b47b0f52.jpg | Lotus pond portrait, memory 3 |

Photos include meaningful alt text, dimensions, responsive source selection, eager hero loading and lazy loading below the fold. Reduced motion and no-JavaScript use ordinary vertical flow. No autonomous background motion, cursor replacement, preloader, added fictional achievements, icons or logo-wall claims.

## Second pass: integrated portrait, 10:00–12:30

User requested a harmonious dark photographic background, stronger cinematic movement and mobile refinement. Hero now uses an alpha cutout edited from mai-1 using built-in image_gen background extraction. The original input is unchanged. Generated PNG is public/photos/mai-hero-cutout.png; optimized alpha WebP derivatives are mai-cutout-960.webp and mai-cutout-1600.webp. Edit brief: remove railings/trees/floor only; preserve the same face, smile, hair, pose, graduation gown, diploma and red bow; genuine transparency, no added objects, text or backdrop. Generated result reviewed before use.

A warm-black palette now continues through hero, graduation, album, invitation and RSVP. CSS grading and feathered masks integrate the other original photos without editing their source pixels. On mobile the graduation portrait uses contain instead of an aggressive landscape crop.

Additional scroll-linked motion: orbital portal lines behind the cutout, separate portrait/title/background depth, a source-code panel settling in perspective, cinematic bars opening with graduation shutters, graduate title tracking settling, filmstrip perspective, invitation reveal and divider opening, RSVP entrance. No autonomous motion loop; existing GSAP matchMedia cleanup owns every added animation. The cinematic-gsap-lenis-motion-system skill was applied.

Time is supplied by the user: 10:00–12:30, Asia/Ho_Chi_Minh, on 07.11.2026; rendered in hero, formal invitation and RSVP footer. No access changes.

## Responsive polish after mobile review

Mobile (≤700px) album is now an editorial vertical sequence with natural image ratios, captions attached to photos, and a restrained per-figure scroll reveal. It does not use a full-screen sticky rail. Desktop keeps the horizontal scroll story. GSAP matchMedia gives each layout its own context and reverts transforms/triggers on breakpoint changes.

Mobile hero minimum height reduced from 780px to 640px. At 360×740, hero/date/scroll cue fit in the first screen. Secondary type increased: role 10–11px, location 11px, invitation welcome 12px, body 13px. Phone and scroll links have ≥44px touch heights. Hero copy retains its original line break and label uses the body font to fit without awkward wrapping.

Graduation shutters begin opening while the chapter enters the viewport (top 80%), rather than waiting for its sticky stage. Invitation and RSVP entrances begin already readable. Desktop typography and photo fill were tuned without changing photos or content.
