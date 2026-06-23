export const DEFAULT_SITE_NAME = '奕德不動產';
export const DEFAULT_SITE_TITLE = '奕德不動產 — 大台南包租代管';
export const DEFAULT_SITE_DESCRIPTION =
  '奕德不動產深耕大台南，提供包租與代管服務。一份合約、雙向安心，房東收益穩定，房客住得放心。';

export type PageMetadataInput = {
  title?: string | null;
  description?: string | null;
  path?: string;
  siteName?: string | null;
  ogImagePath?: string | null;
  ogType?: 'website' | 'article';
};

export type PageMetadata = {
  title: string;
  description: string;
  canonicalUrl: string;
  siteName: string;
  ogType: 'website' | 'article';
  ogImageUrl: string | null;
};

export function buildPageMetadata(input: PageMetadataInput = {}): PageMetadata {
  const canonicalUrl = buildCanonicalUrl(input.path ?? '/');

  return {
    title: normalizeText(input.title) ?? DEFAULT_SITE_TITLE,
    description: normalizeText(input.description) ?? DEFAULT_SITE_DESCRIPTION,
    canonicalUrl,
    siteName: normalizeText(input.siteName) ?? DEFAULT_SITE_NAME,
    ogType: input.ogType ?? 'website',
    ogImageUrl: input.ogImagePath ? buildAbsoluteUrl(input.ogImagePath) : null,
  };
}

export function buildCanonicalUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error('Invalid canonical path: expected a root-relative path such as /tenant');
  }

  if (path.includes('?') || path.includes('#')) {
    throw new Error('Invalid canonical path: expected no query string or hash');
  }

  return new URL(path, getSiteOrigin()).toString();
}

export function getSiteOrigin(): string {
  const siteUrl = import.meta.env.SITE_URL;
  if (typeof siteUrl !== 'string' || siteUrl.trim() === '') {
    throw new Error('Missing required build-time environment variable SITE_URL');
  }

  let url: URL;
  try {
    url = new URL(siteUrl.trim());
  } catch {
    throw new Error('Invalid SITE_URL: expected an absolute origin URL such as https://example.com');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Invalid SITE_URL: expected http or https origin URL');
  }

  if (url.pathname !== '/' || url.search !== '' || url.hash !== '') {
    throw new Error('Invalid SITE_URL: expected an origin URL with no path, query, or hash');
  }

  return url.origin;
}

function buildAbsoluteUrl(pathOrUrl: string): string {
  try {
    const url = new URL(pathOrUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid absolute metadata URL');
    }
    return url.toString();
  } catch {
    if (!pathOrUrl.startsWith('/') || pathOrUrl.startsWith('//')) {
      throw new Error('Invalid metadata URL path: expected an absolute URL or root-relative path');
    }
    return new URL(pathOrUrl, getSiteOrigin()).toString();
  }
}

function normalizeText(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}
