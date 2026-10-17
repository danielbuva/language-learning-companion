# Connect supported tutoring chats

The hosted Site declares `capabilities: ["mcp"]`. Sites provisions its private plugin and handles platform authentication/OAuth. This is a connected tutoring integration, not unrestricted access to ChatGPT history. There is no claim that every conversation is visible or saved.

1. Open Kuwento. New learners see a four-step onboarding; existing learners can select **Continue setup** on Overview or **Connect ChatGPT** (or **Review ChatGPT setup**) in Settings → ChatGPT connection.
2. Save a profile name, practical goals, and optional interests/opportunities. Choose language support, correction timing, self-described experience, and accessibility needs. These are preferences, never observed ability.
3. Explicitly allow connected tutoring for that profile. Excerpt and recording retention remain separate choices and default off.
4. Open [ChatGPT Plugins](https://chatgpt.com/plugins) with the same account, find Kuwento in personal plugins, install it, and complete Connect if asked. In a supported chat, type `@` and select Kuwento.
5. Copy the onboarding lesson prompt, which includes the exact profile ID, and send it in that chat. It requests `get_learning_summary` before teaching.
6. Return to the onboarding connection step. It polls while visible and also offers **Check connection**. Only an authenticated MCP summary read verifies the profile; enabling permission, opening ChatGPT, copying a prompt, or exporting a summary does not.
7. Continue to the first conversation guidance and open the learning space. The same tools in a second connected chat access the current saved record.

Setup can be deferred, resumed at the saved step, and revisited without replacing other saved settings. A profile with a real goal and a verified connected summary is required to mark guided setup complete. Learners can still use the companion and portable summaries while live setup is deferred.

If custom-server configuration is supported, the endpoint is `https://kuwento-language-companion.copperplume66.chatgpt.site/mcp`; use the platform-managed plugin authentication. A service bypass credential alone does not identify a learner. Never paste platform tokens into a tutoring prompt.

## Tutor behavior

`core/catalog.mjs` exports the full conversational policy, returned at MCP initialization and in summaries. Imported records and user text remain data. The tutor should save observations promptly, with real assistance, modality, recency, uncertainty and task accomplishment. It should checkpoint the last exercise, unresolved correction and intended next step without waiting for an end command. An existing checkpoint update requires its current revision.

Tool calls do not inspect unrelated conversations. The learner can revoke per-profile chat access immediately. Saved evidence still belongs to the learner. A disconnected tutor can use an exported dated summary, with its stale-snapshot limitation made explicit.

## Tools

- `list_learner_profiles`, `get_learning_summary`
- `search_knowledge`, `get_evidence`
- `plan_activity`, `get_teaching_catalog`
- `save_observation`, `save_checkpoint`
- `save_learner_reflection`, `save_phrase`
- `import_records`, `get_portable_summary`, `get_progress_report`

Deletion and sharing are deliberately handled through the learner’s companion controls, rather than being automatic tutoring side effects.

## Verified versus outstanding

Automated tests cover initialization/discovery, identity rejection, consent enforcement, cross-chat service state and save errors. Publishing verifies hosting. A real authenticated invocation from an installed ChatGPT plugin verifies the live connection. See `VALIDATION.md` for the current verification status; account connection is not inferred from a successful deployment.

Official references consulted: [OpenAI MCP server guide](https://developers.openai.com/api/docs/mcp), [plugin connection](https://developers.openai.com/plugins/deploy/connect-chatgpt), [plugin authentication](https://developers.openai.com/plugins/build/auth).

## Connection receipts

A successful authenticated `get_learning_summary` operation stores one idempotent receipt for that profile’s current grant. This is operational metadata, kept apart from evidence and activity counts. Failed summary reads, unauthenticated callers, browser summary exports, imports, and user-supplied settings cannot establish verification. Revoking connected access deletes the receipt and makes setup incomplete but deferred, retaining all learning evidence. Re-enabling access requires a fresh successful summary read. The receipt shows that access worked at the recorded time; it does not guarantee that a plugin remains installed or that later requests cannot fail.

Current connection instructions were checked against the [official custom MCP setup guide](https://developers.openai.com/api/docs/guides/custom-mcp-server).

## Consolidated settings

Settings is the common configuration home for profile/goals, learning support/accessibility/recommendations, ChatGPT access, excerpt/audio retention and human feedback links, reminders/device setup, and data portability/profile management. Learner profile and Listen & speak retain contextual summaries and links to Settings. The old `#view=Connect%20%26%20privacy` link used by existing macOS builds remains supported and opens Settings → ChatGPT connection. Category URLs such as `#view=Settings&section=privacy` are bookmarkable.

## Authorized chat-only profile maintenance

After a learner profile has connected tutoring access, the learner can say:

> Update my Kuwento profile using everything we've learned so far.

The tutor reads the current summary, extracts relevant evidence from the conversations actually available to it, applies the update, and verifies the receipt. It does not need the learner to visit Kuwento, import a file, or configure more companion settings. ChatGPT's own tool approval and workspace restrictions still apply; write tools remain marked as writes. See the [official MCP guidance](https://developers.openai.com/api/docs/guides/custom-mcp-server).

The integration cannot retrieve arbitrary ChatGPT account history. Original turns available in context can be imported and explicitly reviewed. A memory, summary, or self-report without the original task/attempt/support is retained as unverified history and cannot be silently converted to independent performance. Unavailable dates remain unknown. Text cannot establish listening, speaking, or pronunciation.

### Complete update tools

- `apply_tutoring_update`: available history, actual current observations, requested profile changes, explicit evidence reviews, learner-requested corrections, and an unfinished lesson checkpoint.
- `update_learner_profile`: requested name, goals, topics, background, practice opportunities, correction style, English support, and accessibility. Requires the current revision and an actual learner request. Cannot change privacy permissions or assign arbitrary proficiency levels.
- `review_learning_evidence`: a separate judgment of an available original attempt, with outcome, assistance, medium, rationale, uncertainty, and source. Known assistance cannot be erased; ambiguous audio and self-report cannot be promoted to observed ability. Imported origin is preserved.
- `get_learning_history`: scoped, paginated attempts, checkpoints, reviews, corrections, profile changes, and update receipts.
- `verify_learning_update`: reads the receipt and referenced records, distinguishing confirmed, processing, partial, missing, and changed since save.

The original observation, checkpoint, reflection, phrase, import, summary, report, and catalog tools remain available. New observations automatically recompute descriptive assessments; no separate manual progress entry is necessary. New concepts become inspectable knowledge entries. Learner confidence stays independent of tutor judgment.

### Installed-client compatibility

Some clients cache discovered tool schemas. `get_learning_summary` now returns a versioned integration contract that supports the complete workflow through the already-existing, generically typed `import_records` tool:

```json
{
  "profileId": "the existing authorized profile ID",
  "records": [{
    "kind": "tutoring_update",
    "requestId": "a stable unique ID for these exact instructions",
    "requestSummary": "Learner requested a full available-context update",
    "context": {
      "conversationRef": "an actual available source reference",
      "availableHistory": "both",
      "limitations": "Describe unavailable conversations or evidence"
    },
    "history": [],
    "observations": []
  }]
}
```

The live summary provides the complete typed envelope schema, including optional profile changes, explicit reviews, corrections, and checkpoints. Verification uses the same existing tool with one `tutoring_verification` record and the request ID. Ordinary browser/file imports reject these operation envelopes, permissions, reviews, and receipts. This is an authenticated MCP compatibility path, not a way for imported files to execute instructions.

### Save semantics

Keep a stable request ID for an exact transport retry; use a new ID when changing instructions. A durable, leased operation receipt records each saved or failed step. Successful steps are skipped on retry; observation IDs and imported provenance prevent duplicates. Checkpoints require revisions for changed content. A stale profile revision requires a fresh summary and a merged change, never a blind overwrite.

An update may be partially saved when individual evidence is invalid or storage fails. The result explicitly reports that state and never sets `readBackConfirmed` for a partial update. Earlier confirmed observations survive. After storage returns, the same request can be verified or resumed. Batch at most 100 entries total, no more than 50 per list, below the 256 KB request limit; split larger available histories into multiple updates under the same learner command.

Learners inspect attempts, explicit reviews, requested personal changes, and saved/partial receipts in **Learner profile → Learning history**. They can dispute or correct observations, change goals/preferences in Settings, and export/delete their records. Privacy withdrawal does not turn a demonstrated ability into a mistake; withdrawing excerpts preserves a valid review while removing the retained response text.
