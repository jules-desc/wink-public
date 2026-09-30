import { prisma } from './prisma.js'
import { logger } from './logger.js'

interface ImportStats {
  recordsTotal?: number
  recordsImported?: number
  recordsUpdated?: number
  recordsSkipped?: number
  recordsErrored?: number
}

export async function startImport(source: string): Promise<string> {
  const record = await prisma.importSource.create({
    data: {
      source,
      status: 'RUNNING',
      startedAt: new Date()
    }
  })
  logger.info(`[Import] Started: ${source} (id: ${record.id})`)
  return record.id
}

export async function completeImport(id: string, stats: ImportStats) {
  await prisma.importSource.update({
    where: { id },
    data: {
      status: 'SUCCESS',
      completedAt: new Date(),
      ...stats
    }
  })
  logger.success(`[Import] Completed: ${stats.recordsImported ?? 0} imported, ${stats.recordsUpdated ?? 0} updated, ${stats.recordsSkipped ?? 0} skipped, ${stats.recordsErrored ?? 0} errors`)
}

export async function failImport(id: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  await prisma.importSource.update({
    where: { id },
    data: {
      status: 'ERROR',
      completedAt: new Date(),
      errorMessage: message
    }
  })
  logger.error(`[Import] Failed: ${message}`)
}
