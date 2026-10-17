# Gami Landing

Marketing landing page for Gami Protocol: the wallet, the Chrome extension, card rewards, quests and game missions, the MCP server for companies, and the XP → GAMI / USDC ramp.

Built with Vite, React 18, TypeScript and Tailwind, styled with the locked **ARCADE Cyber-Brutalist** design system (dark ground, Space Grotesk uppercase, 3px frames, 8px offset shadows, square corners, one purple).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run verify     # typecheck + tests + production build
```

Copy `.env.example` to `.env` to wire the store and docs links. Empty values fall back to in-page anchors.

## Layout

```
src/
  App.tsx                     section order = the explainer
  styles/tokens.css           ARCADE tokens, dark + light (Foundation) themes
  styles/globals.css          component styles, stable class names
  lib/economics.ts            ramp maths (pure, tested)
  lib/links.ts                env-driven outbound links
  components/ui/              Button, Eyebrow, TrustBadge, icons, Gami mark
  components/mocks/           phone, side panel and mission card mocks
  components/sections/        Nav, Hero, HowItWorks, Wallet, Extension, Quests,
                              Companies, RampChart, Settlement, Cta, Footer
```

## Page order

1. **Hero** — card payment earns onchain; wallet mock with XP, GAMI, USDC and card badges.
2. **How it works** — Pay → Verify → Mint → Ramp, then the distribution of one £100 payment.
3. **Wallet** — ledger, convert flow (1,000 XP floor), USDC on Base, card provisioning.
4. **Extension** — side panel: quests on the current site, NOVA, rewards, passkey.
5. **Quests · Games · Yield tasks** — three XP sources, a sponsored mission, studio mission pools, trust-level table.
6. **For companies** — MCP server tools, quest council, agentic web tool, automated rewarding pipeline.
7. **XP economics** — interactive twelve-month ramp of XP, GAMI and USDC.
8. **Settlement** — we route, we do not issue.
9. **CTA + footer.**

## Rules the copy keeps

- No card-network or issuer brand names anywhere in `src/` (CI greps for them). Naming one is a claim about a commercial relationship.
- The GAMI token is described as launch-gated. No contract address, no pool link, until the address is published through Gami's own channels.
- The ramp chart is labelled illustrative. `src/lib/economics.ts` mirrors the shapes in the wallet's `lib/conversion.ts`; swap its constants for the ledger's `conversionRate()` and `xpForLevel()` when the API is live.
- Studio and merchant names in the mocks are placeholders.

## Deploy

Vite static output in `dist/`. `vercel.json` is included; `vercel --prod` from the repo root works with no further config.
