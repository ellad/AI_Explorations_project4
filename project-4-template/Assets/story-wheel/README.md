# Ferris-wheel focus scene

`wheel-focus-v1.png`, `wheel-focus-v2.png` and `wheel-focus-v3-unlit.png` are AI-generated 941 × 1672 RGB scenes prepared on October 25, 2026 with OpenAI's built-in image-generation tool. The first uses the project’s existing `composite_reference.png` as an edit target and strict style reference. Each later image is a targeted revision of the preceding version. The assets are original project artwork and contain no external visual material beyond the existing project reference.

## Generation prompt

> Recompose the supplied fairground artwork into a new wheel-focused view. Show one complete Ferris wheel front and center as the unmistakable focal point, with a clear dirt midway path leading directly from the lower foreground to the base of the wheel. Preserve the hand-painted storybook Halloween fair aesthetic, linework, texture, lighting, and muted burgundy, dusty orange, charcoal, and warm bulb palette. Create a nighttime abandoned seasonal fair with a dark misty sky, restrained corn and low fencing at the sides, subtle low fog, and enough open path for a small spectral rabbit animation to travel toward the wheel. Use a portrait 941:1672 composition, keep the full wheel visible with breathing room above it, center it horizontally, keep its base reachable in the middle distance, and leave the lower path uncluttered. The mood is eerie, mysterious, and playful rather than threatening. Background only: no rabbit, pawprints, people, characters, text, signs, logos, watermark, entrance arch, magician tent, gore, realistic danger, or cropped wheel.

The empty path is intentional. The existing standalone spectral-rabbit asset will animate over it during the Story 2-to-Story 3 transition, allowing motion and reduced-motion treatments to remain code-controlled.

## Interior-midway revision

Developer review found that the cornfield in `wheel-focus-v1.png` contradicted the scene’s location inside the fair. `wheel-focus-v2.png` preserves the centered wheel, open path, lighting and composition while replacing all corn with an interior midway of small game booths, striped tent edges, weathered railings, dim bulbs, crates and restrained fairground props. It contains no crops or farm imagery. Version 1 remains preserved for provenance but is not intended for integration.

## Unlit revision

Developer review reserved all lighting and glow for Story 3 animation. `wheel-focus-v3-unlit.png` preserves the approved wheel, midway, path, fixtures and object placement while turning off every wheel bulb, string light, booth bulb and lantern. It removes emissive cores, halos, bloom, reflected illumination and warm light spill. Minimal cool ambient sky visibility keeps the dormant scene readable. Versions 1 and 2 remain preserved for provenance but are not intended for integration.

## Layered motion prototype

`wheel-background-clean-v1.png` is a 941 × 1672 RGB edit of `wheel-focus-v3-unlit.png`, generated with OpenAI's built-in image-generation tool on October 25, 2026. It removes the flattened Ferris wheel while preserving the approved interior midway, dormant booths, path, palette and atmospheric lighting. This clean plate allows a separately animated wheel to rotate without exposing a duplicate wheel underneath it.

Generation prompt:

> Edit the supplied portrait abandoned-fair image into a clean background plate for animation. Remove the entire Ferris wheel: every rim, spoke, hub, carriage, hanging bracket, support leg, platform, stair, and wheel-associated structure. Repair the removed area naturally with the same dark clouded night sky and distant interior-fair tents or stalls already present in the image. Preserve the foreground dirt midway, both rows of booths, fences, barrels, bunting, perspective, framing, hand-painted storybook texture, muted burgundy/dusty-orange/charcoal palette, and unlit dormant mood exactly. Do not add any lighting, glow, characters, pawprints, people, rabbit, text, logos, cornfield, or new focal object. The central path should continue toward the distant fair and the repaired sky must remain dark enough for a separately layered Ferris wheel to read clearly. Keep the original 941 × 1672 portrait dimensions and composition.

`wheel-rig-prototype.svg` is a working copy of the existing project Ferris-wheel animation pack. `prototype.html` embeds the same SVG markup directly so opening the page from `file://` does not depend on a browser-blocked local `fetch()` request; `prototype.css` and `prototype.js` layer and control it without changing the main story. The prototype exposes start, pause and reduced-motion controls. It begins stopped, accelerates all nine SVG animations from 0.06× to 1× over 3.2 seconds, and counter-rotates the eight carriages so they remain upright.

Chrome verification at a 390 × 844 phone viewport confirmed both HTTP and direct-file loading, the complete wheel remains centered, the background stays visible through the SVG, all nine animations run at a shared rate, pause freezes all nine, and reduced motion leaves them paused and disables the start control. The inline implementation avoids Chrome and Safari local-file request restrictions. This is a feasibility checkpoint only; Story 3 lighting, pawprint climbing and the impossible passenger have not yet been integrated.
