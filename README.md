# EletroCL — Website

Repo for the EletroCL institutional site. They are a power tool and appliance repair shop based in Passos, MG (Brazil).

This is a simple static landing page. Main goal is just to show local customers what the shop does, build some trust, and get them to click the WhatsApp contact button.

## Tech Stack

No frameworks, no backend. Kept it as simple as possible.

* HTML, CSS, Vanilla JS
* Vite (dev server & build)
* Hosted on Cloudflare Pages

*Note:* `ffmpeg-static` is currently in the `package.json` dependencies but it's not being used. You can safely remove it.

## Features

* Responsive layout (mobile-first approach)
* IntersectionObserver for scroll animations
* Canvas particle effect + looping video in the hero section
* Animated number counters
* Basic local SEO (JSON-LD, Open Graph, sitemap, robots.txt)
* Custom 404 page

## Project Structure

All the client-side logic is dumped into `js/main.js`. It handles the mobile menu, smooth scrolling, scroll animations, lazy loading, Google reviews, and a Konami Code easter egg. Since the site has no complex state, I kept it in a single file to avoid over-engineering.

`public/_headers` handles Cloudflare security policies (CSP, X-Frame-Options, etc). If you add new external tools like Google Analytics later, remember to update the CSP here.

## Local Dev

Needs Node 20+.

```bash
npm install
npm run dev

```

To build for prod:

```bash
npm run build
npm run preview

```

Build files will be output to `dist/`.

## Deploy (Cloudflare Pages)

Connect the repo and use these settings:

* Framework preset: Vite
* Build command: `npm run build`
* Output directory: `dist`

## Google Reviews (auto-update, free)

The "O que dizem nossos clientes" section shows the shop's real Google reviews through [Featurable](https://featurable.com) — a free service that syncs the Google Business Profile reviews and exposes them as JSON. No Google API key, no billing account, no third-party script: `js/main.js` fetches the JSON and renders it with the site's own card design. New reviews show up on their own (Featurable re-syncs periodically).

Setup (one time, ~5 minutes):

1. Create a free account at featurable.com and connect the EletroCL Google Business Profile (the shop owner's Google account is needed).
2. Create a widget, then go to **Embed → API** and copy the widget ID.
3. Paste it in `index.html` → `<section id="depoimentos" ... data-featurable-id="PASTE-HERE">` and deploy.

If the ID is empty or the request fails, the static testimonials in `index.html` are shown instead. Up to 6 reviews with text are displayed, newest first. The CSP in `public/_headers` already allows `api.featurable.com` and Google profile photos.

## Icons & animations

* Icons are inline SVGs injected at build time: `<i data-icon="wrench"></i>` uses [Lucide](https://lucide.dev/icons) and `<i data-icon="si:whatsapp"></i>` uses [Simple Icons](https://simpleicons.org) (brand logos). See `scripts/icons.js` and the plugin in `vite.config.ts`. No icon font or CDN is loaded.
* Scroll reveals use `.animate-on-scroll` (+ optional `reveal-left`, `reveal-zoom`, `reveal-clip`); children of a `[data-stagger]` container animate in sequence. Everything respects `prefers-reduced-motion`.

## Client Info (Verify before launch)

Make sure these match the actual shop data before going live:

* **Address:** R. do Mercado, 101 – Centro, Passos/MG
* **Phone:** (35) 3021-8804
* **WhatsApp:** (35) 98448-7858
* **Website:** [https://eletrocl.com.br](https://www.google.com/search?q=https://eletrocl.com.br)
* **IG:** @eletroclpassos

## Pre-launch Checklist

* [ ] Client approved all text, numbers, and warranty info
* [ ] Brand logos and shop photos are cleared for use
* [ ] WhatsApp, Maps, and social links are working
* [ ] Mobile menu works properly
* [ ] Checked responsiveness on mobile and desktop
* [ ] No console errors or 404 assets
* [ ] JSON-LD block in `index.html` matches final client data

---

*Private project. All rights reserved — EletroCL / Noctem Technology.*