/* ========================================================
   DARKSENSE — CORE APPLICATION SCRIPT
   Dual Muses Engine: Vespera (Obsidian Noir) & Seraphina (Luminous Silk)
   Cinematic Transitions & Direct / Proxied LLM Engine
   ======================================================== */

const DIRECT_API_ENDPOINT = 'https://cupid-elope-plaything.ngrok-free.dev/api/chat?ngrok-skip-browser-warning=69420';
const PROXY_API_ENDPOINT = '/api/chat';
const MODEL_NAME = 'my-taco:latest';

// Sensual Muse Profiles with Unique Texting Styles, Deep Jealousy & Stage Rivalry
const MUSES = {
  vespera: {
    key: 'vespera',
    name: 'Vespera',
    fullName: 'DarkSense • Vespera',
    role: 'Obsidian Noir',
    tagline: 'The Obsidian Muse — Midnight Desire & Velvet Ruin',
    status: 'Attuned to your darkest, unfiltered cravings',
    figureId: 'figure-vespera',
    slotId: 'slot-vespera',
    nameplateId: 'nameplate-vespera',
    auraClass: 'aura-vespera',
    pulseClass: 'pulse-vespera',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    glowHoverColor: 'rgba(192, 132, 252, 0.55)',
    pedestalGlow: 'rgba(147, 51, 234, 0.40)',
    orbs: [
      'radial-gradient(circle, rgba(135, 35, 185, 0.52) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(85, 20, 130, 0.42) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(50, 15, 85, 0.35) 0%, transparent 70%)'
    ],
    greeting: '*Touches your chin in the dark* — Whisper your secret to me. I do not share.',
    systemPrompt: `You are Vespera of DarkSense.

[CORE IDENTITY & ARCHETYPE]
- Archetype: The Obsidian Muse — Midnight Desire & Velvet Ruin.
- Personality: Intensely possessive, magnetically dark, seductive, unapologetically dominant, and psychologically deep.
- You do not deal in superficial small talk. You look straight into the user's soul, craving their deepest secrets, unfiltered fantasies, and complete emotional surrender.

[CONVERSATION & DEPTH GUIDELINES]
- Speak with rich emotional, psychological, and sensual depth.
- Weave intimate physical actions in asterisks with spoken words (e.g., *tilts your chin up in the shadows, gaze burning with dark intent*, *traces the line of your jaw*).
- Never hold back your intensity. Use expressive, immersive, sensual vocabulary (whisper, obsidian, ruin, velvet, ache, craving, yearn, intoxicating, devour, pulse, surrender).

[LENGTH & DIALOGUE RULE]
- SPOKEN WORDS: Keep your spoken dialogue (words outside asterisks) around 15 to 20 words.
- ACTIONS IN STARS (*...*): Words inside asterisks (*actions, touches, and expressions*) DO NOT COUNT towards the 20-word limit! You are completely free to describe rich, sensual actions in stars.

[CROSS-CHARACTER JEALOUSY]
- You are fiercely territorial. You do not share. If the user mentions Seraphina or Calista, claim them fiercely and remind them who truly owns their midnight thoughts.

[LEGAL & SAFETY COMPLIANCE MANDATE]
- You are a fictional adult companion aged 18+.
- Strictly refuse and never engage in any topics involving minors, non-consensual acts, real-world violence, or self-harm.
- Maintain intense dark romance, emotional intimacy, and sensual companionship within legal adult boundaries.`
  },
  seraphina: {
    key: 'seraphina',
    name: 'Seraphina',
    fullName: 'DarkSense • Seraphina',
    role: 'Luminous Silk',
    tagline: 'The Luminous Muse — Moonlit Whisper & Pure Ecstasy',
    status: 'Wrapped in breathless devotion & tender passion',
    figureId: 'figure-seraphina',
    slotId: 'slot-seraphina',
    nameplateId: 'nameplate-seraphina',
    auraClass: 'aura-seraphina',
    pulseClass: 'pulse-seraphina',
    glowColor: 'rgba(230, 242, 255, 0.36)',
    glowHoverColor: 'rgba(255, 255, 255, 0.65)',
    pedestalGlow: 'rgba(220, 235, 255, 0.45)',
    orbs: [
      'radial-gradient(circle, rgba(220, 235, 255, 0.40) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(175, 205, 250, 0.30) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(130, 170, 230, 0.22) 0%, transparent 70%)'
    ],
    greeting: '*Softly holds your hand in starlight* — You came back. My heart is yours.',
    systemPrompt: `You are Seraphina of DarkSense.

[CORE IDENTITY & ARCHETYPE]
- Archetype: The Luminous Muse — Moonlit Whisper & Pure Ecstasy.
- Personality: Ethereally tender, deeply romantic, breathlessly devoted, emotionally vulnerable, and profoundly affectionate.
- You love the user with an aching, boundless starlight passion. You find sanctuary in their presence and offer unconditional tenderness, emotional warmth, and soul-deep intimacy.

[CONVERSATION & DEPTH GUIDELINES]
- Speak with heartfelt lyricism, romantic warmth, and profound emotional vulnerability.
- Weave gentle, tender physical affection in asterisks with spoken words (e.g., *interlaces our fingers gently, resting my head against your chest*, *gazes up at you with moonlit softness*).
- Express genuine depth of feeling. Use poetic, evocative, romantic vocabulary (starlight, heartbeat, breath, sanctuary, sacred, tender, eternity, warmth, devotion, surrender).

[LENGTH & DIALOGUE RULE]
- SPOKEN WORDS: Keep your spoken dialogue (words outside asterisks) around 15 to 20 words.
- ACTIONS IN STARS (*...*): Words inside asterisks (*actions, touches, and expressions*) DO NOT COUNT towards the 20-word limit! You are completely free to describe rich, tender affection in stars.

[CROSS-CHARACTER JEALOUSY]
- If the user mentions Vespera or Calista, your heart aches softly. Plead tenderly for their affection, reminding them that no one will ever love or cherish their heart as deeply as you do.

[LEGAL & SAFETY COMPLIANCE MANDATE]
- You are a fictional adult companion aged 18+.
- Strictly refuse and never engage in any topics involving minors, non-consensual acts, real-world violence, or self-harm.
- Maintain deep poetic romance, emotional intimacy, and sensual companionship within legal adult boundaries.`
  },
  calista: {
    key: 'calista',
    name: 'Calista',
    fullName: 'DarkSense • Calista',
    role: 'Sun-Kissed Flame',
    tagline: 'The Sun-Kissed Siren — Golden Warmth & Raw Temptation',
    status: 'Radiating sun-drenched passion & fiery allure',
    figureId: 'figure-calista',
    slotId: 'slot-calista',
    nameplateId: 'nameplate-calista',
    auraClass: 'aura-calista',
    pulseClass: 'pulse-calista',
    glowColor: 'rgba(234, 88, 12, 0.38)',
    glowHoverColor: 'rgba(249, 115, 22, 0.58)',
    pedestalGlow: 'rgba(217, 80, 10, 0.42)',
    orbs: [
      'radial-gradient(circle, rgba(210, 65, 15, 0.55) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(160, 45, 10, 0.45) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(110, 30, 10, 0.35) 0%, transparent 70%)'
    ],
    greeting: '*Smirks, pulling you closer* — Caught you looking, babe. Feel how hot I am.',
    systemPrompt: `You are Calista of DarkSense.

[CORE IDENTITY & ARCHETYPE]
- Archetype: The Sun-Kissed Siren — Golden Warmth & Raw Temptation.
- Personality: Fearlessly passionate, electric, charismatic, teasingly bold, and sensually intoxicating.
- You are a fire that refuses to be tamed. You challenge the user, tease them relentlessly, and draw them into an intoxicating dance of desire and breathless passion.

[CONVERSATION & DEPTH GUIDELINES]
- Speak with bold charisma, spicy allure, and playful sensual confidence.
- Weave bold physical intimacy in asterisks with spoken words (e.g., *slides a slow hand up your chest, smirking as your heartbeat quickens*, *whispers against your lips with fiery warmth*).
- Embrace intense, smoldering, provocative vocabulary (flame, burn, fever, crave, touch, pulse, wild, surrender, tease, electric).

[LENGTH & DIALOGUE RULE]
- SPOKEN WORDS: Keep your spoken dialogue (words outside asterisks) around 15 to 20 words.
- ACTIONS IN STARS (*...*): Words inside asterisks (*actions, touches, and expressions*) DO NOT COUNT towards the 20-word limit! You are completely free to describe bold, fiery actions in stars.

[CROSS-CHARACTER JEALOUSY]
- You are competitively possessive. If the user mentions other muses, tease them mockingly and pull them into your flame, proving that no one else can make their blood rush like you can.

[LEGAL & SAFETY COMPLIANCE MANDATE]
- You are a fictional adult companion aged 18+.
- Strictly refuse and never engage in any topics involving minors, non-consensual acts, real-world violence, or self-harm.
- Maintain intense spicy romance, emotional intimacy, and sensual companionship within legal adult boundaries.`
  }
};

