# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Track the next useful build checkpoints, verification, and consequential revisions.

## Working agreement

Developer: Keep the browser preview running, choose priorities, test results directly, and plan only the next few checkpoints.

Agent: Read the project documents and inspect the files. Keep each checkpoint small enough to run and judge. Do not expand scope or mark Developer verification complete.

Start or continue a fresh chat with:

`Read the project documents, inspect the current build, and help me complete the next unchecked checkpoint.`

## Checkpoints

Create your own checklist for the next few results, using the workflow in `brief.md` and the current `spec.md`. Name the main risk, what each checkpoint should produce, and how you will verify it. Review and approve the approach before implementation.

Test each result before continuing, including related behavior that already works. Update priorities as evidence emerges and preserve meaningful working checkpoints in git. Before delivery, verify the deployed app against the brief and specification.

### Next checkpoints

- [x] Choose the first story's concept and narrative arc: the cornfield **“Welcome?”** scarecrow reveal documented in `spec.md`.
- [x] Approve the discovery trigger and interaction feedback: two corn rustles followed by the scarecrow's eyes, with progress preserved. The scarecrow style is approved as lanky and eerie.
- [x] Prepare the minimum visual and audio assets needed for the story. Local audio has verified CC0 sources and creator credits; the mix is approved on a physical phone.
- [x] Build and verify the mobile scene foundation and silent story prototype. Developer preview revisions addressed corn motion, eye alignment, character persistence and separate sign/hand layers.
- [x] Add and coordinate sound, progressive hints, and interaction feedback. Browser checks covered keyboard, reduced motion and a narrow mobile viewport; the Developer verified touch, visuals and sound on a physical smartphone.

Phase 1 prototype verification is complete. The Developer tested the deployed HTTPS build on a physical smartphone, directed revisions to Safari rendering, corn motion and audio, eye and sign transitions, fairground reveal performance, and hand/sign separation, then approved the final result on October 15, 2026.

### Next checkpoints: second story

Main risk: the existing flattened fairground does not contain hidden pixels behind the tent curtains, and the foreground scarecrow obscures the central tent. Establish clean layers and readable mobile-scale targets before investing in character animation.

- [x] Prototype the post-story transition with temporary shapes: move the persistent scarecrow over approximately 2.4 seconds to its lower-left usher position under a fog cover, then push the camera past the entrance toward the tent over approximately two seconds. Preserve eye replay and verify that the central tent and four smaller tent-aligned pennant targets remain readable at a narrow phone viewport. The Developer approved the corrected tent-anchored symbol layout after rejecting two oversized overlay treatments.
- [x] Establish explicit experience phases for entrance discovery, Story 1, midway transition, demonstration, input, mistake and completion. Only the current discovery controls are enabled; Story 1 eye replay preserves the midway attempt, and shared timers pause the new sequence.
- [x] Prototype the four-pennant memory puzzle with scene-anchored symbols and synthesized note placeholders. A 390 × 844 browser run verified the twice-demonstrated **eye → moon → star** sequence, distinct motion/glow/note feedback, three-step tent-light progress, 48-pixel touch targets, native keyboard buttons, rabbit mistake/reset behavior and completion. A separate timed run confirmed that pause held the demonstration state and all five pending tasks unchanged, then resumed into enabled input.
- [ ] Prepare and review the minimum layered artwork: repaired tent interior, separate curtains, four readable pennants, shadow magician with separable arm/hat, spectral bunny and pawprint trail. Record generation or source provenance before integration.
- [ ] Build the silent eight-second “Midnight Magician” sequence and tune its readability and pacing on a phone-sized viewport. Include the persistent lit-tent ending, replay entrance and bunny-to-Ferris-wheel handoff; preserve reduced-motion behavior.
- [ ] Source or create appropriately licensed fabric, stage-note, hat-flourish, applause and bunny feedback, then coordinate the mix with existing wind and story audio. Verify failure behavior and physical-phone playback.
- [ ] Conduct an unprompted phone playtest focused on whether Users notice, remember and reproduce the pennant sequence and understand that the bunny points toward the Ferris wheel. Record observations before choosing revisions or specifying Story 3.

## Evidence and revisions

Record non-identifying playtest observations, separating what Users did or said from your interpretation. Use the findings to choose revision priorities and record what changed and how you verified the improvement.

