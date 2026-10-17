# Architecture and data contracts

## Shared record

`profiles` contains stable owner ID, language, learner name, goals/preferences, consent, revision and dates. `records` contains owner/profile-scoped typed JSON records with ID, fingerprint, revision and dates. A scope index and a unique per-profile kind/fingerprint index enforce ownership and idempotent insertion. All SQL values are bound parameters.

The curriculum is versioned content, never learner progress. The current assessment is derived from the evidence history; no uninspectable aggregate level is stored. Independent success requires no recorded support. Descriptive familiar independence requires at least two different tasks; this threshold is an explicit product heuristic, not psychometric calibration. Delayed demonstrations require a reported delay, an independent successful attempt, and at least 24 hours since the latest recorded exposure to the same concept. Unknown outside rehearsal cannot be ruled out. Unfamiliar transfer additionally records novelty and task accomplishment. An error adds a review need while preserving earlier successes.

Dimensions expose exactly which concepts were assessed. A dimension label describes that recorded scope, not the whole language. Imported evidence, ambiguous audio, browser self-reports and disputed observations cannot automatically establish assessed ability. Learner confidence is a distinct record type. Correction/dispute records preserve the original observation and exclude contested evidence from assessment until restored or a fresh assessment is saved.

## HTTP

All routes under `/api/companion` use no-store responses. Mutations reject a different browser Origin. Data-bearing endpoints require a trusted Site identity; selected reviewer access instead requires a random, hashed, expiring capability token. Profile IDs are never authorization.

| Route | Behavior |
|---|---|
| `GET/POST /profiles` | List own profiles / create a fresh Tagalog profile |
| `GET/PATCH/DELETE /profiles/:id` | Current snapshot / optimistic preference update / confirmed deletion |
| `GET/POST /profiles/:id/records` | Own typed records / validated personal records |
| `DELETE /profiles/:id/records/:recordId` | Delete one owned record; remove associated audio bytes |
| `POST /profiles/:id/observations` | Capture learner practice as awaiting review |
| `POST /profiles/:id/checkpoint` | Save unfinished context; revision required on updates |
| `POST /profiles/:id/dispute` | Append correction, dispute, or restoration |
| `GET /profiles/:id/summary` | Dated portable summary |
| `GET /profiles/:id/report?from=&to=` | Period evidence, current separate assessments and priorities |
| `GET /profiles/:id/export` | Readable JSON record, portable context and authenticated audio download paths |
| `POST /profiles/:id/import` | Bounded imports, deduplication, visible rejection details and unverified source labels |
| `GET/POST /profiles/:id/share` | Own review access metadata / create a selected-work capability |
| `POST /profiles/:id/audio` | Explicitly consented audio upload, at most 15 MB |
| `GET /profiles/:id/audio/:recordId` | Owned audio only |
| `GET/POST /review` | Selected-work view / attributed feedback with `X-Review-Token` |
| `GET /review/audio/:recordId` | Only an explicitly selected audio file with the review token |
| `GET /catalog` | Curriculum, activities, research and recorded source metadata |

Profile updates and existing checkpoints use compare-and-swap revisions: a stale save returns 409 and cannot overwrite newer state. Evidence insertions are individually durable, so an abrupt lesson ending cannot lose already confirmed observations. Identical attempts with the same date, task, response, concept, modality, support and outcome deduplicate. Same-profile exports also retain original record identity for duplicate prevention when excerpts were withheld. Contradictory attempts remain separate. Imported preferences, shares and recording permissions are never activated.

## ChatGPT MCP

`POST /mcp` implements stateless JSON-RPC initialization, ping, tools/list, tools/call and notifications; JSON responses are valid Streamable HTTP responses. GET returns 405 rather than pretending to offer an SSE stream. Discovery contains schemas and teaching policy, never learner data. Calls use the current authenticated identity and per-profile connected consent. Permission failures return an explicit tool error, and missing identity is HTTP 401. No unsafe anonymous learner context is returned.

The web consent toggle and platform plugin installation are separate layers. An outage does not return fabricated success. Summaries carry `fetchedAt` and `lastSavedAt`; the UI displays stale snapshot state on connection failure.

## Native surface

The AppKit menu-bar app opens the authenticated learning workspace in the system browser, including direct links to knowledge, audio and privacy views. This lets the provider and browser handle passkeys/Touch ID; Google/OpenAI authentication is never embedded and browser session cookies are not captured or copied. All learner information remains in the same server record. The native window provides quick access and local recording/reminder tools, rather than a second learner database.

Native recordings require explicit OS microphone permission and remain local until saved and deliberately uploaded through Listen & speak. Temporary files are removed on cancel/quit. Native reminders are device preferences. The learner can explicitly apply the current web profile schedule through the `kuwento://reminders` link, review the local time/time zone in the app, and pause the Mac independently. Only validated schedule values are accepted; this URI grants no learner-record or account access. Browser reminders follow the web profile while open. A reminder notification opens the same browser workspace. Changing servers does not migrate learning data.

## Extension points

Additional languages require their own curriculum, accepted-form rules and educator review. The current API rejects unsupported language creation instead of reusing Tagalog criteria. AI speech/transcription can be added behind explicit consent and reliability metadata; no such external audio processing is hidden in this release. Add schema changes as append-only migrations and extend the acceptance tests for any new assessment claim.

## Tutoring maintenance workflow

`core/tutoring-contract.mjs` defines the typed operations and versioned runtime contract. `core/tutoring.mjs` applies requested profile changes, imports, actual observations, explicit original-evidence reviews, checkpoints and learner corrections. It records `tutor-update`, `profile-change`, and `assessment-review` rows in the existing owner/profile-scoped JSON record store; no database migration is needed. Privacy grants are excluded from the teaching preference allowlist.

Update receipts use a request hash, stable ID, two-minute processing lease, per-step status, and durable record/version references. Identical retries cannot duplicate observations or overwrite a later profile change. Invalid individual steps are reported as partial results; receipts explicitly distinguish a confirmed read-back from an accepted request. This is a resumable workflow, not a promise that every multi-step update is one SQL transaction.

`core/evidence-reviews.mjs` overlays explicit reviews on original evidence without rewriting its provenance. Ordinary imports never activate this overlay. A source-specific original-attempt review is required; known support is preserved, textual evidence cannot establish audio abilities, disputes take precedence, and unknown dates cannot create retention intervals. Review linkage uses the original observation fingerprint so removing permitted excerpts does not erase the underlying evidence judgment. Unknown concepts derive visible knowledge-index entries from saved evidence without assigning ability.

New MCP tools have typed schemas and accurate write/read annotations. The established `import_records` tool also accepts a single authorized tutoring operation envelope; a versioned contract returned by the established summary tool makes the workflow available to clients with cached discovery. REST file imports intentionally do not execute those envelopes. `get_learning_history` supports scoped cursor pagination, and summaries prioritize unfinished checkpoints over later completed sessions.
