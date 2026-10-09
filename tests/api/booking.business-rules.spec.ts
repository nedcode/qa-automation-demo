import { test, expect } from '../../src/fixtures';
import { buildBooking } from '../../src/data/bookingFactory';

/**
 * Business rules: what a correct booking must look like from the customer's
 * and the business's point of view – not just "the endpoint answers".
 *
 * These tests are expected to FAIL against the public demo API, because it
 * does not enforce these rules. They are marked with `test.fail()` and an
 * annotation, so the pipeline stays green while the defects remain visible
 * in the report. As soon as a defect is fixed, Playwright reports the test
 * as "unexpectedly passed" and the marker has to be removed.
 */
test.describe('Booking API – business rules', () => {
  test('booking without last name is rejected with a client error (4xx)', async ({ request }) => {
    test.fail(true, 'Known defect: API answers 500 instead of 400 for a missing required field');
    test.info().annotations.push({ type: 'defect', description: 'DEMO-1: missing field → 500' });

    const { lastname, ...withoutLastname } = buildBooking();
    const response = await request.post('/booking', { data: withoutLastname });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('negative total price is rejected', async ({ api, authToken }) => {
    test.fail(true, 'Known defect: negative price is accepted');
    test.info().annotations.push({ type: 'defect', description: 'DEMO-2: totalprice < 0 accepted' });

    const response = await api.create(buildBooking({ totalprice: -5 }));
    if (response.ok()) await api.delete((await response.json()).bookingid, authToken);

    expect(response.status()).toBe(400);
  });

  test('checkout before checkin is rejected', async ({ api, authToken }) => {
    test.fail(true, 'Known defect: checkout date before checkin date is accepted');
    test.info().annotations.push({ type: 'defect', description: 'DEMO-3: checkout < checkin accepted' });

    const response = await api.create(
      buildBooking({ bookingdates: { checkin: '2026-11-05', checkout: '2026-11-02' } }),
    );
    if (response.ok()) await api.delete((await response.json()).bookingid, authToken);

    expect(response.status()).toBe(400);
  });

  // Boundary values: the smallest and a large valid price must be accepted unchanged.
  for (const price of [0, 1, 1_000_000]) {
    test(`valid boundary price ${price} is stored unchanged`, async ({ api, authToken }) => {
      const booking = buildBooking({ totalprice: price });

      const response = await api.create(booking);

      expect(response.status()).toBe(200);
      const { bookingid, booking: stored } = await response.json();
      expect(stored.totalprice).toBe(price);
      await api.delete(bookingid, authToken);
    });
  }
});
