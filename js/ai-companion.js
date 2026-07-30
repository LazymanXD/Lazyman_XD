/**
 * AI Companion Module
 * Handles AI companion orb, speech bubble, and interactive responses
 */

let aiCompanionActive = false;
let aiTypingTimeout = null;
let aiBubbleHideTimeout = null;
let aiTypingSoundTimeout = null;
let aiIdleSmallTalkTimeout = null;
let aiIdleSpeakAbortToken = 0;
let aiUsedIdleScripts = new Set();

/**
 * Five-line idle monologues when the user hasn't pressed a topic button (~5s quiet)
 */
const AI_IDLE_SMALL_TALK_SCRIPTS = [
  ['Alright... what was I saying again...', "No, wait, that doesn't sound right.", 'It made more sense a second ago.', "Whatever. I'll just go with it.", "It's not like anyone's correcting me."],
  ['I keep losing my train of thought lately.', "It's like it's there, then it just... gone.", "Maybe I'm overthinking it.", 'Yeah, I do that a lot.', 'Still, not the worst habit to have.'],
  ['I should probably say something more interesting.', 'That would help.', 'But then again, forcing it usually makes it worse.', 'So... this is fine.', 'I think this is fine.'],
  ["I'm kind of just talking to fill the space now.", "Not sure if that's a good thing.", 'Feels better than stopping, though.', 'Stopping makes it feel... empty.', "Yeah. I'll keep going."],
  ["Wow, that was not as smooth as I thought it'd be.", 'I really thought I had something there.', 'Nope.', 'Completely fell apart.', 'Impressive, honestly.'],
  ["It's weird how quiet things get.", "Like... suddenly there's too much room to think.", 'And then everything just kind of echoes.', "I don't always like that part.", 'But I stay anyway.'],
  ['I keep hearing myself talk.', "Even when I stop, it feels like it didn't end.", "Like something's still continuing.", "Maybe it's just me.", 'Yeah... probably just me.'],
  ['Okay, okay... just keep it simple.', 'No need to overdo it.', 'Just say what comes to mind.', 'That usually works.', 'Well... most of the time.'],
  ["It's been a pretty slow day.", 'Nothing really stood out, just the usual stuff.', 'I kinda like days like that, though.', 'Everything feels lighter when nothing big happens.', 'You can just exist for a bit.'],
  ["I was walking earlier and didn't really have anywhere to be.", 'Ended up taking the long way without thinking about it.', "Didn't even check the time.", 'It felt nice, not rushing for once.', "I don't do that enough."],
  ["I've been thinking about changing things up a little.", 'Not anything big, just small stuff.', 'Like routines, I guess.', 'Doing the same things every day gets kind of dull.', 'A small change might help.'],
  ["You don't really have to say anything.", "I'm okay just talking like this.", "It's kinda peaceful.", "Feels like the kind of quiet that isn't awkward.", 'Just... there.'],
  ["It's weird how some moments stick more than others.", 'Even small ones.', 'Like nothing special was happening, but it still felt important.', "I can't really explain why.", 'It just did.'],
  ['I tried to be productive earlier.', "Didn't go as planned.", 'Got distracted halfway through.', 'Honestly, not even surprised anymore.', "That's just how it goes sometimes."],
  ["I don't mind this kind of quiet.", "It feels different when someone's still here.", "Even if nothing's being said back.", "It's not empty.", 'Just calm.'],
  ["I'll keep talking for a bit.", 'No real reason to stop.', "This moment hasn't ended yet.", "So I'll stay in it.", 'At least a little longer.']
];

/**
 * Clear idle small talk timer
 */
function clearAiIdleSmallTalkTimer() {
  if (aiIdleSmallTalkTimeout) {
    clearTimeout(aiIdleSmallTalkTimeout);
    aiIdleSmallTalkTimeout = null;
  }
}

/**
 * Abort idle monologue
 */
function abortAiIdleMonologue() {
  aiIdleSpeakAbortToken += 1;
}

