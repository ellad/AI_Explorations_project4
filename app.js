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
const midwayLayer = document.querySelector("#midway-layer");
const magicianStory = document.querySelector("#magician-story");
const magicianReplay = document.querySelector("#magician-replay");
const wheelScene = document.querySelector("#wheel-scene");
const welcomeReplay = document.querySelector("#welcome-replay");
const wheelMagicianReplay = document.querySelector("#wheel-magician-replay");
const wheelStoryStart = document.querySelector("#wheel-story-start");
const pennantButtons = [...document.querySelectorAll(".pennant")];
const pennantVisuals = [...document.querySelectorAll(".tent-pennant-visuals > g")];
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
  midwayUnlocked: false,
  phase: "entrance-discovery",
  midwayAttempt: 0,
  midwaySolved: false,
  magicianComplete: false,
  wheelStoryComplete: false,
};

const midwaySequence = ["eye", "moon", "star"];
const pennantNotes = { eye: 392, moon: 523.25, star: 659.25, rabbit: 783.99 };

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

function setPhase(phase) {
  state.phase = phase;
  scene.dataset.phase = phase;
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
  if (state.paused || state.storyPlaying || state.phase !== "entrance-discovery") return;

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
  setPhase("story-one");
  setPennantInput(false);
  scene.classList.remove("is-magician-complete", "is-magician-playing");
  scene.classList.remove("is-wheel-transitioning", "is-wheel-ready", "is-wheel-story", "is-wheel-story-complete");
  wheelScene.setAttribute("aria-hidden", "true");
  magicianStory.setAttribute("aria-hidden", "true");
  magicianReplay.hidden = true;
  pennantVisuals.forEach((visual) => visual.classList.remove("is-cued"));
  scene.classList.remove("is-midway-mistake");
  scene.classList.remove("is-ushered", "is-usher-transition", "is-camera-moving", "is-midway-zoomed", "is-midway-ready", "is-pennant-intro", "is-story-focusing", "is-story-focused");
  midwayLayer.setAttribute("aria-hidden", "true");
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
  rustle.disabled = true;
  rustle.className = "rustle rustle--one";
  rustleStalks.forEach((stalks) => stalks.classList.remove("is-active"));
  eyeTrigger.hidden = false;
  rustle.setAttribute("aria-label", "Rustling corn near the path");
  status.textContent = "The scarecrow waits. Tap its eyes to replay.";
  schedule(() => { if (!state.storyPlaying) status.textContent = ""; }, 1800);
  beginMidwayTransition();
}

function beginMidwayTransition() {
  state.midwayUnlocked = true;
  setPhase("midway-transition");
  schedule(() => {
    if (state.storyPlaying) return;
    midwayLayer.setAttribute("aria-hidden", "false");
    scene.classList.add("is-usher-transition");
  }, 900);
  schedule(() => {
    if (state.storyPlaying) return;
    scene.classList.remove("is-usher-transition");
    scene.classList.add("is-ushered", "is-camera-moving", "is-midway-zoomed");
    status.textContent = "The scarecrow steps aside. The midway draws closer.";
  }, 3300);
  schedule(() => {
    if (state.storyPlaying) return;
    scene.classList.remove("is-camera-moving");
    scene.classList.add("is-midway-ready", "is-pennant-intro");
    alignPennantTargets();
    status.textContent = "Four pennants stir above the central tent.";
    if (state.midwaySolved) {
      showMidwayProgress(3);
      setPhase("midway-solved");
      if (state.magicianComplete) {
        schedule(restoreWheelView, 650);
      }
      schedule(() => scene.classList.remove("is-pennant-intro"), 1350);
    } else {
      schedule(() => {
        scene.classList.remove("is-pennant-intro");
        demonstrateMidwaySequence(state.midwayAttempt === 0 ? 2 : 1);
      }, 1350);
    }
  }, 5300);
}

function setPennantInput(enabled) {
  scene.classList.toggle("is-midway-input", enabled);
  pennantButtons.forEach((button) => { button.disabled = !enabled; });
}

function alignPennantTargets() {
  if (!scene.classList.contains("is-midway-ready")) return;

  const sceneRect = scene.getBoundingClientRect();
  pennantButtons.forEach((button) => {
    const visual = pennantVisuals.find((item) => item.dataset.symbol === button.dataset.symbol);
    if (!visual) return;

    const visualRect = visual.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    button.style.left = `${visualRect.left - sceneRect.left + (visualRect.width - buttonRect.width) / 2}px`;
    button.style.top = `${visualRect.top - sceneRect.top + (visualRect.height - buttonRect.height) / 2}px`;
    button.style.right = "auto";
  });
}

function showMidwayProgress(count) {
  pennantVisuals.forEach((visual) => {
    const completedIndex = midwaySequence.indexOf(visual.dataset.symbol);
    visual.classList.toggle("is-selected", completedIndex >= 0 && completedIndex < count);
  });
}

