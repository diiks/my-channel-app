import { openDB, saveNote, deleteNote } from './db.js';
import { renderMedia } from './media.js';
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

/* Новая заметка */
document.querySelector('.add-btn').onclick = () => {
  currentId = null;
  titleInput.value = '';
  textInput.value = '';
  mediaArr = [];
  renderMedia(mediaList, mediaArr, removeMedia);
  modal.classList.add('active');
};

/* Медиа → Blob */
mediaInput.onchange = () => {
  for (const file of mediaInput.files) {
    mediaArr.push({
      type: file.type,
      blob: file
    });
  }
  renderMedia(mediaList, mediaArr, removeMedia);
};

const removeMedia = i => {
  mediaArr.splice(i, 1);
  renderMedia(mediaList, mediaArr, removeMedia);
};

/* Сохранение (ПОЧИНЕНО) */
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

/* Открытие */
const openNote = n => {
  currentId = n.id;
  titleInput.value = n.title;
  textInput.value = n.text;
  mediaArr = n.media || [];
  renderMedia(mediaList, mediaArr, removeMedia);
  modal.classList.add('active');
};

/* Поиск */
document.getElementById('search').oninput = e =>
  renderNotes(notesEl, e.target.value.toLowerCase(), openNote);

enableSwipeClose(card, modal);

openDB().then(() =>
  renderNotes(notesEl, '', openNote)
);