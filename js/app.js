/* =========================
   STATE
========================= */
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentId = null;
let isEditing = false;

let media = [];
let currentMediaIndex = 0;

/* fullscreen state */
let scale = 1;
let lastScale = 1;
let startDist = 0;
let posX = 0;
let posY = 0;
let startX = 0;
let startY = 0;
let lastTap = 0;

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
const fullscreenImg = document.getElementById('fullscreenImg');
const closeFullscreenBtn = document.getElementById('closeFullscreen');

const editBtn = document.getElementById('edit');

/* =========================
   HELPERS
========================= */
function setEditable(value) {
  titleEl.disabled = !value;
  textEl.disabled = !value;
}

/* =========================
   RENDER NOTES GRID
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
      const img = document.createElement('img');
      img.src = url;
      img.onclick = () => openFullscreen(index);
      item.appendChild(img);
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

function updateIndicator() {
  indicator.textContent = media.length
    ? `${currentMediaIndex + 1} / ${media.length}`
    : '';
}

/* =========================
   FULLSCREEN OPEN / CLOSE
========================= */
function openFullscreen(index) {
  currentMediaIndex = index;
  fullscreenImg.src = URL.createObjectURL(media[index]);
  fullscreen.classList.add('active');
  resetFullscreenTransform();
}

function closeFullscreen() {
  fullscreen.classList.remove('active');
  resetFullscreenTransform();
}

closeFullscreenBtn.onclick = closeFullscreen;

/* =========================
   FULLSCREEN TRANSFORM
========================= */
function applyTransform() {
  fullscreenImg.style.transform =
    `translate(${posX}px, ${posY}px) scale(${scale})`;
}

function resetFullscreenTransform() {
  scale = 1;
  posX = 0;
  posY = 0;
  fullscreenImg.style.transform = '';
  closeFullscreenBtn.style.opacity = '1';
}

/* =========================
   FULLSCREEN GESTURES
========================= */
fullscreen.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    startDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    lastScale = scale;
  }

  if (e.touches.length === 1) {
    startX = e.touches[0].clientX - posX;
    startY = e.touches[0].clientY - posY;
  }
});

fullscreen.addEventListener('touchmove', e => {
  if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    scale = Math.min(Math.max(1, lastScale * (dist / startDist)), 4);
    applyTransform();
    closeFullscreenBtn.style.opacity = scale > 1 ? '0' : '1';
    return;
  }

  if (e.touches.length === 1 && scale > 1) {
    posX = e.touches[0].clientX - startX;
    posY = e.touches[0].clientY - startY;
    applyTransform();
  }
});

fullscreen.addEventListener('touchend', e => {
  const now = Date.now();
  if (now - lastTap < 300) {
    scale = scale === 1 ? 2 : 1;
    posX = 0;
    posY = 0;
    applyTransform();
  }
  lastTap = now;
});

/* =========================
   SWIPE DOWN TO CLOSE
========================= */
let startY = 0;

fullscreen.addEventListener('touchstart', e => {
  if (scale === 1) startY = e.touches[0].clientY;
});

fullscreen.addEventListener('touchend', e => {
  if (scale !== 1) return;
  const dy = e.changedTouches[0].clientY - startY;
  if (dy > 120) closeFullscreen();
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

/* =========================
   EDIT
========================= */
editBtn.onclick = () => {
  isEditing = true;
  setEditable(true);
  titleEl.focus();
};

/* =========================
   SAVE
========================= */
document.getElementById('save').onclick = () => {
  if (!titleEl.value.trim()) return;

  if (!currentId) currentId = Date.now();

  const note = {
    id: currentId,
    title: titleEl.value,
    text: textEl.value,
    media: media
  };

  notes = notes.filter(n => n.id !== currentId);
  notes.unshift(note);

  localStorage.setItem('notes', JSON.stringify(notes));

  isEditing = false;
  setEditable(false);

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