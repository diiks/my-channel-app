// === Элементы DOM ===
const addPostBtn = document.getElementById('addPost');
const themeModal = document.getElementById('themeModal');
const closeThemeModal = document.getElementById('closeThemeModal');
const confirmTopic = document.getElementById('confirmTopic');
const noteTopic = document.getElementById('noteTopic');
const noteFolderSelect = document.getElementById('noteFolder');
const folderSelect = document.getElementById('folderSelect');
const addFolderBtn = document.getElementById('addFolder');
const editFolderBtn = document.getElementById('editFolder');
const deleteFolderBtn = document.getElementById('deleteFolder');

const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const saveNoteBtn = document.getElementById('saveNote');
const noteText = document.getElementById('noteText');
const notesContainer = document.getElementById('notesContainer');
const addLinkBtn = document.getElementById('addLink');
const addMediaBtn = document.getElementById('addMedia');
const fileInput = document.getElementById('fileInput');
const modalDate = document.getElementById('modalDate');

// === Данные ===
let notes = JSON.parse(localStorage.getItem('dixNotes')) || [];
let folders = JSON.parse(localStorage.getItem('dixFolders')) || ['Без категории'];
let editingIndex = null;
let tempTopic = '';
let tempFolder = 'Без категории';

// === Инициализация ===
renderFolders();
renderNotes();

// === Функции рендера ===
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

// === Папки ===
addFolderBtn.addEventListener('click', () => {
  const name = prompt('Название новой папки:');
  if (!name || folders.includes(name)) return alert('Неверное имя!');
  folders.push(name);
  localStorage.setItem('dixFolders', JSON.stringify(folders));
  renderFolders();
  renderNotes();
});

editFolderBtn.addEventListener('click', () => {
  const oldName = folderSelect.value;
  const newName = prompt('Новое имя папки:', oldName);
  if (!newName || folders.includes(newName)) return alert('Неверное имя!');
  folders = folders.map(f => f === oldName ? newName : f);
  notes = notes.map(n => n.folder === oldName ? {...n, folder: newName} : n);
  localStorage.setItem('dixFolders', JSON.stringify(folders));
  localStorage.setItem('dixNotes', JSON.stringify(notes));
  renderFolders();
  renderNotes();
});

deleteFolderBtn.addEventListener('click', () => {
  const name = folderSelect.value;
  if (name === 'Без категории') return alert('Эту папку нельзя удалить!');
  if (!confirm(`Удалить папку "${name}" и все заметки в ней?`)) return;
  folders = folders.filter(f => f !== name);
  notes = notes.filter(n => n.folder !== name);
  localStorage.setItem('dixFolders', JSON.stringify(folders));
  localStorage.setItem('dixNotes', JSON.stringify(notes));
  renderFolders();
  renderNotes();
});

// === Кнопка "+" открывает только окно темы ===
addPostBtn.addEventListener('click', () => {
  noteTopic.value = '';
  noteFolderSelect.value = folderSelect.value;
  themeModal.classList.remove('hidden'); // открываем тему
});

// === Закрытие темы крестиком ===
closeThemeModal.addEventListener('click', () => {
  themeModal.classList.add('hidden'); // закрываем без сохранения
});

// === Подтверждение темы ===
confirmTopic.addEventListener('click', () => {
  if (!noteTopic.value.trim()) return alert('Введите тему!');
  tempTopic = noteTopic.value.trim();
  tempFolder = noteFolderSelect.value;
  themeModal.classList.add('hidden');
  openModal(); // открываем окно текста/медиа
});

// === Модальное окно текста/медиа ===
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

// === Закрытие окна текста крестиком (не сохраняем) ===
closeModal.addEventListener('click', () => {
  modalOverlay.classList.add('hidden'); // только закрываем
});

// === Сохранение заметки ===
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
  renderNotes();
  modalOverlay.classList.add('hidden'); // закрываем после сохранения
});

// === Ссылки и медиа ===
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

// === Фильтр по папкам ===
folderSelect.addEventListener('change', renderNotes);