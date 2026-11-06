# Verification Rules

## Required Checks

After backend code changes, run:

```bash
npm test
```

After formatting-sensitive changes, run:

```bash
npm run format:check
```

If formatting was intentionally changed, run:

```bash
npm run format
```

## Package Manager

- Use `npm`, not `yarn`.
- Keep `package-lock.json` in the repository.
- Do not add dependency/package-manager shortcuts without an explicit request.

## Deployment Checks

When changing Docker files, compose files, Vercel config, ports, environment variables, or startup behavior, consider running the relevant configuration command:

```bash
docker compose config
docker compose -f docker-compose.dev.yml config
```

Use heavier Docker commands only when the change needs runtime verification.

## Reporting

When finishing work, report:

- what changed
- which commands were run
- whether they passed
- anything that could not be verified

Do not claim the project works, tests, or formats correctly unless the command was run successfully.
