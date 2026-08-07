/**
 * FreshBasket — Premium JavaScript Engine v2.0
 * Cinematic animations, scroll-driven reveals, parallax,
 * floating leaves, dark mode, RTL, cart drawer
 */

(function () {
  'use strict';

  // ─── Utils ────────────────────────────────────────────────────────────
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const off = (el, ev, fn) => el && el.removeEventListener(ev, fn);

  let scrollY = 0;
  let ticking = false;

  // ─── Scroll state ─────────────────────────────────────────────────────
  function onScroll() {
    scrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(tick);
      ticking = true;
    }
  }

  function tick() {
    handleNavbar();
    handleParallax();
    handleScrollReveals();
    handleFarmStory();
    handleScrollTop();
    ticking = false;
  }

  on(window, 'scroll', onScroll, { passive: true });

  // ─── Navbar ───────────────────────────────────────────────────────────
  const navbar = $('.navbar');

  function handleNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', scrollY > 60);
  }

  // ─── Dark Mode ────────────────────────────────────────────────────────
  const modeBtns = $$('.mode-toggle-btn');
  const savedTheme = localStorage.getItem('fb_theme');

  function applyTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    modeBtns.forEach(btn => btn.textContent = dark ? '☀️' : '🌙');
  }

  applyTheme(savedTheme === 'dark');

  modeBtns.forEach(btn => on(btn, 'click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('fb_theme', isDark ? 'dark' : 'light');
    modeBtns.forEach(b => b.textContent = isDark ? '☀️' : '🌙');
  }));

  // ─── RTL ──────────────────────────────────────────────────────────────
  const rtlBtns = $$('.rtl-toggle-btn');
  const savedRtl = localStorage.getItem('fb_rtl') === 'true';

  function applyRtl(rtl) {
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    rtlBtns.forEach(btn => btn.textContent = rtl ? 'LTR' : 'RTL');
  }

  applyRtl(savedRtl);

  rtlBtns.forEach(btn => on(btn, 'click', () => {
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    applyRtl(!isRtl);
    localStorage.setItem('fb_rtl', !isRtl);
  }));

  // ─── Mobile Nav ───────────────────────────────────────────────────────
  const mobileBtn = $('.mobile-menu-btn');
  const navMenu = $('.nav-menu');

  on(mobileBtn, 'click', (e) => {
    e.stopPropagation();
    const open = navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-open', open);
    mobileBtn.textContent = open ? '✕' : '☰';
  });

  // Close on outside click
  on(document, 'click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        mobileBtn.textContent = '☰';
      }
    }
  });

  // ─── Scroll Reveal System ─────────────────────────────────────────────
  function handleScrollReveals() {
    const vhTrigger = window.innerHeight * 0.88;
    $$('.reveal, .reveal-left, .reveal-right').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vhTrigger) {
        el.classList.add('visible');
      }
    });
  }

  // Trigger on load too
  on(document, 'DOMContentLoaded', handleScrollReveals);
  setTimeout(handleScrollReveals, 200);

  // ─── Floating Leaves Generator ────────────────────────────────────────
  function createLeaves() {
    $$('.leaves-layer').forEach(layer => {
      const count = parseInt(layer.dataset.count || '10');
      for (let i = 0; i < count; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf-particle';
        const size = 18 + Math.random() * 20;
        leaf.style.cssText = `
          left: ${Math.random() * 100}%;
          width: ${size}px;
          height: ${size}px;
          animation-duration: ${12 + Math.random() * 14}s;
          animation-delay: ${Math.random() * 10}s;
          opacity: 0;
          transform-origin: center;
        `;
        layer.appendChild(leaf);
      }
    });
  }

  createLeaves();

  // ─── Floating Leaves Container (inner pages) ──────────────────────────
  function createFloatingLeaves() {
    const containers = $$('.floating-leaves-container');
    containers.forEach(container => {
      for (let i = 0; i < 8; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf-particle';
        const size = 16 + Math.random() * 18;
        leaf.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}%;
          top: 0;
          width: ${size}px;
          height: ${size}px;
          animation-duration: ${14 + Math.random() * 12}s;
          animation-delay: ${Math.random() * 12}s;
          opacity: 0;
          pointer-events: none;
          z-index: 0;
        `;
        container.appendChild(leaf);
      }
    });
  }
  createFloatingLeaves();

  // ─── Scroll-to-Top Button ─────────────────────────────────────────────
  let scrollTopBtn = null;

  function handleScrollTop() {
    if (!scrollTopBtn) scrollTopBtn = document.getElementById('scroll-top-btn');
    if (!scrollTopBtn) return;
    if (scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('#scroll-top-btn')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // ─── Parallax on hero bg ──────────────────────────────────────────────
  const heroBg = $('.hero-bg');

  function handleParallax() {
    if (heroBg && scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.08)`;
    }

    // CTA section parallax
    const ctaBg = $('.cta-bg');
    if (ctaBg) {
      const rect = ctaBg.parentElement.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.12;
      ctaBg.style.transform = `scale(1.08) translateY(${offset}px)`;
    }
  }

  // ─── Farm Story Sticky Panels ─────────────────────────────────────────
  const farmPanels = $$('.farm-panel');
  const farmImgPanels = $$('.farm-img-panel');

  function handleFarmStory() {
    if (!farmPanels.length || !farmImgPanels.length) return;

    farmPanels.forEach((panel, i) => {
      const rect = panel.getBoundingClientRect();
      const center = window.innerHeight / 2;
      if (rect.top < center && rect.bottom > center) {
        farmImgPanels.forEach(img => img.classList.remove('active'));
        if (farmImgPanels[i]) farmImgPanels[i].classList.add('active');
      }
    });
  }

  // ─── Cart Drawer ──────────────────────────────────────────────────────
  const cartDrawer = $('#cart-drawer');
  const cartBackdrop = $('#cart-backdrop');
  const cartToggleBtn = $('#cart-toggle');
  const cartCloseBtn = $('#cart-close');

  function openCart() { cartDrawer?.classList.add('active'); cartBackdrop?.classList.add('active'); }
  function closeCart() { cartDrawer?.classList.remove('active'); cartBackdrop?.classList.remove('active'); }

  on(cartToggleBtn, 'click', (e) => { e.preventDefault(); openCart(); });
  on(cartCloseBtn, 'click', closeCart);
  on(cartBackdrop, 'click', closeCart);

  // ─── Product Filters (Shop page) ──────────────────────────────────────
  $$('.filter-btn').forEach(btn => {
    on(btn, 'click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;

      $$('[data-category]').forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.transition = 'opacity 0.4s, transform 0.4s';
        if (match) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.display = 'block';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => { card.style.display = 'none'; }, 400);
        }
      });
    });
  });

  // ─── FAQ Accordion ────────────────────────────────────────────────────
  $$('.faq-header').forEach(header => {
    on(header, 'click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      $$('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  // ─── Seasonal Tabs ────────────────────────────────────────────────────
  window.showSeason = function (id, btn) {
    $$('.season-panel').forEach(p => p.classList.remove('active'));
    $$('.season-btn').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById(id);
    if (panel) { panel.classList.add('active'); }
    if (btn) { btn.classList.add('active'); }
  };

  // ─── Product Detail Tabs ──────────────────────────────────────────────
  window.switchTab = function (e, id) {
    $$('.tab-content').forEach(t => t.classList.remove('active'));
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    e.currentTarget?.classList.add('active');
  };

  // ─── Product Image Gallery (Details page) ─────────────────────────────
  window.changeImage = function (url, thumbEl) {
    const mainImg = $('#main-prod-img');
    if (!mainImg) return;

    // Crossfade effect
    mainImg.style.opacity = '0';
    mainImg.style.transform = 'scale(1.03)';
    setTimeout(() => {
      mainImg.src = url;
      mainImg.style.transition = 'opacity 0.4s ease, transform 0.5s ease';
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 200);

    $$('.thumb-img').forEach(t => t.classList.remove('active'));
    thumbEl?.classList.add('active');
  };

  // ─── Gallery Lightbox ─────────────────────────────────────────────────
  function initLightbox() {
    const links = $$('.gallery-item-link');
    if (!links.length) return;

    const box = document.createElement('div');
    box.id = 'lightbox';
    box.innerHTML = `
      <button id="lb-close" aria-label="Close lightbox">&times;</button>
      <button id="lb-prev" aria-label="Previous">&#8249;</button>
      <button id="lb-next" aria-label="Next">&#8250;</button>
      <div id="lb-img-wrap"><img id="lb-img" src="" alt="Gallery image"></div>
    `;
    document.body.appendChild(box);

    const style = document.createElement('style');
    style.textContent = `
      #lightbox {
        display: none; position: fixed; inset: 0;
        background: rgba(10,14,8,.96); backdrop-filter: blur(8px);
        z-index: 9999; align-items: center; justify-content: center;
      }
      #lightbox.open { display: flex; }
      #lb-img-wrap { max-width: 90vw; max-height: 85vh; border-radius: 16px; overflow: hidden; }
      #lb-img { width: auto; max-width: 90vw; max-height: 85vh; object-fit: contain; display: block; border-radius: 16px; }
      #lb-close { position: absolute; top: 24px; right: 32px; font-size: 44px; font-weight: 200; color: rgba(255,255,255,.7); background: transparent; border: none; cursor: pointer; line-height: 1; transition: color 0.2s; }
      #lb-close:hover { color: #fff; }
      #lb-prev, #lb-next { position: absolute; top: 50%; transform: translateY(-50%); font-size: 56px; font-weight: 200; color: rgba(255,255,255,.7); background: transparent; border: none; cursor: pointer; transition: color 0.2s; }
      #lb-prev { left: 32px; } #lb-next { right: 32px; }
      #lb-prev:hover, #lb-next:hover { color: #fff; }
    `;
    document.head.appendChild(style);

    let currentIdx = 0;
    const urls = links.map(l => l.getAttribute('href'));

    function open(idx) {
      currentIdx = idx;
      box.classList.add('open');
      document.getElementById('lb-img').src = urls[idx];
    }

    links.forEach((link, i) => {
      on(link, 'click', (e) => { e.preventDefault(); open(i); });
    });

    on(document.getElementById('lb-close'), 'click', () => box.classList.remove('open'));
    on(document.getElementById('lb-prev'), 'click', () => open((currentIdx - 1 + urls.length) % urls.length));
    on(document.getElementById('lb-next'), 'click', () => open((currentIdx + 1) % urls.length));
    on(box, 'click', (e) => { if (e.target === box) box.classList.remove('open'); });

    on(document, 'keydown', (e) => {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') box.classList.remove('open');
      if (e.key === 'ArrowLeft') open((currentIdx - 1 + urls.length) % urls.length);
      if (e.key === 'ArrowRight') open((currentIdx + 1) % urls.length);
    });
  }

  // ─── Countdown Timer (Coming Soon) ───────────────────────────────────
  function initCountdown() {
    const daysEl = $('#days');
    const hoursEl = $('#hours');
    const minsEl = $('#minutes');
    const secsEl = $('#seconds');
    if (!secsEl) return;

    let totalSecs = (parseInt(daysEl?.textContent || 24) * 86400)
      + (parseInt(hoursEl?.textContent || 8) * 3600)
      + (parseInt(minsEl?.textContent || 45) * 60)
      + parseInt(secsEl.textContent || 12);

    setInterval(() => {
      if (totalSecs <= 0) return;
      totalSecs--;
      const d = Math.floor(totalSecs / 86400);
      const h = Math.floor((totalSecs % 86400) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
  }

  // ─── Page transition fade ─────────────────────────────────────────────
  function initPageTransitions() {
    // Detect if current page is home-2.html
    const isHome2 = window.location.pathname.endsWith('home-2.html');

    // Using the exact durations requested for the hero section background animation
    const heroZoomDuration = isHome2 ? '6s' : '5s';

    const style = document.createElement('style');
    style.textContent = `
      body { animation: pageFadeIn 0.5s ease both; }
      @keyframes pageFadeIn { 0% { opacity:0; transform: translateY(8px); } 100% { opacity:1; transform: none; } }
      .hero-bg { animation-duration: ${heroZoomDuration} !important; }
    `;
    document.head.appendChild(style);

    // Remove animation from body after it completes so position:fixed works again!
    setTimeout(() => {
      document.body.style.animation = 'none';
    }, 600);

    $$('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
      on(a, 'click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(-8px)';
        document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(() => { window.location.href = href; }, 300);
      });
    });
  }

  // ─── Init ──────────────────────────────────────────────────────────────
  on(document, 'DOMContentLoaded', () => {
    handleNavbar();
    handleScrollReveals();
    initLightbox();
    initCountdown();
    initPageTransitions();

    // Activate first farm panel immediately
    if (farmImgPanels.length) farmImgPanels[0].classList.add('active');
  });

})();
