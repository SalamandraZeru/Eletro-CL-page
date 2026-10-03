// Cloudflare Pages Function: GET /api/reviews
// Busca nota, total e avaliações do Google (Places API New) e guarda em cache
// na borda para não estourar a cota gratuita da API.
//
// Variáveis de ambiente (Cloudflare Pages → Settings → Variables and Secrets):
//   GOOGLE_PLACES_API_KEY  chave com a "Places API (New)" habilitada
//   GOOGLE_PLACE_ID        Place ID da EletroCL no Google Maps

const CACHE_TTL_SECONDS = 6 * 60 * 60; // 6 horas
const FIELD_MASK = 'rating,userRatingCount,googleMapsUri,reviews';

const json = (body, status = 200, maxAge = CACHE_TTL_SECONDS) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': status === 200 ? `public, max-age=${maxAge}` : 'no-store',
        },
    });

export async function onRequestGet({ request, env, waitUntil }) {
    const apiKey = env.GOOGLE_PLACES_API_KEY;
    const placeId = env.GOOGLE_PLACE_ID;
    if (!apiKey || !placeId) {
        return json({ error: 'not_configured' }, 503);
    }

    const cache = caches.default;
    const cacheKey = new Request(new URL('/api/reviews', request.url).toString());
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR&regionCode=BR`;
    let data;
    try {
        const res = await fetch(url, {
            headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': FIELD_MASK },
        });
        if (!res.ok) {
            console.error('Places API error', res.status, await res.text());
            return json({ error: 'upstream_error' }, 502);
        }
        data = await res.json();
    } catch (err) {
        console.error('Places API fetch failed', err);
        return json({ error: 'upstream_error' }, 502);
    }

    const body = {
        rating: data.rating ?? null,
        total: data.userRatingCount ?? 0,
        url: data.googleMapsUri ?? null,
        reviews: (data.reviews ?? [])
            .map(r => ({
                author: r.authorAttribution?.displayName ?? 'Cliente Google',
                authorUrl: r.authorAttribution?.uri ?? null,
                photo: r.authorAttribution?.photoUri ?? null,
                rating: r.rating ?? 0,
                text: r.text?.text ?? r.originalText?.text ?? '',
                time: r.relativePublishTimeDescription ?? '',
                url: r.googleMapsUri ?? null,
            }))
            .filter(r => r.text.trim()),
    };

    const response = json(body);
    waitUntil(cache.put(cacheKey, response.clone()));
    return response;
}
