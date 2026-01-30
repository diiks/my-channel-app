let db;

export const openDB = () =>
  new Promise(resolve => {
    const req = indexedDB.open('DIX_DB', 1);

    req.onupgradeneeded = e => {
      db = e.target.result;
      db.createObjectStore('notes', {
        keyPath: 'id',
        autoIncrement: true
      });
    };

    req.onsuccess = e => {
      db = e.target.result;
      resolve();
    };
  });

export const getAllNotes = () =>
  new Promise(resolve => {
    const tx = db.transaction('notes', 'readonly');
    const req = tx.objectStore('notes').getAll();
    req.onsuccess = () => resolve(req.result);
  });

export const saveNote = note =>
  new Promise(resolve => {
    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    note.id ? store.put(note) : store.add(note);
    tx.oncomplete = resolve;
  });

export const deleteNote = id =>
  new Promise(resolve => {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').delete(id);
    tx.oncomplete = resolve;
  });