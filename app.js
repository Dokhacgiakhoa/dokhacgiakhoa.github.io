// ==========================================
// GSAP Landing Page — dokhacgiakhoa.github.io
// Version: 2.6 (Antigravity Code Review Fixes)
// ==========================================

gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);

// ===== ACCESSIBILITY CHECK =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== MOBILE / TOUCH DETECTION =====
const isMobile = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;

// ===== PERFORMANCE OPTIMIZATION: PREFETCH GITHUB API =====
const reposCache = fetch(
  'https://api.github.com/users/dokhacgiakhoa/repos?sort=updated&per_page=20&type=owner',
  { headers: { 'Accept': 'application/vnd.github.mercy-preview+json' } }
).catch(err => {
  console.warn('Prefetch failed, fallback will be used in initGithubRepos.', err);
  return null;
});

// ===== REPO THUMBNAIL MAP =====
// Keys are repo names lowercased. Images go in Media/repo-thumbs/
const REPO_THUMBS = {
  'agent-skills-setup-for-antigravity':  'Media/repo-thumbs/agent-skills-antigravity.jpg',
  'agent-skills-setup-for-antigravity-vercel': 'Media/repo-thumbs/agent-skills-antigravity.jpg',
  'khoa-hoc-tam-linh':                   'Media/repo-thumbs/khoa-hoc-tam-linh.jpg',
  'git-page-3d-infographic':             'Media/repo-thumbs/git-page-3d-infographic.jpg',
  'videos-by-ai':                        'Media/repo-thumbs/videos-by-ai.jpg',
  'office-box-academy':                  'Media/repo-thumbs/office-box-academy.jpg',
  'courierxpress':                       'Media/repo-thumbs/courierxpress.jpg',
  'dokhacgiakhoa.github.io':             'Media/repo-thumbs/portfolio.jpg',
  'moltbot':                             'Media/repo-thumbs/moltbot.jpg',
};

// ===== LANGUAGE COLOR MAP =====
const LANG_COLORS = {
  'JavaScript': '#f1e05a', 'TypeScript': '#2b7489', 'Python': '#3572A5',
  'HTML': '#e34c26', 'CSS': '#563d7c', 'PHP': '#4F5D95',
  'Java': '#b07219', 'C': '#555555', 'C++': '#f34b7d', 'C#': '#178600',
  'Go': '#00ADD8', 'Rust': '#dea584', 'Ruby': '#701516', 'Shell': '#89e051',
  'Vue': '#41b883', 'Svelte': '#ff3e00', 'Kotlin': '#F18E33', 'Swift': '#ffac45',
  'Dart': '#00B4AB', 'Dockerfile': '#384d54', 'SCSS': '#c6538c', 'Lua': '#000080'
};

// ===== LENIS SMOOTH SCROLL =====
let lenis;
if (typeof Lenis !== 'undefined' && !prefersReducedMotion && !isMobile) {
  lenis = new Lenis({ lerp: 0.08 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ─────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────

// Split text into words, preserving HTML tags like <span>
function splitWords(el) {
  const nodes = Array.from(el.childNodes);
  el.innerHTML = '';
  const words = [];

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(' ').forEach((w, i, arr) => {
        if (!w) return;
        const wrap = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = w + (i < arr.length - 1 ? '\u00A0' : '');
        wrap.appendChild(inner);
        el.appendChild(wrap);
        words.push(inner);
      });
    } else {
      const wrap = document.createElement('span');
      wrap.className = 'word-wrap';
      const cloned = node.cloneNode(true);
      wrap.appendChild(cloned);
      el.appendChild(wrap);
      words.push(cloned);
    }
  });

  return words;
}

