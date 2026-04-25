# CFP Wiki

TanStack Start wiki app deployed as a Cloudflare Worker with Wrangler.

## Development

Install dependencies:

```bash
npm install
```

Run the Vite development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Cloudflare Worker

The production build uses Nitro's `cloudflare-module` preset. `wrangler.jsonc` stores the Worker name, compatibility date, and Node.js compatibility flag. Nitro reads that file during the build and writes the deployable Worker config to `.output/server/wrangler.json`.

Build the Worker bundle:

```bash
npm run build
```

Preview the built Worker locally with Wrangler:

```bash
npm run preview
```

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

The deploy script builds first, then runs `wrangler deploy --config .output/server/wrangler.json`.

## Environment Variables

The app expects the public Supabase values used by the wiki:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
VITE_API_ENDPOINT=
```

For local Vite development, put them in `.env.local`. For the deployed Worker, configure them in Cloudflare as Worker variables or secrets. Do not commit secret values.

## Useful Scripts

```bash
npm run dev        # Vite dev server
npm run build      # Build the Cloudflare Worker output
npm run start      # Run the existing build with Wrangler
npm run preview    # Build and run locally with Wrangler
npm run deploy     # Build and deploy with Wrangler
npm run typecheck  # TypeScript check
```
