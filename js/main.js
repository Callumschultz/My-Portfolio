// Mobile nav toggle + project grid filter. No dependencies, so it works offline.

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
    setTimeout(typeNext, 500);
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
