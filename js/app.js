import { openDB, saveNote, deleteNote } from './db.js';
import { fileToBase64, renderMedia } from './media.js';
import { renderNotes, enableSwipeClose } from './ui.js';

let currentId = null;
let mediaArr = [];

const modal = document.getElementById('modal');
const card = document.getElementById('card');
const notesEl = document.getElementById('notes');
const titleInput = document.getElementById('title');
const textInput = document.getElementById('text');
const mediaInput = document.getElementById('media');
const mediaList = document.getElementById('mediaList');

/* Открыть создание */
document.querySelector('.add-btn').onclick = () => {
  currentId = null;
  titleInput.value = '';
  textInput.value = '';
  mediaArr = [];
  renderMedia(mediaList, mediaArr, removeMedia);
  modal.classList.add('active');
};

/* Медиа */
mediaInput.onchange = async () => {
  for (const file of mediaInput.files) {
    mediaArr.push({
      type: file.type,
      url: await fileToBase64(file)
    });
  }
  renderMedia(mediaList, mediaArr, removeMedia);
};

const removeMedia = i => {
  mediaArr.splice(i, 1);
  renderMedia(mediaList, mediaArr, removeMedia);
};

/* Сохранение */
document.getElementById('save').onclick = async () => {
  if (!titleInput.value.trim()) return;
  await saveNote({
    id: currentId,
    title: titleInput.value,
    text: textInput.value,
    media: mediaArr
  });
  modal.classList.remove('active');
  renderNotes(notesEl, '', openNote);
};

/* Удаление */
document.getElementById('delete').onclick = async () => {
  if (currentId !== null) {
    await deleteNote(currentId);
    modal.classList.remove('active');
    renderNotes(notesEl, '', openNote);
  }
};

document.getElementById('close').onclick =
  () => modal.classList.remove('active');

/* Открытие заметки */
const openNote = n => {
  currentId = n.id;
  titleInput.value = n.title;
  textInput.value = n.text;
  mediaArr = [...n.media];
  renderMedia(mediaList, mediaArr, removeMedia);
  modal.classList.add('active');
};

/* Поиск */
document.getElementById('search').oninput = e =>
  renderNotes(notesEl, e.target.value.toLowerCase(), openNote);

/* Свайп */
enableSwipeClose(card, modal);

/* Старт */
openDB().then(() =>
  renderNotes(notesEl, '', openNote)
);