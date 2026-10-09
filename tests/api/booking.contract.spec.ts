import { test, expect } from '../../src/fixtures';
import { buildBooking } from '../../src/data/bookingFactory';
import { expectToMatchSchema } from '../../src/schemas/validator';

test.describe('Booking API – contract', () => {
  test('create returns the stored booking in the agreed schema @smoke', async ({ api, authToken }) => {
    const booking = buildBooking();

    const response = await api.create(booking);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectToMatchSchema('createBookingResponse', body);
    expect(body.booking).toEqual(booking);

    await api.delete(body.bookingid, authToken);
  });

  test('get by id returns the same data that was created', async ({ api, existingBooking }) => {
    const response = await api.get(existingBooking.id);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectToMatchSchema('booking', body);
    expect(body).toEqual(existingBooking.data);
  });

  test('search by name finds the created booking', async ({ api, existingBooking }) => {
    const { firstname, lastname } = existingBooking.data;

    const response = await api.findByName(firstname, lastname);

    expect(response.status()).toBe(200);
    const ids = await response.json();
    expectToMatchSchema('bookingIdList', ids);
    expect(ids).toContainEqual({ bookingid: existingBooking.id });
  });
});
