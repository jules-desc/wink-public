import { logger } from './logger.js'

interface FetchOptions {
  retries?: number
  retryDelay?: number
  timeout?: number
}

const DEFAULT_OPTIONS: Required<FetchOptions> = {
  retries: 3,
  retryDelay: 1000,
  timeout: 30000
}

export async function fetchJson<T>(url: string, options?: FetchOptions): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  for (let attempt = 1; attempt <= opts.retries; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), opts.timeout)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'WinkPages/1.0 (data-pipeline)' }
      })
      clearTimeout(timer)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json() as T
    } catch (error) {
      if (attempt === opts.retries) throw error
      const delay = opts.retryDelay * Math.pow(2, attempt - 1)
      logger.warn(`[Fetch] Attempt ${attempt}/${opts.retries} failed for ${url}, retrying in ${delay}ms`)
      await sleep(delay)
    }
  }

  throw new Error('Unreachable')
}

export async function fetchText(url: string, options?: FetchOptions): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  for (let attempt = 1; attempt <= opts.retries; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), opts.timeout)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'WinkPages/1.0 (data-pipeline)' }
      })
      clearTimeout(timer)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      if (attempt === opts.retries) throw error
      const delay = opts.retryDelay * Math.pow(2, attempt - 1)
      logger.warn(`[Fetch] Attempt ${attempt}/${opts.retries} failed for ${url}, retrying in ${delay}ms`)
      await sleep(delay)
    }
  }

  throw new Error('Unreachable')
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function createThrottledFetcher(requestsPerSecond: number) {
  let lastRequest = 0
  const minInterval = 1000 / requestsPerSecond

  return async function throttledFetchJson<T>(url: string, options?: FetchOptions): Promise<T> {
    const now = Date.now()
    const elapsed = now - lastRequest
    if (elapsed < minInterval) {
      await sleep(minInterval - elapsed)
    }
    lastRequest = Date.now()
    return fetchJson<T>(url, options)
  }
}
