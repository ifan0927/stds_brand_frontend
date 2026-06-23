/* ============================================================
   奕德不動產 — header nav (mobile toggle + dropdown)
   ============================================================ */
(function () {
  // ---- apply configurable URLs (Google forms, LINE, FB) ----
  var cfg = window.YIDE_CONFIG || {};
  function applyLinks(sel, url, external) {
    if (!url) return;
    document.querySelectorAll(sel).forEach(function (a) {
      a.href = url;
      if (external) { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }
  applyLinks('[data-yide="form-viewing"]', cfg.FORM_VIEWING, true);
  applyLinks('[data-yide="form-landlord"]', cfg.FORM_LANDLORD, true);
  applyLinks('[data-yide="line"]', cfg.LINE_URL, cfg.LINE_URL && cfg.LINE_URL !== '#');
  applyLinks('[data-yide="fb"]', cfg.FB_URL, cfg.FB_URL && cfg.FB_URL !== '#');

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    // close the mobile panel after tapping a real link
    nav.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // dropdown triggers — click toggles (works on touch + as desktop fallback)
  document.querySelectorAll('.nav-dd-trigger').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var dd = btn.closest('.nav-dd');
      var open = dd.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // close any open dropdown when clicking outside it
  document.addEventListener('click', function (e) {
    if (e.target.closest('.nav-dd')) return;
    document.querySelectorAll('.nav-dd.is-open').forEach(function (dd) {
      dd.classList.remove('is-open');
      var t = dd.querySelector('.nav-dd-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });
})();
