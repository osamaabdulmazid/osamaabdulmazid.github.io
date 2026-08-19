document.addEventListener("DOMContentLoaded", () => {
  const D = window.PORTFOLIO;

  const $ = (id) => document.getElementById(id);
  $("brand").textContent = D.person.name;
  $("hero-name").innerHTML = D.person.name.split(" ").slice(0, -1).join(" ") + ' <span class="gradient">' + D.person.name.split(" ").slice(-1)[0] + '</span>';
  $("hero-role").textContent = D.person.role;
  $("hero-tagline").textContent = D.person.tagline;
  $("hero-summary").textContent = D.person.summary;
  $("location").textContent = D.person.location;
  $("email").textContent = D.person.email;
  $("phone").textContent = D.person.phone;
  $("linkedin").href = D.person.linkedin;
  $("contact-email").href = "mailto:" + D.person.email;
  $("contact-email-label").textContent = D.person.email;
  $("contact-phone").href = "tel:" + D.person.phone.replace(/\s/g, "");
  $("contact-phone-label").textContent = D.person.phone;

  $("stats").innerHTML = D.stats.map(s => `<div class="stat glass reveal"><strong>${s.value}</strong><span>${s.label}</span></div>`).join("");
  $("focus-pills").innerHTML = D.focus.map(x => `<span class="pill">${x}</span>`).join("");

  $("highlights-list").innerHTML = D.highlights.map(x => `
    <article class="info-card glass reveal"><h3>${x}</h3><p>Selected CV highlight</p></article>
  `).join("");

  $("experience-list").innerHTML = D.experience.map(e => `
    <article class="timeline-item reveal">
      <div class="time">${e.period}</div>
      <h3>${e.title}</h3>
      <div class="org">${e.org}</div>
      <p>${e.description}</p>
      <ul class="bullets">${e.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
    </article>
  `).join("");

  $("education-list").innerHTML = D.education.map(e => `
    <article class="edu glass reveal">
      <div class="year">${e.year}</div>
      <h3>${e.title}</h3>
      <p><b>${e.org}</b><br>${e.detail}</p>
    </article>
  `).join("");

  $("skills-list").innerHTML = Object.entries(D.skills).map(([group, items]) => `
    <article class="skill-card glass reveal">
      <h3>${group}</h3>
      <div class="skill-list">${items.map(x => `<span class="skill">${x}</span>`).join("")}</div>
    </article>
  `).join("");

  $("core-skills").innerHTML = Object.values(D.skills).flat().map(x => `<span class="pill">${x}</span>`).join("");

  $("certifications").innerHTML = D.certifications.map(x => `
    <article class="info-card glass reveal"><h3>${x[0]}</h3><p>${x[1]}</p></article>
  `).join("");

  $("achievements").innerHTML = D.achievements.map(x => `
    <article class="info-card glass reveal"><h3>${x[0]}</h3><p>${x[1]}</p></article>
  `).join("");

  $("languages").innerHTML = D.languages.map(x => `<span class="pill">${x[0]} — ${x[1]}</span>`).join("");

  $("ref-name").textContent = D.reference.name;
  $("ref-title").textContent = D.reference.title;
  $("ref-phone").textContent = D.reference.phone;
  $("ref-email").textContent = D.reference.email;

  // Mobile nav
  const nav = document.querySelector(".nav");
  $("menu").addEventListener("click", () => nav.classList.toggle("open"));
  document.querySelectorAll(".navlinks a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Subtle cursor glow on desktop
  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  // Current year
  $("year").textContent = new Date().getFullYear();
});
