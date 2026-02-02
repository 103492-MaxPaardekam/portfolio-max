// ============================================
// MaxOS Desktop Portfolio JavaScript
// ============================================

// State Management
let activeWindow = null;
let highestZIndex = 100;
const openWindows = new Set();
let isLocked = true;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initLockScreen();
  initClock();
  initDock();
  initDesktopIcons();
  initWindows();
  initParallax();
  initContactForm();
});

// ============================================
// Lock Screen
// ============================================
function initLockScreen() {
  updateLockClock();
  setInterval(updateLockClock, 1000);

  const lockscreen = document.getElementById("lockscreen");
  const lockUser = document.querySelector(".lock-user");
  const passwordInput = document.getElementById("lockPassword");

  // Auto-focus password input on load
  setTimeout(() => {
    passwordInput?.focus();
  }, 500);

  // Focus password input when clicking avatar
  if (lockUser) {
    lockUser.addEventListener("click", (e) => {
      if (e.target !== passwordInput) {
        passwordInput?.focus();
      }
    });
  }

  // Handle password input submission
  if (passwordInput) {
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkPasswordAndUnlock();
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (isLocked && e.key === " ") {
      e.preventDefault();
      checkPasswordAndUnlock();
    }
  });

  function checkPasswordAndUnlock() {
    const password = passwordInput?.value || "";

    if (password === "password") {
      unlockScreen();
    } else {
      // Show error animation
      passwordInput?.classList.add("error");
      setTimeout(() => {
        passwordInput?.classList.remove("error");
      }, 500);
      // Clear password field
      if (passwordInput) passwordInput.value = "";
    }
  }

  function unlockScreen() {
    if (!isLocked) return;

    isLocked = false;
    lockscreen.classList.add("unlocking");

    setTimeout(() => {
      lockscreen.style.display = "none";
      // Open home window after unlock
      setTimeout(() => openWindow("home"), 300);
    }, 500);
  }
}

function updateLockClock() {
  const now = new Date();

  // Update time
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const lockTimeEl = document.getElementById("lockTime");
  if (lockTimeEl) {
    lockTimeEl.textContent = `${hours}:${minutes}`;
  }

  // Update date
  const options = { weekday: "long", month: "long", day: "numeric" };
  const dateString = now.toLocaleDateString("en-US", options);
  const lockDateEl = document.getElementById("lockDate");
  if (lockDateEl) {
    lockDateEl.textContent = dateString;
  }
}

// ============================================
// Clock
// ============================================
function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  const timeString = now.toLocaleString("en-US", options).replace(",", "");
  const clockElement = document.getElementById("menuTime");
  if (clockElement) {
    clockElement.textContent = timeString;
  }
}

// ============================================
// Dock Functionality
// ============================================
function initDock() {
  const dockItems = document.querySelectorAll(".dock-item:not(.dock-link)");
  const allDockItems = document.querySelectorAll(".dock-item, .dock-separator");

  // Add click handlers
  dockItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const windowName = item.dataset.window;
      if (windowName) {
        toggleWindow(windowName);
      }
    });
  });

  // Add dynamic separation effect
  allDockItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      allDockItems.forEach((otherItem, otherIndex) => {
        if (otherIndex === index) return;

        const distance = Math.abs(otherIndex - index);
        const direction = otherIndex > index ? 1 : -1;

        if (distance === 1) {
          // Immediate neighbors
          otherItem.style.transform = `translateX(${direction * 8}px) translateY(-6px) scale(1.05)`;
        } else if (distance === 2) {
          // Second neighbors
          otherItem.style.transform = `translateX(${direction * 12}px) scale(1.02)`;
        } else if (distance === 3) {
          // Third neighbors - slight movement
          otherItem.style.transform = `translateX(${direction * 6}px)`;
        }
      });
    });

    item.addEventListener("mouseleave", () => {
      allDockItems.forEach((otherItem) => {
        otherItem.style.transform = "";
      });
    });
  });
}

// ============================================
// Desktop Icons Functionality
// ============================================
function initDesktopIcons() {
  const desktopIcons = document.querySelectorAll(".desktop-icon");

  desktopIcons.forEach((icon) => {
    // Single click to select, double click to open
    let clickTimeout;
    let clickCount = 0;

    icon.addEventListener("click", (e) => {
      e.preventDefault();
      clickCount++;

      if (clickCount === 1) {
        // Single click - select icon
        desktopIcons.forEach((i) => i.classList.remove("selected"));
        icon.classList.add("selected");

        clickTimeout = setTimeout(() => {
          clickCount = 0;
        }, 300);
      } else if (clickCount === 2) {
        // Double click - open window
        clearTimeout(clickTimeout);
        clickCount = 0;
        const windowName = icon.dataset.window;
        if (windowName) {
          openWindow(windowName);
        }
      }
    });
  });

  // Clear selection when clicking desktop
  document.querySelector(".desktop").addEventListener("click", (e) => {
    if (
      e.target.classList.contains("desktop") ||
      e.target.id === "windows-container"
    ) {
      desktopIcons.forEach((icon) => icon.classList.remove("selected"));
    }
  });
}

