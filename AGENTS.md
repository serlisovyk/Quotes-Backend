# Agent Instructions

This file defines how AI coding agents should work in this repository.

This is a compact Express + JavaScript + PostgreSQL backend for a quotes application. Keep the code clean, practical, and proportional to the project size. The project is used for backend learning, so clarity matters more than clever abstractions.

## Rule Files

Read these files before making changes:

- [Architecture Rules](rules/architecture.md)
- [Style Rules](rules/style.md)
- [Scope Rules](rules/scope.md)
- [Validation & Error Rules](rules/validation-errors.md)
- [Testing Rules](rules/testing.md)
- [Verification Rules](rules/verification.md)

## Working Principles

- Prefer small, focused changes.
- Follow the existing project structure.
- Do not add new abstractions unless they remove real duplication or clarify a boundary.
- Do not rewrite working code just to make it look different.
- Keep the project approachable for a backend learner.
- If a request conflicts with these rules, follow the user's explicit request and mention the tradeoff.

## Project Defaults

- Package manager: `npm`
- Runtime: Node.js
- Framework: Express
- Language: JavaScript ESM
- Database: PostgreSQL with Sequelize
- Validation: Express Validator
- Tests: Vitest + Supertest
- Formatting: Prettier

## Before Finishing

Run the relevant checks:

```bash
npm run format:check
npm test
```

If formatting was changed, run:

```bash
npm run format
```

If a check cannot be run, report that clearly.
