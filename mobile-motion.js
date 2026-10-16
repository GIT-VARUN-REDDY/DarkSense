/**
 * DARKSENSE — Mobile Gyroscope & Accelerometer Interaction Engine
 * Translates mobile device orientation (gyroscope tilt) and acceleration (inertia/shake)
 * into high-precision, organic 3D particle physics, camera parallax, and ambient lighting,
 * matching and elevating the PC cursor interaction experience.
 */

(function () {
  'use strict';

  // Sensor state
  let isSupported = false;
  let hasPermission = false;
  let isActive = false;

  // Raw & Smoothed Orientation
  let targetTiltX = 0; // -1.0 to 1.0 (left/right gamma)
  let targetTiltY = 0; // -1.0 to 1.0 (forward/backward beta)
  let curTiltX = 0;
  let curTiltY = 0;

  // Acceleration & Shake
  let smoothedAccelX = 0;
  let smoothedAccelY = 0;
  let lastShakeTime = 0;

  // Calibration: natural holding angle for handheld phone is ~45deg
  const RESTING_BETA = 45;
  const TILT_RANGE_GAMMA = 30; // deg for full -1 to 1 reach
  const TILT_RANGE_BETA = 25;  // deg for full -1 to 1 reach

  let rafId = null;

  function init() {
    if (typeof window === 'undefined') return;

    if ('DeviceOrientationEvent' in window || 'DeviceMotionEvent' in window) {
      isSupported = true;
    }

    // iOS 13+ requires explicit permission via user gesture
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const requestIOSPermission = () => {
        try {
          DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
              if (permissionState === 'granted') {
                hasPermission = true;
                startListening();
              }
            })
            .catch(err => {
              console.warn('[DarkSense Motion] Permission error:', err);
            });
        } catch (e) {}
      };

      // Listen on first user touch or click anywhere on the page
      window.addEventListener('touchstart', requestIOSPermission, { once: true, passive: true });
      window.addEventListener('click', requestIOSPermission, { once: true });
    } else if (isSupported) {
      // Android / standard mobile browsers: start immediately
      hasPermission = true;
      startListening();
    }
  }

  function startListening() {
    if (isActive) return;
    isActive = true;

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    window.addEventListener('devicemotion', handleMotion, { passive: true });

    if (!rafId) {
      rafId = requestAnimationFrame(updateLoop);
    }
  }

  function handleOrientation(e) {
    if (document.hidden) return;

    let gamma = e.gamma; // -90 to 90
    let beta = e.beta;   // -180 to 180

    if (gamma === null || beta === null || typeof gamma === 'undefined' || typeof beta === 'undefined') return;

    // Compensate for screen orientation (portrait vs landscape)
    let angle = 0;
    if (typeof window.orientation === 'number') {
      angle = window.orientation;
    } else if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
      angle = window.screen.orientation.angle;
    }

    if (angle === 90) {
      const tmp = gamma;
      gamma = beta;
      beta = -tmp;
    } else if (angle === -90 || angle === 270) {
      const tmp = gamma;
      gamma = -beta;
      beta = tmp;
    } else if (angle === 180) {
      gamma = -gamma;
      beta = -beta;
    }

    // Normalize relative to natural resting angle
    const normX = Math.max(-1, Math.min(1, gamma / TILT_RANGE_GAMMA));
    const normY = Math.max(-1, Math.min(1, (beta - RESTING_BETA) / TILT_RANGE_BETA));

    targetTiltX = normX;
    targetTiltY = normY;
  }

  function handleMotion(e) {
    if (document.hidden) return;

    const acc = e.acceleration || e.accelerationIncludingGravity;
    if (!acc) return;

    const ax = acc.x || 0;
    const ay = acc.y || 0;
    const az = (acc.z || 0) - (e.acceleration ? 0 : 9.8); // Strip 1G gravity if includingGravity

    smoothedAccelX += (ax - smoothedAccelX) * 0.2;
    smoothedAccelY += (ay - smoothedAccelY) * 0.2;

    // Shake / sudden acceleration impulse detection
    const mag = Math.sqrt(ax * ax + ay * ay + az * az);
    const now = Date.now();

    if (mag > 13.5 && (now - lastShakeTime > 1100)) {
      lastShakeTime = now;
      onDeviceShakeImpulse(mag);
    }
  }

  function onDeviceShakeImpulse(magnitude) {
    // 1. Cosmic particle ripple across Three.js starfield
    if (typeof window.triggerCosmicRipple === 'function') {
      window.triggerCosmicRipple();
    }

    // 2. Play subtle haptic feedback if supported
    if (navigator.vibrate) {
      try {
        navigator.vibrate(18);
      } catch (err) {}
    }

    // 3. Play cosmic chime if audio engine ready
    if (window.AudioEngine && typeof window.AudioEngine.playChime === 'function') {
      window.AudioEngine.playChime('pill');
    }
  }

  function updateLoop() {
    rafId = requestAnimationFrame(updateLoop);

    if (document.hidden) return;

    // Exponential smoothing (damping = 0.12 for fluid organic response without sensor jitter)
    curTiltX += (targetTiltX - curTiltX) * 0.12;
    curTiltY += (targetTiltY - curTiltY) * 0.12;

    // Dispatch to Sub-systems:

    // 1. Three.js Cosmic Starfield & Camera Parallax on Landing Page
    if (typeof window.setLandingGyroTilt === 'function') {
      window.setLandingGyroTilt(curTiltX, curTiltY);
    }

    // 2. 3D Stage Viewport & Floating 3D Particles in Chamber Stage
    if (typeof window.setStageGyroTilt === 'function') {
      window.setStageGyroTilt(curTiltX, curTiltY);
    }

    // 3. Background Animated Gradient Mesh Canvas
    if (typeof window.setMeshGyroTilt === 'function') {
      window.setMeshGyroTilt(curTiltX, curTiltY);
    }

    // 4. Hero Typography Parallax in Enhancements
    if (typeof window.setHeroGyroTilt === 'function') {
      window.setHeroGyroTilt(curTiltX, curTiltY);
    }

    // 5. Update CSS custom properties on document for 3D CSS particles
    const root = document.documentElement;
    root.style.setProperty('--gyro-x', curTiltX.toFixed(3));
    root.style.setProperty('--gyro-y', curTiltY.toFixed(3));
    root.style.setProperty('--gyro-tilt', `${(curTiltX * 8).toFixed(2)}deg`);
  }

  // Initialize on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for external diagnostics or triggers
  window.DarkSenseMotion = {
    isSupported: () => isSupported,
    isActive: () => isActive,
    getTilt: () => ({ x: curTiltX, y: curTiltY }),
    getAccel: () => ({ x: smoothedAccelX, y: smoothedAccelY }),
    triggerShake: onDeviceShakeImpulse
  };
})();
