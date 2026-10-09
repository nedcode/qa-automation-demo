import { randomUUID } from 'node:crypto';

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

/**
 * Every test creates its own data with a unique name, so tests never depend
 * on each other or on what is already in the shared environment.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'QA',
    lastname: `Demo-${randomUUID().slice(0, 8)}`,
    totalprice: 250,
    depositpaid: true,
    bookingdates: { checkin: '2026-11-02', checkout: '2026-11-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
