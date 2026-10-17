# DNS and hosting for gamiprotocol.io and raise.gamiprotocol.io

One Vercel project serves both hosts from one build. The app decides what to render by hostname
(`src/lib/site.ts`): on `raise.*` the root is the raise page; on the main host the raise page is `/raise`.

## Records

At the DNS provider for `gamiprotocol.io`:

| Host | Type | Value | Purpose |
|---|---|---|---|
| `@` | A | `76.76.21.21` | Apex → Vercel |
| `www` | CNAME | `cname.vercel-dns.com` | www → Vercel (redirect to apex in Vercel) |
| `raise` | CNAME | `cname.vercel-dns.com` | Raise page at the root of the subdomain |
| `privy` | CNAME | value shown in the Privy dashboard → Settings → Custom domain | Privy custom auth domain (already in use by the wallet and extension) |

Vercel may show a different target for a specific team; use whatever the Domains tab prints after adding the domain. TTL 300 while cutting over, then raise it.

## Vercel

```bash
vercel link                       # pick the gami-landing project
vercel domains add gamiprotocol.io
vercel domains add www.gamiprotocol.io
vercel domains add raise.gamiprotocol.io
vercel env add VITE_PRIVY_APP_ID production
vercel env add VITE_SEED_GAMI_WHOLE production     # same values the forge seed script will read
vercel env add VITE_SEED_USDC_UNITS production
# at launch, after the address is verified on BaseScan and announced on official channels:
vercel env add VITE_GAMI_TOKEN_ADDRESS production
vercel env add VITE_GAMI_TOKEN_CHAIN production    # base
vercel --prod
```

`vercel.json` rewrites every path to `index.html`, so `/raise` and `/partners` resolve on both hosts. Set `www` to redirect to the apex in Project → Domains.

## Privy

The raise page signs users in with the same Privy app as the wallet and the extension (`VITE_PRIVY_APP_ID`). In the Privy dashboard:

1. **Allowed origins**: add `https://raise.gamiprotocol.io` next to `gamiprotocol.io` and `www.gamiprotocol.io`. Without it, sign-in on the subdomain is refused.
2. **Custom domain**: `privy.gamiprotocol.io` is already the custom auth domain. Keep the CNAME; the SDK picks it up from the app config.
3. **Funding**: turn on the card / ramp providers under Funding. The page requests USDC on Base (`eip155:8453`, `0x8335…2913`) and prefers card; Apple Pay, Google Pay and bank follow whatever the provider offers in the user's region.
4. Login methods used by the page: email code, passkey, Google, external wallet. Passkeys created in the app or extension are per-origin, so a user may be asked to add one here.

## Launch-day order

1. Deploy token + adapter, verify `totalSupply() = 1e27` on BaseScan (runbook step 1).
2. Seed and lock the Uniswap v3 pool with `SEED_GAMI_WHOLE` / `SEED_USDC_UNITS` (runbook step 2). The page's Uniswap card shows the opening price those two numbers imply and warns if it differs from the sale price.
3. Announce the address on official channels.
4. Set `VITE_GAMI_TOKEN_ADDRESS` and `VITE_GAMI_TOKEN_CHAIN=base` on Vercel and redeploy. The swap buttons, BaseScan link and "Live on Base" status appear; nothing is un-hidden by hand.
