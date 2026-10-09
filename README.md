# QA Automation Demo – API, Contract & Mobile Smoke

A compact, realistic test-automation setup in **TypeScript**:

- **API tests with Playwright Test** against a public booking API
- **JSON schema validation** of every response (contract check with Ajv)
- **Business-rule tests** that show the difference between *"the endpoint answers"* and *"the result is correct"*
- **Maestro** smoke flow for a mobile app (with a reusable subflow)
- **GitLab CI** and **GitHub Actions** pipelines with a smoke quality gate on merge requests and a full regression on `main`

> The system under test is [restful-booker](https://restful-booker.herokuapp.com/apidoc/index.html), a public practice API. It is shared by many people and reset regularly, so occasional instability is possible.

---

## What this repository demonstrates

| Topic | Where |
|---|---|
| Risk-based structure: smoke vs. full regression (`@smoke` tag) | `tests/api/*.spec.ts`, `package.json` |
| API client as the API equivalent of a Page Object | `src/api/BookingClient.ts` |
| Fixtures: authentication and per-test data with cleanup | `src/fixtures.ts` |
| Independent, unique test data | `src/data/bookingFactory.ts` |
| Contract checks with JSON Schema (`additionalProperties: false`, formats) | `src/schemas/` |
| Authorisation: unauthenticated changes are refused **and** data stays unchanged | `tests/api/booking.security.spec.ts` |
| Business rules, boundary values and documented known defects | `tests/api/booking.business-rules.spec.ts` |
| Mobile smoke flow with a reusable subflow | `maestro/` |
| Quality gate in CI, JUnit + HTML reports as artefacts | `.gitlab-ci.yml`, `.github/workflows/` |

## Defects found in the system under test

The business-rule suite found three defects in the public API. The tests are marked with
`test.fail()` and a `defect` annotation: the pipeline stays green, the defects stay visible in the
report, and Playwright flags a test as *unexpectedly passed* once a defect is fixed.

| ID | Expected | Actual |
|---|---|---|
| DEMO-1 | Missing required field → `400` | `500 Internal Server Error` |
| DEMO-2 | Negative `totalprice` is rejected | Accepted and stored |
| DEMO-3 | `checkout` before `checkin` is rejected | Accepted and stored |

These are exactly the kind of errors a technically "working" endpoint can still get wrong.

## Run locally

Requirements: Node.js 20+.

```bash
npm ci
npm run typecheck
npm test            # full API suite
npm run test:smoke  # quality-gate subset
npm run report      # open the HTML report
```

Another environment: `BASE_URL=https://staging.example.com npm test`.
Credentials can be supplied via `API_USER` / `API_PASSWORD`; the defaults are the public demo credentials of restful-booker.

## Pipelines

**GitLab CI** (`.gitlab-ci.yml`)
- Merge request: type check → `api:smoke` (blocks the merge when red)
- `main` and scheduled pipelines: full `api:regression`
- JUnit report shown in the merge request, HTML report kept as artefact for 14 days
- `mobile:maestro`: manual template job, runs only when `MAESTRO_CLOUD_API_KEY` and `APP_APK_PATH` are set

**GitHub Actions** (`.github/workflows/api-tests.yml`)
- Pull request: smoke · push to `main`, weekday nightly and manual: full regression

## Mobile (Maestro)

`maestro/flows/search_article.yaml` is a smoke flow on the public Wikipedia Android app
(`org.wikipedia`): clean start → skip onboarding (subflow) → search → open the result → verify.
It mirrors the structure of a critical customer journey in a banking app.

```bash
# requires Maestro CLI and a running Android emulator with the Wikipedia app installed
maestro test maestro/
```

> The Maestro flow is **not executed in CI** in this demo – that needs an emulator-capable runner or a
> device cloud. The `mobile:maestro` job shows how it would be wired in.

## Project structure

```
src/
  api/BookingClient.ts      API client (one place per endpoint)
  data/bookingFactory.ts    unique test data
  schemas/                  JSON schemas + Ajv validator
  fixtures.ts               api client, auth token, booking with cleanup
tests/api/                  contract, security, lifecycle, business-rule tests
maestro/                    mobile smoke flow + reusable subflow
.gitlab-ci.yml              GitLab pipeline
.github/workflows/          GitHub Actions pipeline
```

---

Nenad Petrović · Senior QA & Test Automation Engineer · [LinkedIn](https://www.linkedin.com/in/nepetrovic/)
