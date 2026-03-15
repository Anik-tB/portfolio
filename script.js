/* ═══════════════════════════════════════════════
   FAANG-GRADE PORTFOLIO — Interactions
   ═══════════════════════════════════════════════ */

const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navAnchors = Array.from(document.querySelectorAll(".nav-links a"));
const internalAnchors = Array.from(document.querySelectorAll('a[href^="#"]')).filter((anchor) => {
  const href = anchor.getAttribute("href");
  return href && href.length > 1;
});
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const observedSections = Array.from(document.querySelectorAll("main section[id]"));
const sectionIds = new Set(observedSections.map((section) => section.id));
const supportsIntersectionObserver = "IntersectionObserver" in window;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeSectionId = "";

/* ── Navbar scroll state ── */

const setNavbarState = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 12);
};

/* ── Mobile menu ── */

const setMenuState = (isOpen) => {
  if (!hamburger || !navLinks) return;
  hamburger.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  navLinks.classList.toggle("active", isOpen);
};

const closeMenu = () => setMenuState(false);

/* ── Active nav link tracking ── */

const setActiveLink = (targetId) => {
  if (!targetId || !sectionIds.has(targetId)) return;
  activeSectionId = targetId;

  navAnchors.forEach((anchor) => {
    const isActive = anchor.getAttribute("href") === `#${targetId}`;
    anchor.classList.toggle("active", isActive);
    if (isActive) {
      anchor.setAttribute("aria-current", "page");
    } else {
      anchor.removeAttribute("aria-current");
    }
  });
};

const getHashSectionId = () => {
  const hash = window.location.hash.replace(/^#/, "");
  return sectionIds.has(hash) ? hash : "";
};

const getCurrentSectionId = () => {
  if (!observedSections.length) return "";
  const navbarOffset = navbar?.offsetHeight ?? 0;
  const probeLine = window.scrollY + navbarOffset + 160;
  let currentId = observedSections[0].id;
  observedSections.forEach((section) => {
    if (section.offsetTop <= probeLine) currentId = section.id;
  });
  return currentId;
};

const syncActiveSection = () => {
  const currentId = getCurrentSectionId();
  if (currentId && currentId !== activeSectionId) setActiveLink(currentId);
};

const initializeActiveSection = () => {
  const hashSectionId = getHashSectionId();
  setActiveLink(hashSectionId || getCurrentSectionId());
};

const showAllRevealItems = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

/* ── Hamburger events ── */

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = !navLinks.classList.contains("active");
    setMenuState(isOpen);
  });

  document.addEventListener("click", (event) => {
    if (!navbar || !navLinks.classList.contains("active")) return;
    if (!(event.target instanceof Node) || navbar.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) closeMenu();
  });
}

/* ── Internal anchor clicks ── */

internalAnchors.forEach((anchor) => {
  anchor.addEventListener("click", () => {
    const targetId = anchor.getAttribute("href")?.slice(1);
    if (targetId && sectionIds.has(targetId)) setActiveLink(targetId);
    if (anchor.closest(".navbar")) closeMenu();
  });
});

/* ── Reveal system with stagger ── */

if (supportsIntersectionObserver && revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  showAllRevealItems();
}

/* ── Section observer ── */

if (supportsIntersectionObserver && observedSections.length) {
  const visibleSections = new Map();
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, {
            ratio: entry.intersectionRatio,
            top: Math.abs(entry.boundingClientRect.top),
          });
          return;
        }
        visibleSections.delete(entry.target.id);
      });

      const [mostVisibleSection] = [...visibleSections.entries()].sort((entryA, entryB) => {
        return entryB[1].ratio - entryA[1].ratio || entryA[1].top - entryB[1].top;
      });

      if (mostVisibleSection) {
        setActiveLink(mostVisibleSection[0]);
        return;
      }

      syncActiveSection();
    },
    {
      threshold: [0.05, 0.15, 0.3, 0.5],
      rootMargin: "-10% 0px -35% 0px",
    }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

/* ── Cursor Glow Effect ── */

const cursorGlow = document.getElementById("cursor-glow");

if (cursorGlow && !prefersReducedMotion && window.innerWidth > 920) {
  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!cursorGlow.classList.contains("active")) {
      cursorGlow.classList.add("active");
    }

    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      cursorGlow.style.left = mouseX + "px";
      cursorGlow.style.top = mouseY + "px";
      rafId = null;
    });
  });

  document.addEventListener("mouseleave", () => {
    cursorGlow.classList.remove("active");
  });
}

/* ── Counter Animation for Proof Items ── */

const animateCounter = (element, target, duration = 1200) => {
  const isFloat = String(target).includes(".");
  const start = 0;
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;

    if (isFloat) {
      element.textContent = current.toFixed(2);
    } else {
      element.textContent = Math.round(current);
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Restore original text for items with suffix like "3+"
      const original = element.getAttribute("data-original");
      if (original) element.textContent = original;
    }
  };

  requestAnimationFrame(step);
};

if (!prefersReducedMotion) {
  const counterElements = document.querySelectorAll("[data-count]");

  if (supportsIntersectionObserver && counterElements.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const countValue = parseFloat(el.getAttribute("data-count"));
          const originalText = el.textContent;
          el.setAttribute("data-original", originalText);

          animateCounter(el, countValue);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach((el) => counterObserver.observe(el));
  }
}

/* ── Scroll & initialization ── */

window.addEventListener(
  "scroll",
  () => {
    setNavbarState();
    syncActiveSection();
  },
  { passive: true }
);

window.addEventListener("hashchange", initializeActiveSection);
window.addEventListener("load", () => {
  setNavbarState();
  initializeActiveSection();
});

setNavbarState();
initializeActiveSection();
