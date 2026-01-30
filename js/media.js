export const renderMedia = (container, media, removeFn) => {
  container.innerHTML = '';

  media.forEach((m, i) => {
    const div = document.createElement('div');
    div.className = 'media-item';

    const url = URL.createObjectURL(m.blob);

    div.innerHTML = `
      ${m.type.startsWith('image')
        ? `<img src="${url}">`
        : `<video src="${url}" controls></video>`}
      <button>✖</button>
    `;

    div.querySelector('button').onclick = () => {
      URL.revokeObjectURL(url);
      removeFn(i);
    };

    container.appendChild(div);
  });
};