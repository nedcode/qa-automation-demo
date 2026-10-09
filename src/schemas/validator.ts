import Ajv, { type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';
import { bookingIdListSchema, bookingSchema, createBookingResponseSchema } from './booking.schema';

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema([bookingSchema, createBookingResponseSchema, bookingIdListSchema]);

/** Asserts that `data` matches the schema and prints every violation if it does not. */
export function expectToMatchSchema(schemaId: string, data: unknown): void {
  const validate = ajv.getSchema(schemaId) as ValidateFunction | undefined;
  if (!validate) throw new Error(`Unknown schema: ${schemaId}`);

  const valid = validate(data);
  const errors = (validate.errors ?? [])
    .map((e) => `${e.instancePath || '(root)'} ${e.message}`)
    .join('\n');

  expect(valid, `Response does not match schema "${schemaId}":\n${errors}`).toBe(true);
}
