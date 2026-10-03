# Mon Employeur Public — Design System

> **Intégration dans le code (Nuxt)**
> - Tokens : `app/assets/css/tokens.css` ; palettes Tailwind `encre`, `vermillon`, `papier` et rôles Nuxt UI dans `app/assets/css/main.css`.
> - Thème des primitives Nuxt UI (Button, Badge, Card, Avatar, Input, Breadcrumb, Skeleton, Empty) : `app/app.config.ts`.
> - Composants de marque : `app/components/mep/` (Header, Footer, Logo, PageHero, SectionHeader, ContentSection, CallToAction, StatCard, ArticleCard, BenefitItem).
> - Logos : `public/brand/`. Polices chargées par `@nuxt/fonts`.
> - La couleur primaire reste surchargeable par le branding d'une collectivité (`useCollectiviteBranding`).
> - `OffreCard` n'est pas repris : le site ne doit pas afficher d'offres d'emploi (voir le one-pager).


**Mon Employeur Public** est le média et la boîte à outils gratuite des équipes recrutement et RH du secteur public. Le site recense plus de 35 000 collectivités territoriales (communes, intercommunalités, départements, régions, centres de gestion, syndicats mixtes) avec, pour chacune, une page marque employeur : chiffres clés, avantages, compétences, offres d'emploi, informations pratiques. Les recruteurs peuvent « réclamer » leur page pour la personnaliser.

Le langage visuel reprend les **codes d'un site public sérieux** (sobriété, angles francs, bleu institutionnel, hiérarchie claire, liens soulignés, accessibilité) **sans reprendre l'UI kit de l'État** : pas de Marianne, pas de bloc-marque, pas de bleu France / rouge Marianne, pas de composants DSFR. **Le site n'est pas affilié à l'État** — chaque page porte un bandeau d'indépendance dans l'en-tête et une mention dans le pied de page.

## Sources
- Code : dépôt GitHub **https://github.com/jules-desc/wink-public** (illisible via l'intégration GitHub au moment de la création — vide ou branche introuvable) ; lu depuis le dossier local `wink-public/` joint. Application Nuxt 4 + Nuxt UI 4 + Tailwind 4, nommée « Wink Pages » dans le code, propulsée par Wink (wink-lab.com). Fichiers clés : `app/pages/index.vue`, `app/pages/etablissement/[slug].vue`, `app/pages/departement/[code].vue`, `app/components/collectivite/*`, `app/components/listing/CollectiviteCard.vue`, `app/components/search/SearchBar.vue`, `app/utils/format.ts`. Explorez ce dépôt pour affiner les designs.
- Inspirations (codes, pas copie) : https://francechat.org/ · https://www.systeme-de-design.gouv.fr/version-courante/fr · https://www.elysee.fr/toutes-les-actualites
- Le code source n'a pas d'identité visuelle propre (thème Nuxt UI par défaut : `primary: blue`, `neutral: slate`, Inter). Les fondations ci-dessous sont **nouvelles** ; la structure des écrans, les composants métier et les textes viennent du code.

## Index
- `styles.css` — point d'entrée (imports uniquement) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `guidelines/` — 18 cartes de fondations (Colors, Type, Spacing, Brand)
- `components/` — primitives React (voir liste)
- `ui_kits/site/` — recréation cliquable du site (Accueil, Annuaire, Collectivité, Actualités)
- `assets/favicon.ico` — seul asset fourni par la source
- `thumbnail.html`, `SKILL.md`, `github.md`

