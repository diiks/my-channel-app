// Загружаем посты из localStorage или создаем пустой массив
let posts = JSON.parse(localStorage.getItem("posts")) || [];

const feed = document.getElementById("feed");
const search = document.getElementById("search");

// Функция отображения постов
function render(list = posts) {
  feed.innerHTML = "";

  list.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "post";

    // HTML поста с кнопками редактирования и удаления
    div.innerHTML = `
      <div class="tag">#${p.topic}</div>
      <p>${p.text}</p>
      ${p.image ? `<img src="${p.image}">` : ""}
      ${p.video ? `<video controls src="${p.video}"></video>` : ""}
      ${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ""}
      <div class="post-buttons">
        <button class="editPost" data-index="${index}">Редактировать</button>
        <button class="deletePost" data-index="${index}">Удалить</button>
      </div>
    `;
    feed.appendChild(div);
  });

  // Обработчик удаления поста
  document.querySelectorAll(".deletePost").forEach(btn => {
    btn.onclick = () => {
      const idx = btn.getAttribute("data-index");
      posts.splice(idx, 1);
      localStorage.setItem("posts", JSON.stringify(posts));
      render();
    };
  });

  // Обработчик редактирования поста
  document.querySelectorAll(".editPost").forEach(btn => {
    btn.onclick = () => {
      const idx = btn.getAttribute("data-index");
      const post = posts[idx];

      const newTopic = prompt("Тема:", post.topic);
      const newText = prompt("Текст:", post.text);
      const newImage = prompt("Ссылка на фото (оставьте пустым, если не меняем):", post.image);
      const newVideo = prompt("Ссылка на видео (оставьте пустым, если не меняем):", post.video);
      const newLink = prompt("Ссылка (оставьте пустым, если не меняем):", post.link);

      post.topic = newTopic || post.topic;
      post.text = newText || post.text;
      post.image = newImage !== "" ? newImage : post.image;
      post.video = newVideo !== "" ? newVideo : post.video;
      post.link = newLink !== "" ? newLink : post.link;

      localStorage.setItem("posts", JSON.stringify(posts));
      render();
    };
  });
}

// Изначальный рендер
render();

// Кнопка добавления нового поста
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

// Поиск по теме, тексту и ссылкам
search.oninput = e => {
  const q = e.target.value.toLowerCase();
  render(posts.filter(p =>
    p.text.toLowerCase().includes(q) ||
    p.topic.toLowerCase().includes(q) ||
    (p.link && p.link.includes(q))
  ));
};