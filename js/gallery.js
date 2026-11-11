/* ==========================================================================
   GLOBAL SOLUTIONS — Galerie & visualisation agrandie (lightbox)
   Filtres des réalisations + lightbox accessible
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* 1. Filtres de la galerie des réalisations                           */
  /* ------------------------------------------------------------------ */
  function initFilters() {
    var bar = document.querySelector("[data-filter-bar]");
    var grid = document.querySelector("[data-project-grid]");
    if (!bar || !grid) return;

    var buttons = bar.querySelectorAll(".filter-btn");
    var cards = grid.querySelectorAll("[data-category]");
    var empty = document.querySelector("[data-filter-empty]");
    var status = document.querySelector("[data-filter-status]");

    function apply(filter) {
      var visible = 0;
      cards.forEach(function (card) {
        var match =
          filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !match);
        if (match) visible++;
      });

      if (empty) empty.hidden = visible !== 0;
      if (status) {
        status.textContent =
          visible + " emplacement" + (visible > 1 ? "s" : "") + " affiché" + (visible > 1 ? "s" : "") + ".";
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        apply(btn.getAttribute("data-filter") || "all");
      });
    });

    apply("all");
  }

  /* ------------------------------------------------------------------ */
  /* 2. Lightbox accessible (images agrandies + fiches projet)           */
  /* ------------------------------------------------------------------ */
  var lightbox = null;

  function ensureLightbox() {
    if (lightbox) return lightbox;

    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Visualisation agrandie");
    lightbox.hidden = true;
    lightbox.innerHTML =
      '<div class="lightbox-backdrop" data-lightbox-close></div>' +
      '<div class="lightbox-panel">' +
      '<button type="button" class="lightbox-close" data-lightbox-close aria-label="Fermer la visualisation">&times;</button>' +
      '<div class="lightbox-body" data-lightbox-body></div>' +
      '<div class="lightbox-caption" data-lightbox-caption></div>' +
      "</div>";
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-lightbox-close")) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
    });

    return lightbox;
  }

  var lastFocused = null;

  function openLightbox(bodyHTML, captionHTML) {
    var lb = ensureLightbox();
    lastFocused = document.activeElement;
    lb.querySelector("[data-lightbox-body]").innerHTML = bodyHTML;
    lb.querySelector("[data-lightbox-caption]").innerHTML = captionHTML || "";
    lb.hidden = false;
    document.body.classList.add("nav-open");
    lb.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("nav-open");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* Clic sur une carte projet : ouverture de la fiche agrandie */
  function initProjectCards() {
    document.querySelectorAll("[data-project-open]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var card = trigger.closest(".project-card");
        if (!card) return;

        var title = card.getAttribute("data-title") || "Projet";
        var body =
          '<div class="lightbox-project">' +
          '<div class="lightbox-project-icon">' +
          (card.querySelector(".pm-icon")
            ? card.querySelector(".pm-icon").innerHTML
            : "") +
          "</div>" +
          "<h3>" + title + "</h3>" +
          (card.getAttribute("data-desc")
            ? "<p>" + card.getAttribute("data-desc") + "</p>"
            : "") +
          '<dl class="lightbox-project-meta">' +
          metaRow("Localisation", card.getAttribute("data-location")) +
          metaRow("Domaine", card.getAttribute("data-domain")) +
          metaRow("Année", card.getAttribute("data-year")) +
          "</dl>" +
          '<p class="lightbox-note">Emplacement réservé : photographies et informations définitives à fournir par GLOBAL SOLUTIONS.</p>' +
          "</div>";

        openLightbox(body, title);
      });
    });
  }

  function metaRow(label, value) {
    var isTodo = !value || value === "À compléter";
    return (
      "<div><dt>" +
      label +
      "</dt><dd" +
      (isTodo ? ' class="to-complete"' : "") +
      ">" +
      (value || "À compléter") +
      "</dd></div>"
    );
  }

  /* Clic sur une image simple (galerie d'illustrations) */
  function initImageLightbox() {
    document.querySelectorAll("[data-lightbox-src]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        var src = trigger.getAttribute("data-lightbox-src");
        var caption = trigger.getAttribute("data-lightbox-caption") || "";
        if (!src) return;
        openLightbox(
          '<img class="lightbox-img" src="' +
            src +
            '" alt="' +
            (caption ? caption.replace(/"/g, "&quot;") : "Image agrandie") +
            '">',
          caption
        );
      });
    });
  }

  function boot() {
    initFilters();
    initProjectCards();
    initImageLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
