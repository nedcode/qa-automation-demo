import { test as base, expect } from '@playwright/test';
import { BookingClient } from './api/BookingClient';
import { buildBooking, type Booking } from './data/bookingFactory';

interface Fixtures {
  api: BookingClient;
  authToken: string;
  /** A booking created before the test and deleted after it. */
  existingBooking: { id: number; data: Booking };
}

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  authToken: async ({ api }, use) => {
    // Public demo credentials of restful-booker. In a real project these
    // come from CI secrets, never from the repository.
    const username = process.env.API_USER ?? 'admin';
    const password = process.env.API_PASSWORD ?? 'password123';
    await use(await api.createToken(username, password));
  },

  existingBooking: async ({ api, authToken }, use) => {
    const data = buildBooking();
    const response = await api.create(data);
    expect(response.ok(), 'test setup: booking could not be created').toBeTruthy();
    const { bookingid } = await response.json();

    await use({ id: bookingid, data });

    // Clean up even if the test failed; ignore "already deleted".
    await api.delete(bookingid, authToken);
  },
});

export { expect };
