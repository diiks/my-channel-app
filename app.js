const modal = document.getElementById('noteModal');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const saveNote = document.getElementById('saveNote');

const noteTitle = document.getElementById('noteTitle');
const noteText = document.getElementById('noteText');
const mediaInput = document.getElementById('mediaInput');

const notesContainer = document.getElementById('notes');
const searchInput = document.getElementById('search');

const folderSelect = document.getElementById('noteFolder');
const folderFilter = document.getElementById('folderFilter');
const addFolderBtn = document.getElementById('addFolder');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let folders = JSON.parse(localStorage.getItem('folders')) || ['Все'];
let currentEdit = null;

/* ===== ПАПКИ ===== */
function renderFolders() {
  folderSelect.innerHTML = '';
  folderFilter.innerHTML = '';

  folders.forEach(f => {
    folderSelect.innerHTML += `<option