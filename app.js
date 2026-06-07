/* ISALGO site interactions: theme, themed images, scroll reveal, sticky nav */
(function () {
  "use strict";

  const root = document.documentElement;
  const STORAGE_KEY = "isalgo-theme";

  /* ---- theme ---- */
  function preferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function swapThemedImages(theme) {
    document.querySelectorAll("img.theme-img").forEach(function (img) {
      const next = theme === "dark" ? img.dataset.dark : img.dataset.light;
      if (next && img.getAttribute("src") !== next) img.setAttribute("src", next);
    });
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    swapThemedImages(theme);
  }

  applyTheme(preferredTheme());

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  /* ---- sticky nav shadow ---- */
  const nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- staggered scroll reveal ---- */
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el) {
    if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay);
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        // stagger siblings within the same container for a wave effect
        const el = e.target;
        if (!el.dataset.delay) {
          const siblings = Array.prototype.slice.call(el.parentElement.children)
            .filter(function (n) { return n.classList.contains("reveal"); });
          el.style.setProperty("--d", Math.min(siblings.indexOf(el), 5));
        }
        el.classList.add("in-view");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }
})();
