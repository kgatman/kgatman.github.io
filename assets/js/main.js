/* ============================================================
   Makhate Makhate — Portfolio behavior
   Vanilla JS, no dependencies. Progressive enhancement:
   the site works fully without it, this just adds polish.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (dark / light) ---------- */
  var THEME_KEY = "mm-theme";
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");

  // Respect saved choice, else fall back to the OS preference.
  var saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    root.setAttribute("data-theme", saved);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    // Close the menu after clicking a link
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // No IO support — show everything.
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Active nav link based on section in view ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = navMenu ? navMenu.querySelectorAll('a[href^="#"]') : [];
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Contact form (AJAX to Formspree) ----------
     Only intercepts if a real Formspree ID is configured.
     Otherwise the form submits normally / is a no-op. */
  var form = document.querySelector(".contact-form");
  if (form) {
    var note = form.querySelector(".form-note");
    var action = form.getAttribute("action") || "";
    var configured = action.indexOf("{{FORMSPREE_ID}}") === -1 && action.indexOf("formspree.io") !== -1;

    form.addEventListener("submit", function (e) {
      if (!configured) {
        // Not wired up yet — guide the owner instead of failing silently.
        e.preventDefault();
        if (note) note.textContent = "Form not configured yet — set your Formspree ID in index.html.";
        return;
      }
      e.preventDefault();
      var data = new FormData(form);
      if (note) note.textContent = "Sending…";
      fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (note) note.textContent = "Thanks! I'll get back to you soon.";
          } else {
            if (note) note.textContent = "Something went wrong — email me directly instead.";
          }
        })
        .catch(function () {
          if (note) note.textContent = "Network error — email me directly instead.";
        });
    });
  }
})();
