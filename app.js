const app = document.querySelector("#app");
const intro = document.querySelector("#intro");
const scene = document.querySelector("#scene");
const enterButton = document.querySelector("#enter");
const motionCheckbox = document.querySelector("#reduce-motion");
const pauseButton = document.querySelector("#pause");
const pauseIcon = document.querySelector("#pause-icon");
const pauseLabel = document.querySelector("#pause-label");
const rustle = document.querySelector("#rustle");
const rustleStalks = [...document.querySelectorAll(".rustle-stalks")];
const eyeTrigger = document.querySelector("#eye-trigger");
const storyLayer = document.querySelector("#story-layer");
const hint = document.querySelector("#hint");
const status = document.querySelector("#status");
const audioMessage = document.querySelector("#audio-message");
const audio = new SceneAudio();
const activeCornRepair = document.querySelector("#active-corn-repair");

const state = {
  entered: false,
  paused: false,
  storyPlaying: false,
  rustleStep: 0,
  hintStage: 0,
  fairgroundRevealed: false,
};

const scheduled = new Set();
const cornRig = new CornRig(
  rustleStalks,
  () => state.entered && !state.paused && !app.classList.contains("is-reduced"),
  (index) => audio.setRustle(index)
);

function schedule(callback, delay) {
  const task = { callback, remaining: delay, started: performance.now(), id: 0 };
  task.id = window.setTimeout(() => runTask(task), delay);
  scheduled.add(task);
  return task;
}

function runTask(task) {
  scheduled.delete(task);
  task.callback();
}

function pauseTimers() {
  const now = performance.now();
  scheduled.forEach((task) => {
    clearTimeout(task.id);
    task.remaining = Math.max(0, task.remaining - (now - task.started));
  });
}

function resumeTimers() {
  scheduled.forEach((task) => {
    task.started = performance.now();
    task.id = window.setTimeout(() => runTask(task), task.remaining);
  });
}

function clearTimers() {
  scheduled.forEach((task) => clearTimeout(task.id));
  scheduled.clear();
}

function setHint(message) {
  hint.textContent = message;
}

function startHints() {
  schedule(() => {
    if (state.rustleStep === 0 && !state.storyPlaying) setHint("Did the corn just move?");
  }, 4500);
  schedule(() => {
    if (state.rustleStep < 2 && !state.storyPlaying) setHint("Something is heading toward the entrance.");
  }, 10000);
  schedule(() => {
    if (!state.storyPlaying) setHint(state.rustleStep === 2 ? "Who is watching from the corn? Touch the eyes." : "Follow the rustling stalks.");
  }, 16000);
}

async function enterExperience() {
  if (state.entered || enterButton.disabled) return;
  enterButton.disabled = true;
  enterButton.textContent = "Opening the gates…";
  const allSoundsReady = await audio.init();
  state.entered = true;
  app.classList.add("has-entered");
  audio.startAmbience();
  cornRig.start();
  app.classList.toggle("is-reduced", motionCheckbox.checked);
  intro.classList.add("is-gone");
  scene.setAttribute("aria-hidden", "false");
  rustle.focus();
  startHints();
  if (!allSoundsReady) {
    const failed = audio.failedSounds.length ? ` (${audio.failedSounds.join(", ")})` : "";
    const message = location.protocol === "file:"
      ? "Sound needs a local web preview; this file was opened directly."
      : `Some sounds couldn’t load${failed}. You can still explore.`;
    audioMessage.textContent = message;
    status.textContent = message;
  }
}

function advanceRustle() {
  if (state.paused || state.storyPlaying) return;

  state.rustleStep += 1;
  const position = state.rustleStep === 1 ? "two" : "one";
  rustle.className = `rustle rustle--${position}`;
  rustleStalks.forEach((stalks, index) => {
    stalks.classList.toggle("is-active", state.rustleStep === 1 && index === 1);
  });

  if (state.rustleStep === 1) {
    if (app.classList.contains("is-reduced")) {
      audio.play("corn", { duration: .8, volume: .65, pan: -.45 });
    }
    status.textContent = "A dry rustle answers.";
    rustle.setAttribute("aria-label", "Rustling corn farther up the path");
    setHint("");
  } else if (state.rustleStep === 2) {
    audio.play("snap", { duration: .53, volume: .55, pan: .45, offset: 0 });
    audio.setAmbience(.08);
    rustle.disabled = true;
    storyLayer.classList.add("is-watching");
    storyLayer.setAttribute("aria-hidden", "false");
    eyeTrigger.hidden = false;
    status.textContent = "The rustling stops. Someone is watching.";
    setHint("A pair of eyes waits in the corn.");
    eyeTrigger.focus({ preventScroll: true });
  }
}

