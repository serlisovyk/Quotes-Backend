# `trust proxy` is a hop count

Date: 2026-11-06 · Status: accepted

## Context

`express-rate-limit` identifies a client by IP. Behind a proxy or a CDN every request arrives with
`X-Forwarded-For`; without `trust proxy` the limiter sees the proxy's address, and `true` trusts any
forwarded header. The rule was added for hosting on Vercel (commit `265def8`); `vercel.json` was
removed from the repo afterwards (`6a4f20b`), so the repo no longer describes the deployment.

## Decision

- `app.set('trust proxy', TRUST_PROXY_HOPS)` stays in `app.js`, before `express-rate-limit`.
- `TRUST_PROXY_HOPS` is a number (now `1`), in `constants/app.constant.js`; never `true`.
- It changes only when the proxy topology changes, checked against the real hosting.

## Consequences

- Rate limiting counts the client IP seen through the configured number of hops.
- Rejected: `trust proxy: true` (any client could spoof its address).
