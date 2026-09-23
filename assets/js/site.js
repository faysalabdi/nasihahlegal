/* Nasihah Legal — site scripts: navigation, enquiry form (Web3Forms) */
(function () {
  'use strict';

  /* ----------------------------------------------------------- footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------ navigation */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  var navGroup = document.querySelector('.nav__group');
  var navTrigger = document.querySelector('.nav__trigger');
  var navMenu = document.getElementById('practice-menu');
  var desktop = window.matchMedia('(min-width: 961px)');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    if (!open) setDropdown(false);
  }

  function setDropdown(open) {
    if (!navTrigger || !navMenu) return;
    navTrigger.setAttribute('aria-expanded', String(open));
    navMenu.hidden = !open;
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && !desktop.matches) setMenu(false);
    });
  }

  if (navTrigger && navMenu) {
    setDropdown(false);
    navTrigger.addEventListener('click', function () {
      setDropdown(navTrigger.getAttribute('aria-expanded') !== 'true');
    });
    // Desktop: open on hover, close when the pointer or focus leaves the group.
    navGroup.addEventListener('mouseenter', function () { if (desktop.matches) setDropdown(true); });
    navGroup.addEventListener('mouseleave', function () { if (desktop.matches) setDropdown(false); });
    navGroup.addEventListener('focusout', function (e) {
      if (desktop.matches && !navGroup.contains(e.relatedTarget)) setDropdown(false);
    });
    document.addEventListener('click', function (e) {
      if (desktop.matches && !navGroup.contains(e.target)) setDropdown(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (navMenu && !navMenu.hidden) { setDropdown(false); navTrigger.focus(); return; }
    if (nav && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });

  desktop.addEventListener('change', function () { setMenu(false); setDropdown(false); });

  /* ------------------------------------------------------ reviews carousel */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.reviews__track');
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    var count = root.querySelector('[data-carousel-count]');
    var cards = track.querySelectorAll('.quote');
    if (!cards.length) return;

    // Offset of each card relative to the first, so navigation targets an
    // exact card rather than accumulating scrollBy deltas (which the CSS
    // scroll-snap can swallow).
    function offsets() {
      var base = cards[0].offsetLeft;
      return Array.prototype.map.call(cards, function (c) { return c.offsetLeft - base; });
    }

    function currentIndex() {
      var pos = track.scrollLeft;
      var offs = offsets();
      var best = 0;
      for (var i = 0; i < offs.length; i++) {
        if (Math.abs(offs[i] - pos) < Math.abs(offs[best] - pos)) best = i;
      }
      return best;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft >= max - 8;
      if (count) count.textContent = (currentIndex() + 1) + ' / ' + cards.length;
    }

    function go(dir) {
      var offs = offsets();
      var target = Math.min(Math.max(currentIndex() + dir, 0), cards.length - 1);
      track.scrollBy({ left: offs[target] - track.scrollLeft, behavior: 'smooth' });
    }

    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); });
    window.addEventListener('resize', update);
    update();
  });

  /* ------------------------------------------------- enquiry form handling */
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var areaSelect = form.querySelector('[name="area_of_law"]');
  var status = form.querySelector('.form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var success = document.getElementById('form-success');
  var resetBtn = document.getElementById('form-reset');
  var submitLabel = submitBtn ? submitBtn.innerHTML : '';

  // Pre-select the area of law from ?area=... (links from the practice pages).
  if (areaSelect) {
    var wanted = new URLSearchParams(window.location.search).get('area');
    if (wanted) {
      Array.prototype.forEach.call(areaSelect.options, function (opt) {
        if (opt.value.toLowerCase() === wanted.toLowerCase()) areaSelect.value = opt.value;
      });
    }
  }

  function showError(msg) {
    if (!status) return;
    status.textContent = msg;
    status.classList.add('form-status--error');
    status.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (status) status.hidden = true;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var keyField = form.querySelector('[name="access_key"]');
    var key = keyField ? keyField.value : '';
    if (!key || key === 'YOUR_ACCESS_KEY_HERE') {
      showError('This form isn’t connected yet — please email info@nasihahlegal.com.au or call 0426 988 250.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })
      .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
      .then(function (r) {
        if (r.ok && r.json.success) {
          form.reset();
          form.hidden = true;
          if (success) { success.hidden = false; success.focus(); }
        } else {
          showError((r.json && r.json.message) || 'Something went wrong. Please try again, or email info@nasihahlegal.com.au.');
        }
      })
      .catch(function () {
        showError('We couldn’t send your enquiry. Please check your connection, or call 0426 988 250.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitLabel;
      });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (success) success.hidden = true;
      form.hidden = false;
      var first = form.querySelector('input[name="name"]');
      if (first) first.focus();
    });
  }
})();