/**
 * Stop pending idle timer and cancel any in-progress idle line chain
 */
function clearAiIdleSmallTalk() {
  clearAiIdleSmallTalkTimer();
  abortAiIdleMonologue();
  aiUsedIdleScripts.clear();
}

/**
 * Schedule idle small talk
 * @param {number} delayMs - Delay in milliseconds
 */
function scheduleAiIdleSmallTalk(delayMs) {
  clearAiIdleSmallTalkTimer();
  if (!aiCompanionActive) return;
  aiIdleSmallTalkTimeout = setTimeout(() => {
    aiIdleSmallTalkTimeout = null;
    runAiIdleSmallTalk();
  }, delayMs);
}

/**
 * Speak idle script lines sequentially
 * @param {Array} lines - Array of text lines
 * @param {number} index - Current line index
 */
function speakIdleScriptLines(lines, index) {
  if (!aiCompanionActive) return;
  if (!lines || !Array.isArray(lines) || index >= lines.length) {
    scheduleAiIdleSmallTalk(10000);
    return;
  }
  const myToken = aiIdleSpeakAbortToken;
  aiSpeak(lines[index], () => {
    setTimeout(() => {
      if (myToken !== aiIdleSpeakAbortToken || !aiCompanionActive) return;
      speakIdleScriptLines(lines, index + 1);
    }, 400);
  });
}

/**
 * Run idle small talk
 */
function runAiIdleSmallTalk() {
  if (!aiCompanionActive) return;
  if (aiTypingTimeout) {
    scheduleAiIdleSmallTalk(1200);
    return;
  }

  // Get available scripts (not used yet)
  const availableIndices = AI_IDLE_SMALL_TALK_SCRIPTS.map((_, i) => i).filter(i => !aiUsedIdleScripts.has(i));

  // If all scripts used, reset the tracking
  if (availableIndices.length === 0) {
    aiUsedIdleScripts.clear();
    availableIndices.push(...AI_IDLE_SMALL_TALK_SCRIPTS.map((_, i) => i));
  }

  // Pick random available script
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  aiUsedIdleScripts.add(randomIndex);

  const script = AI_IDLE_SMALL_TALK_SCRIPTS[randomIndex];
  if (script && Array.isArray(script)) {
    speakIdleScriptLines(script, 0);
  } else {
    scheduleAiIdleSmallTalk(10000);
  }
}

/**
 * Start AI typing sound
 */
function startAITypingSound() {
  stopAITypingSound();
  const playTypingTick = () => {
    if (!aiCompanionActive) return;
    if (typeof playSound === 'function') {
      playSound('typing', 0);
    }
    aiTypingSoundTimeout = setTimeout(playTypingTick, 80 + Math.floor(Math.random() * 70));
  };
  playTypingTick();
}

/**
 * Stop AI typing sound
 */
function stopAITypingSound() {
  if (aiTypingSoundTimeout) {
    clearTimeout(aiTypingSoundTimeout);
    aiTypingSoundTimeout = null;
  }
}

/**
 * Open AI companion
 */
function openAICompanion() {
  clearAiIdleSmallTalk();
  const companion = document.getElementById('aiCompanion');
  const orb = document.getElementById('aiOrb');
  const optionsContainer = document.getElementById('aiOptions');
  const navButtons = document.querySelector('.nav-buttons');

  // Show companion in center
  companion.classList.add('active', 'center');
  companion.classList.remove('top-left');
  orb.classList.remove('speaking');
  aiCompanionActive = true;

  // Hide nav buttons
  if (navButtons) navButtons.classList.add('hidden');

  if (typeof playSound === 'function') playSound('open', 0);

  // Hide options initially
  if (optionsContainer) optionsContainer.classList.remove('show');

  // After greeting, move to top-left
  setTimeout(() => {
    aiSpeak("Hi! Lazyman_XD here. What can I do for you?", () => {
      scheduleAiIdleSmallTalk(10000);
    });
  }, 500);

  // Move to top-left after speaking and show options
  setTimeout(() => {
      if (!aiCompanionActive) return;
    companion.classList.remove('center');
    companion.classList.add('top-left');
    if (optionsContainer) optionsContainer.classList.add('show');
  }, 3500);
}

