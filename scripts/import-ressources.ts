/**
 * Importe les contenus de content/ressources/<type>/<slug>.md dans la table ressources.
 *
 *   npx tsx scripts/import-ressources.ts            # importe tout
 *   npx tsx scripts/import-ressources.ts --check    # valide les fichiers sans écrire en base
 *
 * Un fichier supprimé du dépôt repasse en BROUILLON (il n'est jamais effacé de la base).
 */
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'
import { RESSOURCE_TYPES, THEMATIQUES, TYPES_COLLECTIVITE, VERSANTS } from '../shared/utils/ressources.js'

const ROOT = join(import.meta.dirname, '..', 'content', 'ressources')
const CHECK_ONLY = process.argv.includes('--check')

const dateSchema = z.union([z.string(), z.date()]).transform((v, ctx) => {
  const d = v instanceof Date ? v : new Date(v)
  if (Number.isNaN(d.getTime())) {
    ctx.addIssue({ code: 'custom', message: `Date invalide : ${String(v)}` })
    return z.NEVER
  }
  return d
})

const frontmatterSchema = z.object({
  titre: z.string().min(10).max(140),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  type: z.string().transform(t => t.toUpperCase()).pipe(z.enum(RESSOURCE_TYPES)),
  statut: z.enum(['brouillon', 'publie']).default('brouillon'),
  chapo: z.string().min(20).max(260),
  datePublication: dateSchema,
  dateMiseAJour: dateSchema.optional(),
  auteur: z.string().optional(),
  tempsLecture: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
  enAvant: z.boolean().default(false),
  thematiques: z.array(z.enum(Object.keys(THEMATIQUES) as [string, ...string[]])).default([]),
  personas: z.array(z.string().regex(/^P[1-6]$/)).default([]),
  typesCollectivite: z.array(z.enum(Object.keys(TYPES_COLLECTIVITE) as [string, ...string[]])).default(['tous']),
  versants: z.array(z.enum(Object.keys(VERSANTS) as [string, ...string[]])).default(['territoriale']),
  faq: z.array(z.object({ question: z.string(), reponse: z.string() })).default([]),
  sources: z.array(z.object({ titre: z.string(), url: z.string().url() })).min(1, 'Au moins une source officielle est requise'),
  meta: z.record(z.string(), z.unknown()).default({}),
  titreSeo: z.string().max(70).optional(),
  metaDescription: z.string().max(170).optional()
})

function splitFrontmatter(raw: string): { data: unknown, body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) throw new Error('En-tête YAML manquant (bloc --- … ---)')
  return { data: parseYaml(match[1]!), body: match[2]!.trim() }
}

function readingTime(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

async function listFiles(): Promise<string[]> {
  const files: string[] = []
  for (const dir of await readdir(ROOT, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    for (const file of await readdir(join(ROOT, dir.name))) {
      if (file.endsWith('.md')) files.push(join(ROOT, dir.name, file))
    }
  }
  return files.sort()
}

async function main() {
  const files = await listFiles()
  logger.info(`[Ressources] ${files.length} fichier(s) trouvé(s)`)

  const errors: string[] = []
  const seen = new Set<string>()
  let written = 0

  for (const file of files) {
    const rel = relative(join(ROOT, '..', '..'), file)
    try {
      const raw = await readFile(file, 'utf8')
      const { data, body } = splitFrontmatter(raw)
      const fm = frontmatterSchema.parse(data)

      const folder = rel.split('/').at(-2)
      if (folder?.toUpperCase() !== fm.type) throw new Error(`Type « ${fm.type} » incohérent avec le dossier « ${folder} »`)
      if (!file.endsWith(`/${fm.slug}.md`)) throw new Error(`Le slug « ${fm.slug} » doit correspondre au nom du fichier`)
      if (/^#\s/m.test(body)) throw new Error('Le corps ne doit pas contenir de titre de niveau 1')
      if (body.length < 300) throw new Error('Corps trop court (300 caractères minimum)')

      const key = `${fm.type}/${fm.slug}`
      if (seen.has(key)) throw new Error(`Doublon : ${key}`)
      seen.add(key)

      if (CHECK_ONLY) continue

      const empreinte = createHash('sha256').update(raw).digest('hex')
      const values = {
        statut: fm.statut === 'publie' ? 'PUBLIE' : 'BROUILLON',
        titre: fm.titre,
        chapo: fm.chapo,
        contenu: body,
        auteur: fm.auteur ?? null,
        tempsLecture: fm.tempsLecture ?? readingTime(body),
        imageUrl: fm.imageUrl ?? null,
        enAvant: fm.enAvant,
        thematiques: fm.thematiques,
        personas: fm.personas,
        typesCollectivite: fm.typesCollectivite,
        versants: fm.versants,
        faq: fm.faq,
        sources: fm.sources,
        meta: fm.meta as object,
        titreSeo: fm.titreSeo ?? null,
        metaDescription: fm.metaDescription ?? null,
        fichierSource: rel,
        empreinte,
        datePublication: fm.datePublication,
        dateMiseAJour: fm.dateMiseAJour ?? null
      }

      await prisma.ressource.upsert({
        where: { type_slug: { type: fm.type, slug: fm.slug } },
        create: { type: fm.type, slug: fm.slug, ...values },
        update: values
      })
      written++
    } catch (error) {
      const message = error instanceof z.ZodError
        ? error.issues.map(i => `${i.path.join('.') || '(racine)'} : ${i.message}`).join(' ; ')
        : (error as Error).message
      errors.push(`${rel} — ${message}`)
    }
  }

  if (!CHECK_ONLY && errors.length === 0) {
    const orphans = await prisma.ressource.findMany({ where: { statut: 'PUBLIE' }, select: { id: true, type: true, slug: true } })
    const toUnpublish = orphans.filter(r => !seen.has(`${r.type}/${r.slug}`))
    if (toUnpublish.length) {
      await prisma.ressource.updateMany({ where: { id: { in: toUnpublish.map(r => r.id) } }, data: { statut: 'BROUILLON' } })
      logger.warn(`[Ressources] ${toUnpublish.length} ressource(s) sans fichier repassée(s) en brouillon`)
    }
  }

  for (const e of errors) logger.error(e)
  logger.info(`[Ressources] ${CHECK_ONLY ? 'Validés' : 'Importés'} : ${CHECK_ONLY ? files.length - errors.length : written} · Erreurs : ${errors.length}`)
  if (errors.length) process.exitCode = 1
}

main()
  .catch((error) => {
    logger.error(error)
    process.exitCode = 1
  })
  .finally(disconnect)
