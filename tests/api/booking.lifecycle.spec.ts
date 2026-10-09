import { test, expect } from '../../src/fixtures';
import { buildBooking } from '../../src/data/bookingFactory';
import { expectToMatchSchema } from '../../src/schemas/validator';

test.describe('Booking API – lifecycle', () => {
  test('full update replaces all fields', async ({ api, authToken, existingBooking }) => {
    const changed = buildBooking({ totalprice: 499, depositpaid: false, additionalneeds: 'Late checkout' });

    const response = await api.update(existingBooking.id, changed, authToken);

    expect(response.status()).toBe(200);
    expectToMatchSchema('booking', await response.json());
    expect(await (await api.get(existingBooking.id)).json()).toEqual(changed);
  });

  test('partial update changes only the given field', async ({ api, authToken, existingBooking }) => {
    const response = await api.partialUpdate(existingBooking.id, { totalprice: 320 }, authToken);

    expect(response.status()).toBe(200);
    const stored = await (await api.get(existingBooking.id)).json();
    expect(stored).toEqual({ ...existingBooking.data, totalprice: 320 });
  });

  test('deleted booking can no longer be read', async ({ api, authToken }) => {
    const { bookingid } = await (await api.create(buildBooking())).json();

    const deletion = await api.delete(bookingid, authToken);

    // restful-booker answers a successful DELETE with 201 (not 200/204) – documented API quirk.
    expect(deletion.status()).toBe(201);
    expect((await api.get(bookingid)).status()).toBe(404);
  });

  test('unknown id returns 404', async ({ api }) => {
    expect((await api.get(999_999_999)).status()).toBe(404);
  });
});
