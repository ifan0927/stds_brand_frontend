import type { BrandProfile, FAQItem } from '../api/brand';

export const SITE_TITLE = '奕德不動產 — 大台南包租代管';
export const SITE_DESCRIPTION =
  '奕德不動產深耕大台南，提供包租與代管服務。一份合約、雙向安心——房東收益穩定，房客住得放心。';
export const FALLBACK_BRAND_NAME = '奕德不動產';

export type HomepageSeo = {
  title: string;
  description: string;
  canonicalUrl: string;
  brandName: string;
};

export function getHomepageSeo(profile: BrandProfile | null): HomepageSeo {
  const canonicalUrl = getHomepageCanonicalUrl();

  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    canonicalUrl,
    brandName: profile?.brand_name || FALLBACK_BRAND_NAME,
  };
}

export function getHomepageCanonicalUrl(): string {
  return new URL('/', getSiteOrigin()).toString();
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

export function buildFaqPageJsonLd(faqs: FAQItem[]): Record<string, unknown> | null {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildLocalBusinessJsonLd(
  profile: BrandProfile | null,
  canonicalUrl: string,
): Record<string, unknown> | null {
  if (!profile) return null;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: profile.brand_name,
    url: canonicalUrl,
  };

  if (profile.contact_phone) data.telephone = profile.contact_phone;
  if (profile.contact_email) data.email = profile.contact_email;
  if (profile.contact_address) data.address = profile.contact_address;

  return data;
}
