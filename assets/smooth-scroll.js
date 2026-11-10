/*
  Eased scrolling on desktop, the way Forma Studio's site scrolls: each wheel tick settles into place
  over about 0.8s instead of jumping. Built on Lenis (assets/lenis.min.js, MIT). Phones and tablets keep
  native scrolling, and anyone with "reduce motion" switched on gets the browser's own scrolling.
  The real window still scrolls, so the pinned hero, header transparency and the theme's scroll code
  work unchanged. Drawers, popovers, the search overlay and the menu panel scroll natively inside.
*/
(function () {
  if (typeof window.Lenis !== 'function') return;

  var desktop = window.matchMedia('(min-width: 1008px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lenis = null;

  function start() {
    if (lenis || !desktop.matches || reduce.matches) return;
    lenis = new window.Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      autoToggle: true,
      autoRaf: true,
      prevent: function (node) {
        return !!(node.closest && node.closest('.Drawer, .Popover, .Modal, .Search, .FoundPanel, [data-scrollable], [data-lenis-prevent]'));
      }
    });
    window.foundLenis = lenis;
  }

  function stop() {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
    window.foundLenis = null;
  }

  function update() {
    if (desktop.matches && !reduce.matches) start(); else stop();
  }

  update();
  desktop.addEventListener('change', update);
  reduce.addEventListener('change', update);
})();
