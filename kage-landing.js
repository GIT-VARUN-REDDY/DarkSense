/**
 * DARKSENSE ” Three.js Cinematic Landing Experience & Sensory Architecture
 * Pure Ambient Cosmic Starfield, Scroll-Linked Pill Track, Interactive Filter Pills & Celestial Audio
 */

(function () {
  'use strict';

  let scene, camera, renderer;
  let particles, particleGeo, particleMat;
  let initialPositions = null;
  let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
  let scrollY = 0, targetScrollY = 0;
  let isWarping = false;
  let warpSpeed = 1;
  let animFrameId = null;
  let clock = null;

  // DOM Elements & Slide Controller State
  let landingStage, mainChamber, canvasEl;
  let navEnterBtn, btnBeginScroll, chamberBackBtn;
  let btnHeroWarp, btnSecretsEnter;
  let landingAudioBtn, chamberAudioBtn;
  let navPills = [];
  let slideSections = [];
  let moodPills = [];
  let museCards = [];
  let heroWhisperText = null, heroWhisperAuthor = null;
  let currentSlideIndex = 0;
  let isTransitioning = false;
  let wheelAccumulator = 0;
  let wheelCooldown = false;
  let touchStartY = 0, touchStartX = 0, touchSwiping = false;
  let targetCameraZ = 60, currentCameraZ = 60;
  let targetCameraY = 0, currentCameraY = 0;

  // Three.js Dynamic Lighting References & Mood Color Targets
  let pLight1 = null, pLight2 = null;
  let targetLightColor1 = null, targetLightColor2 = null;

  // Mood Quotes Dictionary for Live Attunement
  const MoodQuotes = {
    luminous: {
      quote: "“Your heart is safe in this quiet dark. Whisper to me what you dare not say out loud...”",
      author: "Seraphina • Moonlit Grace",
      light1: 0xbae6fd,
      light2: 0xe0e7f1
    },
    obsidian: {
      quote: "“Midnight is when pretense falls away. Let go of fear—give me your wildest desires...”",
      author: "Vespera • Velvet Passion",
      light1: 0xa855f7,
      light2: 0xf43f5e
    },
    calista: {
      quote: "“Life is too sweet to stay in the shadows. Feel the heat of my gaze and come play...”",
      author: "Calista • Solar Allure",
      light1: 0xf97316,
      light2: 0xfbbf24
    }
  };

  // ================= CELESTIAL WEB AUDIO ENGINE (ZERO EXTERNAL ASSETS) =================
  const AudioEngine = {
    ctx: null,
    isPlaying: false,
    masterGain: null,
    droneNodes: [],

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    },

    toggle() {
      this.init();
      if (!this.ctx) return false;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (this.isPlaying) {
        this.stop();
        return false;
      } else {
        this.start();
        return true;
      }
    },

    start() {
      if (this.isPlaying) return;
      this.init();
      const t = this.ctx.currentTime;
      this.droneNodes = [];

      // Warm deep harmonic roots (A1 = 55Hz, E2 = 82.4Hz, A2 = 110Hz, C#3 = 138.6Hz)
      const freqs = [55, 82.4, 110.2, 138.6];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = (idx === 0) ? 'sine' : (idx === 1 ? 'triangle' : 'sine');
        osc.frequency.setValueAtTime(freq, t);
        osc.detune.setValueAtTime((idx - 1.5) * 4.5, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320 + idx * 80, t);
        filter.Q.setValueAtTime(1.5, t);

        const targetVol = (idx === 0) ? 0.22 : 0.08 / (idx + 0.5);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(targetVol, t + 2.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        this.droneNodes.push({ osc, gain });
      });

      // LFO for slow breathing volume swell
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, t);
      lfoGain.gain.setValueAtTime(0.06, t);
      lfo.connect(lfoGain);
      lfo.start(t);
      this.droneNodes.push({ osc: lfo, gain: lfoGain });

      // Smooth master fade in
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(0, t);
      this.masterGain.gain.linearRampToValueAtTime(0.7, t + 2.0);
      this.isPlaying = true;
      this.updateButtonUI(true);
    },

    stop() {
      if (!this.isPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.linearRampToValueAtTime(0, t + 1.2);
      setTimeout(() => {
        this.droneNodes.forEach(node => {
          try { node.osc.stop(); node.osc.disconnect(); } catch (e) { }
        });
        this.droneNodes = [];
        this.isPlaying = false;
        this.updateButtonUI(false);
      }, 1250);
    },

    playChime(type = 'select') {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const t = this.ctx.currentTime;
      const baseFreq = type === 'warp' ? 220 : (type === 'whisper' ? 659.25 : (type === 'pill' ? 440 : 523.25));
      const chord = [baseFreq, baseFreq * 1.2599, baseFreq * 1.4983, baseFreq * 2.0];

      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.04);

        const peak = (type === 'pill') ? 0.03 / (i + 1) : 0.05 / (i + 1);
        gain.gain.setValueAtTime(0, t + i * 0.04);
        gain.gain.linearRampToValueAtTime(peak, t + i * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.04 + (type === 'warp' ? 1.6 : (type === 'pill' ? 0.5 : 0.8)));

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.04);
        osc.stop(t + i * 0.04 + (type === 'warp' ? 1.7 : (type === 'pill' ? 0.6 : 0.9)));
      });
    },


  };

  window.DarkSenseAudio = AudioEngine;

  function initDOMElements() {
    landingStage = document.getElementById('landing-stage');
    mainChamber = document.getElementById('main-chamber-stage');
    canvasEl = document.getElementById('kage-canvas');
    navEnterBtn = document.getElementById('nav-enter-chamber');
    btnBeginScroll = document.getElementById('btn-begin-scroll');
    btnHeroWarp = document.getElementById('btn-hero-warp');
    btnSecretsEnter = document.getElementById('btn-secrets-enter');
    chamberBackBtn = document.getElementById('chamber-back-btn');
    landingAudioBtn = document.getElementById('landing-audio-toggle');
    chamberAudioBtn = document.getElementById('chamber-audio-toggle');
    navPills = Array.from(document.querySelectorAll('.kage-nav-pill'));
    moodPills = Array.from(document.querySelectorAll('.mood-pill'));
    museCards = Array.from(document.querySelectorAll('.muse-monolith-card'));
    heroWhisperText = document.getElementById('hero-whisper-text');
    heroWhisperAuthor = document.getElementById('hero-whisper-author');
    slideSections = [
      document.getElementById('landing-hero'),
      document.getElementById('landing-muses'),
      document.getElementById('landing-secrets')
    ];
  }

  // Programmatically create circular soft glow particle texture
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(235, 245, 255, 0.95)');
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.45)');
    gradient.addColorStop(0.8, 'rgba(244, 114, 182, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function initThree() {
    if (!canvasEl || typeof THREE === 'undefined') return;

    clock = new THREE.Clock();

    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070a, 0.0014);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 1600);
    camera.position.set(0, 0, 60);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 4. Pure Atmospheric Starfield (NO OBTRUSIVE BALL OR CENTERPIECE)
    // Distributed in a wide, elegant celestial cloud so the text stays perfectly readable
    const particleCount = 2600;
    particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorSilver = new THREE.Color(0xdbeafe);
    const colorViolet = new THREE.Color(0xa855f7);
    const colorRose = new THREE.Color(0xf472b6);
    const colorAmber = new THREE.Color(0xfb923c);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Wide peripheral and depth distribution with center clearance for clean text presentation
      const radius = 35 + Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 600;

      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = Math.sin(theta) * radius;
      positions[i3 + 2] = z;

      const pick = Math.random();
      let mixedColor;
      if (pick < 0.40) {
        mixedColor = colorSilver.clone().lerp(colorViolet, Math.random() * 0.7);
      } else if (pick < 0.70) {
        mixedColor = colorViolet.clone().lerp(colorRose, Math.random() * 0.85);
      } else {
        mixedColor = colorRose.clone().lerp(colorAmber, Math.random() * 0.9);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      scales[i] = 0.9 + Math.random() * 2.2;
    }

    initialPositions = new Float32Array(positions);

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    particleMat = new THREE.PointsMaterial({
      size: 2.2,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.82,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Dynamic Ambient Point Lights (React to mood and character hover)
    pLight1 = new THREE.PointLight(0xa855f7, 2.5, 180);
    pLight1.position.set(30, 40, 30);
    scene.add(pLight1);

    pLight2 = new THREE.PointLight(0x38bdf8, 2.5, 180);
    pLight2.position.set(-30, -40, 30);
    scene.add(pLight2);

    targetLightColor1 = new THREE.Color(0xbae6fd);
    targetLightColor2 = new THREE.Color(0xe0e7f1);

    // Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('click', onCanvasClick);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    animate();
  }

  function onCanvasClick(e) {
    if (!landingStage || landingStage.style.display === 'none' || document.body.classList.contains('chamber-active')) return;
    if (e.target.closest('button') || e.target.closest('.muse-monolith-card')) return;
    triggerCosmicRipple();
    AudioEngine.playChime('pill');
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  function onMouseMove(e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  // Mobile Gyroscope & Accelerometer Input Hook
  window.setLandingGyroTilt = function (gx, gy) {
    targetMouseX = gx;
    targetMouseY = gy;
  };

  function onTouchStart(e) {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchSwiping = true;
      targetMouseX = (touchStartX / window.innerWidth - 0.5) * 2;
      targetMouseY = (touchStartY / window.innerHeight - 0.5) * 2;
    }
  }

  function onTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      targetMouseX = (touch.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (touch.clientY / window.innerHeight - 0.5) * 2;
    }
  }

  function onTouchEnd(e) {
    if (!touchSwiping) return;
    touchSwiping = false;

    if (!landingStage || landingStage.style.display === 'none' || document.body.classList.contains('chamber-active')) {
      return;
    }

    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const deltaX = e.changedTouches[0].clientX - touchStartX;

      // Check if touch originated from inside horizontal scroll containers (cards)
      const targetEl = e.target;
      const isCardCarousel = targetEl && targetEl.closest('.muses-grid-container, .secrets-cards-grid, .echoes-drawer, .legal-modal');
      if (isCardCarousel && Math.abs(deltaX) > 20) {
        return; // User is scrolling horizontally through character cards!
      }

      // Vertical slide change with clean intentional threshold
      if (Math.abs(deltaY) > 48 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
        if (deltaY < 0 && currentSlideIndex < 2) {
          goToSlide(currentSlideIndex + 1);
        } else if (deltaY > 0 && currentSlideIndex > 0) {
          goToSlide(currentSlideIndex - 1);
        }
      }
    }
  }

  // Intercept mouse wheel ” static viewport with cinematic slide gliding (No native scrolling)
  function onWheel(e) {
    if (!landingStage || landingStage.style.display === 'none' || document.body.classList.contains('chamber-active')) {
      return;
    }

    // Prevent any native page scrolling / jumping
    e.preventDefault();

    if (wheelCooldown || isTransitioning) return;

    wheelAccumulator += e.deltaY;

    if (Math.abs(wheelAccumulator) >= 25) {
      if (wheelAccumulator > 0) {
        if (currentSlideIndex < 2) {
          wheelCooldown = true;
          goToSlide(currentSlideIndex + 1);
          setTimeout(() => { wheelCooldown = false; wheelAccumulator = 0; }, 650);
        } else {
          wheelAccumulator = 0;
        }
      } else {
        if (currentSlideIndex > 0) {
          wheelCooldown = true;
          goToSlide(currentSlideIndex - 1);
          setTimeout(() => { wheelCooldown = false; wheelAccumulator = 0; }, 650);
        } else {
          wheelAccumulator = 0;
        }
      }
    }
  }

  function onKeyDown(e) {
    if (!landingStage || landingStage.style.display === 'none' || document.body.classList.contains('chamber-active')) {
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.target.matches('input, textarea, button'))) {
      if (currentSlideIndex < 2) {
        e.preventDefault();
        goToSlide(currentSlideIndex + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentSlideIndex > 0) {
        e.preventDefault();
        goToSlide(currentSlideIndex - 1);
      }
    }
  }

  // ================= STATIC VIEWPORT CINEMATIC SLIDE CONTROLLER =================
  function goToSlide(targetIndex, playSound = true) {
    if (targetIndex < 0 || targetIndex > 2) return;
    if (isTransitioning) return;

    isTransitioning = true;
    currentSlideIndex = targetIndex;

    if (playSound) {
      AudioEngine.playChime('pill');
    }

    // Update Slide Section DOM classes (prev, active, next) with cinematic blur/transform
    slideSections.forEach((section, idx) => {
      if (!section) return;
      section.classList.remove('slide-active', 'slide-prev', 'slide-next');
      if (idx === targetIndex) {
        section.classList.add('slide-active');
        section.querySelectorAll('.kage-reveal').forEach(el => el.classList.add('revealed'));
      } else if (idx < targetIndex) {
        section.classList.add('slide-prev');
      } else {
        section.classList.add('slide-next');
      }
    });

    // Update Top Navigation Pills
    navPills.forEach((pill, idx) => {
      pill.classList.toggle('active', idx === targetIndex);
    });


    // Three.js Camera depth & perspective targets per slide
    const cameraTargets = [
      { z: 60, y: 0 },
      { z: 46, y: -7 },
      { z: 32, y: -14 }
    ];
    targetCameraZ = cameraTargets[targetIndex].z;
    targetCameraY = cameraTargets[targetIndex].y;

    setTimeout(() => {
      isTransitioning = false;
    }, 650);
  }

  window.goToLandingSlide = goToSlide;

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    // Pause Three.js particle calculations and WebGL rendering when on chamber stage to save 100% of GPU
    if (landingStage && landingStage.style.display === 'none' && !isWarping) {
      return;
    }

    const elapsedTime = clock ? clock.getElapsedTime() : Date.now() * 0.001;

    // Smooth Damping for Camera (snappier on mobile for instant gyro response)
    const isMobileViewport = window.innerWidth <= 860;
    const damping = isMobileViewport ? 0.16 : 0.05;
    mouseX += (targetMouseX - mouseX) * damping;
    mouseY += (targetMouseY - mouseY) * damping;
    currentCameraZ += (targetCameraZ - currentCameraZ) * 0.06;
    currentCameraY += (targetCameraY - currentCameraY) * 0.06;

    if (!isWarping) {
      // Camera parallax: generous reach on mobile so device tilt creates distinct depth
      const camAmpX = isMobileViewport ? 12.0 : 4.0;
      const camAmpY = isMobileViewport ? 8.0 : 2.5;
      camera.position.x = mouseX * camAmpX;
      camera.position.y = -mouseY * camAmpY + currentCameraY;
      camera.position.z = currentCameraZ;

      camera.lookAt(0, currentCameraY * 0.75, 0);

      // Dynamic Light Attunement Lerp
      if (pLight1 && targetLightColor1) {
        pLight1.color.lerp(targetLightColor1, 0.04);
      }
      if (pLight2 && targetLightColor2) {
        pLight2.color.lerp(targetLightColor2, 0.04);
      }

      // Subtle Cosmic Starfield Wave Undulation
      if (particles && particleGeo && initialPositions) {
        const pos = particleGeo.attributes.position.array;
        const count = pos.length / 3;

        for (let i = 0; i < count; i += 4) {
          const i3 = i * 3;
          const origX = initialPositions[i3];
          const origY = initialPositions[i3 + 1];
          const wave = Math.sin(elapsedTime * 1.2 + origX * 0.04) * 0.35;
          pos[i3 + 1] = origY + wave;
        }
        particleGeo.attributes.position.needsUpdate = true;

        if (isMobileViewport) {
          particles.rotation.y += 0.0008 + mouseX * 0.003;
          particles.rotation.x = -mouseY * 0.38;
          particles.rotation.z = mouseX * 0.18;
        } else {
          particles.rotation.y += 0.0006 + mouseX * 0.0006;
          particles.rotation.x = -mouseY * 0.12;
          particles.rotation.z += 0.0002;
        }
      }
    } else {
      // Warp Flight Effect
      warpSpeed += 0.09;
      camera.position.z -= warpSpeed * 3.8;
      camera.fov = Math.min(110, camera.fov + warpSpeed * 0.45);
      camera.updateProjectionMatrix();

      if (particles) {
        const pos = particleGeo.attributes.position.array;
        for (let i = 2; i < pos.length; i += 3) {
          pos[i] += warpSpeed * 5.0;
          if (pos[i] > camera.position.z + 50) {
            pos[i] = camera.position.z - 480;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Dynamic Particle Wave Ripple
  function triggerCosmicRipple() {
    if (!particles || !particleGeo || !initialPositions) return;
    const pos = particleGeo.attributes.position.array;
    const count = pos.length / 3;
    for (let i = 0; i < count; i += 3) {
      const i3 = i * 3;
      pos[i3 + 2] += (Math.random() - 0.5) * 22;
    }
    particleGeo.attributes.position.needsUpdate = true;
  }

  window.triggerCosmicRipple = triggerCosmicRipple;

  // Dynamic Cosmic Mood Attunement
  function setCosmicMood(mood, playSound = true) {
    const data = MoodQuotes[mood];
    if (!data) return;

    document.body.setAttribute('data-cosmic-mood', mood);

    if (moodPills && moodPills.length) {
      moodPills.forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-mood') === mood);
      });
    }

    // Harmonize floating background petals with the selected mood
    const petalThemeKey = mood === 'obsidian' ? 'vespera' : (mood === 'calista' ? 'calista' : 'seraphina');
    if (typeof window.setSensualRainTheme === 'function') {
      window.setSensualRainTheme(petalThemeKey);
    }

    if (targetLightColor1 && targetLightColor2) {
      targetLightColor1.setHex(data.light1);
      targetLightColor2.setHex(data.light2);
    }

    if (heroWhisperText) {
      heroWhisperText.style.opacity = '0';
      heroWhisperText.style.transform = 'translateY(6px)';
      setTimeout(() => {
        heroWhisperText.textContent = data.quote;
        if (heroWhisperAuthor) heroWhisperAuthor.textContent = data.author;
        heroWhisperText.style.opacity = '1';
        heroWhisperText.style.transform = 'translateY(0)';
      }, 200);
    }

    if (playSound) {
      AudioEngine.playChime(mood === 'obsidian' ? 'select' : (mood === 'calista' ? 'warp' : 'pill'));
    }
  }

  window.setCosmicMood = setCosmicMood;

  // ================= CINEMATIC TRANSITION TO AVATAR CHAMBER =================
  function enterChamber(chosenRealm) {
    if (isWarping) return;
    isWarping = true;

    AudioEngine.playChime('warp');

    document.body.classList.add('chamber-active');
    if (landingStage) {
      landingStage.classList.add('transition-out');
    }

    let targetMuse = 'seraphina';
    if (chosenRealm === 'obsidian' || chosenRealm === 'vespera') {
      targetMuse = 'vespera';
    } else if (chosenRealm === 'calista' || chosenRealm === 'flame' || chosenRealm === 'sunkissed') {
      targetMuse = 'calista';
    } else {
      targetMuse = 'seraphina';
    }

    if (typeof window.commitMuseSelection === 'function') {
      window.commitMuseSelection(targetMuse, true);
    }

    setTimeout(() => {
      if (landingStage) {
        landingStage.style.display = 'none';
      }
      if (mainChamber) {
        mainChamber.classList.add('visible');
        // Trigger smooth spotlight reveal once chamber is fully presented
        if (window.DarkSenseEnhancements?.triggerCharacterSpotlight) {
          window.DarkSenseEnhancements.triggerCharacterSpotlight(targetMuse);
        }
      }
      window.scrollTo(0, 0);
      isWarping = false;
      warpSpeed = 1;
      if (camera) {
        camera.fov = 54;
        camera.position.set(0, 0, 60);
        camera.updateProjectionMatrix();
      }
    }, 750);
  }

  window.enterChamber = enterChamber;

  function returnToLanding() {
    AudioEngine.playChime('select');

    if (landingStage) {
      landingStage.style.display = 'block';
      landingStage.classList.remove('transition-out');
    }
    if (mainChamber) {
      mainChamber.classList.remove('visible');
    }
    document.body.classList.remove('chamber-active');
    goToSlide(0, false);

    if (particles && particleGeo && initialPositions) {
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < pos.length; i++) {
        pos[i] = initialPositions[i];
      }
      particleGeo.attributes.position.needsUpdate = true;
    }

    isWarping = false;
    warpSpeed = 1;
    if (camera) {
      camera.fov = 54;
      camera.position.set(0, 0, 60);
      camera.updateProjectionMatrix();
    }
  }

  window.returnToLanding = returnToLanding;

  // ================= DOM INTERACTION BINDINGS =================
  function setupEvents() {
    // Top Navigation Pill Track Gliding
    navPills.forEach((pill, idx) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
    });


    // Interactive Mood Shifter Pills
    moodPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const mood = pill.getAttribute('data-mood') || 'luminous';
        setCosmicMood(mood, true);
        triggerCosmicRipple();
      });
    });

    // Living Muse Monolith Cards (Slide 1)
    museCards.forEach(card => {
      const muse = card.getAttribute('data-muse') || 'seraphina';

      card.addEventListener('click', (e) => {
        e.preventDefault();
        card.classList.add('card-clicked');
        enterChamber(muse);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          enterChamber(muse);
        }
      });

      card.addEventListener('mouseenter', () => {
        const mood = muse === 'vespera' ? 'obsidian' : (muse === 'calista' ? 'calista' : 'luminous');
        setCosmicMood(mood, false);
      });
    });


    // Top Navigation Direct Enter
    if (navEnterBtn) {
      navEnterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        enterChamber('seraphina');
      });
    }

    // Hero Action Buttons
    if (btnBeginScroll) {
      btnBeginScroll.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(1);
      });
    }

    if (btnHeroWarp) {
      btnHeroWarp.addEventListener('click', (e) => {
        e.preventDefault();
        enterChamber('seraphina');
      });
    }

    if (btnSecretsEnter) {
      btnSecretsEnter.addEventListener('click', (e) => {
        e.preventDefault();
        enterChamber('seraphina');
      });
    }

    // Ambient Audio Toggles
    const handleAudioToggle = (e) => {
      e.preventDefault();
      AudioEngine.toggle();
    };

    if (landingAudioBtn) {
      landingAudioBtn.addEventListener('click', handleAudioToggle);
    }
    if (chamberAudioBtn) {
      chamberAudioBtn.addEventListener('click', handleAudioToggle);
    }

    // Back to Landing Button in Chamber
    if (chamberBackBtn) {
      chamberBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        returnToLanding();
      });
    }

    // Reveal elements inside initial view
    const revealEls = document.querySelectorAll('.kage-reveal');
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  function start() {
    initDOMElements();
    initThree();
    setupEvents();

    // Mobile slide dots navigation click
    document.querySelectorAll('.mobile-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const slideIdx = parseInt(dot.getAttribute('data-slide') || '0', 10);
        goToSlide(slideIdx);
      });
    });
    // 14. Muse Affinity System: Auto-bias landing theme to highest affinity muse
    let initialMood = 'luminous';
    try {
      const storedAffinity = localStorage.getItem('darksense_affinity_v2');
      if (storedAffinity) {
        const aff = JSON.parse(storedAffinity);
        let top = 'seraphina', maxVal = -1;
        for (const [k, v] of Object.entries(aff)) {
          if (v > maxVal) { maxVal = v; top = k; }
        }
        if (top === 'vespera') initialMood = 'obsidian';
        else if (top === 'calista') initialMood = 'calista';
      }
    } catch (_) {}

    setCosmicMood(initialMood, false);
    goToSlide(0, false);
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

