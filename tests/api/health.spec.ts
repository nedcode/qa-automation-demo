import { test, expect } from '../../src/fixtures';

test('API is reachable @smoke', async ({ api }) => {
  const response = await api.ping();
  expect(response.status()).toBe(201);
});