// ─────────────────────────────────────────
// 01_PRELOADER
// ─────────────────────────────────────────
function initPreloader() {
  return new Promise(resolve => {
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('counter-num');
    const fill = document.querySelector('.preloader-fill');
    if (!preloader) { resolve(); return; }

    document.body.style.overflow = 'hidden';

    // Split logo text into letters
    const logoEl = preloader.querySelector('.preloader-logo');
    if (logoEl) {
      const text = logoEl.textContent.trim();
      logoEl.innerHTML = text.split('').map((c, i) => {
        if (c === '.') {
          return `<span class="dot" style="display:inline-block; color:var(--gold); transform-origin:center;">.</span>`;
        }
        return `<span class="letter" style="display:inline-block; transform-origin:bottom;">${c}</span>`;
      }).join('');
    }

    const letters = preloader.querySelectorAll('.preloader-logo .letter');
    const dot = preloader.querySelector('.preloader-logo .dot');

    // Initial state
    gsap.set(letters, { scaleY: 0, opacity: 0 });
    gsap.set(dot, { scale: 0 });

    const tl = gsap.timeline({
      onComplete() {
        // Exit sequence: curtains split and logo fades out
        gsap.timeline({
          onComplete() {
            preloader.style.display = 'none';
            document.body.style.overflow = '';
            resolve();
          }
        })
        .to('.preloader-logo, .preloader-counter, .preloader-bar', {
          opacity: 0,
          scale: 0.9,
          duration: 0.4,
          ease: 'power2.in'
        })
        .to('.curtain-top', { yPercent: -100, duration: 0.75, ease: 'power4.inOut' }, '-=0.2')
        .to('.curtain-bottom', { yPercent: 100, duration: 0.75, ease: 'power4.inOut' }, '-=0.75');
      }
    });

    if (prefersReducedMotion) {
      // Immediate reveal for accessibility
      gsap.set(letters, { scaleY: 1, opacity: 1 });
      gsap.set(dot, { scale: 1 });
      if (counterEl) counterEl.textContent = "100";
      if (fill) fill.style.width = '100%';
      tl.to({}, { duration: 0.2 }); // Minimal delay
      return;
    }

    // Logo entrance
    tl.to(letters, {
      scaleY: 1,
      opacity: 1,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power4.out'
    })
    .to(dot, {
      scale: 1.3,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.1')
    .to(dot, {
      scale: 1,
      duration: 0.2,
      ease: 'bounce.out'
    })
    .from('.preloader-counter, .preloader-bar', {
      opacity: 0,
      y: 15,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.3');

    // Counter counting with random scramble increments
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: isMobile ? 1.2 : 1.8,
      ease: 'power2.inOut',
      onUpdate() {
        const currentVal = Math.round(counterObj.val);
        
        // Random scramble number effect before settling
        if (currentVal < 100 && Math.random() < 0.25) {
          const scrambleVal = Math.floor(currentVal + Math.random() * (100 - currentVal));
          if (counterEl) counterEl.textContent = scrambleVal;
        } else {
          if (counterEl) counterEl.textContent = currentVal;
        }
        
        if (fill) fill.style.width = currentVal + '%';
      }
    }, '-=0.2')
    // Settle flash
    .to(counterEl, {
      opacity: 0.3,
      duration: 0.08,
      yoyo: true,
      repeat: 3
    });
  });
}

// ─────────────────────────────────────────
// 02_CURSOR (3 Layers with Velocity Stretch)
// ─────────────────────────────────────────
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow');
  
  if (!dot || !ring || !glow || window.matchMedia('(hover: none)').matches || prefersReducedMotion) return;

  gsap.set([dot, ring, glow], { xPercent: -50, yPercent: -50 });

  let mouse = { x: 0, y: 0 };
  let lastMouse = { x: 0, y: 0 };
  let velocity = { x: 0, y: 0 };
  let isHovered = false;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Track velocity and animate cursor layers on every frame
  gsap.ticker.add(() => {
    const dx = mouse.x - lastMouse.x;
    const dy = mouse.y - lastMouse.y;
    
    // Smooth out velocity calculations
    velocity.x += (dx - velocity.x) * 0.2;
    velocity.y += (dy - velocity.y) * 0.2;
    
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    const angle = Math.atan2(velocity.y, velocity.x) * 180 / Math.PI;
    
    // Calculate stretch factor based on speed
    const stretch = Math.min(speed * 0.018, 0.5);

    // Layer A (Dot): Instant tracking
    gsap.to(dot, { x: mouse.x, y: mouse.y, duration: 0.05, ease: 'none' });
    
    // Layer B (Ring): Lag + velocity stretch
    if (!isHovered) {
      gsap.to(ring, {
        x: mouse.x,
        y: mouse.y,
        scaleX: 1 + stretch,
        scaleY: 1 - stretch * 0.5,
        rotation: angle,
        duration: 0.25,
        ease: 'power2.out'
      });
    } else {
      gsap.to(ring, {
        x: mouse.x,
        y: mouse.y,
        rotation: 0,
        duration: 0.2,
        ease: 'power2.out'
      });
    }

    // Layer C (Glow): High lag
    gsap.to(glow, { x: mouse.x, y: mouse.y, duration: 0.5, ease: 'power1.out' });
  });

  // Hover interactions
  const hoverSelector = 'a, button, .btn, .skill-card, .repo-card, .cert-card, .social-btn, .filter-btn, .magnetic';
  document.querySelectorAll(hoverSelector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      isHovered = true;
      gsap.to(ring, {
        scale: 2.2,
        borderColor: 'rgba(255,215,0,0.85)',
        backgroundColor: 'rgba(255,215,0,0.05)',
        duration: 0.25,
        ease: 'power2.out'
      });
      gsap.to(dot, { scale: 0, duration: 0.15 });
      gsap.to(glow, { scale: 1.5, opacity: 0.8, duration: 0.25 });
    });
    
    el.addEventListener('mouseleave', () => {
      isHovered = false;
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(255,255,245,0.45)',
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.to(dot, { scale: 1, duration: 0.2 });
      gsap.to(glow, { scale: 1, opacity: 0.5, duration: 0.3 });
    });
  });

  // Text hover (turns ring into horizontal line cursor)
  document.querySelectorAll('.body-text, .hero-desc, .hero-sub, .sec-heading').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (isHovered) return;
      gsap.to(ring, {
        scaleX: 1.2,
        scaleY: 0.12,
        borderRadius: '2px',
        duration: 0.2,
        ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () => {
      if (isHovered) return;
      gsap.to(ring, {
        scaleX: 1,
        scaleY: 1,
        borderRadius: '50%',
        duration: 0.25,
        ease: 'power2.out'
      });
    });
  });
}

// ─────────────────────────────────────────
// 03_AMBIENT (Blobs and Scroll Parallax)
// ─────────────────────────────────────────
function initAmbient() {
  if (prefersReducedMotion) return;

  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((b, i) => {
    gsap.to(b, {
      x: () => (Math.random() - 0.5) * 240,
      y: () => (Math.random() - 0.5) * 200,
      rotation: () => (Math.random() - 0.5) * 180,
      duration: 20 + i * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.5
    });
  });

  // Scroll-linked parallax for background blobs
  if (blobs.length >= 3) {
    gsap.to(blobs[0], {
      y: 120,
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });
    gsap.to(blobs[1], {
      y: -100,
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });
    gsap.to(blobs[2], {
      y: 80,
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
    });
  }
}

// ─────────────────────────────────────────
// 04_SPOTLIGHT
// ─────────────────────────────────────────
function initSpotlight() {
  const spotlight = document.getElementById('spotlight');
  if (!spotlight || window.matchMedia('(hover: none)').matches) return;
  
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    spotlight.style.setProperty('--mx', x);
    spotlight.style.setProperty('--my', y);
    document.documentElement.style.setProperty('--mx', x);
    document.documentElement.style.setProperty('--my', y);
  }, { passive: true });
}

