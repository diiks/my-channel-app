const notesEl = document.getElementById('notes');
const search = document.getElementById('search');

const createModal = document.getElementById('createModal');
const viewModal = document.getElementById('viewModal');

const noteTitle = document.getElementById('noteTitle');
const noteText = document.getElementById('noteText');

const viewTitle = document.getElementById('viewTitle');
const viewText = document.getElementById('viewText');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentIndex = null;

/* ОТКРЫТИЕ СОЗДАНИЯ */
openCreate.onclick = () => {
  currentIndex = null;
  noteTitle.value = '';
  noteText.value = '';
  createModal.classList.remove('hidden');
};

closeCreate.onclick = () => {
  createModal.classList.add('hidden');
};

/* СОХРАНЕНИЕ */
saveNote.onclick = () => {
  if (!noteTitle.value.trim()) return;

  const data = {
    title: noteTitle.value,
    text: noteText.value
  };

  if (currentIndex !== null) {
    notes[currentIndex] = data;
  } else {
    notes.unshift(data);
  }

  localStorage.setItem('notes', JSON.stringify(notes));
  createModal.classList.add('hidden');
  renderNotes();
};

/* РЕНДЕР */
function renderNotes() {
  notesEl.innerHTML = '';
  const q = search.value.toLowerCase();

  notes.forEach((n, i) => {
    if (!n.title.toLowerCase().includes(q) &&
        !n.text.toLowerCase().includes(q)) return;

    const div = document.createElement('div');
    div.className = 'note-preview';
    div.textContent = n.title;

    div.onclick = () => {
      viewText.textContent = n.text;   // БОЛЬШОЙ
      viewTitle.textContent = n.title; // МАЛЕНЬКИЙ
      viewModal.classList.remove('hidden');
      currentIndex = i;
    };

    notesEl.appendChild(div);
  });
}

/* ПРОСМОТР */
closeView.onclick = () => {
  viewModal.classList.add('hidden');
  currentIndex = null;
};

editNote.onclick = () => {
  noteTitle.value = notes[currentIndex].title;
  noteText.value = notes[currentIndex].text;
  viewModal.classList.add('hidden');
  createModal.classList.remove('hidden');
};

deleteNote.onclick = () => {
  if (!confirm('Удалить заметку?')) return;
  notes.splice(currentIndex, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  viewModal.classList.add('hidden');
  currentIndex = null;
  renderNotes();
};

search.oninput = renderNotes;

renderNotes();