// Markup ported verbatim from hhgoa-2026-id-generator.html (source of truth).
export const HHGOA_MARKUP = `<canvas id="ambientBG" aria-hidden="true"></canvas>
<div id="siteBG" aria-hidden="true">
  <div class="grain-dots"></div>
  <div class="sun-glow"></div>
  <div class="sun-glow2"></div>
  <svg class="corner-palm" style="left:-18px;top:-10px;width:150px;transform:rotate(200deg)" viewBox="0 0 200 260"><g fill="#FFF7EA"><rect x="92" y="60" width="10" height="150" rx="4"/><path d="M97 60 C60 30 20 40 5 20 C40 10 80 30 97 55Z"/><path d="M97 60 C50 55 20 80 0 70 C25 45 70 45 97 55Z"/><path d="M97 60 C70 90 60 130 30 140 C40 100 65 70 97 55Z"/><path d="M97 60 C130 40 170 50 190 25 C155 15 115 30 97 55Z"/></g></svg>
  <svg class="corner-palm" style="right:-24px;top:-14px;width:170px;transform:rotate(160deg)" viewBox="0 0 200 260"><g fill="#FFE98A"><rect x="92" y="70" width="10" height="150" rx="4"/><path d="M97 70 C60 40 20 50 5 30 C40 20 80 40 97 65Z"/><path d="M97 70 C50 65 20 90 0 80 C25 55 70 55 97 65Z"/><path d="M97 70 C70 100 60 140 30 150 C40 110 65 80 97 65Z"/><path d="M97 70 C130 50 170 60 190 35 C155 25 115 40 97 65Z"/></g></svg>
  <svg class="horizon" viewBox="0 0 1000 120" preserveAspectRatio="none"><path d="M0 60 C150 20 350 90 500 50 C650 15 850 85 1000 45 L1000 120 L0 120 Z" fill="rgba(255,247,234,.05)"/><path d="M0 78 C180 40 340 100 520 66 C680 36 840 96 1000 60 L1000 120 L0 120 Z" fill="rgba(255,247,234,.04)"/></svg>
</div>

<div id="splash">
  <div class="splash-word">HH</div>
  <div class="splash-word yellow">GOA</div>
  <div class="splash-word small">BUILDER PASS · 2026</div>
  <div class="splash-bar"><i></i></div>
</div>

<nav id="topnav" aria-label="Primary">
  <div class="logo"><span class="dot"></span> HH GOA · 2026</div>
  <div class="nav-actions">
    <button class="nav-btn" id="hypeBtn">Check Hype</button>
    <button class="nav-btn primary" id="navCreateBtn">Create</button>
  </div>
</nav>

<!-- ============ LANDING ============ -->
<section class="screen active" id="screen-landing">
  <canvas id="heroCanvas" aria-hidden="true"></canvas>
  <svg class="beach-svg" aria-hidden="true" style="left:-40px;bottom:-20px;width:220px;opacity:.5" viewBox="0 0 200 260"><g fill="#FFF7EA"><rect x="92" y="60" width="10" height="150" rx="4"/><path d="M97 60 C60 30 20 40 5 20 C40 10 80 30 97 55Z"/><path d="M97 60 C50 55 20 80 0 70 C25 45 70 45 97 55Z"/><path d="M97 60 C70 90 60 130 30 140 C40 100 65 70 97 55Z"/><path d="M97 60 C130 40 170 50 190 25 C155 15 115 30 97 55Z"/></g></svg>
  <svg class="beach-svg" aria-hidden="true" style="right:-30px;bottom:-30px;width:250px;opacity:.45" viewBox="0 0 200 260"><g fill="#FFE98A"><rect x="92" y="70" width="10" height="150" rx="4"/><path d="M97 70 C60 40 20 50 5 30 C40 20 80 40 97 65Z"/><path d="M97 70 C50 65 20 90 0 80 C25 55 70 55 97 65Z"/><path d="M97 70 C70 100 60 140 30 150 C40 110 65 80 97 65Z"/><path d="M97 70 C130 50 170 60 190 35 C155 25 115 40 97 65Z"/></g></svg>
  <svg class="beach-svg" aria-hidden="true" style="right:6%;top:14%;width:120px;opacity:.4" viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="none" stroke="#FFD23F" stroke-width="2" stroke-dasharray="4 6"/><circle cx="50" cy="50" r="14" fill="#FFD23F" opacity=".5"/></svg>
  <svg class="beach-svg" aria-hidden="true" style="left:0;right:0;bottom:0;width:100%;height:70px" viewBox="0 0 1000 70" preserveAspectRatio="none"><path d="M0 40 C150 10 350 60 500 30 C650 5 850 55 1000 25 L1000 70 L0 70 Z" fill="rgba(255,247,234,.06)"/></svg>
  <div id="page1-inner">
    <div class="hero-eyebrow">28 – 31 October 2026 · Panhouse, Goa</div>
    <div class="hero-title-row">
      <span class="htitle">HACKER</span>
      <div class="goa-stamp"><span class="g-word">GOA</span><span class="g-sub">Est. 2026</span></div>
      <span class="htitle yellow">HOUSE</span>
    </div>
    <p class="hero-sub">Four days of building, breaking and shipping on the coast. Pull your builder pass — solo or as a squad — and lock in your spot.</p>
    <div class="hero-meta">
      <div><label>Countdown</label><strong class="count" id="countdownStat">—</strong></div>
      <div><label>Venue</label><strong>Panhouse, Goa</strong></div>
      <div><label>Edition</label><strong>Set 01</strong></div>
    </div>
    <div class="hero-ctas">
      <button class="hype-btn" id="hypeBtnHero"><span class="play-dot"></span> Check Hype</button>
      <button class="create-btn" id="heroCreateBtn">Create Your Pass</button>
    </div>
  </div>
  <div class="hero-scroll-hint">Move your cursor</div>
</section>

<!-- ============ HYPE VIDEO MODAL ============ -->
<div id="hypeModal" role="dialog" aria-modal="true" aria-label="Event hype video">
  <div class="hype-box">
    <button class="hype-close" id="hypeCloseBtn" aria-label="Close video">✕</button>
    <div id="hypeEmptyState" class="hype-empty">
      <div class="upload-icon">▶</div>
      <div class="display" style="font-size:22px;text-transform:uppercase;color:var(--cream);">No hype video yet</div>
      <p>Add your event video to enable this — it plays right here, lazily, without slowing down the site.</p>
      <button class="hype-upload-btn" id="hypeUploadTrigger">Choose Video File</button>
      <input type="file" accept="video/*" id="hypeFileInput" style="display:none;">
    </div>
    <video id="hypeVideo" controls preload="metadata" style="display:none;"></video>
  </div>
</div>

<!-- ============ GENERATOR SELECT ============ -->
<section class="screen" id="screen-select">
  <div class="step-screen"><div class="step-wrap">
    <button class="back-link" id="backFromSelect">← Back</button>
    <div class="step-head">
      <div class="step-eyebrow">Create</div>
      <h1>What do you want to create?</h1>
      <p>Pull a solo builder pass, or bring your whole squad onto one card.</p>
    </div>
    <div class="select-grid">
      <button class="select-tile" id="selectSingle">
        <div class="st-icon">◈</div>
        <h3>Single ID</h3>
        <p>Create your personal HH Goa 2026 builder pass with your photo, stack and a tier of your own.</p>
      </button>
      <button class="select-tile" id="selectSquad">
        <div class="st-icon">▦</div>
        <h3>Squad</h3>
        <p>Bring up to four teammates onto one shared credential — one squad, one card.</p>
      </button>
    </div>
  </div></div>
  <svg class="beach-svg sway" aria-hidden="true" style="left:-36px;bottom:-16px;width:170px;opacity:.28" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF7EA"><rect x="92" y="60" width="10" height="150" rx="4"/><path d="M97 60 C60 30 20 40 5 20 C40 10 80 30 97 55Z"/><path d="M97 60 C50 55 20 80 0 70 C25 45 70 45 97 55Z"/><path d="M97 60 C70 90 60 130 30 140 C40 100 65 70 97 55Z"/><path d="M97 60 C130 40 170 50 190 25 C155 15 115 30 97 55Z"/></g></svg>
  <svg class="beach-svg sway sway2" aria-hidden="true" style="right:-42px;top:12%;width:190px;opacity:.22" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><g fill="#FFE98A"><rect x="92" y="70" width="10" height="150" rx="4"/><path d="M97 70 C60 40 20 50 5 30 C40 20 80 40 97 65Z"/><path d="M97 70 C50 65 20 90 0 80 C25 55 70 55 97 65Z"/><path d="M97 70 C70 100 60 140 30 150 C40 110 65 80 97 65Z"/><path d="M97 70 C130 50 170 60 190 35 C155 25 115 40 97 65Z"/></g></svg>
  <svg class="beach-svg" aria-hidden="true" style="right:8%;bottom:6%;width:80px;opacity:.2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="34" fill="none" stroke="#FFD23F" stroke-width="2" stroke-dasharray="4 6"/></svg>
</section>

<!-- ============ SINGLE FORM ============ -->
<section class="screen" id="screen-single">
  <div class="step-screen"><div class="step-wrap">
    <button class="back-link" id="backFromSingle">← Back</button>
    <div class="progress-track" id="singleProgress"></div>

    <!-- STEP 1: IDENTITY -->
    <div class="form-step" data-step="0">
      <div class="step-head">
        <div class="step-eyebrow">01 / 05 · Identity</div>
        <h1>Tell us who you are</h1>
        <p>This goes straight onto your pass.</p>
      </div>
      <div class="field">
        <label>Full Name</label>
        <input type="text" id="s-name" placeholder="e.g. Satyam Verma" maxlength="26">
        <div class="field-error" id="err-s-name">Please enter your name.</div>
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" id="s-email" placeholder="you@example.com">
        <div class="field-error" id="err-s-email">Please enter a valid email.</div>
      </div>
      <div class="field">
        <label>Phone <span class="opt">(optional)</span></label>
        <input type="tel" id="s-phone" placeholder="+91 ...">
      </div>
      <div class="step-actions"><button class="btn-continue" data-next>Continue →</button></div>
    </div>

    <!-- STEP 2: PROFILE + STACK -->
    <div class="form-step" data-step="1" hidden>
      <div class="step-head">
        <div class="step-eyebrow">02 / 05 · Profile</div>
        <h1>What do you build?</h1>
        <p>Your role, where you're from, and the stack you ship in.</p>
      </div>
      <div class="field-row">
        <div class="field"><label>Role / Designation</label><input type="text" id="s-role" placeholder="e.g. Founder"></div>
        <div class="field"><label>Company <span class="opt">(optional)</span></label><input type="text" id="s-company" placeholder="e.g. Indie"></div>
      </div>
      <div class="field"><label>City / Country</label><input type="text" id="s-location" placeholder="e.g. Bengaluru, India"></div>
      <div class="field"><label>Currently shipping <span class="opt">(optional · shows on your pass)</span></label><input type="text" id="s-building" placeholder="e.g. An AI trip planner for Goa" maxlength="60"></div>

      <div class="field">
        <label>Stack / Skills <span class="opt">(pick up to 2)</span></label>
        <div class="chips" id="s-stackChips"></div>
        <div class="field-error" id="err-s-stack">Please select at least one role.</div>
      </div>
      <div class="step-actions"><button class="btn-back-sec" data-prev>← Back</button><button class="btn-continue" data-next>Continue →</button></div>
    </div>

    <!-- STEP 3: LINKS -->
    <div class="form-step" data-step="2" hidden>
      <div class="step-head">
        <div class="step-eyebrow">03 / 05 · Links</div>
        <h1>Where can people find you?</h1>
        <p>All optional — fill in whatever you'd like printed on the pass.</p>
      </div>
      <div class="field-row">
        <div class="field"><label>LinkedIn <span class="opt">(optional)</span></label><input type="text" id="s-linkedin" placeholder="in/yourname"></div>
        <div class="field"><label>GitHub <span class="opt">(optional)</span></label><input type="text" id="s-github" placeholder="github/yourname"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Instagram <span class="opt">(optional)</span></label><input type="text" id="s-instagram" placeholder="@yourhandle"></div>
        <div class="field"><label>Twitter / X <span class="opt">(optional)</span></label><input type="text" id="s-twitter" placeholder="@yourhandle"></div>
      </div>
      <div class="field"><label>Portfolio <span class="opt">(optional)</span></label><input type="text" id="s-portfolio" placeholder="yoursite.in"></div>
      <div class="step-actions"><button class="btn-back-sec" data-prev>← Back</button><button class="btn-continue" data-next>Continue →</button></div>
    </div>

    <!-- STEP 4: PHOTO -->
    <div class="form-step" data-step="3" hidden>
      <div class="step-head">
        <div class="step-eyebrow">04 / 05 · Photo</div>
        <h1>Upload your photo</h1>
        <p>Drag to reposition, and use zoom or rotate to fit the frame.</p>
      </div>
      <div id="s-photoEditor"></div>
      <div class="field-error" id="err-s-photo">Please upload your photo.</div>
      <div class="step-actions"><button class="btn-back-sec" data-prev>← Back</button><button class="btn-continue" data-next>Continue →</button></div>
    </div>

    <!-- STEP 5: PREVIEW + GENERATE -->
    <div class="form-step" data-step="4" hidden>
      <div class="step-head">
        <div class="step-eyebrow">05 / 05 · Preview</div>
        <h1>Review your details</h1>
        <p>Make sure everything looks right before we generate your pass.</p>
      </div>
      <div class="summary-list" id="s-summary"></div>
      <div class="step-actions"><button class="btn-back-sec" data-prev>← Back</button><button class="btn-continue" id="s-generateBtn">Generate Your ID</button></div>
    </div>
  </div></div>
  <svg class="beach-svg sway" aria-hidden="true" style="left:-36px;bottom:-16px;width:170px;opacity:.26" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF7EA"><rect x="92" y="60" width="10" height="150" rx="4"/><path d="M97 60 C60 30 20 40 5 20 C40 10 80 30 97 55Z"/><path d="M97 60 C50 55 20 80 0 70 C25 45 70 45 97 55Z"/><path d="M97 60 C70 90 60 130 30 140 C40 100 65 70 97 55Z"/><path d="M97 60 C130 40 170 50 190 25 C155 15 115 30 97 55Z"/></g></svg>
  <svg class="beach-svg sway sway2" aria-hidden="true" style="right:-42px;top:16%;width:190px;opacity:.2" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><g fill="#FFE98A"><rect x="92" y="70" width="10" height="150" rx="4"/><path d="M97 70 C60 40 20 50 5 30 C40 20 80 40 97 65Z"/><path d="M97 70 C50 65 20 90 0 80 C25 55 70 55 97 65Z"/><path d="M97 70 C70 100 60 140 30 150 C40 110 65 80 97 65Z"/><path d="M97 70 C130 50 170 60 190 35 C155 25 115 40 97 65Z"/></g></svg>
  <svg class="beach-svg" aria-hidden="true" style="right:7%;bottom:8%;width:90px;opacity:.18" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="34" fill="none" stroke="#FFD23F" stroke-width="2" stroke-dasharray="4 6"/><circle cx="50" cy="50" r="14" fill="#FFD23F" opacity=".4"/></svg>
</section>

<!-- ============ SQUAD FORM ============ -->
<section class="screen" id="screen-squad">
  <div class="step-screen"><div class="step-wrap">
    <button class="back-link" id="backFromSquad">← Back</button>
    <div class="progress-track" id="squadProgress"></div>

    <!-- STEP 1: SQUAD DETAILS -->
    <div class="form-step" data-step="0">
      <div class="step-head">
        <div class="step-eyebrow">01 / 03 · Squad Details</div>
        <h1>Name your squad</h1>
        <p>This is the headline of your shared pass.</p>
      </div>
      <div class="field">
        <label>Squad Name</label>
        <input type="text" id="q-name" placeholder="e.g. Night Owls" maxlength="24">
        <div class="field-error" id="err-q-name">Please enter a squad name.</div>
      </div>
      <div class="field"><label>Tagline <span class="opt">(optional)</span></label><input type="text" id="q-tagline" placeholder="e.g. Building till sunrise" maxlength="40"></div>
      <div class="step-actions"><button class="btn-continue" data-next>Continue →</button></div>
    </div>

    <!-- STEP 2: MEMBERS -->
    <div class="form-step" data-step="1" hidden>
      <div class="step-head">
        <div class="step-eyebrow">02 / 03 · Members</div>
        <h1>Add your teammates</h1>
        <p>Up to four members, each with a name, role and photo.</p>
      </div>
      <div id="q-members"></div>
      <button class="add-member-btn" id="q-addMember">+ Add Member</button>
      <div class="field-error" id="err-q-members">Please add at least one member with a name and photo.</div>
      <div class="step-actions"><button class="btn-back-sec" data-prev>← Back</button><button class="btn-continue" data-next>Continue →</button></div>
    </div>

    <!-- STEP 3: PREVIEW -->
    <div class="form-step" data-step="2" hidden>
      <div class="step-head">
        <div class="step-eyebrow">03 / 03 · Preview</div>
        <h1>Review your squad</h1>
        <p>Make sure everything looks right before we generate your pass.</p>
      </div>
      <div class="summary-list" id="q-summary"></div>
      <div class="step-actions"><button class="btn-back-sec" data-prev>← Back</button><button class="btn-continue" id="q-generateBtn">Generate Squad ID</button></div>
    </div>
  </div></div>
  <svg class="beach-svg sway" aria-hidden="true" style="left:-36px;bottom:-16px;width:170px;opacity:.28" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF7EA"><rect x="92" y="60" width="10" height="150" rx="4"/><path d="M97 60 C60 30 20 40 5 20 C40 10 80 30 97 55Z"/><path d="M97 60 C50 55 20 80 0 70 C25 45 70 45 97 55Z"/><path d="M97 60 C70 90 60 130 30 140 C40 100 65 70 97 55Z"/><path d="M97 60 C130 40 170 50 190 25 C155 15 115 30 97 55Z"/></g></svg>
  <svg class="beach-svg sway sway2" aria-hidden="true" style="right:-42px;top:14%;width:190px;opacity:.22" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><g fill="#FFE98A"><rect x="92" y="70" width="10" height="150" rx="4"/><path d="M97 70 C60 40 20 50 5 30 C40 20 80 40 97 65Z"/><path d="M97 70 C50 65 20 90 0 80 C25 55 70 55 97 65Z"/><path d="M97 70 C70 100 60 140 30 150 C40 110 65 80 97 65Z"/><path d="M97 70 C130 50 170 60 190 35 C155 25 115 40 97 65Z"/></g></svg>
</section>

<!-- ============ GENERATION OVERLAY ============ -->
<div id="genOverlay">
  <div class="gen-word" id="genWord">Building your ID...</div>
  <div class="gen-bar"><i></i></div>
</div>

<!-- ============ RESULT ============ -->
<section class="screen" id="screen-result">
  <div class="pass-wrap">
    <div class="pass-stage">
      <div class="stage-box" id="stageBox">
        <canvas id="resultCanvas" width="1000" height="1400"></canvas>
      </div>
      <div class="drag-hint">Photo is set — <b>edit photo</b> below to reposition</div>
    </div>
    <div class="pass-panel">
      <div class="ready-tag">Your HH Goa ID is ready</div>
      <div class="panel-title" id="resultTitle">Your Pass</div>
      <div class="panel-sub">Download it, share it, or head back to make changes.</div>
      <div class="pass-actions">
        <button class="pbtn pbtn-primary" id="downloadBtn">Download Pass (PNG)</button>
        <button class="pbtn pbtn-secondary" id="shareBtn">Share Your Pass</button>
        <button class="pbtn pbtn-secondary" id="editBtn">Edit Details</button>
        <button class="pbtn-ghost" id="rerollBtn">↻ Re-draw tier &amp; class</button>
        <button class="pbtn-ghost" id="startOverBtn">Start a new pass</button>
      </div>
    </div>
  </div>
  <svg class="beach-svg sway" aria-hidden="true" style="left:-40px;bottom:-18px;width:180px;opacity:.24" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><g fill="#FFF7EA"><rect x="92" y="60" width="10" height="150" rx="4"/><path d="M97 60 C60 30 20 40 5 20 C40 10 80 30 97 55Z"/><path d="M97 60 C50 55 20 80 0 70 C25 45 70 45 97 55Z"/><path d="M97 60 C70 90 60 130 30 140 C40 100 65 70 97 55Z"/><path d="M97 60 C130 40 170 50 190 25 C155 15 115 30 97 55Z"/></g></svg>
</section>

<footer>HH GOA 2026 · Digital ID Generator · unofficial fan-made experience for #FrameInGoa</footer>

<div id="qrHidden" style="display:none;"></div>`;
