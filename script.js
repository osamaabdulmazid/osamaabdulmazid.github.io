(() => {
  "use strict";

  const nav = document.querySelector(".nav");
  const menu = document.getElementById("menu");
  const navLinks = document.querySelectorAll("#nav-links a");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  if (nav && menu) {
    const closeMenu = () => {
      nav.classList.remove("menu-open");
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
    };

    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("menu-open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    navLinks.forEach(link => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".section .glass, .timeline-item, .work-card, .skill-block, .credential-card, .education-card");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal", "is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(item => item.classList.add("reveal"));
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeButton = document.getElementById("lightbox-close");
  const imageButtons = document.querySelectorAll(".image-button");
  let lastFocused = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
      lightboxImage.removeAttribute("alt");
    }
    if (lastFocused) lastFocused.focus();
  };

  const openLightbox = button => {
    const image = button.querySelector("img");
    if (!lightbox || !image || !lightboxImage) return;
    lastFocused = button;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    if (closeButton) closeButton.focus();
  };

  imageButtons.forEach(button => button.addEventListener("click", () => openLightbox(button)));
  if (closeButton) closeButton.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && lightbox?.classList.contains("is-open")) closeLightbox();
  });
})();
