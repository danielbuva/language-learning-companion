# Validation record

Date: October 16, 2026.

- TypeScript: `npm run typecheck`.
- Automated production-code acceptance/security/continuity suite: 27 tests.
- Production Worker/web build: `npm run build` / Sites build helper.
- Local D1 migration applied successfully; schema contains profile/record ownership, foreign keys, scope index and unique deduplication index.
- Actual local HTTP smoke: sign-in cookie, profile creation, MCP observation and summary, written/audio assessment separation, checkpoint, phrase save, contextual export, duplicate import, consent revocation, and test-profile cleanup passed.
- In-app browser QA at a narrow mobile width: first-use sign-in and profile creation, all-unknown initial assessment, overview layout, mobile navigation, phrasebook empty state/editor/save, and responsive display inspected. Desktop overview and phrase-to-practice handoff were also checked; the target selector now hides a phrase’s answer behind its meaning, and practice opened from a visible example retains model support. The Playwright MCP’s configured Chrome executable was unavailable; the supported in-app browser was used instead.
- Native AppKit/WebKit macOS application compiled on Apple Silicon, bundled and ad-hoc signed. Build includes menu-bar access, same learner web/API experience, microphone permission handling, native recording, local notification scheduling, file upload/download pickers and server selection.
- Two attributed Lingua Libre audio-source URLs returned HTTP 200 and an audio content type. Source pages expose the speaker/recordist, transcript and CC BY-SA 4.0 license. Speaker qualifications are not independently verified.

The hosted deployment succeeded with MCP capability and both D1 tables provisioned. The public GitHub repository and Apple Silicon release asset were verified, and both GitHub CI jobs passed. The native app was launched and rendered the real hosted sign-in boundary. Hosted MCP requests without a connected user identity were denied with HTTP 401; no authenticated learner call is claimed. A successful deployment is not evidence of a completed ChatGPT account connection. The live user-installed plugin read/write flow, real microphone capture, notification delivery under OS permissions, independent educator review of the curriculum, and Apple Developer ID notarization require their respective real external participation; none is simulated as completed here.

No production learner proficiency or progress was invented. Local QA and fixture records are explicitly test-only. The GitHub repository excludes D1/R2 local state, native build intermediates, tokens and recordings.