function cuePennant(symbol, announce = true) {
  const visual = pennantVisuals.find((item) => item.dataset.symbol === symbol);
  if (!visual) return;
  visual.classList.remove("is-cued");
  void visual.getBoundingClientRect();
  visual.classList.add("is-cued");
  schedule(() => visual.classList.remove("is-cued"), 580);
  audio.playTone(pennantNotes[symbol]);
  if (announce) status.textContent = `${symbol === "moon" ? "Crescent moon" : symbol} pennant flutters.`;
}

function demonstrateMidwaySequence(repetitions = 1) {
  if (state.storyPlaying || state.midwaySolved) return;
  setPhase("midway-demonstration");
  setPennantInput(false);
  setHint("");
  status.textContent = "An unnatural gust crosses the tent.";
  const stepDuration = 760;
  for (let repeat = 0; repeat < repetitions; repeat += 1) {
    midwaySequence.forEach((symbol, index) => {
      schedule(() => cuePennant(symbol), repeat * 2700 + index * stepDuration + 500);
    });
  }
  schedule(beginMidwayInput, repetitions * 2700 + 250);
}

function beginMidwayInput() {
  if (state.storyPlaying || state.midwaySolved) return;
  alignPennantTargets();
  setPhase("midway-input");
  setPennantInput(true);
  showMidwayProgress(state.midwayAttempt);
  status.textContent = "The pennants wait.";
  pennantButtons[0].focus({ preventScroll: true });
  startMidwayHints();
}

function startMidwayHints() {
  schedule(() => {
    if (state.phase === "midway-input") setHint("That wasn’t an ordinary gust.");
  }, 5000);
  schedule(() => {
    if (state.phase === "midway-input") setHint("Three symbols moved. Did they take turns?");
  }, 11000);
  schedule(() => {
    if (state.phase === "midway-input") setHint("Repeat the wind’s trick.");
  }, 18000);
}

function choosePennant(event) {
  if (state.paused || state.phase !== "midway-input") return;
  const symbol = event.currentTarget.dataset.symbol;
  cuePennant(symbol, false);
  if (symbol !== midwaySequence[state.midwayAttempt]) {
    setPhase("midway-mistake");
    setPennantInput(false);
    setHint("");
    audio.playTone(130.81, { duration: .42, volume: .07, type: "triangle" });
    status.textContent = "The flags droop at the wrong note.";
    scene.classList.add("is-midway-mistake");
    state.midwayAttempt = 0;
    schedule(() => {
      scene.classList.remove("is-midway-mistake");
      showMidwayProgress(0);
      demonstrateMidwaySequence(1);
    }, 950);
    return;
  }

  state.midwayAttempt += 1;
  showMidwayProgress(state.midwayAttempt);
  status.textContent = `${state.midwayAttempt} of ${midwaySequence.length} pennants answer.`;
  setHint("");
  if (state.midwayAttempt === midwaySequence.length) completeMidwayPuzzle();
}

function completeMidwayPuzzle() {
  state.midwaySolved = true;
  setPhase("midway-solved");
  setPennantInput(false);
  showMidwayProgress(3);
  scene.classList.add("is-midway-solved");
  audio.playTone(783.99, { duration: .55, volume: .09 });
  status.textContent = "The three pennants glow green. The curtains answer.";
  setHint("");
  scene.classList.add("is-story-focusing");
  schedule(playMagicianStory, 1600);
}

function playMagicianStory() {
  if (state.paused || state.storyPlaying) return;
  clearTimers();
  state.storyPlaying = true;
  setPhase("story-two");
  setPennantInput(false);
  eyeTrigger.hidden = true;
  magicianReplay.hidden = true;
  wheelScene.setAttribute("aria-hidden", "true");
  magicianStory.setAttribute("aria-hidden", "false");
  scene.classList.remove("is-magician-complete", "is-magician-playing", "is-story-focusing", "is-wheel-transitioning", "is-wheel-ready", "is-wheel-story", "is-wheel-story-complete");
  scene.classList.add("is-story-focused");
  void magicianStory.offsetWidth;
  scene.classList.add("is-magician-playing");
  audio.beginMagicianStory();
  status.textContent = "The tent lights dim.";
  setHint("");
  schedule(() => { status.textContent = "A shadowed performer appears."; }, 1300);
  schedule(() => { status.textContent = "The crooked hat spins."; }, 3000);
  schedule(() => { status.textContent = "A deep bow—then an escape."; }, 5000);
  schedule(() => { status.textContent = "The rabbit escapes into the fog."; }, 6500);
  schedule(beginWheelTransition, 7400);
  schedule(() => { status.textContent = "The rabbit races down the midway toward the wheel."; }, 8300);
  schedule(finishMagicianStory, 10000);
}

function beginWheelTransition() {
  wheelScene.setAttribute("aria-hidden", "false");
  scene.classList.add("is-wheel-transitioning");
}

