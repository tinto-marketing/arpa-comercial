(() => {
  const header = document.querySelector("[data-header]");
  const progressBar = document.querySelector(".reading-progress span");
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateScrollState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  };

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector(".menu-button__label").textContent = "Menu";
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
    if (restoreFocus) menuButton.focus();
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.querySelector(".menu-button__label").textContent = isOpen ? "Menu" : "Fechar";
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") closeMenu({ restoreFocus: true });
  });

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState, { passive: true });
  updateScrollState();

  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  const pointerParallax = document.querySelector("[data-parallax-pointer]");
  if (!reduceMotion && parallaxItems.length) {
    let parallaxFrame = 0;
    const renderParallax = () => {
      parallaxFrame = 0;
      const viewportHeight = window.innerHeight;
      parallaxItems.forEach((item) => {
        const bounds = item.getBoundingClientRect();
        if (bounds.bottom < -200 || bounds.top > viewportHeight + 200) return;
        const speed = Number(item.dataset.parallaxSpeed || .1);
        const distanceFromCenter = bounds.top + bounds.height / 2 - viewportHeight / 2;
        const range = (viewportHeight + bounds.height) / 2;
        const progress = Math.max(-1, Math.min(1, distanceFromCenter / range));
        item.style.setProperty("--scroll-parallax", `${progress * viewportHeight * speed * -.48}px`);
      });
    };
    const requestParallax = () => {
      if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(renderParallax);
    };
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
    renderParallax();

    if (pointerParallax && window.matchMedia("(min-width: 1081px)").matches) {
      const hero = pointerParallax.closest(".hero");
      hero?.addEventListener("pointermove", (event) => {
        const bounds = hero.getBoundingClientRect();
        pointerParallax.style.setProperty("--pointer-x", `${((event.clientX - bounds.left) / bounds.width - .5) * -22}px`);
        pointerParallax.style.setProperty("--pointer-y", `${((event.clientY - bounds.top) / bounds.height - .5) * -15}px`);
      });
      hero?.addEventListener("pointerleave", () => {
        pointerParallax.style.setProperty("--pointer-x", "0px");
        pointerParallax.style.setProperty("--pointer-y", "0px");
      });
    }
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const journeyBanner = document.querySelector("[data-journey-banner]");
  if (journeyBanner) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      journeyBanner.classList.add("is-active");
    } else {
      const journeyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-active");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.28, rootMargin: "0px 0px -6%" });
      journeyObserver.observe(journeyBanner);
    }
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

})();
