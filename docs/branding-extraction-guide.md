# Guide d'extraction de charte graphique — Collectivités territoriales

## Objectif

Extraire la charte graphique d'une collectivité depuis son site web pour personnaliser sa page Wink Pages. Le process combine une collecte manuelle rapide (3-5 min) + un LLM qui structure le tout en JSON importable.

---

## Étape 1 — Captures (2 min)

Ouvre le site web de la collectivité dans Chrome/Firefox et collecte :

### Screenshots (3 obligatoires)

1. **Page d'accueil** — pleine largeur, au-dessus de la ligne de flottaison
2. **Page intérieure** — une page "actualités", "services" ou "nous rejoindre"
3. **Footer** — scroll tout en bas de la page d'accueil

> Astuce : utilise l'outil de capture intégré du navigateur (Cmd+Shift+S sur Firefox, ou extension GoFullPage sur Chrome pour capturer la page entière).

### Code source du `<head>` (obligatoire)

1. Va sur la page d'accueil du site
2. Clic droit > **Afficher le code source** (ou Cmd+U / Ctrl+U)
3. Copie tout ce qui est entre `<head>` et `</head>`

---

## Étape 2 — Micro-inspections DevTools (1 min)

Ouvre l'inspecteur du navigateur (F12 ou Cmd+Option+I) et relève ces 3 éléments :

### Logo

