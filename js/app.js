let notes = [];
let currentId = null;
let media = [];
let index = 0;

const modal = document.getElementById('modal');
const card = document.getElementById('card');
const notesEl = document.getElementById('notes');

const titleEl = document.getElementById('title');
const textEl = document.getElementById('text');
const mediaInput = document.getElementById('mediaInput');
const track = document.getElementById('mediaTrack');
const indicator = document.getElementById('mediaIndicator');

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

function openNote(n) {
  currentId = n.id;
  titleEl.value = n.title;
  textEl.value = n.text;
  media = n.media || [];
  renderMedia();
  modal.classList.add('active');
}

function renderMedia() {
  track.innerHTML = '';
  index = 0;

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
    ? `${index + 1} / ${media.length}`
    : '';
}

document.getElementById('addMedia').onclick = () => mediaInput.click();

mediaInput.onchange = () => {
  for (const f of mediaInput.files) media.push(f);
  renderMedia();
};

document.getElementById('save').onclick = () => {
  if (!titleEl.value) return;
  if (!currentId) currentId = Date.now();

  const note = {
    id: currentId,
    title: titleEl.value,
    text: textEl.value,
    media
  };

  notes = notes.filter(n => n.id !== currentId);
  notes.push(note);

  localStorage.setItem('notes', JSON.stringify(notes));
  modal.classList.remove('active');
  renderNotes();
};

document.getElementById('delete').onclick = () => {
  notes = notes.filter(n => n.id !== currentId);
  localStorage.setItem('notes', JSON.stringify(notes));
  modal.classList.remove('active');
  renderNotes();
};

document.getElementById('close').onclick = () =>
  modal.classList.remove('active');

document.querySelector('.add-btn').onclick = () => {
  currentId = null;
  titleEl.value = '';
  textEl.value = '';
  media = [];
  renderMedia();
  modal.classList.add('active');
};

notes = JSON.parse(localStorage.getItem('notes') || '[]');
renderNotes();