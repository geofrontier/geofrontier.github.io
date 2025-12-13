// navbar-loader.js (robust + defensive)
fetch("/components/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;

    // Active page highlighting
    const path = window.location.pathname.split("/").pop();
    const page = path ? path.replace(".html", "") : "index";
    const link = document.querySelector(`[data-nav="${page}"]`);
    if (link) link.classList.add("active");

    // Grab elements (may be null on some pages; handle gracefully)
    const guideToggle = document.getElementById("guideToggle");
    const guideMenu = document.getElementById("dropdownMenu");

    const supportToggle = document.getElementById("supportToggle");
    const supportMenu = document.getElementById("supportMenu");

    const moreToggle = document.getElementById("moreToggle");
    const moreMenu = document.getElementById("moreMenu");

    function closeAll() {
      if (guideMenu) guideMenu.classList.remove("open");
      if (supportMenu) supportMenu.classList.remove("open");
      if (moreMenu) moreMenu.classList.remove("open");
    }

    // helper to toggle a single menu
    function toggle(menu) {
      if (!menu) return;
      const isOpen = menu.classList.contains("open");
      closeAll();
      if (!isOpen) menu.classList.add("open");
    }

    // Attach safe listeners (only if elements exist)
    if (guideToggle) {
      guideToggle.addEventListener("click", (e) => {
        e.stopPropagation(); // <-- prevents document click from immediately closing it
        toggle(guideMenu);
      });
    }

    if (supportToggle) {
      supportToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle(supportMenu);
      });
    }

    if (moreToggle) {
      moreToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle(moreMenu);
      });
    }

    // clicking anywhere outside a dropdown closes them
    document.addEventListener("click", (e) => {
      // if click is inside any open menu or its toggle, do nothing
      const insideGuide = guideToggle && guideToggle.contains(e.target) || guideMenu && guideMenu.contains(e.target);
      const insideSupport = supportToggle && supportToggle.contains(e.target) || supportMenu && supportMenu.contains(e.target);
      const insideMore = moreToggle && moreToggle.contains(e.target) || moreMenu && moreMenu.contains(e.target);

      if (!insideGuide && !insideSupport && !insideMore) {
        closeAll();
      }
    });

    // optional: close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  })
  .catch(err => {
    // friendly fallback logging (won't crash the rest of the page)
    console.error("Failed to load navbar:", err);
  });
