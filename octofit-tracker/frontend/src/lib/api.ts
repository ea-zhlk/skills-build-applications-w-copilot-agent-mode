const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

type CollectionEnvelope<T> = {
  items?: T[]
  results?: T[]
  data?: T[]
}

function normalizeCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (payload && typeof payload === 'object') {
    const collection = payload as CollectionEnvelope<T>

    if (Array.isArray(collection.items)) {
      return collection.items
    }

    if (Array.isArray(collection.results)) {
      return collection.results
    }

    if (Array.isArray(collection.data)) {
      return collection.data
    }
  }

  return []
}

export async function fetchCollection<T>(resource: string): Promise<T[]> {
  const response = await fetch(`${apiBaseUrl}/${resource}/`)

  if (!response.ok) {
    throw new Error(`Request failed for ${resource}: ${response.status}`)
  }

  const payload = (await response.json()) as unknown
  return normalizeCollection<T>(payload)
}

export function getApiMode(): 'codespaces' | 'localhost' {
  return codespaceName ? 'codespaces' : 'localhost'
}