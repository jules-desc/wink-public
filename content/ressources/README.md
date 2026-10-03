# Contenus de la section Ressources

Chaque contenu est un fichier Markdown : `content/ressources/<type>/<slug>.md`.
Les fichiers sont relus en pull request, puis importés en base par
`npx tsx scripts/import-ressources.ts` (statut `PUBLIE` uniquement si `statut: publie`).

Types : `guide`, `modele`, `actualite`, `metier`, `portrait`.

## En-tête (YAML)

```yaml
---
titre: "Recruter un agent contractuel : cadre légal et étapes"
slug: recruter-un-agent-contractuel          # = nom du fichier, minuscules, tirets
type: guide
statut: publie                               # brouillon | publie
chapo: "Une à deux phrases, 200 caractères maximum, qui disent ce que le lecteur saura faire."
datePublication: 2026-10-03
dateMiseAJour: 2026-10-03                    # optionnel
auteur: "La rédaction"
tempsLecture: 8                              # minutes
enAvant: false                               # mis en avant sur le hub
thematiques: [recrutement, contractuels]     # liste fermée ci-dessous
personas: [P1, P3, P4]                       # référentiel Personas Wink v1.2
typesCollectivite: [tous]                    # tous | commune | petite-commune | epci | departement | region
versants: [territoriale]                     # territoriale | etat | hospitaliere
faq:                                         # optionnel, 3 à 5 questions
  - question: "…"
    reponse: "…"
sources:                                     # obligatoire : pages officielles réellement consultées
  - titre: "Code général de la fonction publique, article L332-8"
    url: "https://www.legifrance.gouv.fr/…"
meta: {}                                     # champs propres au type, voir ci-dessous
---
```

Thématiques : `recrutement`, `contractuels`, `concours`, `remuneration`, `fiche-de-poste`,
`jury-entretien`, `integration`, `marque-employeur`, `petites-communes`, `reglementation`.

### `meta` par type

- `metier` : `filiere`, `categorie` (A, B ou C), `cadresEmplois` (liste), `famille` (famille de métiers du répertoire CNFPT), `tension` (true si métier en tension documenté).
- `modele` : `format` (ex. « Trame à copier »), `usage` (une phrase).
- `actualite` : `dateEffet` (optionnel, AAAA-MM-JJ).
- `portrait` : `personne`, `fonction`, `collectivite`, `collectiviteSlug` (optionnel). Uniquement à partir d'un entretien réel et validé.

## Règles éditoriales

- Français, vouvoiement, casse de phrase, pas d'emoji, guillemets « ».
- Écrit pour la personne qui recrute (persona P1 à P5), pas pour le candidat.
- Aucun chiffre, article de loi ou date sans source officielle listée dans `sources`.
- Jamais d'offre d'emploi, jamais de lien vers une annonce.
- Corps en Markdown : sections `##`, sous-sections `###`, listes, tableaux simples. Pas de H1 (le titre vient de l'en-tête).
