import { bindings, defineConfig } from 'cf/config'

/**
 * Cloudflare CLI (`cf`) programmatic project configuration for Noma Marketplace.
 *
 * Schema verified directly against `@cloudflare/config@1.0.0-rc.1` (used by `cf@1.0.0-rc.2`):
 * - `WorkerConfigSchema` uses strict Zod schemas (`z.core.$strict`): `assets` configures
 *   `notFoundHandling`, `htmlHandling`, and `runWorkerFirst`, while the static asset
 *   fetcher binding (`ASSETS`) is attached via `bindings.assets()` in `worker.env`.
 * - For Vite SPAs (`./dist`), `cf build` / `cf deploy` integrates with `@cloudflare/vite-plugin`
 *   via `vite.config.ts` rather than a Wrangler-style `assets.directory` field in `cloudflare.config.ts`.
 */
export default defineConfig({
  worker: {
    name: 'noma-marketplace',
    compatibilityDate: '2026-11-22',
    compatibilityFlags: ['nodejs_compat'],
    entrypoint: './worker/index.ts',
    assets: {
      notFoundHandling: 'single-page-application',
      htmlHandling: 'auto-trailing-slash',
      runWorkerFirst: ['/api/*', '/media/*'],
    },
    observability: {
      enabled: true,
      logs: {
        enabled: true,
        headSamplingRate: 1,
        persist: true,
      },
      traces: {
        enabled: true,
        headSamplingRate: 0.1,
        persist: true,
      },
    },
    env: {
      ASSETS: bindings.assets(),
      NOMA_MEDIA: bindings.r2({
        name: 'noma-media',
      }),
      FIREBASE_PROJECT_ID: bindings.text('nokenko-1ab8b'),
      R2_PUBLIC_URL: bindings.text(''),
      ALLOWED_ORIGIN: bindings.text('https://shopnoma.com'),
    },
  },
})
