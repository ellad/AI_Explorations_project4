# “Welcome?” story asset

`corn-stalks-v2.png` is the active corn asset, generated with the built-in image tool using the fairground composite as the explicit color/style reference. Prompt: redraw the complete isolated cluster with muted olive-brown stalks, ochre leaves, deep brown shadows, thin ink outlines and curled drooping foliage from the scene; remove exposed bright kernels and lighting effects; transparent background. Two permanent instances are planted within the existing corn rows. Only their shaking state changes on interaction. The original corn asset is retained.

`corn-stalks.png` was generated with the built-in image-generation tool on October 14, 2026. Prompt: an isolated cluster of three complete dry golden-brown corn stalks in a hand-painted, inked Halloween fairground style with dusty purple shadows, diffuse night lighting, transparent background, and no fence, gate, ground, scenery, or text. It supplies whole plants that can sway from their bases without moving background pixels.

`scarecrow-welcome.png` was generated with OpenAI's built-in image-generation tool on October 14, 2026, using the project's fairground composite as a style and palette reference. It is an original project asset with a transparent alpha channel.

Prompt summary: a full-body lanky, eerie pumpkin-headed scarecrow presenting one crooked wooden sign reading “WELCOME?”, rendered as a hand-painted 2D storybook game illustration with no background, violence, logos, or additional characters.

`scarecrow-welcome-v2.png` is the first lighting revision. It removes the warm surrounding light spill and uses dimmer, diffuse purple-brown scene lighting. The original is retained as a comparison and fallback.

`scarecrow-welcome-v3-dull-eyes.png` is the current active base artwork. The eye cavities are dark and unlit so all orange illumination can be added, animated, paused, and reset independently in CSS. Earlier versions remain as comparisons and fallbacks.

The active character rendering in `../../index.html` splits this same image into SVG body, sign and holding-hand masks. The hand is removed from the prop and drawn as a stationary foreground layer attached to the arm. The sign and its hanging fabric animate independently. No new raster character/sign image was generated. CSS presents the sign after the lightning reveal, with an alternate stationary reveal for reduced motion.
