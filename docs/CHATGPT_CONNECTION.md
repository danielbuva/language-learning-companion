# Connect supported tutoring chats

The hosted Site declares `capabilities: ["mcp"]`. Sites provisions its private plugin and handles platform authentication/OAuth. This is a connected tutoring integration, not unrestricted access to ChatGPT history. There is no claim that every conversation is visible or saved.

1. Sign in to the web companion and create/select your Tagalog profile.
2. In **Connect & privacy**, enable connected tutoring for that profile. Excerpt and recording retention remain separate choices and default off.
3. Install/connect the generated Kuwento plugin from **Plugins → Personal → Created by you**. Availability and required account/workspace permissions depend on the supported ChatGPT surface.
4. Start a chat with that plugin and say: “Use Kuwento to read my current learning summary. Continue my saved activity, or help me choose a new one. Keep one manageable prompt active.”
5. The tutor calls `list_learner_profiles` and `get_learning_summary`, then adapts from actual responses. The same tools in a second connected chat access the current saved record.

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
