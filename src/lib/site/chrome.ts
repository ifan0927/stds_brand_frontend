export type SiteSettings = {
  brandName: string;
  brandNameEn: string;
  logo: string;
  nav?: NavItem[] | null;
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  social: {
    lineUrl: string;
    fbUrl: string;
    fbLabel: string;
  };
  forms: {
    viewingUrl: string;
    landlordUrl: string;
  };
  footerTagline: string;
  copyright: string;
};

export type NavItem = {
  label: string;
  href: string;
  external?: boolean | null;
};

export type HeaderCtaVariant = 'consult' | 'viewing' | 'landlord';

export type HeaderCta = {
  label: string;
  href: string;
  external: boolean;
};

export type LinkAttributes = {
  href: string;
  target?: '_blank';
  rel?: 'noopener';
};

export type ContactRow = {
  key: 'LINE' | 'FB' | 'TEL' | 'MAIL' | 'MAP' | 'HRS';
  label: string;
  href: string | null;
  external: boolean;
};

const CONTACT_NAV_LABEL = '聯絡我們';

export function getPrimaryNavItems(settings: SiteSettings): NavItem[] {
  return (settings.nav ?? []).filter((item): item is NavItem => Boolean(item?.label && item.href));
}

export function isContactNavItem(item: NavItem): boolean {
  return item.label === CONTACT_NAV_LABEL;
}

export function getHeaderCta(settings: SiteSettings, variant: HeaderCtaVariant = 'consult'): HeaderCta {
  if (variant === 'viewing') {
    return {
      label: '預約賞屋',
      href: settings.forms.viewingUrl,
      external: isExternalUrl(settings.forms.viewingUrl),
    };
  }

  if (variant === 'landlord') {
    return {
      label: '預約諮詢',
      href: settings.forms.landlordUrl,
      external: isExternalUrl(settings.forms.landlordUrl),
    };
  }

  return {
    label: '預約諮詢',
    href: '/#contact',
    external: false,
  };
}

export function getLinkAttributes(href: string, external: boolean | null | undefined = isExternalUrl(href)): LinkAttributes {
  if (!external) return { href };
  return { href, target: '_blank', rel: 'noopener' };
}

export function isNavItemActive(item: NavItem, currentPath: string): boolean {
  const path = normalizePath(currentPath);
  const hrefPath = getInternalHrefPath(item.href);
  if (!hrefPath) return false;
  if (hrefPath === '/') return path === '/';
  return path === hrefPath || path.startsWith(`${hrefPath}/`);
}

export function getContactRows(settings: SiteSettings): ContactRow[] {
  return [
    {
      key: 'LINE',
      label: '官方帳號',
      href: settings.social.lineUrl || '#',
      external: isExternalUrl(settings.social.lineUrl),
    },
    {
      key: 'FB',
      label: settings.social.fbLabel,
      href: settings.social.fbUrl || '#',
      external: isExternalUrl(settings.social.fbUrl),
    },
    {
      key: 'TEL',
      label: settings.contact.phone,
      href: `tel:${toTelephoneHref(settings.contact.phone)}`,
      external: false,
    },
    {
      key: 'MAIL',
      label: settings.contact.email,
      href: `mailto:${settings.contact.email}`,
      external: false,
    },
    {
      key: 'MAP',
      label: settings.contact.address,
      href: buildMapUrl(settings.contact.address),
      external: true,
    },
    {
      key: 'HRS',
      label: settings.contact.hours,
      href: null,
      external: false,
    },
  ];
}

export function getFooterServiceLinks(settings: SiteSettings): NavItem[] {
  return getPrimaryNavItems(settings).filter((item) => !isContactNavItem(item));
}

function getInternalHrefPath(href: string): string | null {
  if (isExternalUrl(href) || href.startsWith('#') || href.includes('#')) return null;
  const path = href.split('#')[0].split('?')[0] || '/';
  return normalizePath(path);
}

function normalizePath(path: string): string {
  const cleanPath = path.split('#')[0].split('?')[0] || '/';
  if (cleanPath === '/') return '/';
  return cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;
}

function isExternalUrl(href: string | null | undefined): boolean {
  if (!href || href === '#') return false;
  return /^https?:\/\//.test(href);
}

function toTelephoneHref(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

function buildMapUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
