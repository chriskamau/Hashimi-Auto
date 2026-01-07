// Central content loader for Hashimi Auto Solutions
// Reads JSON from content/site-content.json and populates pages

window.HashimiSite = window.HashimiSite || {};

window.HashimiSite.state = {
  content: null,
};

async function loadSiteContent() {
  if (window.HashimiSite.state.content) return window.HashimiSite.state.content;
  try {
    const res = await fetch("content/site-content.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load content JSON");
    const data = await res.json();
    window.HashimiSite.state.content = data;
    return data;
  } catch (err) {
    console.error("[HashimiSite] Error loading site-content.json:", err);
    return null;
  }
}

function populateGlobalContent(content) {
  if (!content) return;

  const contact = content.contactInfo || {};
  const hours = content.businessHours || [];
  const general = content.general || {};

  const phoneTop = document.getElementById("top-contact-phone");
  const hoursTop = document.getElementById("top-contact-hours");
  const taglineBrand = document.getElementById("brand-tagline");
  const footerTagline = document.getElementById("footer-tagline");
  const footerAddr = document.getElementById("footer-address");
  const footerPhone = document.getElementById("footer-phone");
  const footerEmail = document.getElementById("footer-email");
  const footerHours = document.getElementById("footer-hours");
  const footerSocial = document.getElementById("footer-social-links");
  const footerCopy = document.getElementById("footer-copy");

  if (phoneTop && contact.phonePrimary) {
    phoneTop.textContent = `Call: ${contact.phonePrimary}`;
  }

  if (hoursTop && contact.quickHours) {
    hoursTop.textContent = contact.quickHours;
  }

  if (taglineBrand && general.tagline) {
    taglineBrand.textContent = general.tagline;
  }

  if (footerTagline && general.missionShort) {
    footerTagline.textContent = general.missionShort;
  }

  if (footerAddr && contact.addressLine1) {
    footerAddr.textContent = `${contact.addressLine1}${contact.city ? ", " + contact.city : ""}`;
  }

  if (footerPhone && contact.phonePrimary) {
    footerPhone.textContent = `Phone: ${contact.phonePrimary}`;
  }

  if (footerEmail && contact.email) {
    footerEmail.textContent = `Email: ${contact.email}`;
  }

  if (footerHours && Array.isArray(hours)) {
    footerHours.innerHTML = "";
    hours.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = `${h.label}: ${h.value}`;
      footerHours.appendChild(li);
    });
  }

  if (footerSocial && Array.isArray(contact.socialLinks)) {
    footerSocial.innerHTML = "";
    contact.socialLinks.forEach((s) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = s.label;
      li.appendChild(a);
      footerSocial.appendChild(li);
    });
  }

  if (footerCopy) {
    const year = new Date().getFullYear();
    footerCopy.textContent = `© ${year} hashimi Auto Solutions. All rights reserved.`;
  }

  const waBtn = document.getElementById("whatsapp-button");
  if (waBtn && contact.whatsappNumber) {
    const encodedMsg = encodeURIComponent("Hello hashimi Auto Solutions, I would like to inquire about:");
    waBtn.href = `https://wa.me/${contact.whatsappNumber}?text=${encodedMsg}`;
  }
}

