-- CreateTable
CREATE TABLE "ressources" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
    "titre" TEXT NOT NULL,
    "chapo" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "auteur" TEXT,
    "tempsLecture" INTEGER,
    "imageUrl" TEXT,
    "enAvant" BOOLEAN NOT NULL DEFAULT false,
    "thematiques" TEXT[],
    "personas" TEXT[],
    "typesCollectivite" TEXT[],
    "versants" TEXT[],
    "faq" JSONB NOT NULL DEFAULT '[]',
    "sources" JSONB NOT NULL DEFAULT '[]',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "titreSeo" TEXT,
    "metaDescription" TEXT,
    "fichierSource" TEXT,
    "empreinte" TEXT,
    "datePublication" TIMESTAMPTZ(0) NOT NULL,
    "dateMiseAJour" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "ressources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_inscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "typeCollectivite" TEXT,
    "consentement" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "confirmeAt" TIMESTAMPTZ(0),
    "desinscritAt" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ressources_type_statut_datePublication_idx" ON "ressources"("type", "statut", "datePublication");

-- CreateIndex
CREATE INDEX "ressources_statut_enAvant_idx" ON "ressources"("statut", "enAvant");

-- CreateIndex
CREATE UNIQUE INDEX "ressources_type_slug_key" ON "ressources"("type", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_inscriptions_email_key" ON "newsletter_inscriptions"("email");
