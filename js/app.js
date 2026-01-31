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
   MEDIA INDICATOR
========================= */
track.addEventListener('scroll', () => {
  const width = track.clientWidth;
  currentMediaIndex = Math.round(track.scrollLeft / width);
  updateIndicator();
});

function updateIndicator() {
  if (!media.length) {
    indicator.textContent = '';
    return;
  }
  indicator.textContent = `${currentMediaIndex + 1} / ${media.length}`;
}

/* =========================
   FULLSCREEN
========================= */
function openFullscreen(index) {
  currentMediaIndex = index;
  fullscreenImg.src = URL.createObjectURL(media[currentMediaIndex]);
  fullscreen.classList.add('active');
  updateIndicator();
}

function closeFullscreen() {
  fullscreen.classList.remove('active');
  fullscreenImg.src = '';
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

  isEditing = true;
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
document.getElementById('edit').onclick = () => {
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
    media
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
   SWIPE TO CLOSE NOTE
========================= */
let startX = 0;
let startTarget = null;

card.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  startTarget = e.target;
});

card.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;

  if (startTarget.closest('.media-track')) return;

  if (dx < -80) {
    closeModal();
  }
});

/* =========================
   STEP 6: FULLSCREEN SWIPE NAV
========================= */
let fsStartX = 0;

fullscreen.addEventListener('touchstart', e => {
  fsStartX = e.touches[0].clientX;
});

fullscreen.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - fsStartX;

  if (Math.abs(dx) < 60) return;

  if (dx < 0) {
    // next
    if (currentMediaIndex < media.length - 1) {
      currentMediaIndex++;
      fullscreenImg.src = URL.createObjectURL(media[currentMediaIndex]);
      updateIndicator();
    } else {
      closeFullscreen();
    }
  } else {
    // prev
    if (currentMediaIndex > 0) {
      currentMediaIndex--;
      fullscreenImg.src = URL.createObjectURL(media[currentMediaIndex]);
      updateIndicator();
    } else {
      closeFullscreen();
    }
  }
});

/* =========================
   INIT
========================= */
renderNotes();