1. Clic droit sur le **logo dans le header** > **Inspecter**
2. Dans le panneau Elements, repère la balise `<img>` ou `<svg>`
3. Si `<img>` : clic droit sur la balise > **Copy > Copy element** (ou note l'attribut `src`)
4. Si le logo est en SVG inline ou en `background-image` : clic droit sur le logo visible > **Copier l'adresse de l'image** (si disponible)

> Si tu ne trouves pas l'URL, ce n'est pas bloquant — décris juste ce que tu vois et on récupérera le fichier autrement.

### Typographie

1. Clic droit sur un **titre (H1 ou H2)** de la page > **Inspecter**
2. Dans l'onglet **Computed** (ou "Calculé"), cherche `font-family` et copie la valeur
3. Fais pareil sur un **paragraphe de texte** (`<p>`)

Exemple de résultat :
```
Titre H1 : font-family: "Barlow", sans-serif
Paragraphe : font-family: "Open Sans", sans-serif
```

---

## Étape 3 — Prompt LLM (2 min)

Ouvre [claude.ai](https://claude.ai) (ou un autre LLM avec vision). Copie-colle le prompt ci-dessous, attache tes 3 screenshots, et remplis les zones entre crochets.

```
Tu es un expert en design et identité visuelle. Tu vas extraire la charte graphique complète d'une collectivité territoriale française à partir des éléments que je te fournis.

Collectivité : [NOM DE LA COLLECTIVITÉ]
Site web : [URL DU SITE]

Je te fournis :
1. Des screenshots du site (voir pièces jointes) : page d'accueil, une page intérieure, et le footer
2. Le code source du <head> ci-dessous
3. Les font-family relevées dans l'inspecteur

<head>
[COLLER ICI LE CONTENU DU <HEAD>]
</head>

Font-family relevées :
- Titre (H1/H2) : [COLLER ICI ou "non relevé"]
- Paragraphe (body) : [COLLER ICI ou "non relevé"]

URL du logo (si trouvée) : [URL ou "non trouvée"]

À partir des screenshots, du code source et des valeurs inspectées, extrais la charte graphique complète.

COULEURS : utilise ta vision pour identifier les couleurs dominantes dans les screenshots. Croise avec les meta tags (theme-color), les variables CSS si présentes dans le head, et les styles inline. Pour chaque couleur, donne le hex le plus précis possible. Distingue les couleurs permanentes de la charte des couleurs événementielles ou saisonnières (campagne de com, bandeau d'alerte, etc.).

TYPOGRAPHIE : utilise en priorité les font-family que je t'ai fournies depuis l'inspecteur. Sinon cherche dans le head les imports Google Fonts, les @font-face, ou les link vers des fichiers woff2/woff. En dernier recours, identifie visuellement depuis les screenshots. Si la police est commerciale (payante), propose une alternative libre visuellement proche.

LOGOS : utilise en priorité l'URL que je t'ai fournie. Sinon cherche dans le head les balises og:image, apple-touch-icon, icon, shortcut icon.

ATTENTION : les polices Lexend Deca, HubSpot Sans, HubSpot Serif et Source Code Pro présentes dans le head avec l'attribut data-hubspot-fonts sont injectées par une extension navigateur. Ignore-les.

Vérifie le contraste WCAG AA (4.5:1) de chaque couleur sur fond blanc. Si une couleur ne passe pas, signale-le et propose un ajustement minimal.

Retourne UNIQUEMENT ce JSON :

{"collectivite":"","siteWeb":"","colors":{"primary":{"hex":"#...","usage":"description courte","source":"screenshot|meta|css|inspector"},"secondary":{"hex":"#... ou null","usage":"...","source":"..."},"accent":{"hex":"#... ou null","usage":"...","source":"..."},"background":"#... ou null","text":"#... ou null","extra":[{"hex":"#...","name":"nom libre","usage":"...","isCharte":true}]},"logos":{"main":{"url":"url ou null","description":"ce qu'on voit sur le screenshot","format":"svg/png/jpg/inconnu","hasTransparentBackground":true},"icon":{"url":"url depuis le head ou null","description":""},"blason":{"url":"url ou null","description":""}},"typography":{"heading":{"family":"nom exact","weight":"bold/semibold/...","source":"inspector|google-fonts|custom|visual-match","certainty":"exact|probable|guess","isCommercial":false,"libreFallback":"alternative libre ou null"},"body":{"family":"...","weight":"...","source":"...","certainty":"...","isCommercial":false,"libreFallback":"... ou null"}},"visuals":{"borderRadius":"none|small|medium|large","buttonStyle":"description courte","patterns":"description ou null","photoStyle":"institutionnel|lifestyle|aérien|illustration|mixte"},"ambiance":"2 phrases : positionnement + feeling visuel","confidence":{"colors":"high/medium/low","typography":"high/medium/low","logos":"high/medium/low","overall":"high/medium/low"},"wcagCheck":{"primaryOnWhite":{"ratio":"X.X:1","passAA":true},"secondaryOnWhite":{"ratio":"X.X:1","passAA":true}},"notes":"ce qui est incertain ou à vérifier"}

Règles strictes :
- Précise toujours la source de chaque valeur : inspector (DevTools), screenshot (vision), meta (balise HTML), css (style extrait), visual-match (estimation visuelle)
- Ne fabrique pas de valeurs, si tu ne trouves pas mets null et explique dans notes
- Distingue certitude et estimation via certainty sur les fonts et source sur les couleurs
- Marque isCharte: false sur les couleurs événementielles/temporaires dans extra
- Sois concis, ce JSON sera importé dans une base de données
```

---

## Étape 4 — Vérification rapide (1 min)

Avant d'importer le JSON, vérifie rapidement :

- [ ] **`confidence.overall`** est `high` ou `medium` (si `low`, refaire avec de meilleures captures)
- [ ] **`colors.primary.hex`** correspond visuellement à ce que tu vois sur le site
- [ ] **Les fonts** ont `certainty: exact` (sinon, retourne inspecter le H1/paragraphe)
- [ ] **Le logo URL** fonctionne (ouvre-la dans un navigateur)
- [ ] **Les notes** ne signalent pas de problème bloquant

---

## Checklist résumée

```
[ ] 3 screenshots (accueil, page intérieure, footer)
[ ] Code source du <head>
[ ] Font-family du H1 (inspecteur > Computed)
[ ] Font-family d'un paragraphe (inspecteur > Computed)
[ ] URL du logo (inspecteur ou clic droit)
[ ] Prompt envoyé dans Claude avec les PJ
[ ] JSON vérifié (confidence, couleur, fonts, logo)
[ ] JSON importé dans Wink
```

Temps estimé par collectivité : **5 à 8 minutes**.

---

## Cas particuliers

### Le site est très ancien ou moche
Extrais ce que tu peux. Si le site n'a pas de véritable identité graphique (template CMS par défaut, pas de couleur de marque), note-le dans le champ `notes` du JSON. On utilisera un fallback Wink propre plutôt qu'un branding de mauvaise qualité.

### Le site est en maintenance ou inaccessible
Essaie avec le cache Google (`cache:URL`) ou la Wayback Machine (`web.archive.org`). Si rien ne fonctionne, passe à la suivante et reviens plus tard.

### La collectivité a plusieurs sites (mairie + agglo + tourisme)
Priorise le **site institutionnel principal** (celui qui finit en `.fr`). Les sites thématiques (tourisme, culture) ont souvent une charte dérivée qui n'est pas représentative.

### Le logo est introuvable en URL
Décris-le dans le JSON (`logos.main.description`) et télécharge-le manuellement (clic droit > Enregistrer l'image). On l'uploadera séparément lors de l'import.
