/* ==========================================================================
   GLOBAL SOLUTIONS — Navigation
   Menu mobile, lien actif, verrouillage du défilement
   ========================================================================== */
(function () {
  "use strict";

  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-mobile");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        open ? "Fermer le menu" : "Ouvrir le menu"
      );
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);

      // Piège de focus minimal : focus sur le premier lien à l'ouverture
      if (open) {
        var first = menu.querySelector("a, button");
        if (first) first.focus({ preventScroll: true });
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Fermeture à la sélection d'un lien
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    // Fermeture avec la touche Échap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Réinitialisation si l'on repasse en affichage bureau
    var mq = window.matchMedia("(min-width: 1081px)");
    var onChange = function (e) {
      if (e.matches) setOpen(false);
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
    } else if (mq.addListener) {
      mq.addListener(onChange);
    }
  }

  /* Lien actif selon la page courante */
  function initActiveLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    if (path === "" || path === "/") path = "index.html";

    document
      .querySelectorAll(".nav-main a[data-nav], .nav-mobile a[data-nav]")
      .forEach(function (link) {
        var href = link.getAttribute("href");
        if (!href) return;
        var target = href.split("/").pop().split("#")[0] || "index.html";
        if (target === path) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "page");
        }
      });
  }

  function boot() {
    initMobileNav();
    initActiveLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
