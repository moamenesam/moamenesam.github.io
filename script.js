(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  // Project filter
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-on'); c.setAttribute('aria-selected', 'false'); });
      chip.classList.add('is-on'); chip.setAttribute('aria-selected', 'true');
      var f = chip.dataset.filter;
      document.querySelectorAll('.proj').forEach(function (p) {
        p.classList.toggle('hide', f !== 'all' && p.dataset.cat !== f);
      });
    });
  });

  // Count up the headline numbers when they scroll into view
  function count(el) {
    var end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '', dec = parseInt(el.dataset.dec || '0', 10);
    var fmt = function (n) { return (el.dataset.format === 'int' ? Math.round(n).toLocaleString('en-US') : n.toFixed(dec)) + suffix; };
    if (reduce) return;
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min((t - t0) / 1100, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(end * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var kp = document.querySelector('.kpis');
  if (kp && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); kp.querySelectorAll('[data-count]').forEach(count); }
    }, { threshold: 0.4 });
    io.observe(kp);
  }
})();
