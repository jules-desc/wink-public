import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'

interface ContenuData {
  codeInsee: string
  titreH1: string
  titreSeo: string
  metaDescription: string
  introduction: string
  pourquoiRejoindre: string
  cadreDeVie: string
  filieresMetiers: string
}

const CONTENUS: ContenuData[] = [
  {
    codeInsee: '75056',
    titreH1: 'Travailler à la Ville de Paris',
    titreSeo: 'Emploi Ville de Paris — Recrutement mairie & métiers | Wink Pages',
    metaDescription: 'Rejoignez la Ville de Paris, plus grand employeur public municipal de France : 52 500 agents, 3 000 postes à pourvoir chaque année et une diversité de métiers unique.',
    introduction: 'La Ville de Paris est le premier employeur public municipal de France avec plus de 52 500 agents. Elle propose une diversité de métiers exceptionnelle, du petit enfance à la culture en passant par la police municipale et les espaces verts. Chaque année, environ 3 000 postes sont ouverts au recrutement et 380 contrats d\'apprentissage sont signés.\n\nRejoindre la Ville de Paris, c\'est intégrer une administration où 55,9% des agents sont des femmes et où la mobilité interne est fortement encouragée : la carrière d\'un agent peut se dérouler sur plusieurs métiers et directions. La Direction des Affaires Scolaires (DASCO) est la plus importante avec 11 200 agents, soit 21,3% des effectifs.',
    pourquoiRejoindre: 'Travailler à la Ville de Paris, c\'est participer au fonctionnement de la capitale et contribuer à des politiques publiques de dimension internationale. Les agents interviennent sur des projets structurants comme l\'héritage des Jeux Olympiques 2024 (Arena Porte de la Chapelle, Centre aquatique olympique, Village olympique), le Plan Climat, ou l\'accompagnement du Grand Paris Express — 200 km de métro automatique et 68 nouvelles stations livrés entre 2024 et 2030.\n\nLes agents bénéficient de l\'AGOSPAP (action sociale équivalent COS), de restaurants administratifs, de l\'ARTT et d\'un dispositif COS complet. Le processus de candidature a été simplifié : la lettre de motivation n\'est plus obligatoire pour la plupart des postes. La formation continue et les passerelles entre métiers permettent d\'évoluer tout au long de sa carrière.',
    cadreDeVie: 'Paris offre un cadre de travail unique : capitale mondiale de la culture, patrimoine exceptionnel, plus de 400 parcs et jardins, et l\'un des réseaux de transports les plus denses d\'Europe. Les agents peuvent bénéficier de la richesse culturelle de la ville (musées, opéra, théâtres, concerts) et de la diversité de ses 20 arrondissements, chacun avec son identité propre.\n\nLa ville est un carrefour européen et international, avec des liaisons TGV et Eurostar vers Londres, Bruxelles et l\'Europe entière. Le marché du logement reste tendu mais la Ville accompagne ses agents avec des dispositifs d\'aide au logement social.',
    filieresMetiers: 'La Ville de Paris recrute dans un panel de métiers particulièrement large. **Petite enfance** : puéricultrices, auxiliaires de puériculture, agents polyvalents de crèche. **Scolaire** : ATSEM, agents de restauration collective, animateurs. **Espaces publics** : jardiniers, élagueurs, agents de propreté urbaine, voirie. **Sécurité** : agents de la police municipale de Paris (créée en 2021), agents de surveillance. **Culture** : conservateurs, bibliothécaires, médiateurs culturels, agents des musées municipaux. **Technique** : électriciens, plombiers, agents de maintenance bâtiment. **Médico-social** : infirmiers, travailleurs sociaux, aides-soignantes en EHPAD. **Numérique** : chefs de projet SI, développeurs, data analysts. **Sport** : maîtres-nageurs, éducateurs sportifs. **Administration** : gestionnaires RH, comptables, chargés de mission politiques publiques.'
  },
  {
    codeInsee: '13055',
    titreH1: 'Travailler à la Ville de Marseille',
    titreSeo: 'Emploi Mairie de Marseille — 250 métiers, 1 500 recrutements/an | Wink Pages',
    metaDescription: 'Deuxième plus gros employeur public municipal de France, la Ville de Marseille compte 18 500 agents et recrute 1 500 personnes chaque année dans 250 métiers différents.',
    introduction: 'La Ville de Marseille est le deuxième employeur public municipal de France avec 18 500 agents répartis dans 250 métiers. Chaque année, 1 500 recrutements sont réalisés et plus de 1 000 stagiaires et apprentis sont accueillis. La collectivité gère les services publics d\'une métropole méditerranéenne unique, entre patrimoine urbain, littoral des Calanques et grande transformation urbaine.\n\nLa Ville se distingue par la présence des Marins-Pompiers, corps militaire unique en France, ainsi que par une police municipale renforcée pour la sécurité des habitants et des touristes (Marseille est la 2ᵉ destination touristique française).',
    pourquoiRejoindre: 'Travailler à Marseille, c\'est participer à l\'une des transformations urbaines les plus ambitieuses d\'Europe. L\'opération Euroméditerranée, lancée en 1995 et étendue avec Euroméditerranée 2, a déjà donné naissance à la Tour CMA CGM, la Tour La Marseillaise, la rénovation des Docks et l\'ouverture du MuCEM. Les prochaines phases incluent la corniche nord, le parc Aygalades et le pôle multimodal Gèze. L\'extension du tramway vers le nord viendra compléter cette mutation.\n\nLes agents interviennent sur un territoire à la fois historique et en pleine transformation, avec 1er port de France, littoral des Calanques et centre-ville rénové. Le coût de la vie plus abordable qu\'à Paris et un cadre balnéaire exceptionnel en font une destination attractive pour les fonctionnaires en mobilité.',
    cadreDeVie: 'Marseille est une métropole méditerranéenne au patrimoine millénaire, entre Vieux-Port, Panier, Notre-Dame de la Garde et calanques. La ville bénéficie d\'un climat ensoleillé toute l\'année, d\'un accès direct à la mer et de la proximité de la Provence et de la Camargue.\n\nLa cité phocéenne est le premier port de France et le deuxième de Méditerranée, un hub commercial et culturel majeur. Grand port maritime, plateforme aéroportuaire, terminaux de croisière : Marseille est une porte d\'entrée internationale. Les agents territoriaux profitent d\'un environnement de travail dynamique dans une ville en pleine mutation urbaine.',
    filieresMetiers: 'La Ville de Marseille recrute dans 250 métiers différents. **Sécurité** : agents de police municipale, marins-pompiers (recrutés via l\'armée), agents de surveillance. **Petite enfance** : puéricultrices, éducatrices de jeunes enfants, auxiliaires de puériculture. **Scolaire et animation** : ATSEM, animateurs périscolaires, agents de restauration. **Espaces publics** : agents de propreté, éboueurs, jardiniers, agents de voirie. **Culture** : agents des musées, bibliothécaires, médiateurs, régisseurs. **Sport** : maîtres-nageurs, éducateurs sportifs, agents d\'équipements sportifs. **Social et santé** : travailleurs sociaux, aides-soignantes, agents d\'accueil CCAS. **Administration** : gestionnaires, chargés de mission, agents d\'accueil, comptables. **Technique** : électriciens, plombiers, menuisiers, chauffagistes. **Environnement** : agents de tri, gestion des espaces verts, éducateurs à l\'environnement.'
  },
  {
    codeInsee: '31555',
    titreH1: 'Travailler à la Ville de Toulouse',
    titreSeo: 'Emploi Mairie de Toulouse — Ville rose recrute agents territoriaux | Wink Pages',
    metaDescription: 'Rejoignez la Ville de Toulouse, capitale européenne de l\'aérospatiale : recrutements dans le sport, l\'animation, la petite enfance, la police municipale et la culture.',
    introduction: 'La Ville de Toulouse, quatrième commune de France par sa population avec 515 000 habitants, est un pôle d\'emploi public majeur du Grand Sud-Ouest. La collectivité recrute sur un large éventail de métiers pour accompagner la croissance démographique et les grands projets d\'aménagement de la Ville rose.\n\nToulouse est aussi la capitale européenne de l\'aérospatiale, avec Airbus qui représente à lui seul 71 000 emplois dans la métropole. Ce dynamisme économique se reflète dans les besoins RH de la Ville, en particulier sur les métiers techniques, l\'ingénierie et le numérique.',
    pourquoiRejoindre: 'Toulouse Métropole conduit des projets d\'infrastructures majeurs qui transforment le territoire : la troisième ligne de métro (ligne C), un chantier à 3,15 milliards d\'euros avec une livraison prévue en 2028, ainsi que l\'extension de la ligne B vers Labège (249 M€). Le budget global de la métropole atteint 1,65 milliard d\'euros en 2024.\n\nLa Ville accompagne également la transition écologique, le développement des mobilités douces et la rénovation des équipements municipaux. Rejoindre Toulouse, c\'est intégrer une collectivité en croissance dans un écosystème économique de premier plan (Airbus, CNES, Thales) et une ville universitaire avec plus de 100 000 étudiants.',
    cadreDeVie: 'Toulouse offre l\'un des meilleurs cadres de vie de France : 2 112 heures de soleil par an, le canal du Midi classé UNESCO, un centre-ville en briques roses, et un patrimoine architectural unique. Trois universités, une vie culturelle riche (Théâtre du Capitole, Bemberg, festivals) et une gastronomie renommée en font une ville à taille humaine avec une forte attractivité.\n\nLa proximité des Pyrénées (moins de 2h), de la Méditerranée et de l\'océan Atlantique permet aux agents de bénéficier d\'un environnement naturel exceptionnel. Le coût de la vie reste modéré comparé aux autres grandes métropoles françaises.',
    filieresMetiers: 'La Ville de Toulouse recrute dans les filières suivantes. **Sport** : éducateurs sportifs, maîtres-nageurs, agents d\'équipements sportifs. **Animation socioculturelle** : animateurs enfance-jeunesse, coordinateurs de centres de loisirs. **Restauration collective** : cuisiniers, agents de service, gestionnaires de cuisines centrales. **EHPAD** : aides-soignantes, agents de soin, animateurs. **Espaces verts** : jardiniers, agents de fleurissement, arboriculteurs. **Police municipale** : agents de police, ASVP. **Hôtellerie et restauration événementielle**. **Sécurité et secours** : agents de surveillance, agents de sécurité incendie. **Technique** : électriciens, plombiers, agents de maintenance. **Administration** : gestionnaires, chargés d\'accueil, chargés de mission.'
  },
  {
    codeInsee: '06088',
    titreH1: 'Travailler à la Ville de Nice',
    titreSeo: 'Emploi Ville de Nice — Métropole 12 000 agents, avantages territoriaux | Wink Pages',
    metaDescription: 'La Métropole Nice Côte d\'Azur emploie 11 000 à 12 000 agents et propose de nombreux avantages : COS, aide au logement, formation, tickets restaurant et transport pris en charge.',
    introduction: 'La Métropole Nice Côte d\'Azur, dont la Ville de Nice est le cœur, compte entre 11 000 et 12 000 agents répartis entre la commune, le CCAS et la métropole. Chef-lieu du département des Alpes-Maritimes et capitale de la Côte d\'Azur, Nice est une ville en pleine transformation avec un patrimoine architectural classé à l\'UNESCO.\n\nLes recrutements sont dynamiques et rapides : 10 jours pour un poste d\'ASVP, 3 mois maximum pour une mutation en police municipale. La collectivité offre un accompagnement particulièrement structuré pour l\'intégration des nouveaux agents, incluant une aide au logement temporaire.',
    pourquoiRejoindre: 'La Métropole Nice Côte d\'Azur porte des projets d\'infrastructures majeurs : tramway ligne 4 vers Cagnes-sur-Mer, tramway ligne 5 (Pont-Michel — Drap), téléphérique au-dessus du Var, BHNS Cessole-Gambetta, et à plus long terme la LGV Nice-Paris. L\'Éco-Vallée sur la plaine du Var est l\'une des plus grandes opérations de développement durable de France.\n\nDepuis janvier 2022, la métropole a mis en place une Zone à Faibles Émissions mobilité (ZFE-m). Des programmes de rénovation urbaine sont en cours dans les quartiers Pasteur, L\'Ariane, Les Moulins et Notre-Dame. Les agents bénéficient d\'un régime indemnitaire attractif, de tickets restaurant, de la carte transport bus/tram, de la carte ZOU pour la sécurité, et du COS Métropole (social, culturel, loisirs, vacances).',
    cadreDeVie: 'Nice offre un cadre de vie exceptionnel : climat méditerranéen, Baie des Anges, Promenade des Anglais, patrimoine architectural classé à l\'UNESCO au titre de la villégiature d\'hiver. La ville accueille 5 millions de touristes par an et dispose de la 2ᵉ capacité hôtelière de France.\n\nSon aéroport est le 3ᵉ de France, permettant des liaisons directes vers l\'Europe et l\'international. La proximité des stations de ski des Alpes-Maritimes (moins d\'1h30), de Monaco et de l\'Italie enrichit encore le territoire. La collectivité propose un accompagnement en santé mentale et une prévention des risques psychosociaux.',
    filieresMetiers: 'Nice recrute dans un très large éventail de métiers. **Police municipale** : agents jour/nuit, ASVP, brigade cynophile. **Scolaire** : ATSEM, agents d\'entretien, agents de cantine. **Petite enfance** : directrices de crèche, éducatrices de jeunes enfants, puéricultrices, auxiliaires de puériculture. **Centres de loisirs** : animateurs 3-12 ans, animateurs adolescents. **Social/CCAS** : aides-soignantes EHPAD et à domicile, infirmières, auxiliaires de vie. **Culture et patrimoine** : conservateurs, médiateurs, agents de musées, régisseurs. **Sport** : maîtres-nageurs, éducateurs sportifs. **Santé** : infirmiers, cadres de santé, agents de service hospitalier. **Numérique** : chefs de projet SI, développeurs, agents de la DSI. **Environnement/déchets** : agents de collecte, éducateurs à l\'environnement. **BTP et technique** : électriciens, plombiers, chauffagistes, chauffeurs poids lourds.'
  },
  {
    codeInsee: '44109',
    titreH1: 'Travailler à la Ville de Nantes',
    titreSeo: 'Emploi Ville de Nantes — 150 métiers, télétravail, mutuelle | Wink Pages',
    metaDescription: 'Rejoignez Nantes, élue meilleure ville pour travailler : 9 200 agents, 150 métiers, télétravail jusqu\'à 3 jours/semaine, tickets restaurant, mutuelle et aide famille.',
    introduction: 'La Ville de Nantes et Nantes Métropole emploient ensemble environ 9 200 agents répartis dans 150 métiers et 70 directions différentes. Nantes Métropole a réalisé 1 472 recrutements en 2023 et accueilli 850 stagiaires, sans compter les 105 postes d\'apprentissage ouverts depuis août 2024. La collectivité recrute également des doctorants sous contrat CIFRE pour développer sa politique de recherche.\n\nNantes est reconnue comme l\'une des villes les plus agréables d\'Europe : élue par Time Magazine en 2004, désignée Capitale verte européenne en 2013, et Capital européenne de l\'Innovation en 2019.',
    pourquoiRejoindre: 'Rejoindre la Ville de Nantes, c\'est intégrer une administration régulièrement citée parmi les meilleures collectivités françaises pour ses conditions de travail. Les agents bénéficient de tickets restaurant à 10,90 €, d\'une participation employeur à la mutuelle et à la prévoyance, du comité social (loisirs, vacances, sorties culturelles et sportives), du remboursement des transports (jusqu\'à 300 €/an), d\'une allocation familiale complémentaire et d\'une aide à la garde d\'enfants de moins de 6 ans. Le télétravail est ouvert jusqu\'à 3 jours par semaine.\n\nDe grands projets structurent le territoire : transfert du CHU sur l\'Île de Nantes, réaménagement du quartier gare, trois nouvelles lignes de tramway sur l\'Île de Nantes, extension du réseau de chauffage urbain de 22 à 85 km, et création de trois forêts urbaines. Les quartiers Malakoff, Pré Gauchet et Euronantes sont également en pleine transformation.',
    cadreDeVie: 'Nantes est régulièrement classée parmi les villes les plus agréables à vivre en France et en Europe. La ville a été élue "meilleure ville de France pour travailler" par The Local et L\'Express. La qualité de vie repose sur un équilibre entre dynamisme économique, offre culturelle (Machines de l\'Île, Voyage à Nantes, Château des Ducs de Bretagne), et espaces naturels (bord de Loire, forêts, jardins).\n\nSa position en Bretagne historique, à moins d\'1h de l\'océan Atlantique, permet aux agents de profiter d\'un cadre naturel exceptionnel. Le prix de l\'immobilier reste plus accessible qu\'à Paris ou Lyon, et la ville est bien connectée : TGV vers Paris en 2h, aéroport international.',
    filieresMetiers: 'La Ville de Nantes recrute dans 150 métiers répartis en 70 directions. **Petite enfance** : puéricultrices, éducatrices de jeunes enfants, auxiliaires. **Éducation** : ATSEM, agents scolaires, animateurs périscolaires. **Sport** : maîtres-nageurs, éducateurs sportifs, agents d\'équipements. **Santé** : agents de santé publique, infirmiers, agents CCAS. **Numérique** : chefs de projet SI, développeurs, data. **Culture** : agents de bibliothèque, médiateurs culturels, agents de musées. **Communication** : chargés de communication, community managers, graphistes. **Sécurité** : agents de police municipale, ASVP. **BTP** : conducteurs de travaux, techniciens bâtiment, chargés d\'opérations. **Environnement et eau** : techniciens réseaux, ingénieurs, agents de collecte. **Administration** : comptables, chargés des marchés publics, secrétaires, cadres.'
  },
  {
    codeInsee: '34172',
    titreH1: 'Travailler à la Ville de Montpellier',
    titreSeo: 'Emploi Ville de Montpellier — RTT, télétravail, transport gratuit | Wink Pages',
    metaDescription: 'Rejoignez Montpellier : jusqu\'à 28 jours de RTT, télétravail 2 jours/semaine, transports en commun gratuits, mutuelle et prêt de vélo. 7ᵉ ville de France.',
    introduction: 'La Ville de Montpellier est la 7ᵉ plus grande ville de France et l\'une des rares métropoles françaises à connaître une croissance démographique continue depuis 1945. Cette dynamique se traduit par de nombreux recrutements pour accompagner les besoins des habitants et le développement urbain. La métropole s\'étend sur 31 communes.\n\nAvec 70 000 étudiants représentant 21% de la population, Montpellier est la 3ᵉ ville étudiante de France par habitant. Cette jeunesse structurante nourrit l\'écosystème culturel, économique et social.',
    pourquoiRejoindre: 'La Ville de Montpellier propose un package d\'avantages agents parmi les plus complets de France : 6 à 28 jours de RTT (selon le cycle de travail choisi), télétravail jusqu\'à 2 jours par semaine selon les postes, mutuelle et prévoyance avec participation employeur, transports en commun gratuits pour les habitants de la métropole, prêt de vélo, tickets restaurant, formation continue et journées pédagogiques, et politique active de mobilité interne.\n\nDe grands projets structurent le territoire : 5 lignes de tramway opérationnelles avec extension de la ligne 5 (Ovalie, Hôpitaux-Facultés), l\'éco-quartier Ovalie sur 35 hectares, le développement de Port Marianne (20 000 logements), le pôle d\'affaires Cambacérès (300 000 m² de bureaux sur 350 hectares) et les Prés d\'Arènes (8 000 logements). Le dédoublement de l\'A9, l\'Arena Montpellier et le Zénith Sud complètent ce portefeuille de projets.',
    cadreDeVie: 'Montpellier bénéficie d\'un climat méditerranéen exceptionnel, à quelques kilomètres de la mer (Palavas, La Grande-Motte) et à moins d\'une heure des Cévennes. La ville est connue pour son centre historique piétonnier (l\'Écusson), son architecture contemporaine emblématique (quartier Antigone) et sa vie culturelle riche.\n\nLes 14 médiathèques en réseau, les nombreux festivals (Radio France, Danse, Cinéma), et un tissu associatif dense composent un cadre de vie particulièrement attractif pour les jeunes actifs et les familles. La croissance démographique continue témoigne de cette attractivité.',
    filieresMetiers: 'La Ville de Montpellier recrute dans un large panel de métiers. **Administration** : chargés de communication, RH, comptables, agents administratifs. **Police municipale** : agents de police, ASVP. **Voirie** : agents de voirie, agents de feux de signalisation. **Sport** : agents techniques d\'équipements sportifs, maîtres-nageurs. **BTP** : électriciens, plombiers, agents de bâtiment. **Social** : aides à domicile, assistantes sociales, infirmières CCAS et EHPAD. **Petite enfance** : puéricultrices, éducatrices de jeunes enfants. **Culture** : médiateurs de musée, programmateurs artistiques, bibliothécaires. **Sport** : éducateurs sportifs. **Espaces verts** : jardiniers, agents de fleurissement. **Environnement** : agents de gestion des déchets. **Cimetières** : agents d\'entretien et d\'accueil.'
  },
  {
    codeInsee: '67482',
    titreH1: 'Travailler à la Ville de Strasbourg',
    titreSeo: 'Emploi Ville de Strasbourg — Congés, télétravail, CNAS | Wink Pages',
    metaDescription: 'Ville et Eurométropole de Strasbourg : 4 formules horaires (27 à 55 jours), télétravail, restaurants collectifs, transport 75% remboursé, CNAS et Vélhop.',
    introduction: 'La Ville et l\'Eurométropole de Strasbourg forment un employeur public de premier plan à la croisée de la France et de l\'Allemagne. Strasbourg est la 2ᵉ ville diplomatique de France, siège du Parlement européen, du Conseil de l\'Europe et de la Cour européenne des Droits de l\'Homme.\n\nL\'Eurométropole bénéficie d\'un budget de 1,89 milliard d\'euros et intervient sur 33 communes. Sa position transfrontalière unique — l\'Allemagne à 5 minutes — en fait un territoire européen par nature.',
    pourquoiRejoindre: 'Strasbourg propose l\'un des paquets d\'avantages agents les plus riches de France. Quatre formules horaires au choix (de 27 à 55,5 jours de congés/RTT), télétravail (avec accord hiérarchique), deux restaurants collectifs subventionnés, mutuelle et prévoyance avec aide financière, remboursement des transports à 75%, service Vélhop à 1 €/mois, forfait mobilité durable (30+ jours/an de vélo ou covoiturage), clubs personnel et sports (logements vacances, voyages, 20+ activités sportives, tarifs préférentiels), adhésion au CNAS (prêts, aides, fournitures scolaires, chèques vacances), tarifs préférentiels culture et sport via le badge agent, et conciergerie d\'entreprise.\n\nDe grands projets transforment le territoire : l\'opération Deux-Rives sur 250 hectares (9 000 logements le long de l\'axe Strasbourg-Kehl), l\'extension du tramway ligne D vers Kehl (inaugurée en 2017 avec un nouveau pont sur le Rhin), et la ceinture verte qui préserve les espaces naturels (maximum 20% d\'artificialisation au sol).',
    cadreDeVie: 'Strasbourg est une ville européenne au patrimoine exceptionnel : Grande-Île classée UNESCO, Cathédrale gothique, Petite France, quartier des institutions européennes. Avec plus de 85 000 étudiants (289 pour 1 000 habitants) et 20% d\'étudiants européens et internationaux, la ville est particulièrement cosmopolite.\n\nL\'Opéra national du Rhin, le Théâtre national de Strasbourg et une vie culturelle transfrontalière (avec Kehl et l\'Allemagne) en font un cadre professionnel et personnel très riche. La proximité des Vosges, de la Forêt-Noire et des vignobles alsaciens complète l\'offre.',
    filieresMetiers: 'La Ville et l\'Eurométropole recrutent dans de nombreux domaines. **Administration** : chargés de prestations, agents d\'accueil. **Sport** : maîtres-nageurs, éducateurs sportifs, agents d\'équipements. **Sécurité** : agents d\'accueil et de surveillance. **Social** : travailleurs sociaux, éducateurs, agents CCAS. **Bibliothèques** : bibliothécaires, médiateurs. **Géomatique** : techniciens SIG, cartographes. **Mécanique** : mécaniciens de flotte, agents de maintenance. **Espaces verts** : jardiniers, arboriculteurs. **Petite enfance** : puéricultrices, auxiliaires, éducatrices. **Technique** : électriciens, plombiers, chauffagistes. **Culture** : régisseurs, médiateurs, agents des musées, conservateurs.'
  },
  {
    codeInsee: '33063',
    titreH1: 'Travailler à la Ville de Bordeaux',
    titreSeo: 'Emploi Ville de Bordeaux — 4 100 agents, 130 métiers, télétravail | Wink Pages',
    metaDescription: 'Rejoignez la Ville de Bordeaux : 4 100 agents, 130 métiers, 1 200 recrutements/an, 35 jours de congés, mutuelle et prévoyance, transport 75% remboursé.',
    introduction: 'La Ville de Bordeaux et son CCAS emploient 4 100 agents répartis dans 130 métiers. Chaque année, 1 200 recrutements sont réalisés (tous types confondus), 43 apprentis sont accueillis (du BEP-CAP au Master) et environ 500 stagiaires. La collectivité s\'engage sur l\'égalité femmes-hommes (69,3% de femmes dans l\'encadrement en 2023) et l\'inclusion (6,6% d\'agents en situation de handicap).\n\nAvec un budget formation de 1,3 million d\'euros en 2023, la Ville affirme sa politique de développement des compétences et d\'accompagnement des parcours professionnels.',
    pourquoiRejoindre: 'La Ville de Bordeaux offre un package d\'avantages parmi les plus attractifs pour les agents territoriaux. Horaires flexibles et télétravail, minimum 35 jours de congés + RTT, mutuelle et prévoyance avec participation employeur, transport en commun remboursé à 75%, accès à un restaurant collectif, offres culturelles, sportives et bien-être, et conciergerie solidaire pour faciliter le quotidien.\n\nRejoindre Bordeaux, c\'est aussi participer à des projets structurants pour l\'agglomération : Bordeaux-Euratlantique (quartier d\'affaires autour de la gare Saint-Jean), reconversion des Bassins à flot, Pont Simone-Veil, Cité numérique, station d\'épuration Louis Fargue (96,1 M€), et le développement d\'un réseau cyclable de 1 500 km dont 270 km de vélo express. Les zones économiques Aéroparc (aéronautique), Bioparc (santé et biotech) et Ecoparc (économie durable) offrent également de nombreuses opportunités pour les fonctions techniques et de gestion de projet.',
    cadreDeVie: 'Bordeaux est inscrite au patrimoine mondial de l\'UNESCO pour son "Port de la Lune" — un ensemble urbain classique du XVIIIᵉ siècle. Plus de 400 monuments historiques sont protégés, ce qui en fait l\'une des villes les plus riches en patrimoine de France. La ville compte plus de 100 000 étudiants et un pôle aérospatial et défense majeur (Dassault, ArianeGroup, Safran, Thales).\n\nLe vignoble bordelais, mondialement connu, entoure la métropole. Le réseau de tramway est particulièrement dense et les mobilités douces sont fortement développées. La proximité de l\'océan Atlantique (moins d\'1h) et du bassin d\'Arcachon offre un cadre de vie recherché par les nouveaux arrivants.',
    filieresMetiers: 'La Ville de Bordeaux recrute dans 130 métiers. **Prévention et sécurité** : agents de police municipale, ASVP, agents de médiation. **Scolaire** : ATSEM, agents de service, agents d\'accompagnement des enfants en situation de handicap. **Petite enfance** : personnels de crèche, directrices, soignantes. **Séniors** : personnel EHPAD (infirmières, aides-soignantes), portage repas, animateurs. **Culture** : agents des musées, personnels d\'enseignement artistique, bibliothécaires. **Sport** : animateurs sportifs, maîtres-nageurs. **Médico-social** : travailleurs sociaux, médiateurs. **Administration** : gestionnaires, chargés de mission, agents d\'accueil, secrétaires.'
  },
  {
    codeInsee: '59350',
    titreH1: 'Travailler à la Ville de Lille',
    titreSeo: 'Emploi Ville de Lille — 4 400 agents, 200 métiers, primes | Wink Pages',
    metaDescription: 'Rejoignez Lille : 4 400 agents, 200 métiers, 400 recrutements/an, cycles flexibles, télétravail, primes d\'expertise, COS, prévoyance sans carence et coaching.',
    introduction: 'La Ville de Lille (incluant les communes associées d\'Hellemmes et Lomme) emploie 4 400 agents répartis dans plus de 200 métiers différents, avec plus de 400 recrutements chaque année. La collectivité dessert 252 000 habitants et gère un large éventail de services publics de proximité.\n\nLille est une ville d\'art et d\'histoire (label 2004) et fut Capitale européenne de la culture en 2004. Son positionnement géographique unique en fait un carrefour européen : Paris à 1h, Londres à 1h20 et Bruxelles à 35 minutes en TGV et Eurostar.',
    pourquoiRejoindre: 'La Ville de Lille propose un environnement de travail structuré et bienveillant. Les agents bénéficient de cycles de travail flexibles avec possibilité de télétravail, de primes régulières (notamment liées à l\'expertise), d\'un compte épargne temps, d\'une mutuelle avec participation employeur, d\'une prévoyance sans carence (maintien du salaire dès le 1er jour d\'arrêt), du remboursement du transport en commun, de véhicules partagés, d\'un restaurant collectif, du COS (Comité des Œuvres Sociales), d\'une politique de formation continue et d\'un coaching professionnel pour les managers.\n\nUn accent particulier est mis sur l\'accompagnement du handicap et le bien-être au travail, avec la présence de psychologues du travail. La Ville pilote également de grands événements comme la Braderie de Lille (plus grand marché aux puces d\'Europe) et Lille Plage, offrant aux agents l\'opportunité de participer à des projets d\'envergure.',
    cadreDeVie: 'Lille est une ville d\'art et d\'histoire au patrimoine flamand remarquable : Vieille-Bourse, Grand\'Place, hospice Comtesse, beffroi. La ville compte plus de 110 000 étudiants, l\'un des principaux centres universitaires de France. Son offre culturelle est particulièrement dense (LaM, Palais des Beaux-Arts, Opéra, festival Séries Mania).\n\nLe coût de l\'immobilier reste attractif comparé à Paris, tandis que la position transfrontalière (Belgique à 30 minutes) et le hub ferroviaire (TGV, Eurostar, Thalys) offrent une ouverture européenne exceptionnelle. Le métro automatique VAL, plus ancien réseau automatique au monde, dessert efficacement la métropole.',
    filieresMetiers: 'La Ville de Lille recrute dans 200 métiers différents. **Éducation** : ATSEM, agents scolaires, animateurs. **Maintenance** : agents techniques, plombiers, électriciens. **Santé** : agents CCAS, aides-soignantes. **Nature et espaces verts** : jardiniers, agents de fleurissement, éboueurs. **État civil** : officiers d\'état civil, agents d\'accueil. **Élagage** : élagueurs certifiés, techniciens arboricoles. **Électricité** : électriciens de bâtiment et de voirie. **Sport** : gestionnaires d\'équipements sportifs, maîtres-nageurs. **Stationnement** : agents ASVP, contrôleurs. **Musées** : agents d\'accueil, médiateurs culturels, guides. **Jardinage** : agents des espaces verts, horticulteurs. **Zoo de Lille** : soigneurs animaliers. **Animation événementielle** : agents pour Lille Plage, événements sportifs internationaux.'
  }
]

