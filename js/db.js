let db;

export const openDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open('DIX_DB', 4);

    req.onupgradeneeded = e => {
      db = e.target.result;

      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media', {
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
    req.onsuccess = () => {
      const sorted = (req.result || []).sort(
        (a, b) => b.createdAt - a.createdAt
      );
      resolve(sorted);
    };
  });

export const saveNote = note =>
  new Promise(resolve => {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').put(note);
    tx.oncomplete = resolve;
  });

export const deleteNote = id =>
  new Promise(resolve => {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').delete(id);
    tx.oncomplete = resolve;
  });

export const saveMedia = file =>
  new Promise(resolve => {
    const tx = db.transaction('media', 'readwrite');
    const store = tx.objectStore('media');

    const req = store.add({
      type: file.type,
      blob: file
    });

    req.onsuccess = () => resolve(req.result);
  });

export const getMediaByIds = ids =>
  Promise.all(
    ids.map(id =>
      new Promise(resolve => {
        const tx = db.transaction('media', 'readonly');
        const store = tx.objectStore('media');
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result);
      })
    )
  );

export const deleteMedia = id =>
  new Promise(resolve => {
    const tx = db.transaction('media', 'readwrite');
    tx.objectStore('media').delete(id);
    tx.oncomplete = resolve;
  });