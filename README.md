BasePulse - Minimal Next.js (Pages Router) app
Features:
- Real-time prices via CoinGecko (BTC, ETH, BASE)
- 24h sparkline chart per token (uses CoinGecko market_chart)
- API proxy endpoints in /pages/api to avoid CORS
- Farcaster manifest template at public/.well-known/farcaster.json

Quick start:
1. Push to GitHub and connect to Vercel.
2. Deploy and set domain (e.g., gonor-basepulse.vercel.app).
3. Generate accountAssociation in Farcaster and paste into public/.well-known/farcaster.json.
4. Re-deploy and Reverify in Base Build.
