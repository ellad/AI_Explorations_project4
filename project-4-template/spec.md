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
3. At 3.84 seconds, a flash reveals the complete figure and the full fairground together. This is a sharp reveal rather than a fade. A dense cloud of Perlin-noise-distorted fog blooms with the flash, briefly obscures the new fairground and scarecrow, then separates and clears before the sign presentation. A lighter noise-shaped ground haze drifts through the scene during exploration. WebKit retains the complete moving fog treatment without SVG displacement because its reference-filter path can drop the rendered layers. Reduced motion preserves the fog beat with opacity only. The Ferris wheel remains still.
4. At approximately 4.8 seconds, after the character's lightning reveal, it presents a crooked wooden sign reading **“WELCOME?”** The sign fades in over approximately 0.56 seconds while the holding hand remains stationary. Reduced motion preserves the separate reveal beat with an immediate appearance. A wood creak accompanies the presentation.
5. The scarecrow remains standing with the sign after the reveal.
6. At 8 seconds, exploration resumes while the scarecrow remains visible. Its eyes can be tapped directly to replay the story without reloading.

The sequence should begin as eerie and resolve as playful. It must not depict realistic harm, threatening children, gore, or violence. While it plays, other scene interactions are disabled and the global pause control remains available. The Ferris wheel remains still throughout.

The scarecrow has a lanky, eerie silhouette. Its uncertain behavior when presenting the sign provides the humor while preserving the unsettling visual style.

The User follows two rustles in visible stalk sections separated from the original corn artwork, then taps the scarecrow's visible glowing eyes to start the story. The stems bend from a fixed lower attachment, with stronger motion toward the top and a delayed response in the attached leaves. Original pixels preserve the scene's color and texture. A hidden repair layer fills movement gaps and the original fence/ground foreground stays stationary. Reduced motion uses a static highlight instead of bending. The eyes are positioned relative to the same character container as the body, so their alignment survives responsive sizing and character motion. Incorrect interactions do not erase progress. Progressive hints move from noticing the corn to noticing the watching eyes.

The Developer approved the story's timing, motion, sound mix and final reaction after testing the deployed build on a physical smartphone.

### Audio foundation

Use locally stored CC0 recordings credited in `Assets/audio/README.md`. Enter unlocks and loads sound before the scene starts. Quiet crossfaded wind loops during exploration. The active corn sound is a compact WAV excerpt derived from the credited source for reliable iPhone decoding. Rustling loops for the entire time the corn rig is moving, including its settling movement. It follows the active stalk from left to right without restarting. The second corn activation adds a twig snap. Reduced-motion mode uses short tap feedback instead of a continuous movement loop. The eye trigger starts thunder aligned with the flash at 3.84 seconds and a creak aligned with the sign at 4.8 seconds. The thunder tail plays to its natural end, including after the eight-second visual story. Wind lowers during the story and returns afterward.

Global pause freezes current and scheduled sound alongside animation and timers. Replay clears previous effects before rescheduling. Hiding the tab pauses the experience. Audio load failure preserves the usable visual scene and names the missing sound. The Developer approved the sound selection and mix on a physical smartphone.

### Second story: “The Midnight Magician”

This story becomes available only after “Welcome?” completes. The transition preserves the first story's ending while opening the central composition: after a brief hold, low fog crosses the scarecrow's feet and the scarecrow moves over approximately 2.4 seconds to a smaller persistent position beside the lower-left fence. The camera then pushes past the entrance over approximately two seconds so the central tent fills the visual focus. The scarecrow keeps its sign, faintly glowing eyes and replay target. Reduced motion uses an opacity-only fog cover with immediate scarecrow and camera position changes. Replaying the first story returns the camera and scarecrow to their entrance positions, then restores the usher position and tent view afterward without erasing second-story progress.

Four accessible pennant targets display a crescent moon, star, eye and rabbit. An unnatural gust demonstrates the fixed sequence **eye → moon → star** twice using a distinct flutter, glow and note for each pennant. The User repeats the sequence. Each correct input repeats its audiovisual response and lights one tent bulb to show progress. An incorrect input produces a gentle comic response, clears only this puzzle attempt, and demonstrates the sequence again. The rabbit pennant is not used in the solution. Progressive hints move from noticing the unnatural gust, to recognizing that three flags took turns, to suggesting that the User repeat the wind's trick. The solution never depends on color or sound alone.

Completing the sequence begins an approximately ten-second story:

1. The tent bulbs finish illuminating and the curtains tremble.
2. The curtains snap open to reveal a tall magician as a backlit shadow.
3. The figure removes its top hat and spins it around one hand.
4. The magician bows deeply with the hat near the ground.
5. A pale spectral bunny hops from the hat. Faint ghostly applause accompanies the reveal, and the magician reacts with surprise.
6. The magician retreats as the bunny escapes into a dense magical fog. Beneath the fog, the tent view dissolves into a new interior-midway composition with a complete, unlit Ferris wheel centered at the end of a clear path.
7. The bunny continues directly up the path toward the wheel, disappears beneath it and leaves glowing pawprints ending below one dark carriage.

An original synthesized D-minor calliope waltz accompanies the full sequence. Five clear three-beat measures use a low “oom” downbeat with two answering “pah” notes. A recognizable two-measure melody repeats with a darker variation for the bow, then bends into an unresolved final cadence during the rabbit escape. A brief CC0 applause recording marks the bunny reveal. Three shortened, pitch-shifted uses of the existing twig snap pan right with the rabbit as ground contacts. The score remains subordinate to the action, lowers the wind while playing, and uses the shared audio clock so pause, resume, replay and tab hiding preserve its timing.

The wheel-centered composition persists afterward and becomes the discovery bridge to the third story; the Ferris wheel itself remains inactive during this checkpoint. Two unobtrusive controls in the final view replay “Welcome?” or “The Midnight Magician.” A replay temporarily returns to that story’s view, then restores the completed wheel composition without erasing progress. Reduced motion uses an opacity-only fog dissolve, an immediate scene replacement and a static rabbit endpoint before the pawprints appear. All shared story rules from the brief still apply, including interaction locking, global pause and replay without reload.

## Scope and revisions

Record excluded ideas, the next behavior that must work, and consequential requirement changes with their evidence.

The first story is complete. The second-story transition, puzzle and visual sequence are implemented and approved on a physical phone; its original calliope cue is implemented pending listening review. Additional Story 2 effects and an unprompted discovery playtest remain before Story 3 is specified. Ferris-wheel movement remains reserved for the third story.

## Saving the transcript

When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