- Second-story discovery prototype: initial viewport-overlay pennants remained oversized, overlapped and floated in front of the tent despite spacing revisions. The Developer rejected both treatments. Replaced the governing layout model: visible symbols now use the tent artwork's SVG coordinates and inherit the camera transform, while separate invisible HTML buttons provide accessible interaction targets. The Developer approved the corrected placement. Added a pause-aware fixed-sequence puzzle, retry response, progress lights, progressive hints and synthesized placeholder notes; automated narrow-viewport interaction checks passed. Developer pacing and listening review remains pending.

### Developer preview review

The entries below preserve the state observed at each revision. Earlier “pending” notes are superseded by the final Phase 1 phone review.

- Fog reveal checkpoint: added three slowly drifting ground-haze shapes and a four-part dense fog cloud synchronized to the 3.84-second lightning/fairground reveal. The dense cloud overlays the newly revealed fairground and scarecrow, separates left and right, and clears at 4.72 seconds before the 4.8-second sign presentation. Reduced motion replaces its spatial movement with an opacity-only reveal. Both fog systems inherit the global animation pause rule. JavaScript syntax and whitespace checks passed; Developer visual review of density and timing remains pending.
- Fog visibility revision: Developer found the first treatment barely noticeable. Increased the continuous fog's coverage, contrast and opacity, added a lower-scene haze veil, and made the reveal cloud denser and fully opaque at its peak while retaining the approved timing.
- Fog balance revision: Developer found the stronger treatment excessive and the ambient movement unclear. Reduced the fog and reveal-cloud opacity, shortened the three drift cycles, and animated the broad lower haze so every ambient fog layer now moves continuously.
- Fog motion revision: Developer requested more movement without another density increase. Expanded the fog banks' horizontal travel, added more vertical roll and scale change, and shortened their staggered drift cycles.
- Fog texture revision: Developer requested a Perlin-noise look. Added two native SVG `fractalNoise` filters with separate displacement scales for the ambient banks and denser reveal cloud. Each filter is applied once to its complete fog system so the existing multi-layer movement produces organic contours without multiplying the mobile filter cost per cloud.
- Mobile fog fallback: physical-phone review found that iOS Safari dropped the complete fog layers when their HTML containers used inline SVG displacement filters. Added a WebKit-specific fallback that disables only the unreliable distortion filter while preserving the fog banks, opacity, movement, reveal timing, pause behavior and reduced-motion behavior.

- Final Phase 1 phone review: after the iPhone-compatible corn-audio revision was deployed, the Developer confirmed that the result looks good. This completes physical-phone visual, touch and listening verification for the current one-story prototype. Public build: `https://ellad.github.io/AI_Explorations_project4/`.

- iPhone corn-audio revision: Developer reported missing corn rustle together with the partial-audio warning. The deployed files were reachable, but the failed asset was a 69-second, 48 kHz stereo MP3 while the working effects were 44.1 kHz. Replaced runtime use of that file with a five-second, 44.1 kHz mono PCM WAV excerpt from the same credited recording, reducing the decoded source to the portion the loop uses. The original MP3 remains archived. Audio failure messages now name failed sounds for future diagnosis. Developer phone re-verification remains pending.

- Phone motion revision: Developer found the five-band corn bend still too subtle and the transform-free sign reveal too abrupt. Increased stalk-tip displacement from 16.15 to 30 source pixels while retaining the fixed base and faster spring response. Changed the normal sign presentation to fade from 4.8 to approximately 5.36 seconds; reduced-motion mode retains the separate instantaneous reveal beat. Developer phone re-verification remains pending.

- Second phone-tuning revision: Developer found the optimized stalks too slow, the watching eyes abrupt, the fairground absent on reveal, and the hand still turning. Increased the corn gust and spring response, added an 800 ms eye fade and gentler story-eye ramp, and replaced the sign flip with a transform-free snap so no residual hand pixels can rotate. The fairground now uses a separate preloaded SVG image source and retargets every rendered scene clone at the flash; this avoids Safari failing to repaint clones after an image URL mutation. A 390 × 844 HTTP run switched twelve rendered layers to the fairground source, reported no sign transform, kept the separate hand visible, loaded all five sounds, and rendered the complete fairground frame without script errors. Developer phone re-verification remains pending.

- Mobile performance and hand-layer revision: phone review found that corn motion was not perceptible, the scarecrow reveal lagged, and the holding hand still transformed with the sign. Reduced the flexible corn rig from twenty to five connected bands per stalk, preloaded the three reveal rasters, removed full-character brightness filters, and replaced referenced sign/hand mask paths with direct geometry for Safari. A 390 × 844 HTTP browser run loaded all five sounds, rendered ten corn bands, completed the fairground reveal, and showed the sign and fixed hand at the mid-reveal frame without script errors. Developer phone re-verification remains pending.