// ============================================
// Window Management
// ============================================
function initWindows() {
  const windows = document.querySelectorAll(".draggable-window");

  windows.forEach((windowEl) => {
    makeWindowDraggable(windowEl);
    initWindowControls(windowEl);

    // Click to focus
    windowEl.addEventListener("mousedown", () => {
      bringToFront(windowEl);
    });
  });
}

function openWindow(windowName) {
  const windowEl = document.getElementById(`${windowName}-window`);
  if (!windowEl) return;

  // If already open, just bring to front
  if (openWindows.has(windowName)) {
    bringToFront(windowEl);
    return;
  }

  // Position window
  positionWindow(windowEl);

  // Show window
  windowEl.style.display = "block";
  windowEl.style.opacity = "0";
  windowEl.style.transform = "scale(0.8)";

  setTimeout(() => {
    windowEl.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
    windowEl.style.opacity = "1";
    windowEl.style.transform = "scale(1)";
  }, 10);

  // Bring to front
  bringToFront(windowEl);

  // Mark as open
  openWindows.add(windowName);

  // Animate skill bars if skills window
  if (windowName === "skills") {
    setTimeout(() => animateSkillBars(), 300);
  }
}

function closeWindow(windowName) {
  const windowEl = document.getElementById(`${windowName}-window`);
  if (!windowEl) return;

  windowEl.style.transition = "all 0.25s ease-out";
  windowEl.style.opacity = "0";
  windowEl.style.transform = "scale(0.8)";

  setTimeout(() => {
    windowEl.style.display = "none";
    windowEl.style.transition = "";
    openWindows.delete(windowName);
  }, 250);
}

function toggleWindow(windowName) {
  if (openWindows.has(windowName)) {
    const windowEl = document.getElementById(`${windowName}-window`);
    if (activeWindow === windowEl) {
      // If it's the active window, close it
      closeWindow(windowName);
    } else {
      // If it's not active, just bring it to front
      bringToFront(windowEl);
    }
  } else {
    openWindow(windowName);
  }
}

function positionWindow(windowEl) {
  const desktop = document.querySelector(".desktop");
  const desktopRect = desktop.getBoundingClientRect();

  // Get window dimensions
  windowEl.style.display = "block";
  const windowRect = windowEl.getBoundingClientRect();
  windowEl.style.display = "none";

  // Calculate centered position with offset for multiple windows
  const openCount = openWindows.size;
  const offset = openCount * 30;

  const left = Math.max(
    20,
    Math.min(
      (desktopRect.width - windowRect.width) / 2 + offset,
      desktopRect.width - windowRect.width - 20,
    ),
  );

  const top = Math.max(
    20,
    Math.min(
      (desktopRect.height - windowRect.height) / 2 + offset,
      desktopRect.height - windowRect.height - 20,
    ),
  );

  windowEl.style.left = `${left}px`;
  windowEl.style.top = `${top}px`;
}

function bringToFront(windowEl) {
  if (activeWindow === windowEl) return;

  // Remove active class from all windows
  document.querySelectorAll(".draggable-window").forEach((w) => {
    w.classList.remove("active");
  });

  // Bring window to front
  highestZIndex++;
  windowEl.style.zIndex = highestZIndex;
  windowEl.classList.add("active");
  activeWindow = windowEl;
}

// ============================================
// Window Controls
// ============================================
function initWindowControls(windowEl) {
  const closeBtn = windowEl.querySelector(".window-control.close");
  const minimizeBtn = windowEl.querySelector(".window-control.minimize");
  const maximizeBtn = windowEl.querySelector(".window-control.maximize");

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const windowName = windowEl.dataset.window;
      closeWindow(windowName);
    });
  }

  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Minimize animation
      windowEl.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      windowEl.style.opacity = "0";
      windowEl.style.transform = "scale(0.3) translateY(100vh)";

      setTimeout(() => {
        windowEl.style.display = "none";
        windowEl.style.transition = "";
        windowEl.style.opacity = "1";
        windowEl.style.transform = "scale(1)";

        const windowName = windowEl.dataset.window;
        openWindows.delete(windowName);
      }, 400);
    });
  }

  if (maximizeBtn) {
    maximizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Toggle maximized state
      if (windowEl.dataset.maximized === "true") {
        // Restore
        windowEl.style.width = windowEl.dataset.originalWidth;
        windowEl.style.height = windowEl.dataset.originalHeight;
        windowEl.style.left = windowEl.dataset.originalLeft;
        windowEl.style.top = windowEl.dataset.originalTop;
        windowEl.dataset.maximized = "false";
      } else {
        // Maximize
        const desktop = document.querySelector(".desktop");
        const desktopRect = desktop.getBoundingClientRect();

        windowEl.dataset.originalWidth = windowEl.style.width || "";
        windowEl.dataset.originalHeight = windowEl.style.height || "";
        windowEl.dataset.originalLeft = windowEl.style.left;
        windowEl.dataset.originalTop = windowEl.style.top;

        windowEl.style.width = `${desktopRect.width - 40}px`;
        windowEl.style.height = `${desktopRect.height - 40}px`;
        windowEl.style.left = "20px";
        windowEl.style.top = "20px";
        windowEl.dataset.maximized = "true";
      }
    });
  }
}

