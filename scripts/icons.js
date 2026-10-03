// Inline SVG icons: Lucide (traço) e Simple Icons (logos de marca, prefixo "si:").
// Usado no build pelo plugin do Vite (vite.config.ts).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cache = new Map();

const lucidePath = (name) => require.resolve(`lucide-static/icons/${name}.svg`);
const simplePath = (slug) => require.resolve(`simple-icons/icons/${slug}.svg`);

export function iconSvg(name, extraClass = '') {
    const key = `${name}|${extraClass}`;
    if (cache.has(key)) return cache.get(key);

    const isBrand = name.startsWith('si:');
    const raw = readFileSync(isBrand ? simplePath(name.slice(3)) : lucidePath(name), 'utf8');
    const inner = raw
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<title>[\s\S]*?<\/title>/, '')
        .replace(/^[\s\S]*?<svg[^>]*>/, '')
        .replace(/<\/svg>\s*$/, '')
        .replace(/\s*\n\s*/g, '')
        .trim();

    const cls = ['icon', `icon--${name.replace('si:', 'brand-')}`, extraClass].filter(Boolean).join(' ');
    const attrs = isBrand
        ? 'fill="currentColor"'
        : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    const svg = `<svg class="${cls}" viewBox="0 0 24 24" ${attrs} aria-hidden="true" focusable="false">${inner}</svg>`;
    cache.set(key, svg);
    return svg;
}

// Troca <i data-icon="nome" class="..."></i> pelo SVG correspondente.
export function inlineIcons(html) {
    return html.replace(/<i\s+data-icon="([^"]+)"(?:\s+class="([^"]*)")?\s*><\/i>/g,
        (_, name, cls = '') => iconSvg(name, cls));
}
