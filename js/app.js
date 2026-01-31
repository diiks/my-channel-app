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
let media = []; // { id, type, blob }
let mediaIds = [];
let currentMediaIndex = 0;
let allowSwipeClose = true;

/* =========================
   ELEMENTS
========================= */
const notesEl = document.getElementById('notes');
const modal = document.getElementById('modal');
const card = document.getElementById('card');
const fullscreen = document.getElementById('fullscreen');

const titleEl = document.getElementById('title');
const textEl = document.getElementById('text');

const mediaInput = document.getElementById('mediaInput');
const track = document.getElementById('mediaTrack');
const indicator = document.getElementById('mediaIndicator');

const fullscreenImg = document.getElementById('fullscreenImg');

/* =========================
   HELPERS
========================= */
const setEditable = v => {
  titleEl.disabled = !v;
  textEl.disabled = !v;
};

/* =========================
   RENDER NOTES
========================= */
async function renderNotes() {
  notes = await getAllNotes();
  notesEl.innerHTML = '';

  notes.forEach(n => {
    const d = document.createElement('div');
    d.className = 'note';
    d.textContent = n.title;
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
  allowSwipeClose = true;
  setEditable(false);

  modal.classList.add('active');
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
      item.innerHTML = `<img src="${url}">`;
      item.onclick = () => openFullscreen(i);
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

const updateIndicator = () =>
  (indicator.textContent = `${currentMediaIndex + 1} / ${media.length}`);

/* =========================
   FULLSCREEN
========================= */
function openFullscreen(i) {
  currentMediaIndex = i;
  fullscreen.classList.add('active');
  drawFullscreen();
}

function drawFullscreen() {
  const m = media[currentMediaIndex];
  const url = URL.createObjectURL(m.blob);

  fullscreenImg.src = url;
}

document.getElementById('closeFullscreen').onclick = () =>
  fullscreen.classList.remove('active');

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

  isEditing = true;
  allowSwipeClose = false;
  setEditable(true);

  modal.classList.add('active');
};

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
document.getElementById('save').onclick = async () => {
  if (!titleEl.value.trim()) return;

  await saveNote({
    id: currentId,
    title: titleEl.value,
    text: textEl.value,
    mediaIds
  });

  modal.classList.remove('active');
  renderNotes();
};

/* =========================
   DELETE
========================= */
document.getElementById('delete').onclick = async () => {
  await deleteNote(currentId);
  modal.classList.remove('active');
  renderNotes();
};

/* =========================
   INIT
========================= */
openDB().then(renderNotes);