
/* ========================================
   FAADIL ILBOUDO — PORTFOLIO
   Interactive features
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Éléments principaux
  const body = document.body;
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");
  const scrollProgress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const typedText = document.getElementById("typedText");

  // ========================================
  // RÉSEAU DE PARTICULES CONNECTÉES — arrière-plan
  // ========================================
  const particleCanvas = document.getElementById("particle-network");

  if (particleCanvas) {
    const particleContext = particleCanvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let particleAnimationId = null;
    const pointer = { x: null, y: null };
    const linkDistance = 155;

    function resizeParticleCanvas() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;

      particleCanvas.width = Math.round(canvasWidth * pixelRatio);
      particleCanvas.height = Math.round(canvasHeight * pixelRatio);
      particleCanvas.style.width = `${canvasWidth}px`;
      particleCanvas.style.height = `${canvasHeight}px`;
      particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particleCount = Math.min(
        115,
        Math.max(42, Math.round((canvasWidth * canvasHeight) / 12500))
      );

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.48,
        vy: (Math.random() - 0.5) * 0.48,
        radius: Math.random() * 1.25 + 1.05
      }));
    }

    function renderParticleNetwork() {
      particleContext.clearRect(0, 0, canvasWidth, canvasHeight);

      const isLightTheme = body.classList.contains("light-theme");
      const particleRGB = isLightTheme ? "139, 21, 56" : "226, 126, 155";
      const baseLineOpacity = isLightTheme ? 0.27 : 0.39;

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        if (!prefersReducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > canvasWidth) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvasHeight) particle.vy *= -1;
        }

        // Relier les particules suffisamment proches.
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.hypot(dx, dy);

          if (distance < linkDistance) {
            const opacity = (1 - distance / linkDistance) * baseLineOpacity;
            particleContext.beginPath();
            particleContext.moveTo(particle.x, particle.y);
            particleContext.lineTo(other.x, other.y);
            particleContext.strokeStyle = `rgba(${particleRGB}, ${opacity})`;
            particleContext.lineWidth = 0.85;
            particleContext.stroke();
          }
        }

        // Créer une connexion légère entre le curseur et les particules proches.
        if (pointer.x !== null && pointer.y !== null) {
          const pointerDistance = Math.hypot(
            particle.x - pointer.x,
            particle.y - pointer.y
          );

          if (pointerDistance < 185) {
            particleContext.beginPath();
            particleContext.moveTo(particle.x, particle.y);
            particleContext.lineTo(pointer.x, pointer.y);
            particleContext.strokeStyle = `rgba(${particleRGB}, ${
              (1 - pointerDistance / 185) * 0.55
            })`;
            particleContext.lineWidth = 1;
            particleContext.stroke();
          }
        }

        // Points lumineux bordeaux/rose.
        particleContext.beginPath();
        particleContext.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );
        particleContext.fillStyle = `rgba(${particleRGB}, ${
          isLightTheme ? 0.78 : 0.96
        })`;
        particleContext.shadowColor = `rgba(${particleRGB}, 0.8)`;
        particleContext.shadowBlur = 7;
        particleContext.fill();
        particleContext.shadowBlur = 0;
      }

      if (!prefersReducedMotion && !document.hidden) {
        particleAnimationId = window.requestAnimationFrame(renderParticleNetwork);
      } else {
        particleAnimationId = null;
      }
    }

    // Le canvas ignore les clics : on écoute donc le mouvement sur la fenêtre.
    window.addEventListener("mousemove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }, { passive: true });

    window.addEventListener("mouseout", (event) => {
      if (!event.relatedTarget) {
        pointer.x = null;
        pointer.y = null;
      }
    });

    window.addEventListener("resize", () => {
      resizeParticleCanvas();
      if (prefersReducedMotion) renderParticleNetwork();
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && particleAnimationId !== null) {
        window.cancelAnimationFrame(particleAnimationId);
        particleAnimationId = null;
      } else if (!document.hidden && !prefersReducedMotion && particleAnimationId === null) {
        renderParticleNetwork();
      }
    });

    resizeParticleCanvas();
    renderParticleNetwork();
  }

  // Année automatique
  document.getElementById("currentYear").textContent =
    new Date().getFullYear();

  // ========================================
  // MENU MOBILE
  // ========================================

  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );

    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // ========================================
  // MODE SOMBRE / MODE CLAIR
  // ========================================

  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light") {
    body.classList.add("light-theme");
  }

  function updateThemeIcon() {
    const isLight = body.classList.contains("light-theme");

    themeToggle.innerHTML = isLight
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';

    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Activer le mode sombre" : "Activer le mode clair"
    );
  }

  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");

    const theme = body.classList.contains("light-theme")
      ? "light"
      : "dark";

    localStorage.setItem("portfolio-theme", theme);
    updateThemeIcon();
  });

  // ========================================
  // TEXTE ANIMÉ
  // ========================================

  if (typedText) {
    const phrases = [
      "développement informatique.",
      "création de projets web.",
      "résolution de problèmes.",
      "apprentissage continu."
    ];

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      typedText.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let characterIndex = phrases[0].length;
      let deleting = false;

      function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (deleting) {
          characterIndex--;
        } else {
          characterIndex++;
        }

        typedText.textContent = currentPhrase.substring(
          0,
          characterIndex
        );

        let delay = deleting ? 35 : 65;

        if (!deleting && characterIndex === currentPhrase.length) {
          deleting = true;
          delay = 1500;
        } else if (deleting && characterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 350;
        }

        window.setTimeout(typeEffect, delay);
      }

      window.setTimeout(() => {
        phraseIndex = 1;
        characterIndex = 0;
        deleting = false;
        typeEffect();
      }, 1800);
    }
  }

  // ========================================
  // ANIMATIONS AU DÉFILEMENT
  // ========================================

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 3) * 80}ms`;
    revealObserver.observe(element);
  });

  // ========================================
  // FILTRES DES PROJETS
  // ========================================

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      projectCards.forEach((card) => {
        const matches =
          selectedFilter === "all" ||
          card.dataset.category === selectedFilter;

        card.classList.toggle("hidden", !matches);
      });
    });
  });

  // ========================================
  // BARRE DE PROGRESSION ET RETOUR EN HAUT
  // ========================================

  let ticking = false;

  function updateScrollUI() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    scrollProgress.style.width = `${progress}%`;

    backToTop.classList.toggle("visible", window.scrollY > 450);

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollUI);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateScrollUI();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // ========================================
  // LIEN DE NAVIGATION ACTIF
  // ========================================

  const sections = document.querySelectorAll("main section[id]");
  const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navigationLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // ========================================
  // ADAPTATION AU REDIMENSIONNEMENT
  // ========================================

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      closeMenu();
    }
  });
});
