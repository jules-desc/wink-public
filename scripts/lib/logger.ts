import { createConsola } from 'consola'

export const logger = createConsola({ level: 4 })

let lastLoggedPercent = -1

export function progress(current: number, total: number, label: string) {
  const percent = Math.floor((current / total) * 100)
  if (percent % 5 === 0 && percent !== lastLoggedPercent) {
    lastLoggedPercent = percent
    logger.info(`[${label}] ${current}/${total} (${percent}%)`)
  }
}

export function resetProgress() {
  lastLoggedPercent = -1
}
