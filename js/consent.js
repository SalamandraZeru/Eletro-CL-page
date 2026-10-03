// Consentimento de cookies (LGPD).
// Por padrão nada de terceiros é carregado. O único conteúdo que depende de
// consentimento é o mapa do Google (que grava cookies do Google). A escolha
// fica salva no localStorage do visitante e pode ser alterada a qualquer
// momento pelo link "Preferências de cookies" no rodapé.

const STORAGE_KEY = 'eletrocl-consent';
const CONSENT_VERSION = 1; // aumente para pedir o consentimento de novo

const MAP_SRC = 'https://maps.google.com/maps?q=R.%20do%20Mercado,%20101%20-%20Centro,%20Passos%20-%20MG,%2037900-076&t=&z=15&ie=UTF8&iwloc=&output=embed';

const readConsent = () => {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return data?.v === CONSENT_VERSION ? data : null;
    } catch {
        return null;
    }
};

const saveConsent = (maps) => {
    const data = { v: CONSENT_VERSION, maps, at: new Date().toISOString() };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        /* navegação privada / armazenamento bloqueado: vale só nesta visita */
    }
    return data;
};

const loadMap = () => {
    const container = document.getElementById('map-container');
    if (!container || container.querySelector('iframe')) return;
    const iframe = document.createElement('iframe');
    iframe.src = MAP_SRC;
    iframe.title = 'Mapa de Localização EletroCL';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    container.replaceChildren(iframe);
};

const unloadMap = () => {
    const container = document.getElementById('map-container');
    const placeholder = document.getElementById('map-consent-template');
    if (!container || !placeholder || !container.querySelector('iframe')) return;
    container.replaceChildren(placeholder.content.cloneNode(true));
};

export function initConsent() {
    const banner = document.getElementById('cookie-banner');
    let consent = readConsent();

    const apply = () => (consent?.maps ? loadMap() : unloadMap());

    const showBanner = () => {
        if (!banner) return;
        banner.hidden = false;
        requestAnimationFrame(() => banner.classList.add('is-visible'));
    };

    const hideBanner = () => {
        if (!banner) return;
        banner.classList.remove('is-visible');
        banner.hidden = true;
    };

    const decide = (maps) => {
        consent = saveConsent(maps);
        hideBanner();
        apply();
    };

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-consent]');
        if (!trigger) return;
        const action = trigger.dataset.consent;
        if (action === 'accept' || action === 'accept-map') decide(true);
        else if (action === 'reject') decide(false);
        else if (action === 'open') {
            e.preventDefault();
            showBanner();
            banner?.querySelector('[data-consent="reject"]')?.focus();
        }
    });

    apply();
    if (!consent) showBanner();
}
