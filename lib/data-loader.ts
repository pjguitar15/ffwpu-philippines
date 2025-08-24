export async function loadJsonData<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(path)

    // Check if response is ok
    if (!response.ok) {
      console.error(`[v0] Failed to fetch ${path}: ${response.status} ${response.statusText}`)
      return []
    }

    // Check content type
    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      console.error(`[v0] Expected JSON but got ${contentType} for ${path}`)
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(`[v0] Error loading ${path}:`, error)
    return []
  }
}
