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

/* ОТКРЫТЬ СОЗДАНИЕ */
openCreate.onclick = () => {
  currentIndex = null;
  noteTitle.value = '';
  noteText.value = '';
  createModal.classList.remove('hidden');
};

closeCreate.onclick = () => {
  createModal.classList.add('hidden');
};

/* СОХРАНИТЬ */
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
    if (
      !n.title.toLowerCase().includes(q) &&
      !n.text.toLowerCase().includes(q)
    ) return;

    const div = document.createElement('div');
    div.className = 'note-preview';
    div.textContent = n.title;

    div.onclick = () => {
      viewTitle.textContent = n.title;
      viewText.textContent = n.text;
      viewModal.classList.remove('hidden');
      currentIndex = i;
    };

    notesEl.appendChild(div);
  });
}

closeView.onclick = () => viewModal.classList.add('hidden');

editNote.onclick = () => {
  viewModal.classList.add('hidden');
  noteTitle.value = notes[currentIndex].title;
  noteText.value = notes[currentIndex].text;
  createModal.classList.remove('hidden');
};

search.oninput = renderNotes;

renderNotes();