async function main() {
  logger.info(`Insertion de ${CONTENUS.length} contenus enrichis...`)

  let created = 0, updated = 0, skipped = 0

  for (const contenu of CONTENUS) {
    const collectivite = await prisma.collectivite.findUnique({
      where: { codeInsee: contenu.codeInsee },
      select: { id: true, nom: true }
    })

    if (!collectivite) {
      logger.warn(`Collectivité non trouvée: ${contenu.codeInsee}`)
      skipped++
      continue
    }

    const existing = await prisma.contenuPage.findUnique({
      where: { collectiviteId: collectivite.id }
    })

    const data = {
      titreH1: contenu.titreH1,
      titreSeo: contenu.titreSeo,
      metaDescription: contenu.metaDescription,
      introduction: contenu.introduction,
      pourquoiRejoindre: contenu.pourquoiRejoindre,
      cadreDeVie: contenu.cadreDeVie,
      filieresMetiers: contenu.filieresMetiers,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      modeleIa: 'claude-sonnet-4.5-manual-research',
      promptVersion: 'v1'
    }

    if (existing) {
      await prisma.contenuPage.update({
        where: { collectiviteId: collectivite.id },
        data
      })
      updated++
      logger.info(`  ✓ Mis à jour: ${collectivite.nom}`)
    } else {
      await prisma.contenuPage.create({
        data: {
          collectiviteId: collectivite.id,
          ...data
        }
      })
      created++
      logger.info(`  + Créé: ${collectivite.nom}`)
    }
  }

  logger.success(`Terminé: ${created} créés, ${updated} mis à jour, ${skipped} skipped`)
}

main()
  .catch((e) => {
    logger.error(e)
    process.exit(1)
  })
  .finally(() => disconnect())
