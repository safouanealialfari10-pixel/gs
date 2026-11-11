/* ==========================================================================
   GLOBAL SOLUTIONS — Script principal
   Apparitions au défilement, en-tête, parallaxe, retour en haut, images
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ------------------------------------------------------------------ */
  /* 1. Apparition au défilement (IntersectionObserver)                  */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var targets = document.querySelectorAll(
      "[data-reveal], .section-sep"
    );
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. En-tête : état solide après défilement + barre de progression    */
  /* ------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var progress = document.querySelector(".scroll-progress");
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle("is-solid", y > 40);

      if (progress) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        progress.style.transform =
          "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------------------ */
  /* 3. Parallaxe légère du hero                                        */
  /* ------------------------------------------------------------------ */
  function initParallax() {
    var media = document.querySelector(".hero-media");
    if (!media || prefersReducedMotion) return;

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var y = window.scrollY || window.pageYOffset;
            if (y < window.innerHeight * 1.2) {
              media.style.transform =
                "translate3d(0," + Math.round(y * 0.22) + "px,0)";
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------ */
  /* 4. Hero : animation d'entrée à l'ouverture                          */
  /* ------------------------------------------------------------------ */
  function initHeroEntrance() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        hero.classList.add("is-ready");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Retour en haut de page                                          */
  /* ------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle(
          "is-visible",
          (window.scrollY || window.pageYOffset) > 600
        );
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 6. Chargement progressif des images (fondu à l'arrivée)             */
  /* ------------------------------------------------------------------ */
  function initImages() {
    document.querySelectorAll("img[data-fade]").forEach(function (img) {
      function done() {
        img.classList.add("is-loaded");
      }
      if (img.complete && img.naturalWidth > 0) {
        done();
      } else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener(
          "error",
          function () {
            img.classList.add("is-loaded");
          },
          { once: true }
        );
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 7. Année courante dans les mentions de pied de page                 */
  /* ------------------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. Délai progressif des entrées du menu mobile (élégance)           */
  /* ------------------------------------------------------------------ */
  function initMobileMenuStagger() {
    document.querySelectorAll(".nav-mobile a").forEach(function (link, i) {
      link.style.setProperty("--i", String(i));
    });
  }

  /* ------------------------------------------------------------------ */
  /* 9. Ancres internes : décalage sous l'en-tête fixe                   */
  /* ------------------------------------------------------------------ */
  function initAnchorOffset() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        var target = id && document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var header = document.querySelector(".site-header");
        var offset = header ? header.offsetHeight + 12 : 0;
        var top =
          target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
        history.replaceState(null, "", id);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Démarrage                                                          */
  /* ------------------------------------------------------------------ */
  function boot() {
    initReveal();
    initHeader();
    initParallax();
    initHeroEntrance();
    initBackToTop();
    initImages();
    initYear();
    initMobileMenuStagger();
    initAnchorOffset();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
