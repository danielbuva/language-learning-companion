# PRD acceptance traceability

The named tests in `tests/acceptance.test.mjs` execute production domain, HTTP and MCP handlers against SQLite with real schema/unique constraints. The local smoke test additionally uses actual Worker routes and local D1, not the test adapter. Test learners are disposable and are never seeded into hosted learner data.

| PRD scenario | Implementation / automated evidence |
|---|---|
| Start with no prior records | Tests 01, 07; first-use UI needs only a name; nine dimensions remain unassessed |
| Two separate connected chats | Test 02 and actual HTTP/MCP smoke; same scoped D1 record, no repeated onboarding |
| Leave mid-lesson | Test 03; durable observation saves and unfinished checkpoints |
| Request a new topic | Test 04; activity/topic choices and retained preferences/evidence |
| Correct immediately after examples | Test 05; model support never counts as independent or delayed mastery |
| Error returns after delay | Test 06; prior evidence preserved and review need added |
| Written activities only | Test 07; audio/speech/pronunciation remain unassessed |
| Confidence differs from tutor judgment | Test 08; separate confidence, dispute/correction and reassessment records |
| Ambiguous audio/transcription | Test 09; uncertain evidence and unassessed spoken-feedback fields |
| Unfamiliar role-play | Test 10; novelty, task accomplishment and support remain separate |
| Open web or macOS | Test 11; same API/state; native build and actual browser QA recorded separately |
| Repeated imports or unavailable connection | Tests 12, 19, 20, 22, 23, 25; stable identity/fingerprints, unverified imports, explicit failures and dated snapshots |
| Export, delete or share selected records | Tests 13, 15, 18, 21, 24; scope, isolation, consent withdrawal, audio removal and expiring/revocable links |
| Research-backed activity | Test 14; sources, studied outcomes, limits and non-Tagalog generalization are inspectable |

Additional tests cover compare-and-swap profile/checkpoint revisions (16, 27), actual delayed gaps with intervening rehearsal (17), personal phrases as practice targets (26), and cross-origin rejection (21).

## Product coverage beyond the scenarios

| Feature group | Working surface |
|---|---|
| Profile, confidence, preferences, accessibility, changing goals | Learner profile |
| Vocabulary/phrases/grammar/sound/strategy/can-do index; filters and related concepts | Knowledge index |
| Transparent curriculum and open prerequisite connections | Roadmap |
| All 13 PRD activity classes plus then/now enrichment | Practice + ChatGPT tools |
| Listening, support history, replays/pace/transcript/translation, speaking recordings, comparison | Listen & speak |
| Personal expressions and related concepts | Phrasebook and knowledge/practice targets |
| Discovery, personal materials, rights, difficulty/understanding reflections | Content library |
| Outside practice and session evidence/corrections | Journal |
| Chosen-period and monthly reports, evidence examples, independent/delayed observations, milestones | Reports |
| Portable summaries, imports/exports, personal data correction/deletion, scope and revocation | Connect & privacy |
| Invited human feedback, selected audio and written work, authority and expiry | Reviewer links |
| Increasing immersion and English support | Learner preference returned to the tutor |
| Pausable local-time reminders | Web while open; macOS scheduled notifications |
| Convenient quick access, microphone and downloads | Native macOS menu-bar app |

The static catalog represents curriculum content, never completed learner progress. Human review, real-world learning outcomes, account installation and microphone permissions are not claimed to have happened just because a test passes. Exact descriptions and external verification boundaries are documented in the README and VALIDATION.md.
