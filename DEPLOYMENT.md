# GitHub Pages and Gemini API deployment

The GitHub Pages workflow builds only the Vite frontend. It does not run Express from `server.ts`, so Gemini requests require a separately deployed HTTPS API server.

## Required configuration

1. Deploy `server.ts` on a trusted HTTPS Node.js host.
2. On the API host, configure:
   - `GEMINI_API_KEY`: server-side only.
   - `CORS_ORIGIN`: `https://emadaden77.github.io/Selfie-Prompt-Studio-Optimizer`
   - `TRUST_PROXY_HOPS`: `1` when one trusted reverse-proxy hop is used; use `0` for direct exposure.
3. In GitHub repository settings, open **Secrets and variables → Actions → Variables** and create:
   - Name: `VITE_GEMINI_API_BASE_URL`
   - Value: the API origin only, for example `https://api.example.com`
4. Do not store `GEMINI_API_KEY` in a `VITE_*` variable. All `VITE_*` values are public in the browser bundle.
5. Push to `main` after configuration. The Pages workflow injects the repository variable during `npm run build`.

## Verification

Run locally with the same value:

```bash
VITE_GEMINI_API_BASE_URL=https://api.example.com npm run build
```

Then open the Pages URL and verify:

- the app loads under `/Selfie-Prompt-Studio-Optimizer/`;
- changing time, location and lighting updates the generated prompt;
- Gemini actions call `https://api.example.com/api/gemini/...`;
- a missing or unavailable API shows a clear error instead of an apply-able fake result.
