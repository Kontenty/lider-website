import "../style/index.scss";
import "@icon/linea-basic/linea-basic.css";
import "boxicons/css/boxicons.min.css";

import { initMap } from "./map";

initMap();

const getWpData = async () => {
  const res = await fetch(
    "posts.json"
    // "http://wp.oncographene.com/wp-json/wp/v2/posts?_embed"
  );
  const data = await res.json();
  console.log({ data });
  return data;
};

const getImg = (post) => {
  if (
    post._embedded.hasOwnProperty("wp:featuredmedia") &&
    post._embedded["wp:featuredmedia"].length > 0 &&
    post._embedded["wp:featuredmedia"]["0"].source_url
  ) {
    return post._embedded["wp:featuredmedia"]["0"].source_url;
  }
  return "/images/img300_200.jpg";
};

let postsData = [];

function showPost(id) {
  console.log(id);
  const modal = document.querySelector("#post-modal");
  const post = postsData.find((p) => p.id === id);
  if (post) {
    document.querySelector("#post-modal .modal-content").innerHTML =
      post.content.rendered;
    modal.classList.add("show");
  }
  console.log(post);
}

window.onload = async () => {
  const data = await getWpData();
  console.log({ data });
  postsData = data;

  data.slice(0, 3).forEach((post) => {
    const newDiv = document.createElement("div");
    newDiv.className = "news-card";
    newDiv.addEventListener("click", () => showPost(post.id));
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
