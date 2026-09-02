
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const nav = document.querySelector(".nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".navlinks a").forEach(a => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.10});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const close = document.getElementById("lightbox-close");
  document.querySelectorAll(".image-button img").forEach(img => {
    img.closest(".image-button").addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  function closeLightbox(){
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  }
  if (close) close.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
