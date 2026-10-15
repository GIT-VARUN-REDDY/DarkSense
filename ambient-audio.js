/**
 * DARKSENSE — Ambient Audio Engine
 * Pure Web Audio API atmospheric soundscape synthesizer:
 * - Rain (window droplets)
 * - Midnight Thunder (realistic dynamic rolling storm rumble & strikes)
 * - Vinyl Warmth (warm analogue crackle)
 *
 * Ambience resonance drone oscillators removed per request.
 * No external audio files required.
 */

(function () {
  'use strict';

  // ── State ───────────────────────────────────────────────────────────────────
  let audioCtx    = null;
  let masterGain  = null;
  let analyser    = null;

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(1.0, audioCtx.currentTime);

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    return audioCtx;
  }

  // ── Procedural Soundscape Layering Engine ─────────────────────────────────────
  const Soundscape = {
    rainGain: null,
    thunderGain: null,
    vinylGain: null,
    thunderStrikeTimer: null,
    currentThunderVal: 0,
    nodes: [],
    initialized: false,

    init(ctx) {
      if (this.initialized || !ctx) return;
      this.initialized = true;

      // 1. Rain Layer (Filtered Pink Noise with Droplet Envelope)
      const rainBuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const rainData = rainBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < rainData.length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        rainData[i] = (b0 + b1 + b2) * 0.25;
      }
      const rainSrc = ctx.createBufferSource();
      rainSrc.buffer = rainBuf;
      rainSrc.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 1600;

      this.rainGain = ctx.createGain();
      this.rainGain.gain.value = 0;

      rainSrc.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(masterGain || ctx.destination);
      rainSrc.start(0);
      this.nodes.push(rainSrc, rainFilter, this.rainGain);

      // 2. Midnight Thunder — Continuous Rolling Storm Atmosphere Bed
      // Seamless 6-second brownian low rumble buffer
      const thunderBuf = ctx.createBuffer(1, ctx.sampleRate * 6, ctx.sampleRate);
      const thunderData = thunderBuf.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < thunderData.length; i++) {
        const white = Math.random() * 2 - 1;
        // Leaky brownian integrator with high energy
        lastOut = (lastOut + (0.045 * white)) / 1.018;
        thunderData[i] = lastOut * 4.2;
      }
      const thunderSrc = ctx.createBufferSource();
      thunderSrc.buffer = thunderBuf;
      thunderSrc.loop = true;

      // Rich audible low-mid frequency filters (audible on laptop speakers as well as subwoofers)
      const thunderBP = ctx.createBiquadFilter();
      thunderBP.type = 'bandpass';
      thunderBP.frequency.value = 210;
      thunderBP.Q.value = 1.4;

      const thunderLP = ctx.createBiquadFilter();
      thunderLP.type = 'lowpass';
      thunderLP.frequency.value = 340;

      // Slow LFO to give continuous rumble natural undulating storm swells
      const rumbleLFO = ctx.createOscillator();
      const rumbleLFOGain = ctx.createGain();
      rumbleLFO.type = 'sine';
      rumbleLFO.frequency.value = 0.28; // rolling wave every ~3.5 seconds
      rumbleLFOGain.gain.value = 55; // modulates cutoff +/- 55 Hz
      rumbleLFO.connect(rumbleLFOGain);
      rumbleLFOGain.connect(thunderBP.frequency);
      rumbleLFO.start(0);

      this.thunderGain = ctx.createGain();
      this.thunderGain.gain.value = 0;

      thunderSrc.connect(thunderBP);
      thunderBP.connect(thunderLP);
      thunderLP.connect(this.thunderGain);
      this.thunderGain.connect(masterGain || ctx.destination);
      thunderSrc.start(0);
      this.nodes.push(thunderSrc, thunderBP, thunderLP, rumbleLFO, rumbleLFOGain, this.thunderGain);

      // 3. Vinyl Warm Crackle (Warm Dust Impulses)
      const vinylBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const vinylData = vinylBuf.getChannelData(0);
      for (let i = 0; i < vinylData.length; i++) {
        if (Math.random() < 0.0035) {
          vinylData[i] = (Math.random() * 2 - 1) * 0.8;
        } else {
          vinylData[i] = (Math.random() * 2 - 1) * 0.02;
        }
      }
      const vinylSrc = ctx.createBufferSource();
      vinylSrc.buffer = vinylBuf;
      vinylSrc.loop = true;

      const vinylFilter = ctx.createBiquadFilter();
      vinylFilter.type = 'bandpass';
      vinylFilter.frequency.value = 3200;
      vinylFilter.Q.value = 1.2;

      this.vinylGain = ctx.createGain();
      this.vinylGain.gain.value = 0;

      vinylSrc.connect(vinylFilter);
      vinylFilter.connect(this.vinylGain);
      this.vinylGain.connect(masterGain || ctx.destination);
      vinylSrc.start(0);
      this.nodes.push(vinylSrc, vinylFilter, this.vinylGain);
    },

    /**
     * Synthesize an authentic distant rolling lightning strike & thunder peal
     */
    triggerThunderStrike(val) {
      const ctx = getAudioCtx();
      if (!ctx || val <= 0.02) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // A. Lightning crackle transient (distant electric snap)
      const crackleBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
      const cData = crackleBuf.getChannelData(0);
      for (let i = 0; i < cData.length; i++) {
        cData[i] = (Math.random() * 2 - 1) * (1 - i / cData.length);
      }
      const crackleSrc = ctx.createBufferSource();
      crackleSrc.buffer = crackleBuf;

      const crackleFilter = ctx.createBiquadFilter();
      crackleFilter.type = 'bandpass';
      crackleFilter.frequency.value = 780;
      crackleFilter.Q.value = 2.4;

      const crackleGain = ctx.createGain();
      crackleGain.gain.setValueAtTime(0.001, now);
      crackleGain.gain.linearRampToValueAtTime(val * 0.45, now + 0.03);
      crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      crackleSrc.connect(crackleFilter);
      crackleFilter.connect(crackleGain);
      crackleGain.connect(masterGain || ctx.destination);
      crackleSrc.start(now);

      // B. Deep explosive rolling thunder boom & multi-stage reverberant echo
      const boomOsc = ctx.createOscillator();
      boomOsc.type = 'triangle';
      // Pitch drop from 125 Hz down to 38 Hz (acoustic Doppler of thunder peal)
      boomOsc.frequency.setValueAtTime(125, now);
      boomOsc.frequency.exponentialRampToValueAtTime(38, now + 1.2);

      const boomFilter = ctx.createBiquadFilter();
      boomFilter.type = 'lowpass';
      boomFilter.frequency.value = 260;

      const boomGain = ctx.createGain();
      boomGain.gain.setValueAtTime(0.001, now);
      // Surge 1: Initial explosive boom
      boomGain.gain.linearRampToValueAtTime(val * 0.92, now + 0.08);
      boomGain.gain.linearRampToValueAtTime(val * 0.48, now + 0.65);
      // Surge 2: Secondary rolling wave (rebound from cloud layer)
      boomGain.gain.linearRampToValueAtTime(val * 0.72, now + 1.25);
      boomGain.gain.linearRampToValueAtTime(val * 0.36, now + 2.2);
      // Surge 3: Gentle trailing rumble
      boomGain.gain.linearRampToValueAtTime(val * 0.22, now + 3.1);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 4.9);

      boomOsc.connect(boomFilter);
      boomFilter.connect(boomGain);
      boomGain.connect(masterGain || ctx.destination);
      boomOsc.start(now);
      boomOsc.stop(now + 5.0);

      // Clean up nodes after decay
      setTimeout(() => {
        try {
          crackleSrc.disconnect();
          crackleFilter.disconnect();
          crackleGain.disconnect();
          boomOsc.disconnect();
          boomFilter.disconnect();
          boomGain.disconnect();
        } catch (_) {}
      }, 5200);
    },

    setRain(val) {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      this.init(ctx);
      if (this.rainGain && ctx) {
        this.rainGain.gain.linearRampToValueAtTime(val * 0.55, ctx.currentTime + 0.1);
      }
    },

    setThunder(val) {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      this.init(ctx);

      const prevVal = this.currentThunderVal;
      this.currentThunderVal = val;

      if (this.thunderGain && ctx) {
        // Continuous rolling rumble bed volume
        this.thunderGain.gain.linearRampToValueAtTime(val * 0.75, ctx.currentTime + 0.1);
      }

      // Clear any pending recurring thunder timer
      if (this.thunderStrikeTimer) {
        clearTimeout(this.thunderStrikeTimer);
        this.thunderStrikeTimer = null;
      }

      if (val > 0.02) {
        // If slider was just increased, fire an immediate thunderclap for instant feedback!
        if (val > prevVal + 0.08 || prevVal <= 0.02) {
          this.triggerThunderStrike(val);
        }

        // Schedule periodic realistic rolling thunderclaps every 6-9 seconds
        const scheduleNextThunder = () => {
          if (this.currentThunderVal <= 0.02) return;
          const nextInterval = 6000 + Math.random() * 4500;
          this.thunderStrikeTimer = setTimeout(() => {
            if (this.currentThunderVal > 0.02) {
              // Vary intensity slightly for realism
              const strikeVol = this.currentThunderVal * (0.75 + Math.random() * 0.35);
              this.triggerThunderStrike(strikeVol);
              scheduleNextThunder();
            }
          }, nextInterval);
        };

        scheduleNextThunder();
      }
    },

    setVinyl(val) {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      this.init(ctx);
      if (this.vinylGain && ctx) {
        this.vinylGain.gain.linearRampToValueAtTime(val * 0.35, ctx.currentTime + 0.1);
      }
    }
  };

  // ── Global Interface ─────────────────────────────────────────────────────────
  window.DarkSenseAudioEngine = {
    getAudioCtx,
    getAnalyser: () => analyser,
    isPlaying: () => false,
    toggle: () => false,
    startSynth: () => {},
    stopSynth: () => {},
    Soundscape,
    playHeartbeat: () => {} // Silent no-op per removal of audio resonance
  };
})();
