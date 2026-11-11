/* ==========================================================================
   GLOBAL SOLUTIONS — Configuration
   --------------------------------------------------------------------------
   ⚠  RÈGLES DE SÉCURITÉ
   • La clé ci-dessous est la clé « publishable / anon » Supabase : c'est un
     identifiant PUBLIC conçu pour être exposé côté navigateur. Sa protection
     repose sur les politiques RLS (voir README.md) : lecture interdite,
     insertion seule pour la table contact_messages.
   • Ne jamais placer une clé « secret / service_role » dans ce fichier.
   ========================================================================== */

window.GS_CONFIG = {
  // Base du site (utilisée pour les métadonnées et liens absolus si besoin)
  siteUrl: "https://globalsolutions.one",
  locale: "fr",

  // Point d'envoi du formulaire de contact (Supabase — table contact_messages)
  contactEndpoint: "https://anghdmgwvekxhtsgpbgn.supabase.co/rest/v1/contact_messages",
  // Clé publique « anon » (protégée par les politiques RLS : INSERT uniquement)
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZ2hkbWd3dmVreGh0c2dwYmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0MjA5MjUsImV4cCI6MjEwOTk5NjkyNX0.W5zFphHn6eKb3Foob6Smg8q9XaMN2UC99wCD4FvYxRo",

  // Coordonnées officielles
  phonePrimary: "+227 99 54 83 49",
  phonePrimaryHref: "tel:+22799548349",
  phoneSecondary: "+227 98 33 61 91",
  phoneSecondaryHref: "tel:+22798336191",
  email: "info@globalsolutions.one",
  // Numéro WhatsApp (format international sans « + ») — à confirmer par l'entreprise
  whatsappNumber: "22799548349",
};
