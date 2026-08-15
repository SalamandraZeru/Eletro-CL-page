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

All the client-side logic is dumped into `js/main.js`. It handles the mobile menu, smooth scrolling, lazy loading, and a Konami Code easter egg. Since the site has no complex state, I kept it in a single file to avoid over-engineering.

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