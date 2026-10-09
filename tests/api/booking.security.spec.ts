import { test, expect } from '../../src/fixtures';
import { buildBooking } from '../../src/data/bookingFactory';

/**
 * Changing or deleting someone else's data without authentication must be
 * refused, and the data must stay unchanged afterwards.
 */
test.describe('Booking API – authorisation', () => {
  test('update without token is rejected and data stays unchanged @smoke', async ({ api, existingBooking }) => {
    const response = await api.update(existingBooking.id, buildBooking({ totalprice: 1 }));

    expect(response.status()).toBe(403);
    const stored = await (await api.get(existingBooking.id)).json();
    expect(stored).toEqual(existingBooking.data);
  });

  test('partial update without token is rejected', async ({ api, existingBooking }) => {
    const response = await api.partialUpdate(existingBooking.id, { totalprice: 1 });

    expect(response.status()).toBe(403);
  });

  test('delete without token is rejected and the booking still exists', async ({ api, existingBooking }) => {
    const response = await api.delete(existingBooking.id);

    expect(response.status()).toBe(403);
    expect((await api.get(existingBooking.id)).status()).toBe(200);
  });

  test('invalid credentials do not return a token', async ({ request }) => {
    const response = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });

    const body = await response.json();
    expect(body.token).toBeUndefined();
  });
});
