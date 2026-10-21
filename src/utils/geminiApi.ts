const githubPagesApiBaseUrl = 'https://selfie-prompt-studio-optimizer-emadaden77s-projects.vercel.app';
const isGitHubPagesHost = typeof window !== 'undefined'
  && window.location.hostname.endsWith('.github.io');

const configuredBaseUrl = (import.meta.env.VITE_GEMINI_API_BASE_URL
  || (isGitHubPagesHost ? githubPagesApiBaseUrl : ''))
  .trim()
  .replace(/\/+$/, '');

export function geminiApiUrl(route: string): string {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  return `${configuredBaseUrl}${normalizedRoute}`;
}
