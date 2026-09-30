-- CreateTable
CREATE TABLE "collectivites" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "nomCourt" TEXT,
    "type" TEXT NOT NULL,
    "sousType" TEXT,
    "codeInsee" TEXT,
    "codeSiren" TEXT,
    "codesPostaux" TEXT[],
    "departementCode" TEXT,
    "departementNom" TEXT,
    "regionCode" TEXT,
    "regionNom" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "adresseNumero" TEXT,
    "adresseRue" TEXT,
    "adresseVille" TEXT,
    "adresseCodePostal" TEXT,
    "adresseFormatee" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "siteWeb" TEXT,
    "horaires" TEXT,
    "logoUrl" TEXT,
    "blasonUrl" TEXT,
    "bannerUrl" TEXT,
    "description" TEXT,
    "primaryColor" TEXT,
    "socialMediaLinks" JSONB DEFAULT '{}',
    "population" INTEGER,
    "effectifs" INTEGER,
    "budgetTotal" DECIMAL(18,2),
    "employerType" TEXT NOT NULL DEFAULT 'PUBLIC',
    "businessSector" TEXT DEFAULT 'PUBLIC_SERVICE',
    "benefits" TEXT[],
    "competences" TEXT[],
    "membresInsee" TEXT[],
    "hubspotId" TEXT,
    "linkedinUrl" TEXT,
    "nomDeDomaine" TEXT,
    "pageStatus" TEXT NOT NULL DEFAULT 'AUTO',
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" TIMESTAMPTZ(0),
    "claimedByUserId" TEXT,
    "deletedAt" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "collectivites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offres_emploi" (
    "id" TEXT NOT NULL,
    "collectiviteId" TEXT NOT NULL,
    "sourceExternalId" TEXT,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "urlSource" TEXT,
    "source" TEXT NOT NULL,
    "contractType" TEXT,
    "workSchedule" TEXT,
    "remote" TEXT,
    "contractDuration" INTEGER,
    "contractDurationUnit" TEXT,
    "adresseVille" TEXT,
    "adresseCodePostal" TEXT,
    "adresseDepartement" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "salaryMode" TEXT,
    "salaryMin" DECIMAL(18,3),
    "salaryMax" DECIMAL(18,3),
    "salaryCurrency" TEXT DEFAULT 'EUR',
    "salaryPeriod" TEXT DEFAULT 'YEAR',
    "experience" TEXT,
    "education" TEXT,
    "employerType" TEXT NOT NULL DEFAULT 'PUBLIC',
    "publicJobTypeCode" TEXT,
    "publicLegalGroundCode" TEXT,
    "publicJobCreationReasonCode" TEXT,
    "publicGradeCodes" TEXT[],
    "publicGradeCategories" TEXT[],
    "publicGradeFrameworkCodes" TEXT[],
    "publicGradeSectorCodes" TEXT[],
    "publicOccupationCodes" TEXT[],
    "publicOccupationSubfamilyCodes" TEXT[],
    "publicOccupationFamilyCodes" TEXT[],
    "publicContractualEligibility" BOOLEAN,
    "publicMissionsDescription" TEXT,
    "datePublication" TIMESTAMPTZ(0),
    "dateExpiration" TIMESTAMPTZ(0),
    "dateLimite" TIMESTAMPTZ(0),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "offres_emploi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenus_page" (
    "id" TEXT NOT NULL,
    "collectiviteId" TEXT NOT NULL,
    "titreSeo" TEXT,
    "metaDescription" TEXT,
    "titreH1" TEXT,
    "introduction" TEXT,
    "pourquoiRejoindre" TEXT,
    "cadreDeVie" TEXT,
    "filieresMetiers" TEXT,
    "sectionsExtra" JSONB NOT NULL DEFAULT '[]',
    "structuredDataJson" JSONB,
    "modeleIa" TEXT,
    "promptVersion" TEXT,
    "dateGeneration" TIMESTAMPTZ(0),
    "scoreQualite" DOUBLE PRECISION,
    "contenuManuel" JSONB DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "contenus_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donnees_publiques" (
    "id" TEXT NOT NULL,
    "collectiviteId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "typeDonnee" TEXT NOT NULL,
    "donnees" JSONB NOT NULL,
    "hash" TEXT,
    "dateCollecte" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateSource" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donnees_publiques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_requests" (
    "id" TEXT NOT NULL,
    "collectiviteId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "fonction" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "emailDomainMatch" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "notes" TEXT,
    "assignedTo" TEXT,
    "contactedAt" TIMESTAMPTZ(0),
    "convertedAt" TIMESTAMPTZ(0),
    "deletedAt" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "claim_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_sources" (
    "id" TEXT NOT NULL,
    "collectiviteId" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "recordsTotal" INTEGER,
    "recordsImported" INTEGER,
    "recordsUpdated" INTEGER,
    "recordsSkipped" INTEGER,
    "recordsErrored" INTEGER,
    "startedAt" TIMESTAMPTZ(0),
    "completedAt" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collectivites_slug_key" ON "collectivites"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collectivites_codeInsee_key" ON "collectivites"("codeInsee");

-- CreateIndex
CREATE INDEX "collectivites_type_idx" ON "collectivites"("type");

-- CreateIndex
CREATE INDEX "collectivites_departementCode_idx" ON "collectivites"("departementCode");

-- CreateIndex
CREATE INDEX "collectivites_regionCode_idx" ON "collectivites"("regionCode");

-- CreateIndex
CREATE INDEX "collectivites_pageStatus_idx" ON "collectivites"("pageStatus");

-- CreateIndex
CREATE INDEX "collectivites_type_departementCode_idx" ON "collectivites"("type", "departementCode");

-- CreateIndex
CREATE INDEX "offres_emploi_collectiviteId_idx" ON "offres_emploi"("collectiviteId");

-- CreateIndex
CREATE INDEX "offres_emploi_collectiviteId_status_idx" ON "offres_emploi"("collectiviteId", "status");

-- CreateIndex
CREATE INDEX "offres_emploi_status_dateExpiration_idx" ON "offres_emploi"("status", "dateExpiration");

-- CreateIndex
CREATE INDEX "offres_emploi_source_idx" ON "offres_emploi"("source");

-- CreateIndex
CREATE UNIQUE INDEX "offres_emploi_source_sourceExternalId_key" ON "offres_emploi"("source", "sourceExternalId");

-- CreateIndex
CREATE UNIQUE INDEX "contenus_page_collectiviteId_key" ON "contenus_page"("collectiviteId");

-- CreateIndex
CREATE INDEX "donnees_publiques_collectiviteId_idx" ON "donnees_publiques"("collectiviteId");

-- CreateIndex
CREATE INDEX "donnees_publiques_collectiviteId_source_typeDonnee_idx" ON "donnees_publiques"("collectiviteId", "source", "typeDonnee");

-- CreateIndex
CREATE INDEX "claim_requests_collectiviteId_idx" ON "claim_requests"("collectiviteId");

-- CreateIndex
CREATE INDEX "claim_requests_status_idx" ON "claim_requests"("status");

-- CreateIndex
CREATE INDEX "claim_requests_email_idx" ON "claim_requests"("email");

-- CreateIndex
CREATE INDEX "import_sources_source_status_idx" ON "import_sources"("source", "status");

-- AddForeignKey
ALTER TABLE "offres_emploi" ADD CONSTRAINT "offres_emploi_collectiviteId_fkey" FOREIGN KEY ("collectiviteId") REFERENCES "collectivites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contenus_page" ADD CONSTRAINT "contenus_page_collectiviteId_fkey" FOREIGN KEY ("collectiviteId") REFERENCES "collectivites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donnees_publiques" ADD CONSTRAINT "donnees_publiques_collectiviteId_fkey" FOREIGN KEY ("collectiviteId") REFERENCES "collectivites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_requests" ADD CONSTRAINT "claim_requests_collectiviteId_fkey" FOREIGN KEY ("collectiviteId") REFERENCES "collectivites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_sources" ADD CONSTRAINT "import_sources_collectiviteId_fkey" FOREIGN KEY ("collectiviteId") REFERENCES "collectivites"("id") ON DELETE SET NULL ON UPDATE CASCADE;
