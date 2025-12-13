async function loadLayout() {
  const header = await fetch("/components/header.html").then(r => r.text());
  document.getElementById("header-container").innerHTML = header;

  const navbar = await fetch("/components/navbar.html").then(r => r.text());
  document.getElementById("navbar-container").innerHTML = navbar;
}

loadLayout();
