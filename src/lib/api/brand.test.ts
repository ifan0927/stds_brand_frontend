import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchPublicBrandHomeData } from './brand';

const profileResponse = {
  profile: {
    brand_name: '奕德不動產',
    contact_phone: '06-123-4567',
    contact_email: 'hello@example.com',
    contact_address: '台南市東區測試路 1 號',
    updated_at: '2026-05-16T00:00:00Z',
  },
};

const faqsResponse = {
  items: [
    {
      question: '包租代管適合誰？',
      answer: '適合希望降低管理成本並穩定出租流程的房東。',
      sort_order: 1,
    },
  ],
};

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

describe('fetchPublicBrandHomeData', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('fetches the three public backend paths from BRAND_API_BASE_URL', async () => {
    vi.stubEnv('BRAND_API_BASE_URL', 'https://brand-api.example.test');
    const fetchMock = mockFetchJson({
      '/api/v1/public/brand/profile': profileResponse,
      '/api/v1/public/brand/faqs': faqsResponse,
      '/api/v1/public/properties/availability': availabilityResponse,
    });

    await expect(fetchPublicBrandHomeData()).resolves.toEqual({
      profile: profileResponse.profile,
      faqs: faqsResponse.items,
      availability: availabilityResponse.items,
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://brand-api.example.test/api/v1/public/brand/profile',
      'https://brand-api.example.test/api/v1/public/brand/faqs',
      'https://brand-api.example.test/api/v1/public/properties/availability',
    ]);
  });

  it('fails clearly when BRAND_API_BASE_URL is missing', async () => {
    await expect(fetchPublicBrandHomeData()).rejects.toThrow(
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

    await expect(fetchPublicBrandHomeData()).rejects.toThrow(
      'Public brand API /api/v1/public/brand/profile returned 500 Internal Server Error',
    );
  });

  it('fails clearly when the response shape is invalid', async () => {
    vi.stubEnv('BRAND_API_BASE_URL', 'https://brand-api.example.test');
    mockFetchJson({
      '/api/v1/public/brand/profile': { profile: { brand_name: 'missing required fields' } },
      '/api/v1/public/brand/faqs': faqsResponse,
      '/api/v1/public/properties/availability': availabilityResponse,
    });

    await expect(fetchPublicBrandHomeData()).rejects.toThrow(
      'Public brand API /api/v1/public/brand/profile returned an invalid response shape',
    );
  });

  it('accepts backend empty-state payloads', async () => {
    vi.stubEnv('BRAND_API_BASE_URL', 'https://brand-api.example.test');
    mockFetchJson({
      '/api/v1/public/brand/profile': { profile: null },
      '/api/v1/public/brand/faqs': { items: [] },
      '/api/v1/public/properties/availability': { items: [] },
    });

    await expect(fetchPublicBrandHomeData()).resolves.toEqual({
      profile: null,
      faqs: [],
      availability: [],
    });
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
