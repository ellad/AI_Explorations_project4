# Concealed opening scene

Both assets were generated with the built-in image-generation tool on October 14, 2026, as edits of existing project artwork. They retain the 941 × 1672 scene coordinate system.

- `corn-path.png`: opening scene with corn, dirt path, low fences and fog. The wheel, tents, entrance arch/pillars, flags and fairground decorations are removed. Prompt requested preservation of original foreground corn/fence/path color, texture, positions and perspective, with dark fog filling the removed attraction areas.
- `corn-repair.png`: hidden repair plate for the same opening. Prompt used `corn-path.png` as the edit target and the existing red stalk-silhouette diagram only as a location guide; remove the marked stems/leaves and fill behind them with dark corn/fog, without importing the guide's fairground or annotations.

In `../../index.html`, `#original-art` is a shared source alias used by the stationary scene, corn mesh and foreground. Initially it points to `#opening-source`, while the repair alias points to `#opening-repair`. At the first lightning flash (3.84 seconds), `../../app.js` switches both aliases to the original fairground composite and its existing repair plate. Both sets of assets are declared in the SVG so they load before the transition.

The start screen also uses the concealed artwork to preserve the surprise. The revealed state persists during exploration and replay until the page is reloaded.

Verification: normal-security Chrome HTTP preview at 390 × 844. Checked concealed opening, pause before the reveal, fairground/character reveal, sign presentation, persistence after the story and persistence during replay. Screenshots inspected. Developer preview approval remains pending.
