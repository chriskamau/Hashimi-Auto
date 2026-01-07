// Main shared UI behaviours: nav toggle, dark mode, modals, basic form helpers

(function () {
  const nav = document.getElementById("main-nav");
  const navToggle = document.getElementById("nav-toggle");
  const themeToggle = document.getElementById("theme-toggle");

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  // Dark mode
  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    }
    localStorage.setItem("hashimi-theme", theme);
  }

  const storedTheme = localStorage.getItem("hashimi-theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    applyTheme(storedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme") || "light";
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  // Simple global modal (used for service details / gallery)
  const modalBackdrop = document.createElement("div");
  modalBackdrop.className = "modal-backdrop";
  modalBackdrop.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 id="modal-title"></h3>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
    </div>
  `;
  document.body.appendChild(modalBackdrop);

  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalCloseBtn = modalBackdrop.querySelector(".modal-close");

  function openModal(title, htmlContent) {
    if (modalTitle) modalTitle.textContent = title || "";
    if (modalBody) modalBody.innerHTML = htmlContent || "";
    modalBackdrop.classList.add("active");
  }

  function closeModal() {
    modalBackdrop.classList.remove("active");
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  window.HashimiSite = window.HashimiSite || {};
  window.HashimiSite.openModal = openModal;

  // Delegate product "Request Quote" button to prefill contact form
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains("btn-request-quote")) {
      const name = target.getAttribute("data-product-name") || "";
      const url = new URL("contact.html", window.location.href);
      url.searchParams.set("product", name);
      window.location.href = url.toString();
    }
  });
})();

