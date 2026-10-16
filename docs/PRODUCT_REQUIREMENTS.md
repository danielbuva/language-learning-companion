# Language Learning Companion
## Product Requirements Document

**Status:** Full-product specification  
**Initial language:** Tagalog  
**Product surfaces:** ChatGPT companion integration, web companion, and macOS companion

## 1. Product definition

A persistent language-learning companion that gives the conversational tutor and learner a shared, inspectable record of the learner’s abilities, goals, practice, and progress.

Teaching remains primarily inside ChatGPT conversations. The companion supplies continuity, evidence, review priorities, and a visible path toward independent communication. Its web and macOS experiences let learners understand and manage their learning without replacing the conversational teacher.

**Core promise:** Start a new supported, connected learning conversation and continue from the learner’s current abilities—not from zero and not from an unreliable assumption that a completed exercise means mastery.

The product supports both resuming the previous lesson and beginning a different activity appropriate to the same learner’s current proficiency.

## 2. Intended users and outcomes

The primary user is an independent language learner who prefers conversational tutoring but needs reliable continuity and a clearer understanding of progress. The product must also accommodate learners with uneven abilities, including people who understand familiar speech but have little speaking or writing practice.

The learner should be able to answer: **What can I do now? What is still difficult? What should I practice next? Why?**

The tutor should understand what has been introduced, what the learner has demonstrated independently, where evidence is weak, which mistakes recur, and which activities suit the learner’s goals and preferences.

Success means stronger independent communication, delayed retention, and transfer to unfamiliar situations. Time spent, completed lessons, vocabulary counts, and streaks are not substitutes for those outcomes.

## 3. Product scope and boundaries

| Included in the final product | Outside the product’s purpose |
|---|---|
| Cross-chat learning continuity and a shared learner record | Unrestricted monitoring of unrelated conversations |
| A searchable knowledge index, evidence history, and separate learner and tutor assessments | Treating one opaque score as the learner’s complete ability |
| Adaptive conversational practice and a research-informed activity catalog | A compulsory sequence of scripted lessons that replaces the tutor |
| A visible curriculum, practical communication goals, and review priorities | Permanent mastery labels based on exposure or one correct answer |
| Listening, speaking, reading, writing, and interaction development | Claims of official proficiency certification or guaranteed time to fluency |
| Web and macOS companion experiences | Engagement mechanics that pressure the learner to protect a streak |
| Personal materials, phrasebooks, real-world practice, and optional human feedback | Unconsented storage or sharing of conversations and recordings |

Tagalog is the first fully supported language. The product must accommodate additional supported languages with separate learner records, appropriate curricula, and language-specific assessment standards. It must not imply that an unsupported language has a validated curriculum.

## 4. Starting, continuing, and changing a learning session

### First use

A learner can describe their goals, experience, preferred correction style, and preferred balance of English and the target language. They can contribute prior learning records, self-assessments, or selected conversations. Imported material must retain its origin and must not automatically establish mastery.

The learner can begin practicing without completing a lengthy placement test. Unknown abilities remain unassessed until evidence is available.

### Returning to learning

A supported, authorized learning chat must have access to a concise, current learning summary: active goals, demonstrated abilities, uncertain areas, recent difficulties, review priorities, teaching preferences, and the last relevant session context.

The learner can choose to resume an unfinished activity, continue the previous topic, review, or start something new at their current level. The tutor must not repeatedly ask for information already present in the available learner record.

An unfinished lesson must preserve the last exercise, unresolved correction, and intended next step when these have been saved. Important saved observations must survive an abruptly ended session; a formal lesson-ending command must not be necessary to preserve already-saved progress.

### Continuity and trust

The learner must be able to distinguish saved progress from observations that have not been saved. An unavailable or outdated connection must not be presented as current knowledge of the learner.

The integration’s access boundaries must be clear. The product must not promise that every conversation is automatically visible or recorded. A portable learning summary must be available for use in another tutoring conversation, including one without an active connection.

