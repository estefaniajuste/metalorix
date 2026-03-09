# Metalorix

Precious metals spot prices & analytics — Gold (XAU), Silver (XAG) and Platinum (XPT).

## Quick Start

Open `index.html` in any modern browser. No build step required.

For local development with live-reload, use any static server:

```bash
npx serve .          # or python -m http.server 8000
```

## Data Provider

By default the app runs in **mock mode** with simulated data. To connect a live API:

1. Open `index.html` and set `CONFIG.dataProvider = 'live'`.
2. Implement `getSpotPrices()` and `getHistory()` in `LiveProvider` (see placeholder comments in code).
3. **Important:** proxy API requests through a backend to protect your API key — never expose keys in client-side code.

## License

MIT
