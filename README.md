# linuxfacts.com

A website and API for serving interesting Linux facts, built for Cloudflare Pages (web) and Cloudflare Workers (api).

## Project structure

```text
.
├── api/   # Cloudflare Worker API (TypeScript)
└── web/   # Cloudflare Pages website (static HTML/CSS/JS)
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler` or use `npx wrangler`)
- A Cloudflare account for deployment

## API (`api/`)

The API is a Cloudflare Worker that serves Linux facts as JSON.

### Local development

```bash
cd api
npm install
npm run dev
```

### Endpoints

- `GET /` - API info
- `GET /api/facts` - list all facts
- `GET /api/facts/random` - get a random fact
- `GET /api/facts/:id` - get a fact by id
- `GET /health` - health check

### Deploy

```bash
cd api
npm run deploy
```

Configure the worker name/routes in `api/wrangler.toml` as needed.

## Website (`web/`)

The website is a static site intended for Cloudflare Pages. It fetches facts from the API.

### Local development

Serve the `web/` directory with any static file server, for example:

```bash
cd web
npx serve .
```

By default the frontend looks for the API at `http://localhost:8787`. Update `web/src/config.js` (or the meta/config in `index.html`) for production.

### Deploy to Cloudflare Pages

- In the Cloudflare dashboard, create a Pages project connected to this repo (or deploy via Wrangler).
- Set the **root/build directory** to `web` (no build command required for the current static setup).

## Configuration

- Set the production API base URL used by the website in `web/src/config.js`.
- CORS is enabled in the API for development; restrict origins in `api/src/index.ts` for production if desired.

## License

TBD

