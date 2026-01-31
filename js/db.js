let db;

/* =========================
   OPEN DB
========================= */
export const openDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open('DIX_DB', 3);

    req.onupgradeneeded = e => {
      db = e.target.result;

      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', {
          keyPath: 'id'
        });
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

/* =========================
   NOTES
========================= */
export const getAllNotes = () =>
  new Promise(resolve => {
    const tx = db.transaction('notes', 'readonly');
    const store = tx.objectStore('notes');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
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

/* =========================
   MEDIA
========================= */
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
  new Promise(resolve => {
    const tx = db.transaction('media', 'readonly');
    const store = tx.objectStore('media');
    const result = [];

    let done = 0;

    ids.forEach(id => {
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) result.push(req.result);
        done++;
        if (done === ids.length) resolve(result);
      };
    });

    if (!ids.length) resolve([]);
  });

export const deleteMedia = id =>
  new Promise(resolve => {
    const tx = db.transaction('media', 'readwrite');
    tx.objectStore('media').delete(id);
    tx.oncomplete = resolve;
  });