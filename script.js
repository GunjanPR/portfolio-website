const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const copyEmailButton = document.querySelector("[data-copy-email]");
const year = document.querySelector("#year");
const email = "gunjanrajgureinusa@gmail.com";

function readStoredTheme() {
  try {
    return localStorage.getItem("portfolio-theme");
  } catch {
    return null;
  }
}

const storedTheme = readStoredTheme();
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
root.dataset.theme = storedTheme || preferredTheme;

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function updateThemeControl() {
  if (!themeToggle) return;
  const isDark = root.dataset.theme === "dark";
  themeToggle.innerHTML = `<i data-lucide="${isDark ? "sun" : "moon"}" aria-hidden="true"></i>`;
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  refreshIcons();
}

function closeMenu() {
  if (!header || !menuToggle) return;
  header.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
  refreshIcons();
}

themeToggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("portfolio-theme", root.dataset.theme);
  } catch {
    // Storage can be blocked; the theme still applies for this visit.
  }
  updateThemeControl();
});

menuToggle?.addEventListener("click", () => {
  const willOpen = !header.classList.contains("menu-open");
  header.classList.toggle("menu-open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  menuToggle.innerHTML = `<i data-lucide="${willOpen ? "x" : "menu"}" aria-hidden="true"></i>`;
  refreshIcons();
});

mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => header?.classList.toggle("is-scrolled", window.scrollY > 18), { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (element.closest(".hero")) element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  revealObserver.observe(element);
});

const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const navSections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 },
);
navSections.forEach((section) => navObserver.observe(section));

copyEmailButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.innerHTML = '<i data-lucide="check" aria-hidden="true"></i><span>Email copied</span>';
    refreshIcons();
    window.setTimeout(() => {
      copyEmailButton.innerHTML = '<i data-lucide="copy" aria-hidden="true"></i><span>Copy email</span>';
      refreshIcons();
    }, 2200);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});

if (year) year.textContent = new Date().getFullYear();
updateThemeControl();
refreshIcons();
