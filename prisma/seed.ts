import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // --- Collectivités ---

  const lyon = await prisma.collectivite.upsert({
    where: { slug: 'lyon-69000' },
    update: {},
    create: {
      slug: 'lyon-69000',
      nom: 'Ville de Lyon',
      nomCourt: 'Lyon',
      type: 'COMMUNE',
      codeInsee: '69123',
      codeSiren: '216901231',
      codesPostaux: ['69001', '69002', '69003', '69004', '69005', '69006', '69007', '69008', '69009'],
      departementCode: '69',
      departementNom: 'Rhône',
      regionCode: '84',
      regionNom: 'Auvergne-Rhône-Alpes',
      latitude: 45.7578,
      longitude: 4.8320,
      adresseNumero: '1',
      adresseRue: 'place de la Comédie',
      adresseVille: 'Lyon',
      adresseCodePostal: '69001',
      adresseFormatee: '1 place de la Comédie, 69001 Lyon',
      telephone: '04 72 10 30 30',
      email: 'contact@mairie-lyon.fr',
      siteWeb: 'https://www.lyon.fr',
      horaires: 'Lundi au vendredi : 8h30 - 17h00',
      blasonUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Blason_ville_fr_Lyon.svg/120px-Blason_ville_fr_Lyon.svg.png',
      description: 'Lyon, troisième ville de France, est une métropole dynamique au patrimoine exceptionnel, classée au patrimoine mondial de l\'UNESCO.',
      population: 522250,
      effectifs: 8500,
      budgetTotal: 780000000,
      benefits: ['Restauration collective', 'Participation mutuelle', 'CNAS', 'Télétravail possible', 'Formation continue'],
      competences: ['Urbanisme', 'Petite enfance', 'Culture', 'Sport', 'Action sociale', 'Voirie'],
      socialMediaLinks: { facebook: 'https://facebook.com/villedelyon', linkedin: 'https://linkedin.com/company/ville-de-lyon', x: 'https://x.com/villedelyon' }
    }
  })

  const rennes = await prisma.collectivite.upsert({
    where: { slug: 'rennes-35000' },
    update: {},
    create: {
      slug: 'rennes-35000',
      nom: 'Ville de Rennes',
      nomCourt: 'Rennes',
      type: 'COMMUNE',
      codeInsee: '35238',
      codeSiren: '213502388',
      codesPostaux: ['35000', '35200', '35700'],
      departementCode: '35',
      departementNom: 'Ille-et-Vilaine',
      regionCode: '53',
      regionNom: 'Bretagne',
      latitude: 48.1173,
      longitude: -1.6778,
      adresseNumero: '1',
      adresseRue: 'place de la Mairie',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      adresseFormatee: '1 place de la Mairie, 35000 Rennes',
      telephone: '02 23 62 10 10',
      email: 'contact@ville-rennes.fr',
      siteWeb: 'https://metropole.rennes.fr',
      horaires: 'Lundi au vendredi : 8h45 - 17h30',
      blasonUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Blason_Rennes.svg/120px-Blason_Rennes.svg.png',
      description: 'Rennes, capitale de la Bretagne, est une ville universitaire et numérique réputée pour sa qualité de vie et son dynamisme culturel.',
      population: 222485,
      effectifs: 4200,
      budgetTotal: 420000000,
      benefits: ['Restauration collective', 'Participation mutuelle', 'COS', 'Télétravail', 'RTT'],
      competences: ['Urbanisme', 'Transport', 'Petite enfance', 'Culture', 'Numérique'],
      socialMediaLinks: { facebook: 'https://facebook.com/villerennes', linkedin: 'https://linkedin.com/company/ville-de-rennes' }
    }
  })

  const saintMartin = await prisma.collectivite.upsert({
    where: { slug: 'saint-martin-de-re-17410' },
    update: {},
    create: {
      slug: 'saint-martin-de-re-17410',
      nom: 'Commune de Saint-Martin-de-Ré',
      nomCourt: 'Saint-Martin-de-Ré',
      type: 'COMMUNE',
      codeInsee: '17369',
      codesPostaux: ['17410'],
      departementCode: '17',
      departementNom: 'Charente-Maritime',
      regionCode: '75',
      regionNom: 'Nouvelle-Aquitaine',
      latitude: 46.1997,
      longitude: -1.3650,
      adresseRue: 'place de la République',
      adresseVille: 'Saint-Martin-de-Ré',
      adresseCodePostal: '17410',
      adresseFormatee: 'Place de la République, 17410 Saint-Martin-de-Ré',
      telephone: '05 46 09 20 06',
      email: 'mairie@saint-martin-de-re.fr',
      siteWeb: 'https://www.saint-martin-de-re.fr',
      blasonUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Blason_Saint-Martin-de-R%C3%A9.svg/120px-Blason_Saint-Martin-de-R%C3%A9.svg.png',
      description: 'Saint-Martin-de-Ré est une commune fortifiée de l\'île de Ré, classée au patrimoine mondial de l\'UNESCO pour ses fortifications Vauban.',
      population: 2560,
      effectifs: 45,
      benefits: ['CNAS', 'Participation mutuelle'],
      competences: ['Urbanisme', 'Tourisme', 'Patrimoine']
    }
  })

  const brest = await prisma.collectivite.upsert({
    where: { slug: 'brest-29200' },
    update: {},
    create: {
      slug: 'brest-29200',
      nom: 'Ville de Brest',
      nomCourt: 'Brest',
      type: 'COMMUNE',
      codeInsee: '29019',
      codeSiren: '212900194',
      codesPostaux: ['29200'],
      departementCode: '29',
      departementNom: 'Finistère',
      regionCode: '53',
      regionNom: 'Bretagne',
      latitude: 48.3904,
      longitude: -4.4861,
      adresseNumero: '2',
      adresseRue: 'rue Frézier',
      adresseVille: 'Brest',
      adresseCodePostal: '29200',
      adresseFormatee: '2 rue Frézier, 29200 Brest',
      telephone: '02 98 00 80 80',
      email: 'contact@mairie-brest.fr',
      siteWeb: 'https://www.brest.fr',
      blasonUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Blason_Brest.svg/120px-Blason_Brest.svg.png',
      description: 'Brest, ville maritime au bout du Finistère, est un pôle de recherche océanographique et un port militaire majeur.',
      population: 142722,
      effectifs: 2800,
      budgetTotal: 210000000,
      benefits: ['Restauration collective', 'CNAS', 'Participation mutuelle'],
      competences: ['Urbanisme', 'Port', 'Culture', 'Sport', 'Petite enfance'],
      socialMediaLinks: { facebook: 'https://facebook.com/villedebrest' }
    }
  })

  const _millau = await prisma.collectivite.upsert({
    where: { slug: 'millau-12100' },
    update: {},
    create: {
      slug: 'millau-12100',
      nom: 'Ville de Millau',
      nomCourt: 'Millau',
      type: 'COMMUNE',
      codeInsee: '12145',
      codesPostaux: ['12100'],
      departementCode: '12',
      departementNom: 'Aveyron',
      regionCode: '76',
      regionNom: 'Occitanie',
      latitude: 44.0987,
      longitude: 3.0783,
      adresseRue: 'place du Mandarous',
      adresseVille: 'Millau',
      adresseCodePostal: '12100',
      adresseFormatee: 'Place du Mandarous, 12100 Millau',
      telephone: '05 65 59 50 00',
      email: 'mairie@millau.fr',
      siteWeb: 'https://www.millau.fr',
      description: 'Millau, ville aveyronnaise célèbre pour son viaduc, est située au confluent du Tarn et de la Dourbie.',
      population: 22064,
      effectifs: 350,
      benefits: ['CNAS'],
      competences: ['Urbanisme', 'Tourisme', 'Sport']
    }
  })

  const rennesMetropole = await prisma.collectivite.upsert({
    where: { slug: 'rennes-metropole-35000' },
    update: {},
    create: {
      slug: 'rennes-metropole-35000',
      nom: 'Rennes Métropole',
      type: 'EPCI',
      sousType: 'METROPOLE',
      codeInsee: '243500139',
      codeSiren: '243500139',
      codesPostaux: ['35000'],
      departementCode: '35',
      departementNom: 'Ille-et-Vilaine',
      regionCode: '53',
      regionNom: 'Bretagne',
      latitude: 48.1173,
      longitude: -1.6778,
      adresseNumero: '4',
      adresseRue: 'avenue Henri Fréville',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      adresseFormatee: '4 avenue Henri Fréville, 35000 Rennes',
      telephone: '02 99 86 60 60',
      email: 'contact@rennesmetropole.fr',
      siteWeb: 'https://metropole.rennes.fr',
      logoUrl: 'https://metropole.rennes.fr/sites/default/files/logo-rennes-metropole.png',
      description: 'Rennes Métropole regroupe 43 communes et plus de 460 000 habitants. Elle pilote les transports, le développement économique et l\'aménagement du territoire.',
      population: 461000,
      effectifs: 3200,
      budgetTotal: 950000000,
      benefits: ['Restauration collective', 'Participation mutuelle', 'COS', 'Télétravail', 'RTT', 'Formation continue'],
      competences: ['Transports', 'Développement économique', 'Aménagement', 'Eau et assainissement', 'Déchets', 'Habitat'],
      membresInsee: ['35238', '35024', '35047', '35051', '35055', '35065'],
      socialMediaLinks: { linkedin: 'https://linkedin.com/company/rennes-metropole' }
    }
  })

  const metropoleLyon = await prisma.collectivite.upsert({
    where: { slug: 'metropole-de-lyon-69000' },
    update: {},
    create: {
      slug: 'metropole-de-lyon-69000',
      nom: 'Métropole de Lyon',
      type: 'EPCI',
      sousType: 'METROPOLE',
      codeInsee: '200046977',
      codeSiren: '200046977',
      codesPostaux: ['69000'],
      departementCode: '69',
      departementNom: 'Rhône',
      regionCode: '84',
      regionNom: 'Auvergne-Rhône-Alpes',
      latitude: 45.7578,
      longitude: 4.8320,
      adresseNumero: '20',
      adresseRue: 'rue du Lac',
      adresseVille: 'Lyon',
      adresseCodePostal: '69003',
      adresseFormatee: '20 rue du Lac, 69003 Lyon',
      telephone: '04 78 63 40 40',
      email: 'contact@grandlyon.com',
      siteWeb: 'https://www.grandlyon.com',
      logoUrl: 'https://www.grandlyon.com/fileadmin/user_upload/media/logo-metropole-de-lyon.png',
      description: 'La Métropole de Lyon est une collectivité territoriale unique en France, exerçant les compétences d\'un département et d\'une intercommunalité sur 59 communes.',
      population: 1420000,
      effectifs: 9200,
      budgetTotal: 3800000000,
      benefits: ['Restauration collective', 'Participation mutuelle', 'Comité des œuvres sociales', 'Télétravail', 'RTT', 'Formation continue', 'Prime de fin d\'année'],
      competences: ['Voirie', 'Propreté', 'Eau', 'Insertion', 'Action sociale', 'Collèges', 'Développement économique'],
      membresInsee: ['69123', '69266', '69034', '69256', '69029'],
      socialMediaLinks: { facebook: 'https://facebook.com/grandlyon', linkedin: 'https://linkedin.com/company/grand-lyon', x: 'https://x.com/grandlyon' }
    }
  })

  const deptRhone = await prisma.collectivite.upsert({
    where: { slug: 'departement-du-rhone-69000' },
    update: {},
    create: {
      slug: 'departement-du-rhone-69000',
      nom: 'Département du Rhône',
      nomCourt: 'Rhône',
      type: 'DEPARTEMENT',
      codeInsee: '69D',
      codesPostaux: ['69000'],
      departementCode: '69',
      departementNom: 'Rhône',
      regionCode: '84',
      regionNom: 'Auvergne-Rhône-Alpes',
      latitude: 45.85,
      longitude: 4.60,
      adresseNumero: '29-31',
      adresseRue: 'cours de la Liberté',
      adresseVille: 'Lyon',
      adresseCodePostal: '69003',
      adresseFormatee: '29-31 cours de la Liberté, 69003 Lyon',
      telephone: '04 72 61 77 77',
      email: 'contact@rhone.fr',
      siteWeb: 'https://www.rhone.fr',
      description: 'Le Département du Rhône (hors Métropole de Lyon) regroupe 228 communes. Il gère les routes départementales, les collèges, l\'action sociale et la culture.',
      population: 450000,
      effectifs: 2100,
      budgetTotal: 680000000,
      benefits: ['Restauration collective', 'CNAS', 'Télétravail'],
      competences: ['Routes départementales', 'Collèges', 'Action sociale', 'Culture', 'Sport', 'Environnement']
    }
  })

  const _deptIlleEtVilaine = await prisma.collectivite.upsert({
    where: { slug: 'departement-ille-et-vilaine-35000' },
    update: {},
    create: {
      slug: 'departement-ille-et-vilaine-35000',
      nom: 'Département d\'Ille-et-Vilaine',
      nomCourt: 'Ille-et-Vilaine',
      type: 'DEPARTEMENT',
      codeInsee: '35D',
      codesPostaux: ['35000'],
      departementCode: '35',
      departementNom: 'Ille-et-Vilaine',
      regionCode: '53',
      regionNom: 'Bretagne',
      latitude: 48.1173,
      longitude: -1.6778,
      adresseNumero: '1',
      adresseRue: 'avenue de la Préfecture',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      adresseFormatee: '1 avenue de la Préfecture, 35000 Rennes',
      telephone: '02 99 02 35 35',
      email: 'contact@ille-et-vilaine.fr',
      siteWeb: 'https://www.ille-et-vilaine.fr',
      description: 'Le Département d\'Ille-et-Vilaine est le département le plus peuplé de Bretagne, avec Rennes pour chef-lieu.',
      population: 1100000,
      effectifs: 3800,
      budgetTotal: 920000000,
      benefits: ['Restauration collective', 'COS', 'Télétravail', 'RTT'],
      competences: ['Routes départementales', 'Collèges', 'Action sociale', 'Insertion', 'Culture']
    }
  })

  const regionBretagne = await prisma.collectivite.upsert({
    where: { slug: 'region-bretagne-35000' },
    update: {},
    create: {
      slug: 'region-bretagne-35000',
      nom: 'Région Bretagne',
      nomCourt: 'Bretagne',
      type: 'REGION',
      codeInsee: '53R',
      codesPostaux: ['35000'],
      regionCode: '53',
      regionNom: 'Bretagne',
      latitude: 48.2020,
      longitude: -2.9326,
      adresseNumero: '283',
      adresseRue: 'avenue du Général Patton',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      adresseFormatee: '283 avenue du Général Patton, 35000 Rennes',
      telephone: '02 99 27 10 10',
      email: 'contact@bretagne.bzh',
      siteWeb: 'https://www.bretagne.bzh',
      logoUrl: 'https://www.bretagne.bzh/app/uploads/logo-region-bretagne.png',
      description: 'La Région Bretagne est une collectivité territoriale couvrant les départements du Finistère, des Côtes-d\'Armor, du Morbihan et d\'Ille-et-Vilaine. Elle pilote le développement économique, les lycées et les transports régionaux.',
      population: 3400000,
      effectifs: 4100,
      budgetTotal: 1900000000,
      benefits: ['Restauration collective', 'Participation mutuelle', 'COS', 'Télétravail', 'RTT', 'Formation continue'],
      competences: ['Lycées', 'TER', 'Développement économique', 'Formation professionnelle', 'Aménagement du territoire', 'Ports'],
      socialMediaLinks: { facebook: 'https://facebook.com/regionbretagne', linkedin: 'https://linkedin.com/company/region-bretagne', x: 'https://x.com/regionbretagne' }
    }
  })

  console.log(`Created ${10} collectivites`)

  // --- Contenus Page ---

  const contenus = [
    {
      collectiviteId: lyon.id,
      titreSeo: 'Travailler à Lyon - Emploi et recrutement | Ville de Lyon',
      metaDescription: 'Découvrez les opportunités d\'emploi à la Ville de Lyon. Plus de 8 500 agents au service des Lyonnais dans des métiers variés.',
      titreH1: 'Travailler à la Ville de Lyon',
      introduction: 'Lyon, troisième commune de France avec plus de 520 000 habitants, offre un cadre de travail exceptionnel au cœur d\'une métropole européenne dynamique. La Ville de Lyon emploie plus de 8 500 agents répartis dans des domaines variés : petite enfance, culture, sport, urbanisme, action sociale et bien d\'autres.\n\nRejoindre la Ville de Lyon, c\'est contribuer au quotidien des citoyens dans une collectivité engagée pour la transition écologique et la solidarité.',
      pourquoiRejoindre: 'La Ville de Lyon se distingue par la diversité de ses métiers et la richesse de ses projets. Avec un programme ambitieux de rénovation urbaine, de développement des mobilités douces et de renforcement des services de proximité, elle offre à ses agents des perspectives d\'évolution variées.\n\nLes avantages sont nombreux : restauration collective, participation à la mutuelle santé, accès au CNAS, possibilité de télétravail et un programme de formation continue reconnu.',
      cadreDeVie: 'Lyon est régulièrement classée parmi les villes les plus agréables de France. Son patrimoine classé UNESCO, sa gastronomie, ses espaces verts (Parc de la Tête d\'Or, berges du Rhône) et sa vie culturelle intense en font un lieu de vie privilégié.\n\nLa ville bénéficie d\'un réseau de transports en commun performant (métro, tramway, bus) et se situe à 2h de Paris en TGV, à proximité des Alpes et de la Méditerranée.',
      filieresMetiers: 'La Ville de Lyon recrute dans toutes les filières de la fonction publique territoriale : administrative, technique, culturelle, animation, médico-sociale, sportive et police municipale.\n\nLes principaux métiers recrutés concernent la petite enfance (ATSEM, auxiliaires de puériculture), la voirie et les espaces verts, la culture (bibliothécaires, médiateurs), le sport (éducateurs sportifs) et l\'administration générale.',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-09-01')
    },
    {
      collectiviteId: rennes.id,
      titreSeo: 'Travailler à Rennes - Emploi et recrutement | Ville de Rennes',
      metaDescription: 'Rejoignez la Ville de Rennes, capitale bretonne numérique et culturelle. Découvrez nos offres d\'emploi et nos avantages.',
      titreH1: 'Travailler à la Ville de Rennes',
      introduction: 'Rennes, capitale de la Bretagne et ville numérique de référence, emploie plus de 4 200 agents au service de ses 222 000 habitants. La collectivité se distingue par son engagement pour l\'innovation et la transition écologique.',
      pourquoiRejoindre: 'Rennes offre un environnement de travail stimulant avec des projets ambitieux : nouvelle ligne de métro, smart city, rénovation énergétique des bâtiments publics. Les agents bénéficient de conditions attractives : télétravail, RTT, COS et participation mutuelle.',
      cadreDeVie: 'Rennes est régulièrement élue parmi les villes où il fait bon vivre en France. Ville étudiante dynamique, elle propose une offre culturelle riche, des espaces verts abondants et un marché immobilier encore accessible par rapport aux autres métropoles.',
      filieresMetiers: 'La Ville de Rennes recrute principalement dans les filières technique, administrative et animation. Les secteurs de la petite enfance, du numérique et de l\'urbanisme sont particulièrement dynamiques.',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-09-01')
    },
    {
      collectiviteId: saintMartin.id,
      titreSeo: 'Travailler à Saint-Martin-de-Ré - Emploi collectivité',
      metaDescription: 'Découvrez les opportunités d\'emploi à Saint-Martin-de-Ré, commune fortifiée de l\'île de Ré classée au patrimoine mondial.',
      titreH1: 'Travailler à Saint-Martin-de-Ré',
      introduction: 'Saint-Martin-de-Ré est une commune unique, située sur l\'île de Ré en Charente-Maritime. Ses fortifications Vauban, classées au patrimoine mondial de l\'UNESCO, témoignent de son histoire exceptionnelle.',
      pourquoiRejoindre: 'Travailler à Saint-Martin-de-Ré, c\'est évoluer dans un cadre patrimonial remarquable au contact d\'une communauté attachée à son territoire. La commune recherche des agents polyvalents capables de s\'adapter aux enjeux spécifiques d\'une île.',
      cadreDeVie: 'L\'île de Ré offre un cadre de vie exceptionnel entre océan, marais salants et vignobles. La qualité de vie y est reconnue, avec un environnement préservé et un art de vivre unique.',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-09-15')
    },
    {
      collectiviteId: brest.id,
      titreSeo: 'Travailler à Brest - Emploi et recrutement',
      metaDescription: 'Rejoignez la Ville de Brest, pôle maritime et de recherche océanographique du Finistère.',
      titreH1: 'Travailler à la Ville de Brest',
      introduction: 'Brest est le deuxième pôle urbain de Bretagne et un centre majeur de la recherche océanographique française. La Ville emploie 2 800 agents.',
      status: 'DRAFT'
    },
    {
      collectiviteId: rennesMetropole.id,
      titreSeo: 'Travailler à Rennes Métropole - Emploi intercommunalité',
      metaDescription: 'Rennes Métropole regroupe 43 communes et recrute dans les transports, l\'aménagement et le développement économique.',
      titreH1: 'Travailler à Rennes Métropole',
      introduction: 'Rennes Métropole est l\'intercommunalité qui fédère 43 communes autour de Rennes. Avec plus de 460 000 habitants, elle est l\'une des métropoles les plus dynamiques de l\'Ouest français.\n\nL\'établissement emploie plus de 3 200 agents dans des domaines variés : transports (métro, bus), eau et assainissement, développement économique, habitat et aménagement du territoire.',
      pourquoiRejoindre: 'Rennes Métropole porte des projets structurants pour le territoire : ligne B du métro, programme d\'habitat, transition énergétique. Rejoindre la métropole, c\'est participer à des projets d\'envergure dans un environnement collaboratif.',
      cadreDeVie: 'Le territoire métropolitain offre une diversité de cadres de vie, du centre urbain rennais aux communes rurales environnantes, avec un accès rapide à la côte bretonne.',
      filieresMetiers: 'Rennes Métropole recrute principalement dans les filières technique (exploitation des réseaux, voirie, eau) et administrative. Les profils ingénieurs et techniciens sont particulièrement recherchés.',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-09-10')
    },
    {
      collectiviteId: metropoleLyon.id,
      titreSeo: 'Travailler à la Métropole de Lyon - Emploi Grand Lyon',
      metaDescription: 'La Métropole de Lyon recrute plus de 9 200 agents. Découvrez nos offres dans les domaines de la voirie, l\'action sociale et le développement économique.',
      titreH1: 'Travailler à la Métropole de Lyon',
      introduction: 'La Métropole de Lyon est une collectivité territoriale unique en France, créée en 2015. Elle exerce à la fois les compétences d\'un département et d\'une intercommunalité sur le territoire de 59 communes.\n\nAvec plus de 9 200 agents, c\'est l\'un des plus gros employeurs publics de la région.',
      pourquoiRejoindre: 'La Métropole offre une diversité de métiers exceptionnelle et des perspectives de carrière riches. Son statut unique permet de travailler sur des politiques publiques allant de l\'action sociale aux infrastructures.',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-09-05')
    },
    {
      collectiviteId: deptRhone.id,
      titreSeo: 'Travailler au Département du Rhône - Emploi fonction publique',
      metaDescription: 'Le Département du Rhône recrute dans les domaines des routes, des collèges, de l\'action sociale et de la culture.',
      titreH1: 'Travailler au Département du Rhône',
      introduction: 'Le Département du Rhône, recentré sur 228 communes depuis la création de la Métropole de Lyon, reste un acteur majeur de l\'action publique locale avec 2 100 agents dévoués.',
      pourquoiRejoindre: 'Le Département du Rhône offre un cadre de travail à taille humaine, entre vignobles du Beaujolais et monts du Lyonnais. Les agents bénéficient d\'une proximité avec l\'encadrement et de missions concrètes au service des habitants.',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-09-20')
    },
    {
      collectiviteId: regionBretagne.id,
      titreSeo: 'Travailler à la Région Bretagne - Emploi collectivité régionale',
      metaDescription: 'La Région Bretagne recrute dans les lycées, les transports régionaux, le développement économique et la formation professionnelle.',
      titreH1: 'Travailler à la Région Bretagne',
      introduction: 'La Région Bretagne est une collectivité de 4 100 agents qui intervient sur l\'ensemble du territoire breton. Ses compétences principales couvrent les lycées, les TER, le développement économique, la formation professionnelle et l\'aménagement du territoire.',
      pourquoiRejoindre: 'La Région Bretagne est reconnue pour sa politique RH innovante et ses engagements sociaux. Elle propose un environnement de travail moderne avec des locaux neufs et une politique de télétravail avancée.',
      cadreDeVie: 'La Bretagne offre un cadre de vie exceptionnel entre terre et mer, avec un coût de la vie raisonnable, une identité culturelle forte et une qualité environnementale remarquable.',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-09-12')
    }
  ]

  for (const contenu of contenus) {
    await prisma.contenuPage.upsert({
      where: { collectiviteId: contenu.collectiviteId },
      update: {},
      create: contenu
    })
  }

  console.log(`Created ${contenus.length} contenus page`)

  // --- Offres d'emploi ---

  const now = new Date()
  const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const in60days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)

  const offres = [
    // Lyon - 3 offres
    {
      collectiviteId: lyon.id,
      sourceExternalId: 'ET-LYN-001',
      titre: 'Directeur des Ressources Humaines (H/F)',
      description: 'La Ville de Lyon recherche un(e) Directeur(trice) des Ressources Humaines pour piloter la politique RH de la collectivité. Vous serez responsable du dialogue social, de la GPEEC et du développement des compétences.',
      urlSource: 'https://emploi-territorial.fr/offre/lyon-drh-001',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'PERMANENT',
      workSchedule: 'FULL_TIME',
      remote: 'HYBRID',
      adresseVille: 'Lyon',
      adresseCodePostal: '69001',
      experience: 'EXP_5_TO_10_YEARS',
      education: 'Bac+5',
      employerType: 'PUBLIC',
      publicGradeCategories: ['A'],
      publicGradeSectorCodes: ['1'],
      datePublication: daysAgo(5),
      dateExpiration: in60days,
      dateLimite: in30days,
      status: 'ACTIVE'
    },
    {
      collectiviteId: lyon.id,
      sourceExternalId: 'ET-LYN-002',
      titre: 'Agent d\'entretien des espaces verts (H/F)',
      description: 'Vous assurerez l\'entretien des parcs et jardins de la Ville de Lyon, notamment le Parc de la Tête d\'Or. Taille, tonte, plantation et entretien général des espaces paysagers.',
      urlSource: 'https://emploi-territorial.fr/offre/lyon-espaces-verts-002',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'PERMANENT',
      workSchedule: 'FULL_TIME',
      remote: 'ON_SITE',
      adresseVille: 'Lyon',
      adresseCodePostal: '69006',
      experience: 'EXP_1_TO_3_YEARS',
      employerType: 'PUBLIC',
      publicGradeCategories: ['C'],
      publicGradeSectorCodes: ['4'],
      datePublication: daysAgo(12),
      dateExpiration: in30days,
      status: 'ACTIVE'
    },
    {
      collectiviteId: lyon.id,
      sourceExternalId: 'FT-LYN-003',
      titre: 'Auxiliaire de puériculture (H/F)',
      description: 'La Ville de Lyon recrute un(e) auxiliaire de puériculture pour ses crèches municipales. Vous accompagnerez les enfants dans leur développement et participerez au projet pédagogique.',
      urlSource: 'https://candidat.francetravail.fr/offres/lyon-puericulture-003',
      source: 'FRANCE_TRAVAIL',
      contractType: 'FIXED_TERM',
      workSchedule: 'FULL_TIME',
      remote: 'ON_SITE',
      contractDuration: 12,
      contractDurationUnit: 'MONTH',
      adresseVille: 'Lyon',
      adresseCodePostal: '69003',
      employerType: 'PUBLIC',
      publicGradeCategories: ['C'],
      publicGradeSectorCodes: ['14'],
      datePublication: daysAgo(3),
      dateExpiration: in30days,
      status: 'ACTIVE'
    },
    // Rennes - 2 offres
    {
      collectiviteId: rennes.id,
      sourceExternalId: 'ET-RNS-001',
      titre: 'Chef de projet numérique (H/F)',
      description: 'La Ville de Rennes recherche un(e) chef de projet numérique pour accompagner la transformation digitale des services municipaux. Smart city, open data et dématérialisation.',
      urlSource: 'https://emploi-territorial.fr/offre/rennes-numerique-001',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'PERMANENT',
      workSchedule: 'FULL_TIME',
      remote: 'HYBRID',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      experience: 'EXP_3_TO_5_YEARS',
      education: 'Bac+5',
      employerType: 'PUBLIC',
      publicGradeCategories: ['A'],
      publicGradeSectorCodes: ['1'],
      datePublication: daysAgo(7),
      dateExpiration: in60days,
      dateLimite: in30days,
      status: 'ACTIVE'
    },
    {
      collectiviteId: rennes.id,
      sourceExternalId: 'ET-RNS-002',
      titre: 'ATSEM (H/F)',
      description: 'Recrutement d\'un(e) Agent Territorial Spécialisé des Écoles Maternelles pour les écoles de la Ville de Rennes.',
      urlSource: 'https://emploi-territorial.fr/offre/rennes-atsem-002',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'PERMANENT',
      workSchedule: 'FULL_TIME',
      remote: 'ON_SITE',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      employerType: 'PUBLIC',
      publicGradeCategories: ['C'],
      publicGradeSectorCodes: ['14'],
      datePublication: daysAgo(15),
      dateExpiration: in30days,
      status: 'ACTIVE'
    },
    // Brest - 1 offre
    {
      collectiviteId: brest.id,
      sourceExternalId: 'ET-BRT-001',
      titre: 'Technicien voirie et réseaux (H/F)',
      description: 'La Ville de Brest recrute un(e) technicien(ne) pour la gestion et l\'entretien de la voirie communale et des réseaux d\'assainissement.',
      urlSource: 'https://emploi-territorial.fr/offre/brest-voirie-001',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'PERMANENT',
      workSchedule: 'FULL_TIME',
      remote: 'ON_SITE',
      adresseVille: 'Brest',
      adresseCodePostal: '29200',
      experience: 'EXP_1_TO_3_YEARS',
      employerType: 'PUBLIC',
      publicGradeCategories: ['B'],
      publicGradeSectorCodes: ['4'],
      datePublication: daysAgo(20),
      dateExpiration: in30days,
      status: 'ACTIVE'
    },
    // Rennes Métropole - 2 offres
    {
      collectiviteId: rennesMetropole.id,
      sourceExternalId: 'ET-RM-001',
      titre: 'Ingénieur transports et mobilités (H/F)',
      description: 'Rennes Métropole recrute un(e) ingénieur(e) pour participer au déploiement de la ligne B du métro et au développement des mobilités durables sur le territoire métropolitain.',
      urlSource: 'https://emploi-territorial.fr/offre/rennes-metro-transport-001',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'PERMANENT',
      workSchedule: 'FULL_TIME',
      remote: 'HYBRID',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      experience: 'EXP_3_TO_5_YEARS',
      education: 'Bac+5 ingénieur',
      employerType: 'PUBLIC',
      publicGradeCategories: ['A'],
      publicGradeSectorCodes: ['4'],
      datePublication: daysAgo(2),
      dateExpiration: in60days,
      status: 'ACTIVE'
    },
    {
      collectiviteId: rennesMetropole.id,
      sourceExternalId: 'ET-RM-002',
      titre: 'Chargé de mission développement économique (H/F)',
      description: 'Vous accompagnerez les entreprises du territoire dans leur développement et participerez à l\'attractivité économique de Rennes Métropole.',
      urlSource: 'https://emploi-territorial.fr/offre/rennes-metro-deveco-002',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'FIXED_TERM',
      workSchedule: 'FULL_TIME',
      remote: 'HYBRID',
      contractDuration: 36,
      contractDurationUnit: 'MONTH',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      experience: 'EXP_3_TO_5_YEARS',
      employerType: 'PUBLIC',
      publicGradeCategories: ['A'],
      publicGradeSectorCodes: ['1'],
      datePublication: daysAgo(10),
      dateExpiration: in30days,
      status: 'ACTIVE'
    },
    // Métropole de Lyon - 1 offre
    {
      collectiviteId: metropoleLyon.id,
      sourceExternalId: 'ET-GL-001',
      titre: 'Travailleur social insertion (H/F)',
      description: 'La Métropole de Lyon recrute un(e) travailleur(se) social(e) pour accompagner les bénéficiaires du RSA dans leur parcours d\'insertion professionnelle.',
      urlSource: 'https://emploi-territorial.fr/offre/grandlyon-social-001',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'PERMANENT',
      workSchedule: 'FULL_TIME',
      remote: 'HYBRID',
      adresseVille: 'Lyon',
      adresseCodePostal: '69003',
      experience: 'EXP_1_TO_3_YEARS',
      education: 'DEASS ou DEES',
      employerType: 'PUBLIC',
      publicGradeCategories: ['A'],
      publicGradeSectorCodes: ['14'],
      datePublication: daysAgo(8),
      dateExpiration: in60days,
      status: 'ACTIVE'
    },
    // Région Bretagne - 1 offre
    {
      collectiviteId: regionBretagne.id,
      sourceExternalId: 'ET-RB-001',
      titre: 'Gestionnaire administratif lycées (H/F)',
      description: 'La Région Bretagne recrute un(e) gestionnaire administratif(ve) pour le suivi des dotations de fonctionnement des lycées bretons.',
      urlSource: 'https://emploi-territorial.fr/offre/bretagne-lycees-001',
      source: 'EMPLOI_TERRITORIAL',
      contractType: 'PERMANENT',
      workSchedule: 'FULL_TIME',
      remote: 'HYBRID',
      adresseVille: 'Rennes',
      adresseCodePostal: '35000',
      employerType: 'PUBLIC',
      publicGradeCategories: ['B'],
      publicGradeSectorCodes: ['1'],
      datePublication: daysAgo(6),
      dateExpiration: in60days,
      dateLimite: in30days,
      status: 'ACTIVE'
    }
  ]

  for (const offre of offres) {
    await prisma.offreEmploi.upsert({
      where: {
        source_sourceExternalId: {
          source: offre.source,
          sourceExternalId: offre.sourceExternalId
        }
      },
      update: {},
      create: offre
    })
  }

  console.log(`Created ${offres.length} offres emploi`)

  // --- Branding (données d'extraction réelles : Angers, Albi) ---

  const brandingSeedData = [
    {
      collectiviteId: lyon.id,
      primaryColor: '#E11F26',
      secondaryColor: '#1B3A5C',
      headingFont: 'Roboto',
      bodyFont: 'Roboto',
      borderRadius: 'small',
      colorsConfig: { primary: { hex: '#E11F26', usage: 'Logo, boutons, accents' }, secondary: { hex: '#1B3A5C', usage: 'Header, footer' } },
      typographyConfig: { heading: { family: 'Roboto', source: 'google-fonts', certainty: 'probable' }, body: { family: 'Roboto', source: 'google-fonts', certainty: 'probable' } },
      visualsConfig: { borderRadius: 'small', photoStyle: 'institutionnel' },
      source: 'EXTRACTED',
      status: 'PUBLISHED',
      extractedFrom: 'https://www.lyon.fr',
      confidenceScore: 'medium',
      publishedAt: new Date()
    },
    {
      collectiviteId: rennes.id,
      primaryColor: '#1E1E1E',
      secondaryColor: '#A8E6F8',
      accentColor: '#FFF3B3',
      headingFont: 'Figtree',
      bodyFont: 'Figtree',
      borderRadius: 'small',
      colorsConfig: { primary: { hex: '#1E1E1E', usage: 'Texte, titres, boutons' }, secondary: { hex: '#A8E6F8', usage: 'Fond hero, accès rapides' }, accent: { hex: '#FFF3B3', usage: 'Surlignage menu, section ici.rennes.fr' } },
      typographyConfig: { heading: { family: 'Figtree', source: 'visual-match', certainty: 'guess' }, body: { family: 'Figtree', source: 'visual-match', certainty: 'guess' } },
      visualsConfig: { borderRadius: 'small', buttonStyle: 'Noir plein, texte blanc', photoStyle: 'illustration' },
      source: 'EXTRACTED',
      status: 'PUBLISHED',
      extractedFrom: 'https://metropole.rennes.fr',
      confidenceScore: 'medium',
      publishedAt: new Date()
    },
    {
      collectiviteId: brest.id,
      primaryColor: '#004A8F',
      secondaryColor: '#0098D8',
      headingFont: 'Open Sans',
      bodyFont: 'Open Sans',
      borderRadius: 'medium',
      colorsConfig: { primary: { hex: '#004A8F', usage: 'Header, boutons' }, secondary: { hex: '#0098D8', usage: 'Liens, accents' } },
      typographyConfig: { heading: { family: 'Open Sans', source: 'google-fonts', certainty: 'probable' }, body: { family: 'Open Sans', source: 'google-fonts', certainty: 'probable' } },
      visualsConfig: { borderRadius: 'medium', photoStyle: 'mixte' },
      source: 'EXTRACTED',
      status: 'PUBLISHED',
      extractedFrom: 'https://www.brest.fr',
      confidenceScore: 'medium',
      publishedAt: new Date()
    }
  ]

  for (const branding of brandingSeedData) {
    await prisma.collectiviteBranding.upsert({
      where: { collectiviteId: branding.collectiviteId },
      update: {},
      create: branding
    })
  }

  console.log(`Created ${brandingSeedData.length} collectivite brandings`)
  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
