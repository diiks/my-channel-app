const addPostBtn = document.getElementById('addPost');
const themeModal = document.getElementById('themeModal');
const closeThemeModal = document.getElementById('closeThemeModal');
const confirmTopic = document.getElementById('confirmTopic');
const noteTopic = document.getElementById('noteTopic');
const noteFolderSelect = document.getElementById('noteFolder');
const folderSelect = document.getElementById('folderSelect');

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
let folders = JSON.parse(localStorage.getItem('dixFolders')) || ['Без категории'];
let editingIndex = null;
let tempTopic = '';
let tempFolder = 'Без категории';

// === Рендер папок ===
function renderFolders() {
  folderSelect.innerHTML = '';
  noteFolderSelect.innerHTML = '';
  folders.forEach(folder => {
    const option1 = document.createElement('option');
    option1.value = folder;
    option1.textContent = folder;
    folderSelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = folder;
    option2.textContent = folder;
    noteFolderSelect.appendChild(option2);
  });
}

// === Рендер заметок ===
function renderNotes() {
  notesContainer.innerHTML = '';
  const currentFolder = folderSelect.value;
  notes.forEach((note, index) => {
    if (note.folder !== currentFolder) return;
    const div = document.createElement('div');
    div.className = 'note-preview';
    div.innerHTML = `<span class="date">${note.date}</span>${note.topic}`;
    div.addEventListener('click', () => openModal(index));
    notesContainer.appendChild(div);
  });
}

// === Открытие темы заметки перед полным модальным окном ===
addPostBtn.addEventListener('click', () => {
  noteTopic.value = '';
  noteFolderSelect.value = folderSelect.value;
  themeModal.classList.remove('hidden');
});

closeThemeModal.addEventListener('click', () => themeModal.classList.add('hidden'));

confirmTopic.addEventListener('click', () => {
  if (!noteTopic.value.trim()) return alert('Введите тему!');
  tempTopic = noteTopic.value.trim();
  tempFolder = noteFolderSelect.value;
  themeModal.classList.add('hidden');
  openModal(); // открываем полное модальное окно для текста
});

// === Модальное окно для текста/медиа ===
function openModal(index=null) {
  modalOverlay.classList.remove('hidden');
  if (index !== null) {
    noteText.value = notes[index].text;
    editingIndex = index;
    tempTopic = notes[index].topic;
    tempFolder = notes[index].folder;
    modalDate.textContent = notes[index].date;
  } else {
    noteText.value = '';
    editingIndex = null;
    const today = new Date();
    modalDate.textContent = today.toLocaleDateString();
  }
}

closeModal.addEventListener('click', () => modalOverlay.classList.add('hidden'));

saveNoteBtn.addEventListener('click', () => {
  const text = noteText.value.trim();
  if (!text) return alert('Напишите заметку!');
  const date = modalDate.textContent;
  if (editingIndex !== null) {
    notes[editingIndex].text = text;
    notes[editingIndex].topic = tempTopic;
    notes[editingIndex].folder = tempFolder;
    notes[editingIndex].date = date;
  } else {
    notes.push({ topic: tempTopic, text, folder: tempFolder, date });
  }
  localStorage.setItem('dixNotes', JSON.stringify(notes));
  modalOverlay.classList.add('hidden');
  renderNotes();
});

// === Работа с ссылками и медиа ===
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

// === Выбор папки для фильтрации ===
folderSelect.addEventListener('change', renderNotes);

// === Инициализация ===
renderFolders();
renderNotes();