export const initMediaViewer = (track, indicator) => {
  let index = 0;
  let media = [];

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    indicator.textContent = media.length
      ? `${index + 1} / ${media.length}`
      : '';
  };

  const render = arr => {
    media = arr;
    index = 0;
    track.innerHTML = '';

    media.forEach(m => {
      const div = document.createElement('div');
      div.className = 'media-item';
      const url = URL.createObjectURL(m.blob);
      div.innerHTML = m.type.startsWith('image')
        ? `<img src="${url}">`
        : `<video src="${url}" controls></video>`;
      track.appendChild(div);
    });

    update();
  };

  let startX = 0;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50 && index < media.length - 1) index++;
    if (dx > 50 && index > 0) index--;
    update();
  });

  return { render };
};