import {
  openDB,
  getAllNotes,
  saveNote,
  deleteNote,
  saveMedia,
  getMediaByIds,
  deleteMedia
} from './db.js';

let notes = [];
let currentId = null;
let media = [];
let mediaIds = [];
let currentMediaIndex = 0;

const notesEl = document.getElementById('notes');
const modal = document.getElementById('modal');
const titleEl = document.getElementById('title');
const textEl = document.getElementById('text');
const mediaInput = document.getElementById('mediaInput');
const track = document.getElementById('mediaTrack');
const indicator = document.getElementById('mediaIndicator');
const fullscreen = document.getElementById('fullscreen');
const fullscreenContent = document.getElementById('fullscreenContent');

const openModal = () => modal.classList.remove('hidden');
const closeModal = () => modal.classList.add('hidden');

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

async function openNote(note) {
  currentId = note.id;
  titleEl.value = note.title;
  textEl.value = note.text;
  mediaIds = note.mediaIds || [];
  media = await getMediaByIds(mediaIds);
  renderMedia();
  openModal();
}

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
      const v = document.createElement('video');
      v.src = url;
      v.controls = true;
      item.appendChild(v);
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

function openFullscreen(index) {
  fullscreenContent.innerHTML = '';
  const m = media[index];
  const url = URL.createObjectURL(m.blob);

  if (m.type.startsWith('video')) {
    const v = document.createElement('video');
    v.src = url;
    v.controls = true;
    v.autoplay = true;
    fullscreenContent.appendChild(v);
  } else {
    const img = document.createElement('img');
    img.src = url;
    fullscreenContent.appendChild(img);
  }

  fullscreen.classList.remove('hidden');
}

document.getElementById('closeFullscreen').onclick = () => {
  fullscreen.classList.add('hidden');
  fullscreenContent.innerHTML = '';
};

document.getElementById('openAdd').onclick = () => {
  currentId = Date.now();
  titleEl.value = '';
  textEl.value = '';
  media = [];
  mediaIds = [];
  renderMedia();
  openModal();
};

document.getElementById('closeModal').onclick = closeModal;

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

document.getElementById('save').onclick = async () => {
  if (!titleEl.value.trim()) return;

  await saveNote({
    id: currentId,
    title: titleEl.value,
    text: textEl.value,
    mediaIds,
    createdAt: Date.now()
  });

  closeModal();
  renderNotes();
};

document.getElementById('delete').onclick = async () => {
  if (!currentId) return;
  if (!confirm('Удалить заметку?')) return;

  for (const id of mediaIds) {
    await deleteMedia(id);
  }

  await deleteNote(currentId);
  closeModal();
  renderNotes();
};

openDB().then(renderNotes);