const filmDialog = document.querySelector('.film-dialog');
const filmVideo = filmDialog.querySelector('video');
const filmTitle = filmDialog.querySelector('h2');
const filmToggle = filmDialog.querySelector('.film-toggle');
const filmSeek = filmDialog.querySelector('.film-seek');
const filmTime = filmDialog.querySelector('.film-time');
const filmError = filmDialog.querySelector('.film-error');
let filmOpener;
let playbackRequest = 0;

function timeLabel(seconds) {
  const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function updateFilmControls() {
  const duration = Number.isFinite(filmVideo.duration) ? filmVideo.duration : 0;
  filmToggle.textContent = filmVideo.paused ? 'Play' : 'Pause';
  filmSeek.max = duration;
  filmSeek.value = filmVideo.currentTime;
  filmSeek.disabled = duration === 0;
  filmSeek.setAttribute('aria-valuetext', `${timeLabel(filmVideo.currentTime)} of ${timeLabel(duration)}`);
  filmTime.textContent = `${timeLabel(filmVideo.currentTime)} / ${timeLabel(duration)}`;
}

async function playFilm() {
  const request = ++playbackRequest;
  filmError.textContent = '';
  try {
    await filmVideo.play();
  } catch {
    if (request === playbackRequest && filmDialog.open) {
      filmError.textContent = 'Playback could not start. Press Play to try again.';
    }
  }
  if (request === playbackRequest) updateFilmControls();
}

for (const button of document.querySelectorAll('[data-film-src]')) {
  button.addEventListener('click', () => {
    if (filmDialog.open) return;
    filmOpener = button;
    filmTitle.textContent = button.dataset.filmTitle;
    filmVideo.setAttribute('aria-label', button.dataset.filmTitle);
    filmVideo.src = button.dataset.filmSrc;
    filmDialog.showModal();
    updateFilmControls();
    playFilm();
  });
}

filmDialog.querySelector('.film-close').addEventListener('click', () => filmDialog.close());
filmDialog.addEventListener('close', () => {
  ++playbackRequest;
  filmVideo.pause();
  filmVideo.removeAttribute('src');
  filmVideo.load();
  filmError.textContent = '';
  updateFilmControls();
  filmOpener?.focus({ preventScroll: true });
});
filmVideo.addEventListener('ended', () => filmDialog.close());
filmToggle.addEventListener('click', () => {
  if (filmVideo.paused) playFilm();
  else filmVideo.pause();
});
filmSeek.addEventListener('input', () => {
  if (Number.isFinite(filmVideo.duration)) filmVideo.currentTime = Number(filmSeek.value);
});
for (const event of ['play', 'pause', 'loadedmetadata', 'timeupdate', 'durationchange', 'emptied']) {
  filmVideo.addEventListener(event, updateFilmControls);
}
filmVideo.addEventListener('error', () => {
  if (filmDialog.open) filmError.textContent = 'The video could not load. Close the window and try the tile again.';
});
