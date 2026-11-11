# GLOBAL SOLUTIONS — Site institutionnel

Site web premium, multipage et responsive de **GLOBAL SOLUTIONS SARL**,
entreprise nigérienne spécialisée dans le **BTP, l'hydraulique, le génie civil
et les infrastructures** (Niamey, Niger — depuis 2017).

Technologies : **HTML5 sémantique, CSS3 moderne (Flexbox & Grid), JavaScript ES6+** —
sans framework ni dépendance de build. Le site fonctionne tel quel, même hors ligne
(les polices Google Fonts et la carte OpenStreetMap sont les seules ressources externes).

---

## 1. Structure du projet

```
/global-solutions
│
├── index.html              # Page d'accueil
├── a-propos.html           # Histoire, vision, mission, valeurs, organisation
├── expertises.html         # Les 9 domaines d'expertise
├── realisations.html       # Portfolio filtrable (emplacements à compléter)
├── equipe.html             # Présentation de la direction et de l'équipe
├── actualites.html         # Espace actualités (emplacements à compléter)
├── contact.html            # Coordonnées, formulaire, carte
├── 404.html                # Page d'erreur personnalisée
│
├── /assets
│   ├── /images             # Photographies (voir §6 « Images »)
│   ├── /icons              # Icônes (SVG en ligne dans le HTML)
│   ├── /fonts              # Polices auto-hébergées (optionnel, voir §5)
│   └── /logos              # logo.svg, logo-white.svg, favicon.svg
│
├── /css
│   ├── style.css           # Design system & composants
│   ├── responsive.css      # Adaptation mobile → grands écrans
│   └── animations.css      # Animations & micro-interactions
│
├── /js
│   ├── main.js             # Apparitions, en-tête, parallaxe, retour en haut
│   ├── navigation.js       # Menu mobile, lien actif
│   ├── gallery.js          # Filtres des réalisations + lightbox
│   ├── contact.js          # Validation, anti-spam, envoi du formulaire
│   └── config.js           # Configuration (Supabase, coordonnées)
│
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 2. Installation et prévisualisation

Aucune installation n'est nécessaire : c'est un site statique.

```bash
# Option 1 — serveur local (recommandé)
python3 -m http.server 8080
# puis ouvrir http://localhost:8080

# Option 2 — avec Node.js
npx serve .
```

---

## 3. Formulaire de contact (backend Supabase)

Le formulaire est **réellement fonctionnel** : il envoie les demandes vers la table
`contact_messages` d'un projet Supabase provisionné pour le site.

| Élément | Valeur |
|---|---|
| Projet Supabase | `anghdmgwvekxhtsgpbgn` (région `eu-west-1`) |
| Table | `public.contact_messages` |
| Endpoint | `https://anghdmgwvekxhtsgpbgn.supabase.co/rest/v1/contact_messages` |
| Clé exposée | clé publique « anon » uniquement (voir §7 Sécurité) |

Comportement du formulaire (`js/contact.js`) :

