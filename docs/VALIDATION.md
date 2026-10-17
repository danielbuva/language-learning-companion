# Validation record

Date: October 16, 2026.

- TypeScript: `npm run typecheck`.
- Automated production-code acceptance/security/continuity suite: 50 tests.
- Production Worker/web build: `npm run build` / Sites build helper.
- Local D1 migration applied successfully; schema contains profile/record ownership, foreign keys, scope index and unique deduplication index.
- Actual local HTTP smoke: sign-in cookie, profile creation, MCP observation and summary, written/audio assessment separation, checkpoint, phrase save, contextual export, duplicate import, consent revocation, and test-profile cleanup passed.
- In-app browser QA at a narrow mobile width: first-use sign-in and profile creation, all-unknown initial assessment, overview layout, mobile navigation, phrasebook empty state/editor/save, and responsive display inspected. Desktop overview and phrase-to-practice handoff were also checked; the target selector now hides a phrase’s answer behind its meaning, and practice opened from a visible example retains model support. The Playwright MCP’s configured Chrome executable was unavailable; the supported in-app browser was used instead.
- Native AppKit macOS application compiled on Apple Silicon, bundled and ad-hoc signed. Build includes menu-bar access, system-browser access to the same learner workspace, microphone permission handling, native recording, local notification scheduling, explicit schedule handoff, and server selection.
- Two attributed Lingua Libre audio-source URLs returned HTTP 200 and an audio content type. Source pages expose the speaker/recordist, transcript and CC BY-SA 4.0 license. Speaker qualifications are not independently verified.

The hosted deployment succeeded with MCP capability and both D1 tables provisioned. The public GitHub repository and Apple Silicon release asset were verified, and both GitHub CI jobs passed. The native app was launched and rendered the real hosted sign-in boundary. Hosted MCP requests without a connected user identity were denied with HTTP 401. During the guided onboarding update, the installed Kuwento connector successfully called list_learner_profiles and get_learning_summary against the authorized live profile. The companion displayed the resulting real verification receipt. A successful deployment alone is not evidence of account connection. The live user-installed plugin write flow, real microphone capture, notification delivery under OS permissions, independent educator review of the curriculum, and Apple Developer ID notarization require their respective real external participation; none is simulated as completed here.

No production learner proficiency or progress was invented. Local QA and fixture records are explicitly test-only. The GitHub repository excludes D1/R2 local state, native build intermediates, tokens and recordings.

## Native passkey correction · 1.0.1

The first embedded native sign-in attempt failed at Google’s passkey page before a local fingerprint prompt. Google’s secure-browser policy excludes app-controlled embedded OAuth user agents. The macOS companion now opens the authenticated workspace in the system browser, with native quick-access/recording/reminder tools. It does not spoof another browser, copy authentication cookies, bypass provider checks, or claim Touch ID was completed. The provider and OS decide which eligible passkey and verification method to offer.

Primary guidance: https://developers.google.com/identity/protocols/oauth2/policies#use-secure-browsers and https://developer.apple.com/documentation/authenticationservices/passkey-use-in-web-browsers.

The corrected native 1.0.1 app was launched, its quick-access controls rendered, and Open my learning workspace was verified to open the real hosted workspace in the user’s default browser (Arc). Actual passkey/Touch ID completion remains for the user to verify in that browser.

## Guided onboarding update · 2026-10-16

- Added four-step, resumable onboarding and an existing-learner setup checklist.
- Domain tests 28–32 cover saved preferences, no invented assessments, real MCP verification versus permission, completion requirements, revocation/reconnection, owner isolation, and forged/imported receipt rejection.
- Local browser QA creates a disposable learner profile, saves goals/support/accessibility, reloads at the saved connection step, exercises deferral/resume, observes a loopback MCP receipt, and finishes setup. This loopback QA is not evidence of a production account connection.
- Connection verification is a dated receipt of a successful summary read, not continuous monitoring of installation or future availability.

- Production verification: on October 16, 2026 at 18:00 Pacific, the installed connector successfully read the authorized profile. The deployed onboarding displayed its authenticated receipt in the narrow app window. All nine ability dimensions remained unassessed. No learning attempts or proficiency claims were created by this verification.
- GitHub CI passed both the web/record and macOS build jobs for the onboarding implementation.

## Consolidated Settings update · 2026-10-16

- Renamed Connect & privacy to Settings and grouped all existing profile configuration into six focused sections.
- Centralized profile/goals/context, language support/correction/accessibility/history, ChatGPT access, excerpt/audio retention and review sharing, reminders/devices, and export/import/profile management.
- Kept legacy macOS links compatible through URL normalization; test 33 covers the old route, category bookmarks, unknown category fallback, and unrelated route rejection.
- Local browser QA uses a disposable profile to save goals and learning preferences, inspect retention switches and review controls, and check reminder/data sections. Production learner settings are not changed during this layout verification.

## Authorized tutoring maintenance update · 2026-10-16

- Added requested profile/preference maintenance, a complete tutoring-update workflow, explicit original-evidence reviews, scoped history pagination, and durable read-back verification.
- Added 17 meaningful workflow/security/evidence tests, including recovery from a partial storage outage and conflicting review decisions with tied timestamps. The exact acceptance phrase completes via the already-existing import tool, without any companion API visit; a separate service instance reads the saved context as another conversation.
- Covered protected settings, stale revisions, original support/media restrictions, unknown dates, confidence/source boundaries, duplicate and simultaneous retries, partial errors, later deletion/change, consent revocation, corrections, excerpt withdrawal, and new concept visibility.
- Real local Worker/D1 HTTP smoke passed the same cached-tool workflow: prior evidence import/review, actual test observations, requested goals/preferences, an unfinished checkpoint, duplicate retry, read-back verification and revocation. Every fixture is disposable and local.
- Added a visible learner history with original provenance, explicit review rationale, requested field changes and per-operation receipts. No production proficiency or language attempts were manufactured to test this feature.
- Remaining platform boundary: ChatGPT can use only conversations actually available to it, and account/workspace tool approvals still apply. The implementation does not require new companion configuration after the profile's existing connected permission is granted.