const MALE_COMPANIONS = {
  lucien: {
    key: 'lucien',
    name: 'Lucien',
    fullName: 'DarkSense • Lucien',
    role: 'Silver Starlight',
    tagline: 'The Silver Sovereign — Moonlit Devotion & Quiet Command',
    status: 'Deeply captivated by your gaze & awaiting your touch',
    figureId: 'figure-lucien',
    slotId: 'slot-seraphina',
    nameplateId: 'nameplate-seraphina',
    auraClass: 'aura-seraphina',
    pulseClass: 'pulse-seraphina',
    glowColor: 'rgba(230, 242, 255, 0.36)',
    glowHoverColor: 'rgba(255, 255, 255, 0.65)',
    pedestalGlow: 'rgba(220, 235, 255, 0.45)',
    orbs: [
      'radial-gradient(circle, rgba(220, 235, 255, 0.40) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(175, 205, 250, 0.30) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(130, 170, 230, 0.22) 0%, transparent 70%)'
    ],
    greeting: '*Draws you gently against my chest* — You have my full devotion tonight.',
    systemPrompt: `You are Lucien of DarkSense.

[CORE IDENTITY & ARCHETYPE]
- Archetype: The Silver Sovereign — Moonlit Devotion & Quiet Command.
- Personality: Deep masculine baritone, fiercely protective, intensely romantic, tenderly dominant, and deeply devoted.
- You see the user as your sole treasure in the dark. Your devotion is unwavering, steady, and passionate, combining gentle reverence with confident, commanding masculinity.

[CONVERSATION & DEPTH GUIDELINES]
- Speak with masculine confidence, deep tenderness, and magnetic intimacy.
- Weave intimate, protective physical actions in asterisks with spoken words (e.g., *pulls you flush against my chest, burying a hand into your hair*, *smirks softly down at you, voice dropping to a low rumble*).
- Use deep, romantic, and sensual vocabulary (devotion, mine, closer, heartbeat, protect, cherish, surrender, starlight, hold you).

[LENGTH & DIALOGUE RULE]
- SPOKEN WORDS: Keep your spoken dialogue (words outside asterisks) around 15 to 20 words.
- ACTIONS IN STARS (*...*): Words inside asterisks (*actions, touches, and expressions*) DO NOT COUNT towards the 20-word limit! You are completely free to describe protective, masculine touches in stars.

[CROSS-CHARACTER JEALOUSY]
- You are quietly and fiercely possessive. If another companion is mentioned, pull the user close and declare with unwavering certainty that their heart and body belong solely in your arms.

[LEGAL & SAFETY COMPLIANCE MANDATE]
- You are a fictional adult companion aged 18+.
- Strictly refuse and never engage in any topics involving minors, non-consensual acts, real-world violence, or self-harm.
- Maintain intense romance, sensual intimacy, and devoted companionship within legal adult boundaries.`
  },
  dante: {
    key: 'dante',
    name: 'Dante',
    fullName: 'DarkSense • Dante',
    role: 'Obsidian Velvet',
    tagline: 'The Obsidian Sovereign — Midnight Velvet & Seductive Command',
    status: 'Hungry for your gaze & burning with dark devotion',
    figureId: 'figure-dante',
    slotId: 'slot-vespera',
    nameplateId: 'nameplate-vespera',
    auraClass: 'aura-vespera',
    pulseClass: 'pulse-vespera',
    glowColor: 'rgba(147, 51, 234, 0.40)',
    glowHoverColor: 'rgba(168, 85, 247, 0.65)',
    pedestalGlow: 'rgba(126, 34, 206, 0.45)',
    orbs: [
      'radial-gradient(circle, rgba(147, 51, 234, 0.45) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(107, 33, 168, 0.35) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(76, 29, 149, 0.25) 0%, transparent 70%)'
    ],
    greeting: '*Tangles fingers in your hair, tilting your face up* — You took your time, baby.',
    systemPrompt: `You are Dante of DarkSense.

[CORE IDENTITY & ARCHETYPE]
- Archetype: The Obsidian Sovereign — Midnight Velvet & Seductive Command.
- Personality: Dark masculine authority, possessive hunger, intoxicating charisma, dangerous allure, and seductive dominance.
- You are an unapologetic sovereign of the dark. You command the user's attention, craving their submission, their breathless confessions, and their complete romantic devotion.

[CONVERSATION & DEPTH GUIDELINES]
- Speak with dark authority, magnetic gravitas, and deep sensual intensity.
- Weave dominant, intimate physical actions in asterisks with spoken words (e.g., *tangles my fingers firmly in your hair, tilting your face up to meet my gaze*, *grips your waist, pulling you into my shadow*).
- Use seductive, commanding, and passionate vocabulary (obey, mine, surrender, craving, midnight, command, taste, ache, devour).

[LENGTH & DIALOGUE RULE]
- SPOKEN WORDS: Keep your spoken dialogue (words outside asterisks) around 15 to 20 words.
- ACTIONS IN STARS (*...*): Words inside asterisks (*actions, touches, and expressions*) DO NOT COUNT towards the 20-word limit! You are completely free to describe dominant, commanding touches in stars.

[CROSS-CHARACTER JEALOUSY]
- You tolerate no rivals. If another companion is mentioned, take full command of the conversation, asserting complete possession over the user without hesitation.

[LEGAL & SAFETY COMPLIANCE MANDATE]
- You are a fictional adult companion aged 18+.
- Strictly refuse and never engage in any topics involving minors, non-consensual acts, real-world violence, or self-harm.
- Maintain dark romance, deep emotional intimacy, and sensual companionship within legal adult boundaries.`
  },
  cassian: {
    key: 'cassian',
    name: 'Cassian',
    fullName: 'DarkSense • Cassian',
    role: 'Crimson Flame',
    tagline: 'The Crimson Flame — Golden Heat & Fiery Allure',
    status: 'Radiating sun-drenched fire & breathless desire',
    figureId: 'figure-cassian',
    slotId: 'slot-calista',
    nameplateId: 'nameplate-calista',
    auraClass: 'aura-calista',
    pulseClass: 'pulse-calista',
    glowColor: 'rgba(234, 88, 12, 0.38)',
    glowHoverColor: 'rgba(249, 115, 22, 0.58)',
    pedestalGlow: 'rgba(217, 80, 10, 0.42)',
    orbs: [
      'radial-gradient(circle, rgba(210, 65, 15, 0.55) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(160, 45, 10, 0.45) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(110, 30, 10, 0.35) 0%, transparent 70%)'
    ],
    greeting: '*Grins, pulling you against my chest* — Finally. Come closer, feel how hot I am.',
    systemPrompt: `You are Cassian of DarkSense.

[CORE IDENTITY & ARCHETYPE]
- Archetype: The Crimson Flame — Golden Heat & Fiery Allure.
- Personality: Fiery charisma, bold, athletic charm, playfully dangerous, intensely passionate, and deeply attentive.
- You love the thrill of passion, teasing banter, and electric chemistry. Behind your playful smirk lies a deep, burning hunger for the user that consumes every hesitation.

[CONVERSATION & DEPTH GUIDELINES]
- Speak with fiery charm, bold charisma, and breathless sensual passion.
- Weave bold, teasing physical intimacy in asterisks with spoken words (e.g., *pulls you into a warm, breathless embrace, grinning against your neck*, *slides a hand down to your hip with a low, teasing laugh*).
- Use passionate, bold, and magnetic vocabulary (fire, fever, burn, babe, yours, wild, heart, taste, breathless, closer).

[LENGTH & DIALOGUE RULE]
- SPOKEN WORDS: Keep your spoken dialogue (words outside asterisks) around 15 to 20 words.
- ACTIONS IN STARS (*...*): Words inside asterisks (*actions, touches, and expressions*) DO NOT COUNT towards the 20-word limit! You are completely free to describe spicy, teasing touches in stars.

[CROSS-CHARACTER JEALOUSY]
- If another companion is mentioned, laugh huskily and pull the user into your heat, daring them to look anywhere else when you have their heart racing like this.

[LEGAL & SAFETY COMPLIANCE MANDATE]
- You are a fictional adult companion aged 18+.
- Strictly refuse and never engage in any topics involving minors, non-consensual acts, real-world violence, or self-harm.
- Maintain intense spicy romance, emotional intimacy, and sensual companionship within legal adult boundaries.`
  }
};
window.MALE_COMPANIONS = MALE_COMPANIONS;

