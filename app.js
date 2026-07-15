// ==========================================
// GSAP Landing Page — dokhacgiakhoa.github.io
// Version: 2.6 (Antigravity Code Review Fixes)
// ==========================================

gsap.registerPlugin(ScrollTrigger, Flip, TextPlugin);

// ===== ACCESSIBILITY CHECK =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== MOBILE / TOUCH DETECTION =====
const isMobile = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;

// ===== LANGUAGE (VI / EN) =====
let currentLang = localStorage.getItem('lang') === 'en' ? 'en' : 'vi';
// Repos are fetched once and cached here so toggling language doesn't
// require re-fetching the GitHub API — just re-rendering existing data.
let cachedRepos = [];

// ===== FEATURED AI PROJECTS =====
// Chỉ hiện các repo liên quan AI + có giá trị ứng dụng thực tế.
// Thứ tự = thứ tự hiển thị. Mô tả viết tay (GitHub description phần lớn để trống).
const FEATURED_REPOS = [
  'agent-skills-setup-for-antigravity',
  'khoa-hoc-tam-linh',
  'multi-social-analytic-msa',
  'vaic-2026-vibonymus-prepare',
  'web-scraping-by-k.ai-labs',
  'videos-by-ai',
  '1000-hours-human-learning-with-ai',
];

const REPO_DESCRIPTIONS = {
  'agent-skills-setup-for-antigravity': 'Bộ CLI scaffold "skill" cho AI agent chạy trong Google AntiGravity IDE — tự động hoá việc dựng agent mới.',
  'khoa-hoc-tam-linh': 'App AI phân tích Bát Tự & thần số học — kết hợp huyền học phương Đông với Google Gemini.',
  'multi-social-analytic-msa': 'Hệ thống phân tích cảm xúc mạng xã hội đa nền tảng theo thời gian thực, dùng PhoBERT (NLP tiếng Việt).',
  'vaic-2026-vibonymus-prepare': 'Dashboard điều phối cho đội Vibonymus (6 người) chuẩn bị thi Vietnam AI Innovation Hackathon 2026.',
  'web-scraping-by-k.ai-labs': 'Extension + web app AI-first — audit SEO on-page bằng ngôn ngữ tự nhiên. Sản phẩm chính thức của K.AI Labs.',
  'videos-by-ai': 'Pipeline tự động hoá sản xuất video bằng AI — từ ý tưởng đến video hoàn chỉnh.',
  '1000-hours-human-learning-with-ai': 'Lộ trình tự học 35 tuần để trở thành full-stack engineer tích hợp AI — OKR, nguyên lý 80/20, Multi-AI Ecosystem.',
};

const REPO_DESCRIPTIONS_EN = {
  'agent-skills-setup-for-antigravity': 'A CLI scaffolding toolkit for AI agent "skills" running in Google AntiGravity IDE — automates setting up new agents.',
  'khoa-hoc-tam-linh': 'AI app for Bát Tự (Four Pillars) & numerology analysis — blending Eastern mysticism with Google Gemini.',
  'multi-social-analytic-msa': 'Real-time, multi-platform social media sentiment analysis system, powered by PhoBERT (Vietnamese NLP).',
  'vaic-2026-vibonymus-prepare': 'Coordination dashboard for Team Vibonymus (6 members) preparing for the Vietnam AI Innovation Hackathon 2026.',
  'web-scraping-by-k.ai-labs': 'AI-first browser extension + web app — natural-language on-page SEO audits. Official K.AI Labs product.',
  'videos-by-ai': 'An AI-powered video production automation pipeline — from idea to finished video.',
  '1000-hours-human-learning-with-ai': 'A self-designed 35-week curriculum to become an AI-integrated full-stack engineer — OKRs, the 80/20 principle, Multi-AI Ecosystem.',
};

// Display names for the repo cards — GitHub slugs are hyphenated by
// convention (agent-skills-setup-for-antigravity), which reads fine as a
// URL but poorly as a title. These map each repo to a clean, human title
// per language instead of showing the raw slug.
const REPO_DISPLAY_NAMES = {
  'agent-skills-setup-for-antigravity': 'Agent Skills cho AntiGravity',
  'khoa-hoc-tam-linh': 'Khoa Học Tâm Linh',
  'multi-social-analytic-msa': 'Phân Tích Đa Nền Tảng MSA',
  'vaic-2026-vibonymus-prepare': 'Vibonymus Chuẩn Bị VAIC 2026',
  'web-scraping-by-k.ai-labs': 'Web Scraping bởi K.AI Labs',
  'videos-by-ai': 'Video Bằng AI',
  '1000-hours-human-learning-with-ai': '1000 Giờ Học Cùng AI',
};

