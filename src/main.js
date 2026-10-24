import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const context = gsap.matchMedia();
let lenis;
let tick;

context.add('(prefers-reduced-motion: no-preference)', () => {
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  tick = time => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.hero-art', { scale: 1.12, opacity: 0, duration: 1.7 })
    .from('.hero-title-wrap h1 > span', { y: 60, opacity: 0, duration: 1.1, stagger: 0.12 }, 0.18)
    .from('.hero-intro, .hero-fullname, .hero-top', { opacity: 0, y: 12, stagger: 0.1, duration: 0.8 }, 0.5)
    .from('.nav, .hero-bottom, .hero-note', { opacity: 0, duration: 0.9 }, 0.7);
  gsap.to('.hero-art', { yPercent: 16, scale: 1.09, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  gsap.to('.hero-title-wrap', { y: -65, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  gsap.from('.opening-grid', { y: 50, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.opening-grid', start: 'top 84%', once: true } });
  gsap.timeline({ scrollTrigger: { trigger: '.chapter', start: 'top top', end: 'bottom bottom', scrub: 1 } })
    .fromTo('.chapter-outline', { xPercent: 8 }, { xPercent: -22, ease: 'none' }, 0)
    .fromTo('.chapter h2', { y: 40 }, { y: -24, ease: 'none' }, 0)
    .fromTo('.chapter p', { opacity: 0.25, y: 30 }, { opacity: 1, y: 0, ease: 'none', duration: 0.5 }, 0);
  gsap.fromTo('.ticket', { y: 80, rotate: 3 }, { y: 0, rotate: -1, ease: 'none', scrollTrigger: { trigger: '.ticket', start: 'top 96%', end: 'top 30%', scrub: 1 } });
  gsap.from('.closing h2', { y: 55, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.closing-content', start: 'top 80%', once: true } });
  gsap.to('.closing-star', { rotation: 100, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
  const visibility = () => { if (document.hidden) lenis?.stop(); else lenis?.start(); };
  document.addEventListener('visibilitychange', visibility);
  return () => { document.removeEventListener('visibilitychange', visibility); gsap.ticker.remove(tick); lenis?.destroy(); lenis = undefined; };
});

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.progress').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
document.fonts.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => { ScrollTrigger.refresh(); updateProgress(); });
window.addEventListener('pagehide', () => { context.revert(); window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress); }, { once: true });
if (import.meta.hot) import.meta.hot.dispose(() => { context.revert(); ScrollTrigger.killAll(); window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress); });
