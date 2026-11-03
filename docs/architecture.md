# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

Record your plan here before editing code.

- **Presentation tier decision:** Keep each capability in its own React component and use the shared `getJson` client for relative `/api` requests. Render accessible loading, error, empty, and success states; keep presentation state and formatting out of the API and data tiers.
- **Logic tier decision:** Keep Express routes thin and put validation and persistence behavior in `octofitService.ts`. Return the documented response envelopes and convert invalid input, malformed IDs, and missing records into deliberate 4xx responses rather than leaking Mongoose cast/validation errors as 500s.
- **Data tier decision:** Use Mongoose models for schema validation, references, defaults, and persistence. Keep the seed additive and idempotent through stable upserts; do not clear collections or overwrite unrelated application data.
- **Activity tracking approach:** Validate required fields, positive minutes, and well-formed IDs; verify the referenced user and team exist before creating a record. Store references, type, minutes, a deterministic computed points value (one point per minute), and `occurredAt`; return the persisted record from both create and list operations.
- **Team management approach:** List teams with their names, mascots, and member IDs. Require a non-empty name when creating a team, preserve a supplied mascot and member list, and rely on model defaults for an omitted members array.
- **Leaderboard approach:** Aggregate activity points by team, include each team’s name, sort by total points descending with a deterministic tie-break, and assign ranks starting at 1.
- **Workout suggestions approach:** Resolve the user by email and return a deliberate 4xx if no user matches. Rank available workouts using the user’s fitness goal and recent activity, put the best match first, and include a concise reason; return an empty suggestions array when there are no suitable records.

## Test plan

Run the focused contract suite after each tier, then run both builds and the full suites as a final check. Record actual outcomes when run; these commands are a plan, not a claim that validation has already passed.

1. **Data tier:** `npm run test:data --prefix octofit-tracker/backend` — failures point to model constraints/defaults/references or seed behavior, including idempotency and preservation of unrelated records.
2. **Logic tier:** `npm run test:api --prefix octofit-tracker/backend` — failures point to route/service behavior, validation and 4xx handling, persisted response shapes, team membership, leaderboard totals/ranks, or recommendation matching.
3. **Presentation tier:** `npm test --prefix octofit-tracker/frontend` — failures point to route rendering, API request construction, or accessible loading/success/empty/error states. The most recent supplied run reported **15 frontend tests failed**; the pages shown in its output still displayed “Implementation pending.”
4. **Backend type check:** `npm run build --prefix octofit-tracker/backend` — failures indicate TypeScript errors in backend models, services, routes, or configuration.
5. **Frontend type check and bundle:** `npm run build --prefix octofit-tracker/frontend` — failures indicate frontend TypeScript or Vite build issues.
6. **Final regression check:** `npm test --prefix octofit-tracker/backend` and `npm test --prefix octofit-tracker/frontend` — confirm the focused changes did not regress other contracts.
