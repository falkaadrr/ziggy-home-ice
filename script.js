/* ============================================================
   ZIGGY HOME ICE — script.js
   Modern Cafe Dessert Website - Vanilla JavaScript
   ============================================================ */

"use strict";

/* ============================================================
   1. DOM READY
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHamburger();
  initSmoothScroll();
  initScrollAnimations();
  initMenuFilter();
  initBackToTop();
  initGalleryLightbox();
  initActiveNavLink();
  initParallaxBlobs();
  initMenuCardOrder();
});

/* ============================================================
   2. NAVBAR — transparent → solid on scroll
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // run on load
}

/* ============================================================
   3. HAMBURGER + MOBILE OVERLAY
   ============================================================ */
function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("mobileOverlay");
  const closeBtn = document.getElementById("mobileCloseBtn");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!hamburger || !overlay) return;

  function openMenu() {
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-label", "Tutup menu");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-label", "Buka menu");
    document.body.style.overflow = "";
  }

  // Toggle hamburger
  hamburger.addEventListener("click", () => {
    overlay.classList.contains("open") ? closeMenu() : openMenu();
  });

  // Close via ✕ button
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  // Close on mobile nav link click (smooth scroll still fires via initSmoothScroll)
  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeMenu();
  });
}

/* ============================================================
   4. SMOOTH SCROLL for anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navbarH = document.getElementById("navbar")?.offsetHeight || 70;
      const offsetTop =
        target.getBoundingClientRect().top + window.scrollY - navbarH;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });
}

/* ============================================================
   5. FADE-IN ANIMATIONS on scroll (Intersection Observer)
   ============================================================ */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    ".fade-in, .fade-in-left, .fade-in-right",
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger cards in a grid
          const delay = getStaggerDelay(entry.target);
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  elements.forEach((el) => observer.observe(el));
}

function getStaggerDelay(el) {
  // Stagger menu cards and review cards in grid
  const parent = el.parentElement;
  if (!parent) return 0;

  const siblings = Array.from(parent.children).filter(
    (c) =>
      c.classList.contains("menu-card") ||
      c.classList.contains("review-card") ||
      c.classList.contains("gallery-item"),
  );

  const index = siblings.indexOf(el);
  if (index === -1) return 0;

  return index * 80; // 80ms stagger per item
}

/* ============================================================
   6. MENU FILTER
   ============================================================ */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".menu-card");

  if (!filterBtns.length || !menuCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      menuCards.forEach((card) => {
        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
          // Re-trigger animation
          card.classList.remove("visible");
          void card.offsetWidth; // reflow
          setTimeout(() => card.classList.add("visible"), 50);
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

/* ============================================================
   7. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const handleScroll = () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", handleScroll, { passive: true });
}

/* ============================================================
   8. GALLERY LIGHTBOX
   ============================================================ */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  const content = document.getElementById("lightboxContent");

  if (!galleryItems.length || !lightbox) return;

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector(".gallery-img-placeholder");
      const text = img ? img.querySelector("p")?.textContent : "Gallery";
      const icon = img ? img.querySelector("span")?.textContent : "📸";

      if (content) {
        content.innerHTML = `
          <div style="
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            padding: 60px 40px;
            border: 1px solid rgba(255,255,255,0.15);
          ">
            <div style="font-size: 5rem; margin-bottom: 16px;">${icon}</div>
            <div style="color: white; font-size: 1.2rem; font-weight: 600; font-family: 'Sora', sans-serif;">
              ${text}
            </div>
            <div style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-top: 8px;">
              ZIGGY HOME ICE
            </div>
          </div>
        `;
      }

      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

/* ============================================================
   9. ACTIVE NAV LINK on scroll (Scroll Spy)
   ============================================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          // Desktop links
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`)
              link.classList.add("active");
          });
          // Mobile links
          mobileLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`)
              link.classList.add("active");
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: "-70px 0px -30% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   10. PARALLAX BLOBS (subtle mouse movement)
   ============================================================ */
function initParallaxBlobs() {
  const blobs = document.querySelectorAll(".hero-blob");
  if (!blobs.length) return;

  let ticking = false;

  document.addEventListener("mousemove", (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      blobs.forEach((blob, i) => {
        const strength = (i + 1) * 8;
        blob.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });

      ticking = false;
    });
  });
}

/* ============================================================
   11. MENU CARD — ensure visible on first load
   ============================================================ */
function initMenuCardOrder() {
  // Cards are initially hidden via fade-in class
  // The intersection observer handles them
  // But trigger once for items already in viewport
  const cards = document.querySelectorAll(".menu-card");
  cards.forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setTimeout(
        () => {
          card.classList.add("visible");
        },
        100 + i * 80,
      );
    }
  });
}

/* ============================================================
   12. MENU BUTTON — WhatsApp order redirect
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".menu-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".menu-card");
      const name = card?.querySelector(".menu-name")?.textContent || "Menu";
      const price = card?.querySelector(".menu-price")?.textContent || "";

      const msg = encodeURIComponent(
        `Halo Ziggy Home Ice! Saya mau pesan:\n\n🍦 ${name} - ${price}\n\nMohon info ketersediaannya ya, terima kasih!`,
      );

      window.open(`https://wa.me/6285211597588?text=${msg}`, "_blank");
    });
  });
});

/* ============================================================
   13. RATING BAR ANIMATION
   ============================================================ */
function animateRatingBars() {
  const bars = document.querySelectorAll(".bar-fill");
  bars.forEach((bar) => {
    const target = bar.style.width;
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = target;
    }, 200);
  });
}

// Trigger when review section enters viewport
const reviewSection = document.querySelector(".review-section");
if (reviewSection) {
  const ratingObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateRatingBars();
        ratingObserver.disconnect();
      }
    },
    { threshold: 0.2 },
  );
  ratingObserver.observe(reviewSection);
}

/* ============================================================
   14. FLOATING CARDS TILT (hero section)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const floatCards = document.querySelectorAll(".hero-card-float");
  floatCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-4px) scale(1.04)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
});

/* ============================================================
   15. HIGHLIGHT ITEMS — bounce animation on hover
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".highlight-item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const icon = item.querySelector(".highlight-icon");
      if (!icon) return;
      icon.style.transform = "scale(1.3) rotate(-5deg)";
      icon.style.transition = "transform 0.2s ease";
    });
    item.addEventListener("mouseleave", () => {
      const icon = item.querySelector(".highlight-icon");
      if (!icon) return;
      icon.style.transform = "";
    });
  });
});

/* ============================================================
   16. REVIEW CARD — star shimmer on hover
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".review-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const stars = card.querySelector(".review-stars");
      if (!stars) return;
      stars.style.animation = "none";
      stars.style.filter = "drop-shadow(0 0 6px rgba(244,162,97,0.8))";
      stars.style.transition = "filter 0.3s ease";
    });
    card.addEventListener("mouseleave", () => {
      const stars = card.querySelector(".review-stars");
      if (!stars) return;
      stars.style.filter = "";
    });
  });
});

/* ============================================================
   17. CONSOLE BRANDING
   ============================================================ */
console.log(
  "%c🍦 ZIGGY HOME ICE\n%cSweet Moments Start Here — Website by Custom Dev",
  "font-size: 18px; font-weight: bold; color: #F4A261;",
  "font-size: 12px; color: #9C8070;",
);
