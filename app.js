const addBtn = document.getElementById('addBtn');

const topicModal = document.getElementById('topicModal');
const noteModal = document.getElementById('noteModal');

const topicInput = document.getElementById('topicInput');
const noteText = document.getElementById('noteText');

const goToText = document.getElementById('goToText');
const saveNote = document.getElementById('saveNote');

const closeTopic = document.getElementById('closeTopic');
const closeNote = document.getElementById('closeNote');

const notesContainer = document.getElementById('notesContainer');

let notes = JSON.parse(localStorage.getItem('dixNotes')) || [];
let tempTopic = null;
let editingIndex = null;

// гарантированно скрыты при старте
topicModal.classList.add('hidden');
noteModal.classList.add('hidden');

// открыть ввод темы
addBtn.onclick = () => {
  tempTopic = null;
  topicInput.value = '';
  topicModal.classList.remove('hidden');
};

// закрыть тему
closeTopic.onclick = () => {
  topicModal.classList.add('hidden');
};

// подтвердить тему
goToText.onclick = () => {
  if (!topicInput.value.trim()) {
    alert('Введите тему');
    return;
  }
  tempTopic = topicInput.value.trim();
  topicModal.classList.add('hidden');
  noteText.value = '';
  editingIndex = null;
  noteModal.classList.remove('hidden');
};

// закрыть заметку БЕЗ сохранения
closeNote.onclick = () => {
  noteModal.classList.add('hidden');
};

// сохранить заметку
saveNote.onclick = () => {
  if (!noteText.value.trim()) return;

  const note = {
    topic: tempTopic,
    text: noteText.value,
    date: new Date().toLocaleDateString()
  };

  notes.push(note);
  localStorage.setItem('dixNotes', JSON.stringify(notes));
  renderNotes();
  noteModal.classList.add('hidden');
};

// рендер
function renderNotes() {
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => {
    const div = document.createElement('div');
    div.className = 'note-preview';
    div.innerHTML = `<span>${note.date}</span>${note.topic}`;
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

renderNotes();