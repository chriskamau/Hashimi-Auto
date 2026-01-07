// Simple in-browser admin for editing content/site-content.json

(function () {
  const nav = document.getElementById("admin-nav");
  const statusBadge = document.getElementById("admin-status");

  function setStatus(text) {
    if (statusBadge) statusBadge.textContent = text;
  }

  function switchSection(key) {
    document.querySelectorAll(".admin-nav button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.section === key);
    });
    document.querySelectorAll(".admin-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === "admin-section-" + key);
    });
  }

  if (nav) {
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-section]");
      if (!btn) return;
      switchSection(btn.dataset.section);
    });
  }

  let workingCopy = null;

  async function loadInitial() {
    setStatus("Loading…");
    const data = await window.HashimiSite._loadSiteContent();
    if (!data) {
      setStatus("Error loading content");
      return;
    }
    workingCopy = JSON.parse(JSON.stringify(data));
    populateEditors();
    setStatus("Loaded");
  }

  function populateEditors() {
    if (!workingCopy) return;

    // Homepage hero
    const hero = (workingCopy.homepage && workingCopy.homepage.hero) || {};
    const heroTitle = document.getElementById("admin-hero-title");
    const heroSubtitle = document.getElementById("admin-hero-subtitle");
    const heroPrimary = document.getElementById("admin-hero-primary");
    const heroSecondary = document.getElementById("admin-hero-secondary");
    const heroHighlights = document.getElementById("admin-hero-highlights");

    if (heroTitle) heroTitle.value = hero.title || "";
    if (heroSubtitle) heroSubtitle.value = hero.subtitle || "";
    if (heroPrimary) heroPrimary.value = hero.primaryCtaText || "";
    if (heroSecondary) heroSecondary.value = hero.secondaryCtaText || "";
    if (heroHighlights) {
      heroHighlights.value = Array.isArray(hero.highlights) ? hero.highlights.join("\n") : "";
    }

    // List JSON editors
    const servicesEl = document.getElementById("admin-services-json");
    const productsEl = document.getElementById("admin-products-json");
    const testimonialsEl = document.getElementById("admin-testimonials-json");
    const teamEl = document.getElementById("admin-team-json");
    const aboutEl = document.getElementById("admin-about-json");
    const contactEl = document.getElementById("admin-contact-json");
    const rawEl = document.getElementById("admin-raw-json");

    if (servicesEl) servicesEl.value = JSON.stringify(workingCopy.services || [], null, 2);
    if (productsEl) productsEl.value = JSON.stringify(workingCopy.products || [], null, 2);
    if (testimonialsEl) testimonialsEl.value = JSON.stringify(workingCopy.testimonials || [], null, 2);
    if (teamEl) teamEl.value = JSON.stringify(workingCopy.team || [], null, 2);
    if (aboutEl) aboutEl.value = JSON.stringify(workingCopy.about || {}, null, 2);
    if (contactEl)
      contactEl.value = JSON.stringify(
        { contactInfo: workingCopy.contactInfo || {}, businessHours: workingCopy.businessHours || [] },
        null,
        2
      );
    if (rawEl) rawEl.value = JSON.stringify(workingCopy, null, 2);
  }

  function readEditorsIntoWorkingCopy() {
    if (!workingCopy) return;

    // Homepage hero
    const heroTitle = document.getElementById("admin-hero-title");
    const heroSubtitle = document.getElementById("admin-hero-subtitle");
    const heroPrimary = document.getElementById("admin-hero-primary");
    const heroSecondary = document.getElementById("admin-hero-secondary");
    const heroHighlights = document.getElementById("admin-hero-highlights");

    workingCopy.homepage = workingCopy.homepage || {};
    workingCopy.homepage.hero = workingCopy.homepage.hero || {};
    const hero = workingCopy.homepage.hero;

    if (heroTitle) hero.title = heroTitle.value;
    if (heroSubtitle) hero.subtitle = heroSubtitle.value;
    if (heroPrimary) hero.primaryCtaText = heroPrimary.value;
    if (heroSecondary) hero.secondaryCtaText = heroSecondary.value;
    if (heroHighlights) {
      hero.highlights = heroHighlights.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    function safeParse(el, fallback) {
      if (!el) return fallback;
      try {
        const v = JSON.parse(el.value || "");
        return v;
      } catch (e) {
        alert("One of the JSON sections has invalid syntax. Please fix it or use the Raw JSON tab.");
        throw e;
      }
    }

    const servicesEl = document.getElementById("admin-services-json");
    const productsEl = document.getElementById("admin-products-json");
    const testimonialsEl = document.getElementById("admin-testimonials-json");
    const teamEl = document.getElementById("admin-team-json");
    const aboutEl = document.getElementById("admin-about-json");
    const contactEl = document.getElementById("admin-contact-json");
    const rawEl = document.getElementById("admin-raw-json");

    // If raw JSON tab has been edited, prefer that as single source of truth
    if (rawEl && rawEl.value.trim()) {
      try {
        workingCopy = JSON.parse(rawEl.value);
        return;
      } catch (e) {
        alert("Raw JSON contains errors. Please fix before downloading.");
        throw e;
      }
    }

    workingCopy.services = safeParse(servicesEl, []);
    workingCopy.products = safeParse(productsEl, []);
    workingCopy.testimonials = safeParse(testimonialsEl, []);
    workingCopy.team = safeParse(teamEl, []);
    workingCopy.about = safeParse(aboutEl, {});

    if (contactEl) {
      const obj = safeParse(contactEl, {});
      workingCopy.contactInfo = obj.contactInfo || workingCopy.contactInfo || {};
      workingCopy.businessHours = obj.businessHours || workingCopy.businessHours || [];
    }
  }

  function downloadJson() {
    if (!workingCopy) return;
    try {
      readEditorsIntoWorkingCopy();
    } catch (e) {
      setStatus("Fix JSON errors");
      return;
    }
    const blob = new Blob([JSON.stringify(workingCopy, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus("Downloaded");
  }

  document.getElementById("admin-load").addEventListener("click", loadInitial);
  document.getElementById("admin-download").addEventListener("click", downloadJson);

  document.addEventListener("DOMContentLoaded", loadInitial);
})();

