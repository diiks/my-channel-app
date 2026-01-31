import { openDB, getAllNotes, saveNote, deleteNote } from './db.js';

/* =========================
   STATE
========================= */
let notes = [];
let currentNote = null;
let isEditing = false;
let media = [];
let currentMediaIndex = 0;

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
const setEditable = value => {
  titleEl.disabled = !value;
  textEl.disabled = !value;
};

/* =========================
   RENDER NOTES
========================= */
async function renderNotes() {
  notes = await getAllNotes();
  notesEl.innerHTML = '';

  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'note';
    div.textContent = note.title;
    div.onclick = () => openNote(note);
    notesEl.appendChild(div);
  });
}

/* =========================
   MODAL
========================= */
const openModal = () => modal.classList.add('active');
const closeModal = () => modal.classList.remove('active');

/* =========================
   OPEN NOTE
========================= */
function openNote(note) {
  currentNote = note;

  titleEl.value = note.title;
  textEl.value = note.text;

  media = note.media ? [...note.media] : [];
  renderMedia();

  isEditing = false;
  setEditable(false);
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
      item.innerHTML = `<img src="${url}">`;
      item.onclick = () => openFullscreen(url);
    }

    track.appendChild(item);
  });

  updateIndicator();
}

/* =========================
   MEDIA SCROLL
========================= */
track.addEventListener('scroll', () => {
  const width = track.clientWidth;
  currentMediaIndex = Math.round(track.scrollLeft / width);
  updateIndicator();
});

const updateIndicator = () => {
  indicator.textContent = `${currentMediaIndex + 1} / ${media.length}`;
};

/* =========================
   FULLSCREEN
========================= */
const openFullscreen = url => {
  fullscreenImg.src = url;
  fullscreen.classList.add('active');
};

document.getElementById('closeFullscreen').onclick = () =>
  fullscreen.classList.remove('active');

/* =========================
   BUTTONS
========================= */
document.getElementById('openAdd').onclick = () => {
  currentNote = null;
  titleEl.value = '';
  textEl.value = '';
  media = [];
  renderMedia();

  isEditing = true;
  setEditable(true);
  openModal();
};

document.getElementById('close').onclick = closeModal;

document.getElementById('edit').onclick = () => {
  isEditing = true;
  setEditable(true);
  titleEl.focus();
};

document.getElementById('addMedia').onclick = () => {
  if (!isEditing) return;
  mediaInput.click();
};

mediaInput.onchange = async () => {
  for (const file of mediaInput.files) {
    media.push({
      blob: file,
      type: file.type
    });
  }
  mediaInput.value = '';
  renderMedia();
};

/* =========================
   SAVE
========================= */
document.getElementById('save').onclick = async () => {
  if (!titleEl.value.trim()) return;

  const note = {
    id: currentNote?.id,
    title: titleEl.value,
    text: textEl.value,
    media
  };

  await saveNote(note);

  isEditing = false;
  setEditable(false);
  closeModal();
  renderNotes();
};

/* =========================
   DELETE
========================= */
document.getElementById('delete').onclick = async () => {
  if (!currentNote) return;
  await deleteNote(currentNote.id);
  closeModal();
  renderNotes();
};

/* =========================
   INIT
========================= */
openDB().then(renderNotes);