/*
  Section reveal
  --------------
  Fades homepage content up as it scrolls into view, the way Forma Studio does:
  the big images are already there, only headings, cards and copy rise in.

  - Nothing is hidden until this script has run, so a page without JS looks
    exactly as before.
  - Elements already on screen at load reveal immediately, staggered, so the
    first paint never shows a blank page.
  - Each element reveals once. Siblings (product cards, articles) stagger.
  - Skipped entirely under prefers-reduced-motion.
  - Re-runs for sections the theme editor loads or re-renders.
*/
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var TARGETS = [
    '.SectionHeader',
    '.SectionFooter',
    '.ProductItem',
    '.ArticleItem',
    '.FeatureText__ImageWrapper',
    '.Timeline__Item',
    '.Product__Wrapper',
    '.Collection__Item'
  ].join(',');

  var SKIP = '[data-section-type="header"], [data-section-type="announcement-bar"], [data-section-type="footer"], [data-section-type="hero-search"], [data-section-type="slideshow"]';
  var STAGGER = 70;   // ms between siblings
  var MAX_STAGGER = 6; // cap so a long grid doesn't take forever

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function prepare(root) {
    var sections = (root || document).querySelectorAll('.shopify-section');
    Array.prototype.forEach.call(sections, function (section) {
      if (section.querySelector(SKIP)) return;
      var items = section.querySelectorAll(TARGETS);
      var groups = {};
      Array.prototype.forEach.call(items, function (el) {
        if (el.classList.contains('Reveal')) return;
        // Stagger by position among siblings of the same kind
        var parentKey = el.parentNode;
        var key = parentKey.__revealKey || (parentKey.__revealKey = Math.random());
        groups[key] = (groups[key] || 0) + 1;
        var index = Math.min(groups[key] - 1, MAX_STAGGER);
        el.classList.add('Reveal');
        el.style.setProperty('--reveal-delay', (index * STAGGER) + 'ms');
        observer.observe(el);
      });
    });
    document.documentElement.classList.add('reveal-enabled');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { prepare(); });
  else prepare();

  document.addEventListener('shopify:section:load', function (event) { prepare(event.target); });
})();
