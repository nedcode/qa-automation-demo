import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Booking } from '../data/bookingFactory';

/**
 * API client = the API equivalent of a Page Object.
 * Tests describe *what* they check; this class knows *how* to call the API.
 * If an endpoint or header changes, only this file changes.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  async createToken(username: string, password: string): Promise<string> {
    const response = await this.request.post('/auth', { data: { username, password } });
    const body = await response.json();
    if (!body.token) throw new Error(`Authentication failed: ${JSON.stringify(body)}`);
    return body.token as string;
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  findByName(firstname: string, lastname: string): Promise<APIResponse> {
    return this.request.get('/booking', { params: { firstname, lastname } });
  }

  update(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.auth(token) });
  }

  partialUpdate(id: number, changes: Partial<Booking>, token?: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: changes, headers: this.auth(token) });
  }

  delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.auth(token) });
  }

  private auth(token?: string): Record<string, string> {
    return token ? { Cookie: `token=${token}` } : {};
  }
}
