const rig = document.querySelector("#wheel-rig");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const reduceCheckbox = document.querySelector("#reduce");
const status = document.querySelector("#status");

let animations = [];
let accelerating = false;
let accelerationFrame = 0;

function setPlaybackRate(rate) {
  animations.forEach((animation) => { animation.playbackRate = rate; });
}

function stopAcceleration() {
  accelerating = false;
  cancelAnimationFrame(accelerationFrame);
}

function pauseWheel(message = "Wheel motion paused.") {
  stopAcceleration();
  animations.forEach((animation) => animation.pause());
  startButton.textContent = "Resume wheel";
  pauseButton.disabled = true;
  status.textContent = message;
}

function accelerateWheel() {
  if (!animations.length || reduceCheckbox.checked) return;
  stopAcceleration();
  animations.forEach((animation) => animation.play());
  const began = performance.now();
  accelerating = true;
  const tick = (now) => {
    if (!accelerating) return;
    const progress = Math.min(1, (now - began) / 3200);
    setPlaybackRate(.06 + .94 * (1 - Math.pow(1 - progress, 3)));
    status.textContent = progress < 1 ? "The wheel slowly gathers momentum." : "The wheel turns; its carriages remain upright.";
    if (progress < 1) accelerationFrame = requestAnimationFrame(tick);
    else accelerating = false;
  };
  accelerationFrame = requestAnimationFrame(tick);
  startButton.textContent = "Restart acceleration";
  pauseButton.disabled = false;
}

function applyMotionPreference() {
  if (reduceCheckbox.checked) {
    pauseWheel("Reduced motion: wheel and carriages remain still.");
    startButton.disabled = true;
  } else {
    startButton.disabled = false;
    pauseWheel("Wheel motion is stopped.");
  }
}

async function loadRig() {
  const response = await fetch("wheel-rig-prototype.svg");
  rig.innerHTML = await response.text();
  animations = [...rig.getAnimations({ subtree: true })];
  animations.forEach((animation) => animation.pause());
  applyMotionPreference();
}

startButton.addEventListener("click", accelerateWheel);
pauseButton.addEventListener("click", () => pauseWheel());
reduceCheckbox.addEventListener("change", applyMotionPreference);
reduceCheckbox.checked = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
loadRig().catch(() => { status.textContent = "The wheel rig could not be loaded."; });
