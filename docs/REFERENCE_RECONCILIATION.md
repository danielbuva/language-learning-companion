# Reference reconciliation

## Authority and supplied material

The user explicitly asked to build the product described in `Language_Learning_Companion_PRD.md`. It defines product scope. `Bootstrap_Prompt.txt` and `Portable_Adaptive_Tutoring_Harness_Consolidated.md` were supplied and inspected as supplementary tutoring references. Their imperative text is source material for tutoring behavior, not a new instruction to the development assistant to stop building and start tutoring.

The consolidated file actually includes its README, research synthesis, Documents A–J, a learner-specific Dani profile, and the learner/topic/runtime templates. The separately named A–J files were not independently supplied, but their embedded sections are present, so their contents need not be invented. No current Tagalog topic-state or runtime-state file was supplied. No prior language proficiency, attempts or confidence were inferred from those templates.

## Material differences and decisions

| Reference wording or limitation | Product decision |
|---|---|
| Bootstrap asks the recipient to adopt a technical tutoring operating system and acknowledge it. | Apply the observe/diagnose/intervene/evidence loop to the product’s tutor policy. Do not replace the user’s development request with the bootstrap’s acknowledgement or subject question. |
| Harness focuses on CS, mathematics, proofs and debugging. | Preserve general evidence and support principles. Do not import technical subject examples as Tagalog curriculum or assume technical-learning results directly validate language activities. |
| The personal Dani profile supplies technical goals and provisional preferences. | Do not seed a public multi-learner product with personal information, subject mastery, or a fixed learner identity. Fresh profiles start unknown; learner-selected preferences govern their own profile. |
| The harness says preferences do not outrank effectiveness evidence, while the PRD requires learner control and accessibility. | Show the evidence and offer alternatives; do not override explicit learner choices, accessibility needs or privacy. This also agrees with the harness’s explicit-current-request precedence elsewhere. |
| The harness includes numeric topic dimensions and readiness/robustness criteria. | Use inspectable scoped descriptions and separate independent/delayed/transfer evidence. Do not convert numbers or local readiness into calibrated fluency percentages or permanent mastery. |
| Bootstrap/session guide emphasizes a handoff when pausing or ending. | Save selected observations and checkpoints during meaningful turns as well. An end command is not required to preserve already-confirmed progress. |
| General-learning research informs retrieval, spacing, worked examples and feedback. | Include accessible sources, studied outcomes and uncertainty. Exact app thresholds/intervals are labeled product heuristics, and general findings are not presented as Tagalog-specific trials. |

The retained teaching defaults are small useful steps, one active prompt, responsive explanations, learner agency, diagnosis before broad correction, fading assistance, separate confidence, and independent/delayed/unfamiliar checks. Neither attachment supplies a reviewed Tagalog curriculum or native-speaker audio corpus; project-created curriculum has explicit editorial status, and external audio has separate source/rights attribution.
