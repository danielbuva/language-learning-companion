# Validation record

Date: October 16, 2026.

- TypeScript: `npm run typecheck`.
- Automated production-code acceptance/security/continuity suite: 32 tests.
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
