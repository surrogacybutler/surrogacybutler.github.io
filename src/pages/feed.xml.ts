import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
const esc = (v: string) => v.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://www.surrogacybutler.com/');
  const posts = (await getCollection('news')).filter(p => p.data.published).sort((a,b) => b.data.date.valueOf()-a.data.date.valueOf());
  const items = posts.map(p => `\n    <item><title>${esc(p.data.title)}</title><link>${new URL(`/news/${p.data.slug}/`,base).href}</link><guid>${new URL(`/news/${p.data.slug}/`,base).href}</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.summary)}</description><source url="${esc(p.data.sourceURL)}">${esc(p.data.sourceName)}</source></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>美宝管家｜近期报道与政策更新</title><link>${new URL('/news/',base).href}</link><description>美国辅助生殖、妊娠载体与相关政策报道整理。</description><language>zh-cn</language>${items}\n</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
