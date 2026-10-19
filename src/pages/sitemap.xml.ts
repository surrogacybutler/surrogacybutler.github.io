import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const esc = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://www.surrogacybutler.com/');
  const posts = (await getCollection('news')).filter((entry) => entry.data.published);
  const builtOn = new Date().toISOString().slice(0,10);
  const entries = [
    { url: new URL('/', base), date: builtOn },
    { url: new URL('/consult.html', base), date: builtOn },
    { url: new URL('/privacy.html', base), date: builtOn },
    { url: new URL('/news/', base), date: builtOn },
    { url: new URL('/editorial-policy/', base), date: builtOn },
    ...posts.map((entry) => ({ url: new URL(`/news/${entry.data.slug}/`, base), date: entry.data.reviewedDate.toISOString().slice(0,10) })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(({url,date}) => `  <url><loc>${esc(url.href)}</loc><lastmod>${date}</lastmod></url>`).join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
