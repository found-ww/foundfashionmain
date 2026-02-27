/**
 * FoundFashion — Immersive Homepage Enhancements
 * Scroll fade-ins, staggered grid animations, and hero parallax
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. SCROLL FADE-IN — Intersection Observer
     Watches for elements entering the viewport and reveals them
     ---------------------------------------------------------- */

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  function initFadeIns() {

    // Section headers — fade up
    document.querySelectorAll('.SectionHeader').forEach(function (el) {
      // Skip headers inside the hero slideshow
      if (el.closest('[data-section-type="slideshow"]')) return;
      el.classList.add('ff-fade-in');
      fadeObserver.observe(el);
    });

    // Product grid items — staggered fade up (4 per row on desktop)
    document.querySelectorAll('.ProductItem').forEach(function (el, i) {
      el.classList.add('ff-fade-in');
      var delay = 'ff-delay-' + ((i % 4) + 1);
      el.classList.add(delay);
      fadeObserver.observe(el);
    });

    // Text-with-image — content fades from left, image from right
    document.querySelectorAll('.FeatureText__Content').forEach(function (el) {
      el.classList.add('ff-fade-left');
      fadeObserver.observe(el);
    });

    document.querySelectorAll('.FeatureText__ImageWrapper').forEach(function (el) {
      el.classList.add('ff-fade-right');
      fadeObserver.observe(el);
    });

    // Blog article cards — staggered fade up
    document.querySelectorAll('.ArticleItem').forEach(function (el, i) {
      el.classList.add('ff-fade-in');
      el.classList.add('ff-delay-' + Math.min(i + 1, 4));
      fadeObserver.observe(el);
    });

    // Timeline items
    document.querySelectorAll('.Timeline__Nav').forEach(function (el) {
      el.classList.add('ff-fade-in');
      fadeObserver.observe(el);
    });

  }


  /* ----------------------------------------------------------
     2. HERO PARALLAX — Scroll-driven depth on slideshow images
     Only runs on hover-capable (non-touch) devices
     ---------------------------------------------------------- */

  function initParallax() {
    // Skip on touch devices — parallax causes janky scroll
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var slideshow = document.querySelector('[data-section-type="slideshow"]');
    if (!slideshow) return;

    var images = slideshow.querySelectorAll('.Slideshow__Image');
    if (!images.length) return;

    var sectionHeight = slideshow.offsetHeight;
    var ticking = false;

    function applyParallax() {
      var scrollY = window.scrollY;

      // Stop updating once the slideshow is fully scrolled past
      if (scrollY > sectionHeight) {
        ticking = false;
        return;
      }

      // 25% parallax factor — subtle depth without feeling broken
      var offset = scrollY * 0.25;

      images.forEach(function (img) {
        img.style.transform = 'translateY(' + offset + 'px)';
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });
  }


  /* ----------------------------------------------------------
     Boot — wait for DOM to be ready
     ---------------------------------------------------------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initFadeIns();
      initParallax();
    });
  } else {
    initFadeIns();
    initParallax();
  }

})();
