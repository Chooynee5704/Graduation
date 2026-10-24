import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
const scenes = [...document.querySelectorAll('[data-scene]')];
const navLinks = [...document.querySelectorAll('.chapter-nav a')];
const progressBar = document.querySelector('.scroll-progress');
const motionButton = document.querySelector('.motion-toggle');
const finale = document.querySelector('.finale');
const media = gsap.matchMedia();
const forceStatic = new URLSearchParams(location.search).get('motion') === 'reduce';
if(forceStatic) document.documentElement.classList.add('reduced-motion');
let world, lenis, paused = false, metrics = [];
const state = { exact: 0, last: -1, finale: 0 };
function measure() { metrics = scenes.map(s => ({ top: s.offsetTop, height: s.offsetHeight })); }
function conduct() {
  const y = scrollY;
  let index = 0;
  for (let i = 0; i < metrics.length; i++) if (y + 1 >= metrics[i].top) index = i;
  const m = metrics[index];
  state.exact = Math.min(3.999, index + Math.max(0, Math.min(1, (y - m.top) / m.height)));
  state.finale = Math.max(0, Math.min(1, (y - finale.offsetTop + innerHeight) / innerHeight));
  progressBar.style.transform = `scaleX(${y / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`;
  if (state.last !== index) { navLinks.forEach((a,i) => i === index ? a.setAttribute('aria-current','step') : a.removeAttribute('aria-current')); state.last = index; }
}
measure(); conduct();
const onResize = () => { measure(); conduct(); };
window.addEventListener('scroll', conduct, { passive:true });
window.addEventListener('resize', onResize, { passive:true });
window.addEventListener('pageshow', onResize);
document.fonts.ready.then(() => { measure(); conduct(); ScrollTrigger.refresh(); });
media.add('(prefers-reduced-motion: no-preference)', () => {
  if(forceStatic) return;
  lenis = new Lenis({ lerp:.09, smoothWheel:true, anchors:{ duration:1.5 } });
  lenis.on('scroll', ScrollTrigger.update);
  let cancelled = false;
  import('./world.js').then(({createWorld}) => {
    if(cancelled) return;
    world = createWorld(document.querySelector('#world'), state);
  }).catch(error => { if(!cancelled){document.body.classList.add('fallback-mode'); console.warn('3D fallback active:',error.message);} });
  const ticker = (time, delta) => { lenis.raf(time * 1000); world?.update(time, Math.min(delta/1000,1/30), paused); };
  gsap.ticker.add(ticker); gsap.ticker.lagSmoothing(0);
  gsap.timeline({ defaults:{ ease:'power4.out' } })
    .from('.hero-title .title-line',{ yPercent:65, opacity:0, stagger:.13, duration:1.5 },.15)
    .from('.hero-person, .hero-kicker, .hero-date',{ y:20, opacity:0, stagger:.12, duration:1 },.6)
    .from('.nav, .scroll-cue, .chapter-nav',{ opacity:0, duration:1 },.4);
  gsap.timeline({ scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:.8 } })
    .to('.hero-title',{ scale:1.5, xPercent:-12, yPercent:-15, opacity:0, ease:'none' },.05)
    .fromTo('.hero-person, .hero-kicker, .hero-coordinate, .hero-date, .scroll-cue',{ opacity:1,y:0 },{ opacity:0,y:-40,ease:'none',immediateRender:false },.18);
  gsap.timeline({ scrollTrigger:{ trigger:'.code-scene',start:'top bottom',end:'bottom top',scrub:1 } })
    .fromTo('.code-heading',{ x:-75,opacity:0 },{ x:0,opacity:1,duration:.2 },.1)
    .fromTo('.floating-word',{ xPercent:25,opacity:0 },{ xPercent:-8,opacity:1,duration:.4 },.2)
    .to('.code-heading, .floating-word',{ y:-80,opacity:0,duration:.15 },.7);
  gsap.timeline({ scrollTrigger:{ trigger:'.graduate-scene',start:'top 85%',end:'bottom top',scrub:1 } })
    .fromTo('.graduate-title h2>span:first-child',{ xPercent:15,opacity:0 },{ xPercent:0,opacity:1,duration:.25 },0)
    .fromTo('.graduate-line',{ xPercent:-20,opacity:0 },{ xPercent:0,opacity:1,duration:.3 },.08)
    .fromTo('.graduate-code, .thank-you',{ y:35,opacity:0 },{ y:0,opacity:1,duration:.2 },.25)
    .to('.graduate-title, .graduate-code, .thank-you',{ y:-45,opacity:0,duration:.2 },.75);
  gsap.timeline({ scrollTrigger:{ trigger:'.invitation-scene',start:'top 90%',end:'top top',scrub:.8 } })
    .from('.invite-intro',{ x:-60,opacity:0,duration:1 },0)
    .from('.event',{ y:80,rotationX:15,opacity:0,duration:1 },.1);
  gsap.from('.finale h2',{ yPercent:30,opacity:0,ease:'none',scrollTrigger:{ trigger:'.finale',start:'top 85%',end:'top 15%',scrub:1 } });
  return () => { cancelled = true; gsap.ticker.remove(ticker); lenis.destroy(); world?.dispose(); world = undefined; };
});
motionButton.addEventListener('click', () => { paused = !paused; motionButton.setAttribute('aria-pressed',String(paused)); motionButton.setAttribute('aria-label',paused?'Tiếp tục chuyển động nền':'Tạm dừng chuyển động nền'); motionButton.querySelector('.motion-label').textContent = paused?'Motion off':'Motion on'; motionButton.firstElementChild.textContent = paused?'▷':'Ⅱ'; });
const visibility = () => world?.setHidden(document.hidden);
document.addEventListener('visibilitychange',visibility);
window.addEventListener('load',()=>{ measure(); conduct(); ScrollTrigger.refresh(); });
function destroy() { media.revert(); window.removeEventListener('scroll',conduct); window.removeEventListener('resize',onResize); window.removeEventListener('pageshow',onResize); document.removeEventListener('visibilitychange',visibility); }
window.addEventListener('pagehide',event=>{ if(!event.persisted) destroy(); });
if(import.meta.hot) import.meta.hot.dispose(destroy);