/**
 * Close AI companion
 */
function closeAICompanion() {
  clearAiIdleSmallTalk();
  const companion = document.getElementById('aiCompanion');
  const speechBubble = document.getElementById('aiSpeechBubble');
  const optionsContainer = document.getElementById('aiOptions');
  const navButtons = document.querySelector('.nav-buttons');

  companion.classList.remove('active', 'center', 'top-left');
  speechBubble.classList.remove('show');
  if (optionsContainer) optionsContainer.classList.remove('show');
  if (aiTypingTimeout) {
    clearTimeout(aiTypingTimeout);
    aiTypingTimeout = null;
  }
  if (aiBubbleHideTimeout) {
    clearTimeout(aiBubbleHideTimeout);
    aiBubbleHideTimeout = null;
  }
  stopAITypingSound();
  aiCompanionActive = false;

  // Show nav buttons again
  if (navButtons) navButtons.classList.remove('hidden');

  if (typeof playSound === 'function') playSound('close', 0);
}

/**
 * AI speaks text with typing effect
 * @param {string} text - Text to speak
 * @param {Function} callback - Callback after speaking
 */
function aiSpeak(text, callback) {
  const speechBubble = document.getElementById('aiSpeechBubble');
  const speechText = document.getElementById('aiSpeechText');
  const typingCursor = document.getElementById('aiTypingCursor');
  const orb = document.getElementById('aiOrb');

  // Clear previous text
  if (aiTypingTimeout) {
    clearTimeout(aiTypingTimeout);
    aiTypingTimeout = null;
  }
  if (aiBubbleHideTimeout) {
    clearTimeout(aiBubbleHideTimeout);
    aiBubbleHideTimeout = null;
  }
  stopAITypingSound();
  speechText.textContent = '';
  typingCursor.style.display = 'inline-block';
  speechBubble.classList.add('show');
  orb.classList.add('speaking');
  startAITypingSound();

  // Typing effect
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      speechText.textContent += text.charAt(i);
      i++;
      aiTypingTimeout = setTimeout(typeChar, 50);
    } else {
      // Done typing
      aiTypingTimeout = null;
      typingCursor.style.display = 'none';
      orb.classList.remove('speaking');
      stopAITypingSound();
      aiBubbleHideTimeout = setTimeout(() => {
        speechBubble.classList.remove('show');
        aiBubbleHideTimeout = null;
      }, 3000);
      // Execute callback if provided
      if (callback && typeof callback === 'function') {
        setTimeout(callback, 500);
      }
      // Always schedule idle smalltalk if AI is still active
      if (aiCompanionActive) {
        scheduleAiIdleSmallTalk(10000);
      }
    }
  }
  typeChar();
}

/**
 * Show commission pricing dialog
 */
