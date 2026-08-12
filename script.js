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

  const hero = document.querySelector(".hero");
  const heroMedia = document.querySelector("[data-parallax-media]");
  const desktopMotion = window.matchMedia("(min-width: 1081px)").matches;
  if (!reduceMotion && desktopMotion && hero && heroMedia) {
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const updateParallax = () => {
      frame = 0;
      heroMedia.style.setProperty("--parallax-x", `${pointerX}px`);
      heroMedia.style.setProperty("--parallax-y", `${pointerY}px`);
    };
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * -10;
      pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * -7;
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    });
    hero.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    });
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
