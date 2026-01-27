const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const saveNote = document.getElementById('saveNote');
const modal = document.getElementById('noteModal');
const noteText = document.getElementById('noteText');
const notesContainer = document.getElementById('notes');
const mediaInput = document.getElementById('mediaInput');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

/* ===== ОТКРЫТЬ / ЗАКРЫТЬ ===== */
openModal.onclick = () => {
  modal.classList.remove('hidden');
};

closeModal.onclick = () => {
  modal.classList.add('hidden');
  noteText.value = '';
};

/* ===== СОХРАНИТЬ ===== */
saveNote.onclick = () => {
  if (!noteText.value.trim()) return;

  notes.unshift({
    text: noteText.value,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();

  noteText.value = '';
  modal.classList.add('hidden');
};

/* ===== ГАЛЕРЕЯ ===== */
mediaInput.onchange = () => {
  const file = mediaInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    noteText.value += `\n[image:${reader.result}]\n`;
  };
  reader.readAsDataURL(file);
};

/* ===== РЕНДЕР ===== */
function renderNotes() {
  notesContainer.innerHTML = '';

  notes.forEach(note => {
    const div = document.createElement('div');
    div.className = 'note-preview';

    let content = note.text.replace(
      /\[image:(.*?)\]/g,
      '<img src="$1" style="width:100%;border-radius:16px;margin-top:10px;">'
    );

    div.innerHTML = `
      <div class="date">${note.date}</div>
      <div>${content}</div>
    `;

    notesContainer.appendChild(div);
  });
}

renderNotes();