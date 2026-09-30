# Mon Employeur Public — Mémo Stratégie SEO + GEO
## Une initiative Wink

> **Positionnement** : Catalogue marque employeur des collectivités territoriales françaises.
> Pas un jobboard — on ne liste pas les offres, on met en avant l'employeur et on redirige vers son site carrière.
>
> **Benchmark** : Hellowork (leader SEO emploi FR). On reprend 90% de leurs bonnes pratiques SEO/maillage, adaptées à notre angle marque employeur.
>
> **Échelle** : 35 000+ pages collectivités, générées par IA, chacune unique.

---

## 1. Structure de la page employeur

### 1.1 URL

```
/collectivites/{slug}-{siren}.html
```

- Flat, lisible, pérenne (le SIREN ne change jamais)
- Exemples :
  - `/collectivites/communaute-agglomeration-la-rochelle-241700434.html`
  - `/collectivites/mairie-de-lyon-216901231.html`

### 1.2 Balises titre

| Élément | Template | Exemple |
|---------|----------|---------|
| `<title>` | `{Nom} — Marque Employeur, Emploi & Recrutement \| Wink` | `Communauté d'Agglomération La Rochelle — Marque Employeur, Emploi & Recrutement \| Wink` |
| `<meta description>` | `Découvrez {Nom} comme employeur : {population} habitants, {nb_agents} agents, {département}. Missions, avantages, culture et offres d'emploi.` | `Découvrez la CA La Rochelle comme employeur : 171 000 habitants, 1 200 agents, Charente-Maritime. Missions, avantages, culture et offres d'emploi.` |
| `H1` | `{Nom}` | `Communauté d'Agglomération La Rochelle` |
| `H2` (sections) | Voir §1.3 | — |

### 1.3 Sections de la page (ordre)

```
┌─────────────────────────────────────────────┐
│  Breadcrumbs                                │
│  H1 : Nom de la collectivité               │
│  Baseline : type · département · population │
│  [CTA : Claim this profile]                 │
├─────────────────────────────────────────────┤
│  H2 : Présentation                          │
│  → Description IA unique (150-250 mots)     │
│    Territoire, missions, compétences,       │
│    projets structurants                     │
├─────────────────────────────────────────────┤
│  H2 : Chiffres clés                         │
│  → Grille : population, nb agents,          │
│    budget, nb communes membres,             │
│    superficie                               │
├─────────────────────────────────────────────┤
│  H2 : Pourquoi rejoindre {Nom} ?            │
│  → Contenu IA : avantages employeur,        │
│    qualité de vie, cadre territorial        │
│    (100-150 mots)                           │
├─────────────────────────────────────────────┤
│  H2 : Emploi & Recrutement                  │
│  → Lien externe vers site carrière          │
│  → Aperçu : {N} offres actives (si dispo)  │
│  → [CTA : Voir les offres sur {source}]    │
│  PAS de listing d'offres intégré            │
├─────────────────────────────────────────────┤
│  H2 : Localisation                          │
│  → Adresse siège, carte, communes membres   │
│  → NAP complet (Name, Address, Phone)       │
├─────────────────────────────────────────────┤
│  H2 : Collectivités similaires              │
│  → 6-8 liens internes (même département     │
│    ou même type)                            │
├─────────────────────────────────────────────┤
│  H2 : Métiers dans les collectivités de     │
│        {département}                        │
│  → Liens vers hub métiers                   │
├─────────────────────────────────────────────┤
│  FAQ (H2) — 3-4 questions schema FAQPage    │
│  → "Comment postuler chez {Nom} ?"          │
│  → "{Nom} recrute-t-elle en ce moment ?"    │
│  → "Quels sont les avantages à travailler   │
│     dans une collectivité territoriale ?"   │
├─────────────────────────────────────────────┤
│  Footer global                              │
└─────────────────────────────────────────────┘
```

### 1.4 Différenciateur vs Hellowork