function playStory() {
  if (state.paused || state.storyPlaying || (state.rustleStep !== 2 && !storyLayer.classList.contains("is-revealed"))) return;
  clearTimers();
  state.storyPlaying = true;
  rustleStalks.forEach((stalks) => stalks.classList.remove("is-active"));
  eyeTrigger.hidden = true;
  storyLayer.classList.remove("is-watching");
  rustle.disabled = true;
  setHint("");
  status.textContent = "The corn falls silent.";
  storyLayer.setAttribute("aria-hidden", "false");
  storyLayer.classList.remove("is-playing", "is-watching", "is-revealed");
  void storyLayer.offsetWidth;
  storyLayer.classList.add("is-playing");
  audio.beginStory();

  schedule(() => { status.textContent = "Two orange eyes rise between the stalks."; }, 1200);
  schedule(revealFairground, 3840);
  schedule(() => { status.textContent = "A flash reveals the fairground and a pumpkin scarecrow."; }, 4000);
  schedule(() => { status.textContent = "It offers a sign: Welcome?"; }, 5100);
  schedule(resetStory, 8000);
}

function revealFairground() {
  if (state.fairgroundRevealed) return;
  state.fairgroundRevealed = true;
  // Safari does not reliably repaint clones when an image source changes.
  // Point each rendered clone at the already-decoded fairground source instead.
  document.querySelectorAll('use[href="#original-art"]').forEach((layer) => {
    layer.setAttribute("href", "#fairground-art");
    layer.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#fairground-art");
  });
  activeCornRepair.setAttribute("href", "Assets/corn-rig/background-repair-flex.png");
  scene.classList.add("has-fairground");
  scene.setAttribute("aria-label", "A revealed Halloween fairground with a pumpkin scarecrow at the entrance");
}

function resetStory() {
  state.storyPlaying = false;
  audio.setAmbience(.24, .6);
  state.rustleStep = 0;
  storyLayer.classList.add("is-revealed");
  storyLayer.classList.remove("is-playing");
  storyLayer.setAttribute("aria-hidden", "false");
  rustle.disabled = false;
  rustle.className = "rustle rustle--one";
  rustleStalks.forEach((stalks, index) => stalks.classList.toggle("is-active", index === 0));
  eyeTrigger.hidden = false;
  rustle.setAttribute("aria-label", "Rustling corn near the path");
  status.textContent = "The scarecrow waits. Tap its eyes to replay.";
  schedule(() => { if (!state.storyPlaying) status.textContent = ""; }, 1800);
  startHints();
}

async function togglePause() {
  if (!state.entered || pauseButton.disabled) return;
  pauseButton.disabled = true;
  const pausing = !state.paused;
  if (pausing) {
    state.paused = true;
    pauseTimers();
    app.classList.add("is-paused");
    await audio.pause().catch(() => {});
  } else {
    await audio.resume().catch(() => {});
    state.paused = false;
    resumeTimers();
  }
  app.classList.toggle("is-paused", state.paused);
  pauseButton.setAttribute("aria-pressed", String(state.paused));
  pauseIcon.textContent = state.paused ? "▶" : "Ⅱ";
  pauseLabel.textContent = state.paused ? "Resume experience" : "Pause experience";
  status.textContent = state.paused ? "Experience paused" : "Experience resumed";
  pauseButton.disabled = false;
}

motionCheckbox.checked = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (location.protocol === "file:") {
  audioMessage.textContent = "For sound, open this app through a local web preview instead of opening the file directly.";
}
enterButton.addEventListener("click", enterExperience);
rustle.addEventListener("click", advanceRustle);
eyeTrigger.addEventListener("click", playStory);
pauseButton.addEventListener("click", togglePause);

document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.entered && !state.paused) togglePause();
});

window.addEventListener("pagehide", () => {
  clearTimers();
  cornRig.stop();
  audio.close();
});