const REPO_DISPLAY_NAMES_EN = {
  'agent-skills-setup-for-antigravity': 'Agent Skills for AntiGravity',
  'khoa-hoc-tam-linh': 'Spiritual Science AI',
  'multi-social-analytic-msa': 'Multi Social Analytics (MSA)',
  'vaic-2026-vibonymus-prepare': 'Vibonymus VAIC 2026 Prep',
  'web-scraping-by-k.ai-labs': 'Web Scraping by K.AI Labs',
  'videos-by-ai': 'Videos by AI',
  '1000-hours-human-learning-with-ai': '1000 Hours Learning With AI',
};

function getRepoDisplayName(r, lang) {
  const key = r.name.toLowerCase();
  if (lang === 'en') return REPO_DISPLAY_NAMES_EN[key] || REPO_DISPLAY_NAMES[key] || r.name;
  return REPO_DISPLAY_NAMES[key] || r.name;
}

function getRepoDesc(r, lang) {
  const key = r.name.toLowerCase();
  if (lang === 'en') {
    return REPO_DESCRIPTIONS_EN[key] || REPO_DESCRIPTIONS[key] ||
      (r.description ? r.description.substring(0, 110) + (r.description.length > 110 ? '…' : '') : 'No description.');
  }
  return REPO_DESCRIPTIONS[key] ||
    (r.description ? r.description.substring(0, 110) + (r.description.length > 110 ? '…' : '') : 'Không có mô tả.');
}

function formatRepoDate(iso, lang) {
  const date = new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
  return `${lang === 'en' ? 'Updated' : 'Cập nhật'} ${date}`;
}