| Critère | Hellowork | Wink Pages |
|---------|-----------|------------|
| Contenu unique / page | ~10% (~800 mots, surtout template) | ~70% (1 200+ mots, description IA unique) |
| Description employeur | Absente | 150-250 mots générés, factuels |
| Chiffres clés | Aucun | Population, agents, budget, superficie |
| Culture / avantages | Absent | Section dédiée (IA) |
| Offres d'emploi | Listing complet intégré | Lien externe vers site carrière |
| FAQ | Absente | 3-4 questions structurées |
| NAP complet | Non | Oui (adresse, téléphone, carte) |
| Schema.org | Non détecté | Complet (voir §2) |

---

## 2. SEO technique

### 2.1 Structured Data (JSON-LD)

Chaque page employeur embarque :

**GovernmentOrganization** (principal)
```json
{
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "name": "Communauté d'Agglomération La Rochelle",
  "url": "https://wink.fr/collectivites/communaute-agglomeration-la-rochelle-241700434.html",
  "logo": "https://wink.fr/logos/241700434.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "6 Rue Saint-Michel",
    "addressLocality": "La Rochelle",
    "postalCode": "17000",
    "addressRegion": "Nouvelle-Aquitaine",
    "addressCountry": "FR"
  },
  "telephone": "+33546303636",
  "areaServed": {
    "@type": "AdministrativeArea",
    "name": "Agglomération de La Rochelle"
  },
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 1200
  }
}
```

**BreadcrumbList**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://wink.fr/" },
    { "@type": "ListItem", "position": 2, "name": "Collectivités", "item": "https://wink.fr/collectivites/" },
    { "@type": "ListItem", "position": 3, "name": "Charente-Maritime", "item": "https://wink.fr/collectivites/charente-maritime-17/" },
    { "@type": "ListItem", "position": 4, "name": "CA La Rochelle" }
  ]
}
```

**FAQPage**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Comment postuler chez la Communauté d'Agglomération La Rochelle ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Consultez les offres d'emploi sur le site carrière officiel..."
      }
    }
  ]
}
```

### 2.2 Balises techniques

