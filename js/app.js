/* =========================
   STATE
========================= */
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentId = null;
let isEditing = false;

let media = [];
let currentMediaIndex = 0;

/* =========================
   ELEMENTS
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

/* =========================
   HELPERS
========================= */
function setEditable(v) {
  titleEl.disabled = !v;
  textEl.disabled = !v;
}

/* =========================
   RENDER NOTES
========================= */
function renderNotes() {
  notesEl.innerHTML = '';
  notes.forEach(note => {
    const d = document.createElement('div');
    d.className = 'note';
    d.textContent = note.title;
    d.onclick = () => openNote(note);
    notesEl.appendChild(d);
  });
}

/* =========================
   MODAL
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

  media = note.media || [];
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

  media.forEach((file, index) => {
    const url = URL.createObjectURL(file);
    const item = document.createElement('div');
    item.className = 'media-item';

    if (file.type.startsWith('video')) {
      item.innerHTML = `<video src="${url}" controls></video>`;
    } else {
      item.innerHTML = `<img src="${url}" draggable="false">`;
      item.onclick = () => openFullscreen(index);
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
  indicator.textContent = `${currentMediaIndex + 1} / ${media.length}`;
}

/* =========================
   FULLSCREEN
========================= */
function openFullscreen(index) {
  currentMediaIndex = index;
  showFullscreen();
  fullscreen.classList.add('active');
}

function showFullscreen() {
  const file = media[currentMediaIndex];
  const url = URL.createObjectURL(file);

  fullscreen.innerHTML = `
    <button class="close-x" id="closeFullscreen">✖</button>
    ${
      file.type.startsWith('video')
        ? `<video src="${url}" controls autoplay></video>`
        : `<img src="${url}">`
    }
  `;

  document.getElementById('closeFullscreen').onclick = closeFullscreen;
}

function closeFullscreen() {
  fullscreen.classList.remove('active');
  fullscreen.innerHTML = '';
}

/* =========================
   FULLSCREEN SWIPE
========================= */
let fsX = 0;
let fsY = 0;

fullscreen.addEventListener('touchstart', e => {
  fsX = e.touches[0].clientX;
  fsY = e.touches[0].clientY;
});

fullscreen.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - fsX;
  const dy = e.changedTouches[0].clientY - fsY;

  if (dy > 80) {
    closeFullscreen();
    return;
  }

  if (dx < -60 && currentMediaIndex < media.length - 1) {
    currentMediaIndex++;
    showFullscreen();
  }

  if (dx > 60 && currentMediaIndex > 0) {
    currentMediaIndex--;
    showFullscreen();
  }
});

/* =========================
   BUTTONS
========================= */
document.getElementById('openAdd').onclick = () => {
  currentId = null;
  titleEl.value = '';
  textEl.value = '';
  media = [];

  renderMedia();
  isEditing = true;
  setEditable(true);
  openModal();
};

document.getElementById('close').onclick = closeModal;

document.getElementById('addMedia').onclick = () => {
  if (!isEditing) return;
  mediaInput.click();
};

mediaInput.onchange = () => {
  media.push(...mediaInput.files);
  mediaInput.value = '';
  renderMedia();
};

document.getElementById('edit').onclick = () => {
  isEditing = true;
  setEditable(true);
};

document.getElementById('save').onclick = () => {
  if (!titleEl.value.trim()) return;

  const note = {
    id: currentId || Date.now(),
    title: titleEl.value,
    text: textEl.value,
    media
  };

  notes = notes.filter(n => n.id !== note.id);
  notes.unshift(note);
  localStorage.setItem('notes', JSON.stringify(notes));

  isEditing = false;
  setEditable(false);
  closeModal();
  renderNotes();
};

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