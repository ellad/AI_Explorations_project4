# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep a concise, testable description of the experience currently being built.

## Working agreement

Developer: Begin with the running prototype, approve the intended behavior, test it directly, and update this file when the intended result changes.

Agent: Read `AGENTS.md`, `brief.md`, `research.md`, and this file, then inspect the project. Turn decisions into acceptance checks without inventing product choices or freezing details that still require testing.

Start a fresh chat with:

`Read the project documents, inspect the running prototype, and help me specify the next useful build checkpoint.`

## Current build contract

Define only enough to build and verify the current direction:

- the intended User experience and chosen scene, ambience, and story behavior
- the system structure, shared rules, and states that keep audiovisual behavior and interaction coordinated
- the assets and layout needed for that structure, linking to sources and credits in `research.md`
- acceptance checks for the chosen behavior and every requirement in `brief.md`, including accessibility and failure behavior

Reference the brief's fixed requirements rather than copying them. Specify your decisions precisely enough that the Developer and Agent can judge the same result. Leave untested details open until they are needed, and distinguish provisional ideas from approved behavior.

### First story: “Welcome?”

The first discoverable story takes place in the cornfield at the fairground entrance and lasts approximately 8 seconds:

Initial scene: show only corn, the dirt path, low wooden fences and a dark misty background. Conceal all tents, wheel, entrance arch/pillars, flags and fairground decorations, including on the start screen. The first story reveals the fairground at the same instant as the scarecrow; the revealed environment remains visible after completion and throughout later replays until reload.

1. The ambient corn becomes still and one pair of dull eyes awakens to an uneven orange glow between the stalks. The glow is an animated effect separate from the unlit base artwork.
2. The eyes rise, suggesting the outline of one pumpkin-headed scarecrow.
3. At 3.84 seconds, a flash reveals the complete figure and the full fairground together. This is a sharp reveal rather than a fade. The Ferris wheel remains still.
4. At approximately 4.8 seconds, after the character's lightning reveal, it presents a crooked wooden sign reading **“WELCOME?”** The sign snaps open over roughly 0.4 seconds and briefly wobbles before settling. Reduced motion preserves the separate reveal beat without flipping or wobbling. The loose-plank detail and its sound remain pending.
5. The scarecrow remains standing with the sign after the reveal.
6. At 8 seconds, exploration resumes while the scarecrow remains visible. Its eyes can be tapped directly to replay the story without reloading.

The sequence should begin as eerie and resolve as playful. It must not depict realistic harm, threatening children, gore, or violence. While it plays, other scene interactions are disabled and the global pause control remains available. The Ferris wheel remains still throughout.

The scarecrow has a lanky, eerie silhouette. Its uncertain behavior when presenting the sign provides the humor while preserving the unsettling visual style.

The User follows two rustles in visible stalk sections separated from the original corn artwork, then taps the scarecrow's visible glowing eyes to start the story. The stems bend from a fixed lower attachment, with stronger motion toward the top and a delayed response in the attached leaves. Original pixels preserve the scene's color and texture. A hidden repair layer fills movement gaps and the original fence/ground foreground stays stationary. Reduced motion uses a static highlight instead of bending. The eyes are positioned relative to the same character container as the body, so their alignment survives responsive sizing and character motion. Incorrect interactions do not erase progress. Progressive hints move from noticing the corn to noticing the watching eyes.

Provisional details requiring Developer approval after testing: exact timing, sound design, and final reaction.

### Audio foundation

Use locally stored CC0 recordings credited in `Assets/audio/README.md`. Enter unlocks and loads sound before the scene starts. Quiet crossfaded wind loops during exploration. Rustling loops for the entire time the corn rig is moving, including its settling movement. It follows the active stalk from left to right without restarting. The second corn activation adds a twig snap. Reduced-motion mode uses short tap feedback instead of a continuous movement loop. The eye trigger starts thunder aligned with the flash at 3.84 seconds and a creak aligned with the sign at 4.8 seconds. The thunder tail plays to its natural end, including after the eight-second visual story. Wind lowers during the story and returns afterward.

Global pause freezes current and scheduled sound alongside animation and timers. Replay clears previous effects before rescheduling. Hiding the tab pauses the experience. Audio load failure preserves the usable visual scene and reports missing sound. Sound selection and mix levels remain provisional until Developer listening review.

## Scope and revisions

Record excluded ideas, the next behavior that must work, and consequential requirement changes with their evidence.

Current scope is one complete cornfield story. Multiple figures and immediate Ferris-wheel movement are excluded from this checkpoint.

## Saving the transcript

When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
