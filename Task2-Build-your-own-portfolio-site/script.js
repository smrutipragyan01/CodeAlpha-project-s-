// Basic progressive reveal on scroll and small UI behaviors.
// Place this in scripts.js and include it at the end of body.

(function () {
  'use strict';

  // reveal elements with .fade-up when they enter the viewport
  function reveal() {
    document.querySelectorAll('.fade-up').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var viewH = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewH - 40) {
        el.classList.add('show');
      }
    });
  }

  // smooth scroll for internal anchor links
  function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        // allow plain '#' to behave normally
        if (href && href.length > 1) {
          e.preventDefault();
          var dest = document.querySelector(href);
          if (dest) dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // demo contact form handler: replace with Formspree / Netlify or your API
  function wireContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var msg = document.getElementById('formMsg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (msg) msg.textContent = 'Sending...';
      // DEMO: simulate sending
      setTimeout(function () {
        if (msg) msg.textContent = 'Thanks — your message has been received (demo).';
        form.reset();
      }, 900);
    });
  }

  // small responsive nav — toggles (very simple)
  function wireMenuToggle() {
    var btn = document.querySelector('.menu-btn');
    var nav = document.querySelector('nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = expanded ? 'none' : 'flex';
    });
  }

  // set current year in footer
  function setYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // initialize on load
  window.addEventListener('load', function () {
    reveal();
    enableSmoothScroll();
    wireContactForm();
    wireMenuToggle();
    setYear();
  });

  // reveal on scroll
  window.addEventListener('scroll', reveal);
})();
