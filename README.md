# Hackathon Repo Doctor

```mermaid
graph LR
    A[Messy seed repo] -->|Bob: diagnose| B[Architecture doc + severity-ranked fixes]
    B -->|Bob: generate tests| C[10/10 tests passing]
    C -->|Bob: fix top 2 issues| D[11/11 tests passing, safety net proven]
```

Built and tested live during the IBM Bob 2.0 Hackathon (Sept 25–27, 2026).

## The problem
Most hackathon projects die the moment the event ends. No docs, no tests, no clear path back in, so builders abandon repos they might've actually wanted to keep. This project demonstrates a Bob-powered workflow that fixes that in minutes, not hours: point Bob at a freshly-built, messy repo and get back an architecture doc, a real test safety net, and a prioritized fix list, then have Bob act on the top priorities itself.

## What Bob actually did, in order
1. **Scaffolded** a deliberately rushed Express API (`quickjobs-api`), no docs, no tests, on purpose, this is the "before" state.
2. **Diagnosed** the codebase: architecture overview, dependency map, and a severity-ranked list of issues (see `bob_sessions/`).
3. **Built a real test suite** (Jest + Supertest), 10/10 passing, covering all four routes including edge cases.
4. **Fixed the top 2 flagged issues** (missing PORT fallback, no input validation on POST), then updated the test suite to prove the fix works, 11/11 passing.

Every step above has its full Bob task session screenshotted in `bob_sessions/`.

## Why this matters
The alternative to this workflow is: nothing happens, or a builder manually documents and tests their own repo one file at a time. This compresses that into a few Bob task runs on a repo you already have open, no new setup cost.

## Run it yourself

```
cd quickjobs-api
npm install
npm start
npm test
```

`npm start` runs on `process.env.PORT` or 3000. `npm test` should show 11/11 passing.

## Limitations
- Demonstrated on one small seed repo, not yet tested on a larger real-world codebase.
- In-memory data store only, resets on restart, this was intentional scope for the seed app, not a limitation of the Bob workflow itself.

## Built with
IBM Bob 2.0, solo, in 4 hours.