// ─────────────────────────────────────────
// 05_MAGNETIC BUTTONS
// ─────────────────────────────────────────
function initMagnetic() {
  if (prefersReducedMotion || isMobile) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

// ─────────────────────────────────────────
// 06_HERO
// ─────────────────────────────────────────
function initHero() {
  const titleEl = document.querySelector('.hero-title .split-text');
  if (!titleEl) return;

  // Split title into individual character spans for glitch effect
  const text = titleEl.textContent.trim();
  titleEl.innerHTML = text.split('').map(c => 
    `<span class="ch" style="display:inline-block; transform-style:preserve-3d;">${c === ' ' ? '&nbsp;' : c}</span>`
  ).join('');

  const chars = titleEl.querySelectorAll('.ch');

  // Set initial states
  gsap.set('.main-header', { y: -72, opacity: 0 });
  gsap.set('.hero-eyebrow', { opacity: 0 });
  gsap.set(chars, { opacity: 0 });
  gsap.set('.hero-sub', { opacity: 0, y: 30 });
  gsap.set('.hero-desc', { opacity: 0, y: 20 });
  gsap.set('.hero-cta .btn', { opacity: 0, scale: 0.8 });
  gsap.set('.scroll-hint', { opacity: 0, y: 20 });

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Entrance timeline
  tl.to('.main-header', { y: 0, opacity: 1, duration: 0.8 })
    .to('.hero-eyebrow', {
      opacity: 1,
      duration: 0.2,
      onComplete() {
        // Typewriter effect using TextPlugin
        const eyebrow = document.querySelector('.hero-eyebrow');
        const originalVal = "DevOps & AI Integration Specialist";
        const cursor = eyebrow.querySelector('.eyebrow-cursor');
        
        eyebrow.innerHTML = '';
        if (cursor) eyebrow.appendChild(cursor);
        
        const textSpan = document.createElement('span');
        eyebrow.insertBefore(textSpan, cursor);

        gsap.to(textSpan, {
          text: { value: originalVal },
          duration: 1.6,
          ease: "none",
          onComplete() {
            // Fade out the cursor after a short delay
            if (cursor) {
              gsap.to(cursor, { opacity: 0, duration: 0.3, delay: 1.5 });
            }
          }
        });
      }
    }, '-=0.4');

  // Glitch -> Settle character cascade animation
  if (prefersReducedMotion || isMobile) {
    // .hero-title has -webkit-text-fill-color:transparent in CSS.
    // .ch spans inherit it, so we must bake gradient onto each span or text stays invisible.
    chars.forEach(char => {
      char.style.background = 'linear-gradient(135deg, #00C8FF 0%, #00E5FF 55%, #ffffff 100%)';
      char.style.webkitBackgroundClip = 'text';
      char.style.backgroundClip = 'text';
      char.style.webkitTextFillColor = 'transparent';
    });
    gsap.set(chars, { opacity: 1 });
  } else {
    // background-clip:text on parent does NOT paint through inline-block child spans.
    // Fix: bake the gradient into each .ch span at the correct background-position
    // so the gradient appears continuous across the full title width.
    const heroTitleEl = titleEl.parentElement;
    const titleRect = heroTitleEl.getBoundingClientRect();
    chars.forEach(char => {
      const cr = char.getBoundingClientRect();
      const offsetX = cr.left - titleRect.left;
      char.style.background = 'linear-gradient(135deg, #00C8FF 0%, #00E5FF 55%, #ffffff 100%)';
      char.style.backgroundSize = titleRect.width + 'px 100%';
      char.style.backgroundPosition = `-${offsetX}px 0`;
      char.style.webkitBackgroundClip = 'text';
      char.style.backgroundClip = 'text';
      char.style.webkitTextFillColor = 'transparent';
    });

    chars.forEach((char, index) => {
      const glitchTL = gsap.timeline({ delay: 0.4 + index * 0.028 });
      const glitchColor = index % 2 === 0 ? '#00FFCC' : '#00C8FF';

      // Phase 1: Glitch — override fill with solid color
      glitchTL.to(char, {
        opacity: 0.8,
        x: () => (Math.random() - 0.5) * 35,
        y: () => (Math.random() - 0.5) * 25,
        rotation: () => (Math.random() - 0.5) * 25,
        skewX: () => (Math.random() - 0.5) * 30,
        scale: () => 0.85 + Math.random() * 0.3,
        duration: 0.08,
        ease: 'none',
        onStart() { char.style.webkitTextFillColor = glitchColor; }
      })
      // Phase 2: Settle — restore gradient by reverting fill to transparent
      .to(char, {
        opacity: 1,
        x: 0, y: 0, rotation: 0, skewX: 0, scale: 1,
        duration: 0.6,
        ease: 'back.out(1.4)',
        onStart() { char.style.webkitTextFillColor = 'transparent'; }
      });
    });
  }

  tl.to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '+=0.7')
    .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .to('.hero-cta .btn', {
      opacity: 1,
      scale: 1,
      stagger: 0.12,
      duration: 0.7,
      ease: 'back.out(1.5)'
    }, '-=0.6')
    .to('.scroll-hint', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

  // Floating badge ambient animation
  const badges = document.querySelectorAll('.hero-float-badge');
  badges.forEach((badge, i) => {
    gsap.set(badge, { opacity: 0, scale: 0.8, y: 20 });
    
    gsap.to(badge, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.8,
      delay: 2.2 + i * 0.2,
      ease: 'back.out(1.5)'
    });
    
    if (!prefersReducedMotion) {
      gsap.to(badge, {
        y: `${-8 - i * 4}px`,
        x: `${(i % 2 === 0 ? 1 : -1) * 5}px`,
        rotation: (i % 2 === 0 ? 2 : -2),
        duration: 3 + i * 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 3 + i * 0.3
      });
    }
  });

  // Scroll-linked parallax for Hero content
  if (!prefersReducedMotion) {
    gsap.to('.hero-content', {
      y: -80,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom 30%',
        scrub: true
      }
    });
  }
}

