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
function open