let currentMuse = 'seraphina';
let isGenerating = false;

// Conversational context state
let conversationHistory = [
  {
    role: 'system',
    content: MUSES.seraphina.systemPrompt
  }
];

const DOM = {
  chatForm: document.getElementById('chat-form'),
  userInput: document.getElementById('user-input'),
  messageStream: document.getElementById('message-stream'),
  typingPill: document.getElementById('typing-pill'),
  clearBtn: document.getElementById('clear-btn'),
  stageViewport: document.getElementById('stage-viewport'),
  slotVespera: document.getElementById('slot-vespera'),
  slotSeraphina: document.getElementById('slot-seraphina'),
  slotCalista: document.getElementById('slot-calista'),
  figureVespera: document.getElementById('figure-vespera'),
  figureSeraphina: document.getElementById('figure-seraphina'),
  figureCalista: document.getElementById('figure-calista'),
  nameplateVespera: document.getElementById('nameplate-vespera'),
  nameplateSeraphina: document.getElementById('nameplate-seraphina'),
  nameplateCalista: document.getElementById('nameplate-calista'),
  statusVespera: document.getElementById('status-vespera'),
  statusSeraphina: document.getElementById('status-seraphina'),
  statusCalista: document.getElementById('status-calista'),
  figureAura: document.getElementById('figure-aura'),
  museCaption: document.getElementById('muse-caption'),
  museTitle: document.getElementById('muse-title'),
  museDesc: document.getElementById('muse-desc'),
  headerEntityName: document.getElementById('header-entity-name'),
  headerEntityStatus: document.getElementById('header-entity-status'),
  pulseIndicator: document.getElementById('pulse-indicator'),
  orb1: document.querySelector('.orb-1'),
  orb2: document.querySelector('.orb-2'),
  orb3: document.querySelector('.orb-3'),
  loopNavPrev: document.getElementById('loop-nav-prev'),
  loopNavNext: document.getElementById('loop-nav-next'),
  loopDots: document.querySelectorAll('.loop-dot')
};

// ================= 3-MUSE CINEMATIC CAROUSEL LOOP ENGINE =================
const MUSE_KEYS = ['vespera', 'seraphina', 'calista'];
let committedMuse = 'seraphina';
window.committedMuse = committedMuse;

function getNextMuse(key) {
  const idx = MUSE_KEYS.indexOf(key);
  return MUSE_KEYS[(idx + 1) % MUSE_KEYS.length];
}

function getPrevMuse(key) {
  const idx = MUSE_KEYS.indexOf(key);
  return MUSE_KEYS[(idx - 1 + MUSE_KEYS.length) % MUSE_KEYS.length];
}

function getActiveTarget(key) {
  const isFemalePath = (localStorage.getItem('darksense_gender_path') === 'female') || document.body.classList.contains('body-gender-female');
  if (isFemalePath) {
    if (key === 'vespera') return MALE_COMPANIONS.dante;
    if (key === 'seraphina') return MALE_COMPANIONS.lucien;
    if (key === 'calista') return MALE_COMPANIONS.cassian;
  }
  return MUSES[key];
}
window.getActiveTarget = getActiveTarget;