window.HashimiSite.loadHomePageContent = async function () {
  const content = await loadSiteContent();
  populateGlobalContent(content);
  if (!content) return;

  const home = content.homepage || {};
  const hero = home.hero || {};

  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle = document.getElementById("hero-subtitle");
  const heroImg = document.getElementById("hero-image");
  const heroPrimary = document.getElementById("hero-primary-cta");
  const heroSecondary = document.getElementById("hero-secondary-cta");
  const heroHighlights = document.getElementById("hero-highlights");

  if (heroTitle && hero.title) heroTitle.textContent = hero.title;
  if (heroSubtitle && hero.subtitle) heroSubtitle.textContent = hero.subtitle;
  if (heroPrimary && hero.primaryCtaText) heroPrimary.textContent = hero.primaryCtaText;
  if (heroSecondary && hero.secondaryCtaText) heroSecondary.textContent = hero.secondaryCtaText;
  if (heroImg && hero.image) heroImg.src = hero.image;

  if (heroHighlights && Array.isArray(hero.highlights)) {
    heroHighlights.innerHTML = "";
    hero.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      heroHighlights.appendChild(li);
    });
  }

  // Featured services slider
  const featuredServices = Array.isArray(content.services)
    ? content.services.filter((s) => s.featured)
    : [];
  const sliderTrack = document.getElementById("services-slider-track");
  const sliderDots = document.getElementById("services-slider-dots");

  if (sliderTrack && featuredServices.length) {
    sliderTrack.innerHTML = "";
    sliderDots.innerHTML = "";
    featuredServices.forEach((svc, index) => {
      const item = document.createElement("div");
      item.className = "slider-item";
      item.innerHTML = `
        <article class="slider-card">
          <div>
            <h3>${svc.name}</h3>
            <p>${svc.description || ""}</p>
            <p class="card-meta">${svc.shortTagline || ""}</p>
            <a href="services.html#service-${svc.id}" class="btn-outline">View details</a>
          </div>
          <div>
            <img src="${svc.image || "assets/images/service-default.jpg"}" alt="${svc.name}" />
          </div>
        </article>
      `;
      sliderTrack.appendChild(item);

      const dot = document.createElement("button");
      dot.className = "slider-dot" + (index === 0 ? " active" : "");
      dot.dataset.index = String(index);
      sliderDots && sliderDots.appendChild(dot);
    });

    // Basic slider controls
    let currentIndex = 0;
    const total = featuredServices.length;
    function goTo(idx) {
      currentIndex = (idx + total) % total;
      sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (sliderDots) {
        Array.from(sliderDots.children).forEach((d, i) => {
          d.classList.toggle("active", i === currentIndex);
        });
      }
    }
    const prevBtn = document.getElementById("service-prev");
    const nextBtn = document.getElementById("service-next");
    prevBtn &&
      prevBtn.addEventListener("click", () => {
        goTo(currentIndex - 1);
      });
    nextBtn &&
      nextBtn.addEventListener("click", () => {
        goTo(currentIndex + 1);
      });
    sliderDots &&
      sliderDots.addEventListener("click", (e) => {
        const btn = e.target.closest(".slider-dot");
        if (!btn) return;
        const idx = parseInt(btn.dataset.index || "0", 10);
        if (!Number.isNaN(idx)) goTo(idx);
      });
  }

  // Why choose us
  const whyGrid = document.getElementById("why-choose-grid");
  if (whyGrid && Array.isArray(home.whyChooseUs)) {
    whyGrid.innerHTML = "";
    home.whyChooseUs.forEach((item) => {
      const card = document.createElement("article");
      card.className = "feature-card";
      card.innerHTML = `
        <div class="feature-icon">${item.icon || "✓"}</div>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      `;
      whyGrid.appendChild(card);
    });
  }

  // Testimonials
  const testimonialsGrid = document.getElementById("testimonials-grid");
  if (testimonialsGrid && Array.isArray(content.testimonials)) {
    testimonialsGrid.innerHTML = "";
    content.testimonials.forEach((t) => {
      const card = document.createElement("article");
      card.className = "testimonial-card";
      card.innerHTML = `
        <p class="testimonial-text">“${t.quote}”</p>
        <div class="testimonial-meta">
          <img class="testimonial-avatar" src="${t.photo ||
            "assets/images/avatar-default.jpg"}" alt="${t.name}" />
          <div>
            <span class="testimonial-name">${t.name}</span>
            <span class="testimonial-role">${t.location || ""}</span>
          </div>
        </div>
      `;
      testimonialsGrid.appendChild(card);
    });
  }

  const ctaVisit = document.getElementById("cta-visit-text");
  if (ctaVisit && home.visitCtaText) {
    ctaVisit.textContent = home.visitCtaText;
  }
};

window.HashimiSite.loadServicesPageContent = async function () {
  const content = await loadSiteContent();
  populateGlobalContent(content);
  if (!content) return;

  const servicesGrid = document.getElementById("services-grid");
  if (servicesGrid && Array.isArray(content.services)) {
    servicesGrid.innerHTML = "";
    content.services.forEach((svc) => {
      const card = document.createElement("article");
      card.className = "card";
      card.id = `service-${svc.id}`;
      card.innerHTML = `
        <img src="${svc.image || "assets/images/service-default.jpg"}" alt="${svc.name}" />
        <div class="card-body">
          <h2 class="card-title">${svc.name}</h2>
          <p>${svc.description || ""}</p>
        </div>
        <div class="card-footer">
          <span class="card-meta">${svc.estimatedTime || ""}</span>
          <button class="btn-outline small" data-service-id="${svc.id}">View details</button>
        </div>
      `;
      servicesGrid.appendChild(card);
    });
  }
};

