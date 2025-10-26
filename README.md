BasePulse - Minimal Next.js (Pages Router) app with CoinGecko integration.

What it includes:
- pages/index.js: UI where you can enter tokens (default: bitcoin, ethereum, base)
- pages/api/prices.js: proxies CoinGecko simple price endpoint
- pages/api/history.js: proxies CoinGecko market_chart for 1 day (24h) sparkline
- public/.well-known/farcaster.json: manifest template (fill accountAssociation after generating signature)
- public/icon.png, public/og-image.png, public/splash.png
- vercel.json (example redirect for hosted manifest)

Quick deploy:
1. Unzip, push to GitHub, connect repo to Vercel and deploy.
2. Visit https://<your-vercel-domain>/.well-known/farcaster.json to confirm manifest is served.
3. Generate accountAssociation on Farcaster (for your domain), paste header/payload/signature into farcaster.json and push again.
4. Reverify on Farcaster / Base Build.

