import type { LocaleCode, PageSlug } from '../i18n/locales';
import { SITE_URL, getCanonicalUrl } from '../i18n/locales';
import type { TranslationBundle } from '../i18n/translations';

export function buildHomeSchemas(locale: LocaleCode, t: TranslationBundle): Record<string, unknown>[] {
  const url = getCanonicalUrl(locale, 'home');
  const hireMeUrl = getCanonicalUrl(locale, 'hire-me');

  const gameAppSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['VideoGame', 'WebApplication'],
    name: '3DChess',
    alternateName: t.home.title,
    description: t.home.description,
    url,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: locale,
    applicationCategory: 'GameApplication',
    genre: ['Board Game', 'Strategy', 'Chess'],
    gamePlatform: ['Web Browser', 'Desktop', 'Mobile'],
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript and WebGL (Three.js client-side execution)',
    playMode: ['SinglePlayer', 'MultiPlayer'],
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 2,
    },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Procedural Three.js WebGL 3D Staunton chess pieces',
      '4-level Web Worker AI (Easy, Medium, Hard, Expert)',
      'Local 2-Player Pass & Play mode',
      'Full FIDE chess rules including castling, en passant, and pawn promotion',
      'Offline-ready Progressive Web App',
    ],
    author: {
      '@type': 'Person',
      name: 'Kishara Dilshan',
      url: hireMeUrl,
    },
  };

  const faqSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.home.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return [gameAppSchema, faqSchema];
}

export function buildBreadcrumbSchema(
  locale: LocaleCode,
  page: Exclude<PageSlug, 'home'>,
  t: TranslationBundle,
): Record<string, unknown> {
  const homeUrl = getCanonicalUrl(locale, 'home');
  const pageUrl = getCanonicalUrl(locale, page);
  const currentName = page === 'how-to-play' ? t.breadcrumbs.howToPlay : t.breadcrumbs.hireMe;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.breadcrumbs.home,
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: currentName,
        item: pageUrl,
      },
    ],
  };
}

export function buildHowToSchemas(locale: LocaleCode, t: TranslationBundle): Record<string, unknown>[] {
  const breadcrumb = buildBreadcrumbSchema(locale, 'how-to-play', t);
  const url = getCanonicalUrl(locale, 'how-to-play');

  const howToSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t.howToPlay.h1,
    description: t.howToPlay.description,
    url,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: locale,
    step: t.howToPlay.sections.map((section, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: section.title,
      text: `${section.description} ${section.items.map((item) => `${item.label}: ${item.detail}`).join(' ')}`,
    })),
  };

  return [breadcrumb, howToSchema];
}

export function buildHireMeSchemas(locale: LocaleCode, t: TranslationBundle): Record<string, unknown>[] {
  const breadcrumb = buildBreadcrumbSchema(locale, 'hire-me', t);
  const url = getCanonicalUrl(locale, 'hire-me');

  const personSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kishara Dilshan',
    jobTitle: 'Freelance Full-Stack Web & 3D Developer',
    description: t.hireMe.description,
    url,
    email: `mailto:${t.hireMe.email}`,
    knowsAbout: [
      'Astro',
      'React',
      'Next.js',
      'TypeScript',
      'Three.js',
      'WebGL',
      'WebAssembly',
      'Technical SEO',
      'UI/UX Design',
    ],
    sameAs: [
      'https://github.com/3dchess/3dchess.github.io',
      'https://kisharadilshan.gumroad.com/coffee',
    ],
    makesOffer: t.hireMe.specialties.map((spec) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: spec.title,
        description: spec.description,
      },
    })),
  };

  return [breadcrumb, personSchema];
}
