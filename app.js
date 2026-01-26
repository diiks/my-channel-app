let posts = JSON.parse(localStorage.getItem("posts")) || [];

const feed = document.getElementById("feed");
const search = document.getElementById("search");

function render(list = posts) {
  feed.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="tag">#${p.topic}</div>
      <p>${p.text}</p>
      ${p.image ? `<img src="${p.image}">` : ""}
      ${p.video ? `<video controls src="${p.video}"></video>` : ""}
      ${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ""}
    `;
    feed.appendChild(div);
  });
}

render();

document.getElementById("addPost").onclick = () => {
  const topic = prompt("Тема (как в Telegram):");
  const text = prompt("Текст:");
  const image = prompt("Ссылка на фото (необязательно):");
  const video = prompt("Ссылка на видео (необязательно):");
  const link = prompt("Ссылка (необязательно):");

  posts.unshift({ topic, text, image, video, link });
  localStorage.setItem("posts", JSON.stringify(posts));
  render();
};

search.oninput = e => {
  const q = e.target.value.toLowerCase();
  render(posts.filter(p =>
    p.text.toLowerCase().includes(q) ||
    p.topic.toLowerCase().includes(q) ||
    (p.link && p.link.includes(q))
  ));
};
