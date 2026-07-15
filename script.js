document.body.classList.add("js-enabled");

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
const scrollProgress = document.getElementById("scroll-progress");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const supportsIntersectionObserver = "IntersectionObserver" in window;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeSectionId = "";

const setNavbarState = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 12);
};

const setScrollProgress = () => {
  if (!scrollProgress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
};

const setMenuState = (isOpen) => {
  if (!hamburger || !navLinks) return;
  hamburger.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  navLinks.classList.toggle("active", isOpen);
};

const closeMenu = () => setMenuState(false);

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
  const probeLine = window.scrollY + navbarOffset + 150;
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

const showVisibleRevealItems = () => {
  revealItems.forEach((item) => {
    if (item.classList.contains("is-visible")) return;
    const rect = item.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 40 && rect.bottom > 0;
    if (isVisible) item.classList.add("is-visible");
  });
};

const setupRevealObserver = () => {
  if (!supportsIntersectionObserver || !revealItems.length) {
    showAllRevealItems();
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -42px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

const setupSectionObserver = () => {
  if (!supportsIntersectionObserver || !observedSections.length) return;

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
};

const animateCounter = (element, target, duration = 1200) => {
  const isFloat = String(target).includes(".");
  const originalText = element.textContent;
  const startTime = performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    element.textContent = isFloat ? current.toFixed(2) : Math.round(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = originalText;
    }
  };

  requestAnimationFrame(step);
};

const setupCounters = () => {
  if (prefersReducedMotion) return;

  const counterElements = Array.from(document.querySelectorAll("[data-count]"));
  if (!counterElements.length) return;

  if (!supportsIntersectionObserver) {
    counterElements.forEach((element) => {
      const countValue = parseFloat(element.getAttribute("data-count"));
      if (!Number.isNaN(countValue)) animateCounter(element, countValue);
    });
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const countValue = parseFloat(element.getAttribute("data-count"));
        if (!Number.isNaN(countValue)) animateCounter(element, countValue);
        observer.unobserve(element);
      });
    },
    { threshold: 0.55 }
  );

  counterElements.forEach((element) => counterObserver.observe(element));
};

const setupProjectFilters = () => {
  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");

    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(/\s+/);
        const shouldShow = selectedFilter === "all" || categories.includes(selectedFilter);
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
};

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    setMenuState(!navLinks.classList.contains("active"));
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
    if (window.innerWidth > 1120) closeMenu();
  });
}

internalAnchors.forEach((anchor) => {
  anchor.addEventListener("click", () => {
    const targetId = anchor.getAttribute("href")?.slice(1);
    if (targetId && sectionIds.has(targetId)) setActiveLink(targetId);
    if (anchor.closest(".navbar")) closeMenu();
  });
});

window.addEventListener(
  "scroll",
  () => {
    setNavbarState();
    setScrollProgress();
    syncActiveSection();
  },
  { passive: true }
);

window.addEventListener("hashchange", initializeActiveSection);
window.addEventListener("hashchange", () => {
  window.setTimeout(showVisibleRevealItems, 80);
});

const setupCardSpotlight = () => {
  if (prefersReducedMotion) return;
  const cards = Array.from(document.querySelectorAll(
    ".portrait-panel, .about-panel, .operating-item, .education-card, .capability-card, .achievement-card, .project-card, .contact-card"
  ));
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
};

window.addEventListener("load", () => {
  setNavbarState();
  setScrollProgress();
  initializeActiveSection();
  showVisibleRevealItems();
});

setupRevealObserver();
setupSectionObserver();
setupCounters();
setupProjectFilters();
setupCardSpotlight();
setNavbarState();
setScrollProgress();
initializeActiveSection();
requestAnimationFrame(showVisibleRevealItems);
