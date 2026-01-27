const addPostBtn = document.getElementById('addPost');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const saveNoteBtn = document.getElementById('saveNote');
const noteText = document.getElementById('noteText');
const notesContainer = document.getElementById('notesContainer');
const addLinkBtn = document.getElementById('addLink');
const addMediaBtn = document.getElementById('addMedia');
const fileInput = document.getElementById('fileInput');
const modalDate = document.getElementById('modalDate');

let notes = JSON.parse(localStorage.getItem('dixNotes')) || [];
let editingIndex = null;

function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => {
    const div = document.createElement('div');
    div.className = 'note-preview';
    div.innerHTML = `<span class="date">${note.date}</span>${note.text}`;
    div.addEventListener('click', () => openModal(index));
    notesContainer.appendChild(div);
  });
}

function openModal(index=null) {
  modalOverlay.classList.remove('hidden');
  if (index !== null) {
    noteText.value = notes[index].text;
    editingIndex = index;
    modalDate.textContent = notes[index].date;
  } else {
    noteText.value = '';
    editingIndex = null;
    const today = new Date();
    modalDate.textContent = today.toLocaleDateString();
  }
}

closeModal.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

saveNoteBtn.addEventListener('click', () => {
  const text = noteText.value.trim();
  if (!text) return;
  const date = modalDate.textContent;
  if (editingIndex !== null) {
    notes[editingIndex].text = text;
    notes[editingIndex].date = date;
  } else {
    notes.push({ text, date });
  }
  localStorage.setItem('dixNotes', JSON.stringify(notes));
  modalOverlay.classList.add('hidden');
  renderNotes();
});

addPostBtn.addEventListener('click', () => openModal());

addLinkBtn.addEventListener('click', () => {
  const url = prompt('Вставьте ссылку (URL):');
  if (url) noteText.value += ` ${url}`;
});

addMediaBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
  const files = event.target.files;
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      noteText.value += ` ${url}`;
    } else if (file.type === 'application/pdf') {
      noteText.value += ` [PDF] ${file.name}`;
    }
  });
});

renderNotes();