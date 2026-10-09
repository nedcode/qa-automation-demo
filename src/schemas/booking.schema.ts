/**
 * JSON schemas describing the API contract.
 * If the backend renames a field, changes a type or drops a required field,
 * the schema check fails before any UI or mobile app is affected.
 */

const bookingDates = {
  type: 'object',
  required: ['checkin', 'checkout'],
  properties: {
    checkin: { type: 'string', format: 'date' },
    checkout: { type: 'string', format: 'date' },
  },
  additionalProperties: false,
} as const;

export const bookingSchema = {
  $id: 'booking',
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string', minLength: 1 },
    lastname: { type: 'string', minLength: 1 },
    totalprice: { type: 'integer', minimum: 0 },
    depositpaid: { type: 'boolean' },
    bookingdates: bookingDates,
    additionalneeds: { type: 'string' },
  },
  additionalProperties: false,
} as const;

export const createBookingResponseSchema = {
  $id: 'createBookingResponse',
  type: 'object',
  required: ['bookingid', 'booking'],
  properties: {
    bookingid: { type: 'integer', minimum: 1 },
    booking: { $ref: 'booking' },
  },
  additionalProperties: false,
} as const;

export const bookingIdListSchema = {
  $id: 'bookingIdList',
  type: 'array',
  items: {
    type: 'object',
    required: ['bookingid'],
    properties: { bookingid: { type: 'integer' } },
  },
} as const;
