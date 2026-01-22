export function getApiErrorMessage(err: any, fallback = 'Request failed') {
  const data = err?.response?.data
  const fieldErrors = data?.fieldErrors
  const fieldErrorsString = (() => {
    if (!fieldErrors || typeof fieldErrors !== 'object') return null
    try {
      const entries = Object.entries(fieldErrors)
      if (!entries.length) return null
      return entries.map(([k, v]) => `${k}: ${String(v)}`).join(', ')
    } catch {
      return null
    }
  })()
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
    fieldErrorsString ||
    dataString ||
    err?.message ||
    fallback

  const status = err?.response?.status
  if (status && typeof status === 'number') {
    return `${msg} (HTTP ${status})`
  }
  return msg
}
