document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const nav = document.querySelector(".nav");
  const progress = document.getElementById("site-progress");
  const glow = document.getElementById("cursor-glow");
  const canvas = document.getElementById("ambient-canvas");
  const hero = document.querySelector(".hero");
  const copy = document.querySelector(".hero-copy");
  const visual = document.querySelector(".hero-visual");
  const portrait = document.querySelector(".portrait-frame");
  const orbit = document.querySelector(".hero-orbit");
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const fine = window.matchMedia?.("(pointer:fine)")?.matches;

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".navlinks a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    }));
  }

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal-on-scroll: one observer only, avoiding competing transforms.
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll("section .glass, .timeline-item, .skill-block, .section-heading, .gallery-item").forEach((el, i) => {
      if (!el.classList.contains("reveal")) el.classList.add("reveal");
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + "ms";
      observer.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));
  }

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const close = document.getElementById("lightbox-close");
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  };
  document.querySelectorAll(".image-button").forEach(button => {
    const img = button.querySelector("img");
    if (!img) return;
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || "";
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  close?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Ambient particles.
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (ctx) {
      let dots = [];
      let width = 0, height = 0, dpr = 1;
      const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(90, Math.max(35, Math.floor(width * height / 18000)));
        dots = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.1 + .25,
          a: Math.random() * .30 + .08,
          v: Math.random() * .16 + .02,
          p: Math.random() * Math.PI * 2
        }));
      };
      resize();
      window.addEventListener("resize", resize, { passive: true });
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        for (const d of dots) {
          d.y -= d.v;
          if (d.y < -2) d.y = height + 2;
          d.p += .006;
          const alpha = d.a * (.78 + .22 * Math.sin(d.p));
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(111,91,232,${alpha})`;
          ctx.fill();
        }
        requestAnimationFrame(draw);
      };
      draw();
    }
  }

  // Cursor glow, kept independent from the hero transforms.
  if (glow && !reduced && fine) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let tx = gx, ty = gy;
    window.addEventListener("pointermove", e => {
      tx = e.clientX; ty = e.clientY;
      glow.style.opacity = "1";
    }, { passive: true });
    window.addEventListener("pointerleave", () => { glow.style.opacity = "0" });
    const follow = () => {
      gx += (tx - gx) * .12;
      gy += (ty - gy) * .12;
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
      requestAnimationFrame(follow);
    };
    follow();
  }

  // Single, stable 3D hero controller. No CSS animation competes with this.
  if (hero && !reduced && fine) {
    let mx = 0, my = 0, rx = 0, ry = 0, px = 0, py = 0;
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5;
      my = (e.clientY - r.top) / r.height - .5;
    }, { passive: true });
    hero.addEventListener("pointerleave", () => { mx = 0; my = 0; });
    const tick = () => {
      rx += (mx * 4.5 - rx) * .055;
      ry += (my * 3.5 - ry) * .055;
      px += (mx * 16 - px) * .055;
      py += (my * 12 - py) * .055;
      if (copy) copy.style.transform = `translate3d(${(px * .22).toFixed(2)}px,${(py * .22).toFixed(2)}px,0)`;
      if (visual) visual.style.transform = `translate3d(${px.toFixed(2)}px,${py.toFixed(2)}px,0)`;
      if (portrait) portrait.style.transform = `rotate(${(3 + rx * .28).toFixed(2)}deg) translate3d(${(px * .16).toFixed(2)}px,${(py * .16).toFixed(2)}px,0)`;
      if (orbit) orbit.style.transform = `translate(-50%,-50%) rotateX(${(66 + ry * .55).toFixed(2)}deg) rotateZ(${(-18 + rx * .65).toFixed(2)}deg)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  // One tilt listener per card. This prevents competing transform handlers.
  if (!reduced && fine) {
    document.querySelectorAll(".tilt-card").forEach(card => {
      if (card.classList.contains("portrait-frame")) return;
      card.style.transformStyle = "preserve-3d";
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1100px) rotateX(${(-y * 3.2).toFixed(2)}deg) rotateY(${(x * 4.2).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
    document.querySelectorAll(".magnetic").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - (r.left + r.width / 2)) / r.width) * 7;
        const y = ((e.clientY - (r.top + r.height / 2)) / r.height) * 5;
        btn.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }
});
