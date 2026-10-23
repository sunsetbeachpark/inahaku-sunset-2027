'use strict';
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu(returnFocus = false) {
  if (!menuButton || !mobileNav) return;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
  document.body.classList.remove('menu-open');
  if (returnFocus) menuButton.focus();
}
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    document.body.classList.toggle('menu-open', open);
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
    if (event.key === 'Tab' && !mobileNav.hidden) {
      const links = [...mobileNav.querySelectorAll('a')];
      if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); menuButton.focus(); }
      else if (event.shiftKey && document.activeElement === menuButton) { event.preventDefault(); links.at(-1).focus(); }
    }
  });
  matchMedia('(min-width: 961px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
}
const dayTabs = [...document.querySelectorAll('[data-day]')];
function selectDay(id, focus = false) {
  dayTabs.forEach(tab => {
    const selected = tab.dataset.day === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.dataset.day);
    if (panel) panel.hidden = !selected;
    if (selected && focus) tab.focus();
  });
}
dayTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDay(tab.dataset.day));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % dayTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + dayTabs.length) % dayTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = dayTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectDay(dayTabs[next].dataset.day, true); }
  });
});
document.querySelector('[data-next-day]')?.addEventListener('click', () => {
  selectDay('day2', true);
  document.querySelector('.day-tabs').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
});
const reservationDialog = document.getElementById('reservation-dialog');
const sourcesDialog = document.getElementById('sources-dialog');
document.querySelectorAll('[data-reservation]').forEach(button => button.addEventListener('click', () => reservationDialog?.showModal()));
document.querySelectorAll('[data-sources]').forEach(button => button.addEventListener('click', () => sourcesDialog?.showModal()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
const stickyBooking = document.querySelector('.sticky-booking');
const hero = document.querySelector('.hero');
const closing = document.querySelector('.closing');
if (stickyBooking && hero && 'IntersectionObserver' in window) {
  let heroVisible = true, closingVisible = false;
  const update = () => stickyBooking.classList.toggle('is-visible', !heroVisible && !closingVisible);
  new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; update(); }, {threshold: 0}).observe(hero);
  if (closing) new IntersectionObserver(entries => { closingVisible = entries[0].isIntersecting; update(); }, {threshold: 0.15}).observe(closing);
}
const header = document.getElementById('site-header');
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { header?.classList.toggle('has-scrolled', scrollY > 28); ticking = false; });
}, {passive: true});
