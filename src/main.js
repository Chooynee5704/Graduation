import './style.css';
import './invitation.css';
import './rsvp.css';
import './rsvp.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const forceStatic = new URLSearchParams(location.search).get('motion') === 'reduce';
if (forceStatic) document.documentElement.classList.add('reduced-motion');
const media = gsap.matchMedia();
const chapters = [...document.querySelectorAll('[data-chapter]')];
const links = [...document.querySelectorAll('.chapter-nav a')];
const progress = document.querySelector('.scroll-progress');
let frame = 0, disposed = false;
function updateNavigation() {
  frame = 0;
  const y = window.scrollY;
  progress.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
  let active = chapters[0].id;
  for (const chapter of chapters) if (chapter.getBoundingClientRect().top <= innerHeight * .45) active = chapter.id;
  for (const link of links) {
    if (link.hash === `#${active}`) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  }
}
function onScroll() { if (!frame) frame = requestAnimationFrame(updateNavigation); }
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
updateNavigation();

media.add('(prefers-reduced-motion: no-preference)', () => {
  if (forceStatic) return;
  document.documentElement.classList.add('motion-ready');
  // Lenis is the only smooth-scroll engine. ScrollTrigger follows native scroll.
  const lenis = new Lenis({ lerp: .095, smoothWheel: true, anchors: { duration: 1.3 } });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = time => lenis.raf(time * 1000);
  gsap.ticker.add(tick);

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.hero-photo-wrap', { clipPath: 'inset(0 0 100% 0)', duration: 1.35 }, .05)
    .from('.hero h1', { y: 65, duration: 1.25 }, .12)
    .from('.hero-intro, .hero-topline, .hero-bottom', { opacity: 0, y: 12, stagger: .1, duration: .75 }, .35);
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } })
    .to('.hero-photo', { scale: 1.14, yPercent: 7, ease: 'none' }, 0)
    .to('.hero h1', { yPercent: -24, ease: 'none' }, 0);

  const build = document.querySelector('.build-progress');
  const buildState = { value: 0 };
  const compile = gsap.timeline({ scrollTrigger: { trigger: '.compile-section', start: 'top top', end: 'bottom bottom', scrub: .65 } });
  compile.to('.build-track i', { scaleX: 1, ease: 'none', duration: 1 }, 0)
    .to(buildState, { value: 100, ease: 'none', duration: 1, onUpdate: () => { build.textContent = `${Math.round(buildState.value)}%`; } }, 0)
    .fromTo('.compile-word', { xPercent: 8 }, { xPercent: -9, ease: 'none', duration: 1 }, 0)
    .to('.source-code', { y: -20, duration: .4 }, .6);

  // Alternating shutters read as a single frame being compiled from strips.
  // They cover a semantic <img>; no canvas or duplicated photo downloads.
  gsap.timeline({ scrollTrigger: { trigger: '.reveal-section', start: 'top top', end: 'bottom bottom', scrub: .65 } })
    .to('.shutter i', { scaleY: 0, stagger: { each: .055, from: 'center' }, ease: 'power2.inOut', duration: .7 }, 0)
    .fromTo('.reveal-photo', { scale: 1.16 }, { scale: 1, ease: 'none', duration: 1.2 }, 0)
    .from('.reveal-title', { y: 65, opacity: 0, duration: .4 }, .4)
    .from('.reveal-bottom', { opacity: 0, duration: .3 }, .65);

  const track = document.querySelector('.memory-track');
  const distance = () => Math.max(0, track.scrollWidth - innerWidth);
  const memoryPosition = document.querySelector('.memory-position');
  gsap.timeline({ scrollTrigger: { trigger: '.memory-scroll', start: 'top top', end: 'bottom bottom', scrub: .7, invalidateOnRefresh: true,
    onUpdate: self => { memoryPosition.textContent = `${String(Math.min(3, 1 + Math.round(self.progress * 2))).padStart(2, '0')} — 03`; }
  } })
    .to(track, { x: () => -distance(), ease: 'none', duration: 1 }, 0)
    .to('.memory-guide i', { scaleX: 1, ease: 'none', duration: 1 }, 0);

  const restoredHeadings = [];
  for (const heading of document.querySelectorAll('.compile-heading h2, .memories-heading h2, .invite-intro h2')) {
    const html = heading.innerHTML;
    const label = heading.innerText.replace(/\s+/g, ' ').trim();
    heading.setAttribute('aria-label', label);
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      for (const part of node.textContent.split(/(\s+)/)) {
        if (!part.trim()) { fragment.append(document.createTextNode(part)); continue; }
        const mask = document.createElement('span');
        mask.setAttribute('aria-hidden', 'true');
        mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:.12em;margin-bottom:-.12em';
        const word = document.createElement('span');
        word.className = 'reveal-word'; word.textContent = part; word.style.display = 'inline-block';
        mask.append(word); fragment.append(mask);
      }
      node.replaceWith(fragment);
    }
    restoredHeadings.push(() => { heading.innerHTML = html; heading.removeAttribute('aria-label'); });
    gsap.from(heading.querySelectorAll('.reveal-word'), { yPercent: 105, stagger: .035, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 88%', once: true } });
  }

  const portrait = document.querySelector('.hero-photo-wrap');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const toX = gsap.quickTo('.hero-photo-wrap', 'x', { duration: .8, ease: 'power3.out' });
  const toY = gsap.quickTo('.hero-photo-wrap', 'y', { duration: .8, ease: 'power3.out' });
  function pointer(event) {
    if (!finePointer.matches || scrollY > innerHeight || document.hidden) return;
    toX((event.clientX / innerWidth - .5) * 12);
    toY((event.clientY / innerHeight - .5) * 10);
  }
  function resetPointer() { toX(0); toY(0); }
  document.querySelector('.hero').addEventListener('pointermove', pointer, { passive: true });
  document.querySelector('.hero').addEventListener('pointerleave', resetPointer);
  window.addEventListener('blur', resetPointer);
  function onVisibility() { if (document.hidden) { intro.progress(1); lenis.stop(); resetPointer(); } else lenis.start(); }
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    document.documentElement.classList.remove('motion-ready');
    gsap.ticker.remove(tick); lenis.destroy();
    document.querySelector('.hero').removeEventListener('pointermove', pointer);
    document.querySelector('.hero').removeEventListener('pointerleave', resetPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('blur', resetPointer);
    toX.tween.kill(); toY.tween.kill();
    restoredHeadings.forEach(restore => restore());
    portrait.style.removeProperty('transform');
  };
});
function refresh() { if (!disposed) { ScrollTrigger.refresh(); updateNavigation(); } }
document.fonts.ready.then(refresh);
for (const image of document.images) if (!image.complete) image.addEventListener('load', refresh, { once: true });
window.addEventListener('load', refresh, { once: true });
function destroy() {
  disposed = true; media.revert(); cancelAnimationFrame(frame);
  window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll);
  window.removeEventListener('load', refresh);
  for (const image of document.images) image.removeEventListener('load', refresh);
}
window.addEventListener('pagehide', event => { if (!event.persisted) destroy(); });
if (import.meta.hot) import.meta.hot.dispose(destroy);
