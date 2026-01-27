// ЭЛЕМЕНТЫ
const notesEl = document.getElementById('notes');
const search = document.getElementById('search');

const createModal = document.getElementById('createModal');
const viewModal = document.getElementById('viewModal');

const noteTitle = document.getElementById('noteTitle');
const noteText = document.getElementById('noteText');
const noteFolder = document.getElementById('noteFolder');

const viewTitle = document.getElementById('viewTitle');
const viewText = document.getElementById('viewText');

const deleteNoteBtn = document.getElementById('deleteNote');

const folderSelect = document.getElementById('folderSelect');
const addFolderBtn = document.getElementById('addFolderBtn');
const editFolderBtn = document.getElementById('editFolderBtn');
const deleteFolderBtn = document.getElementById('deleteFolderBtn');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let folders = JSON.parse(localStorage.getItem('folders')) || ["Все"];
let currentIndex = null;

/* ИНИЦИАЛИЗАЦИЯ ПАПОК */
function renderFolders() {
  folderSelect.innerHTML = '';
  noteFolder.innerHTML = '';
  folders.forEach(f => {
    const opt1 = document.createElement('option');
    opt1.textContent = f;
    opt1.value = f;
    folderSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.textContent = f;
    opt2.value = f;
    noteFolder.appendChild(opt2);
  });
}
renderFolders();

/* ДОБАВИТЬ ПАПКУ */
addFolderBtn.onclick = () => {
  const name = prompt('Название новой папки:');
  if (!name) return;
  folders.push(name);
  localStorage.setItem('folders', JSON.stringify(folders));
  renderFolders();
};

/* РЕДАКТИРОВАТЬ ПАПКУ */
editFolderBtn.onclick = () => {
  const oldName = folderSelect.value;
  const newName = prompt('Новое имя папки:', oldName);
  if (!newName) return;

  folders = folders.map(f => f === oldName ? newName : f);
  notes.forEach(n => { if(n.folder===oldName) n.folder=newName });
  localStorage.setItem('folders', JSON.stringify(folders));
  localStorage.setItem('notes', JSON.stringify(notes));
  renderFolders();
  renderNotes();
};

/* УДАЛИТЬ ПАПКУ */
deleteFolderBtn.onclick = () => {
  const name = folderSelect.value;
  if(name === "Все") { alert("Папку 'Все' нельзя удалить"); return; }
  if(!confirm(`Удалить папку "${name}" и все заметки в ней?`)) return;
  folders = folders.filter(f => f!==name);
  notes = notes.filter(n=>n.folder!==name);
  localStorage.setItem('folders', JSON.stringify(folders));
  localStorage.setItem('notes', JSON.stringify(notes));
  renderFolders();
  renderNotes();
};

/* ОТКРЫТЬ СОЗДАНИЕ */
openCreate.onclick = () => {
  currentIndex = null;
  noteTitle.value = '';
  noteText.value = '';
  noteFolder.value = folderSelect.value;
  createModal.classList.remove('hidden');
};

/* ЗАКРЫТЬ СОЗДАНИЕ */
closeCreate.onclick = () => createModal.classList.add('hidden');

/* СОХРАНИТЬ ЗАМЕТКУ */
saveNote.onclick = () => {
  if (!noteTitle.value.trim()) return;
  const data = {
    title: noteTitle.value,
    text: noteText.value,
    folder: noteFolder.value
  };
  if(currentIndex!==null) notes[currentIndex]=data;
  else notes.unshift(data);

  localStorage.setItem('notes', JSON.stringify(notes));
  createModal.classList.add('hidden');
  renderNotes();
};

/* УДАЛЕНИЕ ЗАМЕТКИ */
deleteNoteBtn.onclick = () => {
  if(currentIndex===null) return;
  if(!confirm('Удалить заметку?')) return;
  notes.splice(currentIndex,1);
  localStorage.setItem('notes', JSON.stringify(notes));
  viewModal.classList.add('hidden');
  currentIndex=null;
  renderNotes();
};

/* РЕНДЕР ЗАМЕТОК */
function renderNotes() {
  notesEl.innerHTML='';
  const q = search.value.toLowerCase();
  const selectedFolder = folderSelect.value;

  notes.forEach((n,i)=>{
    if(selectedFolder!=="Все" && n.folder!==selectedFolder) return;
    if(!n.title.toLowerCase().includes(q) && !n.text.toLowerCase().includes(q)) return;

    const div=document.createElement('div');
    div.className='note-preview';
    div.textContent=n.title;
    div.onclick=()=>{
      viewTitle.textContent=n.title;
      viewText.textContent=n.text;
      viewModal.classList.remove('hidden');
      currentIndex=i;
    };
    notesEl.appendChild(div);
  });
}

/* ПРОСМОТР/РЕДАКТИРОВКА */
closeView.onclick=()=>{viewModal.classList.add('hidden'); currentIndex=null;}
editNote.onclick=()=>{
  viewModal.classList.add('hidden');
  noteTitle.value=notes[currentIndex].title;
  noteText.value=notes[currentIndex].text;
  noteFolder.value=notes[currentIndex].folder;
  createModal.classList.remove('hidden');
};

/* ФИЛЬТР ПО ПАПКЕ */
folderSelect.onchange=renderNotes;
search.oninput=renderNotes;

renderNotes();