function finishMagicianStory() {
  state.storyPlaying = false;
  state.magicianComplete = true;
  setPhase("magician-complete");
  scene.classList.remove("is-magician-playing", "is-wheel-transitioning");
  scene.classList.add("is-magician-complete", "is-wheel-ready");
  magicianStory.setAttribute("aria-hidden", "true");
  wheelScene.setAttribute("aria-hidden", "false");
  magicianReplay.hidden = true;
  eyeTrigger.hidden = true;
  audio.setAmbience(.24, .6);
  status.textContent = "The rabbit vanishes beneath the silent Ferris wheel.";
  setHint("Its tracks stop beneath one dark carriage.");
  wheelStoryStart.focus({ preventScroll: true });
}

function restoreWheelView() {
  scene.classList.remove("is-magician-complete");
  scene.classList.add("is-wheel-ready");
  magicianStory.setAttribute("aria-hidden", "true");
  magicianReplay.hidden = true;
  eyeTrigger.hidden = true;
  wheelScene.setAttribute("aria-hidden", "false");
  setPhase("magician-complete");
  status.textContent = "The silent Ferris wheel waits at the end of the midway.";
  setHint("The rabbit’s tracks stop beneath one dark carriage.");
}

function playWheelStory() {
  if (state.paused || state.storyPlaying) return;
  clearTimers();
  state.storyPlaying = true;
  audio.beginWheelStory();
  setPhase("story-three");
  scene.classList.remove("is-wheel-story", "is-wheel-story-complete");
  void wheelScene.offsetWidth;
  scene.classList.add("is-wheel-story");
  status.textContent = "One booth light wakes, then another.";
  setHint("");
  schedule(() => { status.textContent = "The last print fades beneath the iron supports."; }, 1900);
  schedule(() => { status.textContent = "A passenger appears—but the lit carriage is empty."; }, 3900);
  schedule(() => { status.textContent = "The silhouette jumps higher each time the light returns."; }, 6500);
  schedule(() => { status.textContent = "At the top, it raises one hand."; }, 8800);
  schedule(() => { status.textContent = "The bulb snaps on. The carriage is empty."; }, 10200);
  schedule(() => { status.textContent = "Light circles the wheel, then answers from both sides of the midway."; }, 12200);
  schedule(() => { status.textContent = "The pulses soften, but the wheel stays awake."; }, 14500);
  schedule(finishWheelStory, 16000);
}

function finishWheelStory() {
  setPhase("wheel-ending");
  scene.classList.remove("is-wheel-story");
  scene.classList.add("is-wheel-ending");
  audio.setAmbience(.15, 4.2);
  status.textContent = "The lights sweep into darkness.";
  setHint("");
  schedule(returnToCornfield, 4500);
}

function returnToCornfield() {
  state.storyPlaying = false;
  state.wheelStoryComplete = true;
  state.fairgroundRevealed = false;
  state.midwayUnlocked = false;
  state.midwaySolved = false;
  state.midwayAttempt = 0;
  state.magicianComplete = false;
  state.rustleStep = 0;
  audio.stopEffects();
  audio.setAmbience(.24, 1.2);
  setPhase("entrance-discovery");
  document.querySelectorAll('.art-layers use[href="#fairground-art"]').forEach((layer) => {
    layer.setAttribute("href", "#original-art");
    layer.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#original-art");
  });
  activeCornRepair.setAttribute("href", "Assets/opening-scene/corn-repair.png");
  scene.className = "scene is-corn-return";
  scene.setAttribute("aria-label", "A dark path between cornfields and wooden fences");
  wheelScene.setAttribute("aria-hidden", "true");
  midwayLayer.setAttribute("aria-hidden", "true");
  magicianStory.setAttribute("aria-hidden", "true");
  storyLayer.setAttribute("aria-hidden", "true");
  storyLayer.classList.remove("is-playing", "is-watching", "is-revealed");
  eyeTrigger.hidden = true;
  magicianReplay.hidden = true;
  rustle.disabled = false;
  rustle.className = "rustle rustle--one";
  rustle.setAttribute("aria-label", "Rustling corn near the path");
  rustleStalks.forEach((stalks, index) => stalks.classList.toggle("is-active", index === 0));
  audio.setAmbience(.24, .6);
  status.textContent = "The particles clear. The cornfield is waiting again.";
  setHint("Did the corn just move?");
  rustle.focus({ preventScroll: true });
  startHints();
  schedule(() => scene.classList.remove("is-corn-return"), 1350);
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
pennantButtons.forEach((button) => button.addEventListener("click", choosePennant));
magicianReplay.addEventListener("click", playMagicianStory);
welcomeReplay.addEventListener("click", playStory);
wheelMagicianReplay.addEventListener("click", playMagicianStory);
wheelStoryStart.addEventListener("click", playWheelStory);
pauseButton.addEventListener("click", togglePause);
window.addEventListener("resize", alignPennantTargets);

document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.entered && !state.paused) togglePause();
});

window.addEventListener("pagehide", () => {
  clearTimers();
  cornRig.stop();
  audio.close();
});
