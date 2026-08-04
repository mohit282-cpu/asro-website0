// ── ASRO SHARED JS (DYNAMIC ZERO-GRAVITY ENGINE & ANIMATIONS) ──

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Active nav link with aria-current
(function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
})();

// Accessible Hamburger toggle
const hamburger = document.querySelector('.hamburger');
const mainNav   = document.querySelector('nav');

if (hamburger && mainNav) {
  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mainNav.classList.contains('open');
    mainNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', e => {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });
}

// Magnetic Primary CTA Button Physics
(function initMagneticNavCTA() {
  const ctaBtn = document.querySelector('.nav-cta');
  if (!ctaBtn || isReducedMotion) return;

  ctaBtn.addEventListener('mousemove', (e) => {
    const rect = ctaBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ctaBtn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.04)`;
  });

  ctaBtn.addEventListener('mouseleave', () => {
    ctaBtn.style.transform = 'translate(0, 0) scale(1)';
  });
})();

// Spatial Cursor 3D Parallax Tilt Physics (glassmorphismandSpatial.md SPEC)
(function initSpatialCardParallax() {
  if (isReducedMotion || window.innerWidth < 900) return;

  const selector = '.service-card, .prog-card, .blog-card, .team-card, .equip-card, .rule-card, .expect-card';
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const rx = ((y / rect.height) - 0.5) * -10; // -5deg to +5deg
      const ry = ((x / rect.width) - 0.5) * 10;   // -5deg to +5deg
      
      card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
})();

// ── 1. DYNAMIC ZERO-GRAVITY LIFTOFF ICON SPAWNER (§4 of ANIMATION.md) ──
(function initAntigravitySpawner() {
  const layer = document.getElementById('antigravity-icons');
  if (!layer || isReducedMotion) return;

  const icons = [
    'folder', 'terminal', 'code', 'check_circle', 
    'device_hub', 'merge', 'file_copy', 'data_object', 
    'commit', 'deployed_code', 'developer_mode_tv',
    'science', 'biotech', 'rocket_launch', 'memory', 'lightbulb', 'precision_manufacturing'
  ];

  const ICON_COUNT = 32;

  for (let i = 0; i < ICON_COUNT; i++) {
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('floating-icon');
    iconSpan.innerText = icons[Math.floor(Math.random() * icons.length)];
    iconSpan.style.left = `${Math.random() * 95}vw`;

    const size = 1.2 + Math.random() * 2.2;
    iconSpan.style.fontSize = `${size}rem`;

    const floatDuration = 12 + Math.random() * 20;
    const driftDuration = 3 + Math.random() * 5;
    const delay = Math.random() * -20;

    iconSpan.style.animation = `
      floatUp ${floatDuration}s ${delay}s infinite linear,
      drift ${driftDuration}s ${delay}s infinite ease-in-out alternate
    `;

    layer.appendChild(iconSpan);
  }
})();

// ── 2. SCROLL REVEAL SYSTEM ──
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const el = e.target;
      if (el.parentElement) {
        const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const sIndex = siblings.indexOf(el);
        if (sIndex > 0 && !el.style.transitionDelay) {
          el.style.transitionDelay = `${sIndex * 90}ms`;
        }
      }
      el.classList.add('is-visible');
      el.classList.add('visible');
      io.unobserve(el);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── 3. CUSTOM CURSOR ──
if (window.innerWidth > 900 && !isReducedMotion) {
  const heroZone = document.querySelector('.hero');
  if (heroZone) {
    const cursorEl = document.createElement('div');
    cursorEl.className = 'antigravity-cursor';
    cursorEl.innerHTML = '<span class="material-symbols-outlined" style="font-size:22px;">rocket_launch</span>';
    document.body.appendChild(cursorEl);

    let mx = 0, my = 0, cx = 0, cy = 0, raf;

    const loop = () => {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursorEl.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    heroZone.addEventListener('mouseenter', () => {
      cursorEl.style.opacity = '1';
      raf = requestAnimationFrame(loop);
    });

    heroZone.addEventListener('mousemove', (e) => {
      mx = e.clientX - cursorEl.offsetWidth / 2;
      my = e.clientY - cursorEl.offsetHeight / 2;
    });

    heroZone.addEventListener('mouseleave', () => {
      cursorEl.style.opacity = '0';
      cancelAnimationFrame(raf);
    });
  }
}

// ── 4. STICKY HEADER ──
window.addEventListener('scroll', () => {
  if (mainNav) {
    if (window.scrollY > 10) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }
});

// ── 5. ANIMATED NUMBERS COUNTER ──
const animateCounter = (el) => {
  const targetText = el.innerText.trim();
  const match = targetText.match(/\d+/);
  if (!match) return;

  const targetNum = parseInt(match[0], 10);
  const prefix = targetText.substring(0, match.index);
  const suffix = targetText.substring(match.index + match[0].length);

  let startTime = null;
  const duration = 1600;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentNum = Math.floor(easeProgress * targetNum);

    el.innerText = `${prefix}${currentNum}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      el.innerText = targetText;
    }
  };

  window.requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (!isReducedMotion) {
        animateCounter(el);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hero-stat-num, .stat-bar-num, .mission-badge .num').forEach((el) => {
  counterObserver.observe(el);
});

