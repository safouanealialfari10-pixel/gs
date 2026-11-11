/* ==========================================================================
   GLOBAL SOLUTIONS — Formulaire de contact
   Validation côté navigateur, anti-spam (honeypot + délai), envoi vers
   Supabase (table contact_messages) avec repli honnête en cas d'échec.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var cfg = window.GS_CONFIG || {};
  var statusBox = form.querySelector("[data-form-status]");
  var submitBtn = form.querySelector("[data-form-submit]");
  var startTime = Date.now();

  /* ------------------------------------------------------------------ */
  /* 0. Pré-sélection du domaine depuis l'URL                            */
  /*    (liens « Demander un renseignement » de la page expertises)       */
  /* ------------------------------------------------------------------ */
  (function preselectDomain() {
    try {
      var params = new URLSearchParams(window.location.search);
      var domaine = params.get("domaine");
      if (!domaine) return;
      var select = form.querySelector('select[name="domain"]');
      if (!select) return;
      Array.prototype.forEach.call(select.options, function (opt) {
        if (opt.value === domaine) opt.selected = true;
      });
    } catch (err) {
      /* URLSearchParams indisponible : sans conséquence */
    }
  })();

  /* ------------------------------------------------------------------ */
  /* 1. Validation                                                      */
  /* ------------------------------------------------------------------ */
  var rules = {
    fullname: function (v) {
      if (!v.trim()) return "Merci d'indiquer votre nom et prénom.";
      if (v.trim().length < 2) return "Le nom doit contenir au moins 2 caractères.";
      if (v.trim().length > 120) return "Le nom est trop long.";
      return "";
    },
    email: function (v) {
      if (!v.trim()) return "Merci d'indiquer votre adresse e-mail.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.trim()))
        return "Cette adresse e-mail ne semble pas valide.";
      return "";
    },
    phone: function (v) {
      if (!v.trim()) return ""; // facultatif
      if (!/^[+()\d\s.\-/]{6,25}$/.test(v.trim()))
        return "Ce numéro de téléphone ne semble pas valide.";
      return "";
    },
    organization: function () {
      return "";
    },
    domain: function (v) {
      if (!v) return "Merci de sélectionner un domaine de projet.";
      return "";
    },
    subject: function (v) {
      if (!v.trim()) return "Merci d'indiquer l'objet de votre demande.";
      if (v.trim().length < 2) return "L'objet est trop court.";
      return "";
    },
    message: function (v) {
      if (!v.trim()) return "Merci de décrire votre besoin.";
      if (v.trim().length < 10)
        return "Merci de décrire votre besoin (10 caractères minimum).";
      if (v.trim().length > 5000) return "Le message est trop long.";
      return "";
    },
  };

  function fieldWrap(input) {
    return input.closest(".form-field");
  }

  function showError(input, msg) {
    var wrap = fieldWrap(input);
    if (!wrap) return;
    var err = wrap.querySelector(".field-error");
    wrap.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
    if (err) {
      err.innerHTML =
        '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-5.25a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0v-1.5zM10 6.75a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75z" clip-rule="evenodd"/></svg><span>' +
        msg +
        "</span>";
    }
  }

  function clearError(input) {
    var wrap = fieldWrap(input);
    if (!wrap) return;
    wrap.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
    var err = wrap.querySelector(".field-error");
    if (err) err.innerHTML = "";
  }

  function validateField(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var msg = rule(input.value);
    if (msg) {
      showError(input, msg);
      return false;
    }
    clearError(input);
    return true;
  }

  function validateForm() {
    var firstInvalid = null;
    var ok = true;
    form.querySelectorAll("input[name], select[name], textarea[name]").forEach(
      function (input) {
        if (input.name === "website") return; // honeypot
        if (!validateField(input)) {
          ok = false;
          if (!firstInvalid) firstInvalid = input;
        }
      }
    );
    if (firstInvalid) firstInvalid.focus();
    return ok;
  }

  // Validation à la volée après une première tentative
  var touched = false;
  form.querySelectorAll("input[name], select[name], textarea[name]").forEach(
    function (input) {
      input.addEventListener("blur", function () {
        if (touched) validateField(input);
      });
      input.addEventListener("input", function () {
        if (touched && fieldWrap(input) && fieldWrap(input).classList.contains("has-error")) {
          validateField(input);
        }
      });
    }
  );

  /* ------------------------------------------------------------------ */
  /* 2. Messages d'état                                                 */
  /* ------------------------------------------------------------------ */
  function setStatus(type, html) {
    if (!statusBox) return;
    statusBox.className = "form-status form-status--" + type + " is-visible";
    var icon =
      type === "success"
        ? '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.53-9.72a.75.75 0 00-1.06-1.06L9 10.69 7.53 9.22a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z" clip-rule="evenodd"/></svg>'
        : type === "error"
        ? '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>'
        : '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.25v3.5a.75.75 0 001.5 0V11a.75.75 0 00-.75-.75H9z" clip-rule="evenodd"/></svg>';
    statusBox.innerHTML = icon + "<div>" + html + "</div>";
    statusBox.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function clearStatus() {
    if (!statusBox) return;
    statusBox.className = "form-status";
    statusBox.innerHTML = "";
  }

  /* ------------------------------------------------------------------ */
  /* 3. Envoi (Supabase REST) + repli mailto honnête                    */
  /* ------------------------------------------------------------------ */
  function mailtoFallback(data) {
    var subject = encodeURIComponent("[Site WEB] " + data.subject);
    var body = encodeURIComponent(
      "Nom : " +
        data.full_name +
        "\nE-mail : " +
        data.email +
        "\nTéléphone : " +
        (data.phone || "—") +
        "\nOrganisation : " +
        (data.organization || "—") +
        "\nDomaine du projet : " +
        (data.project_domain || "—") +
        "\n\nObjet : " +
        data.subject +
        "\n\n" +
        data.message
    );
    return (
      "mailto:" +
      (cfg.email || "info@globalsolutions.one") +
      "?subject=" +
      subject +
      "&body=" +
      body
    );
  }

  function collect() {
    var fd = new FormData(form);
    return {
      full_name: (fd.get("fullname") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().trim() || null,
      organization: (fd.get("organization") || "").toString().trim() || null,
      project_domain: (fd.get("domain") || "").toString().trim() || null,
      subject: (fd.get("subject") || "").toString().trim(),
      message: (fd.get("message") || "").toString().trim(),
      locale: cfg.locale || "fr",
      source: "site-web",
    };
  }

  async function submit(data) {
    if (!cfg.contactEndpoint || !cfg.supabaseAnonKey) {
      return { ok: false, reason: "unconfigured" };
    }
    try {
      var res = await fetch(cfg.contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: cfg.supabaseAnonKey,
          Authorization: "Bearer " + cfg.supabaseAnonKey,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) return { ok: true };
      return { ok: false, reason: "http_" + res.status };
    } catch (err) {
      return { ok: false, reason: "network" };
    }
  }

  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.classList.toggle("is-loading", on);
    submitBtn.disabled = on;
    submitBtn.setAttribute("aria-busy", on ? "true" : "false");
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    touched = true;
    clearStatus();

    // Anti-spam : honeypot rempli → on simule un succès silencieux
    if (form.website && form.website.value) {
      setStatus("success", "Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.");
      form.reset();
      return;
    }

    // Anti-spam : soumission trop rapide (< 2,5 s)
    if (Date.now() - startTime < 2500) {
      setStatus(
        "error",
        "Merci de prendre quelques secondes pour vérifier votre message avant de l'envoyer."
      );
      return;
    }

    if (!validateForm()) {
      setStatus(
        "error",
        "Le formulaire contient des erreurs. Merci de corriger les champs signalés ci-dessus."
      );
      return;
    }

    var data = collect();
    setLoading(true);
    var result = await submit(data);
    setLoading(false);

    if (result.ok) {
      setStatus(
        "success",
        "<strong>Votre message a bien été transmis.</strong><br>Notre équipe reviendra vers vous dans les meilleurs délais. Vous pouvez également nous joindre directement par téléphone ou par WhatsApp."
      );
      form.reset();
      touched = false;
      startTime = Date.now();
      return;
    }

    // Repli honnête : aucun backend opérationnel → ne pas simuler l'envoi
    var fallback = mailtoFallback(data);
    setStatus(
      "error",
      "<strong>L'envoi automatique est momentanément indisponible.</strong><br>" +
        "Votre message n'a pas été transmis. Vous pouvez :" +
        '<ul style="margin:0.65rem 0 0 1.1rem; list-style:disc;">' +
        '<li><a href="' + fallback + '">envoyer votre demande via votre messagerie</a> ;</li>' +
        "<li>nous appeler au " +
        (cfg.phonePrimary || "+227 99 54 83 49") +
        " ;</li>" +
        "<li>nous écrire directement à " +
        '<a href="mailto:' + (cfg.email || "info@globalsolutions.one") + '">' +
        (cfg.email || "info@globalsolutions.one") +
        "</a>.</li></ul>"
    );
  });
})();