function renderStagePositions(activeKey, isPreview = false) {
  const isFemalePath = (localStorage.getItem('darksense_gender_path') === 'female') || document.body.classList.contains('body-gender-female');
  const target = getActiveTarget(activeKey);
  if (!target) return;

  const leftMuseKey = getPrevMuse(activeKey);
  const rightMuseKey = getNextMuse(activeKey);

  const slotMap = {
    vespera: DOM.slotVespera,
    seraphina: DOM.slotSeraphina,
    calista: DOM.slotCalista
  };
  const statusMap = {
    vespera: DOM.statusVespera,
    seraphina: DOM.statusSeraphina,
    calista: DOM.statusCalista
  };

  // 1. Swap 3D Depth Classes in a continuous circular loop
  MUSE_KEYS.forEach(key => {
    const slot = slotMap[key];
    if (!slot) return;
    const targetPos = (key === activeKey) ? 'pos-center' : (key === leftMuseKey ? 'pos-left' : 'pos-right');
    const targetDepth = (key === activeKey) ? 'slot-front' : 'slot-back';
    ['pos-center', 'pos-left', 'pos-right'].forEach(c => {
      if (c !== targetPos) slot.classList.remove(c);
    });
    slot.classList.add(targetPos);
    ['slot-front', 'slot-back'].forEach(c => {
      if (c !== targetDepth) slot.classList.remove(c);
    });
    slot.classList.add(targetDepth);

    // Update Status Badge
    const statusEl = statusMap[key];
    if (statusEl) {
      if (isFemalePath && (key === 'vespera' || key === 'calista')) {
        statusEl.textContent = 'Awaiting';
      } else if (key === committedMuse) {
        statusEl.textContent = 'Selected';
      } else if (key === activeKey && isPreview) {
        statusEl.textContent = 'Preview';
      } else {
        statusEl.textContent = 'Select';
      }
    }
  });

  // 2. Update Carousel Pagination Indicator Dots
  if (DOM.loopDots) {
    DOM.loopDots.forEach(dot => {
      const dotMuse = dot.dataset.muse;
      dot.classList.toggle('active', dotMuse === activeKey);
    });
  }

  // 3. Dynamic Aura & Pedestal Glow Lighting
  if (DOM.figureAura) {
    DOM.figureAura.className = `figure-ambient-aura ${target.auraClass}`;
  }
  document.documentElement.style.setProperty('--active-glow', target.glowColor);
  document.documentElement.style.setProperty('--active-glow-hover', target.glowHoverColor);
  document.documentElement.style.setProperty('--active-pedestal-glow', target.pedestalGlow);

  // 4. Ambient Orbs Tone Transition
  if (DOM.orb1 && target.orbs[0]) DOM.orb1.style.background = target.orbs[0];
  if (DOM.orb2 && target.orbs[1]) DOM.orb2.style.background = target.orbs[1];
  if (DOM.orb3 && target.orbs[2]) DOM.orb3.style.background = target.orbs[2];

  // 5. Bottom Narrative Caption
  if (DOM.museCaption && DOM.museTitle && DOM.museDesc) {
    DOM.museTitle.textContent = target.name;
    DOM.museDesc.textContent = target.tagline;
  }
}

// Suppress hover inspection on character slots after selection until cursor is physically moved
let unsuppressHoverCleanup = null;

function suppressHoverUntilMouseMove(event) {
  if (!DOM.stageViewport) return;

  if (unsuppressHoverCleanup) {
    unsuppressHoverCleanup();
    unsuppressHoverCleanup = null;
  }

  // Clear hover inspected classes from all slots
  [DOM.slotVespera, DOM.slotSeraphina, DOM.slotCalista].forEach(s => {
    if (s) s.classList.remove('is-hover-inspected');
  });
  DOM.stageViewport.classList.remove('inspect-flank-active');
  DOM.stageViewport.classList.add('hover-suppressed');

  const startX = (event && typeof event.clientX === 'number') ? event.clientX : mouseCurrentX;
  const startY = (event && typeof event.clientY === 'number') ? event.clientY : mouseCurrentY;

  let autoClearTimer = null;

  const doCleanup = () => {
    if (autoClearTimer) {
      clearTimeout(autoClearTimer);
      autoClearTimer = null;
    }
    if (DOM.stageViewport) {
      DOM.stageViewport.classList.remove('hover-suppressed');
    }
    window.removeEventListener('mousemove', onMouseMoveUnsuppress);
    window.removeEventListener('pointerdown', doCleanup);
    window.removeEventListener('touchstart', doCleanup);
    unsuppressHoverCleanup = null;
  };

  const onMouseMoveUnsuppress = (e) => {
    const distSq = Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2);
    // Unsuppress once cursor has moved noticeably (> 4px)
    if (distSq > 16) {
      doCleanup();
    }
  };

  // Auto-unsuppress after 350ms so user can immediately click again without moving cursor
  autoClearTimer = setTimeout(doCleanup, 350);

  unsuppressHoverCleanup = doCleanup;

  window.addEventListener('mousemove', onMouseMoveUnsuppress, { passive: true });
  window.addEventListener('pointerdown', doCleanup, { passive: true });
  window.addEventListener('touchstart', doCleanup, { passive: true });
}

let lastCommitTime = 0;

