let db;

export const openDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open('DIX_DB', 2);

    req.onupgradeneeded = e => {
      db = e.target.result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    };

    req.onsuccess = e => {
      db = e.target.result;
      resolve();
    };

    req.onerror = () => reject(req.error);
  });

export const getAllNotes = () =>
  new Promise(resolve => {
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });

export const saveNote = note =>
  new Promise((resolve, reject) => {
    const cleanNote = {
      id: note.id ?? undefined,
      title: note.title,
      text: note.text,
      media: note.media || []
    };

    const tx = db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');

    cleanNote.id
      ? store.put(cleanNote)
      : store.add(cleanNote);

    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });

export const deleteNote = id =>
  new Promise(resolve => {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').delete(id);
    tx.oncomplete = resolve;
  });