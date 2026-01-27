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

const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const folderList = document.getElementById('folderList');

const addFolderBtn = document.getElementById('addFolderBtn');
const editFolderBtn = document.getElementById('editFolderBtn');
const deleteFolderBtn = document.getElementById('deleteFolderBtn');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let folders = JSON.parse(localStorage.getItem('folders')) || ["Все"];
let currentIndex = null;
let currentFolder = "Все";

/* --- БОКОВОЕ МЕНЮ --- */
menuToggle.onclick = () => sideMenu.classList.toggle('hidden');

function renderFolders() {
  folderList.innerHTML='';
  noteFolder.innerHTML='';
  folders.forEach(f=>{
    const li=document.createElement('li');
    li.textContent=f;
    if(f===currentFolder) li.classList.add('active');
    li.onclick=()=>{ currentFolder=f; renderFolders(); renderNotes(); sideMenu.classList.add('hidden'); };
    folderList.appendChild(li);

    const opt=document.createElement('option');
    opt.value=f; opt.textContent=f;
    noteFolder.appendChild(opt);
  });
}
renderFolders();

/* ПАПКИ */
addFolderBtn.onclick=()=>{
  const name=prompt('Название новой папки:'); 
  if(!name) return;
  folders.push(name);
  localStorage.setItem('folders', JSON.stringify(folders));
  renderFolders();
};

editFolderBtn.onclick=()=>{
  const oldName=currentFolder;
  if(oldName==="Все"){ alert("Папку 'Все' нельзя редактировать"); return; }
  const newName=prompt('Новое имя папки:', oldName);
  if(!newName) return;
  folders=folders.map(f=>f===oldName?newName:f);
  notes.forEach(n=>{ if(n.folder===oldName) n.folder=newName });
  localStorage.setItem('folders', JSON.stringify(folders));
  localStorage.setItem('notes', JSON.stringify(notes));
  renderFolders();
  renderNotes();
};

deleteFolderBtn.onclick=()=>{
  const name=currentFolder;
  if(name==="Все"){ alert("Папку 'Все' нельзя удалить"); return; }
  if(!confirm(`Удалить папку "${name}" и все заметки в ней?`)) return;
  folders=folders.filter(f=>f!==name);
  notes=notes.filter(n=>n.folder!==name);
  currentFolder="Все";
  localStorage.setItem('folders', JSON.stringify(folders));
  localStorage.setItem('notes', JSON.stringify(notes));
  renderFolders();
  renderNotes();
};

/* --- СОЗДАНИЕ / РЕДАКТИРОВАНИЕ ЗАМЕТКИ --- */
openCreate.onclick=()=>{
  currentIndex=null;
  noteTitle.value='';
  noteText.value='';
  noteFolder.value=currentFolder;
  createModal.classList.remove('hidden');
};

closeCreate.onclick=()=>createModal.classList.add('hidden');

saveNote.onclick=()=>{
  if(!noteTitle.value.trim()) return;
  const data={ title:noteTitle.value, text:noteText.value, folder:noteFolder.value };
  if(currentIndex!==null) notes[currentIndex]=data;
  else notes.unshift(data);
  localStorage.setItem('notes', JSON.stringify(notes));
  createModal.classList.add('hidden');
  renderNotes();
};

/* --- УДАЛЕНИЕ ЗАМЕТКИ --- */
deleteNoteBtn.onclick=()=>{
  if(currentIndex===null) return;
  if(!confirm('Удалить заметку?')) return;
  notes.splice(currentIndex,1);
  localStorage.setItem('notes', JSON.stringify(notes));
  viewModal.classList.add('hidden');
  currentIndex=null;
  renderNotes();
};

/* --- РЕНДЕР ЗАМЕТОК --- */
function renderNotes() {
  notesEl.innerHTML='';
  const q=search.value.toLowerCase();
  notes.forEach((n,i)=>{
    if(currentFolder!=="Все" && n.folder!==currentFolder) return;
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

/* --- ПРОСМОТР / РЕДАКТИРОВКА --- */
closeView.onclick=()=>{ viewModal.classList.add('hidden'); currentIndex=null; }
editNote.onclick=()=>{
  viewModal.classList.add('hidden');
  noteTitle.value=notes[currentIndex].title;
  noteText.value=notes[currentIndex].text;
  noteFolder.value=notes[currentIndex].folder;
  createModal.classList.remove('hidden');
};

search.oninput=renderNotes;

renderNotes();