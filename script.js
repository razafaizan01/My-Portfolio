const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function setMenuOpen(isOpen) {
  mainNav?.classList.toggle("open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  const menuLabel = menuToggle?.querySelector(".menu-label");
  if (menuLabel) menuLabel.textContent = isOpen ? "Close" : "Menu";
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(!mainNav?.classList.contains("open"));
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mainNav?.classList.contains("open")) {
    setMenuOpen(false);
    menuToggle?.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenuOpen(false);
});

window.matchMedia("(max-width: 1099px)").addEventListener("change", () => setMenuOpen(false));

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();

  // Contact form opens a prefilled email addressed to Faizan.
  const recipient = "therazafaizan01@gmail.com";
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  document.getElementById("formNote").textContent =
    "Your email app should open with the message ready. No form data is stored on this website.";
});

// Mark the section currently beneath the floating navigation.
const sectionLinks = [...mainNav.querySelectorAll('a[href^="#"]')];
const navigationSections = sectionLinks.map((link) => document.querySelector(link.hash));
let navigationFramePending = false;
function updateCurrentSection() {
  const threshold = document.querySelector(".site-header").getBoundingClientRect().bottom + 60;
  let currentId = "home";
  navigationSections.forEach((section) => {
    if (section && section.getBoundingClientRect().top <= threshold) currentId = section.id;
  });
  sectionLinks.forEach((link) => {
    if (link.hash === `#${currentId}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  navigationFramePending = false;
}
window.addEventListener("scroll", () => {
  if (!navigationFramePending) {
    navigationFramePending = true;
    requestAnimationFrame(updateCurrentSection);
  }
}, { passive: true });
window.addEventListener("resize", updateCurrentSection);
updateCurrentSection();

// Keep project categories easy to browse without inventing project links.
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    let count = 0;
    projectCards.forEach((card) => {
      card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count++;
    });
    document.getElementById("projectFilterStatus").textContent = `${count} ${count === 1 ? "entry" : "entries"} shown`;
  });
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.replace("reveal-pending", "reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".section-heading, .skill-card, .project-card, .timeline, .coursework article").forEach((element) => {
    element.classList.add("reveal-pending");
    revealObserver.observe(element);
  });
}
