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

The AppKit menu-bar app uses WKWebView’s persistent cookie store. Microphone permission is granted only to the configured companion origin and only after OS permission. Upload pickers are origin-restricted. Native recording is local until explicitly saved and uploaded; temporary files are removed on cancel/quit. Local notification scheduling uses the active profile’s local time, IANA time zone and pause state. The bridge accepts only main-frame messages from the companion host. Changing servers does not migrate data.

## Extension points

Additional languages require their own curriculum, accepted-form rules and educator review. The current API rejects unsupported language creation instead of reusing Tagalog criteria. AI speech/transcription can be added behind explicit consent and reliability metadata; no such external audio processing is hidden in this release. Add schema changes as append-only migrations and extend the acceptance tests for any new assessment claim.
