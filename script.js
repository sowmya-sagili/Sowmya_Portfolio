/* ============================================================
   SOWMYA SAGILI — PORTFOLIO JAVASCRIPT
   Handles: Preloader, Navbar, Typing, Counters,
            Scroll Reveal, Modals, Back-to-Top
   ============================================================ */

'use strict';

/* ============================================================
   1. UTILITY HELPERS
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   2. PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = $('#preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      // Once hidden, run initial reveals and start counters
      setTimeout(() => {
        preloader.remove();
        initScrollReveal();
        initCounters();
      }, 650);
    }
  }, 1800);
});

/* ============================================================
   3. STICKY NAVBAR + ACTIVE LINK TRACKING
   ============================================================ */
const navbar = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

function updateNavbar() {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
}

function updateActiveLink() {
  const fromTop = window.scrollY + 100;
  sections.forEach(sec => {
    const { offsetTop, offsetHeight, id } = sec;
    const link = $(`a.nav-link[href="#${id}"]`);
    if (link) {
      const active = fromTop >= offsetTop && fromTop < offsetTop + offsetHeight;
      link.classList.toggle('active', active);
    }
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
  updateBackToTop();
}, { passive: true });

// Run on load
updateNavbar();
updateActiveLink();

/* ============================================================
   4. HAMBURGER MOBILE MENU
   ============================================================ */
const hamburger = $('#hamburger');
const navLinksEl = $('#nav-links');

if (hamburger && navLinksEl) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinksEl.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link')) {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navLinksEl.classList.contains('open')) {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   5. FADE ROLE SWITCHER (replaces typing animation)
   Cycles: AI/ML ENGINEER → DATA ANALYST → FULL STACK DEVELOPER
   Each role shows for 2.5 s, fades out in 300 ms, next fades in.
   ============================================================ */
const fadeRoles = ['AI/ML ENGINEER', 'DATA ANALYST', 'FULL STACK DEVELOPER'];
let fadeRoleIndex = 0;

function initFadeRoleSwitcher() {
  const items = $$('.role-item');
  if (!items.length) return;

  // Ensure only the first is visible on init
  items.forEach((el, i) => {
    el.classList.toggle('role-active', i === 0);
  });

  setInterval(() => {
    const current = $('.role-item.role-active');
    if (!current) return;

    // Fade out current
    current.classList.add('role-exiting');

    setTimeout(() => {
      current.classList.remove('role-active', 'role-exiting');
      fadeRoleIndex = (fadeRoleIndex + 1) % fadeRoles.length;
      const next = $(`#role-${fadeRoleIndex}`);
      if (next) next.classList.add('role-active');
    }, 350); // matches CSS transition

  }, 2800); // visible duration + transition
}

// Start after preloader clears
setTimeout(initFadeRoleSwitcher, 2000);


/* ============================================================
   6. SMOOTH SCROLL (progressive enhancement)
   ============================================================ */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();
  const offset = 80;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ============================================================
   7. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  const revealEls = $$('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   8. ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = $$('.achievement-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 2200;
  const startTime = performance.now();
  const startValue = 0;

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValue + (target - startValue) * eased;

    if (isDecimal) {
      el.textContent = current.toFixed(2) + suffix;
    } else {
      el.textContent = Math.floor(current) + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
    }
  }

  requestAnimationFrame(tick);
}

/* ============================================================
   9. BACK TO TOP BUTTON
   ============================================================ */
const backToTopBtn = $('#back-to-top');