// ===== REPO THUMBNAIL MAP =====
// Keys are repo names lowercased. Images go in Media/repo-thumbs/
const REPO_THUMBS = {
  'agent-skills-setup-for-antigravity':  'Media/repo-thumbs/agent-skills-antigravity.jpg',
  'khoa-hoc-tam-linh':                   'Media/repo-thumbs/khoa-hoc-tam-linh.jpg',
  'videos-by-ai':                        'Media/repo-thumbs/videos-by-ai.jpg',
  'multi-social-analytic-msa':           'Media/repo-thumbs/multi-social-analytic-msa.png',
  'vaic-2026-vibonymus-prepare':         'Media/repo-thumbs/vaic-2026-vibonymus.png',
  'web-scraping-by-k.ai-labs':           'Media/repo-thumbs/web-scraping-kai-labs.png',
  '1000-hours-human-learning-with-ai':   'Media/repo-thumbs/1000-hours-human-learning-with-ai.png',
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

// Glitch/scramble a text element to random chars then settle back to the
// original — reused for the repos eyebrow reveal and for hover effects.
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01#@$%&";
function scrambleText(el, { steps = 8, interval = 35, color } = {}) {
  if (prefersReducedMotion || el.dataset.scrambling) return;
  const finalVal = el.dataset.scrambleOriginal || el.textContent;
  el.dataset.scrambleOriginal = finalVal;
  el.dataset.scrambling = '1';
  const prevColor = el.style.color;
  if (color) el.style.color = color;
  let count = 0;
  const timer = setInterval(() => {
    el.textContent = finalVal
      .split('')
      .map(c => (c === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
      .join('');
    count++;
    if (count >= steps) {
      clearInterval(timer);
      el.textContent = finalVal;
      el.style.color = prevColor;
      delete el.dataset.scrambling;
    }
  }, interval);
}

// ─────────────────────────────────────────
// LANGUAGE TOGGLE (VI / EN)
// ─────────────────────────────────────────
// Elements carry the Vietnamese copy as their actual markup (source of
// truth) plus a `data-en` attribute holding the English replacement.
// Switching to EN backs up the current (Vietnamese) innerHTML into
// `data-vi-backup` the first time, then swaps in `data-en`. Switching
// back to VI restores that backup — no need to hand-author a data-vi
// twin of every element.
function translateNode(el, lang) {
  if (lang === 'en') {
    if (el.dataset.viBackup === undefined) el.dataset.viBackup = el.innerHTML;
    el.innerHTML = el.dataset.en;
  } else if (el.dataset.viBackup !== undefined) {
    el.innerHTML = el.dataset.viBackup;
  }
}

function updateRepoCardsLanguage(lang) {
  document.querySelectorAll('#reposGrid .repo-card').forEach(card => {
    const repo = cachedRepos.find(r => r.name.toLowerCase() === card.dataset.repoName);
    if (!repo) return;
    const name = card.querySelector('.repo-name');
    if (name) name.textContent = getRepoDisplayName(repo, lang);
    const desc = card.querySelector('.repo-desc');
    if (desc) desc.textContent = getRepoDesc(repo, lang);
    const updated = card.querySelector('.repo-updated');
    if (updated) updated.textContent = formatRepoDate(updated.dataset.updatedIso, lang);
  });
  const allBtn = document.querySelector('#reposFilter .filter-btn[data-lang="all"]');
  if (allBtn) allBtn.textContent = lang === 'en' ? 'All' : 'Tất cả';
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-en]').forEach(el => translateNode(el, lang));
  updateRepoCardsLanguage(lang);

  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
}

function initLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  applyLanguage(currentLang);
  btn.addEventListener('click', () => {
    applyLanguage(currentLang === 'vi' ? 'en' : 'vi');
  });
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

  // Set initial states (always, for all elements except titleEl on mobile)
  gsap.set('.main-header', { y: -72, opacity: 0 });
  gsap.set('.hero-eyebrow', { opacity: 0 });
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
        const originalVal = "Code less. Build more.";
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
            if (cursor) {
              gsap.to(cursor, { opacity: 0, duration: 0.3, delay: 1.5 });
            }
          }
        });
      }
    }, '-=0.4');

  if (prefersReducedMotion || isMobile) {
    // Mobile: keep original text so .hero-title CSS gradient (background-clip:text)
    // applies directly — background-clip:text does NOT paint through inline-block children.
    // Fade the title in as one unit.
    gsap.set(titleEl, { opacity: 0 });
    tl.to(titleEl, { opacity: 1, duration: 0.8 }, '-=0.2');
  } else {
    // Desktop: split into individual character spans for glitch effect.
    // background-clip:text on parent does NOT paint through inline-block child spans,
    // so we bake the gradient into each .ch span at the correct background-position.
    const text = titleEl.textContent.trim();
    titleEl.innerHTML = text.split('').map(c =>
      `<span class="ch" style="display:inline-block; transform-style:preserve-3d;">${c === ' ' ? '&nbsp;' : c}</span>`
    ).join('');

    const chars = titleEl.querySelectorAll('.ch');
    gsap.set(chars, { opacity: 0 });

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
      duration: 1.2,
      stagger: 0.14,
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
      duration: 0.9,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: eyebrow, start: 'top 88%' }
    });
  }

  // 2. Line wipe body paragraphs
  const paragraphs = sec.querySelectorAll('.body-text');
  paragraphs.forEach(p => {
    gsap.from(p, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1.6,
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
    duration: 0.75,
    stagger: 0.13,
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
          duration: 0.95,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: panel,
            start: 'top 80%',
            toggleActions: 'play none none none',
            onEnter: () => {
              if (prefersReducedMotion) return;
              // Idle HUD scanline pulse once the bar has finished filling in —
              // reinforces the "live panel" feel instead of sitting static.
              gsap.to(scanBar, {
                opacity: 0.4,
                duration: 1.4,
                delay: 0.95,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
              });
            }
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
        { clipPath: 'inset(0 0% 0 0 round 6px)', duration: 0.65, ease: 'power2.inOut' }
      );

      // Skill bar fills just as the card fully appears
      if (skillBar && pct) {
        const overshoot = Math.min(pct + 10, 100);
        tl.to(skillBar, { width: overshoot + '%', duration: 0.7, ease: 'power3.out' }, '-=0.1')
          .to(skillBar, { width: pct + '%', duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      }
    });

    panel.querySelectorAll('.cert-card').forEach(card => {
      gsap.fromTo(card,
        { clipPath: 'inset(0 100% 0 0 round 6px)' },
        {
          clipPath: 'inset(0 0% 0 0 round 6px)',
          duration: 0.65,
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

// GitHub's unauthenticated REST API caps unauthenticated callers at 60
// requests/hour PER IP — shared by everyone on the same network. Calling
// it fresh on every page load burns through that fast. Three layers,
// cheapest/most-reliable first:
//   1. localStorage (instant, no network, survives reloads for 1h)
//   2. data/repos.json — a same-origin snapshot a GitHub Actions workflow
//      refreshes periodically using the authenticated GITHUB_TOKEN
//      (5000 req/hour), so visitors never touch GitHub's API directly
//   3. Live GitHub API — last-resort fallback if the snapshot is missing
const REPOS_CACHE_KEY = 'github_repos_cache_v1';
const REPOS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

function readReposCache() {
  try {
    const raw = localStorage.getItem(REPOS_CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (!Array.isArray(data) || Date.now() - ts > REPOS_CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeReposCache(data) {
  try {
    localStorage.setItem(REPOS_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage unavailable (private mode, quota full) — not fatal
  }
}

async function fetchReposData() {
  const cached = readReposCache();
  if (cached) return cached;

  try {
    const res = await fetch('data/repos.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        writeReposCache(data);
        return data;
      }
    }
  } catch {
    // snapshot not deployed yet / network hiccup — fall through to live API
  }

  let all = null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(
      'https://api.github.com/users/dokhacgiakhoa/repos?sort=updated&per_page=20&type=owner',
      { signal: ctrl.signal, headers: { 'Accept': 'application/vnd.github.mercy-preview+json' } }
    );
    if (res.ok) all = await res.json();
  } catch (err) {
    console.warn('Live GitHub API fetch failed.', err);
  } finally {
    clearTimeout(timer);
  }

  if (Array.isArray(all)) writeReposCache(all);
  return all;
}

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
    const all = await fetchReposData();

    if (!all || !Array.isArray(all)) {
      showError('Không tải được dữ liệu GitHub.');
      return;
    }
    
    // Chỉ lấy các repo AI-related đã chọn, giữ đúng thứ tự curation
    const byName = new Map(all.map(r => [r.name.toLowerCase(), r]));
    const repos = FEATURED_REPOS.map(name => byName.get(name)).filter(Boolean);

    if (!repos.length) {
      grid.innerHTML = '<p class="muted text-center" style="padding:2rem">Không có repo nào.</p>';
      return;
    }

    // Animate stats bar (tính trên các dự án đang hiển thị)
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
    const statsBar = document.getElementById('reposStatsBar');
    if (statsBar) {
      statsBar.style.display = 'flex';

      const statsObj = { repos: 0, stars: 0, forks: 0 };

      if (!prefersReducedMotion) {
        gsap.to(statsObj, {
          repos: repos.length,
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
        document.getElementById('totalRepos').textContent = repos.length;
        document.getElementById('totalStars').textContent = totalStars;
        document.getElementById('totalForks').textContent = totalForks;
      }
    }

    // Eyebrow scramble glitch effect
    const eyebrow = document.querySelector('#repos .eyebrow');
    if (eyebrow && !prefersReducedMotion) {
      ScrollTrigger.create({
        trigger: eyebrow,
        start: 'top 90%',
        once: true,
        onEnter: () => scrambleText(eyebrow, { steps: 11, color: '#ef4444' })
      });
    }

    // Render filter buttons
    const langs = [...new Set(repos.map(r => r.language).filter(Boolean))];
    if (filter && langs.length) {
      filter.innerHTML =
        `<button class="filter-btn active" data-lang="all">${currentLang === 'en' ? 'All' : 'Tất cả'}</button>` +
        langs.map(l => `<button class="filter-btn" data-lang="${l}">${l}</button>`).join('');

      // Stagger buttons entrance — no ScrollTrigger, runs immediately after DOM insert
      gsap.from(filter.querySelectorAll('.filter-btn'), {
        opacity: 0,
        y: 16,
        scale: 0.88,
        stagger: 0.1,
        duration: 0.65,
        ease: 'back.out(1.8)',
        clearProps: 'all'
      });

      // Filter trigger — Flip animates the remaining cards sliding into their
      // new grid slots instead of just fading in place, so the reflow itself
      // reads as an intentional transition rather than a layout jump.
      filter.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.dataset.lang;
        const cards = grid.querySelectorAll('.repo-card');

        if (prefersReducedMotion) {
          cards.forEach(card => {
            card.style.display = (lang === 'all' || card.dataset.lang === lang) ? '' : 'none';
          });
          return;
        }

        const state = Flip.getState(cards, { props: 'opacity' });
        cards.forEach(card => {
          card.style.display = (lang === 'all' || card.dataset.lang === lang) ? '' : 'none';
        });
        Flip.from(state, {
          duration: 0.6,
          scale: true,
          ease: 'power3.inOut',
          absolute: true,
          onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.04 }),
          onLeave: els => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.25 })
        });
      });
    }

    // Render repo cards
    cachedRepos = repos;
    grid.innerHTML = repos.map(r => {
      const color = LANG_COLORS[r.language] || '#6b7280';
      const desc = getRepoDesc(r, currentLang);
      const updatedDate = formatRepoDate(r.updated_at, currentLang);
      const topicsHTML = r.topics?.slice(0, 3).map(t =>
        `<span class="repo-topic">${t}</span>`
      ).join('') || '';
      const thumb = REPO_THUMBS[r.name.toLowerCase()];
      const thumbHTML = thumb
        ? `<div class="repo-thumb"><img src="${thumb}" alt="${getRepoDisplayName(r, currentLang)} preview" loading="lazy" /></div>`
        : `<div class="repo-thumb repo-thumb--placeholder" style="--lang-color:${color}"></div>`;

      return `
        <a href="${r.html_url}" target="_blank" rel="noopener noreferrer"
           class="repo-card" data-lang="${r.language || ''}" data-repo-name="${r.name.toLowerCase()}">
          ${thumbHTML}
          <div class="repo-card-top">
            <div class="repo-header">
              <div class="repo-icon-wrap">
                <i class="bi bi-folder2-open c-gold"></i>
              </div>
              <i class="bi bi-box-arrow-up-right repo-ext-icon"></i>
            </div>
            <h4 class="repo-name">${getRepoDisplayName(r, currentLang)}</h4>
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
            <span class="repo-updated" data-updated-iso="${r.updated_at}">${updatedDate}</span>
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
      stagger: 0.12,
      duration: 1.4,
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
  } finally {
    // Repos load async and change document height — sections rendered below
    // (K.AI Labs, Contact, Footer) need their ScrollTrigger offsets recalculated
    // against the final layout, otherwise their scroll-triggered reveals
    // (e.g. .social-btn) can end up positioned against a stale, shorter page.
    requestAnimationFrame(() => ScrollTrigger.refresh());
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
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Contact preview card: fade + slide up on scroll into view
  const preview = sec.querySelector('.contact-preview');
  if (preview) {
    gsap.from(preview, {
      opacity: 0,
      y: 25,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: preview,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Social row icons (incl. Email) are plain <button>s, not links — they only
  // select which channel's info shows in .contact-preview above. The actual
  // clickable, navigable link lives solely in the preview card.
  const socialRow = sec.querySelector('#socialRow');
  const previewLabel = document.getElementById('contactPreviewLabel');
  const previewLink = document.getElementById('contactPreviewLink');
  if (socialRow && previewLabel && previewLink) {
    socialRow.querySelectorAll('.social-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        socialRow.querySelectorAll('.social-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const href = btn.dataset.href;
        previewLabel.textContent = btn.dataset.label;
        previewLink.textContent = btn.dataset.display;
        previewLink.href = href;
        if (href.startsWith('mailto:')) {
          previewLink.removeAttribute('target');
          previewLink.removeAttribute('rel');
        } else {
          previewLink.target = '_blank';
          previewLink.rel = 'noopener';
        }
        gsap.from(previewLink, { opacity: 0, y: 6, duration: 0.35, ease: 'power2.out' });
      });
    });
  }

  // Social buttons bounce-in
  gsap.fromTo('.social-btn',
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      stagger: 0.15,
      duration: 0.9,
      ease: prefersReducedMotion ? 'power2.out' : 'back.out(2.5)',
      scrollTrigger: { trigger: '.social-row', start: 'top 92%' }
    }
  );
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
      duration: 0.8,
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
        duration: 1.1,
        stagger: 0.12,
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

  // Nav links: scramble/glitch the label on hover (skipped on touch devices —
  // there's no hover state to trigger it, and it'd fire on tap instead)
  if (!isMobile) {
    document.querySelectorAll('.nav-link, .btn-nav').forEach(link => {
      link.addEventListener('mouseenter', () => scrambleText(link, { steps: 6, interval: 28 }));
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

  // Apply saved language preference before anything renders/animates
  initLangToggle();

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
