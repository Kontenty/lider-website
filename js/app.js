import sal from "sal.js";
import jump from "jump.js";
import gsap from "gsap";
import "boxicons/css/boxicons.min.css";
import imgPlaceholder from "../images/img300_200.jpg";

import { initMap } from "./map";
import { initMenu } from "./collapseMenu";

let postsData = [];
let lastScrollPosition = 0;
let currentPostIndex = 0;
let modal, prevPostBtn, nextPostBtn;

function initJump() {
  const buttons = document.querySelectorAll(".jump");
  buttons.forEach((btn) => {
    const target = btn.getAttribute("data-target");
    btn.addEventListener("click", (e) => jump(target, { offset: -20 }));
  });
}

function getImg(post) {
  if (
    post._embedded.hasOwnProperty("wp:featuredmedia") &&
    post._embedded["wp:featuredmedia"].length > 0 &&
    post._embedded["wp:featuredmedia"]["0"].source_url
  ) {
    return post._embedded["wp:featuredmedia"]["0"].source_url;
  }
  return imgPlaceholder;
}

function showPost(index) {
  const post = postsData[index];
  currentPostIndex = index;
  document.querySelector("#post-modal .modal-body").innerHTML =
    post.content.rendered;
  document.querySelector("#post-modal .modal-img").innerHTML = post._embedded[
    "wp:featuredmedia"
  ]
    ? `<img src=${getImg(post)} alt="post"/>`
    : "";
  document.querySelector(
    "#post-modal .modal-title"
  ).innerHTML = `<h3>${post.title.rendered}</h3>`;
}
const closeModal = () => {
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 500);
};

function initModal() {
  modal = document.querySelector("#post-modal");
  prevPostBtn = document.querySelector("#prev-post");
  nextPostBtn = document.querySelector("#next-post");
  document
    .querySelector(".modal-content i.bx")
    .addEventListener("click", closeModal);

  prevPostBtn.addEventListener("click", () => {
    if (currentPostIndex < postsData.length - 1) {
      showPost(currentPostIndex + 1);
    }
  });
  nextPostBtn.addEventListener("click", () => {
    if (currentPostIndex > 0) {
      showPost(currentPostIndex - 1);
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target.id === "post-modal") {
      closeModal();
    }
  });
}

function showPostModal(index) {
  if (postsData[index]) {
    showPost(index);
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 50);
  }
}

function moveHero() {
  const getDeg = (pos, size) => {
    const multiPlicator = pos / size < 0.35 ? -1 : pos / size > 0.65 ? 1 : 0;
    return multiPlicator * 1;
  };

  document.querySelectorAll(".hero .move").forEach((img) => {
    img.addEventListener("mousemove", (e) => {
      let x = e.offsetX;
      let y = e.offsetY;
      let w = img.offsetWidth;
      let h = img.offsetHeight;
      // img.style.transform = "rotate3d(0.1, -1, 0.5, 10deg) translateZ(-15px)";
      img.style.transform = `rotateX(${-getDeg(y, h)}deg) rotateY(${getDeg(
        x,
        w
      )}deg) translateZ(7px)`;
    });
    img.addEventListener("mouseleave", () => {
      img.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
  });
}

function showNav(e) {
  let currentScrollPosition = window.scrollY;
  const header = document.querySelector(".main-header");
  if (currentScrollPosition < lastScrollPosition) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }

  lastScrollPosition = currentScrollPosition;
}

function finishPreload() {
  const target = document.querySelector("#preload");
  target.classList.add("finish");
  document.body.classList.remove("loading");

  gsap.from(".hero h1", {
    transform: "scale(0.9)",
    opacity: 0,

    duration: 1,
    delay: 0.1,
  });
  gsap.from(".hero aside", {
    x: 50,
    opacity: 0,
    duration: 1,
  });
  gsap.from(".hero button", {
    opacity: 0,
    duration: 1,
    delay: 0.2,
  });

  setTimeout(() => {
    target.style.display = "none";
  }, 410);
}

// load posts from api and insert to dom
window.onload = () => {
  fetch(
    // "posts.json"
    // "http://wp.oncographene.com/wp-json/wp/v2/posts?_embed"
    "/api.php/posts"
  )
    .then((res) => res.json())
    .then((data) => {
      const replaced = JSON.stringify(data).replace(
        /http:\/\/wp.oncographene.com\/wp-content\/uploads/g,
        "/api.php/img?file=http://wp.oncographene.com/wp-content/uploads"
      );
      const newData = JSON.parse(replaced);
      console.log({ newData });
      postsData = newData;

      newData.slice(0, 3).forEach((post, i) => {
        const newDiv = document.createElement("div");
        newDiv.className = "news-card";
        newDiv.addEventListener("click", () => showPostModal(i));
        newDiv.innerHTML = `<div class="img-box">
        <img src=${getImg(post)} alt="post" />
        </div>
        <h3>${post.title.rendered}</h3>`;

        // add the newly created element and it's content into the DOM
        const wrapper = document.getElementById("news-wrapper");
        wrapper.appendChild(newDiv);
      });
    })
    .catch((e) => console.error("Posts error:", e));

  setTimeout(() => {
    finishPreload();
  }, 1000);
};

document.addEventListener("DOMContentLoaded", () => {
  initJump();
  moveHero();
  initMap();
  sal();
  initModal();
  initMenu();

  document.addEventListener("scroll", (e) => {
    showNav(e);
  });
});