| Balise | Valeur |
|--------|--------|
| `canonical` | URL propre de la page |
| `robots` | `index, follow` (toutes les pages employeur) |
| `hreflang` | `fr-FR` (mono-langue pour l'instant) |
| `og:type` | `profile` |
| `og:title` | = `<title>` |
| `og:image` | Logo collectivité ou image par défaut Wink |

### 2.3 Performance & Rendu

| Aspect | Choix | Raison |
|--------|-------|--------|
| Rendu | **SSR avec ISR** (Nuxt `routeRules`) | Google voit le HTML complet, revalidation périodique |
| ISR TTL | 24h pour les pages employeur | Données peu volatiles, réduit la charge serveur |
| Sitemap | XML dynamique, 1 sitemap par département | 35 000 URLs > limite 50 000, segmentation logique |
| `lastmod` | Date de dernière mise à jour des données | Signal de fraîcheur pour Google |
| Images | WebP, lazy loading, `width`/`height` explicites | Core Web Vitals (CLS, LCP) |
| CSS | Tailwind purgé, critical CSS inline | FCP < 1.5s |

### 2.4 Sitemap

```
/sitemap.xml              → sitemap index
/sitemap-departements.xml → 101 pages hub département
/sitemap-17.xml           → toutes les collectivités de Charente-Maritime
/sitemap-75.xml           → toutes les collectivités de Paris
...
/sitemap-hubs.xml         → pages métiers, types de collectivités
```

---

## 3. GEO — SEO local + IA générative

### 3.1 Signaux locaux

| Signal | Implémentation |
|--------|---------------|
| **NAP** (Name, Address, Phone) | Structuré dans le HTML + schema.org sur chaque page |
| **Ville / département / région** | Mentionnés dans le titre, description, breadcrumbs, contenu |
| **Carte** | Embed OpenStreetMap (léger, pas de dépendance Google) |
| **Communes membres** | Liste pour les EPCI → maillage vers pages communes |
| **Données INSEE** | Population, superficie → crédibilité factuelle |

### 3.2 Stratégie AI Overviews / GEO

L'objectif : être la **source citée** quand un LLM répond à "Travailler à la mairie de Lyon" ou "Emploi collectivité La Rochelle".

**Principes :**

1. **Contenu factuel structuré** : phrases déclaratives courtes, données chiffrées, format "réponse directe"
2. **FAQ = cible snippets** : les questions de la FAQ sont formulées comme des requêtes utilisateur réelles
3. **Entités nommées** : mentionner systématiquement le nom complet, le type de collectivité, le département, la région
4. **Fraîcheur** : ISR + `lastmod` pour que les crawlers IA re-scannent régulièrement
5. **Pas de contenu verrouillé** : tout est accessible sans JS, sans login, sans cookie wall

**Requêtes cibles par page :**
- `{Nom collectivité} emploi`
- `{Nom collectivité} recrutement`
- `travailler {Nom collectivité}`
- `{Nom collectivité} avis employeur`
- `{Nom collectivité} marque employeur`
- `emploi collectivité {ville}`
- `emploi territorial {département}`

### 3.3 Optimisation pour les crawlers IA

| Action | Détail |
|--------|--------|
| `robots.txt` | Autoriser GPTBot, ClaudeBot, Bingbot, etc. |
| Contenu SSR | HTML complet sans JS requis — les crawlers IA ne font pas de rendu JS |
| Données structurées | Les LLMs extraient les entités depuis schema.org |
| `llms.txt` | Fichier optionnel décrivant le site pour les crawlers IA |

---

## 4. Maillage interne & Arborescence

### 4.1 Arborescence des URLs

```
wink.fr/
├── collectivites/                          → Index national (H1: Catalogue des employeurs publics)
│   ├── {slug}-{siren}.html                 → Page employeur unitaire
│   ├── {departement}-{code}/               → Hub département (ex: charente-maritime-17/)
│   ├── type/{type-collectivite}/           → Hub par type (communes, EPCI, départements, régions)
│   └── metiers/{metier}/                   → Hub par métier territorial
├── departements/                           → Index des 101 départements
├── regions/                                → Index des 18 régions
└── guide/                                  → Contenu éditorial (optionnel, phase 2)
    ├── travailler-collectivite-territoriale.html
    ├── concours-fonction-publique-territoriale.html
    └── ...
```

### 4.2 Matrice de maillage

Chaque page employeur lie vers :

| Destination | Nombre de liens | Exemple |
|-------------|----------------|---------|
| Hub département | 1 | → `/collectivites/charente-maritime-17/` |
| Collectivités similaires (même dept) | 6-8 | → Autres EPCI/communes du 17 |
| Collectivités similaires (même type) | 3-4 | → Autres communautés d'agglomération |
| Hub métiers du département | 3-5 | → Métiers dans les collectivités du 17 |
| Site carrière employeur | 1 | → Lien externe (nofollow? à tester) |
| Index national | 1 | Via breadcrumbs |

**Volume de liens internes par page : 15-20** (vs ~25 chez Hellowork, mais plus pertinents).

### 4.3 Pages hub (multiplicateur SEO)

| Type de hub | Nombre estimé | Requête cible |
|-------------|---------------|---------------|
| Hub département | 101 | `emploi collectivité {département}` |
| Hub région | 18 | `emploi territorial {région}` |
| Hub type de collectivité | ~6 | `emploi {commune/EPCI/département/région}` |
| Hub métier territorial | ~30 | `{métier} collectivité territoriale` |
| **Total pages hub** | **~155** | — |
| **Total pages employeur** | **~35 000** | — |
| **Total pages indexables** | **~35 155** | — |

---

## 5. Templates de contenu IA

### 5.1 Principes anti-duplicate

À 35 000 pages, le duplicate content est le risque #1. Stratégie :

1. **Variables dynamiques** : chaque template injecte 10+ variables (nom, type, département, population, budget, nb agents, communes membres, projets, etc.)
2. **Variations de formulation** : 3-5 variations par section, sélectionnées par hash du SIREN
3. **Données factuelles uniques** : chiffres INSEE, liste des communes, compétences statutaires — différents par définition
4. **Section "Pourquoi rejoindre"** : générée par IA avec contexte territorial spécifique (qualité de vie, bassin d'emploi, projets locaux)

### 5.2 Template de description (exemple)

**Entrée IA :**
```
Collectivité : Communauté d'Agglomération La Rochelle
Type : EPCI (communauté d'agglomération)
Département : Charente-Maritime (17)
Région : Nouvelle-Aquitaine
Population : 171 000 habitants
Communes membres : 28
Agents : ~1 200
Compétences : transport, habitat, économie, environnement, eau, assainissement
```

**Sortie attendue (150-250 mots) :**
> La Communauté d'Agglomération de La Rochelle regroupe 28 communes et 171 000 habitants sur le littoral charentais. Cet EPCI exerce des compétences stratégiques en matière de transport, d'habitat, de développement économique et de gestion de l'eau.
>
> Avec environ 1 200 agents, la collectivité offre une diversité de métiers : ingénieurs environnement, techniciens transport, chargés de développement économique, agents d'entretien des réseaux... Les postes couvrent aussi bien les fonctions techniques que les fonctions support (RH, finances, juridique).
>
> Travailler à l'agglomération de La Rochelle, c'est contribuer aux politiques publiques d'un territoire dynamique engagé dans la transition écologique, tout en bénéficiant d'un cadre de vie reconnu sur la façade atlantique.

### 5.3 Template FAQ (3 questions par page)

| Question | Template de réponse |
|----------|-------------------|
| `Comment postuler chez {Nom} ?` | `Pour postuler chez {Nom}, consultez les offres d'emploi publiées sur {lien site carrière}. Les recrutements de la fonction publique territoriale passent par {concours/voie contractuelle selon données disponibles}.` |
| `{Nom} recrute-{t-elle/il} en ce moment ?` | `{Nom} compte actuellement {N} offres actives (dernière vérification : {date}). Consultez la page recrutement officielle pour les postes à pourvoir.` |
| `Quels sont les avantages à travailler chez {Nom} ?` | `Les agents de {Nom} bénéficient des avantages de la fonction publique territoriale : {régime indemnitaire, CNAS/COS, RTT, télétravail selon données}. {Phrase spécifique au territoire}.` |

---

## 6. Métriques et objectifs

### 6.1 KPIs SEO

| Métrique | Objectif M+3 | Objectif M+6 | Objectif M+12 |
|----------|-------------|-------------|---------------|
| Pages indexées | 5 000 | 20 000 | 35 000 |
| Trafic organique / mois | 10 000 | 50 000 | 200 000 |
| Positions top 10 | 500 | 5 000 | 15 000 |
| Taux de claim | 0.5% | 1% | 2% |
| Citations AI Overviews | Monitoring | 50+ | 500+ |

### 6.2 Priorité de déploiement

1. **Phase 1** : Top 500 collectivités (grandes villes, métropoles, gros EPCI) — contenu le plus riche
2. **Phase 2** : Toutes les collectivités > 10 000 habitants (~3 000 pages)
3. **Phase 3** : Toutes les collectivités (~35 000 pages)

---

## 7. Checklist technique pré-lancement

- [ ] SSR fonctionnel avec ISR (route rules Nuxt)
- [ ] Sitemap XML dynamique segmenté par département
- [ ] Schema.org (GovernmentOrganization + BreadcrumbList + FAQPage) validé
- [ ] Canonical + robots + OG tags sur chaque page
- [ ] Breadcrumbs fonctionnels et cliquables
- [ ] Maillage interne : liens département + collectivités similaires
- [ ] Core Web Vitals < seuils (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] robots.txt ouvert aux crawlers IA (GPTBot, ClaudeBot)
- [ ] `llms.txt` à la racine
- [ ] Pipeline de génération de contenu IA opérationnelle
- [ ] Monitoring : Google Search Console + PostHog + alertes indexation
