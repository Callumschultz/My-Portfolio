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

  // Home page: header sits transparent over the hero until you scroll or open the menu.
  var header = document.querySelector('.site-header');
  if (header && document.querySelector('.hero')) {
    var updateHeader = function () {
      var menuOpen = nav && nav.classList.contains('is-open');
      header.classList.toggle('is-transparent', window.scrollY < 40 && !menuOpen);
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
