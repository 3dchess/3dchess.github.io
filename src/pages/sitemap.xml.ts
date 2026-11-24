import type { APIRoute } from 'astro';
import {
  SUPPORTED_LOCALES,
  getCanonicalUrl,
  getHreflangLinks,
  type PageSlug,
} from '../i18n/locales';

const PAGES: { slug: PageSlug; priority: string; changefreq: string }[] = [
  { slug: 'home', priority: '1.0', changefreq: 'weekly' },
  { slug: 'how-to-play', priority: '0.8', changefreq: 'monthly' },
  { slug: 'hire-me', priority: '0.7', changefreq: 'monthly' },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];

  const urlBlocks: string[] = [];

  for (const page of PAGES) {
    const alternates = getHreflangLinks(page.slug);
    const alternateXml = alternates
      .map(
        (alt) =>
          `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`,
      )
      .join('\n');

    for (const locale of SUPPORTED_LOCALES) {
      const loc = getCanonicalUrl(locale.code, page.slug);
      urlBlocks.push(
        `  <url>\n` +
          `    <loc>${loc}</loc>\n` +
          `    <lastmod>${lastmod}</lastmod>\n` +
          `    <changefreq>${page.changefreq}</changefreq>\n` +
          `    <priority>${page.priority}</priority>\n` +
          `${alternateXml}\n` +
          `  </url>`,
      );
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${urlBlocks.join('\n')}\n` +
    `</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
