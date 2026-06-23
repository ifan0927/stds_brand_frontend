import { describe, expect, it } from 'vitest';
import {
  getContactRows,
  getFooterServiceLinks,
  getHeaderCta,
  getLinkAttributes,
  getPrimaryNavItems,
  isContactNavItem,
  isNavItemActive,
  type SiteSettings,
} from './chrome';

const settings: SiteSettings = {
  brandName: '奕德不動產',
  brandNameEn: 'Trust Estate',
  logo: '/uploads/logos/logo-main-1.png',
  nav: [
    { label: '最新消息', href: '/news', external: false },
    { label: '關於奕德', href: '/#about', external: false },
    { label: '我是房客', href: '/tenant', external: false },
    { label: '我是房東', href: '/landlord', external: false },
    { label: '預約賞屋', href: 'https://docs.google.com/forms/', external: true },
    { label: '聯絡我們', href: '/#contact', external: false },
  ],
  contact: {
    phone: '06-208-1688',
    email: 'hello@yide.tw',
    address: '台南市東區東門路二段 158 號 3 樓',
    hours: '平日 10:00 — 19:00 · 例假日預約制',
  },
  social: {
    lineUrl: '#',
    fbUrl: 'https://www.facebook.com/trust-estate',
    fbLabel: '不動產何男',
  },
  forms: {
    viewingUrl: 'https://docs.google.com/forms/viewing',
    landlordUrl: 'https://docs.google.com/forms/landlord',
  },
  footerTagline: '深耕大台南，提供包租代管與居住服務。一份合約，雙向安心。',
  copyright: '© 2026 奕德不動產 Trust Estate',
};

describe('site chrome helpers', () => {
  it('keeps the site settings nav order and identifies the contact dropdown item', () => {
    const nav = getPrimaryNavItems(settings);

    expect(nav.map((item) => item.label)).toEqual([
      '最新消息',
      '關於奕德',
      '我是房客',
      '我是房東',
      '預約賞屋',
      '聯絡我們',
    ]);
    expect(nav.filter(isContactNavItem)).toHaveLength(1);
  });

  it('marks real routes active without treating hash links as page-active', () => {
    const [news, about, tenant] = getPrimaryNavItems(settings);

    expect(isNavItemActive(news, '/news')).toBe(true);
    expect(isNavItemActive(news, '/news/article')).toBe(true);
    expect(isNavItemActive(tenant, '/news')).toBe(false);
    expect(isNavItemActive(about, '/')).toBe(false);
  });

  it('adds safe attributes only for external links', () => {
    expect(getLinkAttributes('/tenant')).toEqual({ href: '/tenant' });
    expect(getLinkAttributes('https://docs.google.com/forms/')).toEqual({
      href: 'https://docs.google.com/forms/',
      target: '_blank',
      rel: 'noopener',
    });
    expect(getLinkAttributes('#')).toEqual({ href: '#' });
  });

  it('builds header CTA variants from settings', () => {
    expect(getHeaderCta(settings)).toEqual({
      label: '預約諮詢',
      href: '/#contact',
      external: false,
    });
    expect(getHeaderCta(settings, 'viewing')).toEqual({
      label: '預約賞屋',
      href: 'https://docs.google.com/forms/viewing',
      external: true,
    });
    expect(getHeaderCta(settings, 'landlord')).toEqual({
      label: '預約諮詢',
      href: 'https://docs.google.com/forms/landlord',
      external: true,
    });
  });

  it('uses the same contact settings for dropdown and footer rows', () => {
    const rows = getContactRows(settings);

    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'LINE', label: '官方帳號', href: '#', external: false }),
        expect.objectContaining({
          key: 'FB',
          label: '不動產何男',
          href: 'https://www.facebook.com/trust-estate',
          external: true,
        }),
        expect.objectContaining({ key: 'TEL', label: '06-208-1688', href: 'tel:062081688' }),
        expect.objectContaining({ key: 'MAIL', label: 'hello@yide.tw', href: 'mailto:hello@yide.tw' }),
        expect.objectContaining({ key: 'HRS', label: '平日 10:00 — 19:00 · 例假日預約制', href: null }),
      ]),
    );
    expect(rows.find((row) => row.key === 'MAP')?.href).toContain(encodeURIComponent(settings.contact.address));
  });

  it('excludes the contact dropdown item from footer service links', () => {
    expect(getFooterServiceLinks(settings).map((item) => item.label)).toEqual([
      '最新消息',
      '關於奕德',
      '我是房客',
      '我是房東',
      '預約賞屋',
    ]);
  });
});
