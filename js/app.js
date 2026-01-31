let notes = JSON.parse(localStorage.getItem('notes') || '[]');
let currentId = null;
let media = [];
let mediaIndex = 0;

/* ELEMENTS */
const modal = document.getElementById('modal');
const card = document.getElementById('card');
const notesEl = document.getElementById('notes');

const titleEl = document.getElementById('title');
const textEl = document.getElementById('text');

const mediaInput = document.getElementById('mediaInput');
const track = document.getElementById('mediaTrack');
const indicator = document.getElementById('mediaIndicator');

const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = document.getElementById('fullscreenImg');

/* RENDER NOTES */
function renderNotes() {
  notesEl.innerHTML = '';
  notes.forEach(n => {
    const d = document.createElement('div');
    d.className = 'note';
    d.textContent = n.title;
    d.onclick = () => openNote(n);
    notesEl.appendChild(d);
  });
}

/* OPEN NOTE */
function openNote(n) {
  currentId = n.id;
  titleEl.value = n.title;
  textEl.value = n.text;
  media = n.media || [];
  renderMedia();
  modal.classList.remove('hidden');
}

/* MEDIA */
function renderMedia() {
  track.innerHTML = '';
  mediaIndex = 0;

  media.forEach(m => {
    const div = document.createElement('div');
    div.className = 'media-item';
    const url = URL.createObjectURL(m);
    div.innerHTML = `<img src="${url}">`;
    div.onclick = () => openFullscreen(url);
    track.appendChild(div);
  });

  updateIndicator();
}

function updateIndicator() {
  indicator.textContent = media.length
    ? `${mediaIndex + 1} / ${media.length}`
    : '';
}

/* FULLSCREEN */
function openFullscreen(url) {
  fullscreenImg.src = url;
  fullscreen.classList.remove('hidden');
}

fullscreen.onclick = () => fullscreen.classList.add('hidden');

/* BUTTONS */
document.getElementById('addMedia').onclick = () => mediaInput.click();

mediaInput.onchange = () => {
  media.push(...mediaInput.files);
  renderMedia();
};

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
  modal.classList.add('hidden');
  renderNotes();
};

document.getElementById('delete').onclick = () => {
  notes = notes.filter(n => n.id !== currentId);
  localStorage.setItem('notes', JSON.stringify(notes));
  modal.classList.add('hidden');
  renderNotes();
};

document.getElementById('close').onclick = () =>
  modal.classList.add('hidden');

document.getElementById('openAdd').onclick = () => {
  currentId = null;
  titleEl.value = '';
  textEl.value = '';
  media = [];
  renderMedia();
  modal.classList.remove('hidden');
};

renderNotes();