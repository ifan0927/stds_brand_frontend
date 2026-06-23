import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchPropertyAvailability } from './brand';

const availabilityResponse = {
  items: [
    {
      property_id: 'property-1',
      property_public_name: '東區寓所',
      address: '台南市東區測試路 1 號',
      has_vacant_room: true,
    },
  ],
};

describe('fetchPropertyAvailability', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('fetches the public availability path from BRAND_API_BASE_URL', async () => {
    vi.stubEnv('BRAND_API_BASE_URL', 'https://brand-api.example.test');
    const fetchMock = mockFetchJson({
      '/api/v1/public/properties/availability': availabilityResponse,
    });

    await expect(fetchPropertyAvailability()).resolves.toEqual(availabilityResponse.items);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://brand-api.example.test/api/v1/public/properties/availability',
    ]);
  });

  it('fails clearly when BRAND_API_BASE_URL is missing', async () => {
    await expect(fetchPropertyAvailability()).rejects.toThrow(
      'Missing required build-time environment variable BRAND_API_BASE_URL',
    );
  });

  it('fails clearly when the API returns a non-2xx response', async () => {
    vi.stubEnv('BRAND_API_BASE_URL', 'https://brand-api.example.test');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    await expect(fetchPropertyAvailability()).rejects.toThrow(
      'Public brand API /api/v1/public/properties/availability returned 500 Internal Server Error',
    );
  });

  it('fails clearly when the response shape is invalid', async () => {
    vi.stubEnv('BRAND_API_BASE_URL', 'https://brand-api.example.test');
    mockFetchJson({
      '/api/v1/public/properties/availability': { items: [{ property_id: 'missing fields' }] },
    });

    await expect(fetchPropertyAvailability()).rejects.toThrow(
      'Public brand API /api/v1/public/properties/availability returned an invalid response shape',
    );
  });

  it('accepts backend empty-state payloads', async () => {
    vi.stubEnv('BRAND_API_BASE_URL', 'https://brand-api.example.test');
    mockFetchJson({
      '/api/v1/public/properties/availability': { items: [] },
    });

    await expect(fetchPropertyAvailability()).resolves.toEqual([]);
  });
});

function mockFetchJson(payloadsByPath: Record<string, unknown>) {
  const fetchMock = vi.fn(async (url: string | URL | Request) => {
    const requestUrl = new URL(String(url));
    const payload = payloadsByPath[requestUrl.pathname];

    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      async json() {
        return payload;
      },
    };
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
