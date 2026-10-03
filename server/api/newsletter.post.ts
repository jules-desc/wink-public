import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  typeCollectivite: z.string().max(40).optional(),
  consentement: z.literal(true),
  source: z.string().max(200).optional()
})

// Inscription à la newsletter mensuelle des employeurs publics.
export default defineEventHandler(async (event) => {
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail ou consentement manquant' })
  }
  const { email, typeCollectivite, source } = parsed.data

  await prisma.newsletterInscription.upsert({
    where: { email },
    create: { email, typeCollectivite, consentement: true, source },
    update: { typeCollectivite, consentement: true, desinscritAt: null }
  })

  return { ok: true }
})
