import { getAllNotes } from './db.js';

export const renderNotes = async (container, filter, openNote) => {
  const notes = await getAllNotes();
  container.innerHTML = '';

  notes.forEach(n => {
    if (
      n.title.toLowerCase().includes(filter) ||
      n.text.toLowerCase().includes(filter)
    ) {
      const d = document.createElement('div');
      d.className = 'note';
      d.textContent = n.title;
      d.onclick = () => openNote(n);
      container.appendChild(d);
    }
  });
};

export const enableSwipeClose = (card, modal) => {
  let startX = 0;
  card.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  card.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientX - startX < -80)
      modal.classList.remove('active');
  });
};