Evidence contributed across sessions must remain coherent. Repeated imports or repeated copies of the same observation must not create artificial progress. Contradictory observations must remain visible rather than being silently overwritten.

## 5. Living learner profile

The profile must represent abilities separately rather than flattening them into a single level.

| Dimension | Required coverage |
|---|---|
| Communication abilities | Listening, reading, spoken production, written production, and conversational interaction |
| Language resources | Vocabulary, grammar, pronunciation, and appropriate register |
| Independence | Recognition, supported recall, controlled production, and spontaneous use |
| Durability and transfer | Delayed recall, use in unfamiliar contexts, and performance beyond a rehearsed example |
| Learning context | Goals, preferred topics, correction preferences, accessibility needs, and available practice opportunities |

Every assessment must indicate its scope, recency, evidence strength, and uncertainty. Written practice alone must not establish listening or speaking proficiency. A skill that has not been assessed must be labeled accordingly, not treated as a failure or assigned a misleading zero.

A broad proficiency estimate may summarize the profile, but it must remain provisional, explain its basis, and show meaningful differences between abilities. Any framework-aligned estimate, such as a CEFR-style estimate, must be distinguished from a formal examination result.

### Learner assessment and tutor assessment

The learner can report confidence, confusion, perceived difficulty, and real-world comfort independently of the tutor’s assessment.

Both perspectives remain visible. A learner’s confidence must not silently raise an evidence-based assessment; a tutor’s assessment must not erase the learner’s experience. Disagreements can lead to clarification, another assessment, or optional human review.

The learner can correct inaccurate personal information, dispute an observation, explain missing context, and request reassessment. Correcting a mistaken record must be distinguishable from changing a personal confidence rating.

## 6. Searchable knowledge index and evidence history

The knowledge index covers vocabulary, phrases, grammar, sound distinctions, comprehension skills, communication strategies, and practical can-do abilities.

For each item, the learner and tutor must be able to see its meaning or purpose, relevant examples, related concepts, practice history, current assessment, learner confidence, recurring difficulties, and review status.

Evidence must show when the attempt occurred, what task was attempted, the learner’s response or a permitted concise excerpt, the modality, the assistance provided, the feedback, and whether the response was corrected or independently produced.

A correct answer after seeing a model, a successful self-correction, an unprompted response, and a delayed response to an unfamiliar example are different kinds of evidence. The product must preserve those distinctions.

Labels such as **introduced**, **developing**, **independent in familiar situations**, and **demonstrated after a delay** must have understandable meanings. They must not imply that every ability develops along one irreversible ladder.

The index must support searching and filtering by topic, skill, difficulty, confidence, review status, and practical goal. Learners can add an encountered expression or question without waiting for it to appear in a formal lesson.

### Recurring error patterns

The product must recognize and explain recurring difficulties across sessions, including errors that return after a correction. It must distinguish likely spelling slips, vocabulary gaps, grammatical difficulties, and context or register issues where the evidence permits that distinction.

Corrected examples must remain available for later practice. Repeated difficulty should guide teaching, not become a permanent negative label.

**Tagalog example:** Correctly producing “malamig na tubig” after practice and later producing “mainit ng pagkain” should support a record that modifier linking is developing. Neither observation alone establishes complete mastery or total lack of understanding.

## 7. Curriculum, roadmap, and progress visibility

The curriculum must connect language knowledge to practical communication goals. It must show relevant foundations and related skills without preventing the learner from pursuing a topic that matters to them.

The roadmap must emphasize concrete abilities: asking what someone wants, explaining a preference, describing a past event, repairing a misunderstanding, or following a familiar conversation without a transcript.

The learner’s overview must show current goals, recently demonstrated abilities, areas needing support, unassessed dimensions, review priorities, and suggested next activities. Each recommendation must have a short explanation connected to evidence or a stated goal.

Progress views must make improvement tangible through examples and changes in independence. They must not display invented percentages of fluency or disguise weak evidence behind precise-looking charts.

Learners can inspect the broader roadmap, focus on one goal, and understand how current practice contributes to communication outside the app. Goals can change without erasing prior learning.

