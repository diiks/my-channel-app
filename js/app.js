const modal = document.getElementById('modal');
const fullscreen = document.getElementById('fullscreen');

/* ОТКРЫТИЕ */
function openModal() {
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
}

function openFullscreen(url) {
  fullscreenImg.src = url;
  fullscreen.classList.add('active');
}

function closeFullscreen() {
  fullscreen.classList.remove('active');
}

/* КНОПКИ */
document.getElementById('openAdd').onclick = openModal;
document.getElementById('close').onclick = closeModal;
document.getElementById('closeFullscreen').onclick = closeFullscreen;