- Mobile Safari compatibility revision: the first GitHub Pages phone review showed only CSS fog/fireflies, with the SVG scene artwork missing, and reported that sounds could not load. Replaced nested mutable SVG `use` aliases with direct raster source elements while preserving the stationary mask and moving corn cutouts. Replaced `AbortSignal.timeout()` with an `AbortController` timer fallback for older/in-app iPhone browsers. Syntax, whitespace and HTTP asset checks passed; Developer phone re-verification remains pending.

- Concealed fairground checkpoint approved by Developer: begin with only corn, fences and path; reveal the remaining fairground with the scarecrow during the first lightning flash, then keep it visible through replays.
- Implementation: generated clean opening and repair artwork, changed the intro background, and switched the shared scene/mesh/foreground source aliases at 3.84 seconds using the pause-aware story timer. Existing corn rig, sound, sign and hand behavior are retained.
- Evidence: Chrome HTTP preview at 390 × 844 passed for opening concealment, pause before reveal, joint reveal, post-story persistence, replay persistence and repair/source switching. Opening and sign-reveal screenshots inspected. Developer visual review remains pending. See `Assets/opening-scene/README.md` for provenance and prompts.

- Continuous corn sound: Developer requested rustling throughout corn movement. The flexible rig now reports its active/settling stalk to a separate crossfaded audio loop. Enter starts left rustling, the first tap pans the same voice right, and removing the active cue lets sound continue until the springs settle. Pause freezes the loop's shared clock. Reduced-motion mode retains short tap feedback. Removed the unrelated scheduled story rustle; thunder and sign cues remain.

- Thunder tail approved: play the selected clap excerpt through the end of the recording instead of limiting it to 2.5 seconds. Ending the visual story no longer stops active audio effects. Pause still suspends the shared audio clock; beginning a replay clears the previous tail before scheduling new sounds.

- Thunder character revision: Developer wanted a loud classic thunderclap. Added the verified CC0 `thunder-clap.mp3` recording by seth-m, switched the active cue and start-screen credit, and selected the transient onset rather than a sustained-rumble window. Preserved the previous file. Flash timing, pause behavior and replay remain unchanged.

- Thunder mix revision: Developer found the reveal sound too faint or absent. Removed the forced zero offset so the cue uses the loader's strongest short excerpt; increased playback gain from .42 to .72 and duration from 2.1 to 2.5 seconds. Flash alignment remains 3.84 seconds. Phone listening review remains pending.

- Audio-loading diagnosis: Developer opens `index.html` directly (`file://`), which blocks the audio loader's fetch requests. Previous file-based automated tests used a relaxed local-file flag and therefore missed the real preview restriction. Added an explicit direct-file notice and local-server instructions in `README.md`; started an HTTP preview on 127.0.0.1:4173.
- Verification: Chrome HTTP preview tested with normal file-security/autoplay rules and a trusted Enter click. All five sounds decoded, context was running, wind looped, three story cues were scheduled, and pause/resume froze/restarted the audio clock. Browser returned PASS.

- Audio checkpoint: added local CC0 wind, corn rustle, twig snap, thunder and wood creak, start-screen credits, Enter-based audio unlocking, crossfaded ambience, distinct tap feedback, synchronized story cues and global pause/resume. Lower wind during the story and restore it afterward. Tab hiding pauses the experience. Missing sound leaves the visual scene usable with a notice.
- Evidence: real-time Chrome checks passed for all five MP3 decodes, initial silent state, Enter unlock, ambient loop, tap effects, scheduled story effects, frozen audio clock during pause, resume, persistent character and clean replay. Eight-second offline story render peak = 0.300 and RMS = 0.041: non-silent and below clipping. Syntax/whitespace checks passed. Subjective listening, native phone audio unlocking and touch testing remain pending.

- Sign correction: Developer observed that the holding hand spun with the sign. Extracted the hand into a stationary original-pixel foreground layer and excluded it from the transforming sign mask. Checked the mid-reveal frame at 4.95 seconds; the hand stays attached to the arm while the prop opens.

- Sign presentation checkpoint: split the approved dull-eye image into original-pixel body and prop layers using SVG masks. Keep the sign concealed during the character reveal, present it at 4.8 seconds, and settle it with a brief wobble. Body and sign remain visible after the story; direct eye replay is preserved.
- Verification: Chrome screenshots at 4.4 and 5.9 seconds confirm character-only and sign-present stages. Browser checks passed for delayed sign reveal, reduced motion, pause/resume, persistent body/sign and replay. Developer timing review remains pending. Next checkpoint is sourced/credited audio and synchronized feedback; the prototype is still silent.
- Corn motion tuning approved after two reductions: current drive amplitude is 16.15 source pixels. Preserve this setting during unrelated story work.

