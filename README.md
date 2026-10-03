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

All the client-side logic is dumped into `js/main.js`. It handles the mobile menu, smooth scrolling, scroll animations, lazy loading, and a Konami Code easter egg. Since the site has no complex state, I kept it in a single file to avoid over-engineering.

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

## Google Reviews (manual)

The reviews in "O que dizem nossos clientes" are static cards in `index.html`, copied by hand from the shop's Google Maps page. The summary box and every card link to the shop on Google Maps, so visitors can read all reviews there.

To update:

1. Open the shop on Google Maps → **Avaliações**, sort by "Mais recentes", and copy the text, author name, and star count of the reviews you want.
2. In `index.html`, edit each `.card--depoimento` (text, name, initials in `.depoimento__avatar`, stars). Use `<i data-icon="star"></i>` for a filled star and `<i data-icon="star" class="is-empty"></i>` for an empty one; update the `aria-label` ("X de 5 estrelas").
3. The rating and review count in the summary box (`.google-rating`, currently 4,1 · 19 avaliações) are also copied by hand from the Google profile — update them when they change.
4. The summary box and each card link to the shop's Google share link (`https://share.google/1lcrswUaMSRGksJnh`). If it ever changes, search-and-replace it in `index.html`.

## Privacy (LGPD)

* **Privacy policy:** `politica-de-privacidade.html` (served at `/politica-de-privacidade`), built as a second Vite entry in `vite.config.ts`. Update the "Última atualização" date whenever it changes.
* **Cookie banner:** `js/consent.js`. The site loads no third-party content by default; the Google Maps embed only loads after consent (banner "Aceitar" or the "Carregar mapa" button). The choice is stored in `localStorage` (`eletrocl-consent`) and can be changed via "Preferências de cookies" in the footer. Bump `CONSENT_VERSION` to ask everyone again (e.g. after adding analytics).
* **Fonts** are self-hosted via `@fontsource-variable/plus-jakarta-sans` (no Google Fonts request).
* If you add any new third-party tool (analytics, chat widget, pixel…), it must load only after consent, be listed in the policy, and be allowed in the CSP (`public/_headers`).

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
* [ ] Razão social and CNPJ in the privacy policy confirmed by the client

---

*Private project. All rights reserved — EletroCL / Noctem Technology.*