/* ============================================================================
   main.js — site logic. You should NOT need to edit this file.
   All editable text/links live in content.js
   ========================================================================== */

(function () {
  "use strict";

  const C = window.SITE_CONTENT;
  if (!C) {
    console.error(
      "SITE_CONTENT is missing. Make sure js/content.js is loaded BEFORE js/main.js in this page's <script> tags, and that content.js has no syntax errors."
    );
    return;
  }

  /* ---------------------------- THEME ---------------------------- */
  function initTheme() {
    const saved = localStorage.getItem("gb_theme");
    const theme = saved || (C.general && C.general.defaultTheme) || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }
  initTheme();

  function bindThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("gb_theme", next);
    });
  }

  /* ---------------------------- ICONS ---------------------------- */
  const ICONS = {
    discord: '<svg viewBox="0 0 24 24"><path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.211.375-.444.879-.608 1.278a18.27 18.27 0 0 0-5.552 0A12.64 12.64 0 0 0 9.115 3a19.736 19.736 0 0 0-4.435 1.371C1.585 8.674.892 12.86 1.239 16.985a19.9 19.9 0 0 0 5.993 2.98c.484-.657.916-1.354 1.288-2.086a12.9 12.9 0 0 1-2.03-.968c.17-.123.336-.252.497-.384a14.24 14.24 0 0 0 12.026 0c.163.132.328.261.497.384-.646.383-1.325.71-2.033.97.373.732.804 1.428 1.288 2.084a19.86 19.86 0 0 0 6-2.98c.416-4.775-.677-8.923-2.448-12.616ZM8.02 14.578c-.892 0-1.62-.822-1.62-1.834 0-1.011.712-1.834 1.62-1.834.916 0 1.644.83 1.62 1.834 0 1.012-.712 1.834-1.62 1.834Zm7.96 0c-.892 0-1.62-.822-1.62-1.834 0-1.011.712-1.834 1.62-1.834.916 0 1.644.83 1.62 1.834 0 1.012-.703 1.834-1.62 1.834Z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24"><path d="M22.46 5.94c-.77.35-1.6.58-2.46.68a4.3 4.3 0 0 0 1.88-2.37 8.6 8.6 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.16 4.7a4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.2c-.65.18-1.34.2-2 .08a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 18.57a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.55a8.7 8.7 0 0 0 2.14-2.22.6.6 0 0 1-.43.42Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.6.24 1.03.52 1.48.97.45.45.73.88.97 1.48.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43-.24.6-.52 1.03-.97 1.48-.45.45-.88.73-1.48.97-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4 4 0 0 1-1.48-.97 4 4 0 0 1-.97-1.48c-.16-.46-.35-1.26-.4-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.24-.6.52-1.03.97-1.48.45-.45.88-.73 1.48-.97.46-.16 1.26-.35 2.43-.4C8.42 2.17 8.8 2.16 12 2.16Zm0 3.6a6.24 6.24 0 1 0 0 12.48 6.24 6.24 0 0 0 0-12.48Zm0 10.3a4.06 4.06 0 1 1 0-8.12 4.06 4.06 0 0 1 0 8.12Zm7.94-10.55a1.46 1.46 0 1 1-2.92 0 1.46 1.46 0 0 1 2.92 0Z"/></svg>',
    twitch: '<svg viewBox="0 0 24 24"><path d="M4.5 2 2 6.5v14h6V23l3.5-2.5H16L21.5 15V2Zm15 12-3 3h-4l-2.5 2.5V17H6V4h13.5Z"/></svg>',
    kick: '<svg viewBox="0 0 24 24"><path d="M2 2h6v6h3V5h3V2h8v6h-3v3h-3v3h3v3h3v6h-8v-3h-3v-3h-3v6H2Z"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M3.9 12a5 5 0 0 1 5-5h3v2h-3a3 3 0 1 0 0 6h3v2h-3a5 5 0 0 1-5-5Zm7-1h6v2h-6Zm3-4h3a5 5 0 1 1 0 10h-3v-2h3a3 3 0 1 0 0-6h-3Z"/></svg>',
  };

  /* ---------------------------- NAV / FOOTER RENDER ---------------------------- */
  function renderChrome() {
    const nav = document.getElementById("siteNav");
    if (nav) {
      const g = C.general;
      const pages = [
        { href: "index.html", label: "Home" },
        { href: "staffing.html", label: "Staffing" },
        { href: "ssing.html", label: "SSing" },
        { href: "thumbnails.html", label: "Thumbnails" },
        { href: "reviews.html", label: "Reviews" },
      ];
      const current = (document.body.dataset.page || "index.html");

      const linksHtml = pages
        .map(
          (p) =>
            `<a href="${p.href}" class="${p.href === current ? "active" : ""}">${p.label}</a>`
        )
        .join("");

      const socialHtml = (C.socialLinks || [])
        .map(
          (s) =>
            `<a href="${s.url}" target="_blank" rel="noopener" title="${s.label}">${ICONS[s.icon] || ICONS.link}</a>`
        )
        .join("");

      nav.innerHTML = `
        <div class="container">
          <div class="brand">
            <button class="brand-dot" id="editorDotBtn" title="Site editor" aria-label="Open site editor" type="button"></button>
            <a href="index.html" class="brand-name">${g.siteName}</a>
          </div>
          <nav class="nav-links" id="navLinks">${linksHtml}</nav>
          <div class="nav-right">
            <div class="social-icons">${socialHtml}</div>
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
              <svg class="moon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
              <svg class="sun" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-6.66 1.41-1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M4.93 4.93 6.34 6.34M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>
            </button>
            <button class="burger" id="burgerBtn" aria-label="Menu">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>`;

      bindThemeToggle();

      const burger = document.getElementById("burgerBtn");
      const navLinks = document.getElementById("navLinks");
      if (burger && navLinks) {
        burger.addEventListener("click", () => navLinks.classList.toggle("open"));
      }
    }

    const foot = document.getElementById("siteFooter");
    if (foot) {
      const socialHtml = (C.socialLinks || [])
        .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`)
        .join(" &nbsp;·&nbsp; ");
      foot.innerHTML = `
        <div class="container">
          <div class="foot-text">${C.general.footerText}</div>
          <div class="foot-text">${socialHtml}</div>
        </div>`;
    }
  }

  /* ---------------------------- SCROLL REVEAL ---------------------------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------- ACCENT COLOR (site-wide gradient) ---------------------------- */
  function setAccent(color1, color2) {
    if (!color1 || !color2) return;
    document.documentElement.style.setProperty("--accent", color1);
    document.documentElement.style.setProperty("--accent-2", color2);
  }

  function initPageAccent() {
    // On subpages (and before any carousel interaction on the homepage),
    // apply that page's own accent colors so the gradient matches it.
    const page = document.body.dataset.page;
    const section = C[
      { "staffing.html": "staffing", "ssing.html": "ssing", "thumbnails.html": "thumbnails", "reviews.html": "reviews" }[page]
    ];
    if (section && section.color1) {
      setAccent(section.color1, section.color2);
    } else if (page === "index.html") {
      const first = C.home && C.home.highlights && C.home.highlights[0];
      if (first) setAccent(first.color1, first.color2);
    }
  }

  /* ---------------------------- HERO CAROUSEL (skin + arrows + subpage text) ---------------------------- */
  const BASE_ANGLE = Math.PI / 6.5; // ~28° so the model isn't perfectly front-on

  function updateHeroBtn(slide, instant) {
    const btn = document.getElementById("heroBtn");
    if (!btn || !slide) return;
    const label = "View " + (slide.title || "").trim();
    const link = slide.link || "#";

    function apply() {
      btn.textContent = label;
      btn.setAttribute("href", link);
      btn.style.opacity = "1";
    }

    if (instant) {
      apply();
    } else {
      btn.style.transition = "opacity .16s ease";
      btn.style.opacity = "0";
      setTimeout(apply, 160);
    }
  }

  function initHeroCarousel() {
    const canvas = document.getElementById("skin_canvas");
    const wrap = document.getElementById("skin_container");
    const heroSection = document.getElementById("heroSection");
    if (!canvas || !wrap || !heroSection) return; // not on the homepage

    const slides = (C.home && C.home.highlights) || [];

    let viewer = null;
    if (typeof skinview3d !== "undefined") {
      try {
        viewer = new skinview3d.SkinViewer({
          canvas: canvas,
          width: wrap.clientWidth,
          height: wrap.clientHeight,
          skin: (slides[0] && slides[0].skin) || C.general.skinImage,
        });
        viewer.zoom = 0.95;
        viewer.fov = 50;
        viewer.globalLight.intensity = 3.4;
        viewer.cameraLight.intensity = 1.2;
        viewer.controls.enableZoom = false;
        viewer.controls.enablePan = false;

        const idle = new skinview3d.IdleAnimation();
        idle.speed = 0.55;
        viewer.animation = idle; // NOTE: singular "animation" setter, not "animations.add()"

        viewer.playerObject.rotation.y = BASE_ANGLE;
      } catch (err) {
        console.error("3D skin viewer could not start (WebGL may be unavailable on this device):", err);
        viewer = null;
      }
    }

    if (slides.length === 0) return;

    let current = 0;
    let targetRotation = BASE_ANGLE;
    let currentRotation = BASE_ANGLE;
    let loadedSkin = slides[0] ? slides[0].skin : null;

    const dotsEl = document.getElementById("carouselDots");
    if (dotsEl) {
      dotsEl.innerHTML = slides
        .map((_, i) => `<button class="dot" data-i="${i}" type="button" aria-label="Go to slide ${i + 1}"></button>`)
        .join("");
    }

    function renderSlide(instant) {
      const s = slides[current];

      if (dotsEl) {
        Array.from(dotsEl.children).forEach((d, idx) => d.classList.toggle("active", idx === current));
      }

      setAccent(s.color1, s.color2);
      updateHeroBtn(s, instant);

      if (viewer) {
        targetRotation = BASE_ANGLE + current * ((Math.PI * 2) / slides.length);
        if (s.skin && s.skin !== loadedSkin) {
          loadedSkin = s.skin;
          if (instant) {
            // First paint — no need for a fade transition.
            try {
              viewer.loadSkin(s.skin);
            } catch (err) {
              console.error("Could not load skin for this slide:", err);
            }
          } else {
            // Smooth crossfade: fade out, swap the texture once fully
            // faded, then fade back in only once the new skin is loaded
            // (or after a safety timeout so it never gets stuck hidden).
            wrap.classList.add("skin-swap");
            const FADE_MS = 320;
            setTimeout(() => {
              let settled = false;
              const finish = () => {
                if (settled) return;
                settled = true;
                wrap.classList.remove("skin-swap");
              };
              try {
                const result = viewer.loadSkin(s.skin);
                if (result && typeof result.then === "function") {
                  result.then(finish).catch(finish);
                  setTimeout(finish, 1200); // safety net if the promise never settles
                } else {
                  finish();
                }
              } catch (err) {
                console.error("Could not load skin for this slide:", err);
                finish();
              }
            }, FADE_MS);
          }
        }
      }
    }

    function goTo(i) {
      current = ((i % slides.length) + slides.length) % slides.length;
      renderSlide(false);
    }

    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));
    if (dotsEl) {
      dotsEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".dot");
        if (btn) goTo(parseInt(btn.dataset.i, 10));
      });
    }

    // Smooth rotation towards the target angle every frame (shortest direction)
    if (viewer) {
      (function animate() {
        let diff = targetRotation - currentRotation;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        currentRotation += diff * 0.08;
        viewer.playerObject.rotation.y = currentRotation;
        requestAnimationFrame(animate);
      })();

      window.addEventListener("resize", () => {
        viewer.setSize(wrap.clientWidth, wrap.clientHeight);
      });
    }

    renderSlide(true);

    /* ---- Scroll-driven grow: skin scales up as you scroll; arrows/dots
       only fade in once it's reached full size ---- */
    const stage = document.getElementById("carouselStage");
    const dotsWrap = document.getElementById("carouselDotsWrap");
    const growHint = document.getElementById("growHint");
    const MIN_SCALE = 0.55;
    let revealed = false;
    let ticking = false;

    function updateGrow() {
      ticking = false;
      const total = heroSection.offsetHeight - window.innerHeight;
      let progress = total > 0 ? -heroSection.getBoundingClientRect().top / total : 1;
      progress = Math.max(0, Math.min(1, progress));

      const scale = MIN_SCALE + progress * (1 - MIN_SCALE);
      if (stage) stage.style.transform = `scale(${scale.toFixed(3)})`;

      const revealStart = 0.72;
      let revealProgress = progress <= revealStart ? 0 : (progress - revealStart) / (1 - revealStart);
      revealProgress = Math.min(1, revealProgress);

      if (dotsWrap) {
        dotsWrap.style.opacity = revealProgress.toFixed(3);
        dotsWrap.style.pointerEvents = revealProgress > 0.5 ? "auto" : "none";
      }
      if (prevBtn) {
        prevBtn.style.opacity = revealProgress.toFixed(3);
        prevBtn.style.pointerEvents = revealProgress > 0.5 ? "auto" : "none";
      }
      if (nextBtn) {
        nextBtn.style.opacity = revealProgress.toFixed(3);
        nextBtn.style.pointerEvents = revealProgress > 0.5 ? "auto" : "none";
      }
      if (growHint) {
        growHint.style.opacity = (1 - progress * 1.6).toFixed(3);
      }

      if (revealProgress >= 1 && !revealed) revealed = true;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateGrow);
        }
      },
      { passive: true }
    );
    updateGrow();
  }

  /* ---------------------------- PAGE CONTENT RENDER ---------------------------- */
  function esc(str) {
    if (str === undefined || str === null) return "";
    return String(str);
  }

  function renderPage() {
    const page = document.body.dataset.page;

    if (page === "index.html") {
      const h = C.home, g = C.general;
      setText("heroTitle", h.heroTitle || g.siteName);
      setText("heroSubtitle", h.heroSubtitle);
      setText("aboutTitle", h.aboutTitle);
      setText("aboutText", h.aboutText);
      setHref("heroBtn", h.heroButtonLink);
      setText("heroBtn", h.heroButtonText);
    }

    if (page === "staffing.html") {
      const s = C.staffing;
      setText("pageTitle", s.pageTitle);
      setText("pageIntro", s.pageIntro);

      const grid = document.getElementById("serverGrid");
      if (grid) {
        grid.innerHTML = (C.servers || [])
          .map(
            (srv) => `
          <div class="card server-card reveal">
            <img class="server-icon" src="${esc(srv.icon)}" alt="${esc(srv.name)}" onerror="this.style.display='none'">
            <div class="server-info">
              <h3>${esc(srv.name)}</h3>
              <span class="server-address">${esc(srv.address)}</span>
              <p>${esc(srv.description)}</p>
              <a class="card-link" href="${esc(srv.link)}" target="_blank" rel="noopener">Visit server →</a>
            </div>
          </div>`
          )
          .join("");
      }

      const timeline = document.getElementById("timelineList");
      if (timeline) {
        timeline.innerHTML = (s.experience || [])
          .map(
            (e) => `
          <div class="timeline-item reveal">
            <div class="timeline-dot"></div>
            <div>
              <h4>${esc(e.role)} — ${esc(e.server)}</h4>
              <div class="meta">${esc(e.period)}</div>
              <p>${esc(e.details)}</p>
            </div>
          </div>`
          )
          .join("");
      }
    }

    if (page === "ssing.html") {
      const s = C.ssing;
      setText("pageTitle", s.pageTitle);
      setText("pageIntro", s.pageIntro);
      const grid = document.getElementById("ssingGrid");
      if (grid) {
        grid.innerHTML = (s.items || [])
          .map(
            (item) => `
          <div class="card reveal">
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.text)}</p>
          </div>`
          )
          .join("");
      }
    }

    if (page === "thumbnails.html") {
      const t = C.thumbnails;
      setText("pageTitle", t.pageTitle);
      setText("pageIntro", t.pageIntro);
      setText("orderBtn", t.orderButtonText);
      setHref("orderBtn", t.orderButtonLink);

      const gallery = document.getElementById("galleryGrid");
      if (gallery) {
        gallery.innerHTML = (t.gallery || [])
          .map(
            (g) => `
          <div class="masonry-item reveal">
            <div class="gallery-img"><img src="${esc(g.image)}" alt="${esc(g.caption)}" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'"></div>
            ${g.caption ? `<div class="gallery-caption">${esc(g.caption)}</div>` : ""}
          </div>`
          )
          .join("");
      }
    }

    if (page === "reviews.html") {
      const r = C.reviews;
      setText("pageTitle", r.pageTitle);
      setText("pageIntro", r.pageIntro);
      setText("reviewsBtn", r.buttonText);
      setHref("reviewsBtn", r.buttonLink);
    }
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.textContent = val;
  }
  function setHref(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.setAttribute("href", val);
  }

  /* ---------------------------- INIT ---------------------------- */
  function fullRender() {
    renderChrome();
    renderPage();
    initReveal();
    setTimeout(initReveal, 50);
  }

  // Exposed so editor.js can refresh the visible page after saving changes
  // without needing a full reload in places where that's not necessary.
  window.GB_fullRender = fullRender;

  document.addEventListener("DOMContentLoaded", () => {
    initPageAccent();
    fullRender();
    initHeroCarousel();
  });
})();
