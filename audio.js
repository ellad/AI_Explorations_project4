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

  playCalliopeNote(frequency, {
    delay = 0,
    duration = .42,
    volume = .045,
    detune = 0,
    pan = 0,
  } = {}) {
    if (!this.context || !this.master || this.context.state !== "running") return;
    const when = this.context.currentTime + delay;
    const output = this.context.createGain();
    const panner = this.context.createStereoPanner();
    const filter = this.context.createBiquadFilter();
    const voices = [
      { type: "square", cents: detune - 7, level: .7 },
      { type: "sine", cents: detune + 9, level: .42 },
    ].map(({ type, cents, level }) => {
      const oscillator = this.context.createOscillator();
      const voiceGain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      oscillator.detune.value = cents;
      voiceGain.gain.value = level;
      oscillator.connect(voiceGain).connect(filter);
      return { oscillator, voiceGain };
    });

    filter.type = "lowpass";
    filter.frequency.value = 1850;
    filter.Q.value = 3.2;
    panner.pan.value = pan;
    output.gain.setValueAtTime(.0001, when);
    output.gain.exponentialRampToValueAtTime(volume, when + .025);
    output.gain.setValueAtTime(volume * .72, when + Math.min(.12, duration * .35));
    output.gain.exponentialRampToValueAtTime(.0001, when + duration);
    filter.connect(output).connect(panner).connect(this.master);

    let voicesRemaining = voices.length;
    voices.forEach(({ oscillator, voiceGain }) => {
      this.effects.add(oscillator);
      oscillator.onended = () => {
        this.effects.delete(oscillator);
        oscillator.disconnect();
        voiceGain.disconnect();
        voicesRemaining -= 1;
        if (!voicesRemaining) {
          filter.disconnect();
          output.disconnect();
          panner.disconnect();
        }
      };
      oscillator.start(when);
      oscillator.stop(when + duration);
    });
  }

  playNoiseBurst({
    delay = 0,
    duration = .12,
    volume = .02,
    pan = 0,
    frequency = 1200,
    q = 1.2,
  } = {}) {
    if (!this.context || !this.master || this.context.state !== "running") return;
    const frameCount = Math.max(1, Math.floor(this.context.sampleRate * duration));
    const buffer = this.context.createBuffer(1, frameCount, this.context.sampleRate);
    const samples = buffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < samples.length; i += 1) {
      const white = Math.random() * 2 - 1;
      previous = previous * .58 + white * .42;
      samples[i] = previous;
    }

    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    const panner = this.context.createStereoPanner();
    const when = this.context.currentTime + delay;
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = q;
    panner.pan.value = pan;
    gain.gain.setValueAtTime(.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + Math.min(.018, duration * .2));
    gain.gain.exponentialRampToValueAtTime(.0001, when + duration);
    source.connect(filter).connect(gain).connect(panner).connect(this.master);
    this.effects.add(source);
    source.onended = () => {
      this.effects.delete(source);
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
      panner.disconnect();
    };
    source.start(when);
    source.stop(when + duration);
  }

  beginMagicianStory() {
    this.stopEffects();
    this.setAmbience(.055, .35);
    // Five measures of an original D-minor circus waltz. A repeated melody
    // and steady oom-pah-pah accompaniment establish the tune before the
    // rabbit escape bends the final measure into an unresolved cadence.
    const accompaniment = [
      [.50, 146.83, .38, .026, -5, -.12], [1.00, 220.00, .27, .022, 3, .10], [1.50, 174.61, .27, .022, -3, .13],
      [2.00, 110.00, .38, .027, 4, -.12], [2.50, 164.81, .27, .022, -4, .10], [3.00, 138.59, .27, .022, 5, .13],
      [3.50, 146.83, .38, .026, -6, -.12], [4.00, 220.00, .27, .022, 4, .10], [4.50, 174.61, .27, .022, -4, .13],
      [5.00, 98.00, .38, .027, 5, -.12], [5.50, 146.83, .27, .022, -5, .10], [6.00, 116.54, .27, .022, 6, .13],
      [6.50, 155.56, .38, .028, -14, -.12], [7.00, 233.08, .27, .023, 17, .10], [7.50, 196.00, .27, .024, -19, .13],
    ];
    const melody = [
      [.50, 587.33, .42, .041, -4, -.08], [1.00, 698.46, .20, .040, 3, .04], [1.25, 880.00, .20, .040, -3, .08], [1.50, 1174.66, .42, .044, 4, .12],
      [2.00, 1108.73, .20, .043, -5, -.10], [2.25, 1174.66, .20, .043, 5, -.04], [2.50, 880.00, .42, .042, -4, .06], [3.00, 698.46, .20, .040, 4, .10], [3.25, 659.25, .20, .039, -5, .05],
      [3.50, 587.33, .42, .042, -6, -.08], [4.00, 698.46, .20, .041, 5, .04], [4.25, 880.00, .20, .041, -5, .08], [4.50, 1174.66, .42, .045, 6, .12],
      [5.00, 1046.50, .30, .043, -7, -.10], [5.50, 932.33, .30, .042, 7, 0], [6.00, 880.00, .42, .043, -8, .10],
      [6.50, 1244.51, .25, .047, -18, -.12], [7.00, 1174.66, .25, .048, 22, .08], [7.50, 830.61, .46, .051, -27, 0],
    ];
    [...accompaniment, ...melody].forEach(([delay, frequency, duration, volume, detune, pan]) => {
      this.playCalliopeNote(frequency, { delay, duration, volume, detune, pan });
    });

    const hatFlourish = [
      [2.92, 1174.66, -.22], [3.08, 1396.91, -.10], [3.24, 1760.00, .04],
      [3.40, 2093.00, .18], [3.58, 1760.00, .10], [3.76, 1396.91, -.05],
    ];
    hatFlourish.forEach(([delay, frequency, pan], index) => {
      this.playCalliopeNote(frequency, {
        delay,
        duration: .22,
        volume: .021,
        detune: index % 2 ? 12 : -10,
        pan,
      });
    });

    // Irregular filtered taps suggest distant, spectral applause without a
    // literal crowd recording competing with the melody.
    [
      [5.50, .11, .014, -.32, 1050], [5.66, .14, .016, .20, 1320],
      [5.83, .10, .013, -.08, 1580], [5.98, .15, .017, .34, 1180],
      [6.17, .12, .014, -.24, 1460], [6.34, .13, .013, .12, 980],
    ].forEach(([delay, duration, volume, pan, frequency]) => {
      this.playNoiseBurst({ delay, duration, volume, pan, frequency, q: 2.4 });
    });

    // Three quick, rightward-moving hops separate the rabbit from the final
    // warped musical cadence.
    [
      [6.58, 1567.98, .02], [6.88, 1760.00, .20], [7.18, 1396.91, .38],
    ].forEach(([delay, frequency, pan], index) => {
      this.playCalliopeNote(frequency, {
        delay,
        duration: .13,
        volume: .023,
        detune: index * 7 - 6,
        pan,
      });
      this.playNoiseBurst({
        delay: delay + .06,
        duration: .07,
        volume: .012,
        pan,
        frequency: 1850,
        q: 3,
      });
    });
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
