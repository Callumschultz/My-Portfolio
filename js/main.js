// Nav, project filter, header banner, typewriter and motion. No dependencies, so it works offline.

(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  var filterButtons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card[data-category]');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      cards.forEach(function (card) {
        card.hidden = filter !== 'all' && card.getAttribute('data-category') !== filter;
      });
    });
  });

  // Header starts tall and see-through, then shrinks into a solid banner once you scroll
  // (or open the mobile menu). The animation itself is CSS transitions on .is-scrolled.
  var header = document.querySelector('.site-header');
  if (header) {
    var updateHeader = function () {
      var menuOpen = nav && nav.classList.contains('is-open');
      header.classList.toggle('is-scrolled', window.scrollY > 24 || menuOpen);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    if (toggle) toggle.addEventListener('click', updateHeader);
  }

  // Typewriter effect on the hero role line (skipped for reduced-motion users).
  var typed = document.querySelector('[data-typewriter]');
  if (typed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var fullText = typed.textContent;
    var shown = 0;
    typed.textContent = '';
    var typeNext = function () {
      typed.textContent = fullText.slice(0, ++shown);
      if (shown < fullText.length) setTimeout(typeNext, 75);
    };
    setTimeout(typeNext, 1300); // starts once the name has risen in
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal: fade/slide elements up as they enter the screen, siblings staggered.
  var REVEAL = [
    '.section .eyebrow', '.section h1', '.section h2', '.prose > p', '.prose > ul', '.btn-row',
    '.project-card', '.filters', '.video-embed', '.link-card', '.chip-list li', '.skill-columns > div h3',
    '.process-grid figure', '.timeline li', '.contact-list li', '.facts > div', '.case-block > h2',
    '.gallery__main', '.gallery__thumb',
    '.portrait', '.poster', '.project-hero .tag', '.project-nav .btn'
  ].join(',');
  var revealEls = reduceMotion || !('IntersectionObserver' in window) ? [] :
    Array.prototype.filter.call(document.querySelectorAll(REVEAL), function (el) {
      return !el.closest('.hero') && !el.closest('.site-header');
    });
  if (revealEls.length) {
    revealEls.forEach(function (el) {
      el.setAttribute('data-reveal', el.matches('.portrait, .poster') ? 'left' : el.matches('.video-embed') ? 'zoom' : '');
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.matches(REVEAL); });
      el.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(el), 6) * 90 + 'ms');
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        observer.unobserve(el);
        // Hand the element back to its normal styles (hover lifts etc.) once it has arrived.
        setTimeout(function () {
          el.removeAttribute('data-reveal');
          el.classList.remove('is-visible');
          el.style.removeProperty('--reveal-delay');
        }, 1600);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // Home hero: content drifts up and fades out as you scroll away from it.
  var heroContent = document.querySelector('.hero__content');
  var heroScroll = document.querySelector('.hero__scroll');
  if (heroContent && !reduceMotion) {
    var ticking = false;
    var updateHero = function () {
      var t = Math.min(1, window.scrollY / (window.innerHeight * 0.75));
      heroContent.style.opacity = String(1 - t);
      heroContent.style.transform = 'translateY(' + (-80 * t) + 'px) scale(' + (1 - 0.06 * t) + ')';
      if (heroScroll) heroScroll.style.opacity = String(Math.max(0, 1 - t * 3));
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateHero); }
    }, { passive: true });
  }

  // Smooth page changes: fade out before following a link to another page on this site.
  if (!reduceMotion) {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target || link.hasAttribute('download')) return;
      var url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !/\.html$/.test(url.pathname)) return;
      if (url.pathname === location.pathname) return; // same-page anchors scroll smoothly instead
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(function () { location.href = url.href; }, 280);
    });
    // Coming back with the browser's Back button can restore the faded-out page; undo that.
    window.addEventListener('pageshow', function () { document.body.classList.remove('is-leaving'); });
  }

  // Screenshot galleries: thumbnails swap the big image; the big image opens a full-screen viewer.
  var swapImage = function (img, src, alt) {
    // Compare against any swap still in flight so fast clicks always end on the last one chosen.
    if ((img.dataset.pending || img.getAttribute('src')) === src) return;
    img.dataset.pending = src;
    img.classList.add('is-swapping');
    setTimeout(function () {
      if (img.dataset.pending !== src) return;
      delete img.dataset.pending;
      img.onload = function () { img.classList.remove('is-swapping'); };
      img.src = src;
      img.alt = alt;
      if (img.complete) img.classList.remove('is-swapping');
    }, reduceMotion ? 0 : 180);
  };

  var lightbox = null;
  var openLightbox = function (shots, start) {
    if (!lightbox) {
      lightbox = document.createElement('dialog');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('aria-label', 'Screenshot viewer');
      lightbox.innerHTML =
        '<img class="lightbox__img" alt="">' +
        '<button class="icon-btn lightbox__btn lightbox__close" type="button" aria-label="Close">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>' +
        '<button class="icon-btn lightbox__btn lightbox__prev" type="button" aria-label="Previous screenshot">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<button class="icon-btn lightbox__btn lightbox__next" type="button" aria-label="Next screenshot">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<span class="lightbox__count" aria-live="polite"></span>';
      document.body.appendChild(lightbox);
      lightbox.querySelector('.lightbox__close').addEventListener('click', function () { lightbox.close(); });
      lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { lightbox.step(-1); });
      lightbox.querySelector('.lightbox__next').addEventListener('click', function () { lightbox.step(1); });
      // Clicking the dark area around the image closes it.
      lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
      lightbox.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') lightbox.step(-1);
        if (e.key === 'ArrowRight') lightbox.step(1);
      });
      // Swipe left/right on touch screens.
      var touchX = null;
      lightbox.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
      lightbox.addEventListener('touchend', function (e) {
        if (touchX === null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) lightbox.step(dx < 0 ? 1 : -1);
        touchX = null;
      });
    }
    var img = lightbox.querySelector('.lightbox__img');
    var count = lightbox.querySelector('.lightbox__count');
    var index = start;
    var show = function () {
      var shot = shots[index];
      swapImage(img, shot.src, shot.alt);
      count.textContent = (index + 1) + ' / ' + shots.length;
    };
    lightbox.step = function (dir) { index = (index + dir + shots.length) % shots.length; show(); };
    var single = shots.length < 2;
    lightbox.querySelector('.lightbox__prev').hidden = single;
    lightbox.querySelector('.lightbox__next').hidden = single;
    img.src = shots[index].src;
    img.alt = shots[index].alt;
    count.textContent = (index + 1) + ' / ' + shots.length;
    lightbox.showModal();
  };

  Array.prototype.forEach.call(document.querySelectorAll('[data-gallery]'), function (gallery) {
    var mainButton = gallery.querySelector('.gallery__main');
    var mainImg = mainButton.querySelector('img');
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('.gallery__thumb'));
    var current = 0;
    var shots = thumbs.map(function (t) {
      var img = t.querySelector('img');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
    });
    thumbs.forEach(function (thumb, i) {
      thumb.setAttribute('aria-label', 'Show screenshot ' + (i + 1));
      thumb.addEventListener('click', function () {
        current = i;
        thumbs.forEach(function (t, j) { t.setAttribute('aria-pressed', String(j === i)); });
        swapImage(mainImg, shots[i].src, shots[i].alt);
      });
    });
    mainButton.addEventListener('click', function () {
      if (typeof HTMLDialogElement === 'function' && shots.length) openLightbox(shots, current);
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