// ─────────────────────────────────────────
// 07_ABOUT
// ─────────────────────────────────────────
function initAbout() {
  const sec = document.querySelector('#about');
  if (!sec) return;

  // 1. Flipboard heading style (RotateX per word)
  const heading = sec.querySelector('.sec-heading');
  if (heading && !prefersReducedMotion) {
    const words = splitWords(heading);
    gsap.from(words, {
      rotateX: -95,
      opacity: 0,
      transformOrigin: 'top center',
      duration: 0.85,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Eyebrow badge scale-in
  const eyebrow = sec.querySelector('.eyebrow');
  if (eyebrow) {
    gsap.from(eyebrow, {
      scale: 0.75,
      opacity: 0,
      y: 10,
      duration: 0.6,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: eyebrow, start: 'top 88%' }
    });
  }

  // 2. Line wipe body paragraphs
  const paragraphs = sec.querySelectorAll('.body-text');
  paragraphs.forEach(p => {
    gsap.from(p, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: p,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // 3. Stats Slot Machine
  const stats = sec.querySelectorAll('.stat');
  stats.forEach(stat => {
    const numEl = stat.querySelector('.stat-num');
    const plusEl = stat.querySelector('.stat-plus');
    const labelEl = stat.querySelector('.stat-label');
    const target = parseInt(numEl.dataset.target, 10);

    gsap.set(numEl, { opacity: 0 });
    if (plusEl) gsap.set(plusEl, { scale: 0, opacity: 0 });
    gsap.set(labelEl, { opacity: 0, y: 12 });

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter() {
        gsap.set(numEl, { opacity: 1 });
        
        if (!prefersReducedMotion) {
          // Random number scramble ticking
          const counterObj = { val: 0 };
          const interval = setInterval(() => {
            numEl.textContent = Math.floor(Math.random() * 99);
          }, 50);

          gsap.to(counterObj, {
            val: target,
            duration: 1.8,
            ease: 'power3.out',
            onComplete() {
              clearInterval(interval);
              numEl.textContent = target;
              if (plusEl) {
                gsap.to(plusEl, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.5)' });
              }
              gsap.to(labelEl, { opacity: 1, y: 0, duration: 0.4 });
            }
          });
        } else {
          // No scramble
          numEl.textContent = target;
          if (plusEl) gsap.set(plusEl, { scale: 1, opacity: 1 });
          gsap.set(labelEl, { opacity: 1, y: 0 });
        }
      }
    });
  });

  // 4. Quote Card Typewriter
  const quoteCard = sec.querySelector('.about-right .glass-card:nth-child(2)');
  if (quoteCard) {
    const quoteTextEl = quoteCard.querySelector('.quote-text');
    const quoteHeaderEl = quoteCard.querySelector('.quote-header');
    const finalQuote = quoteTextEl.textContent.trim();
    quoteTextEl.textContent = "";

    gsap.set(quoteCard, { clipPath: 'inset(100% 0 0 0)', opacity: 0 });
    gsap.set(quoteHeaderEl, { opacity: 0, y: 15 });

    const quoteTL = gsap.timeline({
      scrollTrigger: {
        trigger: quoteCard,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    quoteTL.to(quoteCard, {
      clipPath: 'inset(0% 0 0 0)',
      opacity: 1,
      duration: 0.95,
      ease: 'power3.inOut'
    })
    .to(quoteHeaderEl, {
      opacity: 1,
      y: 0,
      duration: 0.45
    });

    if (!prefersReducedMotion) {
      quoteTL.to(quoteTextEl, {
        text: { value: finalQuote },
        duration: 2.2,
        ease: 'none'
      });
    } else {
      quoteTextEl.textContent = finalQuote;
    }
  }

  // Avatar Card Reveal
  const avatarCard = sec.querySelector('.avatar-card');
  if (avatarCard) {
    gsap.from(avatarCard, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: avatarCard, start: 'top 85%' }
    });
  }

  // Location Badge
  const locationCard = sec.querySelector('.about-right .glass-card--sm');
  if (locationCard) {
    gsap.from(locationCard, {
      x: 80,
      opacity: 0,
      duration: 0.9,
      ease: 'elastic.out(1, 0.6)',
      scrollTrigger: { trigger: locationCard, start: 'top 88%' }
    });
    
    if (!prefersReducedMotion) {
      const icons = locationCard.querySelectorAll('i');
      gsap.from(icons, {
        rotation: -360,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: locationCard, start: 'top 88%' }
      });
    }
  }
}

// ─────────────────────────────────────────
// 08_STATS STUB
// ─────────────────────────────────────────
function initStats() {
  // Logic already integrated in initAbout()
}

// ─────────────────────────────────────────
// 09_SKILLS (HUD Boot Sequence)
// ─────────────────────────────────────────
function initSkills() {
  const section = document.querySelector('#skills');
  if (!section) return;

  // Reduced motion: instantly set final state
  if (prefersReducedMotion) {
    section.querySelectorAll('.skill-card, .cert-card').forEach(c =>
      gsap.set(c, { clipPath: 'inset(0 0% 0 0 round 6px)' })
    );
    section.querySelectorAll('.hud-panel-bar').forEach(b => gsap.set(b, { scaleX: 1 }));
    section.querySelectorAll('.skill-card').forEach(card => {
      const bar = card.querySelector('.skill-bar');
      const pct = parseInt(card.dataset.pct, 10) || 0;
      if (bar && pct) gsap.set(bar, { width: pct + '%' });
    });
    return;
  }

  // 1. Heading cyber-decode on scroll
  const heading = section.querySelector('.sec-heading');
  if (heading) {
    const original = heading.textContent.trim();
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-=_[]|#><';
    ScrollTrigger.create({
      trigger: heading,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        let iter = 0;
        const tick = () => {
          heading.textContent = original.split('').map((c, i) => {
            if (c === ' ') return ' ';
            if (i < iter) return c;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('');
          iter += 1.5;
          if (iter < original.length) requestAnimationFrame(tick);
          else heading.textContent = original;
        };
        requestAnimationFrame(tick);
      }
    });
  }

  // 2. HUD panels fade in as a group
  const panels = section.querySelectorAll('.hud-panel, .hud-certs');
  gsap.from(panels, {
    opacity: 0,
    y: 28,
    duration: 0.5,
    stagger: 0.09,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section.querySelector('.skills-hud') || section,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // 3. Per-panel: scan bar + card clip-wipe + bar fill
  panels.forEach(panel => {
    const scanBar = panel.querySelector('.hud-panel-bar');
    if (scanBar) {
      gsap.fromTo(scanBar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.65,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    panel.querySelectorAll('.skill-card').forEach(card => {
      const pct = parseInt(card.dataset.pct, 10) || 0;
      const skillBar = card.querySelector('.skill-bar');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none none'
        }
      });

      // Clip-path wipe left → right (data loading)
      tl.fromTo(card,
        { clipPath: 'inset(0 100% 0 0 round 6px)' },
        { clipPath: 'inset(0 0% 0 0 round 6px)', duration: 0.45, ease: 'power2.inOut' }
      );

      // Skill bar fills just as the card fully appears
      if (skillBar && pct) {
        const overshoot = Math.min(pct + 10, 100);
        tl.to(skillBar, { width: overshoot + '%', duration: 0.5, ease: 'power3.out' }, '-=0.1')
          .to(skillBar, { width: pct + '%', duration: 0.35, ease: 'elastic.out(1, 0.4)' });
      }
    });

    panel.querySelectorAll('.cert-card').forEach(card => {
      gsap.fromTo(card,
        { clipPath: 'inset(0 100% 0 0 round 6px)' },
        {
          clipPath: 'inset(0 0% 0 0 round 6px)',
          duration: 0.45,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  });
}

// ─────────────────────────────────────────
// 10_REPOS (Glitch Eyebrow & Cards Deal)
// ─────────────────────────────────────────
async function initGithubRepos() {
  const grid = document.getElementById('reposGrid');
  const filter = document.getElementById('reposFilter');
  if (!grid) return;

  const showError = (msg) => {
    grid.innerHTML = `
      <div class="repos-error">
        <i class="bi bi-exclamation-triangle c-gold" style="font-size:2rem"></i>
        <p class="muted" style="margin-top:.75rem">${msg}
          <a href="https://github.com/dokhacgiakhoa" target="_blank" style="color:var(--gold)">Xem trực tiếp →</a>
        </p>
      </div>`;
  };

  try {
    // Await the prefetch cache promise
    const cachedRes = await reposCache;
    let all = null;

    if (cachedRes && cachedRes.ok) {
      all = await cachedRes.clone().json();
    } else {
      // Fallback if prefetch failed
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(
        'https://api.github.com/users/dokhacgiakhoa/repos?sort=updated&per_page=20&type=owner',
        {
          signal: ctrl.signal,
          headers: { 'Accept': 'application/vnd.github.mercy-preview+json' }
        }
      );
      clearTimeout(timer);
      if (res.ok) all = await res.json();
    }

    if (!all || !Array.isArray(all)) {
      showError('Không tải được dữ liệu GitHub.');
      return;
    }
    
    // Filter out forks and main profile repo, sort by stars
    const repos = all
      .filter(r => !r.fork && r.name !== 'dokhacgiakhoa')
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 9);

    if (!repos.length) {
      grid.innerHTML = '<p class="muted text-center" style="padding:2rem">Không có repo nào.</p>';
      return;
    }

    // Animate stats bar
    const totalStars = all.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = all.reduce((sum, r) => sum + r.forks_count, 0);
    const statsBar = document.getElementById('reposStatsBar');
    if (statsBar) {
      statsBar.style.display = 'flex';
      
      const statsObj = { repos: 0, stars: 0, forks: 0 };
      
      if (!prefersReducedMotion) {
        gsap.to(statsObj, {
          repos: all.length,
          stars: totalStars,
          forks: totalForks,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsBar,
            start: 'top 90%'
          },
          onUpdate() {
            document.getElementById('totalRepos').textContent = Math.round(statsObj.repos);
            document.getElementById('totalStars').textContent = Math.round(statsObj.stars);
            document.getElementById('totalForks').textContent = Math.round(statsObj.forks);
          }
        });
      } else {
        document.getElementById('totalRepos').textContent = all.length;
        document.getElementById('totalStars').textContent = totalStars;
        document.getElementById('totalForks').textContent = totalForks;
      }
    }

    // Eyebrow scramble glitch effect
    const eyebrow = document.querySelector('#repos .eyebrow');
    if (eyebrow && !prefersReducedMotion) {
      const finalVal = eyebrow.textContent.trim();
      ScrollTrigger.create({
        trigger: eyebrow,
        start: 'top 90%',
        once: true,
        onEnter() {
          let count = 0;
          eyebrow.style.color = '#ef4444';
          const interval = setInterval(() => {
            const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
            eyebrow.textContent = Array(finalVal.length).fill(0)
              .map(() => randomChars[Math.floor(Math.random() * randomChars.length)]).join('');
            count++;
            if (count > 10) {
              clearInterval(interval);
              eyebrow.textContent = finalVal;
              eyebrow.style.color = '';
            }
          }, 35);
        }
      });
    }

    // Render filter buttons
    const langs = [...new Set(repos.map(r => r.language).filter(Boolean))];
    if (filter && langs.length) {
      filter.innerHTML =
        '<button class="filter-btn active" data-lang="all">Tất cả</button>' +
        langs.map(l => `<button class="filter-btn" data-lang="${l}">${l}</button>`).join('');

      // Stagger buttons entrance — no ScrollTrigger, runs immediately after DOM insert
      gsap.from(filter.querySelectorAll('.filter-btn'), {
        opacity: 0,
        y: 16,
        scale: 0.88,
        stagger: 0.07,
        duration: 0.45,
        ease: 'back.out(1.8)',
        clearProps: 'all'
      });

      // Filter trigger
      filter.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.dataset.lang;
        
        grid.querySelectorAll('.repo-card').forEach(card => {
          const match = lang === 'all' || card.dataset.lang === lang;
          if (match) {
            card.style.display = '';
            gsap.to(card, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          } else {
            gsap.to(card, { opacity: 0, scale: 0.94, y: 10, duration: 0.25, onComplete: () => { card.style.display = 'none'; } });
          }
        });
      });
    }

    // Render repo cards
    grid.innerHTML = repos.map(r => {
      const color = LANG_COLORS[r.language] || '#6b7280';
      const desc = r.description
        ? r.description.substring(0, 110) + (r.description.length > 110 ? '…' : '')
        : 'Không có mô tả.';
      const updatedDate = new Date(r.updated_at).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
      const topicsHTML = r.topics?.slice(0, 3).map(t =>
        `<span class="repo-topic">${t}</span>`
      ).join('') || '';
      const thumb = REPO_THUMBS[r.name.toLowerCase()];
      const thumbHTML = thumb
        ? `<div class="repo-thumb"><img src="${thumb}" alt="${r.name} preview" loading="lazy" /></div>`
        : `<div class="repo-thumb repo-thumb--placeholder" style="--lang-color:${color}"></div>`;

      return `
        <a href="${r.html_url}" target="_blank" rel="noopener noreferrer"
           class="repo-card" data-lang="${r.language || ''}">
          ${thumbHTML}
          <div class="repo-card-top">
            <div class="repo-header">
              <div class="repo-icon-wrap">
                <i class="bi bi-folder2-open c-gold"></i>
              </div>
              <i class="bi bi-box-arrow-up-right repo-ext-icon"></i>
            </div>
            <h4 class="repo-name">${r.name}</h4>
            <p class="repo-desc">${desc}</p>
          </div>

          ${topicsHTML ? `<div class="repo-topics">${topicsHTML}</div>` : ''}

          <div class="repo-footer">
            <div class="repo-meta-row">
              ${r.language ? `
                <span class="repo-lang">
                  <span class="lang-dot" style="background:${color}"></span>
                  ${r.language}
                </span>` : ''}
              <span class="repo-stat" title="Stars">
                <i class="bi bi-star-fill" style="color:var(--gold);font-size:.7rem"></i>
                ${r.stargazers_count}
              </span>
              <span class="repo-stat" title="Forks">
                <i class="bi bi-diagram-2"></i>
                ${r.forks_count}
              </span>
              ${r.open_issues_count > 0 ? `
                <span class="repo-stat" title="Open issues">
                  <i class="bi bi-circle-fill" style="color:var(--green);font-size:.5rem"></i>
                  ${r.open_issues_count}
                </span>` : ''}
            </div>
            <span class="repo-updated">Updated ${updatedDate}</span>
          </div>
          <div class="repo-border-anim" aria-hidden="true"></div>
        </a>`;
    }).join('');

    // Deal from stack card entrance animation
    const cards = grid.querySelectorAll('.repo-card');
    gsap.from(cards, {
      opacity: 0,
      y: 100,
      rotateX: prefersReducedMotion ? 0 : 45,
      transformPerspective: 1000,
      stagger: 0.08,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%'
      }
    });

    // 3D tilt on card hover
    if (!prefersReducedMotion && !isMobile) {
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, { rotateY: x * 14, rotateX: -y * 14, duration: 0.3, ease: 'power2.out', transformPerspective: 900 });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
        });
      });
    }

  } catch (err) {
    showError('Không thể tải repos.');
  }
}

