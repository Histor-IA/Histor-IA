document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainMenu = document.querySelector(".main-menu");
  const submenuParents = document.querySelectorAll(".has-submenu");

  /* ===== Menú móvil ===== */
  if (menuToggle && mainMenu) {
    menuToggle.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!expanded));
      mainMenu.classList.toggle("is-open");

      if (!expanded) {
        mainMenu.scrollTop = 0;
      }
    });
  }

  /* ===== Submenús en móvil ===== */
  submenuParents.forEach(function (item) {
    const trigger = item.querySelector(":scope > a");
    if (!trigger) return;

    trigger.addEventListener("click", function (e) {
      if (window.innerWidth <= 920) {
        const directSubmenu = item.querySelector(":scope > .submenu");
        if (!directSubmenu) return;

        e.preventDefault();

        const parentList = item.parentElement;
        const siblingItems = parentList.querySelectorAll(":scope > .has-submenu");
        const wasOpen = item.classList.contains("is-open");

        siblingItems.forEach(function (sibling) {
          if (sibling !== item) {
            sibling.classList.remove("is-open");
          }
        });

        if (wasOpen) {
          item.classList.remove("is-open");
        } else {
          item.classList.add("is-open");
        }
      }
    });
  });

  /* ===== Sliders ===== */
  const sliders = document.querySelectorAll(".duo-slider");

  sliders.forEach(function (slider) {
    const track = slider.querySelector(".duo-slider-track");
    const prevBtn = slider.querySelector(".duo-prev");
    const nextBtn = slider.querySelector(".duo-next");
    const slides = slider.querySelectorAll(".duo-slide");

    if (!track || !slides.length) return;

    let currentIndex = 0;
    const total = slides.length;

    function itemsPerView() {
      return window.innerWidth <= 720 ? 1 : 2;
    }

    function maxIndex() {
      return Math.max(0, total - itemsPerView());
    }

    function updateSlider() {
      const perView = itemsPerView();
      const slideWidth = 100 / perView;

      slides.forEach(function (slide) {
        slide.style.flex = "0 0 " + slideWidth + "%";
        slide.style.maxWidth = slideWidth + "%";
      });

      if (currentIndex > maxIndex()) {
        currentIndex = maxIndex();
      }

      track.style.transform = "translateX(-" + (currentIndex * slideWidth) + "%)";

      if (prevBtn) prevBtn.disabled = currentIndex <= 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex();
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        const step = itemsPerView();
        currentIndex = Math.max(0, currentIndex - step);
        updateSlider();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        const step = itemsPerView();
        currentIndex = Math.min(maxIndex(), currentIndex + step);
        updateSlider();
      });
    }

    window.addEventListener("resize", updateSlider);
    updateSlider();
  });

  /* ===== Reveal general + scroll items ===== */
  const animatedItems = document.querySelectorAll(".reveal-section, .scroll-item");

  if ("IntersectionObserver" in window && animatedItems.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });

    animatedItems.forEach(function (item, index) {
      if (item.classList.contains("scroll-item")) {
        item.style.transitionDelay = (index % 3) * 0.10 + "s";
      }

      if (!item.classList.contains("reveal-hero")) {
        observer.observe(item);
      }
    });
  } else {
    animatedItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
});
