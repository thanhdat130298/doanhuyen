const ANIM_TYPES = [
  "fade-up",
  "fade-down",
  "fade-left",
  "fade-right",
  "scale",
  "blur-up",
  "flip-up",
  "swirl-in",
  "elastic-in",
  "pop-rotate",
];

export function initAnimations() {
  try {
    const params = new URLSearchParams(window.location.search);
    const forceOff = params.get("fx") === "off";
    const prefersReduced = false;

    autoTagElements();
    initSectionTransitions(prefersReduced);

    const items = document.querySelectorAll(".anim");
    if (!items.length) return;

    if (forceOff) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }

    document.documentElement.classList.add("js-anim");

    const show = (el) => {
      el.classList.add("visible");
      el.closest(".stagger-group")?.classList.add("is-visible");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 60px 0px" }
    );

    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        const delay = parseFloat(el.style.getPropertyValue("--delay") || "0") * 1000;
        setTimeout(() => show(el), delay);
      } else {
        observer.observe(el);
      }
    });

    initHeroParallax();
    initNavLinkActive();
    initTiltCards(prefersReduced);
    initButtonRipples(prefersReduced);
    initMagneticButtons(prefersReduced);
    initHeroTypewriter(prefersReduced);
    initCursorTrail(prefersReduced);
    initCosmicBackground(prefersReduced);
    initGlitchHeadline(prefersReduced);
  } catch (error) {
    // Failsafe: never hide content if any animation setup fails in local previews.
    console.warn("Animation init fallback:", error);
    document.documentElement.classList.remove("js-anim");
    document.querySelectorAll(".anim").forEach((el) => el.classList.add("visible"));
  }
}

