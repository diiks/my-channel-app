const notesEl = document.getElementById('notes');
const search = document.getElementById('search');

const createModal = document.getElementById('createModal');
const viewModal = document.getElementById('viewModal');

const noteTitle = document.getElementById('noteTitle');
const noteText = document.getElementById('noteText');

const mediaInput = document.getElementById('mediaInput');
const mediaPreview = document.getElementById('mediaPreview');

const viewTitle = document.getElementById('viewTitle');
const viewText = document.getElementById('viewText');
const viewMedia = document.getElementById('viewMedia');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentIndex = null;
let currentMedia = null;

/* ОТКРЫТИЕ СОЗДАНИЯ */
openCreate.onclick = () => {
  currentIndex = null;
  currentMedia = null;
  noteTitle.value = '';
  noteText.value = '';
  mediaPreview.innerHTML = '';
  createModal.classList.remove('hidden');
};

closeCreate.onclick = () => {
  createModal.classList.add('hidden');
};

/* МЕДИА */
mediaInput.onchange = () => {
  const file = mediaInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    currentMedia = {
      type: file.type.startsWith('video') ? 'video' : 'image',
      data: reader.result
    };

    mediaPreview.innerHTML =
      currentMedia.type === 'image'
        ? `<img src="${currentMedia.data}">`
        : `<video src="${currentMedia.data}" controls></video>`;
  };
  reader.readAsDataURL(file);
};

/* СОХРАНЕНИЕ */
saveNote.onclick = () => {
  if (!noteTitle.value.trim()) return;

  const data = {
    title: noteTitle.value,
    text: noteText.value,
    media: currentMedia
  };

  if (currentIndex !== null) notes[currentIndex] = data;
  else notes.unshift(data);

  localStorage.setItem('notes', JSON.stringify(notes));
  createModal.classList.add('hidden');
  renderNotes();
};

/* РЕНДЕР */
function renderNotes() {
  notesEl.innerHTML = '';
  const q = search.value.toLowerCase();

  notes.forEach((n, i) => {
    if (!n.title.toLowerCase().includes(q) &&
        !n.text.toLowerCase().includes(q)) return;

    const div = document.createElement('div');
    div.className = 'note-preview';
    div.textContent = n.title;

    div.onclick = () => {
      viewText.textContent = n.text;
      viewTitle.textContent = n.title;
      viewMedia.innerHTML = '';

      if (n.media) {
        viewMedia.innerHTML =
          n.media.type === 'image'
            ? `<img src="${n.media.data}">`
            : `<video src="${n.media.data}" controls></video>`;
      }

      viewModal.classList.remove('hidden');
      currentIndex = i;
    };

    notesEl.appendChild(div);
  });
}

/* ПРОСМОТР */
closeView.onclick = () => {
  viewModal.classList.add('hidden');
  currentIndex = null;
};

editNote.onclick = () => {
  const n = notes[currentIndex];
  noteTitle.value = n.title;
  noteText.value = n.text;
  currentMedia = n.media || null;

  mediaPreview.innerHTML = '';
  if (currentMedia) {
    mediaPreview.innerHTML =
      currentMedia.type === 'image'
        ? `<img src="${currentMedia.data}">`
        : `<video src="${currentMedia.data}" controls></video>`;
  }

  viewModal.classList.add('hidden');
  createModal.classList.remove('hidden');
};

deleteNote.onclick = () => {
  if (!confirm('Удалить заметку?')) return;
  notes.splice(currentIndex, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  viewModal.classList.add('hidden');
  currentIndex = null;
  renderNotes();
};

search.oninput = renderNotes;

renderNotes();