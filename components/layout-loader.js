// /components/layout-loader.js
// Loads header + navbar, then initializes navbar behavior (dropdowns, active link).
async function loadLayout() {
  try {
    // load header
    const headerHtml = await fetch("/components/header.html").then(r => r.text());
    document.getElementById("header-container").innerHTML = headerHtml;
  } catch (err) {
    console.error("Failed to load header:", err);
  }

  try {
    // load navbar
    const navbarHtml = await fetch("/components/navbar.html").then(r => r.text());
    document.getElementById("navbar-container").innerHTML = navbarHtml;

    // --- NAVBAR INIT (runs after navbar is inserted) ---
    // Active page highlighting
    const path = window.location.pathname.split("/").pop();
    const page = path ? path.replace(".html", "") : "index";
    const link = document.querySelector(`[data-nav="${page}"]`);
    if (link) link.classList.add("active");

    // Grab toggles & menus (may be null on some pages)
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

    function toggle(menu) {
      if (!menu) return;
      const isOpen = menu.classList.contains("open");
      closeAll();
      if (!isOpen) menu.classList.add("open");
    }

    // Attach click listeners safely (with stopPropagation to avoid immediate close)
    if (guideToggle) {
      guideToggle.addEventListener("click", (e) => {
        e.stopPropagation();
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

    // Clicking outside closes menus
    document.addEventListener("click", (e) => {
      const insideGuide = (guideToggle && guideToggle.contains(e.target)) || (guideMenu && guideMenu.contains(e.target));
      const insideSupport = (supportToggle && supportToggle.contains(e.target)) || (supportMenu && supportMenu.contains(e.target));
      const insideMore = (moreToggle && moreToggle.contains(e.target)) || (moreMenu && moreMenu.contains(e.target));

      if (!insideGuide && !insideSupport && !insideMore) {
        closeAll();
      }
    });

    // close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });

    // done
  } catch (err) {
    console.error("Failed to load navbar:", err);
  }
}

// run it
loadLayout();
