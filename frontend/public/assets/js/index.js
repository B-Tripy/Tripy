const header = document.getElementById(".header");
const footer = document.getElementById(".footer");
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docH > 0 ? scrollY / docH : 0;
    if (ratio >= 0.66) {
      header.classList.add("hidden-top");
      footer.classList.add("visible-bottom");
    } else {
      header.classList.remove("hidden-top");
      footer.classList.remove("visible-bottom");
    }
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
