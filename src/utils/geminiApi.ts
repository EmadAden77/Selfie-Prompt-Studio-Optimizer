const configuredBaseUrl = (import.meta.env.VITE_GEMINI_API_BASE_URL ?? '')
  .trim()
  .replace(/\/+$/, '');

export function geminiApiUrl(route: string): string {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  return `${configuredBaseUrl}${normalizedRoute}`;
}
