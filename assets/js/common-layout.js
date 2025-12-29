(function () {

  const layoutHTML = `
  <header class="top-header">
<div class="logo"><a href="index.html">
  <span class="logo-main">TIC</span><span class="logo-dot">.</span>
  <span class="logo-sub">Kar</span></a>
</div>
    <nav class="top-nav">
      <a href="/index.html" class="desk-nav-item">Home</a>
      <a href="/mtp-rtp.html">RTP/MTP</a>
      <a href="javascript:void(0)" onclick="openSettings()">Settings</a>
      <a href="/About-us.html">About</a>
      <a href="/contact.html">Drop Suggestion</a>
      <a href="/Sponsor.html">Sponsor</a>

    </nav>
      <!-- RIGHT : ICON ACTIONS -->
  <div class="top-actions">

<button class="icon-btn" id="notifyBtn" title="Notifications">
  <i class="fa-regular fa-bell"></i>
  <span class="notify-dot"></span>
</button>

<button class="icon-btn" id="themeBtn" title="Theme">
  <i class="fa-solid fa-moon"></i>
</button>

    <div class="profile-wrap">
      <button class="icon-btn profile-btn" id="profileBtn" title="Profile">
        <i class="fa-solid fa-user"></i>
      </button>

      <!-- PROFILE POPUP -->
      <div class="profile-popup" id="profilePopup">
        <a href="/profile.html">My Profile</a>
        <a href="/performance.html">My Performance</a>
        <a href="/bookmarks.html">Bookmarks</a>
        <a href="/correction-test.html">Correction Test</a>
        <a href="#">Saved Tests</a>
        <a href="#">Account Settings</a>
        <hr>
        <a href="javascript:void(0)" class="auth-logout">Logout</a>
      </div>
    </div>

  </div>
<div class="mobile-header-actions">
  <button class="icon-btn" id="notifyBtnMobile" title="Notifications">
    <i class="fa-regular fa-bell"></i>
  </button>

  <button id="menuBtn" class="menu-btn" aria-label="Menu">
    <span></span>
    <span></span>
    <span></span>
  </button>
</div>
  </header>
<!-- ===== NOTIFICATION PANEL ===== -->
<!-- ===== NOTIFICATION PANEL ===== -->
<div id="notifyPanel" class="notify-panel">
  <div class="notify-header">
    <span>Notifications</span>
    <button id="notifyClose">×</button>
  </div>

<div id="notifyList" class="notify-list">
<div class="notify-item">
  <p class="notify-text"></p>
  <small class="notify-time"></small>
</div>
    </div>
    
  </div>

<!-- ===== Left Open Strip ===== -->
<div id="leftStrip" class="left-strip">
  <div class="grab-line"></div>
</div>

<!-- ===== Left Sidebar ===== -->
<aside id="leftSidebar" class="left-sidebar">
  <div class="sidebar-header">
    <span class="menu-main">Student</span>
    <span class="menu-dot">.</span>
    <span class="menu-sub">Functions</span>
  </div>
  <hr class="sidebar-hr" />

<ul class="sidebar-list">
<li class="admin-only admin-dropdown" style="display:none;">
  <button class="admin-toggle" id="adminToggle">
    <i class="fa-solid fa-shield-halved"></i>
    <span>I'm Admin</span>
  </button>

  <div class="admin-menu" id="adminMenu">
    <a href="/admin/push-noti.html">Push Notifications</a>
    <a href="/admin/test-setup.html">Temp Test</a>
  </div>
</li>
  <li class="mobile-left">
    <a href="/profile.html">
      <i class="fa-solid fa-user"></i>
      <span>My Profile</span>
    </a>
  </li>
  <li class="mobile-left">
    <a href="/performance.html">
      <i class="fa-solid fa-chart-line"></i>
      <span>My Performance</span>
    </a>
  </li>

  <li class="mobile-left">
    <a href="/bookmarks.html">
      <i class="fa-solid fa-star"></i>
      <span>Bookmarks</span>
    </a>
  </li>
  <li class="mobile-left">
    <a href="/correction-test.html">
      <i class="fa-solid fa-pen-to-square"></i>
      <span>Take a Correction Test</span>
    </a>
  </li>

  <li class="mobile-left">
    <a href="/articles.html">
      <i class="fa-solid fa-newspaper"></i>
      <span>Articles</span>
    </a>
  </li>
    <li class="mobile-left"><a href="/thoughts.html"><i class="fa-regular fa-comment-dots"></i><span>Drop Thoughts</span></a></li>
    <li class="desktop-left"><a href="/chapters.html"><i class="fa-solid fa-book"></i>
    <span>Chapters</span></a>
</li>
    <li class="desktop-left"><a href="/mtp-rtp.html"><i class="fa-solid fa-file-lines"></i><span>RTP / MTP</span></a></li>
  <li class="desktop-left"><a href="/articles.html"><i class="fa-solid fa-newspaper"></i><span>Articles</span></a></li>
  <li class="desktop-left"><a href="/About-us.html"><i class="fa-solid fa-circle-info"></i><span>About</span></a></li>
  <li class="desktop-left"><a href="javascript:void(0)" onclick="openSettings()"><i class="fa-solid fa-gear"></i><span>Settings</span></a></li>
  <li class="desktop-left"><a href="/contact.html"><i class="fa-solid fa-comment"></i><span>Suggestions</span></a></li>
  <li class="desktop-left"><a href="/sponsor-us.html"><i class="fa-solid fa-hand-holding-heart"></i>
    <span>Sponsor Us</span></a>
</li>
    <div class="thought-hint">
  <div class="thought-arrow"></div>
  <p>
    Want to drop opinions<br>
    <span>anonymously?</span>
  </p>
</div>
<div class="auth-actions">
  <a href="javascript:void(0)" class="auth-btn login-btn auth-login" onclick="openAuth()">Login</a>
  <a href="javascript:void(0)" class="auth-btn signup-btn auth-signup" onclick="openAuth()">Sign Up</a>
  <a href="javascript:void(0)" class="auth-btn login-btn auth-logout" style="display:none;">LogOut</a>
</div>
</ul>

</aside>
  <!-- ===== Right Sidebar ===== -->
  <aside id="rightSidebar" class="right-sidebar">
<div class="sidebar-header">
  <span class="menu-main">TIC</span>
  <span class="menu-dot">.</span>
  <span class="menu-sub">Menu</span>

</div>
    <hr class="sidebar-hr" />
<ul class="sidebar-list">
  <li><a href="/index.html">Home</a></li>
  <li><a href="/chapters.html">Chapters</a></li>
  <li><a href="/mtp-rtp.html">RTP / MTP</a></li>
  <li><a href="/About-us.html">About Us</a></li>
  <li><a href="javascript:void(0)" onclick="openSettings()">Settings</a></li>
  <li><a href="/contact.html">Suggestions / Contact</a></li>
    <li><a href="/sponsor-us.html">Sponsor Us</a></li>
  <div class="thought-hint right-hint">
  <div class="thought-arrow right-arrow"></div>
  <p>
    Have a suggestion or issue?<br>
    <span>Reach us anytime.</span>
  </p>
</div><br>
      <hr class="sidebar-hr" />
<div class="theme-toggle">
  <span>Dark Mode</span>
  <div class="theme-switch" id="themeToggle">
    <div class="switch-knob"></div>
  </div>
</div>
<div class="auth-actions auth-actions-right">
  <a href="javascript:void(0)" class="auth-btn login-btn auth-login" onclick="openAuth()">Login</a>
  <a href="javascript:void(0)" class="auth-btn signup-btn auth-signup" onclick="openAuth()">Sign Up</a>
  <a href="javascript:void(0)" class="auth-btn login-btn auth-logout" style="display:none;">LogOut</a>
</div>

</ul>
  </aside>

  <!-- ===== Overlay ===== -->
  <div id="overlay"></div>
<div id="leftOverlay" class="side-overlay"></div>
<!-- ===== AUTH POPUP ===== -->
<!-- ===== SETTINGS MODAL ===== -->
<div id="settingsModal" class="settings-modal">
  <div class="settings-box">

    <button class="settings-close" id="settingsClose">×</button>

    <h2 class="settings-title">Settings</h2>

    <p class="settings-sub">PERSONALIZATION</p>

    <div class="settings-item">
      <span>Randomize Questions</span>
      <div class="toggle-switch active"></div>
    </div>

    <div class="settings-item">
      <span>Randomize Options</span>
      <div class="toggle-switch active"></div>
    </div>

    <div class="settings-item">
      <span>Show A / B / C / D</span>
      <div class="toggle-switch active"></div>
    </div>

    <div class="settings-item">
      <span>
        Question Timer<br>
        <small>(Current: 45s)</small>
      </span>
      <div class="toggle-switch active"></div>
    </div>

    <div class="settings-item">
      <span>RTP / MTP Exam Mode<br><small>100 Q = 120 mins</small></span>
      <div class="toggle-switch"></div>
    </div>

    <div class="settings-item">
      <span>Auto-Skip to Next</span>
      <div class="toggle-switch active"></div>
    </div>

  </div>
</div>
<div id="authModal" class="auth-modal">
<div class="sheet-handle"></div>
  <div class="auth-box">

    <button class="auth-close" id="authClose">×</button>

    <h2 id="authTitle">Login</h2>

    <button class="google-btn">
      <i class="fa-brands fa-google"></i>
      Continue with Google
    </button>

    <div class="auth-divider">
      <span>OR</span>
    </div>

    <!-- LOGIN FORM -->
<form id="loginForm" class="auth-form">
  <input type="text" id="loginUsername" placeholder="Username or Email" required>

  <div class="password-field">
    <input type="password" id="loginPassword" placeholder="Password" required>
    <i class="fa-solid fa-eye toggle-pass"></i>
  </div>

  <p class="auth-error" id="loginError"></p>

  <button type="submit" class="primary-btn">Login</button>
</form>

    <!-- SIGNUP FORM -->
<form id="signupForm" class="auth-form hidden">
  <input type="text" id="signupUsername" placeholder="Username" required>
  <input type="email" id="signupEmail" placeholder="Email" required>

  <div class="password-field">
    <input type="password" id="signupPassword" placeholder="Password" required>
    <i class="fa-solid fa-eye toggle-pass"></i>
  </div>

  <div class="password-field">
    <input type="password" id="signupPassword2" placeholder="Re-enter Password" required>
    <i class="fa-solid fa-eye toggle-pass"></i>
  </div>
<!-- OTP INLINE (hidden by default)
<div id="otpInlineBox" class="password-field hidden">
  <input
    type="text"
    id="otpInput"
    placeholder="Enter 4-digit OTP"
    maxlength="4"
    inputmode="numeric"
    style="
      text-align:center;
      letter-spacing:6px;
      font-size:13px;
    "
  />
  <p class="auth-error" id="otpError"></p>
</div> ----->
  <p class="auth-error" id="signupError"></p>

  <button type="submit" class="primary-btn">Sign Up</button>
</form>

    <p class="auth-switch">
      <span id="switchText">Not have an account?</span>
      <button id="switchAuth">Sign Up</button>
    </p>

  </div>
</div>

  `;

  document.body.insertAdjacentHTML("afterbegin", layoutHTML);

})();
const adminToggle = document.getElementById("adminToggle");
const adminMenu = document.getElementById("adminMenu");

if (adminToggle && adminMenu) {
  // Toggle on click
  adminToggle.addEventListener("click", e => {
    e.stopPropagation(); // prevent document click
    adminMenu.classList.toggle("open");
  });

  // Prevent closing when clicking inside menu
  adminMenu.addEventListener("click", e => {
    e.stopPropagation();
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    adminMenu.classList.remove("open");
  });
}
function injectTempTestItem(show) {
  // already injected?
  const existing = document.querySelectorAll(".temp-test-item");

  // REMOVE if not live
  if (!show) {
    existing.forEach(el => el.remove());
    return;
  }

  // CREATE item
  const liHTML = `
    <li class="temp-test-item">
      <a href="/temp-test.html">
        <i class="fa-solid fa-bolt"></i>
        <span>Temp Test</span>
      </a>
    </li>
  `;

  // 👉 mobile-left
  document.querySelectorAll(".sidebar-list").forEach(list => {
    if (!list.querySelector(".temp-test-item")) {
      list.insertAdjacentHTML("afterbegin", liHTML);
    }
  });
}