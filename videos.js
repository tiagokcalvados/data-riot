const previewDialog = document.querySelector('#video-dialog');
const previewTitle = document.querySelector('#video-dialog-title');
const previewArtwork = document.querySelector('.dialog-artwork');
const previewVideo = document.querySelector('.dialog-video');
const previewMessage = document.querySelector('.dialog-message');
let activeTile;

document.querySelector('.video-grid').addEventListener('click', (event) => {
  const tile = event.target.closest('.video-tile');
  if (!tile) return;
  activeTile = tile;
  previewTitle.textContent = tile.dataset.title;
  previewArtwork.replaceChildren(tile.querySelector('svg').cloneNode(true));

  // Future uploads: set this tile's data-video-src to the hosted video URL.
  // Nothing is downloaded or played until the visitor opens that tile.
  const videoSource = tile.dataset.videoSrc.trim();
  previewVideo.hidden = !videoSource;
  previewArtwork.hidden = !!videoSource;
  previewMessage.hidden = !!videoSource;
  if (videoSource) previewVideo.src = videoSource;
  previewDialog.showModal();
});

previewDialog.addEventListener('click', (event) => {
  if (event.target !== previewDialog) return;
  const bounds = previewDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) previewDialog.close();
});

previewDialog.addEventListener('close', () => {
  previewVideo.pause();
  previewVideo.removeAttribute('src');
  previewVideo.load();
  previewArtwork.replaceChildren();
  activeTile?.focus();
});