function showCommissionPricing() {
  // Hide AI options temporarily
  const optionsContainer = document.getElementById('aiOptions');
  if (optionsContainer) optionsContainer.classList.remove('show');

  // Create pricing dialog
  const pricingDialog = document.createElement('div');
  pricingDialog.id = 'commissionPricingDialog';
  pricingDialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(10, 20, 30, 0.98);
    border: 2px solid rgba(255, 215, 0, 0.5);
    border-radius: 15px;
    padding: 25px;
    max-width: 400px;
    width: 90%;
    z-index: 10001;
    box-shadow: 0 10px 40px rgba(255, 180, 0, 0.4);
  `;

  pricingDialog.innerHTML = `
    <h3 style="color: #ffd700; font-size: 14px; margin-bottom: 15px; text-align: center;">Commission Pricing</h3>
    <div style="color: #ffffff; font-size: 10px; line-height: 1.8;">
      <p><strong>Sketch:</strong> $25 - $50</p>
      <p><strong>Line Art:</strong> $50 - $100</p>
      <p><strong>Full Color:</strong> $100 - $250</p>
      <p><strong>Character Design:</strong> $150 - $300</p>
      <p><strong>Complex Scene:</strong> $250+</p>
      <br>
      <p style="color: #aaa; font-size: 9px;">Prices vary based on complexity and details. Contact me for a custom quote!</p>
    </div>
    <button onclick="closeCommissionPricing()" style="
      margin-top: 20px;
      width: 100%;
      padding: 12px;
      background: rgba(255, 200, 0, 0.2);
      border: 1px solid rgba(255, 215, 0, 0.5);
      border-radius: 8px;
      color: #ffffff;
      font-family: 'Press Start 2P', cursive;
      font-size: 10px;
      cursor: pointer;
    ">Got it!</button>
  `;

  document.body.appendChild(pricingDialog);
  if (typeof playSound === 'function') playSound('tabClick', 0);
}

/**
 * Close commission pricing dialog
 */
function closeCommissionPricing() {
  const dialog = document.getElementById('commissionPricingDialog');
  if (dialog) dialog.remove();

  // Show AI options again
  const optionsContainer = document.getElementById('aiOptions');
  if (optionsContainer) optionsContainer.classList.add('show');
  if (aiCompanionActive) {
    scheduleAiIdleSmallTalk(10000);
  }
}

/**
 * Ask AI a question
 * @param {string} topic - Topic to ask about
 */
function askAI(topic) {
  if (typeof playSound === 'function') playSound('click', 0);
  clearAiIdleSmallTalk();

  const roadmapOverlay = document.getElementById('roadmapOverlay');

  if (topic === 'roadmap') {
    aiSpeak(
      "I made a roadmap to organize my work so I don't try to do everything at once. I don't expect these projects to be finished in a day or a week - it may take years depending on my mood and pace. I'll keep sharing updates here on my website and on my Reddit.",
      function() {
        if (roadmapOverlay && typeof toggleRoadmapOverlay === 'function' && !roadmapOverlay.classList.contains('show')) {
          toggleRoadmapOverlay();
        }
        scheduleAiIdleSmallTalk(10000);
      }
    );
    return;
  }

  const responses = {
    'commissions': "Yes! I do art commissions! If you're interested in getting some artwork done, feel free to reach out! Check the Work section to see examples of my art style.",
    'artworks': "I've created lots of artwork over the years! From digital illustrations to character designs. Head over to the Work section to browse through my gallery!",
    'mangas': "Oh, the manga section! I've been working on some manga projects. There are stories, characters, and worlds I've built. Check the Manga button to dive into my creations!",
    'who': "I'm Lazyman_XD! A creative soul who loves art, coding, and storytelling. I made this website to showcase my work and connect with people like you!",
    'why': "Why am I here? Great question! I exist to create, express myself, and share my passion with the world. Every piece of art, every line of code - it's all part of my journey.",
    'effort': "Haha, fair question! I put effort into this AI because I wanted something unique - a way to interact with visitors that feels personal and fun. Plus, I just really enjoy building cool stuff! Hope you like it!",
    'characters': "They're just characters that might be future characters that get a cameo on my manga. You never know who might show up in the story!"
  };

  const response = responses[topic] || "Hmm, let me think about that...";

  // Define callbacks for specific topics
  let callback = null;
  if (topic === 'commissions') {
    callback = function() {
      aiSpeak("Here's my pricing info:", function() {
        showCommissionPricing();
        scheduleAiIdleSmallTalk(10000);
      });
    };
  } else if (topic === 'artworks') {
    callback = function() {
      // Close AI and show work page
      closeAICompanion();
      setTimeout(() => {
        if (typeof showPage === 'function') showPage('work');
      }, 300);
    };
  } else {
    // For all other topics, schedule idle small talk after responding
    callback = function() {
      scheduleAiIdleSmallTalk(10000);
    };
  }

  aiSpeak(response, callback);
}
