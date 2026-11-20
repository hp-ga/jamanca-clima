(function () {
  // mobile nav
  const burger = document.getElementById("burgerBtn");
  const nav = document.getElementById("mainNav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("is-open"))
  );

  // reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // work gallery carousel
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  if (galleryTrack && galleryPrev && galleryNext) {
    const scrollByCard = (dir) => {
      const card = galleryTrack.querySelector(".gallery-item");
      const step = card ? card.getBoundingClientRect().width + 16 : 300;
      galleryTrack.scrollBy({ left: dir * step, behavior: "smooth" });
    };
    galleryPrev.addEventListener("click", () => scrollByCard(-1));
    galleryNext.addEventListener("click", () => scrollByCard(1));

    // auto-scroll, paused on hover/touch and for reduced-motion users
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      let autoTimer = setInterval(advance, 3500);
      function advance() {
        const atEnd = galleryTrack.scrollLeft + galleryTrack.clientWidth >= galleryTrack.scrollWidth - 4;
        if (atEnd) galleryTrack.scrollTo({ left: 0, behavior: "smooth" });
        else scrollByCard(1);
      }
      const pause = () => clearInterval(autoTimer);
      const resume = () => { clearInterval(autoTimer); autoTimer = setInterval(advance, 3500); };
      galleryTrack.addEventListener("mouseenter", pause);
      galleryTrack.addEventListener("mouseleave", resume);
      galleryTrack.addEventListener("touchstart", pause, { passive: true });
      galleryTrack.addEventListener("touchend", resume);
    }
  }

  // work gallery lightbox
  const galleryButtons = Array.from(document.querySelectorAll(".gallery-item button"));
  const lightbox = document.getElementById("lightbox");
  if (galleryButtons.length && lightbox) {
    const lbImg = document.getElementById("lightboxImg");
    const lbCaption = document.getElementById("lightboxCaption");
    let current = 0;

    function openAt(i) {
      current = (i + galleryButtons.length) % galleryButtons.length;
      const btn = galleryButtons[current];
      const img = btn.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = btn.querySelector(".gallery-caption").textContent;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
    }
    galleryButtons.forEach((btn, i) => btn.addEventListener("click", () => openAt(i)));
    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("lightboxPrev").addEventListener("click", () => openAt(current - 1));
    document.getElementById("lightboxNext").addEventListener("click", () => openAt(current + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openAt(current - 1);
      if (e.key === "ArrowRight") openAt(current + 1);
    });
  }
})();
