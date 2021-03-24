import jump from "jump.js";
import "boxicons/css/boxicons.min.css";

import { initMap } from "./map";

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

let postsData = [];

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
      // tl.reverse();
    }
  });
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
  initMap();
});