## 8. Conversational teaching requirements

Teaching must remain responsive, encouraging, and conversational. The tutor should respond to the learner’s intended meaning as well as their language, rather than turning every exchange into a grammar examination.

Default practice should be manageable and focused, usually with one active prompt at a time. Explanations, examples, hints, and English support must suit the learner’s needs and become less prominent as independent performance improves.

The learner can choose a correction style: immediate correction, selective interruption, or feedback after an exchange. The tutor must distinguish incorrect language from a valid alternative that is simply less common or less suitable for a particular situation.

The companion must support gradual movement from guided exercises to spontaneous questions, connected conversation, and unfamiliar communicative tasks. Translation practice must not be treated as sufficient evidence of conversational independence.

The learner can request a different topic, activity, difficulty, duration, or support level. A review queue must not monopolize a session. Difficulty, hesitation, or one poor session must not erase an established history of progress.

Tutoring preferences supplied in an additional teaching guide or harness can be retained as agreed learning preferences. Material conflicts with product requirements or learner choices must be surfaced rather than silently resolved.

## 9. Learning activity catalog

Activities must be available inside ordinary tutoring conversations. The learner can choose an activity or accept a recommendation informed by goals, previous evidence, current difficulty, and review needs.

| Activity | Required learner experience |
|---|---|
| Spaced retrieval | Return to previously practiced material after a meaningful delay, with an opportunity to answer before seeing the solution. |
| Embedded conversational review | Reuse older language naturally during a new topic without making every review an isolated flashcard. |
| Recognition and contrast | Distinguish meanings or forms, with results identified as recognition rather than independent production. |
| Guided sentence building | Practice a new construction with appropriate support, followed by opportunities with less support. |
| Free conversation | Express personal thoughts and respond to unanticipated follow-up questions. |
| Comprehensible reading | Read manageable stories and longer texts, check meaning, and revisit useful language in context. |
| Listening comprehension | Understand gist and details, request replays, and access transcripts or explanations after an initial attempt. |
| Self-correction | Try to identify and repair an error before receiving the complete correction, when appropriate. |
| Task repetition and retelling | Revisit a communicative task, then change details, audience, or situation so success is not only memorization. |
| Role-play and information-gap tasks | Accomplish a goal through interaction, including asking questions, clarifying, and repairing misunderstandings. |
| Pronunciation and sound practice | Hear, distinguish, and produce relevant sound or rhythm features with appropriate feedback. |
| Short writing and personal narration | Describe experiences, tell a story, express an opinion, and revise language while preserving intended meaning. |
| Delayed and unfamiliar-context checks | Demonstrate whether an ability remains available without immediate rehearsal and transfers to a new example. |

An activity can combine skills, but its results must not imply that every skill was independently assessed. Support shown before or during an answer must remain part of the evidence.

## 10. Research and instructional quality

Activities presented as research-backed must have an accessible evidence summary and attributable sources. The product must distinguish findings specific to the target language from findings generalized from other languages or populations.

Research summaries must identify the outcome studied, relevant limitations, and uncertainty. A plausible teaching idea must not receive a research-backed label merely because it sounds persuasive or another activity has supporting evidence.

Evidence explanations should be available without interrupting normal lessons. Activity recommendations must explain their relevance to this learner, not simply display a research badge.

Curriculum examples, important correction rules, and assessment criteria must be reviewable by qualified language educators or native-speaking reviewers. Reviewer authority and scope must be visible; a single reviewer’s preference must not automatically invalidate another accepted form.

## 11. Tagalog learning coverage

The Tagalog curriculum must include high-frequency vocabulary, practical sentence patterns, pronouns, question formation, negation, possession and existence, markers, modifiers and linkers, verb aspect and voice/focus, connectors, conversational particles, politeness, and register.

Reading and production practice must be connected to listening, spoken interaction, pronunciation, and natural everyday usage. Explanations must distinguish grammar rules from beginner-friendly approximations and refine those approximations as necessary.

