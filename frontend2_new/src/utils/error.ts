export function getApiErrorMessage(err: any, fallback = 'Request failed') {
  const data = err?.response?.data
  const msg =
    data?.message ||
    data?.error ||
    (typeof data === 'string' ? data : null) ||
    err?.message ||
    fallback

  const status = err?.response?.status
  if (status && typeof status === 'number') {
    return `${msg} (HTTP ${status})`
  }
  return msg
}
