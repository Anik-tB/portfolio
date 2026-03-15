/* ═══════════════════════════════════════════════
   PROFESSIONAL RESUME — Interactions
   ═══════════════════════════════════════════════ */

// ── Print / Download ──
const printButton = document.querySelector("#print-cv");
const params = new URLSearchParams(window.location.search);

const triggerPrint = () => {
  window.print();
};

if (printButton) {
  printButton.addEventListener("click", triggerPrint);
}

if (params.get("download") === "1") {
  window.addEventListener("load", () => {
    window.setTimeout(triggerPrint, 600);
  });
}

// ── Scroll Reveal (IntersectionObserver) ──
const revealSections = document.querySelectorAll(".cv-reveal");

if (revealSections.length && "IntersectionObserver" in window) {
  // Initially hide all sections until observed
  revealSections.forEach((el) => {
    el.style.animationPlayState = "paused";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealSections.forEach((el) => observer.observe(el));
}
