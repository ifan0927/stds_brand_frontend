import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildCanonicalUrl, buildPageMetadata } from './site';

describe('site SEO helpers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('builds route metadata with normalized SITE_URL and canonical path', () => {
    vi.stubEnv('SITE_URL', 'https://example.com/');

    expect(
      buildPageMetadata({
        title: '我是房客',
        description: '可入住物件與預約賞屋資訊',
        path: '/tenant',
        siteName: '奕德不動產',
        ogImagePath: '/uploads/hero/index-slider-1.jpg',
      }),
    ).toEqual({
      title: '我是房客',
      description: '可入住物件與預約賞屋資訊',
      canonicalUrl: 'https://example.com/tenant',
      siteName: '奕德不動產',
      ogType: 'website',
      ogImageUrl: 'https://example.com/uploads/hero/index-slider-1.jpg',
    });
  });

  it('falls back to default metadata when optional fields are blank', () => {
    vi.stubEnv('SITE_URL', 'https://example.com');

    expect(
      buildPageMetadata({
        title: ' ',
        description: '',
        siteName: null,
      }),
    ).toMatchObject({
      title: '奕德不動產 — 大台南包租代管',
      description: '奕德不動產深耕大台南，提供包租與代管服務。一份合約、雙向安心，房東收益穩定，房客住得放心。',
      canonicalUrl: 'https://example.com/',
      siteName: '奕德不動產',
    });
  });

  it('fails clearly when SITE_URL is missing', () => {
    expect(() => buildCanonicalUrl('/')).toThrow(
      'Missing required build-time environment variable SITE_URL',
    );
  });

  it('fails clearly when SITE_URL is not an origin URL', () => {
    vi.stubEnv('SITE_URL', 'https://example.com/path');

    expect(() => buildCanonicalUrl('/')).toThrow(
      'Invalid SITE_URL: expected an origin URL with no path, query, or hash',
    );
  });

  it('rejects canonical paths with queries or hashes', () => {
    vi.stubEnv('SITE_URL', 'https://example.com');

    expect(() => buildCanonicalUrl('/tenant?preview=true')).toThrow(
      'Invalid canonical path: expected no query string or hash',
    );
    expect(() => buildCanonicalUrl('/tenant#faq')).toThrow(
      'Invalid canonical path: expected no query string or hash',
    );
  });

  it('rejects non-root-relative canonical paths', () => {
    vi.stubEnv('SITE_URL', 'https://example.com');

    expect(() => buildCanonicalUrl('tenant')).toThrow(
      'Invalid canonical path: expected a root-relative path such as /tenant',
    );
    expect(() => buildCanonicalUrl('//evil.example/tenant')).toThrow(
      'Invalid canonical path: expected a root-relative path such as /tenant',
    );
  });

  it('rejects protocol-relative metadata image paths', () => {
    vi.stubEnv('SITE_URL', 'https://example.com');

    expect(() =>
      buildPageMetadata({
        ogImagePath: '//evil.example/image.jpg',
      }),
    ).toThrow('Invalid metadata URL path: expected an absolute URL or root-relative path');
  });
});
