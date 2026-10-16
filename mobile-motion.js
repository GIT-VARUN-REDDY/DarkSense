/**
 * DARKSENSE — Resilient Mobile Motion & Gyroscope Engine
 * Translates mobile gyroscope orientation and accelerometer gravity tilt
 * into high-precision, organic 3D particle physics, camera parallax, and ambient lighting.
 * 
 * Features:
 * 1. Dual-Sensor Fusion: deviceorientation + devicemotion (gravity vector fallback)
 * 2. iOS 13+ permission handling with elegant interactive unlock pill
 * 3. Dynamic zero-point calibration (auto-adapts to user's natural holding angle)
 * 4. Responsive filtering without sluggish double-damping
 * 5. Screen orientation compensation (portrait and landscape)
 * 6. Sudden acceleration / shake detection with haptic feedback
 */

(function () {
  'use strict';

  // Sensor state
  let isSupported = false;
  let hasPermission = false;
  let isActive = false;
  let activeProvider = 'none'; // 'orientation', 'gravity', or 'none'

  // Orientation state
  let targetTiltX = 0; // -1.0 to 1.0
  let targetTiltY = 0; // -1.0 to 1.0
  let curTiltX = 0;
  let curTiltY = 0;

  // Calibration: auto-calibrated to initial holding angle
  let restingBeta = null;
  let lastOrientationTimestamp = 0;

  // Accelerometer & Shake state
  let smoothedAccelX = 0;
  let smoothedAccelY = 0;
  let lastShakeTime = 0;

  let pillElement = null;
  let rafId = null;

  function init() {
    if (typeof window === 'undefined') return;

    if ('DeviceOrientationEvent' in window || 'DeviceMotionEvent' in window) {
      isSupported = true;
    }

    const needsIOSPermission = (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    );

    if (needsIOSPermission) {
      createPermissionPill();
      bindGestureActivators();
    } else if (isSupported) {
      hasPermission = true;
      startListening();
    }
  }

  // Create an elegant glass pill for iOS Safari user activation
  function createPermissionPill() {
    if (pillElement || document.getElementById('ds-motion-pill')) return;

    pillElement = document.createElement('button');
    pillElement.id = 'ds-motion-pill';
    pillElement.className = 'ds-motion-pill';
    pillElement.setAttribute('aria-label', 'Enable Gyroscope 3D Depth');
    pillElement.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 3v18M3 12h18"/>
      </svg>
      <span>Enable 3D Gyro Tilt</span>
    `;

    pillElement.addEventListener('click', requestPermissionsDirectly);
    pillElement.addEventListener('touchend', requestPermissionsDirectly);

    // Append once DOM is ready
    if (document.body) {
      document.body.appendChild(pillElement);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.body && !document.getElementById('ds-motion-pill')) {
          document.body.appendChild(pillElement);
        }
      });
    }
  }

  function hidePermissionPill() {
    if (pillElement) {
      pillElement.classList.add('hidden');
      setTimeout(() => {
        if (pillElement && pillElement.parentNode) {
          pillElement.parentNode.removeChild(pillElement);
          pillElement = null;
        }
      }, 500);
    }
  }

  // Fallback: Bind to general tap/click across the page to request permission seamlessly
  function bindGestureActivators() {
    const onUserGesture = (e) => {
      // Don't intercept chat inputs or buttons
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      requestPermissionsDirectly();
    };

    document.addEventListener('touchend', onUserGesture, { passive: true });
    document.addEventListener('click', onUserGesture, { passive: true });
  }

  function requestPermissionsDirectly() {
    if (hasPermission && isActive) {
      hidePermissionPill();
      return;
    }

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            hasPermission = true;
            hidePermissionPill();
            startListening();
            console.log('[DarkSense Motion] iOS DeviceOrientation permission granted.');
          }
        })
        .catch(err => {
          console.warn('[DarkSense Motion] DeviceOrientation request error:', err);
        });
    }

    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            hasPermission = true;
            hidePermissionPill();
            startListening();
          }
        })
        .catch(() => {});
    }
  }

  function startListening() {
    if (isActive) return;
    isActive = true;

    // Listen to standard deviceorientation & Android absolute variants with capture = true
    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);

    // Listen to devicemotion (serves as accelerometer gravity fallback & shake sensor)
    window.addEventListener('devicemotion', handleMotion, true);

    if (!rafId) {
      rafId = requestAnimationFrame(updateLoop);
    }

    console.log('[DarkSense Motion] Listeners attached. Starting 60fps motion loop.');
  }

  // 1. Primary: Gyroscope Orientation Handler
  function handleOrientation(e) {
    if (document.hidden) return;

    let gamma = e.gamma; // Left to right (-90 to 90)
    let beta = e.beta;   // Front to back (-180 to 180)

    if (gamma === null || beta === null || typeof gamma === 'undefined' || typeof beta === 'undefined') {
      return;
    }

    activeProvider = 'orientation';
    lastOrientationTimestamp = Date.now();

    // Auto-calibrate resting angle to initial position
    if (restingBeta === null) {
      restingBeta = beta;
    } else {
      // Gentle drift so re-positioning or sitting up/down naturally re-centers
      restingBeta += (beta - restingBeta) * 0.003;
    }

    // Screen rotation compensation (Portrait vs Landscape)
    let angle = 0;
    if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
      angle = window.screen.orientation.angle;
    } else if (typeof window.orientation === 'number') {
      angle = window.orientation;
    }

    if (angle === 90) {
      const t = gamma; gamma = beta; beta = -t;
    } else if (angle === -90 || angle === 270) {
      const t = gamma; gamma = -beta; beta = t;
    } else if (angle === 180) {
      gamma = -gamma; beta = -beta;
    }

    // Normalize: 22 degrees of tilt reaches full -1.0 to 1.0 range
    const normX = Math.max(-1, Math.min(1, gamma / 22));
    const normY = Math.max(-1, Math.min(1, (beta - restingBeta) / 18));

    targetTiltX = normX;
    targetTiltY = normY;
  }

  // 2. Secondary & Shake: Accelerometer Gravity Fusion
  function handleMotion(e) {
    if (document.hidden) return;

    const acc = e.acceleration || e.accelerationIncludingGravity;
    const accG = e.accelerationIncludingGravity;

    // Shake detection using dynamic acceleration
    if (acc) {
      const ax = acc.x || 0;
      const ay = acc.y || 0;
      const az = (acc.z || 0) - (e.acceleration ? 0 : 9.8);
      const mag = Math.sqrt(ax * ax + ay * ay + az * az);
      const now = Date.now();

      if (mag > 14.0 && (now - lastShakeTime > 1100)) {
        lastShakeTime = now;
        onDeviceShakeImpulse(mag);
      }
    }

    // Fallback: If deviceorientation has not fired in 450ms, derive tilt from Earth's gravity vector!
    const timeSinceOrientation = Date.now() - lastOrientationTimestamp;
    if (accG && (lastOrientationTimestamp === 0 || timeSinceOrientation > 450)) {
      activeProvider = 'gravity';

      const gx = accG.x || 0;
      const gy = accG.y || 0;

      // In portrait: tilt left/right tilts gx between -9.8 and 9.8.
      // Tilting forward/backward tilts gy.
      const normX = Math.max(-1, Math.min(1, gx / 5.5));
      const normY = Math.max(-1, Math.min(1, (gy - 6.0) / 5.0));

      targetTiltX = normX;
      targetTiltY = normY;
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
        navigator.vibrate(22);
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

    // Smooth responsive lerp (0.22 factor provides instant, fluid response without sensor tremor)
    curTiltX += (targetTiltX - curTiltX) * 0.22;
    curTiltY += (targetTiltY - curTiltY) * 0.22;

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
    root.style.setProperty('--gyro-tilt', `${(curTiltX * 12).toFixed(2)}deg`);
  }

  // Initialize immediately or on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public diagnostics and testing API
  window.DarkSenseMotion = {
    isSupported: () => isSupported,
    isActive: () => isActive,
    hasPermission: () => hasPermission,
    getProvider: () => activeProvider,
    getTilt: () => ({ x: curTiltX, y: curTiltY }),
    getStatus: () => ({
      supported: isSupported,
      active: isActive,
      permission: hasPermission,
      provider: activeProvider,
      tiltX: curTiltX.toFixed(3),
      tiltY: curTiltY.toFixed(3),
      restingBeta: restingBeta ? restingBeta.toFixed(1) : null
    }),
    requestPermission: requestPermissionsDirectly,
    triggerShake: onDeviceShakeImpulse
  };
})();
