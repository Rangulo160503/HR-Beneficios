# frontend-core

Shared core (Clean Architecture) for the HR Beneficios frontend apps.

## Copy into each app

From repo root:

```sh
rm -rf <APP>/src/core
cp -R frontend-core <APP>/src/core
```

Apps must remain independent. The core must not import React or router libraries.

## Usage

- Instantiate a `LocalSessionStore` with an app-specific key.
- Use `validateSessionAndAuthorize` to decide what to render:
  - `OK`
  - `SHOW_LOGIN`
  - `NOT_AUTHORIZED`
  - `ERROR`

Example:

```js
import { LocalSessionStore } from "./core/infrastructure/session/LocalSessionStore";
import {
  validateSessionAndAuthorize,
  SessionStatus,
} from "./core/flujo/use-cases/ValidateSessionAndAuthorize";

const sessionStore = new LocalSessionStore("hr_admin_session");

const result = await validateSessionAndAuthorize({
  sessionStore,
  sessionValidator: (session) => Boolean(session?.access_token),
});

if (result.status === SessionStatus.SHOW_LOGIN) {
  // render login
}
```

## Rules

- UI must not access `localStorage` directly for session data.
- Update session validation in `ValidateSessionAndAuthorize` or provide a `sessionValidator`.