// ── 6. §2.1 HERO HEADLINE MASK REVEAL ──
// Fires on page load ~300ms after hero mount (above the fold, not scroll-triggered)
(function initHeadlineMaskReveal() {
  if (isReducedMotion) return;
  const masks = document.querySelectorAll('.hero-title-mask');
  if (!masks.length) return;
  setTimeout(() => {
    masks.forEach(mask => mask.classList.add('is-visible'));
  }, 300);
})();

// ── 7. §2.2 HERO FLOATING ICON FIELD WITH MOUSE PARALLAX ──
// Scattered Material icons with idle float + parallax on mousemove
(function initHeroIconField() {
  if (isReducedMotion) return;
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const iconLayer = document.getElementById('antigravity-icons');
  if (!iconLayer) return;

  // Create fixed-position hero icons (§2.2 spec: scattered around hero)
  const heroIcons = [
    'refresh', 'folder', 'code', 'terminal', 'check_circle',
    'device_hub', 'merge', 'file_copy', 'data_object',
    'commit', 'deployed_code', 'developer_mode_tv',
    'science', 'biotech', 'rocket_launch', 'memory', 'lightbulb'
  ];

  const FIELD_COUNT = 18;
  const fieldIcons = [];

  for (let i = 0; i < FIELD_COUNT; i++) {
    const span = document.createElement('span');
    span.classList.add('hero-icon');
    span.innerText = heroIcons[i % heroIcons.length];
    span.style.setProperty('--i', i);

    // Randomized position (§2.2: seeded/fixed coordinates around hero)
    span.style.left = `${5 + Math.random() * 88}%`;
    span.style.top = `${5 + Math.random() * 85}%`;

    // Randomized opacity 0.15–0.4 and scale 0.8–1.3
    const opacity = 0.15 + Math.random() * 0.25;
    const scale = 0.8 + Math.random() * 0.5;
    span.style.opacity = opacity;
    span.style.fontSize = `${scale * 2}rem`;

    // Randomized idle float duration 4–8s
    const dur = 4 + Math.random() * 4;
    span.style.animationDuration = `${dur}s`;

    // Depth layer for parallax (0 = far/slow, 1 = close/fast)
    span.dataset.depth = (0.3 + Math.random() * 0.7).toFixed(2);

    iconLayer.appendChild(span);
    fieldIcons.push(span);
  }

  // §2.2 Parallax on mouse move (icons translate a few px with cursor, depth layers)
  if (window.innerWidth > 768) {
    let pmx = 0, pmy = 0, cpx = 0, cpy = 0, pRaf;

    const parallaxLoop = () => {
      cpx += (pmx - cpx) * 0.08;
      cpy += (pmy - cpy) * 0.08;

      fieldIcons.forEach(icon => {
        const depth = parseFloat(icon.dataset.depth);
        const moveX = cpx * depth * 15;
        const moveY = cpy * depth * 10;
        icon.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      pRaf = requestAnimationFrame(parallaxLoop);
    };

    heroSection.addEventListener('mouseenter', () => {
      pRaf = requestAnimationFrame(parallaxLoop);
    });

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      // Normalize to -1..1 from center of hero
      pmx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pmy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    heroSection.addEventListener('mouseleave', () => {
      pmx = 0;
      pmy = 0;
      // Let lerp bring icons back to center
      setTimeout(() => {
        if (pmx === 0 && pmy === 0) cancelAnimationFrame(pRaf);
      }, 800);
    });
  }

  // §2.2 Scroll parallax: icon field moves slower than scroll (~0.3-0.5×)
  heroSection.setAttribute('data-parallax', 'true');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    if (scrollY < heroHeight) {
      iconLayer.style.transform = `translateY(${scrollY * 0.35}px)`;
    }
  }, { passive: true });
})();

// ── 8. §5 BLOG RAIL ARROW NAVIGATION ──
(function initBlogRailNav() {
  document.querySelectorAll('.blog-rail').forEach(rail => {
    const prevBtn = rail.parentElement.querySelector('.rail-arrow-prev');
    const nextBtn = rail.parentElement.querySelector('.rail-arrow-next');
    if (!prevBtn || !nextBtn) return;

    const cardWidth = () => {
      const firstChild = rail.firstElementChild;
      return firstChild ? firstChild.offsetWidth + 24 : 340;
    };

    const updateArrowState = () => {
      prevBtn.classList.toggle('is-disabled', rail.scrollLeft <= 5);
      nextBtn.classList.toggle('is-disabled', rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 5);
    };

    prevBtn.addEventListener('click', () => {
      rail.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      rail.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });

    rail.addEventListener('scroll', updateArrowState, { passive: true });
    updateArrowState();
  });
})();

