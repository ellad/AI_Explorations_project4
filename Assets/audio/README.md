# Sound sources and credits

The active recordings and archived original thunder were verified as **CC0 1.0** on their original Freesound pages on October 14, 2026. CC0 permits copying, editing and redistribution, including commercial use. See [CC0 terms](https://creativecommons.org/publicdomain/zero/1.0/).

The local files are Freesound's public high-quality MP3 previews, not the original WAV/FLAC downloads. No external audio host is needed during app playback.

| Local file | Recording and creator | Source |
| --- | --- | --- |
| `wind.mp3` | Soft Wind — florianreichelt | https://freesound.org/people/florianreichelt/sounds/459977/ |
| `corn.wav` | Active five-second mono PCM excerpt from corn stalk rustling — kyles | https://freesound.org/people/kyles/sounds/454363/ |
| `corn.mp3` | Archived full MP3 preview used to derive `corn.wav` — kyles | https://freesound.org/people/kyles/sounds/454363/ |
| `snap.mp3` | Twig Snap 04.wav — Glitchedtones | https://freesound.org/people/Glitchedtones/sounds/322411/ |
| `thunder.mp3` | Short_Thunder_Deep.wav — SholeColtis | https://freesound.org/people/SholeColtis/sounds/683420/ |
| `thunder-clap.mp3` | big thunder clap — seth-m | https://freesound.org/people/seth-m/sounds/458015/ |
| `creak.mp3` | Objects_WoodCreak_1.wav — SilentStrikeZ | https://freesound.org/people/SilentStrikeZ/sounds/389645/ |

## Direct preview URLs

- https://cdn.freesound.org/previews/459/459977_6253486-hq.mp3
- https://cdn.freesound.org/previews/454/454363_612689-hq.mp3
- https://cdn.freesound.org/previews/322/322411_3294528-hq.mp3
- https://cdn.freesound.org/previews/683/683420_14670263-hq.mp3
- https://cdn.freesound.org/previews/458/458015_3366749-hq.mp3
- https://cdn.freesound.org/previews/389/389645_4103633-hq.mp3

## Playback adaptations

Corn rustling uses `corn.wav`, a five-second, 44.1 kHz mono PCM excerpt beginning 32.3 seconds into the credited source. The smaller uncompressed asset avoids an iPhone decode failure observed with the 69-second, 48 kHz stereo MP3. Playback creates a three-second loop with a 0.18-second boundary crossfade. The corn rig controls its lifetime, including the springs' settling motion. Moving to the second stalk pans the same loop from left to right. Pause freezes playback without restarting it, and scene reset starts a new loop when corn movement returns. This loop is independent of the scheduled thunder/creak effects. Reduced-motion mode retains one-shot corn feedback.

`../../audio.js` normalizes decoded buffers and uses reduced playback gains and a compressor. The wind uses a 20-second excerpt with a 0.8-second loop crossfade. Corn and creak snippets use the highest-energy short window to avoid starting on silence; excerpts are faded in/out and softly positioned in stereo. The first corn tap uses rustling, the second a twig snap, and the eye trigger begins a quieter rustle, a 3.84-second thunder cue and a 4.8-second sign creak. The full story stays eight seconds.

The active thunder cue is `thunder-clap.mp3`. It uses a sharp-attack detector to start just before the crack, then plays through the recording's natural tail at gain .72. The tail can continue after the eight-second visual story ends. A new replay clears the old tail before starting fresh sounds. `thunder.mp3` is retained as an unused original; the Developer requested a classic thunderclap instead of a low rumble. The source describes the active recording as a dry clap without accompanying rain.

The “Midnight Magician” story uses an original synthesized D-minor calliope waltz defined in `audio.js`; it does not use or derive from an external recording. Two detuned oscillator voices create its pipe-like timbre. Five three-beat measures provide a steady low “oom” and two answering “pah” notes beneath a repeated two-measure melody. The bow shifts into a darker variation, and the rabbit escape bends the final measure into an unresolved cadence. The music uses the shared AudioContext, effect registry and master compressor, so pause, replay cleanup and tab hiding follow the same rules as the recorded effects.

The app's Enter gesture unlocks audio before playback. Suspending the single AudioContext freezes both playing and future effects. Replay stops old effects before scheduling new ones. Missing/invalid audio is reported and the visual scene remains usable. Hiding the tab pauses the experience; the user resumes with Play.

Sound credits are also accessible on the start screen. Browser checks verified decoding, scheduling and pause behavior, and the Developer approved the final volume and mix on a physical smartphone on October 15, 2026.