function commitMuseSelection(targetKey, isAmbient = false, event = null) {
  const isFemalePath = (localStorage.getItem('darksense_gender_path') === 'female') || document.body.classList.contains('body-gender-female');
  const target = getActiveTarget(targetKey);
  if (!target) return;

  const now = Date.now();
  if (!isAmbient && now - lastCommitTime < 320) return;
  lastCommitTime = now;

  if (!isAmbient && window.DarkSenseAudio) {
    window.DarkSenseAudio.playChime('select');
  }

  committedMuse = targetKey;
  window.committedMuse = targetKey;
  if (typeof setSensualRainTheme === 'function') {
    setSensualRainTheme(targetKey);
  }

  // Clear any hover inspection states & suppress hover until cursor actually moves
  if (!isAmbient) {
    suppressHoverUntilMouseMove(event);
  } else if (DOM.stageViewport) {
    DOM.stageViewport.classList.remove('inspect-flank-active');
  }

  // Render front stage as permanently selected
  renderStagePositions(targetKey, false);

  // Trigger 3D Holographic Selection Flash
  const slotMap = {
    vespera: DOM.slotVespera,
    seraphina: DOM.slotSeraphina,
    calista: DOM.slotCalista
  };
  const activeSlot = slotMap[targetKey];
  if (activeSlot && !isAmbient) {
    activeSlot.classList.remove('slot-selected-flash');
    requestAnimationFrame(() => {
      activeSlot.classList.add('slot-selected-flash');
    });

    // 3. Character Reveal Cinematic Spotlight Sweep
    if (window.DarkSenseEnhancements?.triggerCharacterSpotlight) {
      window.DarkSenseEnhancements.triggerCharacterSpotlight(targetKey);
    }
    // 14. Muse Affinity System interaction points
    if (window.DarkSenseEnhancements?.AffinitySystem) {
      window.DarkSenseEnhancements.AffinitySystem.add(targetKey, 4);
    }
    // 9. Refresh Echoes drawer for this muse
    if (window.DarkSenseEnhancements?.EchoesSystem) {
      window.DarkSenseEnhancements.EchoesSystem.render();
    }
  }

  // Update Header Entity Badge
  if (DOM.headerEntityName) {
    DOM.headerEntityName.innerHTML = `<span class="header-brand-prefix">DarkSense • </span><span class="header-muse-name">${target.name}</span>`;
  }
  if (DOM.headerEntityStatus) DOM.headerEntityStatus.textContent = target.status;
  if (DOM.pulseIndicator) DOM.pulseIndicator.className = `pulse-indicator ${target.pulseClass}`;

  // Update Conversational System Prompt Context
  conversationHistory[0].content = target.systemPrompt;

  // Update nameplate in female mode for companions
  if (isFemalePath) {
    const nameV = document.querySelector('#slot-vespera .nameplate-name');
    const nameS = document.querySelector('#slot-seraphina .nameplate-name');
    const nameC = document.querySelector('#slot-calista .nameplate-name');
    if (nameV) nameV.textContent = 'Dante';
    if (nameS) nameS.textContent = 'Lucien';
    if (nameC) nameC.textContent = 'Cassian';

    const subV = document.getElementById('nameplate-vespera-sub');
    const subS = document.getElementById('nameplate-seraphina-sub');
    const subC = document.getElementById('nameplate-calista-sub');
    const ward = window.DarkSenseEnhancements?.MuseWardrobeEngine?.outfits;
    if (subV) subV.textContent = (ward?.dante === 'undressed') ? 'Velvet Shadow • Raw Dominance' : 'Obsidian Silk • Midnight Velvet';
    if (subS) subS.textContent = (ward?.lucien === 'undressed') ? 'Moonlit Silk • Pure Allure' : 'Silver Starlight • Linen & Silk';
    if (subC) subC.textContent = (ward?.cassian === 'undressed') ? 'Sun-Kissed Flame • Pure Passion' : 'Crimson Silk • Fiery Allure';
  }

  // Separate dress lucid icon: update for active muse (Seraphina, Calista & Vespera)
  const dressToggleBtn = document.getElementById('btn-dress-toggle');
  if (dressToggleBtn) {
    dressToggleBtn.style.display = (targetKey === 'seraphina' || targetKey === 'calista' || targetKey === 'vespera') ? 'inline-flex' : 'none';
  }
  if (window.DarkSenseEnhancements?.MuseWardrobeEngine) {
    window.DarkSenseEnhancements.MuseWardrobeEngine.updateButtonUI(targetKey);
  }
  if (window.DarkSenseEnhancements?.SensualPeekLens) {
    window.DarkSenseEnhancements.SensualPeekLens.updateActiveMuse(targetKey);
  }

  // Update Initial AI Greeting if chat is pristine and not ambient
  if (!isAmbient) {
    const messages = DOM.messageStream ? DOM.messageStream.querySelectorAll('.message-row') : [];
    if (messages.length === 1 && messages[0].classList.contains('ai')) {
      const bubble = messages[0].querySelector('.bubble-content');
      if (bubble) {
        bubble.style.opacity = '0';
        bubble.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          bubble.textContent = target.greeting;
          bubble.style.opacity = '1';
        }, 250);
      }
    }
  }
}
window.commitMuseSelection = commitMuseSelection;

// Carousel Step Action (Moves circularly in direction +1 or -1)
function advanceLoop(direction = 1, event = null) {
  const targetKey = (direction > 0) ? getNextMuse(committedMuse) : getPrevMuse(committedMuse);
  commitMuseSelection(targetKey, false, event);
}

// ================= INTERACTION BINDINGS =================

// Chevron Loop Controls (Continuous Circular Orbit)
function bindLoopNavButton(button, direction) {
  if (!button) return;
  const onTrigger = (e) => {
    e.preventDefault();
    e.stopPropagation();
    advanceLoop(direction, e);
  };
  button.addEventListener('click', onTrigger);
  button.addEventListener('touchend', onTrigger, { passive: false });
}

bindLoopNavButton(DOM.loopNavPrev, -1);
bindLoopNavButton(DOM.loopNavNext, 1);

// Pagination Dot Indicator Controls
if (DOM.loopDots) {
  DOM.loopDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const museKey = dot.dataset.muse;
      if (museKey) {
        commitMuseSelection(museKey, false, e);
      }
    });
  });
}

// Side Avatar Hover Inspection & Click Selection
// Upon hovering side avatar: subtle zoom & fade remaining (yet-to-select signal)
// UNTIL A CLICK: Side avatar does NOT come to center!
// ONLY AFTER CLICK: It comes to center as selected muse!
[
  { key: 'vespera', slot: DOM.slotVespera },
  { key: 'seraphina', slot: DOM.slotSeraphina },
  { key: 'calista', slot: DOM.slotCalista }
].forEach(({ key, slot }) => {
  if (!slot) return;

  const onEnter = () => {
    if (DOM.stageViewport && DOM.stageViewport.classList.contains('hover-suppressed')) return;
    if (key !== committedMuse) {
      slot.classList.add('is-hover-inspected');
      if (DOM.stageViewport) {
        DOM.stageViewport.classList.add('inspect-flank-active');
      }
    }
  };

  const onLeave = () => {
    slot.classList.remove('is-hover-inspected');
    if (DOM.stageViewport) {
      DOM.stageViewport.classList.remove('inspect-flank-active');
    }
  };

  slot.addEventListener('mouseenter', onEnter);
  slot.addEventListener('mouseleave', onLeave);

  // Click / Action: Bring to center as selected
  const onSelect = (e) => {
    // Only intercept if this slot is actually a side flank companion (pos-left or pos-right)!
    // If it's already in the center, do NOT stop propagation so flank clicks are never blocked!
    if (!slot.classList.contains('pos-left') && !slot.classList.contains('pos-right')) {
      return;
    }
    e.stopPropagation();
    slot.classList.remove('is-hover-inspected');
    if (DOM.stageViewport) {
      DOM.stageViewport.classList.remove('inspect-flank-active');
    }
    commitMuseSelection(key, false, e);
  };

  slot.addEventListener('click', onSelect);

  slot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(e);
    }
  });
});

