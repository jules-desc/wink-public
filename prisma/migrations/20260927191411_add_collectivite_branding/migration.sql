-- CreateTable
CREATE TABLE "collectivite_brandings" (
    "id" TEXT NOT NULL,
    "collectiviteId" TEXT NOT NULL,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "headingFont" TEXT,
    "bodyFont" TEXT,
    "logoMainUrl" TEXT,
    "logoIconUrl" TEXT,
    "borderRadius" TEXT,
    "colorsConfig" JSONB NOT NULL DEFAULT '{}',
    "logosConfig" JSONB NOT NULL DEFAULT '{}',
    "typographyConfig" JSONB NOT NULL DEFAULT '{}',
    "visualsConfig" JSONB NOT NULL DEFAULT '{}',
    "source" TEXT NOT NULL DEFAULT 'EXTRACTED',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "extractedFrom" TEXT,
    "extractedBy" TEXT,
    "confidenceScore" TEXT,
    "notes" TEXT,
    "validatedAt" TIMESTAMPTZ(0),
    "validatedBy" TEXT,
    "publishedAt" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "collectivite_brandings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collectivite_brandings_collectiviteId_key" ON "collectivite_brandings"("collectiviteId");

-- CreateIndex
CREATE INDEX "collectivite_brandings_status_idx" ON "collectivite_brandings"("status");

-- AddForeignKey
ALTER TABLE "collectivite_brandings" ADD CONSTRAINT "collectivite_brandings_collectiviteId_fkey" FOREIGN KEY ("collectiviteId") REFERENCES "collectivites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