// ============================================
// Draggable Windows
// ============================================
function makeWindowDraggable(windowEl) {
  const titlebar = windowEl.querySelector(".window-titlebar");
  if (!titlebar) return;

  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  titlebar.addEventListener("mousedown", dragStart);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", dragEnd);

  function dragStart(e) {
    // Don't drag if clicking on controls
    if (e.target.classList.contains("window-control")) return;

    // Don't drag if maximized
    if (windowEl.dataset.maximized === "true") return;

    isDragging = true;
    bringToFront(windowEl);

    const rect = windowEl.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;

    titlebar.style.cursor = "grabbing";
    windowEl.style.transition = "none";
  }

  function drag(e) {
    if (!isDragging) return;

    e.preventDefault();

    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    // Constrain to desktop
    const desktop = document.querySelector(".desktop");
    const desktopRect = desktop.getBoundingClientRect();
    const windowRect = windowEl.getBoundingClientRect();

    const maxX = desktopRect.width - windowRect.width;
    const maxY = desktopRect.height - windowRect.height;

    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));

    windowEl.style.left = `${currentX}px`;
    windowEl.style.top = `${currentY}px`;
  }

  function dragEnd() {
    if (!isDragging) return;

    isDragging = false;
    titlebar.style.cursor = "move";
    windowEl.style.transition = "";
  }
}

// ============================================
// Skill Bars Animation
// ============================================
function animateSkillBars() {
  const skillFills = document.querySelectorAll(".skill-fill");

  skillFills.forEach((fill, index) => {
    const progress = fill.dataset.progress;

    setTimeout(() => {
      fill.style.setProperty("--progress", `${progress}%`);
      fill.classList.add("animated");
    }, index * 100);
  });
}

// ============================================
// Parallax Background
// ============================================
function initParallax() {
  const orbs = document.querySelectorAll(".gradient-orb");

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 15;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;

      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate
    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email", "error");
      return;
    }

    // Simulate sending
    showNotification("Message sent successfully!", "success");
    form.reset();

    // In real app, send to server:
    // fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
  });
}

function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  const text = document.getElementById("notification-text");

  if (!notification || !text) return;

  text.textContent = message;
  notification.className = `notification ${type}`;

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// ============================================
// Keyboard Shortcuts
// ============================================
document.addEventListener("keydown", (e) => {
  // Cmd/Ctrl + W to close active window
  if ((e.metaKey || e.ctrlKey) && e.key === "w" && activeWindow) {
    e.preventDefault();
    const windowName = activeWindow.dataset.window;
    closeWindow(windowName);
  }

  // Esc to close active window
  if (e.key === "Escape" && activeWindow) {
    const windowName = activeWindow.dataset.window;
    closeWindow(windowName);
  }

  // Number keys to open windows
  const windowMap = {
    1: "home",
    2: "about",
    3: "skills",
    4: "projects",
    5: "contact",
  };

  if (e.key in windowMap && !e.metaKey && !e.ctrlKey && !e.altKey) {
    // Check if not typing in an input
    if (!["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      toggleWindow(windowMap[e.key]);
    }
  }
});

// ============================================
// Utility Functions
// ============================================

// Expose window functions globally for onclick attributes
window.openWindow = openWindow;
window.closeWindow = closeWindow;
window.toggleWindow = toggleWindow;

// Log startup
console.log(
  "%cMaxOS Portfolio",
  "font-size: 20px; font-weight: bold; color: #007AFF;",
);
console.log(
  "%cWelcome to my portfolio! 🚀",
  "font-size: 14px; color: #667eea;",
);
console.log("%cKeyboard shortcuts:", "font-weight: bold; margin-top: 10px;");
console.log("  • 1-5: Open windows");
console.log("  • ESC or Cmd+W: Close active window");
console.log("  • Click and drag titlebar to move windows");
console.log("  • Click dock icons to toggle windows");
