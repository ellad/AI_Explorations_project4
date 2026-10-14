# Original corn animation layers

The active rig is defined in the inline SVG in `../../index.html`, on the original 941 × 1672 coordinate system.

## Flexible stalk rig

`../../corn-rig.js` builds a 20-band mesh for each traced visible stem and its attached leaves. It samples the original art without changing its color or opacity. Band boundaries share their offsets, preserving a connected stem. Displacement grows quadratically from zero at y = 1130; the original foreground covers the planted lower section. A damped stem spring responds to uneven gusts, and a softer leaf spring follows with delay. Stopping a rustle lets the plant settle toward rest rather than snapping its rotation to zero.

The app runs this clock only after Enter and freezes its updates while paused or using reduced motion. The previous CSS leaf rotation is removed.

Active repair: `background-repair-flex.png`, generated through the built-in image tool using the original composite and a red silhouette location map. Prompt: remove exactly the marked stems and attached leaves, reconstruct the shaded posts and vegetation behind them, preserve unmarked scene composition, colors, fence and path, and omit all annotation marks. It is clipped to the stalk openings; unrelated generated changes are never shown. The earlier repair plate remains available.

Verification: Chrome screenshots of both bends differ from rest only within the corresponding stalk region, with no differing fence/ground pixels below y = 1140. Browser checks passed for unequal upper/lower bending, a fixed root within .02 source pixels, paused mesh transforms, trigger progression, persistent scarecrow and direct eye replay. The cutout contours are hand traced; this is the first flexible-motion version for Developer review.

- **Stationary artwork:** the original `composite_reference.png`, with two traced leaf blades and the lower foreground removed by masks.
- **Left and right leaf cutouts:** opaque original pixels, sampled from that same image using separate SVG clip paths. These are leaves of existing stalks, not newly illustrated stalk clusters. Their attachment points stay fixed during a modest rotation.
- **Foreground:** original fence, ground and surrounding lower foliage from y = 1130 downward. This remains stationary above the leaf layers.
- **Hidden repair:** `background-repair.png`, visible only through the two leaf openings when movement uncovers them. It is not a replacement for the scene.

The rejected generated stalk assets remain in `../story-welcome/` but are not used by this rig. There is no opacity blending or feathered duplicate of the corn.

## Background repair provenance

Generated with the built-in image-generation tool on October 14, 2026. The original composite was the edit target. Prompt:

> Prepare a hidden background repair plate for tiny corn-leaf movements. Remove two large drooping foreground corn leaf blades in the left and right corn rows. Fill their former positions with plausible dim corn stems and background leaves painted like their surroundings. Preserve the composition, canvas framing, entrance posts, fence rails, fence posts, path, tents and Ferris wheel. Do not add new large plants, text, glow, scenery or characters. Retain transparency in the original sky openings.

The generated plate is clipped to the openings; differences elsewhere in the generated scene never appear in the app.

## Verification

Chrome rendered the original, assembled resting scene, and both movement extremes at source resolution. Differences at rest are confined to the cutout edges (raster anti-aliasing); the fence and ground below y = 1140 have zero differing pixels. Close-up comparison was inspected. Browser behavior checks passed for trigger progression, eye activation, interaction locking, pause/resume, reset and replay.
