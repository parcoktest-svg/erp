export function getApiErrorMessage(err: any, fallback = 'Request failed') {
  const data = err?.response?.data
  const dataString = (() => {
    if (!data) return null
    if (typeof data === 'string') return data
    try {
      return JSON.stringify(data)
    } catch {
      return null
    }
  })()

  const msg =
    data?.message ||
    data?.error ||
    dataString ||
    err?.message ||
    fallback

  const status = err?.response?.status
  if (status && typeof status === 'number') {
    return `${msg} (HTTP ${status})`
  }
  return msg
}
