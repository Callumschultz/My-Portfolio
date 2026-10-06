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

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