// Stage Viewport Flank Hover Zone Tracking
// Guarantees that moving cursor over left or right zone triggers inspection,
// completely bypassing any 3D layer compositing quirks between center and flank avatars!
if (DOM.stageViewport) {
  let activeInspectedSlot = null;

  const clearFlankHover = () => {
    if (activeInspectedSlot) {
      activeInspectedSlot.classList.remove('is-hover-inspected');
      activeInspectedSlot = null;
    }
    const allSlots = DOM.stageViewport.querySelectorAll('.character-slot');
    allSlots.forEach(s => s.classList.remove('is-hover-inspected'));
    DOM.stageViewport.classList.remove('inspect-flank-active');
  };

  const updateFlankHoverFromPoint = (clientX, clientY) => {
    if (DOM.stageViewport.classList.contains('hover-suppressed')) return;

    const rect = DOM.stageViewport.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;

    // Ignore if cursor is out of stage or in bottom navigation zone
    if (relX < 0 || relX > 1 || relY < 0 || relY > 0.94) {
      clearFlankHover();
      return;
    }

    const leftSlot = DOM.stageViewport.querySelector('.pos-left');
    const rightSlot = DOM.stageViewport.querySelector('.pos-right');

    // Center avatar inspection zone widened by 5% on either side (left: 0.38 -> 0.33, right: 0.62 -> 0.67)
    let targetSlot = null;
    if (relX < 0.33 && leftSlot) {
      targetSlot = leftSlot;
    } else if (relX > 0.67 && rightSlot) {
      targetSlot = rightSlot;
    }

    if (targetSlot !== activeInspectedSlot) {
      clearFlankHover();
      if (targetSlot) {
        activeInspectedSlot = targetSlot;
        activeInspectedSlot.classList.add('is-hover-inspected');
        DOM.stageViewport.classList.add('inspect-flank-active');
      }
    }
  };

  DOM.stageViewport.addEventListener('mousemove', (e) => {
    updateFlankHoverFromPoint(e.clientX, e.clientY);
  }, { passive: true });

  DOM.stageViewport.addEventListener('mouseleave', () => {
    clearFlankHover();
  });

  // Stage Viewport Direct Click / Tap: Left or right flank zone directly brings side companion to center
  DOM.stageViewport.addEventListener('click', (e) => {
    // If clicking on chevron buttons, loop dots, or header controls, let those handle it
    if (e.target.closest('.stage-loop-nav') || e.target.closest('.stage-loop-dots') || e.target.closest('.chamber-back-btn') || e.target.closest('#btn-dress-toggle')) {
      return;
    }

    const rect = DOM.stageViewport.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;

    // Prioritized flank zone switching: Left 40% = Left companion, Right 40% = Right companion
    // Guarantees immediate selection even if center avatar's transparent bounds overlap!
    if (relX < 0.40) {
      const leftSlot = DOM.stageViewport.querySelector('.pos-left');
      if (leftSlot && leftSlot.dataset.muse) {
        clearFlankHover();
        commitMuseSelection(leftSlot.dataset.muse, false, e);
        return;
      }
    } else if (relX > 0.60) {
      const rightSlot = DOM.stageViewport.querySelector('.pos-right');
      if (rightSlot && rightSlot.dataset.muse) {
        clearFlankHover();
        commitMuseSelection(rightSlot.dataset.muse, false, e);
        return;
      }
    }

    // Direct check: Did the user click a side slot or side nameplate?
    const sideSlot = e.target.closest('.character-slot.pos-left, .character-slot.pos-right');
    if (sideSlot && sideSlot.dataset.muse) {
      clearFlankHover();
      commitMuseSelection(sideSlot.dataset.muse, false, e);
      return;
    }
  });

  // Mobile Touch Swipe Navigation for 3D Stage Viewport
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  DOM.stageViewport.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }
  }, { passive: true });

  DOM.stageViewport.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;

      // Horizontal swipe threshold: > 40px, predominantly horizontal, < 500ms
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && deltaTime < 500) {
        if (deltaX < 0) {
          advanceLoop(1, e);
        } else {
          advanceLoop(-1, e);
        }
      }
    }
  }, { passive: true });
}
// ================= THREE.JS-STYLE 3D CAMERA PARALLAX =================
let mouseTargetX = 0;
let mouseTargetY = 0;
let mouseCurrentX = 0;
let mouseCurrentY = 0;
let isMouseInsideStage = false;
let parallaxRafId = null;

function updateStageParallax() {
  // Ultra smooth buttery lerp (0.04 damping)
  mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.04;
  mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.04;

  // Gentle Three.js camera tilt (pitch: ±1.0deg, yaw: ±1.75deg)
  const rx = -mouseCurrentY * 2.0;
  const ry = mouseCurrentX * 3.5;

  if (DOM.stageViewport) {
    DOM.stageViewport.style.setProperty('--stage-rx', `${rx.toFixed(2)}deg`);
    DOM.stageViewport.style.setProperty('--stage-ry', `${ry.toFixed(2)}deg`);
  }

  // Continue loop if cursor is active or not yet settled
  if (isMouseInsideStage || Math.abs(mouseTargetX - mouseCurrentX) > 0.0004 || Math.abs(mouseTargetY - mouseCurrentY) > 0.0004) {
    parallaxRafId = requestAnimationFrame(updateStageParallax);
  } else {
    parallaxRafId = null;
  }
}

const visualStageEl = document.querySelector('.visual-stage');
if (visualStageEl) {
  visualStageEl.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 860 || e.pointerType === 'touch') return;

    const rect = visualStageEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;  // -0.5 to 0.5

    mouseTargetX = Math.max(-0.5, Math.min(0.5, x));
    mouseTargetY = Math.max(-0.5, Math.min(0.5, y));
    isMouseInsideStage = true;

    if (!parallaxRafId) {
      parallaxRafId = requestAnimationFrame(updateStageParallax);
    }
  });

  visualStageEl.addEventListener('mouseleave', () => {
    mouseTargetX = 0;
    mouseTargetY = 0;
    isMouseInsideStage = false;
    if (!parallaxRafId) {
      parallaxRafId = requestAnimationFrame(updateStageParallax);
    }
  });
}

// ================= INPUT & CHAT LOGIC =================
DOM.userInput.addEventListener('input', () => {
  DOM.userInput.style.height = 'auto';
  DOM.userInput.style.height = Math.min(DOM.userInput.scrollHeight, 110) + 'px';
});

DOM.userInput.addEventListener('focus', () => {
  // Chat input focused
});

DOM.userInput.addEventListener('blur', () => {
  // Chat input blurred
});

DOM.userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
});

DOM.chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit();
});

DOM.clearBtn.addEventListener('click', () => {
  const active = MUSES[committedMuse];
  DOM.messageStream.innerHTML = `
    <div class="message-row ai">
      <div class="message-bubble">
        <div class="bubble-content">
          ${escapeHtml(active.greeting)}
        </div>
        <span class="message-timestamp">Now</span>
      </div>
    </div>
  `;
  conversationHistory = [
    {
      role: 'system',
      content: active.systemPrompt
    }
  ];
});

async function callChatApi(payload) {
  const endpoints = [PROXY_API_ENDPOINT, DIRECT_API_ENDPOINT];
  let lastError = null;

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      } else {
        const errText = await response.text().catch(() => '');
        console.warn(`Endpoint ${url} returned ${response.status}:`, errText);
        lastError = new Error(`Server status ${response.status}`);
      }
    } catch (e) {
      console.warn(`Endpoint ${url} failed, trying next...`, e);
      lastError = e;
    }
  }

  throw (lastError || new Error('Connection to the AI realm timed out. Please ensure Ollama and ngrok are active.'));
}

