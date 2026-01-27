const addBtn = document.getElementById('addBtn');
const topicModal = document.getElementById('topicModal');
const noteModal = document.getElementById('noteModal');

const topicInput = document.getElementById('topicInput');
const noteText = document.getElementById('noteText');
const searchInput = document.getElementById('search');

const goToText = document.getElementById('goToText');
const saveNote = document.getElementById('saveNote');
const closeTopic = document.getElementById('closeTopic');
const closeNote = document.getElementById('closeNote');
const deleteNoteBtn = document.getElementById('deleteNote');

const notesContainer = document.getElementById('notesContainer');

let notes = JSON.parse(localStorage.getItem('dixNotes')) || [];
let tempTopic = '';
let editingIndex = null;

topicModal.classList.add('hidden');
noteModal.classList.add('hidden');

addBtn.onclick = () => {
  topicInput.value = '';
  topicModal.classList.remove('hidden');
};

closeTopic.onclick = () => topicModal.classList.add('hidden');

goToText.onclick = () => {
  if (!topicInput.value.trim()) return alert('Введите тему');
  tempTopic = topicInput.value.trim();
  topicModal.classList.add('hidden');
  noteText.value = '';
  editingIndex = null;
  noteModal.classList.remove('hidden');
};

closeNote.onclick = () => noteModal.classList.add('hidden');

saveNote.onclick = () => {
  if (!noteText.value.trim()) return;

  if (editingIndex !== null) {
    notes[editingIndex].text = noteText.value;
  } else {
    notes.push({
      topic: tempTopic,
      text: noteText.value,
      date: new Date().toLocaleDateString()
    });
  }

  localStorage.setItem('dixNotes', JSON.stringify(notes));
  noteModal.classList.add('hidden');
  renderNotes();
};

function deleteNote() {
  if (editingIndex === null) return;
  notes.splice(editingIndex, 1);
  localStorage.setItem('dixNotes', JSON.stringify(notes));
  noteModal.classList.add('hidden');
  renderNotes();
}

function renderNotes(filter = '') {
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => {
    if (
      !note.topic.toLowerCase().includes(filter) &&
      !note.text.toLowerCase().includes(filter)
    ) return;

    const div = document.createElement('div');
    div.className = 'note-preview';
    div.innerHTML = `<div class="date">${note.date}</div>${note.topic}`;
    div.onclick = () => openNote(index);
    notesContainer.appendChild(div);
  });
}

function openNote(index) {
  editingIndex = index;
  tempTopic = notes[index].topic;
  noteText.value = notes[index].text;
  noteModal.classList.remove('hidden');
}

searchInput.oninput = e => {
  renderNotes(e.target.value.toLowerCase());
};

renderNotes();