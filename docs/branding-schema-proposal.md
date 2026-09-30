# Proposition : Schéma de données branding + Stratégie fallback

> Statut : DRAFT — En attente de validation Jules
> Date : 2026-09-27

---

## 1. Contexte

On a testé l'extraction de charte graphique sur 6 collectivités (Angers, Pays Basque, Rouen, Gironde, Rennes, Albi). Le JSON produit contient : couleurs (primary + secondary + accent + extras), logos (main + icon + blason), typographie (heading + body + fallbacks libres), visuels (borderRadius, buttonStyle, patterns, photoStyle), ambiance, et métadonnées (confidence, WCAG, notes).

Le modèle actuel sur `Collectivite` a seulement : `primaryColor`, `logoUrl`, `blasonUrl`, `bannerUrl`. C'est insuffisant pour du theming personnalisé.

---

## 2. Proposition de schéma : table `CollectiviteBranding` (1:1)

### Pourquoi une table séparée plutôt que des champs sur Collectivite ?

- **Séparation des responsabilités** : les données d'identité (nom, code INSEE) ne changent pas au même rythme que le branding
- **Workflow de validation** : le branding a son propre cycle de vie (DRAFT → VALIDATED → PUBLISHED)
- **Traçabilité** : on sait qui a extrait, quand, depuis quelle source
- **Versioning futur** : on pourra garder un historique des versions de branding
- **Pas de migration lourde** : les champs existants sur Collectivite restent en place comme fallback

### Schema Prisma proposé

```prisma
model CollectiviteBranding {
  id               String    @id @default(uuid())
  collectiviteId   String    @unique

  // ── Couleurs (dénormalisées pour accès rapide au rendu) ──
  primaryColor     String?           // #hex — la couleur dominante
  secondaryColor   String?           // #hex
  accentColor      String?           // #hex
  backgroundColor  String?           // #hex — si non-standard (non blanc)
  textColor        String?           // #hex — si non-standard (non noir)

  // ── Config complète (flexible, illimité) ──
  colorsConfig     Json    @default("{}") // Toutes les couleurs avec usage, source, isCharte
  logosConfig      Json    @default("{}") // main, icon, blason + variantes libres
  typographyConfig Json    @default("{}") // heading, body + variantes, fallbacks libres
  visualsConfig    Json    @default("{}") // borderRadius, buttonStyle, patterns, photoStyle

  // ── Qualitative (nourrit la génération IA) ──
  ambiance         String?   @db.Text     // 2 phrases sur le feeling
  notes            String?   @db.Text     // Ce qui est incertain ou à vérifier

  // ── Source & workflow ──
  source           String    @default("EXTRACTED")  // EXTRACTED | CLAIMED | FALLBACK
  extractedFrom    String?                           // URL du site source
  extractedBy      String?                           // Qui a fait l'extraction
  status           String    @default("DRAFT")       // DRAFT | VALIDATED | PUBLISHED
  confidenceScore  String?                           // high | medium | low

  // ── Validation ──
  validatedAt      DateTime? @db.Timestamptz(0)
  validatedBy      String?
  publishedAt      DateTime? @db.Timestamptz(0)

  // ── Timestamps ──
  createdAt        DateTime  @default(now()) @db.Timestamptz(0)
  updatedAt        DateTime  @updatedAt @db.Timestamptz(0)

  // ── Relation ──
  collectivite     Collectivite @relation(fields: [collectiviteId], references: [id], onDelete: Cascade)

  @@map("collectivite_brandings")
}
```

### Pourquoi ce design hybride (champs typés + Json) ?

**Champs typés** (`primaryColor`, `secondaryColor`, etc.) :
- Accès rapide sans parser du JSON (le rendu de page en a besoin à chaque requête)
- Queryable en SQL (ex: "toutes les collectivités qui ont un branding publié")
- Servent directement aux CSS custom properties

**Champs Json** (`colorsConfig`, `logosConfig`, etc.) :
- Stockent la richesse complète du branding (couleurs extras, variantes de logo, fonts alternatives)
- Extensibles sans migration (on peut ajouter des clés)
- Permettent le "nombre illimité de variantes" demandé

### Exemples de contenu Json

#### `colorsConfig`
```json
{
  "primary": { "hex": "#de1a11", "usage": "Boutons, headers, bandeau accès directs", "source": "css" },
  "secondary": { "hex": "#0a0b48", "usage": "Header, dégradés bleus", "source": "css" },
  "accent": { "hex": "#0a5896", "usage": "Liens, boutons formulaire", "source": "css" },
  "extra": [
    { "hex": "#f55235", "name": "Orange corail", "usage": "Dégradé accès directs", "isCharte": true },
    { "hex": "#00ad5a", "name": "Vert statut", "usage": "Étiquette Complet", "isCharte": false }
  ],
  "wcag": {
    "primaryOnWhite": { "ratio": "4.9:1", "passAA": true },
    "secondaryOnWhite": { "ratio": "18.2:1", "passAA": true }
  }
}
```

#### `logosConfig`
```json
{
  "main": {
    "url": "https://www.albi.fr/design/albi/images/logo.svg",
    "description": "Blason simplifié + texte albi.fr",
    "format": "svg",
    "hasTransparentBackground": true
  },
  "icon": {
    "url": "https://www.albi.fr/favicon.ico",
    "description": "Favicon .ico"
  },
  "blason": {
    "url": "https://www.albi.fr/design/albi/images/logo.svg",
    "description": "Intégré au logo principal"
  }
}
```