## Components
- **core/** — Icon, Button, Badge, Avatar, Separator
- **forms/** — Input, SearchBar
- **navigation/** — Header (+ Wordmark), Footer, Breadcrumb, Pagination
- **content/** — Card, PageHero, SectionHeader, CallToAction, EmptyState, Skeleton, StatCard, ArticleCard
- **collectivite/** — CollectiviteCard, OffreCard, BenefitItem, InfoList

Correspondance source (Nuxt UI → ici) : UButton→Button, UBadge→Badge, UAvatar→Avatar, UIcon→Icon, USeparator→Separator, UInput/SearchBar→Input/SearchBar, UHeader→Header, UFooter→Footer, UBreadcrumb→Breadcrumb, UPagination→Pagination, UCard→Card, UPageHero→PageHero, UPageSection title→SectionHeader, UPageCTA/ClaimCTA→CallToAction, UEmpty→EmptyState, USkeleton→Skeleton, ChiffresCles→StatCard, CollectiviteCard, OffresEmploi→OffreCard, Benefits→BenefitItem, InfosPratiques→InfoList.

### Intentional additions
- **ArticleCard** — la marque est aussi un *média* ; le code ne contient pas encore d'articles. Nécessaire pour les pages actualités.
- **Wordmark** (dans Header) — version typographique de secours ; préférer `assets/logo.svg`.
- **Bandeau d'indépendance** (Header `disclaimer`) — pour lever toute ambiguïté avec un site officiel.

## CONTENT FUNDAMENTALS
- **Langue** : français, registre institutionnel mais accessible. Phrases complètes, informatives, sans jargon marketing ni superlatifs.
- **Adresse** : vouvoiement systématique, impératif poli pour les actions : « Trouvez votre collectivité », « Réclamez votre page », « Consultez les postes ouverts ». Le site parle de lui à la 3ᵉ personne ou pas du tout (pas de « nous » promotionnel).
- **Casse** : casse de phrase partout (titres, boutons, badges) : « Parcourir par région », « Voir l'offre ». Les capitales sont réservées aux surtitres (kickers) en petite taille.
- **Vocabulaire métier exact** : collectivité territoriale, fonction publique territoriale, intercommunalité / EPCI, titulaire / contractuel, catégorie A / B / C, marque employeur, agents, effectifs.
- **Chiffres** : format fr-FR — espace des milliers, virgule décimale, unité après : « 522 250 habitants », « 1,2 Mrd € », « 2 100 - 2 600 €/mois », « 58 % ».
- **Dates** : relatives pour la fraîcheur (« Aujourd'hui », « Hier », « Il y a 3 jours »), absolues pour les échéances (« Limite : 15/10/2026 ») et les articles (« 2 octobre 2026 »).
- **Typographie française** : guillemets « … » avec espaces, apostrophe typographique ’ à terme, écriture inclusive au point médian dans les intitulés de poste (« Chargé·e de recrutement »).
- **États vides** : factuels et neutres — « Aucune offre d'emploi en cours », « Contenu en cours de génération », « Aucun résultat pour « … » ».
- **Emoji** : jamais.
- Exemples tirés du code : « Les collectivités territoriales qui recrutent » · « Plus de 35 000 collectivités territoriales référencées : communes, intercommunalités, départements et régions. » · « Vous gérez le recrutement d'une collectivité ? »

## VISUAL FOUNDATIONS
- **Couleurs** : *bleu encre* `--blue-800 #1D2B6B` pour les actions, liens et titres de marque ; `--blue-950` pour les surfaces profondes (bandeau, pied de page). *Vermillon* `--red-700 #A8321C` en accent éditorial rare : filet de section, surtitres, filet haut du footer. Neutres *papier* légèrement chauds (`--grey-25…900`). Sémantiques sobres (vert, orange, carmin, bleu info) toujours en paire fond pâle / texte foncé. Aucun dégradé. Pas de drapeau tricolore.
- **Typographie** : **Public Sans** (texte, UI, titres d'interface, poids 400–800) ; **Source Serif 4** pour les titres éditoriaux du média (articles, une) ; JetBrains Mono pour les codes INSEE/SIRET. Titres serrés (`-0.015em` à `-0.02em`), corps 16/26, chapô 20/32.
- **Signature** : en-tête de section = filet vermillon 48×4 px + surtitre capitales vermillon + titre. C'est le motif récurrent.
- **Espacement** : base 4/8 (`--space-1…11`), sections de 72 px vertical, conteneur 1200 px, gouttière 24 px. Pages denses mais aérées.
- **Fonds** : blanc par défaut ; alternance de sections en `--surface-alt` (papier) délimitées par des bordures 1 px ; hero clair papier ou bleu encre plein. Pas de textures, motifs ni illustrations dessinées.
- **Imagerie** : photos réelles des collectivités (bannières, galeries), en couleur naturelle, recadrage `cover` ; logos/blasons jamais recadrés (`contain` sur blanc). En l'absence d'image : placeholder gris papier avec icône.
- **Angles** : francs. Rayon 0 pour boutons, champs, cartes ; 2 px pour badges ; cercle uniquement pour personnes.
- **Bordures** : 1 px `--grey-200` comme structure principale ; 2 px / ombre interne pour sélection et focus ; nav active soulignée 3 px bleu.
- **Cartes** : fond blanc, bordure 1 px, pas d'ombre au repos, pas de bordure latérale colorée. Survol : bordure bleu encre + `--shadow-sm`.
- **Ombres** : quasi absentes. `--shadow-sm` (survol), `--shadow-md` (élément flottant), `--shadow-overlay` (menus, autocomplétion).
- **Survol** : boutons pleins s'assombrissent (blue-800→900) ; boutons contour prennent un fond bleu 50 ; liens passent de 1 à 2 px de soulignement ; titres d'articles se soulignent ; images d'articles zoom 1.03.
- **Appui** : un cran plus foncé (blue-950 / blue-100), pas de rétrécissement.
- **Focus** : outline 2 px `--blue-600`, décalage 2 px, toujours visible au clavier.
- **Animation** : minimale — transitions 120–200 ms `cubic-bezier(.2,0,0,1)` sur couleur/ombre ; skeleton pulsé. Pas de rebonds ni d'entrées animées.
- **Transparence / flou** : uniquement le CTA mobile collant (fond blanc 95 % + flou) issu du code. Sinon aucun.
- **Mise en page** : en-tête non collant (bandeau + marque + nav), fil d'Ariane sous l'en-tête sur toutes les pages internes, colonne latérale collante « Informations pratiques » sur la page collectivité, CTA collant en bas sur mobile.

## ICONOGRAPHY
- **Lucide** (trait 2 px, coins arrondis, 20–24 px) — c'est le jeu du code source (`@iconify-json/lucide`, `i-lucide-*`). Chargé par CDN `lucide-static@0.460.0` et rendu en masque CSS via le composant `Icon`, qui hérite de la couleur du texte.
- **Simple Icons** pour les réseaux sociaux uniquement (`@iconify-json/simple-icons` dans le code) — `Icon set="brand"`.
- Icônes clés : `landmark` (collectivité sans logo), `map-pin`, `briefcase`, `users`, `banknote`, `clock`, `calendar`, `alarm-clock`, `laptop`, `coins`, `award`, `external-link`, `arrow-right`, `search`, `badge-check`, `hand` (réclamer). Les avantages se voient attribuer une icône automatiquement (`benefitIcon`).
- Couleur : bleu encre pour les icônes informatives, gris discret dans les métadonnées. Jamais d'emoji, jamais de caractères Unicode utilisés comme icônes (sauf `›` interdit : utiliser `chevron-right`).
- **Logo V1** (fourni par l'équipe) : `assets/logo.svg` (bleu marine, signature « — UNE INITIATIVE WINK — »), `assets/logo-inverse.svg` (sur bleu encre), `assets/logo-wordmark.svg` (titre seul), `assets/wink-logo.svg` / `wink-logo-inverse.svg` (logo Wink officiel, #162275, intégré dans la signature). Vectorisé à partir du PNG fourni : texte converti en tracés avec DM Serif Display (titre) et Public Sans 500 (« UNE INITIATIVE ») — polices de substitution, à remplacer par l'original si disponible. `assets/favicon.ico` = favicon Nuxt par défaut.

## Polices
Public Sans, Source Serif 4 et JetBrains Mono sont chargées depuis Google Fonts (`tokens/fonts.css`). Aucun fichier de police n'était fourni ; Marianne (police de l'État) est volontairement exclue.
