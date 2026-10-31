'use strict';
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const main = document.querySelector('main');
const footer = document.querySelector('.site-footer');
function closeMenu(returnFocus = false) {
  if (!menuButton || !mobileNav) return;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
  document.body.classList.remove('menu-open');
  if (main) { main.inert = false; main.removeAttribute('aria-hidden'); }
  if (footer) { footer.inert = false; footer.removeAttribute('aria-hidden'); }
  if (returnFocus) menuButton.focus();
}
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    if (!mobileNav.hidden) return closeMenu();
    mobileNav.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'メニューを閉じる');
    document.body.classList.add('menu-open');
    if (main) { main.inert = true; main.setAttribute('aria-hidden', 'true'); }
    if (footer) { footer.inert = true; footer.setAttribute('aria-hidden', 'true'); }
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.querySelector('.brand')?.addEventListener('click', () => closeMenu());
  document.querySelector('.header-cta')?.addEventListener('click', () => closeMenu());
  document.addEventListener('keydown', event => {
    if (mobileNav.hidden) return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const links = [...mobileNav.querySelectorAll('a')];
      if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); menuButton.focus(); }
      if (event.shiftKey && document.activeElement === menuButton) { event.preventDefault(); links.at(-1).focus(); }
    }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
}
// Native dialogs retain keyboard focus and restore it to their opening button.
const reservationDialog = document.getElementById('reservation-dialog');
const sourcesDialog = document.getElementById('sources-dialog');
document.querySelectorAll('[data-reservation]').forEach(button => button.addEventListener('click', () => reservationDialog?.showModal()));
document.querySelectorAll('[data-sources]').forEach(button => button.addEventListener('click', () => sourcesDialog?.showModal()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
});
// Content remains visible when scripting or animation is unavailable.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.documentElement.classList.add('js-enhanced');
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}
const journey = document.querySelector('.journey-section');
const stops = [...document.querySelectorAll('[data-scene]')];
const scenes = [...document.querySelectorAll('[data-scene-image]')];
const sceneLabels = ['THE SHOW & YOUR NEXT ADVENTURE', 'CHASE THE GOLDEN HOUR', 'A FIRE, A MEAL, A GOOD EVENING', 'WANDER INTO THE NIGHT', 'WAKE UP BY THE SEA'];
let activeScene = -1;
function setScene(index) {
  if (index === activeScene || !journey) return;
  activeScene = index;
  journey.dataset.period = stops[index].dataset.period;
  document.querySelectorAll('[data-scene-link]').forEach(link => {
    if (link.dataset.sceneLink === stops[index].dataset.scene) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  journey.style.setProperty('--route-progress', `${index / Math.max(1, stops.length - 1) * 100}%`);
  scenes.forEach(img => {
    const active = img.dataset.sceneImage === stops[index].dataset.scene;
    img.classList.toggle('is-active', active);
    img.setAttribute('aria-hidden', String(!active));
  });
  const count = document.querySelector('[data-scene-count]');
  const label = document.querySelector('[data-scene-label]');
  if (count) count.textContent = `0${index + 1} / 05`;
  if (label) label.textContent = sceneLabels[index];
}
const header = document.getElementById('site-header');
const hero = document.querySelector('.hero');
const stickyBooking = document.querySelector('.sticky-booking');
const plan = document.getElementById('plan');
const closing = document.querySelector('.closing');
function updateScrollState() {
  header?.classList.toggle('has-scrolled', !hero || scrollY > 36);
  if (journey && stops.length) {
    const threshold = innerHeight * 0.48;
    let index = 0;
    stops.forEach((stop, i) => { if (stop.getBoundingClientRect().top <= threshold) index = i; });
    setScene(index);
  }
  if (stickyBooking && hero) {
    const heroPassed = hero.getBoundingClientRect().bottom < 80;
    const planRect = plan?.getBoundingClientRect();
    const planVisible = planRect && planRect.top < innerHeight * .72 && planRect.bottom > innerHeight * .25;
    const nearEnd = closing && closing.getBoundingClientRect().top < innerHeight;
    stickyBooking.classList.toggle('is-visible', Boolean(heroPassed && !planVisible && !nearEnd));
  }
}
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateScrollState(); ticking = false; });
}, { passive: true });
addEventListener('resize', updateScrollState, { passive: true });
updateScrollState();