The product must accommodate accepted word-order variation, conversational omissions, and context-appropriate Taglish. It must distinguish the target of a particular exercise from whether an expression is communicatively valid. Not every English word or alternative phrasing is automatically an error.

Topics must extend beyond beginner food-and-drink practice to relationships, family, routines, feelings, experiences, opinions, plans, practical errands, and the learner’s chosen interests.

Example selection and assessment must be appropriate to the variety and register being taught, with uncertainty or variation explained when relevant.

## 12. Listening, speaking, and pronunciation

Listening and speaking must be first-class abilities rather than assumed consequences of written progress.

The product must support recorded listening material, short spoken responses, interactive speaking tasks, and optional recordings for later comparison. Material should offer useful variation in speakers, pace, and conversational style appropriate to the learner’s level.

Listening activities must distinguish unsupported comprehension from comprehension achieved with a transcript, translation, slowed playback, or repeated explanation.

Spoken feedback must distinguish intelligibility, task completion, language use, and pronunciation where those distinctions can be assessed reliably. An uncertain transcript must not automatically become a learner error. Unsupported assessments must be marked uncertain or unassessed.

Response speed or timed speaking must be optional. Typing speed must not stand in for oral fluency. The product must accommodate learners who cannot or do not wish to speak, hear audio, or retain recordings, while keeping assessment boundaries explicit.

## 13. Personal materials, phrasebook, and real-world learning

### Personal phrasebook

Learners can save expressions they genuinely want to use, together with meaning, context, register, examples, and optional audio. Entries can become practice targets and connect to relevant concepts in the knowledge index.

### Content discovery and library

The companion must recommend suitable reading, videos, listening material, and other learning resources based on goals, interests, and demonstrated ability. Recommendations must explain suitability and distinguish curated resources from unverified suggestions.

A learner can save a resource, mark it too easy or difficult, and report what they understood. Available transcripts, translations, content descriptions, and usage rights must be represented honestly. The product must not imply that unavailable or restricted material can be reproduced.

### Learning journal and outside practice

Learners can record conversations outside ChatGPT, successful communication, unfamiliar expressions, and situations they found difficult. They can contribute their own learning materials and selected work for practice or assessment.

Self-reported real-world success must retain that source label rather than being presented as directly observed performance. Journal entries can influence goals and future activities without requiring the learner to document every interaction.

## 14. Motivation, reflection, and optional enrichment

| Feature | Requirement |
|---|---|
| Session journal | Show what was practiced, notable observations, corrections, and meaningful changes in the learner record. |
| Periodic progress reports | Summarize abilities, evidence, unresolved difficulties, and suggested priorities over a chosen period, including a monthly view. |
| “How would you say this now?” | Revisit an earlier communicative goal before revealing the old answer, then compare the attempts with differences in support made clear. |
| Voice history | Let consenting learners compare recordings over time without making claims that exceed the available evidence. |
| Native-speaker or educator feedback | Let an invited reviewer comment on selected work, with attribution and learner-controlled access. |
| Increasing immersion | Offer progressively more target-language interaction while preserving access to explanation and support. |
| Milestones | Recognize meaningful communication achievements rather than only accumulated activity. |
| Optional reminders | Offer reminders and review notices that respect the learner’s preferences, local schedule, and pauses. |

The learner must be able to pause or return without guilt-based messaging, punitive streak loss, or a misleading collapse in reported ability. Lack of recent evidence should be communicated as uncertainty or a reason to check retention—not proof that everything was forgotten.

## 15. Web and macOS companion experiences

Both experiences must provide access to the same current learner profile, goals, knowledge index, evidence, review priorities, phrasebook, journal, reports, and privacy controls.

The web companion must be usable across common desktop and mobile screen sizes. The macOS companion must additionally offer convenient quick access, including a menu-bar experience, optional notifications, and recording access for supported activities.

Neither surface should require the learner to duplicate notes from a connected tutoring chat or manually maintain a second version of their progress.

The interface must prioritize a clear next action and understandable evidence over dense analytics. Essential information must remain accessible without relying only on color, charts, audio, or precise pointer interaction.

