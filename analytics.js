'use strict';
(() => {
  const measurementId = 'G-YG9EW6W762';
  const optOutKey = 'inahaku-sunset-2027-analytics-opt-out';
  let optedOut = false;
  try { optedOut = localStorage.getItem(optOutKey) === 'true'; } catch (_) {}
  window['ga-disable-' + measurementId] = optedOut;

  document.querySelectorAll('[data-analytics-toggle]').forEach(button => {
    button.textContent = optedOut ? 'アクセス解析を再開する' : 'アクセス解析を停止する';
    const status = document.getElementById('analytics-status');
    if (status) status.textContent = optedOut ? 'このブラウザではアクセス解析を停止しています。' : '';
    button.addEventListener('click', () => {
      try {
        localStorage.setItem(optOutKey, String(!optedOut));
        window['ga-disable-' + measurementId] = !optedOut;
        location.reload();
      } catch (_) {
        if (status) status.textContent = '設定を保存できませんでした。ブラウザの保存設定をご確認いただくか、下記のGoogle提供の無効化ツールをご利用ください。';
      }
    });
  });

  // Limit collection to the two published event pages, excluding local previews.
  const basePath = '/inahaku-sunset-2027/';
  if (location.hostname !== 'sunsetbeachpark.github.io' ||
      ![basePath, basePath + 'index.html', basePath + 'stay-guide.html'].includes(location.pathname) || optedOut) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_prefix: 'inahaku2027',
    cookie_path: basePath,
    cookie_domain: location.hostname
  });
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(tag);

  // A reservation-link click is not a completed booking or payment.
  document.addEventListener('click', event => {
    if (event.defaultPrevented || window['ga-disable-' + measurementId]) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== 'https://livepocket.jp' || destination.pathname.replace(/\/$/, '') !== '/e/h3ws6') return;
    window.gtag('event', 'reservation_click', {
      link_url: 'https://livepocket.jp/e/h3ws6',
      page_type: location.pathname.endsWith('stay-guide.html') ? 'stay_guide' : 'landing_page',
      send_to: measurementId
    });
  });
})();
