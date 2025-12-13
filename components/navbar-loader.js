fetch("/components/navbar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;

    // Active page highlighting
    const path = window.location.pathname.split("/").pop();
    const link = document.querySelector(
      `[data-nav="${path.replace(".html", "")}"]`
    );
    if (link) link.classList.add("active");

    // Dropdown elements
    const guideToggle = document.getElementById("guideToggle");
    const guideMenu = document.getElementById("dropdownMenu");

    const supportToggle = document.getElementById("supportToggle");
    const supportMenu = document.getElementById("supportMenu");

    const moreToggle = document.getElementById("moreToggle");
    const moreMenu = document.getElementById("moreMenu");

    function closeAll() {
      guideMenu.style.display = "none";
      supportMenu.style.display = "none";
      moreMenu.style.display = "none";
    }

    guideToggle.addEventListener("click", () => {
      const open = guideMenu.style.display === "block";
      closeAll();
      guideMenu.style.display = open ? "none" : "block";
    });

    supportToggle.addEventListener("click", () => {
      const open = supportMenu.style.display === "block";
      closeAll();
      supportMenu.style.display = open ? "none" : "block";
    });

    moreToggle.addEventListener("click", () => {
      const open = moreMenu.style.display === "block";
      closeAll();
      moreMenu.style.display = open ? "none" : "block";
    });

    window.addEventListener("click", e => {
      if (
        !guideToggle.contains(e.target) &&
        !guideMenu.contains(e.target) &&
        !supportToggle.contains(e.target) &&
        !supportMenu.contains(e.target) &&
        !moreToggle.contains(e.target) &&
        !moreMenu.contains(e.target)
      ) {
        closeAll();
      }
    });
  });