#### `typographyConfig`
```json
{
  "heading": {
    "family": "Neo Sans Std",
    "weight": "medium",
    "source": "custom",
    "certainty": "exact",
    "isCommercial": true,
    "libreFallback": "Nunito Sans"
  },
  "body": {
    "family": "Source Sans Pro",
    "weight": "regular",
    "source": "google-fonts",
    "certainty": "exact",
    "isCommercial": false,
    "libreFallback": null
  }
}
```

#### `visualsConfig`
```json
{
  "borderRadius": "small",
  "buttonStyle": "Aplat rouge, texte blanc capitales, rayon 3px",
  "patterns": "Dégradé bleu sur photos hero, trait vertical rouge comme séparateur",
  "photoStyle": "aérien"
}
```

---

## 3. Relation avec les champs existants sur Collectivite

Les champs actuels `primaryColor`, `logoUrl`, `blasonUrl`, `bannerUrl` sur `Collectivite` restent en place. Ils servent de **fallback de niveau 1** quand il n'y a pas de `CollectiviteBranding`.

### Priorité de résolution au rendu

```
CollectiviteBranding (status = PUBLISHED)
  ↓ si absent
Collectivite.primaryColor / logoUrl / blasonUrl
  ↓ si absent
Fallback par type/région (voir section 4)
  ↓ si absent
Template Wink neutre
```

On ne migre pas les champs existants — on les laisse comme source de données de base, et le branding riche vient en overlay.

---

## 4. Stratégie de fallback

### Niveau 0 — Branding complet (top 500)
La collectivité a un `CollectiviteBranding` publié. On utilise tout : couleurs, fonts, logo, visuels.

### Niveau 1 — Branding minimal (données existantes)
Pas de `CollectiviteBranding`, mais `Collectivite.primaryColor` et/ou `logoUrl` existent. On les utilise avec le template Wink par défaut.

### Niveau 2 — Fallback par type de collectivité
Aucune donnée de branding. On applique une palette par défaut selon le type :

| Type | Couleur primaire | Ambiance |
|---|---|---|
| COMMUNE | `#1E40AF` (bleu institutionnel) | Sobre, services de proximité |
| EPCI | `#0E7490` (teal) | Moderne, intercommunalité |
| DEPARTEMENT | `#7C3AED` (violet) | Institutionnel, solidarité |
| REGION | `#059669` (vert) | Dynamique, territoire |
| CDG | `#4338CA` (indigo) | Pro, gestion RH |

> Ces couleurs sont des propositions — à valider avec les maquettes Claude Design.

### Niveau 3 — Template Wink neutre
Dernier recours. Palette Wink standard, pas de personnalisation. Propre mais générique.

### Gestion des fonts au fallback
- Niveau 0 : font extraite (ou son fallback libre si commerciale)
- Niveaux 1-3 : font système Wink (à définir — probablement Inter ou une sans-serif moderne)

---

## 5. Questions ouvertes pour Jules

### Q1 — Les champs dénormalisés suffisent-ils ?
J'ai mis `primaryColor`, `secondaryColor`, `accentColor`, `backgroundColor`, `textColor` en champs typés. Est-ce qu'on a besoin d'autres champs dénormalisés pour le rendu rapide ? Par exemple `headingFont` et `bodyFont` en String ?

### Q2 — Versioning du branding ?
Pour la V1, un seul enregistrement par collectivité (le dernier). Mais est-ce qu'on prévoit un historique ? Si oui, on enlève le `@unique` sur `collectiviteId` et on ajoute un champ `version`. Si non, on garde simple.

### Q3 — Upload des logos
Les logos extraits sont des URLs externes (hébergées sur le site de la collectivité). On les pointe en direct, ou on les télécharge et on les héberge nous-mêmes ? Le risque du lien direct : si la collectivité change son site, nos pages cassent.

### Q4 — Fallback par région ?
J'ai proposé un fallback par TYPE de collectivité. Est-ce qu'on veut aussi un fallback par RÉGION (couleurs régionales) ? Ça donnerait plus de variété visuelle sur les pages non-brandées, mais c'est plus de config à maintenir.

### Q5 — Relation avec ContenuPage ?
L'`ambiance` du branding peut nourrir la génération de contenu IA dans `ContenuPage`. Est-ce qu'on fait ce lien explicitement (le prompt IA de génération de contenu lit le branding) ou c'est pour plus tard ?

---

## 6. Modification nécessaire sur Collectivite

Ajouter la relation :

```prisma
// Dans model Collectivite, section Relations :
branding         CollectiviteBranding?
```

---

## 7. Résumé des décisions à prendre

| # | Question | Options | Ma reco |
|---|---|---|---|
| 1 | Champs dénormalisés | Couleurs seulement / + fonts | Couleurs + `headingFont` + `bodyFont` |
| 2 | Versioning | Non (V1) / Oui | Non pour la V1, on ajoutera si besoin |
| 3 | Hébergement logos | Lien direct / Upload S3 | Upload S3 (fiabilité) |
| 4 | Fallback région | Oui / Non | Non pour la V1, par type suffit |
| 5 | Branding → ContenuPage | Maintenant / Plus tard | Plus tard, mais on garde `ambiance` prêt |