function updateBackToTop() {
  if (backToTopBtn) {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   10. VIDEO MODAL
   ============================================================ */
const videoModal = $('#video-modal');
const modalVideo = $('#modal-video');
const modalVideoSrc = $('#modal-video-src');
const modalVideoTitle = $('#modal-video-title');

/**
 * Opens the video modal with the given video path and title.
 * @param {string} videoPath - Path to the .mp4 file
 * @param {string} title - Project title to display
 */
const videoModalDetails = $('#video-modal-details');

function openVideoModal(videoSrc) {
  if (!videoModal || !modalVideo) return;

  modalVideoSrc.src = videoSrc;
  modalVideo.load();
  // Play after a slight delay to allow modal to become visible
  setTimeout(() => modalVideo.play().catch(() => {}), 50);

  videoModal.classList.add('open');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  setTimeout(() => $('#video-modal-close')?.focus(), 100);
}

/**
 * Closes the video modal and pauses video playback.
 */
function closeVideoModal() {
  if (!videoModal) return;
  videoModal.classList.remove('open');
  videoModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
  }
}


// Project data for modals
const projectData = {
  1: {
    title: 'Hybrid Fake News Detector',
    category: 'AI & NLP',
    description: `A sophisticated AI-powered system that combats misinformation using a hybrid approach. 
    It combines traditional NLP techniques (TF-IDF vectorization, keyword analysis) with modern deep learning 
    models (LSTM networks) to classify news articles as real or fake with high accuracy. The system analyzes 
    both content and source credibility to provide comprehensive verdicts.`,
    architecture: 'NLP Pipeline → Feature Extraction → Ensemble Model (ML + LSTM) → Confidence Scoring → Output',
    tech: ['Python 3.x', 'Scikit-learn', 'TensorFlow/Keras', 'NLTK', 'TF-IDF', 'LSTM', 'Pandas', 'NumPy', 'Flask API'],
    features: [
      'Multi-model ensemble combining ML classifiers and deep learning',
      'Real-time news article classification with confidence scores',
      'Source credibility analysis and metadata extraction',
      'TF-IDF feature engineering for traditional ML pipeline',
      'LSTM-based sequential text analysis for deep patterns',
      'Web scraping integration for live news verification',
      'REST API for integration with browser extensions'
    ],
    challenges: `Key challenges included handling class imbalance in training data (solved with SMOTE oversampling), 
    designing features that capture both linguistic patterns and writing style, and optimizing inference speed 
    for real-time classification. The hybrid approach was crucial to achieving >90% accuracy where individual 
    models fell short.`,
    video: '/videos/FakeNewsDetector.mp4'
  },
  2: {
    title: 'E-Commerce Customer Revenue Analytics Platform',
    category: 'Data Analytics',
    description: `A comprehensive business intelligence platform that transforms raw e-commerce transaction data 
    into actionable insights. Features interactive Power BI dashboards, ML-powered revenue forecasting, and 
    deep customer segmentation using RFM (Recency, Frequency, Monetary) analysis. Helps businesses identify 
    high-value customers and optimize revenue streams.`,
    architecture: 'Data Ingestion → ETL Pipeline → SQL Warehouse → Python Analytics → Power BI Dashboard',
    tech: ['Python', 'SQL/MySQL', 'Power BI', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Excel'],
    features: [
      'Interactive Power BI dashboards with 15+ KPI visualizations',
      'ML-powered revenue forecasting (ARIMA & Prophet models)',
      'RFM-based customer segmentation into 5 behavioral clusters',
      'Cohort analysis for customer retention tracking',
      'Automated ETL pipeline for data ingestion and cleaning',
      'Product performance and category trend analysis',
      'Executive summary reports with automated scheduling'
    ],
    challenges: `The primary challenge was handling inconsistent, dirty real-world e-commerce data with missing 
    values and currency conversion issues. Built a robust ETL pipeline that handles 500K+ records efficiently. 
    Designing the RFM segmentation model to be meaningful across different product categories required 
    iterative domain expertise refinement.`,
    video: ''
  },
  3: {
    title: 'PU Hostel Booking System',
    category: 'Full Stack Web',
    description: `A full-stack web application built to digitize and streamline the hostel accommodation 
    management process at Parul University. Students can browse available rooms, make bookings, and track 
    their applications online. Administrators get a powerful dashboard for room management, student tracking, 
    and payment verification.`,
    architecture: 'HTML/CSS/JS Frontend → PHP Backend → MySQL Database → Admin Dashboard',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Bootstrap', 'AJAX', 'PDO'],
    features: [
      'Real-time room availability with visual floor maps',
      'Student registration and profile management portal',
      'Admin dashboard for room allocation and management',
      'Payment tracking and receipt generation system',
      'Waitlist management with automatic notifications',
      'Search and filter rooms by type, floor, and amenities',
      'Responsive design for mobile-friendly access'
    ],
    challenges: `Implementing real-time room availability without page refreshes required careful AJAX 
    architecture. Preventing double-booking race conditions required database-level locking mechanisms. 
    The admin dashboard needed to handle bulk operations for semester-wise room reassignment efficiently.`,
    video: '/videos/Pu Hostel Booking Video.mp4'
  },
  4: {
    title: 'Smart Traffic Violation Detection System',
    category: 'Computer Vision & AI',
    description: `An intelligent computer vision system that automatically monitors traffic feeds and detects 
    violations in real-time. Uses YOLO object detection for vehicle identification and tracking, combined with 
    custom violation logic for signal jumping, lane violations, and speeding detection. Generates automated 
    penalty notices with evidence capture.`,
    architecture: 'Camera Feed → YOLO Detection → Vehicle Tracking → Violation Logic → Alert & Report System',
    tech: ['Python', 'OpenCV', 'YOLOv8', 'TensorFlow', 'SQLite', 'NumPy', 'Pillow', 'ReportLab'],
    features: [
      'Real-time video stream processing at 30 FPS',
      'Multi-class vehicle detection (cars, bikes, trucks, buses)',
      'License plate recognition using OCR (Tesseract)',
      'Signal violation detection with timestamp evidence',
      'Speed estimation using optical flow algorithms',
      'Automated PDF violation report generation',
      'Multi-camera feed management dashboard'
    ],
    challenges: `The main technical challenge was achieving real-time performance on standard hardware. 
    Solved by optimizing the YOLO inference pipeline with batch processing and GPU acceleration. License 
    plate recognition in varied lighting conditions required extensive preprocessing and model fine-tuning. 
    Handling occlusion and fast-moving vehicles required custom tracking algorithms.`,
    video: ''
  },
  5: {
    title: 'Rental Data Web Scraping Automation',
    category: 'Automation & Analytics',
    description: `An automated web scraping and data analytics system that continuously collects rental 
    property listings from multiple platforms, cleans and normalizes the data, and generates comprehensive 
    market analysis reports. Helps property investors and renters understand pricing trends and market 
    dynamics across different localities.`,
    architecture: 'Selenium/BS4 Scraper → Data Pipeline → Pandas Processing → Excel/CSV Output → Visualization',
    tech: ['Python', 'Selenium', 'BeautifulSoup4', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'openpyxl', 'Schedule'],
    features: [
      'Multi-platform scraping with anti-bot evasion techniques',
      'Automated scheduling for daily/weekly data collection',
      'Data deduplication and normalization pipeline',
      'Price trend analysis with moving averages',
      'Locality-wise price heatmaps and distribution charts',
      'Automated Excel reports with pivot tables',
      'Email notification system for significant price changes'
    ],
    challenges: `Bypassing anti-scraping mechanisms required implementing rotating proxies, randomized delays, 
    and browser fingerprint randomization. Standardizing property data across platforms with different schemas 
    was complex — built a flexible mapping engine. Handling JavaScript-rendered content required switching 
    from BeautifulSoup to Selenium for dynamic pages.`,
    video: '/videos/web scrapping video.MP4'
  },

  6: {
    title: 'Botani Glow — Shopify E-commerce Store',
    category: 'E-commerce | Shopify Development | UI/UX Design',
    overview: `Botani Glow is a fully functional Shopify-based e-commerce platform focused on aesthetic 
    home decor and lifestyle products. The store delivers a clean, organized, and modern shopping experience 
    with curated collections including Indoor Plants, Home Decor Items, Ambient Lighting, Wall Art, and 
    Home Essentials. Every design decision was made to maximize user engagement and shopping conversion through 
    intuitive navigation, aesthetic branding, and a seamless mobile-first responsive layout.`,
    tech: ['Shopify', 'Liquid', 'HTML', 'CSS', 'JavaScript', 'Responsive Design', 'UI/UX Design'],
    features: [
      'Clean and minimal user interface with aesthetic branding',
      'Structured product categorization across 5+ curated collections',
      'Mobile-responsive design optimized for all screen sizes',
      'Collection-based product organization (Plants, Decor, Lighting, Wall Art)',
      'User-friendly navigation with streamlined checkout flow',
      'Modern storefront design with consistent visual identity',
      'Optimized shopping experience for improved conversions',
      'Aesthetic product presentation and imagery layout'
    ],
    challenges: `Designing a cohesive brand identity that felt premium yet accessible required multiple 
    design iterations. Structuring collections logically for intuitive product discovery was a key UX challenge. 
    Customizing Shopify's Liquid templates to match the desired aesthetic — without losing platform functionality 
    — required deep understanding of the Shopify theme architecture. Ensuring pixel-perfect responsiveness 
    across mobile, tablet, and desktop viewports was achieved through rigorous cross-device testing.`,
    video: '/videos/Botani Glow Store1.mp4',
    learnings: [
      'Building an end-to-end e-commerce platform',
      'Storefront design principles',
      'Product organization strategies',
      'Responsive design optimization',
      'User experience improvement',
      'Aesthetic branding techniques',
      'Practical Shopify development'
    ]
  }
};

// Expose modal functions globally (called from HTML onclick)


// Attach event listeners to all video buttons


window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
/* ============================================================
   12. KEYBOARD NAVIGATION FOR MODALS
   ============================================================ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (videoModal?.classList.contains('open'))   closeVideoModal();
    }
});

/* ============================================================
   13. CARD TILT EFFECT (subtle, desktop only)
   ============================================================ */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  const cards = $$('.project-card, .achievement-card, .cert-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}

// Init tilt after page load
window.addEventListener('load', initCardTilt);

/* ============================================================
   14. PARTICLE PARALLAX (subtle mouse follow for hero bg)
   ============================================================ */
const heroSection = $('#home');
const particles = $$('.particle');

if (heroSection && particles.length) {
  heroSection.addEventListener('mousemove', e => {
    const { left, top, width, height } = heroSection.getBoundingClientRect();
    const mx = (e.clientX - left) / width  - 0.5;
    const my = (e.clientY - top)  / height - 0.5;

    particles.forEach((p, i) => {
      const factor = (i % 3 + 1) * 8;
      p.style.transform = `translate(${mx * factor}px, ${my * factor}px)`;
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    particles.forEach(p => { p.style.transform = ''; });
  });
}

/* ============================================================
   15. PROGRESS BAR (top of page scroll indicator)
   ============================================================ */
(function createProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '2px',
    width: '0%',
    background: 'linear-gradient(90deg, #3B82F6, #9333EA)',
    zIndex: '1001',
    transition: 'width 0.1s ease',
    borderRadius: '0 2px 2px 0',
    boxShadow: '0 0 10px rgba(59,130,246,0.5)'
  });
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const pct = (scrollTop / (scrollHeight - clientHeight)) * 100;
    bar.style.width = `${pct}%`;
  }, { passive: true });
})();

