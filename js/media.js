export const fileToBase64 = file =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

export const renderMedia = (container, media, removeFn) => {
  container.innerHTML = '';
  media.forEach((m, i) => {
    const div = document.createElement('div');
    div.className = 'media-item';
    div.innerHTML = `
      ${m.type.startsWith('image')
        ? `<img src="${m.url}">`
        : `<video src="${m.url}" controls></video>`}
      <button>✖</button>
    `;
    div.querySelector('button').onclick = () => removeFn(i);
    container.appendChild(div);
  });
};