import gsap from "gsap";

const navTL = gsap.timeline({ paused: true, reversed: true });
const navbar = document.querySelector("#navbar");
const navToggler = document.querySelector(".navbar-toggle");

navTL.from(navbar, { display: "none", duration: 0.01 });
navTL.from(navbar, { height: 0, duration: 0.3 });
navTL.to(navToggler, { x: -10 }, "-=0.2");
navTL.from(
  "#navbar .nav-item",
  {
    y: -30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.3,
    ease: "easeInOut",
  },
  "-=0.5"
);

function toggleNav() {
  if (navTL.reversed()) {
    navTL.restart();
  } else {
    navTL.reverse();
  }
}

export function initMenu() {
  document.querySelector(".navbar-toggle").addEventListener("click", toggleNav);
}
