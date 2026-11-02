# Guest management — 02 November 2026

- `/admin` is a separate React route; it never imports the invitation's GSAP entry. Warm dark/copper styling matches the invitation while prioritizing readable names and timestamps.
- Viewer shell has loading, error/retry, unauthenticated sign-in, forbidden-account, no-guests and no-search-results states. Admin API authorizes owner email from Sites identity headers before touching D1, including CSV exports. Private/no-store responses, no public attendee API, no browser secret. Local mock identity is restricted to explicit DEV mode.
- 15 unit/security tests pass. Production Vinext build passes with `/admin` classified dynamic.
- Local D1 smoke: submit a name through existing `/api/rsvp`, read that name via authenticated admin search, export it in CSV, and reject unauthenticated requests with client-spoofed identity headers.
- Browser: observed 401 sign-in state, local mock sign-in, real existing D1 rows, filtered search returning one result, CSV success acknowledgement, clear filter and refresh revealing the new local test record.
- Desktop and 390px mobile checked, no horizontal overflow, no browser warnings/errors in inspected logs. Screenshot files: guest-admin-desktop.png, guest-admin-mobile.png. These show explicitly named local test records, not production guest data.
- Shared Site access unchanged. No production test guests created. No destructive guest-management actions added.
- Production sign-in relies on Sites dispatch; no physical-device or production-owner login session was exercised by the agent.