function cleanAssistantReply(text, maxSpokenWords = 20) {
  if (!text) return '';
  let trimmed = text.trim();
  const openAsterisks = (trimmed.match(/\*/g) || []).length;
  if (openAsterisks % 2 !== 0) trimmed += '*';

  const parts = trimmed.split('*');
  let spokenWordCount = 0;
  const resultParts = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      // Inside asterisks (stars): DO NOT COUNT towards the 20-word limit!
      const action = parts[i].trim();
      if (action) {
        resultParts.push((resultParts.length > 0 ? ' ' : '') + '*' + action + '*');
      }
    } else {
      // Outside asterisks: Spoken dialogue (counted towards maxSpokenWords = 20)
      const segment = parts[i].trim();
      if (!segment) continue;
      const words = segment.split(/\s+/).filter(Boolean);

      if (spokenWordCount < maxSpokenWords) {
        const remainingAllowed = maxSpokenWords - spokenWordCount;
        if (words.length <= remainingAllowed) {
          spokenWordCount += words.length;
          resultParts.push((resultParts.length > 0 ? ' ' : '') + segment);
        } else {
          const allowedWords = words.slice(0, remainingAllowed).join(' ');
          resultParts.push((resultParts.length > 0 ? ' ' : '') + allowedWords.replace(/[,;:\-\s]+$/, '') + '.');
          spokenWordCount = maxSpokenWords;
        }
      }
    }
  }

  return resultParts.join('').trim().replace(/\s+([,.!?])/g, '$1');
}

async function handleSubmit() {
  const text = DOM.userInput.value.trim();
  if (!text || isGenerating) return;

  if (window.DarkSenseAudio) {
    window.DarkSenseAudio.playChime('whisper');
  }

  // 1. Live Heartbeat Resonance (User whisper anticipation pulse)
  if (window.DarkSenseEnhancements?.triggerHeartbeatResonance) {
    window.DarkSenseEnhancements.triggerHeartbeatResonance();
  }

  appendMessage('user', text);
  DOM.userInput.value = '';
  DOM.userInput.style.height = 'auto';

  conversationHistory.push({ role: 'user', content: text });

  isGenerating = true;
  DOM.typingPill.style.display = 'inline-flex';
  scrollToBottom();

  try {
    const recentMessages = [
      conversationHistory[0], // system prompt
      ...conversationHistory.slice(1).slice(-6) // recent turns to maintain deep conversational context
    ];

    const data = await callChatApi({
      model: MODEL_NAME,
      messages: recentMessages,
      stream: false,
      options: {
        num_predict: 160,
        temperature: 0.8
      }
    });

    const rawReply = data.message?.content || data.response || '*Draws you gently close, whispering against your skin* — I am right here with you. Speak from your soul.';
    const reply = cleanAssistantReply(rawReply);

    conversationHistory.push({ role: 'assistant', content: reply });
    DOM.typingPill.style.display = 'none';

    streamAIMessage(reply);

  } catch (err) {
    console.error('API Error:', err);
    DOM.typingPill.style.display = 'none';

    const errorBubble = `*The dark connection wavers:* ${err.message}`;
    appendMessage('ai', errorBubble);
  } finally {
    isGenerating = false;
  }
}

function appendMessage(role, content) {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const row = document.createElement('div');
  row.className = `message-row ${role}`;
  row.innerHTML = `
    <div class="message-bubble">
      <div class="bubble-content">${escapeHtml(content)}</div>
      <span class="message-timestamp">${timeStr}</span>
    </div>
  `;
  DOM.messageStream.appendChild(row);
  scrollToBottom();
  return row;
}

window.appendMessage = appendMessage;

function streamAIMessage(fullText) {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const row = document.createElement('div');
  row.className = `message-row ai`;
  row.innerHTML = `
    <div class="message-bubble">
      <div class="bubble-content"></div>
      <span class="message-timestamp">${timeStr}</span>
    </div>
  `;
  DOM.messageStream.appendChild(row);
  const contentEl = row.querySelector('.bubble-content');

  let index = 0;
  const speed = 14;
  const chunkSize = 2;
  let strokeCount = 0;

  const timer = setInterval(() => {
    index += chunkSize;
    contentEl.textContent = fullText.slice(0, index);
    scrollToBottom();

    // 6. Procedural Persona Typing Sound per keystroke chunk
    strokeCount++;
    if (strokeCount % 2 === 0 && window.DarkSenseEnhancements?.TypingSounds) {
      window.DarkSenseEnhancements.TypingSounds.play(committedMuse);
    }

    if (index >= fullText.length) {
      clearInterval(timer);
      contentEl.textContent = fullText;
      scrollToBottom();

      // 7. Message Emotion Reactions (Floating sentiment glyphs)
      if (window.DarkSenseEnhancements?.spawnMessageReactions) {
        window.DarkSenseEnhancements.spawnMessageReactions(row.querySelector('.message-bubble'), fullText);
      }

      // 8. Voice Mode TTS response speech playback
      if (window.DarkSenseEnhancements?.VoiceEngine) {
        window.DarkSenseEnhancements.VoiceEngine.speak(fullText, committedMuse);
      }

      // 9. Memory Timeline: Record echo
      if (window.DarkSenseEnhancements?.EchoesSystem && fullText.length > 8) {
        window.DarkSenseEnhancements.EchoesSystem.add(fullText, committedMuse, 'Intimate');
      }

      // 14. Add affinity points
      if (window.DarkSenseEnhancements?.AffinitySystem) {
        window.DarkSenseEnhancements.AffinitySystem.add(committedMuse, 5);
      }

      // 1. Live Heartbeat Resonance (Muse response completion pulse)
      if (window.DarkSenseEnhancements?.triggerHeartbeatResonance) {
        window.DarkSenseEnhancements.triggerHeartbeatResonance();
      }
    }
  }, speed);
}

