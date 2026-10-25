class SceneAudio {
  constructor() {
    this.context = null;
    this.buffers = new Map();
    this.effects = new Set();
    this.excerpts = new Map();
    this.failedSounds = [];
    this.rustleVoice = null;
    this.rustleIndex = -1;
    // Fetch before Enter, but do not create a playing audio context yet.
    this.files = ["wind", "corn", "snap", "thunder", "creak"].map(async (name) => {
      const controller = typeof AbortController === "function" ? new AbortController() : null;
      const timeout = controller ? window.setTimeout(() => controller.abort(), 12000) : 0;
      try {
        const file = name === "thunder" ? "thunder-clap.mp3" : name === "corn" ? "corn.wav" : `${name}.mp3`;
        const response = await fetch(`Assets/audio/${file}`, controller ? { signal: controller.signal } : {});
        if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
        return { name, bytes: await response.arrayBuffer() };
      } catch {
        return { name, bytes: null };
      } finally {
        if (timeout) window.clearTimeout(timeout);
      }
    });
  }

  async init() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    try {
      this.context = new AudioContextClass();
      // Called inside the Enter gesture, before awaiting asset decoding.
      const unlocked = this.context.resume();
      this.master = this.context.createGain();
      this.master.gain.value = .65;
      this.compressor = this.context.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 4;
      this.master.connect(this.compressor).connect(this.context.destination);
      this.ambientGain = this.context.createGain();
      this.ambientGain.gain.value = 0;
      this.ambientGain.connect(this.master);
      await unlocked;
      const files = await Promise.all(this.files);
      await Promise.all(files.map(async ({ name, bytes }) => {
        if (!bytes) {
          this.failedSounds.push(name);
          return;
        }
        try {
          const buffer = await this.context.decodeAudioData(bytes);
          this.normalize(buffer, name === "wind" ? .45 : .65);
          this.buffers.set(name, buffer);
          this.excerpts.set(name, name === "thunder"
            ? this.findAttack(buffer)
            : this.loudestWindow(buffer, name === "corn" ? .8 : 1.5));
        } catch {
          // Missing or corrupt sound never blocks the scene itself.
          this.failedSounds.push(name);
        }
      }));
      return this.failedSounds.length === 0;
    } catch {
      return false;
    }
  }

  normalize(buffer, target) {
    let peak = 0;
    for (let c = 0; c < buffer.numberOfChannels; c += 1) {
      for (const sample of buffer.getChannelData(c)) peak = Math.max(peak, Math.abs(sample));
    }
    if (!peak) return;
    for (let c = 0; c < buffer.numberOfChannels; c += 1) {
      const channel = buffer.getChannelData(c);
      for (let i = 0; i < channel.length; i += 1) channel[i] *= target / peak;
    }
  }

  loudestWindow(buffer, seconds) {
    const data = buffer.getChannelData(0);
    const length = Math.min(data.length, Math.floor(seconds * buffer.sampleRate));
    const step = Math.max(1, Math.floor(buffer.sampleRate * .1));
    let bestEnergy = -1;
    let bestStart = 0;
    for (let start = 0; start + length <= data.length; start += step) {
      let energy = 0;
      for (let i = start; i < start + length; i += 32) energy += data[i] * data[i];
      if (energy > bestEnergy) {
        bestEnergy = energy;
        bestStart = start;
      }
    }
    return bestStart / buffer.sampleRate;
  }

  findAttack(buffer) {
    const data = buffer.getChannelData(0);
    const block = Math.max(1, Math.floor(buffer.sampleRate * .01));
    let previousEnergy = 0;
    let bestRise = -Infinity;
    let bestStart = 0;
    for (let start = 1; start + block < data.length; start += block) {
      let energy = 0;
      // Emphasize a sharp crack rather than the loudest sustained bass rumble.
      for (let i = start; i < start + block; i += 1) {
        const difference = data[i] - data[i - 1];
        energy += difference * difference;
      }
      const rise = energy - previousEnergy;
      if (rise > bestRise) { bestRise = rise; bestStart = start; }
      previousEnergy = energy;
    }
    return Math.max(0, bestStart / buffer.sampleRate - .015);
  }

  createLoop(name, seconds, fadeSeconds, offset = 0) {
    const original = this.buffers.get(name);
    if (!original) return null;
    const sampleRate = original.sampleRate;
    const start = Math.floor(offset * sampleRate);
    const length = Math.min(original.length - start, Math.floor(sampleRate * seconds));
    const fade = Math.max(1, Math.min(Math.floor(sampleRate * fadeSeconds), Math.floor(length / 4)));
    const loop = this.context.createBuffer(original.numberOfChannels, length - fade, sampleRate);
    for (let c = 0; c < original.numberOfChannels; c += 1) {
      const source = original.getChannelData(c);
      const output = loop.getChannelData(c);
      const straight = length - 2 * fade;
      output.set(source.subarray(start + fade, start + length - fade));
      for (let i = 0; i < fade; i += 1) {
        const blend = i / fade;
        output[straight + i] = source[start + length - fade + i] * (1 - blend) + source[start + i] * blend;
      }
    }
    return loop;
  }

  startAmbience() {
    if (!this.buffers.has("wind") || this.ambientSource) return;
    const loop = this.createLoop("wind", 20, .8);
    this.ambientSource = this.context.createBufferSource();
    this.ambientSource.buffer = loop;
    this.ambientSource.loop = true;
    this.ambientSource.connect(this.ambientGain);
    this.ambientSource.start();
    this.setAmbience(.24, 1.2);
  }

  setRustle(index) {
    if (index === this.rustleIndex && (this.rustleVoice || index < 0)) return;
    if (!this.context || this.context.state !== "running") return;
    if (index < 0) {
      this.stopRustle();
      return;
    }
    if (!this.buffers.has("corn")) return;
    if (!this.rustleVoice) {
      this.rustleBuffer ||= this.createLoop("corn", 3, .18, Math.max(0, this.excerpts.get("corn") - .3));
      const source = this.context.createBufferSource();
      const gain = this.context.createGain();
      const panner = this.context.createStereoPanner();
      source.buffer = this.rustleBuffer;
      source.loop = true;
      gain.gain.setValueAtTime(0, this.context.currentTime);
      gain.gain.linearRampToValueAtTime(.48, this.context.currentTime + .12);
      source.connect(gain).connect(panner).connect(this.master);
      this.rustleVoice = { source, gain, panner };
      source.start();
    }
    this.rustleIndex = index;
    this.rustleVoice.panner.pan.setTargetAtTime(index === 0 ? -.45 : .45, this.context.currentTime, .06);
  }

  stopRustle() {
    this.rustleIndex = -1;
    const voice = this.rustleVoice;
    if (!voice) return;
    this.rustleVoice = null;
    const now = this.context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.linearRampToValueAtTime(0, now + .7);
    voice.source.onended = () => {
      voice.source.disconnect(); voice.gain.disconnect(); voice.panner.disconnect();
    };
    voice.source.stop(now + .7);
  }

  setAmbience(value, fade = .15) {
    if (!this.context || !this.ambientGain) return;
    const now = this.context.currentTime;
    const gain = this.ambientGain.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(value, now + fade);
  }

  play(name, { delay = 0, duration = 1, volume = .5, pan = 0, rate = 1, offset = this.excerpts.get(name) || 0 } = {}) {
    const buffer = this.buffers.get(name);
    if (!buffer || !this.context || this.context.state !== "running") return;
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const panner = this.context.createStereoPanner();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    panner.pan.value = pan;
    const when = this.context.currentTime + delay;
    const span = Math.min(duration, (buffer.duration - offset) / rate);
    if (span <= 0) return;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume, when + Math.min(.012, span / 4));
    gain.gain.setValueAtTime(volume, when + Math.max(.012, span - .09));
    gain.gain.linearRampToValueAtTime(0, when + span);
    source.connect(gain).connect(panner).connect(this.master);
    this.effects.add(source);
    source.onended = () => {
      this.effects.delete(source);
      source.disconnect();
      gain.disconnect();
      panner.disconnect();
    };
    source.start(when, offset);
    source.stop(when + span);
  }

  playTone(frequency, { duration = .24, volume = .08, type = "sine" } = {}) {
    if (!this.context || !this.master || this.context.state !== "running") return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    oscillator.connect(gain).connect(this.master);
    this.effects.add(oscillator);
    oscillator.onended = () => {
      this.effects.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  beginStory() {
    this.stopEffects();
    this.setAmbience(.035);
    this.play("thunder", { delay: 3.84, duration: Infinity, volume: .72 });
    this.play("creak", { delay: 4.8, duration: 1.5, volume: .5, pan: .15 });
  }

  stopEffects() {
    this.effects.forEach((source) => { try { source.stop(); } catch {} });
    this.effects.clear();
  }

  async pause() {
    if (this.context?.state === "running") await this.context.suspend();
  }

  async resume() {
    if (this.context && this.context.state !== "running" && this.context.state !== "closed") await this.context.resume();
  }

  close() {
    this.stopRustle();
    this.stopEffects();
    if (this.context && this.context.state !== "closed") this.context.close();
  }
}
