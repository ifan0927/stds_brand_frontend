export type PropertyAvailabilityItem = {
  property_id: string;
  property_public_name: string;
  address: string;
  has_vacant_room: boolean;
};

export type AvailabilityResponse = {
  items: PropertyAvailabilityItem[];
};

const AVAILABILITY_ENDPOINT = '/api/v1/public/properties/availability';

export async function fetchPropertyAvailability(): Promise<PropertyAvailabilityItem[]> {
  const response = await fetchJson(AVAILABILITY_ENDPOINT, isAvailabilityResponse);
  return response.items;
}

export function sortAvailabilityForDisplay(
  items: PropertyAvailabilityItem[],
): PropertyAvailabilityItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const availabilityRank = Number(b.item.has_vacant_room) - Number(a.item.has_vacant_room);
      return availabilityRank || a.index - b.index;
    })
    .map(({ item }) => item);
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
