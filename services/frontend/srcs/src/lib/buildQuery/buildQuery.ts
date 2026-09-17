/** Drops empty values and turns the rest into a query string, `?` included. */
export function buildQuery(
  params: Record<string, string | number | undefined>,
) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value))
  })

  const result = search.toString()
  return result ? `?${result}` : ''
}