// ─────────────────────────────────────────
// 11_SERVICES (Curtain Pull & Grayscale->Color)
// ─────────────────────────────────────────
function initServices() {
  const cards = document.querySelectorAll('.svc-card');
  cards.forEach((card, i) => {
    // Dynamically insert curtain overlay
    const curtain = document.createElement('div');
    curtain.className = 'svc-curtain';
    card.appendChild(curtain);

    const img = card.querySelector('.svc-img');
    const body = card.querySelector('.svc-body');
    
    // Set initial states
    gsap.set(body, { opacity: 0, y: 15 });
    
    if (!prefersReducedMotion) {
      if (img) gsap.set(img, { filter: 'grayscale(100%)', scale: 1.12 });
    } else {
      if (img) gsap.set(img, { filter: 'grayscale(0%)', scale: 1 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // Curtain collapse and content fade-in sequence
    tl.to(curtain, {
      scaleY: 0,
      duration: 0.85,
      ease: 'power3.inOut'
    })
    .to(body, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.35');

    if (!prefersReducedMotion) {
      tl.to(img, {
        filter: 'grayscale(0%)',
        scale: 1,
        duration: 0.7,
        ease: 'power2.out'
      }, '-=0.65');

      // Image scroll parallax inside card
      if (img) {
        gsap.to(img, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }
  });
}

// ─────────────────────────────────────────
// 12_PROJECTS (Scale Bloom Bento)
// ─────────────────────────────────────────
function initProjects() {
  const grid = document.querySelector('.bento-grid');
  if (!grid) return;

  const largeCard = grid.querySelector('.bento-large');
  const smallCards = grid.querySelectorAll('.bento-small');
  const wideCard = grid.querySelector('.bento-wide');

  // Set initial states
  if (largeCard) gsap.set(largeCard, { scale: prefersReducedMotion ? 1 : 0.85, opacity: 0, rotation: prefersReducedMotion ? 0 : 1.5 });
  if (smallCards.length) gsap.set(smallCards, { scale: prefersReducedMotion ? 1 : 0.7, opacity: 0 });
  if (wideCard) gsap.set(wideCard, { clipPath: prefersReducedMotion ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)', opacity: 0 });

  const bentoTL = gsap.timeline({
    scrollTrigger: {
      trigger: grid,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // Large card bloom
  if (largeCard) {
    bentoTL.to(largeCard, {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1.1,
      ease: 'expo.out'
    });
  }

  // Small cards bounce scale-in
  if (smallCards.length) {
    bentoTL.to(smallCards, {
      scale: 1,
      opacity: 1,
      stagger: 0.15,
      duration: 0.8,
      ease: prefersReducedMotion ? 'power2.out' : 'back.out(1.3)'
    }, '-=0.6');
  }

  // Wide card wipe from left
  if (wideCard) {
    bentoTL.to(wideCard, {
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      duration: 0.95,
      ease: 'power3.inOut'
    }, '-=0.5');
  }

  // Parallax for bento images
  if (!prefersReducedMotion) {
    grid.querySelectorAll('.proj-card').forEach(card => {
      const img = card.querySelector('.proj-img');
      if (img) {
        gsap.to(img, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });
  }
}

// ─────────────────────────────────────────
// 13_CONTACT (Scatter to Settle Heading)
// ─────────────────────────────────────────
function initContact() {
  const sec = document.querySelector('#contact');
  if (!sec) return;

  // Scatter to settle heading
  const heading = sec.querySelector('.sec-heading');
  if (heading && !prefersReducedMotion) {
    const words = splitWords(heading);
    
    // Set initial random scatter positions
    words.forEach(word => {
      gsap.set(word, {
        x: () => (Math.random() - 0.5) * 200,
        y: () => (Math.random() - 0.5) * 80,
        rotation: () => (Math.random() - 0.5) * 30,
        opacity: 0
      });
    });

    // Settle simultaneously
    gsap.to(words, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Contact items: Sequential icon scale-in and text slide-in
  const items = sec.querySelectorAll('.contact-item');
  items.forEach((item, index) => {
    const icon = item.querySelector('.contact-icon');
    const text = item.querySelector('div');

    gsap.set(icon, { scale: 0, rotation: prefersReducedMotion ? 0 : -180 });
    gsap.set(text, { opacity: 0, x: -30 });

    const itemTL = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      delay: index * 0.18
    });

    itemTL.to(icon, {
      scale: 1,
      rotation: 0,
      duration: 0.55,
      ease: prefersReducedMotion ? 'power2.out' : 'back.out(2)'
    })
    .to(text, {
      opacity: 1,
      x: 0,
      duration: 0.45,
      ease: 'power2.out'
    }, '-=0.25');
  });

  // Social buttons bounce-in
  gsap.from('.social-btn', {
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: prefersReducedMotion ? 'power2.out' : 'back.out(2.5)',
    scrollTrigger: { trigger: '.social-row', start: 'top 92%' }
  });

  // Form fields slide-up reveal
  const fields = sec.querySelectorAll('.float-field');
  gsap.from(fields, {
    opacity: 0,
    y: 25,
    stagger: 0.12,
    duration: 0.65,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-form-card', start: 'top 80%' }
  });
}

// ─────────────────────────────────────────
// 14_SCROLL REVEAL (STUB FOR OTHER HEADINGS)
// ─────────────────────────────────────────
function initScrollReveal() {
  // Eyebrow badges reveal (section headers)
  // Exclude #about because initAbout() handles its eyebrow
  gsap.utils.toArray('#repos .eyebrow, #contact .eyebrow').forEach(el => {
    gsap.from(el, {
      scale: 0.7,
      opacity: 0,
      y: 8,
      duration: 0.55,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });

  // Section headings that weren't already handled
  if (!prefersReducedMotion) {
    gsap.utils.toArray('#repos .sec-heading').forEach(heading => {
      const words = splitWords(heading);
      gsap.from(words, {
        y: '110%',
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: { trigger: heading, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
  }
}

// ─────────────────────────────────────────
// 15_GLOBAL (Scroll Progress & Nav Highlight)
// ─────────────────────────────────────────
function initScrollProgress() {
  gsap.to('#scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { scrub: true, start: 'top top', end: 'bottom bottom' }
  });
}

function initNavHighlight() {
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!links.length) return;

  const sectionIds = ['about', 'skills', 'repos', 'contact'];
  const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const header = document.getElementById('mainHeader');
  let lastActive = null;

  function setActive(id) {
    if (id === lastActive) return;
    lastActive = id;
    links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
  }

  function updateNav() {
    const anchor = window.innerHeight * 0.5;
    // Walk sections from last to first; pick the last one whose top is above anchor
    let current = sectionEls[0]?.id ?? null; // default to first section
    for (let i = sectionEls.length - 1; i >= 0; i--) {
      if (sectionEls[i].getBoundingClientRect().top <= anchor) {
        current = sectionEls[i].id;
        break;
      }
    }
    if (current) setActive(current);

    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }
  }

  // Hook into Lenis scroll events (fires on every smooth-scroll frame)
  if (typeof lenis !== 'undefined' && lenis) {
    lenis.on('scroll', updateNav);
  }
  // Also hook into native scroll for fallback / programmatic scrolls
  window.addEventListener('scroll', updateNav, { passive: true });
  // Run once on init so the first section is immediately highlighted
  updateNav();
}

// Cert image lightbox
function initCertLightbox() {
  const lightbox  = document.getElementById('certLightbox');
  const img       = document.getElementById('certLightboxImg');
  const backdrop  = document.getElementById('certLightboxBackdrop');
  const closeBtn  = document.getElementById('certLightboxClose');
  const titleEl   = document.getElementById('certLightboxTitle');
  const verifyBtn = document.getElementById('certLightboxVerify');
  if (!lightbox || !img) return;

  function open(link) {
    img.src = link.href;
    if (titleEl)   titleEl.textContent = link.dataset.title || '';
    if (verifyBtn) verifyBtn.href      = link.dataset.verify || '#';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    img.src = '';
  }

  document.querySelectorAll('[data-cert-lightbox]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      open(link);
    });
  });

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

// Inject footer border and animate it
function initFooterBorder() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  const border = footer.querySelector('.footer-border');
  if (!border) return;

  gsap.to(border, {
    scaleX: 1,
    duration: 1.6,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: footer,
      start: 'top 95%'
    }
  });
}

// ─────────────────────────────────────────
// 16_MOBILE MENU
// ─────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.header-nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isOpen);
    
    if (!isOpen) {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'fixed';
      nav.style.top = 'var(--hdr-h)';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'rgba(6, 6, 8, 0.96)';
      nav.style.backdropFilter = 'blur(20px)';
      nav.style.padding = '1.5rem 2rem';
      nav.style.gap = '1.5rem';
      nav.style.borderBottom = '1px solid var(--border)';
      nav.style.zIndex = '998';
      
      gsap.from(nav, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.out' });
      
      const spans = hamburger.querySelectorAll('span');
      gsap.to(spans[0], { y: 7, rotation: 45, duration: 0.3 });
      gsap.to(spans[1], { opacity: 0, duration: 0.15 });
      gsap.to(spans[2], { y: -7, rotation: -45, duration: 0.3 });
    } else {
      gsap.to(nav, {
        opacity: 0, y: -10, duration: 0.2,
        onComplete: () => { nav.removeAttribute('style'); }
      });
      const spans = hamburger.querySelectorAll('span');
      gsap.to(spans, { y: 0, rotation: 0, opacity: 1, duration: 0.3 });
    }
  });

  // Close mobile menu on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.setAttribute('aria-expanded', 'false');
        nav.removeAttribute('style');
        const spans = hamburger.querySelectorAll('span');
        gsap.to(spans, { y: 0, rotation: 0, opacity: 1, duration: 0.3 });
      }
    });
  });

  // Reset menu layout on resize back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && hamburger.getAttribute('aria-expanded') === 'true') {
      hamburger.setAttribute('aria-expanded', 'false');
      nav.removeAttribute('style');
      const spans = hamburger.querySelectorAll('span');
      gsap.killTweensOf(spans);
      gsap.to(spans, { y: 0, rotation: 0, opacity: 1, duration: 0.3 });
    }
  }, { passive: true });
}

// ─────────────────────────────────────────
// 17_SCROLL TO TOP
// ─────────────────────────────────────────
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  
  ScrollTrigger.create({
    start: 'top -400',
    onEnter: () => gsap.to(btn, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }),
    onLeaveBack: () => gsap.to(btn, { opacity: 0, y: 20, duration: 0.3 })
  });
  
  btn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Quick arrow rotation effect on click
    const arrow = btn.querySelector('i');
    if (arrow) {
      gsap.to(arrow, {
        rotation: 360,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => gsap.set(arrow, { rotation: 0 })
      });
    }
  });
}

