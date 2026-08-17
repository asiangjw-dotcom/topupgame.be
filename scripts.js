/* ============================================================================
   Topupgame â€” script.js
   Interaksi: nav mobile, FAQ accordion, reveal-on-scroll, tilt 3D, tahun footer
   ============================================================================ */
(function () {
  "use strict";

  /* ---------- Tahun footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav mobile ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.hidden = false;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      faqItems.forEach(function (other) {
        other.classList.remove("open");
        var otherBtn = other.querySelector(".faq-q");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Tilt 3D pada card ---------- */
  var tiltEls = document.querySelectorAll("[data-tilt]");
  var isFinePointer = window.matchMedia("(pointer: fine)").matches;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isFinePointer && !reducedMotion) {
    tiltEls.forEach(function (el) {
      var rect;
      el.addEventListener("mouseenter", function () {
        rect = el.getBoundingClientRect();
      });
      el.addEventListener("mousemove", function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform =
          "perspective(700px) rotateX(" + (-y * 8).toFixed(2) + "deg) rotateY(" +
          (x * 8).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* ---------- Parallax ringan pada visual hero (bolt) ---------- */
  var boltStage = document.getElementById("bolt-stage");
  var boltTilt = document.getElementById("bolt-tilt");
  if (boltStage && boltTilt && isFinePointer && !reducedMotion) {
    boltStage.addEventListener("mousemove", function (e) {
      var rect = boltStage.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      boltTilt.style.transform =
        "rotateY(" + (x * 26).toFixed(2) + "deg) rotateX(" + (-y * 20).toFixed(2) + "deg)";
    });
    boltStage.addEventListener("mouseleave", function () {
      boltTilt.style.transform = "";
    });
  }

  /* ---------- Smooth-scroll offset untuk header sticky ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = document.querySelector(".site-header");
      var offset = headerH ? headerH.offsetHeight + 12 : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
