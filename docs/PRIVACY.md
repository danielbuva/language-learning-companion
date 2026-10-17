# Learner control and privacy

The public GitHub repository contains application source, curriculum and tests. It contains no learner records. Hosted learner information is stored in the Site’s D1 database and private R2 object storage, scoped to a stable authenticated Site user ID and language profile. The hosted workspace starts owner-private; changing that hosting audience is a separate administrative action, not a side effect of saving a phrase or generating a review link.

Default settings: connected chat access off, excerpts off, recordings off, reviewer sharing off, reminders paused. Learning-history recommendations are enabled for the owner’s own record and can be disabled. A profile’s consent settings do not apply to other profiles.

Only explicitly contributed observations, checkpoints, materials, reflections and audio are saved. Full-conversation retention is neither required nor implemented. Outside practice is self-reported; imports start unverified, with any explicit original-evidence review kept separate. A privacy limitation never lowers a language ability score.

- Turning off excerpt retention removes stored evidence response/original-response excerpts in this profile. Tasks, concise feedback and dated evidence metadata remain inspectable; the learner may delete individual observations too.
- Turning off recording retention deletes this profile’s stored audio objects and attachment records. Unsaved device recordings remain local until discarded or the page is closed.
- Revoking connected chat access immediately denies data-bearing companion tool calls. This does not delete existing progress.
- Turning off history-based recommendations changes their basis to stated goals. It does not erase observations or imply lost ability.
- Reviewer links contain a random secret in the URL fragment; the review page removes it from browser history and sends it in a request header. The database stores only its hash. It expires after 1–30 days, is limited to explicitly selected work, and can be revoked. Human identity/authority is self-declared and visible. Downloaded copies cannot be recalled.
- Turning off reviewer sharing revokes all current profile review links.
- JSON export includes contextual learning records and a dated summary. Audio metadata contains authenticated download paths; audio can be downloaded separately from Voice history. JSON is not represented as containing audio bytes.
- Deleting a profile removes its companion records, audio and review access. It does **not** delete ChatGPT conversations, external content, reviewer downloads or existing exports.

Linked institutional materials and the two optional Lingua Libre audio samples remain at their sources; selecting remote audio sends a normal media request to Wikimedia. TTS is device-generated and labeled as such. No audio is silently transcribed or sent to an AI provider. No analytics or third-party advertising scripts are included.

Hosting-provider infrastructure backups and browser/native cookie stores are governed by those services; application deletion must not be represented as deleting every outside backup or conversation. The app confirms its own deletion scope. Security reports should avoid posting private learner evidence to public GitHub issues.

The macOS companion uses the system browser for account sign-in and learner views. It does not receive your Google password, passkey, browser cookies or biometric data. Its recorder files and optional notification schedule are local device state. Applying the web reminder schedule to the Mac is explicit and reviewable; pausing Mac reminders is a device override and does not change a language assessment.

## Onboarding and connection status

The learner can save a name/nickname, goals, interests, practice opportunities, self-described experience, English/Tagalog balance, correction timing, and accessibility preferences. Optional fields can be left blank. These preferences and the resumable setup step belong to the selected profile and are included in its export/deletion scope. They do not establish proficiency. Existing retention and sharing choices are preserved when setup is revisited.

After a successful authenticated MCP learning-summary read, Kuwento stores a per-profile receipt with the operation name and verification time. It contains no conversation text, is excluded from learner evidence and activity counts, and is included in profile export. Withdrawing connected chat access removes this receipt. Imports cannot activate receipts, onboarding completion, or permissions.

## Authorized tutoring updates and explicit reviews

Connected tutoring permission allows selected observations, prior available learning records, requested personal/teaching changes, and lesson checkpoints to be saved from a supported chat. It does not grant unrestricted access to conversation history. The tutor must state what context is actually available. No new companion permission is required for these record-maintenance operations, and the tutor cannot broaden privacy grants, retention, sharing, or reminder settings.

Imported history starts unverified. An explicit review of the available original attempt may contribute to a descriptive assessment while retaining imported origin, source, original support/outcome, date precision, rationale and uncertainty. Unknown dates remain unknown; unreviewed summaries, self-reported success and unavailable/ambiguous audio cannot establish observed ability. Learner confidence remains separate. Withdrawing response retention removes stored response text without automatically discarding an otherwise valid review.

Operation receipts record concise purpose, source scope/limitations, hashes for retry integrity, saved record/version references and any partial errors; they do not retain the submitted batch or a full conversation. Profile-change audit records retain the requested fields before/after and a concise request explanation. Attempts, reviews, corrections and changes remain inspectable in Learning history and included in profile export/deletion scope. ChatGPT may apply its own tool approval policies; Kuwento does not disguise writes as reads or alter those policies.