/* ============================================================
   16. SECTION ACTIVE GLOW (decorative orbs that move)
   ============================================================ */
(function createOrbFollower() {
  const orb = document.createElement('div');
  Object.assign(orb.style, {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.035) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '0',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.8s ease, top 0.8s ease',
    left: '50%',
    top: '50%'
  });
  document.body.appendChild(orb);

  document.addEventListener('mousemove', e => {
    orb.style.left = e.clientX + 'px';
    orb.style.top = e.clientY + 'px';
  });
})();

/* ============================================================
   17. INITIAL SETUP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Immediately reveal elements above the fold on load
  // (handled after preloader removes itself via initScrollReveal)
  updateNavbar();
});

/* ============================================================
   14. CERTIFICATE MODAL
   ============================================================ */
const certModal = document.querySelector('#cert-modal');
const certModalImg = document.querySelector('#cert-modal-img');
const certModalTitle = document.querySelector('#cert-modal-title');

function openCertModal(imgSrc, title) {
  if (!certModal || !certModalImg) return;
  certModalImg.src = imgSrc;
  certModalImg.style.transform = 'scale(1)';
  certModalImg.style.cursor = 'zoom-in';
  if (certModalTitle) certModalTitle.textContent = title;
  
  certModal.classList.add('open');
  certModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.querySelector('#cert-modal-close')?.focus(), 100);
}

function closeCertModal() {
  if (!certModal) return;
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;

// We also need to add closeCertModal to the escape key listener, but it's easier to just add an independent listener here
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && certModal?.classList.contains('open')) {
    closeCertModal();
  }
});
