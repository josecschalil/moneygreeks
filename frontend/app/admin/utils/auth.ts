export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )admin_token=([^;]+)'));
  if (match) return match[2];
  return null;
}

export function getAuthHeaders(existingHeaders: HeadersInit = {}): HeadersInit {
  const token = getAuthToken();
  if (token) {
    return {
      ...existingHeaders,
      'Authorization': `Token ${token}`,
    };
  }
  return existingHeaders;
}
