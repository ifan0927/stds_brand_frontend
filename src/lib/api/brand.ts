export type BrandProfile = {
  brand_name: string;
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
  updated_at: string;
};

export type ProfileResponse = {
  profile: BrandProfile | null;
};

export type FAQItem = {
  question: string;
  answer: string;
  sort_order: number;
};

export type FaqsResponse = {
  items: FAQItem[];
};

export type PropertyAvailabilityItem = {
  property_id: string;
  property_public_name: string;
  address: string;
  has_vacant_room: boolean;
};

export type AvailabilityResponse = {
  items: PropertyAvailabilityItem[];
};

export type PublicBrandHomeData = {
  profile: BrandProfile | null;
  faqs: FAQItem[];
  availability: PropertyAvailabilityItem[];
};

const ENDPOINTS = {
  profile: '/api/v1/public/brand/profile',
  faqs: '/api/v1/public/brand/faqs',
  availability: '/api/v1/public/properties/availability',
} as const;

export async function fetchPublicBrandHomeData(): Promise<PublicBrandHomeData> {
  const [profile, faqs, availability] = await Promise.all([
    fetchProfile(),
    fetchFaqs(),
    fetchAvailability(),
  ]);

  return {
    profile: profile.profile,
    faqs: faqs.items,
    availability: availability.items,
  };
}

async function fetchProfile(): Promise<ProfileResponse> {
  return fetchJson(ENDPOINTS.profile, isProfileResponse);
}

async function fetchFaqs(): Promise<FaqsResponse> {
  return fetchJson(ENDPOINTS.faqs, isFaqsResponse);
}

async function fetchAvailability(): Promise<AvailabilityResponse> {
  return fetchJson(ENDPOINTS.availability, isAvailabilityResponse);
}

async function fetchJson<T>(
  path: string,
  validate: (value: unknown) => value is T,
): Promise<T> {
  const url = buildPublicApiUrl(path);
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Failed to fetch public brand API ${path}: ${formatError(error)}`);
  }

  if (!response.ok) {
    throw new Error(`Public brand API ${path} returned ${response.status} ${response.statusText}`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`Public brand API ${path} returned invalid JSON: ${formatError(error)}`);
  }

  if (!validate(payload)) {
    throw new Error(`Public brand API ${path} returned an invalid response shape`);
  }

  return payload;
}

function buildPublicApiUrl(path: string): string {
  const baseUrl = import.meta.env.BRAND_API_BASE_URL;
  if (typeof baseUrl !== 'string' || baseUrl.trim() === '') {
    throw new Error('Missing required build-time environment variable BRAND_API_BASE_URL');
  }

  return new URL(path, ensureTrailingSlash(baseUrl.trim())).toString();
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function isProfileResponse(value: unknown): value is ProfileResponse {
  return isRecord(value) && 'profile' in value && (value.profile === null || isBrandProfile(value.profile));
}

function isBrandProfile(value: unknown): value is BrandProfile {
  return (
    isRecord(value) &&
    typeof value.brand_name === 'string' &&
    isNullableString(value.contact_phone) &&
    isNullableString(value.contact_email) &&
    isNullableString(value.contact_address) &&
    typeof value.updated_at === 'string'
  );
}

function isFaqsResponse(value: unknown): value is FaqsResponse {
  return isRecord(value) && Array.isArray(value.items) && value.items.every(isFAQItem);
}

function isFAQItem(value: unknown): value is FAQItem {
  return (
    isRecord(value) &&
    typeof value.question === 'string' &&
    typeof value.answer === 'string' &&
    typeof value.sort_order === 'number' &&
    Number.isInteger(value.sort_order)
  );
}

function isAvailabilityResponse(value: unknown): value is AvailabilityResponse {
  return isRecord(value) && Array.isArray(value.items) && value.items.every(isPropertyAvailabilityItem);
}

function isPropertyAvailabilityItem(value: unknown): value is PropertyAvailabilityItem {
  return (
    isRecord(value) &&
    typeof value.property_id === 'string' &&
    typeof value.property_public_name === 'string' &&
    typeof value.address === 'string' &&
    typeof value.has_vacant_room === 'boolean'
  );
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
