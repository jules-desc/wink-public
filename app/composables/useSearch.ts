import type { SearchResult } from '~/types/api'

export function useSearch() {
  const query = ref('')
  const results = ref<SearchResult[]>([])
  const isLoading = ref(false)

  let timeout: ReturnType<typeof setTimeout> | null = null

  async function fetchResults(q: string) {
    if (q.length < 2) {
      results.value = []
      return
    }
    isLoading.value = true
    try {
      results.value = await $fetch<SearchResult[]>('/api/search', { params: { q } })
    } finally {
      isLoading.value = false
    }
  }

  watch(query, (val) => {
    if (timeout) clearTimeout(timeout)
    if (val.length < 2) {
      results.value = []
      isLoading.value = false
      return
    }
    isLoading.value = true
    timeout = setTimeout(() => fetchResults(val), 300)
  })

  function clear() {
    query.value = ''
    results.value = []
    isLoading.value = false
    if (timeout) clearTimeout(timeout)
  }

  return { query, results, isLoading, clear }
}
