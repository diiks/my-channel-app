/* =========================
   STATE
========================= */
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentId = null;
let media = [];

/* =========================
   ELEMENTS
========================= */
const notesEl = document.getElementById('notes');

const modal = document.getElementById('modal');
const fullscreen = document.getElementById('fullscreen');

const titleEl = document.getElementById('title');
const textEl = document.getElementById('text');

const mediaInput = document.getElementById('mediaInput');
const track = document.getElementById('mediaTrack');
const indicator = document.getElementById('mediaIndicator');

const fullscreenImg = document.getElementById('fullscreenImg');

/* =========================
   RENDER NOTES
========================= */
function renderNotes() {
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
   OPEN / CLOSE MODAL
========================= */
function openModal() {
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
}

/* =========================
   OPEN NOTE
========================= */
function openNote(note) {
  currentId = note.id;
  titleEl.value = note.title;
  textEl.value = note.text;

  // media пока не восстанавливаем из localStorage
  media = [];
  renderMedia();

  openModal();
}

/* =========================
   MEDIA (только в памяти)
========================= */
function renderMedia() {
  track.innerHTML = '';
  indicator.textContent = media.length ? `1 / ${media.length}` : '';

  media.forEach(file => {
    const url = URL.createObjectURL(file);
    const div = document.createElement('div');
    div.className = 'media-item';
    div.innerHTML = `<img src="${url}">`;
    div.onclick = () => openFullscreen(url);
    track.appendChild(div);
  });
}

/* =========================
   FULLSCREEN
========================= */
function openFullscreen(url) {
  fullscreenImg.src = url;
  fullscreen.classList.add('active');
}

function closeFullscreen() {
  fullscreen.classList.remove('active');
}

/* =========================
   BUTTONS
========================= */
document.getElementById('openAdd').onclick = () => {
  currentId = null;
  titleEl.value = '';
  textEl.value = '';
  media = [];
  renderMedia();
  openModal();
};

document.getElementById('close').onclick = closeModal;
document.getElementById('closeFullscreen').onclick = closeFullscreen;

document.getElementById('addMedia').onclick = () => {
  mediaInput.click();
};

mediaInput.onchange = () => {
  media.push(...mediaInput.files);
  renderMedia();
};

/* =========================
   SAVE (🔥 ИСПРАВЛЕНО)
========================= */
document.getElementById('save').onclick = () => {
  if (!titleEl.value.trim()) return;

  if (!currentId) {
    currentId = Date.now();
  }

  const note = {
    id: currentId,
    title: titleEl.value,
    text: textEl.value
    // ❗ media НЕ сохраняем в localStorage
  };

  notes = notes.filter(n => n.id !== currentId);
  notes.unshift(note);

  localStorage.setItem('notes', JSON.stringify(notes));

  closeModal();
  renderNotes();
};

/* =========================
   DELETE
========================= */
document.getElementById('delete').onclick = () => {
  if (!currentId) return;

  notes = notes.filter(n => n.id !== currentId);
  localStorage.setItem('notes', JSON.stringify(notes));

  closeModal();
  renderNotes();
};

/* =========================
   INIT
========================= */
renderNotes();