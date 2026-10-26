# Afterlight Fair — local preview

Developed by **Ella Gault**.

Published prototype: **https://ellad.github.io/AI_Explorations_project4/**

The completed three-story experience was verified on a physical smartphone on October 26, 2026.

Serve this folder through a local web server. Opening `index.html` directly uses `file://`, which browsers block for the audio loader's `fetch` requests.

From a terminal in this folder:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open **http://127.0.0.1:4173/**, then select **Enter the fair** to enable sound. Leave the terminal running while using the preview. Press Ctrl+C in that terminal to stop the server.

A VS Code preview that serves an HTTP address also works. No package installation or build step is required.

The global pause control freezes audio, animations and story timers. Developer, visual and audio credits are available on the start screen and in the asset README files under `Assets/`. Audio source links and verified usage terms are in `Assets/audio/README.md`.
