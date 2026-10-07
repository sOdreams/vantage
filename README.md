# VANTAGE

Find photo spots by light, crowds and safety.

A pnpm + Turborepo monorepo:

```
apps/
  mobile/            Expo (SDK 57) app, Expo Router, runs in Expo Go
packages/
  core/              app logic with no UI: spots, filters, sun times (+ tests)
  tokens/            design tokens: dark/light palettes, fonts, spacing (+ tests)
  config/            shared TypeScript config
docs/adr/            architecture decisions
.github/workflows/   CI: lint, typecheck, tests, iOS bundle
```

Later phases add `supabase/` (database, functions) and `map-style/`.

## Run it on your iPhone (Linux)

You need: Node 22, pnpm, a free Expo account, and the Expo Go app on your iPhone.
The computer and the iPhone must be on the same Wi-Fi.

### One-time setup

```bash
# 1. Node 22 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# close and reopen the terminal, then:
nvm install 22
nvm use 22

# 2. pnpm (the version is pinned in package.json)
corepack enable

# 3. Get the code
git clone https://github.com/sOdreams/vantage.git
cd vantage

# 4. Install dependencies
pnpm install

# 5. Log in to Expo (free account: https://expo.dev/signup)
pnpm --filter mobile exec expo login
```

On the iPhone: install **Expo Go** from the App Store, open it, tap the avatar
at the top right and log in with the **same** Expo account. Expo Go refuses to
load SDK 57 projects unless the terminal and the phone use the same account.

### Every time

```bash
pnpm start
```

Scan the QR code in the terminal with the iPhone Camera app. It opens in Expo Go.

If the phone can't connect (spins, then "Could not connect"):

```bash
# allow the dev server through the firewall (Ubuntu)
sudo ufw allow 8081/tcp
# or, if the network blocks it (office/university Wi-Fi), use a tunnel
pnpm --filter mobile start:tunnel
```

## Checks

```bash
pnpm lint          # Biome
pnpm typecheck     # TypeScript, all packages
pnpm test          # Vitest (core: filters + sun times; tokens: contrast + themes)
pnpm --filter mobile doctor   # checks package versions match Expo SDK 57
pnpm format        # auto-format everything
```

CI runs lint, typecheck, tests and an iOS bundle on every pull request.

## Design rules

- "Night viewfinder": dark first, light theme follows the phone.
- Bricolage Grotesque for titles, Geist for text, Geist Mono for times and data.
- Amber is reserved for the main action and golden-hour data.
- Crowd colours are fixed everywhere: blue quiet, yellow moderate, red busy.
  Hidden gems are violet diamonds.

All values live in `packages/tokens`. Tests fail if any text colour drops below
WCAG AA contrast on the surface it sits on.

## Why Expo Go only

See [ADR 0001](docs/adr/0001-expo-go-only.md): no Mac and no paid Apple account,
so every library must work inside Expo Go.

## Secrets

Never commit keys. Put them in `apps/mobile/.env` (ignored by git); only
`.env.example` files are committed. Keys arrive from Day 5 (Supabase).
