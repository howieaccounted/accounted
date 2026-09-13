import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fetchCompanyLookup } from '../fetch-company-lookup';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('fetchCompanyLookup fallbacks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('degrades to disabled when ticEnabled is false', async () => {
    const outcome = await fetchCompanyLookup('556677-8899', { ticEnabled: false });
    expect(outcome).toEqual({ status: 'disabled' });
  });

  it('maps 503 (service unavailable) to error status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ code: 'SERVICE_UNAVAILABLE' }),
    });

    const outcome = await fetchCompanyLookup('556677-8899', { ticEnabled: true });
    // Based on lib/company-lookup/fetch-company-lookup.ts, 503 is only disabled if it's EXTENSION_DISABLED
    expect(outcome).toEqual({ status: 'error' });
  });

  it('maps 404 (Company not found) to not_found status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Company not found' }),
    });

    const outcome = await fetchCompanyLookup('556677-8899', { ticEnabled: true });
    expect(outcome).toEqual({ status: 'not_found' });
  });

  it('handles network failures by returning error status', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));

    const outcome = await fetchCompanyLookup('556677-8899', { ticEnabled: true });
    expect(outcome).toEqual({ status: 'error' });
  });
});
