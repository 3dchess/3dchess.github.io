export type LocaleCode = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'ja' | 'zh' | 'ru';

export type PageSlug = 'home' | 'how-to-play' | 'hire-me';

export interface LocaleMeta {
  code: LocaleCode;
  label: string;
  ogLocale: string;
  pathPrefix: string;
}

export const SITE_URL = 'https://3dchess.github.io';

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'en', label: 'English', ogLocale: 'en_US', pathPrefix: '/' },
  { code: 'es', label: 'Español', ogLocale: 'es_ES', pathPrefix: '/es/' },
  { code: 'pt', label: 'Português', ogLocale: 'pt_BR', pathPrefix: '/pt/' },
  { code: 'de', label: 'Deutsch', ogLocale: 'de_DE', pathPrefix: '/de/' },
  { code: 'fr', label: 'Français', ogLocale: 'fr_FR', pathPrefix: '/fr/' },
  { code: 'ja', label: '日本語', ogLocale: 'ja_JP', pathPrefix: '/ja/' },
  { code: 'zh', label: '简体中文', ogLocale: 'zh_CN', pathPrefix: '/zh/' },
  { code: 'ru', label: 'Русский', ogLocale: 'ru_RU', pathPrefix: '/ru/' },
];

export const NON_DEFAULT_LOCALES: LocaleCode[] = ['es', 'pt', 'de', 'fr', 'ja', 'zh', 'ru'];

export function getLocaleMeta(code: LocaleCode): LocaleMeta {
  return SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0];
}

export function getLocalizedPath(locale: LocaleCode, page: PageSlug): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  if (page === 'home') {
    return prefix ? `${prefix}/` : '/';
  }
  return `${prefix}/${page}/`;
}

export function getCanonicalUrl(locale: LocaleCode, page: PageSlug): string {
  return `${SITE_URL}${getLocalizedPath(locale, page)}`;
}

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export function getHreflangLinks(page: PageSlug): HreflangLink[] {
  const links: HreflangLink[] = SUPPORTED_LOCALES.map((loc) => ({
    hreflang: loc.code,
    href: getCanonicalUrl(loc.code, page),
  }));
  links.push({
    hreflang: 'x-default',
    href: getCanonicalUrl('en', page),
  });
  return links;
}
