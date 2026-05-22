/* ============================================================
   30-Day Data Engineering Roadmap — script.js
   Vanilla JavaScript | No dependencies
   ============================================================ */

'use strict';

/* ============================================================
   1. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ============================================================
   2. STICKY NAVBAR + ACTIVE LINK HIGHLIGHT
   ============================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('section[id], footer[id]');

  // Add scrolled class for shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active link on scroll via IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => observer.observe(sec));

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 70;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // Close mobile menu
        closeMobileMenu();
      }
    });
  });
}

/* ============================================================
   3. HAMBURGER / MOBILE MENU
   ============================================================ */
function initHamburger() {
  const btn     = document.getElementById('hamburger');
  const menu    = document.getElementById('nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('nav-links');
  if (btn && menu) {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  }
}

/* ============================================================
   4. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  // Reveal whole sections
  const revealSections = document.querySelectorAll('.reveal');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  revealSections.forEach(el => sectionObserver.observe(el));

  // Staggered reveal for grid items
  const revealItems = document.querySelectorAll('.reveal-item');
  const itemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger based on index within parent
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal-item'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          itemObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealItems.forEach(el => itemObserver.observe(el));
}

/* ============================================================
   5. ACCORDION
   ============================================================ */
function initAccordion() {
  const accordion = document.getElementById('accordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.acc-item');

  items.forEach(item => {
    const btn     = item.querySelector('.acc-btn');
    const content = item.querySelector('.acc-content');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      items.forEach(other => {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          const c = other.querySelector('.acc-content');
          if (c) c.style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        // Smooth scroll into view if needed
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.top < 80) {
            window.scrollBy({ top: rect.top - 90, behavior: 'smooth' });
          }
        }, 400);
      }
    });
  });
}

/* ============================================================
   6. ANIMATED COUNTER (Hero Stats)
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const step     = 16;
  const steps    = duration / step;
  const increment = target / steps;
  let current    = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    }
  }, step);
}

/* ============================================================
   7. SKILL CHECKLIST PROGRESS BAR
   ============================================================ */
function initChecklist() {
  const checkboxes = document.querySelectorAll('.check-box');
  const countEl    = document.getElementById('ckl-count');
  const barEl      = document.getElementById('ckl-bar');

  if (!checkboxes.length || !countEl || !barEl) return;

  function updateProgress() {
    const checked = document.querySelectorAll('.check-box:checked').length;
    const total   = checkboxes.length;
    const pct     = Math.round((checked / total) * 100);

    countEl.textContent = checked + ' / ' + total;
    barEl.style.width   = pct + '%';
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateProgress);
  });

  updateProgress(); // Init
}

/* ============================================================
   8. HERO SMOOTH SCROLL CTA
   ============================================================ */
function initHeroCTA() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   9. KEYBOARD ACCESSIBILITY — Close menu on Escape
   ============================================================ */
function initKeyboardAccessibility() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMobileMenu();

      // Close all open accordions
      document.querySelectorAll('.acc-item.open').forEach(item => {
        item.classList.remove('open');
        const c = item.querySelector('.acc-content');
        if (c) c.style.maxHeight = '0';
      });
    }
  });
}

/* ============================================================
   10. PIPELINE NODE HOVER LABELS
   ============================================================ */
function initPipelineNodes() {
  const nodes = document.querySelectorAll('.pip-node');
  nodes.forEach((node, i) => {
    node.style.animationDelay = (i * 0.15) + 's';
  });
}

/* ============================================================
   11. RIPPLE EFFECT — on click for buttons, cards, nav links
   ============================================================ */
function initRipple() {
  // Elements that get ripple on click
  const rippleTargets = document.querySelectorAll(
    '.btn-primary, .btn-ghost, .acc-btn, .team-card, .ov-card, .int-card, .comp-card, .week-block, .check-item, .supervisor-card, .nav-links a, .footer-nav a'
  );

  rippleTargets.forEach(el => {
    // Make sure element can contain the ripple
    const pos = getComputedStyle(el).position;
    if (pos === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';

    el.addEventListener('click', function(e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-fx');

      const rect   = el.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(0, 200, 255, 0.18);
        transform: scale(0);
        animation: ripplePop 0.55s ease-out forwards;
        pointer-events: none;
        z-index: 9999;
      `;

      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject keyframe if not already present
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripplePop {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================================
   12. TOOLTIP ON HOVER — show detail tooltip on interactive cards
   ============================================================ */
function initTooltips() {
  // Cards that show a floating tooltip on hover
  const tooltipData = {
    '.pip-node:nth-child(1)':  'Data Sources: APIs, DBs, Files, Streams',
    '.pip-node:nth-child(3)':  'Extract · Transform · Load pipeline',
    '.pip-node:nth-child(5)':  'Data Lake: S3 / Bronze-Silver-Gold',
    '.pip-node:nth-child(7)':  'Cloud DWH: Redshift / BigQuery',
    '.pip-node:nth-child(9)':  'BI & Dashboards: Tableau / Looker',
    '.arch-node:nth-child(1)': 'Kafka: real-time event streaming',
    '.arch-node:nth-child(3)': 'Spark: distributed data processing',
    '.arch-node:nth-child(5)': 'S3 Data Lake with medallion layers',
    '.arch-node:nth-child(7)': 'Redshift: columnar analytics DWH',
    '.arch-node:nth-child(9)': 'Business Intelligence & reporting',
    '.cp-circle:nth-child(1)': 'Week 1 milestone: ETL pipeline done',
    '.cp-circle:nth-child(4)': 'Week 2 milestone: Spark pipeline done',
    '.cp-circle:nth-child(7)': 'Week 3 milestone: Cloud ETL done',
    '.cp-circle:nth-child(10)':'🎉 Day 30: Job-ready Data Engineer!',
  };

  // Create tooltip element
  const tip = document.createElement('div');
  tip.id = 'global-tooltip';
  tip.style.cssText = `
    position: fixed;
    background: rgba(8, 15, 23, 0.95);
    border: 1px solid rgba(0, 200, 255, 0.4);
    color: #c8d8e8;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    padding: 0.5rem 0.85rem;
    border-radius: 6px;
    pointer-events: none;
    z-index: 9000;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    max-width: 220px;
    line-height: 1.5;
    backdrop-filter: blur(8px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    white-space: normal;
  `;
  document.body.appendChild(tip);

  Object.entries(tooltipData).forEach(([selector, text]) => {
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      el.addEventListener('mouseenter', e => {
        tip.textContent = text;
        tip.style.opacity = '1';
        tip.style.transform = 'translateY(0)';
        moveTip(e);
      });
      el.addEventListener('mousemove', moveTip);
      el.addEventListener('mouseleave', () => {
        tip.style.opacity = '0';
        tip.style.transform = 'translateY(6px)';
      });
    });
  });

  function moveTip(e) {
    const x = e.clientX + 14;
    const y = e.clientY + 14;
    const vw = window.innerWidth;
    const tw = tip.offsetWidth;
    tip.style.left = (x + tw > vw - 10 ? x - tw - 28 : x) + 'px';
    tip.style.top  = y + 'px';
  }
}

/* ============================================================
   INIT — Run everything on DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initHamburger();
  initScrollReveal();
  initAccordion();
  initCounters();
  initChecklist();
  initHeroCTA();
  initKeyboardAccessibility();
  initPipelineNodes();

  initRipple();
  initTooltips();

  console.log('%c[DE30] Data Engineering Roadmap Loaded ✓', 
    'color: #00c8ff; font-family: monospace; font-size: 14px; font-weight: bold;');
});