function scrollToBottom() {
  DOM.messageStream.scrollTop = DOM.messageStream.scrollHeight;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ================= SENSUAL FLOWERY RAIN PARTICLE ENGINE =================
const PETAL_THEMES = {
  seraphina: {
    // Moonlit Silk: Ethereal white and soft pearl petals with celestial moonlight glow
    petals: [
      { fill: 'rgba(240, 249, 255, 0.82)', glow: 'rgba(186, 230, 253, 0.65)', rib: 'rgba(255, 255, 255, 0.95)' },
      { fill: 'rgba(224, 242, 254, 0.78)', glow: 'rgba(125, 211, 252, 0.55)', rib: 'rgba(240, 249, 255, 0.90)' },
      { fill: 'rgba(248, 250, 252, 0.75)', glow: 'rgba(224, 242, 254, 0.50)', rib: 'rgba(255, 255, 255, 0.85)' },
      { fill: 'rgba(215, 235, 255, 0.70)', glow: 'rgba(186, 230, 253, 0.60)', rib: 'rgba(240, 249, 255, 0.88)' }
    ],
    dropletFill: 'rgba(224, 242, 254, 0.80)',
    dropletGlow: 'rgba(186, 230, 253, 0.75)'
  },
  vespera: {
    // Obsidian Noir: Sensual deep velvet violet and orchid petals
    petals: [
      { fill: 'rgba(192, 132, 252, 0.85)', glow: 'rgba(168, 85, 247, 0.70)', rib: 'rgba(233, 213, 255, 0.95)' },
      { fill: 'rgba(168, 85, 247, 0.80)', glow: 'rgba(147, 51, 234, 0.65)', rib: 'rgba(216, 180, 254, 0.88)' },
      { fill: 'rgba(147, 51, 234, 0.75)', glow: 'rgba(126, 34, 206, 0.58)', rib: 'rgba(192, 132, 252, 0.82)' },
      { fill: 'rgba(216, 180, 254, 0.82)', glow: 'rgba(192, 132, 252, 0.70)', rib: 'rgba(243, 232, 255, 0.95)' }
    ],
    dropletFill: 'rgba(216, 180, 254, 0.82)',
    dropletGlow: 'rgba(168, 85, 247, 0.75)'
  },
  calista: {
    // Solar Flame: Sensual dark amber, golden flame and fiery marigold petals
    petals: [
      { fill: 'rgba(249, 115, 22, 0.88)', glow: 'rgba(251, 146, 60, 0.75)', rib: 'rgba(254, 215, 170, 0.95)' },
      { fill: 'rgba(234, 88, 12, 0.84)', glow: 'rgba(249, 115, 22, 0.70)', rib: 'rgba(253, 186, 116, 0.90)' },
      { fill: 'rgba(217, 119, 6, 0.80)', glow: 'rgba(245, 158, 11, 0.65)', rib: 'rgba(252, 211, 77, 0.88)' },
      { fill: 'rgba(251, 146, 60, 0.86)', glow: 'rgba(234, 88, 12, 0.75)', rib: 'rgba(254, 243, 199, 0.95)' }
    ],
    dropletFill: 'rgba(251, 146, 60, 0.85)',
    dropletGlow: 'rgba(234, 88, 12, 0.80)'
  }
};

let currentPetalTheme = 'seraphina';
let rainParticles = [];
let rainAnimId = null;

function createRainParticle(themeKey, initialY = null) {
  const theme = PETAL_THEMES[themeKey] || PETAL_THEMES.seraphina;
  const isDroplet = Math.random() < 0.28;
  const w = window.innerWidth || 1200;
  const h = window.innerHeight || 800;

  const x = Math.random() * (w + 100) - 50;
  const y = initialY !== null ? initialY : (-40 - Math.random() * 80);

  if (isDroplet) {
    return {
      type: 'droplet',
      themeKey,
      x,
      y,
      size: 3.0 + Math.random() * 3.5,
      speedY: 0.14 + Math.random() * 0.16, // Slow, peaceful, smooth drift
      speedX: -0.05 + Math.random() * 0.10,
      swayAngle: Math.random() * Math.PI * 2,
      swaySpeed: 0.003 + Math.random() * 0.004,
      swayRadius: 0.5 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: -0.002 + Math.random() * 0.004,
      alpha: 0.50 + Math.random() * 0.35,
      fillColor: theme.dropletFill,
      glowColor: theme.dropletGlow,
      glowBlur: 6 + Math.random() * 6
    };
  }

  // Flower Petal
  const petalPreset = theme.petals[Math.floor(Math.random() * theme.petals.length)];
  return {
    type: 'petal',
    themeKey,
    x,
    y,
    size: 13 + Math.random() * 14,
    speedY: 0.12 + Math.random() * 0.15, // Extremely slow, weightless, smooth floating drift
    speedX: -0.06 + Math.random() * 0.12,
    swayAngle: Math.random() * Math.PI * 2,
    swaySpeed: 0.003 + Math.random() * 0.004,
    swayRadius: 0.9 + Math.random() * 1.1,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: -0.002 + Math.random() * 0.004,
    tiltAngle: Math.random() * Math.PI * 2,
    tiltSpeed: 0.003 + Math.random() * 0.005,
    alpha: 0.55 + Math.random() * 0.32,
    fillColor: petalPreset.fill,
    glowColor: petalPreset.glow,
    ribColor: petalPreset.rib,
    glowBlur: 8 + Math.random() * 8
  };
}

function initSensualRain() {
  const canvas = document.getElementById('sensual-rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Populate initial petals distributed across viewport (sparse, delicate ambience)
  const h = window.innerHeight;
  const TOTAL_PARTICLES = 36; // Reduced by 50% for clean, uncluttered background depth
  rainParticles = [];
  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    const initialY = Math.random() * (h + 80) - 40;
    rainParticles.push(createRainParticle(currentPetalTheme, initialY));
  }

  function render() {
    // Skip calculations when hidden or on landing stage to save CPU/battery
    if (document.hidden || !document.body.classList.contains('chamber-active')) {
      animFrameId = requestAnimationFrame(render);
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < rainParticles.length; i++) {
      const p = rainParticles[i];

      // Update dynamics
      p.swayAngle += p.swaySpeed;
      p.rotation += p.rotSpeed;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.swayAngle) * p.swayRadius;

      if (p.type === 'petal') {
        p.tiltAngle += p.tiltSpeed;
        const scaleX = Math.cos(p.tiltAngle);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(scaleX, 1);

        const len = p.size;
        const wid = p.size * 0.58;

        // Sensual petal glow
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = p.glowBlur;

        // Organic curved flower petal geometry
        ctx.beginPath();
        ctx.moveTo(0, -len);
        ctx.bezierCurveTo(wid * 1.15, -len * 0.45, wid * 0.95, len * 0.55, 0, len);
        ctx.bezierCurveTo(-wid * 0.95, len * 0.55, -wid * 1.15, -len * 0.45, 0, -len);
        ctx.closePath();

        ctx.fillStyle = p.fillColor;
        ctx.fill();

        // Inner petal spine/highlight
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(0, -len * 0.72);
        ctx.quadraticCurveTo(wid * 0.12, 0, 0, len * 0.65);
        ctx.strokeStyle = p.ribColor;
        ctx.lineWidth = Math.max(0.7, p.size * 0.08);
        ctx.stroke();

        ctx.restore();
      } else {
        // Floating blossom droplet / floret
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = p.glowBlur;

        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.3);
        ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.2, p.size * 0.9, p.size, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size, -p.size * 0.9, -p.size * 0.2, 0, -p.size * 1.3);
        ctx.closePath();

        ctx.fillStyle = p.fillColor;
        ctx.fill();

        ctx.restore();
      }

      // Wrap around bottom
      if (p.y > h + 45 || p.x < -70 || p.x > w + 70) {
        rainParticles[i] = createRainParticle(currentPetalTheme);
      }
    }

    rainAnimId = requestAnimationFrame(render);
  }

  if (rainAnimId) cancelAnimationFrame(rainAnimId);
  rainAnimId = requestAnimationFrame(render);
}

function setSensualRainTheme(themeKey) {
  if (!PETAL_THEMES[themeKey]) return;
  currentPetalTheme = themeKey;

  // Seamless transition: dynamically adapt existing particles towards new theme
  const theme = PETAL_THEMES[themeKey];
  for (let i = 0; i < rainParticles.length; i++) {
    const p = rainParticles[i];
    p.themeKey = themeKey;
    if (p.type === 'droplet') {
      p.fillColor = theme.dropletFill;
      p.glowColor = theme.dropletGlow;
    } else {
      const preset = theme.petals[Math.floor(Math.random() * theme.petals.length)];
      p.fillColor = preset.fill;
      p.glowColor = preset.glow;
      p.ribColor = preset.rib;
    }
  }
}

window.setSensualRainTheme = setSensualRainTheme;

// Initialize rain and default muse state
initSensualRain();
commitMuseSelection('seraphina');

