import gsap from "gsap";
import jump from "jump.js";
import "boxicons/css/boxicons.min.css";

import { initMap } from "./map";

let postsData = [];
let lastScrollPosition = 0;

const getWpData = async () => {
  const res = await fetch(
    "posts.json"
    // "http://wp.oncographene.com/wp-json/wp/v2/posts?_embed"
  );
  const data = await res.json();
  return data;
};

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
  return "/images/img300_200.jpg";
}

function showPost(index) {
  const modal = document.querySelector("#post-modal");
  const post = postsData[index];
  if (post) {
    document.querySelector("#post-modal .modal-body").innerHTML =
      post.content.rendered;
    document.querySelector(
      "#post-modal .modal-img"
    ).innerHTML = `<img src=${post._embedded["wp:featuredmedia"][0].source_url} alt="post"/>`;
    document.querySelector(
      "#post-modal .modal-title"
    ).innerHTML = `<h3>${post.title.rendered}</h3>`;
    // tl.play();
    modal.style.display = "block";
    setTimeout(() => {
      modal.classList.add("show");
    }, 50);
  }

  modal.addEventListener("click", (event) => {
    if (event.target.id === "post-modal") {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 500);
    }
  });
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

window.onload = async () => {
  const data = await getWpData();
  postsData = data;

  data.slice(0, 3).forEach((post, i) => {
    const newDiv = document.createElement("div");
    newDiv.className = "news-card";
    newDiv.addEventListener("click", () => showPost(i));
    newDiv.innerHTML = `<div class="img-box">
      <img src=${getImg(post)} alt="post" />
      </div>
      <h3>${post.title.rendered}</h3>`;

    // add the newly created element and it's content into the DOM
    const wrapper = document.getElementById("news-wrapper");
    // document.body.insertBefore(newDiv, my_div);
    wrapper.appendChild(newDiv);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initJump();
  moveHero();
  initMap();

  document.addEventListener("scroll", (e) => {
    showNav(e);
  });
});
