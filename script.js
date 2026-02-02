// ============================================
// macOS 26 Impressive Portfolio JavaScript
// ============================================

console.log('%c🚀 Portfolio Loading...', 'font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; color: transparent;');

// Update menu bar time
function updateTime() {
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
  const timeString = now.toLocaleDateString('en-US', options);
  const timeElement = document.getElementById('menuTime');
  if (timeElement) {
    timeElement.textContent = timeString;
  }
}

// Update time every minute
setInterval(updateTime, 60000);
updateTime();

// Dock magnification effect
const dock = document.querySelector('.dock-container');
const dockItems = document.querySelectorAll('.dock-item');

if (dock && dockItems.length > 0) {
  dockItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      
      dockItems.forEach(otherItem => {
        const otherRect = otherItem.getBoundingClientRect();
        const otherCenterX = otherRect.left + otherRect.width / 2;
        const distance = Math.abs(itemCenterX - otherCenterX);
        const maxDistance = 200;
        const scale = Math.max(1, 1.8 - (distance / maxDistance) * 0.8);
        
        otherItem.style.transform = `translateY(-${(scale - 1) * 20}px) scale(${scale})`;
      });
    });
  });

  dock.addEventListener('mouseleave', () => {
    dockItems.forEach(item => {
      item.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Smooth scrolling with easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      const targetPosition = target.offsetTop - 100;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Animated skill bars with IntersectionObserver
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const skillFill = entry.target;
      const progress = skillFill.getAttribute('data-progress');
      
      // Animate the width
      setTimeout(() => {
        skillFill.style.width = progress + '%';
      }, 100);
      
      skillObserver.unobserve(skillFill);
    }
  });
}, {
  threshold: 0.5
});

// Observe all skill bars
document.querySelectorAll('.skill-fill').forEach(bar => {
  skillObserver.observe(bar);
});

// Window animations on scroll
const windowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.window-section').forEach(section => {
  windowObserver.observe(section);
});

// Floating card animations
const floatingCards = document.querySelectorAll('.floating-card');

floatingCards.forEach((card, index) => {
  const randomDelay = index * 0.2;
  const randomDuration = 3 + Math.random() * 2;
  
  card.style.animationDelay = `${randomDelay}s`;
  card.style.animationDuration = `${randomDuration}s`;
});

// Parallax effect for background orbs
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateOrbs() {
  const orbs = document.querySelectorAll('.gradient-orb');
  
  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 15;
    const xMove = mouseX * speed;
    const yMove = mouseY * speed;
    
    orb.style.transform = `translate(${xMove}px, ${yMove}px)`;
  });
  
  requestAnimationFrame(animateOrbs);
}

animateOrbs();

// Form handling with validation
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validation
    if (!name || !email || !subject || !message) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate sending (replace with actual API call)
    setTimeout(() => {
      showNotification('Message sent successfully! 🎉', 'success');
      contactForm.reset();
      submitBtn.querySelector('span').textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Notification system
function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        ${type === 'success' 
          ? '<polyline points="20 6 9 17 4 12"/>' 
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
        }
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Window control interactions (visual only)
document.querySelectorAll('.window-control').forEach(control => {
  control.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = control.classList.contains('close') ? 'close' :
                   control.classList.contains('minimize') ? 'minimize' : 'maximize';
    
    showNotification(`This is a portfolio demo - ${action} action simulated!`, 'success');
  });
});

// Code preview typing effect
const codeLines = document.querySelectorAll('.code-line');
if (codeLines.length > 0) {
  codeLines.forEach((line, index) => {
    const text = line.textContent;
    line.textContent = '';
    line.style.opacity = '0';
    
    setTimeout(() => {
      line.style.opacity = '1';
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          line.textContent += text[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);
    }, index * 200);
  });
}

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.querySelector('.project-mockup').style.transform = 'scale(1.05) translateY(-5px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.querySelector('.project-mockup').style.transform = 'scale(1) translateY(0)';
  });
});

// Stat pills animation
const statPills = document.querySelectorAll('.stat-pill');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statPills.forEach(pill => {
  pill.style.opacity = '0';
  pill.style.transform = 'translateY(20px) scale(0.9)';
  pill.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  statObserver.observe(pill);
});

// Mesh gradient animation
const mesh = document.querySelector('.mesh-gradient');
if (mesh) {
  let hue = 0;
  
  setInterval(() => {
    hue = (hue + 1) % 360;
    mesh.style.filter = `hue-rotate(${hue}deg)`;
  }, 100);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + K to show keyboard shortcuts
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    showNotification('⌘K - This shortcut opens command palette (demo)', 'success');
  }
});

// Smooth reveal on load
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger hero section animation
  const heroWindow = document.querySelector('.hero-window');
  if (heroWindow) {
    setTimeout(() => {
      heroWindow.classList.add('visible');
    }, 300);
  }
});

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
    }
  }
});

try {
  perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
} catch (e) {
  // LCP not supported
}

// Add subtle cursor trail effect
const cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
  cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
  
  if (cursorTrail.length > trailLength) {
    cursorTrail.shift();
  }
});

console.log('%c✨ Portfolio Ready!', 'font-size: 16px; color: #34c759; font-weight: bold;');
console.log('%cBuilt with passion at Grafish Lyceum Rotterdam', 'font-size: 12px; color: #86868b;');