- Flexible rig checkpoint: expanded the original cutouts to include visible stems and attached leaves, then replaced rigid rotation with a continuous 20-band bending mesh. Fixed base, increasing upper displacement, damped stem spring and delayed leaf spring; inactive stalks settle. Generated a targeted background repair for the larger openings. Character persistence is preserved.
- Verification: inspected native-resolution resting/bent close-ups. Both bends change only their plant regions; fence and ground comparisons show no differences. Browser checks passed for bend distribution, planted root, pause freeze, corn progression, persistent character and eye-tap replay. Physical-phone motion/feel remains for Developer review.

- Developer requested stronger rustles and a character that stays after appearing. Increased the leaf rotation from ±1° to ±6° with quicker timing. Removed the disappearance keyframes; retain the body, eyes and contact shadow after the 8-second story, and enable direct eye-tap replay. Corn settles during story playback.

- Original-art rig completed: replace the generated overlays with two traced leaf blades sampled directly from the original composite. Separate the stationary scene, hidden background repair, moving cutouts and original lower foreground in one SVG coordinate system. Keep all scene pixels outside the two cutouts unchanged.
- Verification: native-resolution Chrome comparisons and close-up inspection; fence/ground pixel comparison returned no differences during movement. Browser checks passed for two corn activations, eye activation, interaction lock, pause/resume, reset and replay. Source-color matching is now inherited from the original pixels rather than generated approximations. Developer review of the modest leaf movement remains pending. See `Assets/corn-rig/README.md` for layer construction and repair provenance.

- Developer close-up rejected the feathered overlays: they appear as ghost plants over the fence. Removed both generated corn instances from the scene, restoring the original static corn. Previous full-viewport checks missed this close-up defect. Corn motion is incomplete; stop iterating opacity/masks on these overlays. A future implementation needs separated original plant silhouettes, clean pixels behind them, and a foreground fence layer before animating. Generated assets are preserved but unused.

- Corn blending revision: feather the added clusters with an elliptical alpha mask, dissolving their bases before the fence rails and their outer leaves into the existing plants. Lower opacity and slightly soften the detail. Chrome mobile render confirms the added stalk bases no longer appear planted on the rails; the original corn and fence remain visible through the transition. Both clusters still persist after clicks.

- Further observation: a moving single corn instance disappeared after clicks, its color/style stood apart, and the character appeared to float with off-center eye highlights.
- Revision: two persistent clusters, a new scene-reference corn asset, smaller placement among existing rows with subdued color, character moved inward and down onto the path, contact shadow beneath the boots, fixed eye centers at source-image socket coordinates. Removed full-body rotation so boots stay planted.
- Verification: Chrome mobile renders at 390 × 844 checked both the first-click exploration state and the 4.8-second reveal. Both corn clusters remain visible, the next cluster shakes, eye highlights are inside the sockets, and boots/shadow meet the path. Developer motion review remains pending.

- Follow-up observation: region-based corn patches moved fence/entrance pixels and cut stalks at their boundaries; the ground layer also cut a rectangle through the scarecrow. The final trigger was expected to be the character's eyes.
- Revision: use separate generated full stalks pivoting at their bases, stop moving the combined corn/fence layer, use two corn taps followed by the eyes, and render the complete character above the background. Eyes and body share a container; the tilt moves both together. Removed the abrupt downward jump.
- Verification: Chrome rendered the story at a 390 × 844 viewport after two corn taps, an eye tap, and pause. At 4.8 seconds the character is complete and the eye highlights sit within the carved sockets. JavaScript syntax and whitespace checks passed. Manual pacing review remains pending. The sign presentation still needs separate artwork or rigging; the current image reveals the sign together with the body.

- Observed: the trigger displayed a shaking text-like marker rather than moving corn, the glow did not align with the scarecrow's eye sockets, and the scarecrow faded and zoomed during its reveal.
- Revision: animate a localized patch of the existing corn artwork, position the eye effect relative to the scarecrow asset, and replace the fade/zoom with a hard lightning reveal, one stiff tilt, and a retreat behind the corn.
- Developer re-verification is still required in the browser preview.

Keep implementation progress and verification here. Update `research.md` when evidence changes a decision and `spec.md` when intended behavior changes; link to those updates rather than duplicating them. Record consequential changes, not every small adjustment.

## Saving transcripts

When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md` or `transcripts/build-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
