import {
  openDB,
  getAllNotes,
  saveNote,
  deleteNote,
  saveMedia,
  getMediaByIds
} from './db.js';

/* =========================
   STATE
========================= */
let notes = [];
let currentId = null;
let isEditing = false;
let media = [];
let mediaIds = [];
let currentMediaIndex = 0;

/* =========================
   ELEMENTS
========================= */
const notesEl = document.getElementById('notesList');
const modal = document.getElementById('noteModal');
const card = modal.querySelector('.card');

const titleEl = document.getElementById('noteTitle');
const textEl = document.getElementById('noteText');

const mediaInput = document.createElement('input');
mediaInput.type = 'file';
mediaInput.multiple = true;
mediaInput.accept = 'image/*,video/*';

const track = document.getElementById('mediaList');
const indicator = document.getElementById('mediaIndicator');

const fullscreen = document.getElementById('mediaFullscreen');
const fullscreenContent = document.getElementById('fullscreenContent');

/* =========================
   HELPERS
========================= */
const setEditable = v => {
  titleEl.disabled = !v;
  textEl.disabled = !v;
};

const openModal = () => modal.classList.remove('hidden');
const closeModal = () => modal.classList.add('hidden');

/* =========================
   RENDER NOTES
========================= */
async function renderNotes() {
  notes = await getAllNotes();
  notesEl.innerHTML = '';

  notes.forEach(n => {
    const d = document.createElement('div');
    d.className = 'note';
    d.textContent = n.title || 'Без названия';
    d.onclick = () => openNote(n);
    notesEl.appendChild(d);
  });
}

/* =========================
   OPEN NOTE
========================= */
async function openNote(note) {
  currentId = note.id;
  titleEl.value = note.title;
  textEl.value = note.text;

  mediaIds = note.mediaIds || [];
  media = await getMediaByIds(mediaIds);

  renderMedia();

  isEditing = false;
  setEditable(false);
  openModal();
}

/* =========================
   MEDIA
========================= */
function renderMedia() {
  track.innerHTML = '';
  currentMediaIndex = 0;

  if (!media.length) {
    indicator.textContent = '';
    return;
  }

  media.forEach((m, i) => {
    const url = URL.createObjectURL(m.blob);
    const item = document.createElement('div');
    item.className = 'media-item';

    if (m.type.startsWith('video')) {
      item.innerHTML = `<video src="${url}" controls></video>`;
    } else {
      const img = document.createElement('img');
      img.src = url;
      img.onclick = () => openFullscreen(i);
      item.appendChild(img);
    }

    track.appendChild(item);
  });

  updateIndicator();
}

track.addEventListener('scroll', () => {
  const w = track.clientWidth;
  currentMediaIndex = Math.round(track.scrollLeft / w);
  updateIndicator();
});

const updateIndicator = () => {
  indicator.textContent = media.length
    ? `${currentMediaIndex + 1} / ${media.length}`
    : '';
};

/* =========================
   FULLSCREEN
========================= */
function openFullscreen(i) {
  currentMediaIndex = i;
  fullscreenContent.innerHTML = '';

  const m = media[i];
  const url = URL.createObjectURL(m.blob);

  if (m.type.startsWith('video')) {
    fullscreenContent.innerHTML = `<video src="${url}" controls autoplay></video>`;
  } else {
    fullscreenContent.innerHTML = `<img src="${url}">`;
  }

  fullscreen.classList.remove('hidden');
}

document.getElementById('closeFullscreen').onclick = () =>
  fullscreen.classList.add('hidden');

/* =========================
   ADD NOTE (+)
========================= */
document.getElementById('openAdd').onclick = () => {
  currentId = Date.now();
  titleEl.value = '';
  textEl.value = '';
  media = [];
  mediaIds = [];

  renderMedia();

  isEditing = true;
  setEditable(true);
  openModal();
};

/* =========================
   CLOSE MODAL
========================= */
document.getElementById('closeModal').onclick = closeModal;

/* =========================
   ADD MEDIA
========================= */
document.getElementById('addMedia').onclick = () => {
  if (isEditing) mediaInput.click();
};

mediaInput.onchange = async () => {
  for (const file of mediaInput.files) {
    const id = await saveMedia(file);
    mediaIds.push(id);
    media.push({ id, type: file.type, blob: file });
  }
  mediaInput.value = '';
  renderMedia();
};

/* =========================
   SAVE
========================= */
document.getElementById('saveNote').onclick = async () => {
  if (!titleEl.value.trim()) return;

  await saveNote({
    id: currentId,
    title: titleEl.value,
    text: textEl.value,
    mediaIds
  });

  closeModal();
  renderNotes();
};

/* =========================
   DELETE
========================= */
document.getElementById('deleteNote').onclick = async () => {
  await deleteNote(currentId);
  closeModal();
  renderNotes();
};

/* =========================
   INIT
========================= */
openDB().then(renderNotes);