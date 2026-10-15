# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep the evidence and creative decisions that currently guide the build.

## Working agreement

Developer: Run the starter first. Direct the inquiry, judge sources and options, make consequential decisions, and keep this file current.

Agent: Read `AGENTS.md`, `brief.md`, and this file, then inspect the project. Help compare possibilities, test assumptions quickly, and verify external sources without delaying the prototype for exhaustive research.

Start a fresh chat with:

`Read brief.md and research.md, inspect the running project, and help me develop the scene and three spooky stories.`

## Inquiry and decisions

Record only what informs the next build decisions:

- creative alternatives for the scene, stories, and audiovisual direction, with reasons for your choices
- useful sources and references, what they support, and important limitations
- experiments that resolve uncertainty, the results, and consequential trade-offs

Investigate unfamiliar techniques or asset sources as needed. Verify usage terms and keep source links and required credits here. Distinguish evidence from assumptions; the Agent's recommendation alone is not evidence.

### Current creative direction

Approved environment progression: start with corn, path and fences in darkness; reveal the fairground together with the scarecrow's lightning reveal. This makes “WELCOME?” introduce a newly visible destination. The revealed fairground persists during later exploration/replays. Clean opening artwork and the corresponding hidden corn repair are documented in `Assets/opening-scene/README.md`.

- The first story will begin in the cornfield at the fairground entrance. Its mood draws on the unease of an unseen presence among the stalks, but resolves playfully and remains appropriate for Users age 10 and older.
- Use one pumpkin-headed scarecrow as the story's focal figure rather than a group. A single pair of glowing eyes creates the initial reveal and keeps the short sequence visually clear.
- The scarecrow reveals a crooked, dilapidated sign reading **“WELCOME?”** The question mark is the central joke: the figure itself seems uncertain whether the visitor should enter.
- Keep the Ferris wheel still during the initial scene and this story. Its movement may be reserved for a later event or reward.

The scarecrow's approved visual direction is lanky and eerie. Its awkward presentation of the sign—not a cute character design—provides the playful resolution.

The approved trigger is a moving rustle that the User follows through two locations in the corn, followed by the glowing eyes. Each successful interaction advances rather than resetting on mistakes. The generated scarecrow/sign asset is documented in `Assets/story-welcome/README.md`.

Corn asset revision: the active rig uses two original leaf cutouts and a stationary foreground, with generated artwork confined to the hidden background repair. Generated standalone corn clusters failed Developer close-up review and are no longer used. Layer construction, source and usage notes are recorded in `Assets/corn-rig/README.md`; verification is in `plan.md`. The current trigger is two leaf rustles followed by tapping the character's eyes, as specified in `spec.md`.

The approved ending holds the lanky scarecrow and faded-in sign in place, allowing the eyes to replay the story. Additional character reactions are deferred beyond this checkpoint.

## Revisions

### First audio checkpoint

Thunder revision: Developer requested a sharp classic clap. Replaced the active rumble with [big thunder clap by seth-m](https://freesound.org/people/seth-m/sounds/458015/), verified CC0 on October 14, 2026. The recording is described by its creator as a dry clap without rain. Playback starts before the detected transient and stays aligned with the flash. Original rumble is preserved as an unused asset. The Developer approved the result during physical-phone review.

Verified CC0 source pages on October 14, 2026: [Soft Wind](https://freesound.org/people/florianreichelt/sounds/459977/), [corn stalk rustling](https://freesound.org/people/kyles/sounds/454363/), [Twig Snap 04](https://freesound.org/people/Glitchedtones/sounds/322411/), [Short Thunder Deep](https://freesound.org/people/SholeColtis/sounds/683420/), and [Wood Creak](https://freesound.org/people/SilentStrikeZ/sounds/389645/). Downloaded public MP3 previews for local playback; full creator credits, source URLs and processing notes are in `Assets/audio/README.md`.

Approved mix: quiet looping wind, continuous rustling around the two corn interactions, a snap on the second interaction, ambience lowered during the story, a classic thunderclap on the flash and a wooden creak during the sign reveal. After an iPhone decode failure, the active corn sound was changed to a five-second 44.1 kHz mono WAV excerpt derived from the same verified CC0 source. Browser checks and Developer listening on a physical phone confirmed the final selection and balance.

Update decisions when new evidence changes the direction, linking to playtest observations in `plan.md` rather than copying them. Keep chosen behavior and asset requirements in `spec.md`. The Developer confirms when the inquiry is sufficient to continue building; exhaustive research is not a prerequisite.

## Saving the transcript

When directed, save the complete conversation as `transcripts/research-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
