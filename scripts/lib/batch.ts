import { logger } from './logger.js'

export async function processBatch<T>(
  items: T[],
  processor: (item: T) => Promise<void>,
  options?: { batchSize?: number, label?: string }
) {
  const batchSize = options?.batchSize ?? 500
  const label = options?.label ?? 'batch'
  const total = items.length

  for (let i = 0; i < total; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await Promise.all(batch.map(processor))
    const processed = Math.min(i + batchSize, total)
    logger.info(`[${label}] ${processed}/${total} (${Math.floor((processed / total) * 100)}%)`)
  }
}

export async function processSequential<T>(
  items: T[],
  processor: (item: T, index: number) => Promise<void>,
  options?: { logEvery?: number, label?: string }
) {
  const logEvery = options?.logEvery ?? 500
  const label = options?.label ?? 'sequential'
  const total = items.length

  for (let i = 0; i < total; i++) {
    await processor(items[i], i)
    if ((i + 1) % logEvery === 0 || i === total - 1) {
      logger.info(`[${label}] ${i + 1}/${total} (${Math.floor(((i + 1) / total) * 100)}%)`)
    }
  }
}