function initSectionTransitions(prefersReduced) {
  const blocks = document.querySelectorAll("section, footer.site-footer");
  if (!blocks.length) return;

  blocks.forEach((block, i) => {
    block.classList.add("section-anim");
    block.dataset.sectionAnim =
      block.id || (block.classList.contains("site-footer") ? "footer" : `section-${i}`);
  });

  const params = new URLSearchParams(window.location.search);
  if (prefersReduced || params.get("fx") === "off") {
    blocks.forEach((block) => block.classList.add("section-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  blocks.forEach((block) => observer.observe(block));
}

function initTiltCards(prefersReduced) {
  if (prefersReduced) return;

  const cards = document.querySelectorAll(
    ".letter-card, .detail-card, .count-box, .map-wrap, .thanks-card, .wishes-box"
  );
  if (!cards.length) return;

  cards.forEach((card) => {
    card.classList.add("tilt-card");

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -8;
      const ry = ((x / rect.width) - 0.5) * 10;
      card.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
      card.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`);
    };

    const reset = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--glow-x", "50%");
      card.style.setProperty("--glow-y", "50%");
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);
  });
}

function initButtonRipples(prefersReduced) {
  if (prefersReduced) return;
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });
}

function initMagneticButtons(prefersReduced) {
  if (prefersReduced) return;
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      btn.style.setProperty("--mx", `${dx.toFixed(2)}px`);
      btn.style.setProperty("--my", `${dy.toFixed(2)}px`);
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.setProperty("--mx", "0px");
      btn.style.setProperty("--my", "0px");
    });
  });
}

function initHeroTypewriter(prefersReduced) {
  if (prefersReduced) return;
  const heroTitle = document.querySelector(".hero h1");
  if (!heroTitle || heroTitle.dataset.typed === "true") return;

  const fullText = heroTitle.textContent.trim();
  if (!fullText) return;

  heroTitle.dataset.typed = "true";
  heroTitle.textContent = "";
  heroTitle.classList.add("typewriter");
  let i = 0;

  const tick = () => {
    i += 1;
    heroTitle.textContent = fullText.slice(0, i);
    if (i < fullText.length) {
      setTimeout(tick, 45);
    } else {
      heroTitle.classList.remove("typewriter");
    }
  };

  setTimeout(tick, 280);
}

function initCursorTrail(prefersReduced) {
  const trail = document.querySelector(".cursor-trail");
  if (!trail) return;
  const isTouchLike = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (prefersReduced || isTouchLike) {
    trail.style.display = "none";
    return;
  }

  let rafId = null;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;

  const render = () => {
    x += (targetX - x) * 0.18;
    y += (targetY - y) * 0.18;
    trail.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    rafId = requestAnimationFrame(render);
  };

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  document.querySelectorAll("a, button, .btn, .tilt-card").forEach((el) => {
    el.addEventListener("mouseenter", () => trail.classList.add("hover"));
    el.addEventListener("mouseleave", () => trail.classList.remove("hover"));
  });

  render();
  window.addEventListener("beforeunload", () => cancelAnimationFrame(rafId), { once: true });
}

function initCosmicBackground(prefersReduced) {
  const canvas = document.getElementById("fx-canvas");
  if (!canvas) return;
  if (prefersReduced) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const stars = [];
  const STAR_COUNT = 80;
  let w = 0;
  let h = 0;
  let rafId = null;

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  const resetStar = () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.22,
    vy: 0.1 + Math.random() * 0.5,
    r: 0.4 + Math.random() * 1.8,
    a: 0.2 + Math.random() * 0.6,
  });

  resize();
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i += 1) stars.push(resetStar());

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "screen";
    stars.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.y > h + 8 || s.x < -8 || s.x > w + 8) {
        Object.assign(s, resetStar(), { y: -6 });
      }

      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 8);
      g.addColorStop(0, `rgba(255,255,255,${s.a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 8, 0, Math.PI * 2);
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  };

  draw();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "beforeunload",
    () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    },
    { once: true }
  );
}

function initGlitchHeadline(prefersReduced) {
  const title = document.querySelector(".hero h1");
  if (!title || prefersReduced) return;

  title.dataset.text = title.textContent.trim();
  const glitch = () => {
    title.classList.add("glitching");
    setTimeout(() => title.classList.remove("glitching"), 260);
  };

  setInterval(glitch, 4200 + Math.random() * 1600);
  title.addEventListener("mouseenter", glitch);
}

function autoTagElements() {
  const heroSelectors = [
    ".uni-name",
    ".invite-badge",
    ".avatar",
    ".hero h1",
    ".hero-degree",
    ".hero-name",
    ".meta-pill",
    ".scroll-cue",
  ];

  heroSelectors.forEach((sel, i) => {
    document.querySelectorAll(sel).forEach((el) => {
      tag(el, "fade-up", i * 0.08);
    });
  });

  document.querySelectorAll("section, footer.site-footer").forEach((section) => {
    const group = section.querySelector(".container") || section;
    const children = [...group.children].filter((el) =>
      el.matches(
        ".section-tag, .section-title, .letter-card, .map-wrap, .map-actions, .thanks-card, .wishes-box"
      )
    );

    group.querySelectorAll(".ornament, .letter-body, .signature, .wishes-intro").forEach((el, i) => {
      tag(el, "blur-up", 0.15 + i * 0.1);
    });

    group.querySelectorAll(".form-group").forEach((el, i) => {
      tag(el, "fade-up", 0.2 + i * 0.12);
    });

    group.querySelectorAll("#wish-form > .btn-primary, .success-panel > *").forEach((el, i) => {
      tag(el, "scale", 0.1 + i * 0.08);
    });

    group.querySelectorAll(".detail-card").forEach((el, i) => {
      tag(el, i % 2 === 0 ? "fade-left" : "fade-right", i * 0.12);
    });

    group.querySelectorAll(".count-box").forEach((el, i) => {
      tag(el, "scale", i * 0.1);
    });

    children.forEach((el, i) => {
      if (el.classList.contains("anim")) return;
      tag(el, ANIM_TYPES[i % ANIM_TYPES.length], i * 0.1);
    });
  });

  document.querySelectorAll(".nav-links li").forEach((el, i) => {
    tag(el, "fade-down", i * 0.06);
  });
  tag(document.querySelector(".nav-brand"), "fade-down", 0);
}

function tag(el, type, delaySec = 0) {
  if (!el || el.classList.contains("anim")) return;
  el.classList.add("anim", `anim-${type}`);
  el.style.setProperty("--delay", `${delaySec}s`);
}

function initHeroParallax() {
  const blobs = document.querySelector(".hero-bg");
  if (!blobs || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.addEventListener(
    "scroll",
    () => {
      blobs.style.transform = `translate3d(0, ${window.scrollY * 0.12}px, 0)`;
    },
    { passive: true }
  );
}

function initNavLinkActive() {
  const links = document.querySelectorAll(".nav-links a");
  const sections = [...links]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}