## 16. Learner control, privacy, and data quality

The learner must be able to inspect, correct, export, and delete their learning information and understand which conversations, excerpts, recordings, or materials have contributed to it.

Concise learning evidence should be sufficient for ordinary progress tracking; full-conversation retention must not be required. Retention of excerpts and recordings, use of learning history for recommendations, and sharing with a human reviewer must have understandable controls.

Export must include enough understandable learning context to continue with another tutor, not merely activity totals. Deletion must clearly state what was removed from the companion and must not imply deletion from an outside conversation or service when that has not occurred.

Learners must control access to their records and be able to revoke it. Shared examples and feedback must not expose unrelated private conversations. Multiple learners and multiple language profiles must remain separate.

A privacy choice may reduce the evidence available, but it must not be recorded as poor language ability. Unavailable evidence, unverified imports, uncertain judgments, and connection gaps must remain distinguishable from demonstrated mistakes.

## 17. Product acceptance scenarios

| Scenario | Required result |
|---|---|
| A learner starts without prior records. | Practice can begin promptly; untested abilities remain unassessed rather than receiving invented levels. |
| Two separate connected chats work with the same learner. | Both can access the latest saved profile and contribute evidence without requiring repeated onboarding. |
| The learner leaves mid-lesson. | Saved progress remains available, and saved unfinished context supports an appropriate continuation. |
| The learner requests a new topic. | The tutor changes topic while retaining appropriate difficulty, preferences, and relevant review needs. |
| A learner repeatedly answers correctly immediately after examples. | Guided success is recorded without being mislabeled as spontaneous or durable mastery. |
| A familiar error returns after a delay. | The record reflects renewed uncertainty and an appropriate practice need while preserving prior evidence. |
| A learner has completed only written activities. | Speaking and listening are not presented as assessed on that basis alone. |
| Learner confidence differs from the tutor’s judgment. | Both views remain visible, with a route to clarification or reassessment. |
| Audio or transcription is ambiguous. | The product does not confidently assign a language error from ambiguous evidence. |
| A learner completes a role-play in an unfamiliar situation. | Evidence captures task accomplishment and support level, not only grammatical correctness. |
| A learner opens either companion surface. | Their current learning information and controls are consistent across experiences. |
| An import repeats existing evidence or a connection is unavailable. | Progress is not inflated, and unavailable saves or stale context are not represented as current saved progress. |
| A learner exports, deletes, or shares selected records. | The stated scope is honored and understandable; unrelated learning or conversation data is not implicitly included. |
| An activity carries a research-backed label. | Its supporting sources, relevant outcome, and limits are available for inspection. |

## 18. Success measures

**Learning outcomes:** Retention demonstrated after a delay, successful use in unfamiliar contexts, increased independence, progress on practical can-do goals, and growth within separately assessed communication abilities.

**Continuity quality:** Ability to resume appropriately across chats, reduced repeated onboarding, accurate preservation of support levels and unresolved difficulties, and consistency between the learner record and observed work.

**Learner understanding and trust:** Ability to explain current strengths and next priorities, usefulness of progress examples, clarity of assessment uncertainty, and confidence that corrections and privacy controls are respected.

**Instructional quality:** Appropriate difficulty, useful correction, increasing conversational independence, credible activity evidence, and the ability to recognize when a claim requires further assessment or human review.

Usage and return rates may describe product engagement, but must not be reported as proof of improved fluency. Progress reports must distinguish observed improvement from claims that the product caused it.

## 19. Supporting tutoring-harness files

The previously named `Bootstrap_Prompt.txt` and `Portable_Adaptive_Tutoring_Harness_Consolidated.md` are useful supplementary references for preserving the intended tutoring behavior.

Their earlier uploads were unavailable when this specification was prepared. This PRD is grounded in the product discussion, not a verified reading of those files. Their exact contents must not be assumed or represented as already incorporated.

When supplied, the harness files should inform teaching behavior and assessment expectations. This PRD defines product scope. Material conflicts must be identified rather than silently importing unrelated requirements or discarding learner control.
