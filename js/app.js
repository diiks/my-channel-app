import { openDB, getAllNotes, saveNote, deleteNote } from './db.js';
import { initMediaViewer } from './media.js';

let currentId = null;
let mediaArr = [];
let editing = true;

const modal = document.getElementById('modal');
const notesEl = document.getElementById('notes');
const titleInput = document.getElementById('title');
const textInput = document.getElementById('text');
const mediaInput = document.getElementById('media');
const mediaTrack = document.getElementById('mediaTrack');
const indicator = document.getElementById('mediaIndicator');

const viewer = initMediaViewer(mediaTrack, indicator);

/* OPEN */
document.querySelector('.add-btn').onclick = () => {
  currentId = null;
  mediaArr = [];
  titleInput.value = '';
  textInput.value = '';
  viewer.render(mediaArr);
  modal.classList.add('active');
};

/* MEDIA */
document.getElementById('addMedia').onclick = () => mediaInput.click();

mediaInput.onchange = () => {
  for (const f of mediaInput.files) {
    mediaArr.push({ type: f.type, blob: f });
  }
  viewer.render(mediaArr);
};

/* SAVE */
document.getElementById('save').onclick = async () => {
  if (!titleInput.value.trim()) return;

  await saveNote({
    id: currentId,
    title: titleInput.value,
    text: textInput.value,
    media: mediaArr
  });

  modal.classList.remove('active');
  render();
};

/* DELETE */
document.getElementById('delete').onclick = async () => {
  if (currentId !== null) {
    await deleteNote(currentId);
    modal.classList.remove('active');
    render();
  }
};

/* EDIT */
document.getElementById('edit').onclick = () => {
  textInput.focus();
};

/* CLOSE */
document.getElementById('close').onclick = () =>
  modal.classList.remove('active');

/* RENDER */
async function render(filter = '') {
  const notes = await getAllNotes();
  notesEl.innerHTML = '';

  notes.forEach(n => {
    if (
      n.title.toLowerCase().includes(filter) ||
      n.text.toLowerCase().includes(filter)
    ) {
      const d = document.createElement('div');
      d.className = 'note';
      d.textContent = n.title;
      d.onclick = () => openNote(n);
      notesEl.appendChild(d);
    }
  });
}

function openNote(n) {
  currentId = n.id;
  titleInput.value = n.title;
  textInput.value = n.text;
  mediaArr = n.media || [];
  viewer.render(mediaArr);
  modal.classList.add('active');
}

document.getElementById('search').oninput = e =>
  render(e.target.value.toLowerCase());

openDB().then(render);