1. **Validation** côté navigateur (messages d'erreur en français, champ par champ).
2. **Anti-spam** : champ honeypot invisible + délai minimal de 2,5 s avant envoi.
3. **Envoi** vers Supabase (REST), état de chargement sur le bouton.
4. **Repli honnête** : si l'envoi échoue (réseau, configuration), le message
   d'erreur le précise et propose l'envoi par e-mail (lien `mailto:` pré-rempli),
   par téléphone ou WhatsApp. **L'envoi n'est jamais simulé.**

Consulter les messages reçus : tableau de bord Supabase → Table Editor →
`contact_messages` (ou `psql` / l'API avec une clé autorisée).

### Pré-sélection du domaine

Les boutons « Demander un renseignement » de `expertises.html` transmettent le
domaine dans l'URL (`contact.html?domaine=...#formulaire`) : le champ
« Domaine du projet » est alors pré-rempli automatiquement.

---

## 4. Architecture « espace administrateur » (évolution prévue)

Le schéma de base de données prépare déjà l'administration future des contenus,
**sans modifier le code du site** :

| Table | Rôle | Politique RLS |
|---|---|---|
| `contact_messages` | Messages du formulaire | Insert public, **lecture jamais accordée à anon** |
| `realisations` | Projets du portfolio | Lecture des seules fiches `published = true` |
| `actualites` | Articles d'actualité | Lecture des seuls articles `published = true` |

Pour faire évoluer le site vers une version pilotée par la base :

1. Renseigner les tables `realisations` / `actualites` (colonnes : `slug`, `title`,
   `category`, `description`, `location`, `year`, `cover_url`, `gallery_urls`, …).
2. Brancher `js/gallery.js` sur l'endpoint REST (`/rest/v1/realisations?published=eq.true`)
   pour remplacer les emplacements statiques.
3. Créer l'espace admin (auth Supabase + rôle service côté serveur uniquement).

Le site reste pleinement fonctionnel **sans backend** : les contenus peuvent aussi
être édités directement dans les fichiers HTML (voir §5).

---

## 5. Modifier les contenus

- **Textes** : chaque page est un HTML autonome ; rechercher le texte dans le
  fichier correspondant et l'éditer (éditeur de code ou bloc-notes).
- **Coordonnées** : mettre à jour `js/config.js` **et** les blocs header/footer
  (rechercher `99 54 83 49`).
- **Domaines d'expertise** : `expertises.html` (une section `<article>` par domaine).
- **Menu** : bloc `<header>` dupliqué dans chaque page (les liens portent `data-nav`).
- **Polices** : actuellement via Google Fonts (`<link>` dans chaque `<head>`).
  Pour un site 100 % autonome, télécharger Manrope et Inter (licence OFL) dans
  `assets/fonts/` et remplacer les liens par des `@font-face` dans `css/style.css`.

---

## 6. Images — statut important

Les photographies d'illustration (`assets/images/`) sont des **illustrations
provisoires générées pour la maquette**. Elles illustrent les domaines d'activité
et sont **clairement séparées des réalisations** de l'entreprise :

- `realisations.html` ne présente **aucune image** comme une réalisation exécutée :
  les fiches sont des emplacements identifiés « À compléter ».
- `equipe.html` n'utilise **aucun faux portrait** : des monogrammes élégants et la
  mention « Portrait à fournir » occupent la place des photographies officielles.
- `assets/images/about.jpg` et `assets/images/cta.jpg` sont des **variantes
  provisoires** (recadrages) faute de génération dédiée ; remplacez-les par des
  photos professionnelles (équipe, vue aérienne) dès qu'elles sont disponibles.

Pour remplacer une image : déposer le fichier au même nom dans `assets/images/`
(format `.jpg`, largeur recommandée ≥ 1600 px), ou modifier le `src` correspondant.
Pensez à mettre à jour les attributs `alt` (accessibilité + SEO).

---

## 7. Sécurité

- **Aucune clé secrète** n'est présente dans le JavaScript public : seule la clé
  publique « anon » Supabase est exposée, comme dans toute architecture Supabase.
  Sa sécurité repose sur les politiques **RLS** : `contact_messages` est en
  `INSERT` uniquement pour le public — impossible de lire, modifier ou supprimer
  les messages depuis le navigateur.
- **Ne jamais** ajouter une clé `service_role` dans `js/config.js` ou ailleurs
  côté client.
- Anti-spam formulaire : honeypot + délai minimal (voir §3).
- Recommandations production : **HTTPS** obligatoire (la plupart des hébergeurs
  le fournissent), en-têtes HTTP (CSP, HSTS, X-Content-Type-Options) à activer
  côté hébergeur/CDN.
- Champs contraints en base (`CHECK` sur longueurs et formats e-mail).

---

## 8. Performance

- Aucun framework : HTML/CSS/JS légers uniquement.
- Images `loading="lazy"` + fondu à l'arrivée (`data-fade`), préchargement du hero
  (`fetchpriority="high"`).
- Animations GPU-friendly (`transform`/`opacity`), `prefers-reduced-motion` respecté.
- Polices : `preconnect` + `display=swap`.
- Optimisation recommandée à la mise en ligne : convertir les JPEG en **WebP/AVIF**
  (avec `<picture>` de repli) et servir les images via un CDN.

---

## 9. SEO

- Titres et meta descriptions **uniques** par page, balises Open Graph + Twitter Card.
- Données structurées Schema.org : `Organization`, `WebSite`, `BreadcrumbList`,
  `AboutPage`, `ContactPage`, `ItemList` (expertises).
- `sitemap.xml` + `robots.txt` (adapter l'URL `https://globalsolutions.one` au
  domaine final avant mise en ligne).
- Fil d'Ariane visible sur toutes les pages internes, `alt` sur toutes les images,
  hiérarchie H1/H2/H3 cohérente, maillage interne (menu, pied de page, cartes).
- `actualites.html` est en **`noindex`** tant qu'aucune actualité réelle n'est
  publiée : retirer cette balise `<meta name="robots">` lors de la première
  publication et ajouter la page au `sitemap.xml`.
- **Version anglaise future** : structure prévue (`/en/` + balises `hreflang`),
  chaque page étant déjà isolée et traduisible indépendamment.

---

## 10. Mise en ligne

1. Choisir un hébergeur statique (Netlify, Vercel, GitHub Pages, ou hébergement
   mutualisé : déposer les fichiers à la racine du `public_html`).
2. Brancher le domaine **globalsolutions.one** (ou votre domaine) et activer HTTPS.
3. Mettre à jour les URLs canoniques (`<link rel="canonical">`, `og:url`,
   `sitemap.xml`, `robots.txt`, `js/config.js` → `siteUrl`).
4. Configurer le serveur pour servir `404.html` en cas d'URL inconnue
   (Netlify/Vercel : automatiquement ; Apache : `ErrorDocument 404 /404.html`).
5. Vérifier le formulaire de contact (une demande test) et l'arrivée dans
   Supabase → `contact_messages`.
6. **Confirmer le numéro WhatsApp** : le bouton flottant utilise `wa.me/22799548349`.
   Si le numéro officiel WhatsApp est différent, modifier `js/config.js`
   (`whatsappNumber`) ainsi que les liens `wa.me/...` des pages.

---

## 11. Accessibilité

- Lien d'évitement (`skip-link`), navigation au clavier complète, `aria-*` adaptés,
  focus visible contrasté, `aria-live` sur les statuts du formulaire,
  respect de `prefers-reduced-motion`.

---

© GLOBAL SOLUTIONS SARL — RCCM : RCCM-NI-NIA-2017-B-003 — NIF : 40242/R —
BP 12052, Niamey, Niger.
