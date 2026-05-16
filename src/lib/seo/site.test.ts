import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildFaqPageJsonLd,
  buildLocalBusinessJsonLd,
  getHomepageCanonicalUrl,
  getHomepageSeo,
} from './site';

describe('site SEO helpers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('builds the homepage canonical URL from SITE_URL', () => {
    vi.stubEnv('SITE_URL', 'https://example.com/');

    expect(getHomepageCanonicalUrl()).toBe('https://example.com/');
  });

  it('fails clearly when SITE_URL is missing', () => {
    expect(() => getHomepageCanonicalUrl()).toThrow(
      'Missing required build-time environment variable SITE_URL',
    );
  });

  it('fails clearly when SITE_URL is not an origin URL', () => {
    vi.stubEnv('SITE_URL', 'https://example.com/path');

    expect(() => getHomepageCanonicalUrl()).toThrow(
      'Invalid SITE_URL: expected an origin URL with no path, query, or hash',
    );
  });

  it('uses the public profile brand name in homepage metadata', () => {
    vi.stubEnv('SITE_URL', 'https://example.com');

    expect(
      getHomepageSeo({
        brand_name: '測試品牌',
        contact_phone: null,
        contact_email: null,
        contact_address: null,
        updated_at: '2026-05-16T00:00:00Z',
      }),
    ).toMatchObject({
      canonicalUrl: 'https://example.com/',
      brandName: '測試品牌',
    });
  });

  it('omits FAQPage JSON-LD when there are no FAQ items', () => {
    expect(buildFaqPageJsonLd([])).toBeNull();
  });

  it('builds FAQPage JSON-LD from build-time FAQ items', () => {
    expect(
      buildFaqPageJsonLd([
        {
          question: '包租代管適合誰？',
          answer: '適合希望降低管理成本並穩定出租流程的房東。',
          sort_order: 1,
        },
      ]),
    ).toMatchObject({
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '包租代管適合誰？',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '適合希望降低管理成本並穩定出租流程的房東。',
          },
        },
      ],
    });
  });

  it('omits LocalBusiness JSON-LD when profile data is empty', () => {
    expect(buildLocalBusinessJsonLd(null, 'https://example.com/')).toBeNull();
  });
});
