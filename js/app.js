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
let media = [];
let mediaIds = [];
let currentMediaIndex = 0;

/* =========================
   ELEMENTS (СОВПАДАЮТ С HTML)
========================= */
const notesEl = document.getElementById('notes');

const modal = document.getElementById('modal');
const card = document.getElementById('card');

const titleEl = document.getElementById('title');
const textEl = document.getElementById('text');

const mediaInput = document.getElementById('mediaInput');
const track = document.getElementById('mediaTrack');
const indicator = document.getElementById('mediaIndicator');

const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreenImg');

/* =========================
   HELPERS
========================= */
const openModal = () => modal.classList.remove('hidden');
const closeModal = () => modal.classList.add('hidden');

/* =========================
   RENDER NOTES
========================= */
async function renderNotes() {
  notes = await getAllNotes();
  notesEl.innerHTML = '';

  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'note';
    div.textContent = note.title || 'Без названия';
    div.onclick = () => openNote(note);
    notesEl.appendChild(div);
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
  openModal();
}

/* =========================
   MEDIA RENDER
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

function updateIndicator() {
  indicator.textContent = media.length
    ? `${currentMediaIndex + 1} / ${media.length}`
    : '';
}

/* =========================
   FULLSCREEN
========================= */
function openFullscreen(index) {
  const m = media[index];
  const url = URL.createObjectURL(m.blob);

  if (m.type.startsWith('video')) {
    fullscreenImg.outerHTML = `<video src="${url}" controls autoplay></video>`;
  } else {
    fullscreenImg.src = url;
  }

  fullscreen.classList.remove('hidden');
}

document.getElementById('closeFullscreen').onclick = () =>
  fullscreen.classList.add('hidden');

/* =========================
   ADD NOTE
========================= */
document.getElementById('openAdd').onclick = () => {
  currentId = Date.now();
  titleEl.value = '';
  textEl.value = '';
  media = [];
  mediaIds = [];
  renderMedia();
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
  mediaInput.click();
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
   SAVE NOTE (✔ РАБОТАЕТ)
========================= */
document.getElementById('save').onclick = async () => {
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
   DELETE NOTE
========================= */
document.getElementById('delete').onclick = async () => {
  if (!currentId) return;
  await deleteNote(currentId);
  closeModal();
  renderNotes();
};

/* =========================
   INIT
========================= */
openDB().then(renderNotes);