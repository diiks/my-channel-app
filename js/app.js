/* =========================
   STATE
========================= */
let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentId = null;
let isEditing = false;
let media = [];
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

const editBtn = document.getElementById('edit');

/* =========================
   HELPERS
========================= */
function setEditable(value) {
  titleEl.disabled = !value;
  textEl.disabled = !value;
}

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
   MODAL
========================= */
function openModal() {
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  allowSwipeClose = true;
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
  allowSwipeClose = true;
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
      item.innerHTML = `<img src="${url}">`;
      item.onclick = () => openFullscreen(index);
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
  indicator.textContent = `${currentMediaIndex + 1} / ${media.length}`;
}

/* =========================
   FULLSCREEN VIEWER
========================= */
function openFullscreen(index) {
  currentMediaIndex = index;
  fullscreen.classList.add('active');
  renderFullscreen();
}

function renderFullscreen() {
  const file = media[currentMediaIndex];
  const url = URL.createObjectURL(file);

  if (file.type.startsWith('video')) {
    fullscreenImg.outerHTML = `<video id="fullscreenImg" src="${url}" controls autoplay></video>`;
  } else {
    fullscreenImg.src = url;
  }
}

function closeFullscreen() {
  fullscreen.classList.remove('active');
}

/* swipe fullscreen */
let fsStartX = 0;
fullscreen.addEventListener('touchstart', e => {
  fsStartX = e.touches[0].clientX;
});

fullscreen.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - fsStartX;

  if (dx < -50 && currentMediaIndex < media.length - 1) {
    currentMediaIndex++;
    renderFullscreen();
  }

  if (dx > 50 && currentMediaIndex > 0) {
    currentMediaIndex--;
    renderFullscreen();
  }

  if (dx < -120) closeFullscreen();
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
  allowSwipeClose = false;
  setEditable(true);

  openModal();
};

document.getElementById('close').onclick = closeModal;
document.getElementById('closeFullscreen').onclick = closeFullscreen;

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
  allowSwipeClose = false;
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
  allowSwipeClose = true;
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
   SWIPE CLOSE CARD
========================= */
let startX = 0;

card.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

card.addEventListener('touchend', e => {
  if (!allowSwipeClose) return;

  const dx = e.changedTouches[0].clientX - startX;
  if (dx < -80) closeModal();
});

/* =========================
   INIT
========================= */
renderNotes();