window.HashimiSite.loadProductsPageContent = async function () {
  const content = await loadSiteContent();
  populateGlobalContent(content);
  if (!content) return;

  const products = Array.isArray(content.products) ? content.products : [];
  const list = document.getElementById("products-list");
  const categoryFilter = document.getElementById("product-category-filter");
  const searchInput = document.getElementById("product-search");

  function renderList(filtered) {
    if (!list) return;
    list.innerHTML = "";
    filtered.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.category = p.category || "";
      card.innerHTML = `
        <img src="${p.image || "assets/images/product-default.jpg"}" alt="${p.name}" />
        <div class="card-body">
          <h2 class="card-title">${p.name}</h2>
          <p>${p.description || ""}</p>
        </div>
        <div class="card-footer">
          <span>${p.price ? "KES " + p.price.toLocaleString() : ""}</span>
          <button class="btn-primary btn-request-quote" data-product-name="${p.name}">
            Request Quote
          </button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  renderList(products);

  if (categoryFilter) {
    const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
    categoryFilter.addEventListener("change", () => {
      const category = categoryFilter.value;
      const term = (searchInput && searchInput.value.toLowerCase()) || "";
      const filtered = products.filter((p) => {
        const matchesCategory = !category || p.category === category;
        const matchesSearch =
          !term ||
          p.name.toLowerCase().includes(term) ||
          (p.description || "").toLowerCase().includes(term);
        return matchesCategory && matchesSearch;
      });
      renderList(filtered);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const category = (categoryFilter && categoryFilter.value) || "";
      const filtered = products.filter((p) => {
        const matchesCategory = !category || p.category === category;
        const matchesSearch =
          !term ||
          p.name.toLowerCase().includes(term) ||
          (p.description || "").toLowerCase().includes(term);
        return matchesCategory && matchesSearch;
      });
      renderList(filtered);
    });
  }
};

window.HashimiSite.loadAboutPageContent = async function () {
  const content = await loadSiteContent();
  populateGlobalContent(content);
  if (!content) return;

  const about = content.about || {};

  const historyEl = document.getElementById("about-history");
  const missionEl = document.getElementById("about-mission");
  const valuesList = document.getElementById("about-values");
  const yearsEl = document.getElementById("about-years");
  const teamGrid = document.getElementById("team-grid");

  if (historyEl && about.history) historyEl.textContent = about.history;
  if (missionEl && about.mission) missionEl.textContent = about.mission;
  if (yearsEl && about.yearsInBusiness) yearsEl.textContent = `${about.yearsInBusiness}+ years in business`;

  if (valuesList && Array.isArray(about.values)) {
    valuesList.innerHTML = "";
    about.values.forEach((v) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${v.title}:</strong> ${v.text}`;
      valuesList.appendChild(li);
    });
  }

  if (teamGrid && Array.isArray(content.team)) {
    teamGrid.innerHTML = "";
    content.team.forEach((m) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img src="${m.photo || "assets/images/team-default.jpg"}" alt="${m.name}" />
        <div class="card-body">
          <h2 class="card-title">${m.name}</h2>
          <p class="card-meta">${m.role || ""}</p>
          <p>${m.bio || ""}</p>
        </div>
      `;
      teamGrid.appendChild(card);
    });
  }
};

window.HashimiSite.loadContactPageContent = async function () {
  const content = await loadSiteContent();
  populateGlobalContent(content);
  if (!content) return;

  const contact = content.contactInfo || {};
  const hours = content.businessHours || [];

  const contactDetails = document.getElementById("contact-details");
  const hoursList = document.getElementById("contact-hours");
  const mapFrame = document.getElementById("contact-map");

  if (contactDetails) {
    contactDetails.innerHTML = `
      <p><strong>Phone:</strong> ${contact.phonePrimary || ""}</p>
      <p><strong>Email:</strong> ${contact.email || ""}</p>
      <p><strong>Address:</strong> ${contact.addressLine1 || ""}${
      contact.city ? ", " + contact.city : ""
    }</p>
    `;
  }

  if (hoursList && Array.isArray(hours)) {
    hoursList.innerHTML = "";
    hours.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = `${h.label}: ${h.value}`;
      hoursList.appendChild(li);
    });
  }

  if (mapFrame && contact.googleMapsEmbedUrl) {
    mapFrame.src = contact.googleMapsEmbedUrl;
  }
};

// Expose loader for admin
window.HashimiSite._loadSiteContent = loadSiteContent;