// ─────────────────────────────────────────
// HOVER INTERACTIONS & INTERACTIVE POLISH
// ─────────────────────────────────────────
function initHover() {
  // Service cards hover (GSAP border & shadow glow animation)
  document.querySelectorAll('.svc-card').forEach(card => {
    const img = card.querySelector('.svc-img');
    const title = card.querySelector('.svc-title');
    
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        boxShadow: '0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.3)',
        duration: 0.35,
        ease: 'power2.out'
      });
      if (img && !prefersReducedMotion) gsap.to(img, { scale: 1.06, duration: 0.5, ease: 'power2.out' });
      if (title) gsap.to(title, { color: 'var(--gold)', duration: 0.25 });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: 'none',
        duration: 0.4,
        ease: 'power2.out'
      });
      if (img && !prefersReducedMotion) gsap.to(img, { scale: 1, duration: 0.5 });
      if (title) gsap.to(title, { color: 'var(--text)', duration: 0.25 });
    });
  });

  // Project cards hover
  document.querySelectorAll('.proj-card').forEach(card => {
    const img = card.querySelector('.proj-img');
    const overlay = card.querySelector('.proj-overlay');
    const info = card.querySelector('.proj-info');
    
    card.addEventListener('mouseenter', () => {
      if (img && !prefersReducedMotion) gsap.to(img, { scale: 1.06, duration: 0.4 });
      if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.25 });
      if (info) gsap.to(info, { y: -4, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      if (img && !prefersReducedMotion) gsap.to(img, { scale: 1, duration: 0.4 });
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.25 });
      if (info) gsap.to(info, { y: 0, duration: 0.3, ease: 'power2.out' });
    });
  });

  // Skill cards hover
  document.querySelectorAll('.skill-card').forEach(card => {
    const icon = card.querySelector('.skill-icon');
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -4, borderColor: 'rgba(168,85,247,0.35)', duration: 0.25 });
      if (icon && !prefersReducedMotion) gsap.to(icon, { rotation: 10, scale: 1.08, duration: 0.25 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, borderColor: 'rgba(255,255,255,0.05)', duration: 0.25 });
      if (icon && !prefersReducedMotion) gsap.to(icon, { rotation: 0, scale: 1, duration: 0.25 });
    });
  });

  // Social buttons flip hover
  document.querySelectorAll('.social-btn').forEach(btn => {
    const icon = btn.querySelector('i');
    btn.addEventListener('mouseenter', () => {
      gsap.to(icon, { rotationY: 360, duration: 0.6, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.set(icon, { rotationY: 0 });
    });
  });

  // Contact form async submit via Formspree
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      
      btn.disabled = true;
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>Đang gửi...</span>';
      
      try {
        const formData = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        
        if (res.ok) {
          gsap.timeline()
            .to(btn, { scale: 0.96, duration: 0.08 })
            .to(btn, { scale: 1, duration: 0.2, ease: 'back.out(2)' })
            .add(() => {
              btn.innerHTML = '<span>✓ Đã gửi thành công!</span>';
              btn.style.background = 'linear-gradient(90deg,#22c55e,#16a34a)';
              form.reset();
              
              setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
              }, 4000);
            });
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        btn.innerHTML = '<span>⚠ Lỗi, thử lại sau</span>';
        btn.style.background = 'linear-gradient(90deg,var(--red),#b91c1c)';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
    });
  }
}

// ─────────────────────────────────────────
// MAIN EXECUTION ORDER
// ─────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  // Initialize cursor and mobile menu immediately
  initCursor();
  initMobileMenu();

  // Wait for preloader to finish
  await initPreloader();

  // Initialize interactive features
  initSpotlight();
  initMagnetic();
  initAmbient();

  // Hero section entrance
  initHero();

  // Global progress & navigation
  initScrollProgress();
  initNavHighlight();

  // Pages in visual order
  initAbout();
  initSkills();
  initContact();
  initCertLightbox();

  // Interactive hover animations
  initHover();

  // Independent scroll reveal animations
  try {
    initScrollReveal();
  } catch (e) {
    console.warn('[ScrollReveal] Error:', e.message);
  }

  // Async load GitHub Repos
  initGithubRepos();

  // Draw footer border
  initFooterBorder();

  // Scroll to top button
  initScrollTop();

  // Smooth scroll for all internal anchor links (Lenis)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Refresh ScrollTrigger to ensure correct offsets
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 600);
});
