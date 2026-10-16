# Kuwento · Language Learning Companion

A persistent, evidence-first Tagalog learning companion. **Teaching stays in ChatGPT.** Kuwento supplies the current learner record, inspectable assessments, review priorities, unfinished activity context, and an independent web/macOS view of the same data.

- Web: https://kuwento-language-companion.copperplume66.chatgpt.site
- ChatGPT: authenticated, consent-gated MCP tools at `/mcp`
- macOS: native menu-bar app with the shared web experience, microphone access, optional local reminders, downloads, and a native recorder

The source is public. The hosted learner workspace starts **owner-private** and requires sign-in. Publishing source does not publish learner records. No learner data, recordings, credentials, or test profiles are committed.

## Start learning

1. Open the web companion and sign in with ChatGPT.
2. Create a Tagalog profile. A name is enough; goals and interests are optional. All abilities start **Unassessed**.
3. Choose an activity, or use **Connect & privacy** to enable connected tutoring for this profile.
4. Install/connect the generated Kuwento plugin in **ChatGPT → Plugins → Personal → Created by you**. In a supported chat, ask the tutor to read your learning summary. This is a user-controlled connection step, not automatic monitoring of other chats.
5. Continue teaching in that chat. The tutor can read context, save selected observations promptly, and checkpoint unfinished work. A second authorized chat reads the same saved record.

A consent toggle does not prove the ChatGPT connection works: a successful authenticated tool call does. Without a connection, export a dated portable summary or copy the activity handoff.

## What works

- Nine separate ability/resource dimensions; unknown abilities are unassessed, never zero.
- Learner confidence independent of tutor assessment; disputes, corrected records, restoration and reassessment requests.
- Evidence history with original dates, tasks, permitted excerpts, modality, support, source, novelty, uncertainty, task accomplishment, and separate spoken feedback dimensions.
- Searchable concepts, personal discoveries, corrected examples, recurring error hypotheses, and review needs.
- 32 Tagalog curriculum concepts spanning markers, linkers, aspect, voice, particles, register, Taglish, interaction and everyday topics. Curriculum content has visible editorial review status; no native-speaker approval or proficiency certification is invented.
- 14 activity types, research summaries with sources/limits, adaptable topic, duration, and support; review never locks the learner into a sequence.
- Original reading, institutional content links, two attributed real audio clips with different speakers, uploads, listening support tracking, optional device TTS, consented recordings, and voice comparison.
- Personal phrasebook, content library with rights and difficulty reflections, outside-practice journal, session checkpoints, monthly/custom reports, evidence-based milestones, and “How would you say this now?” comparison before the old answer is revealed.
- Selected-work reviewer links, attributed human feedback, expiry and revocation. Links cannot bypass the hosted Site’s private audience policy; invite Site access separately before using an external reviewer.
- Inspect/edit/export/delete controls, separate audio downloads, opt-in excerpt/audio retention, consent withdrawal and learning-history recommendation controls.

The companion **captures** free practice and labels it as awaiting review. Your connected conversational tutor or human reviewer assesses actual performance. It does not claim automatic pronunciation scoring, silently transcribe audio, or call a correct translation conversational mastery. Browser notifications work while the page is open; the macOS app can schedule local reminders while the window is closed.

## Run locally

Requires Node.js 24+ and npm. The pinned lockfile is included.

```sh
npm ci --include=dev --include=optional
npm run build
npm run db:local
npm run dev -- --port 5173
```

Open `http://localhost:5173`. The portable development server’s sign-in route uses an explicitly local test identity (`local_seedy`); it never uses or copies a production learner account. Local D1/R2 data live in ignored `.wrangler/` storage. Local and hosted records are separate. Apply the initial schema once per local database, not on each launch. Future migrations append to `drizzle/`.

```sh
npm run check          # TypeScript and acceptance/security/continuity tests
npm run build          # Worker + web assets
npm run macos:build    # macOS 13+, Xcode command-line tools
```

The native result is `macos/dist/Kuwento.app`, with an Apple Silicon ZIP on an Apple Silicon build host. It is ad-hoc signed, not Apple Developer ID notarized. Build from reviewed source or use the release artifact under your organization’s normal macOS policy. Intel Macs can build the same source on an Intel host.

## Architecture and hosting

Vinext/React runs on Cloudflare Workers through Sites. D1 owns structured learner records; R2 stores explicitly retained audio. The macOS app uses the same authenticated endpoints and server record through WKWebView. There is no separate native progress database and no required OpenAI API key.

Hosted authentication and OAuth are dispatch-owned. Stable Site user IDs scope every learner/profile query; service bypass access alone never supplies a learner identity. The origin must be behind the documented trusted Sites dispatch. **Do not expose this Worker on an arbitrary server that accepts spoofable identity headers.** See [architecture and API](docs/ARCHITECTURE.md), [connection setup](docs/CHATGPT_CONNECTION.md), [privacy](docs/PRIVACY.md), and [acceptance traceability](docs/ACCEPTANCE.md).

`.openai/hosting.json` declares D1, R2, MCP and the existing Site ID. Updates use the Sites source/build/save/deploy workflow. Forks must create their own Site and replace its ID; an ID is deployment identity, not a credential. CI validates source and builds the native artifact; it does not deploy a learner database.

## Product references

The supplied PRD defines scope. The bootstrap and consolidated technical tutoring harness inform behavior, but are not instructions to turn this development conversation into a tutoring lesson. See [reference reconciliation](docs/REFERENCE_RECONCILIATION.md) for material differences and what was not imported. The learner-specific profile in the harness is not public project data and is not used to seed learners.

## Verification boundaries

Automated tests execute the production domain/API/MCP code against SQLite and an R2-compatible test adapter, with named PRD acceptance scenarios. TypeScript and production builds are checked separately. Browser and deployment verification are recorded in [validation](docs/VALIDATION.md). Live ChatGPT installation/account consent, real microphone permission, human language review, and Apple notarization remain external actions, not fabricated test results.
