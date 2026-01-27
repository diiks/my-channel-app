document.addEventListener('DOMContentLoaded', () => {

  const modal = document.getElementById('modal');
  const addBtn = document.getElementById('addBtn');
  const closeModal = document.getElementById('closeModal');
  const saveNote = document.getElementById('saveNote');

  const topicInput = document.getElementById('noteTopic');
  const textInput = document.getElementById('noteText');
  const notesContainer = document.getElementById('notes');

  let notes = JSON.parse(localStorage.getItem('dixNotes')) || [];

  // 🔒 ВАЖНО: гарантированно скрываем при загрузке
  modal.classList.add('hidden');

  // ➕ открыть модалку
  addBtn.onclick = () => {
    topicInput.value = '';
    textInput.value = '';
    modal.classList.remove('hidden');
  };

  // ❌ закрыть БЕЗ сохранения
  closeModal.onclick = () => {
    modal.classList.add('hidden');
  };

  // 💾 сохранить и закрыть
  saveNote.onclick = () => {
    if (!topicInput.value.trim()) {
      alert('Введите тему');
      return;
    }

    notes.push({
      topic: topicInput.value,
      text: textInput.value,
      date: new Date().toLocaleDateString()
    });

    localStorage.setItem('dixNotes', JSON.stringify(notes));
    renderNotes();
    modal.classList.add('hidden');
  };

  function renderNotes() {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
      const div = document.createElement('div');
      div.textContent = note.topic;
      notesContainer.appendChild(div);
    });
  }

  renderNotes();
});