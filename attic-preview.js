const video = document.querySelector('#attic-video');
const frame = document.querySelector('.attic-frame');
const playButton = document.querySelector('.attic-play');
const status = document.querySelector('.attic-status');
function updatePlaybackLabel() {
  const playing = !video.paused && !video.ended;
  const action = playing ? 'Pause' : video.ended ? 'Replay' : 'Play';
  playButton.setAttribute('aria-label', `${action} Attic Lights`);
  playButton.setAttribute('aria-pressed', String(playing));
  playButton.title = `Click or tap to ${action.toLowerCase()} Attic Lights`;
}

playButton.addEventListener('click', async () => {
  status.textContent = '';
  if (!video.paused) {
    video.pause();
    return;
  }
  playButton.disabled = true;
  try {
    if (video.error) video.load();
    if (video.ended) video.currentTime = 0;
    await video.play();
    frame.classList.add('has-started');
  } catch {
    status.textContent = 'The video could not start. Tap the frame to try again.';
  } finally {
    playButton.disabled = false;
    updatePlaybackLabel();
  }
});

for (const event of ['play', 'pause', 'ended']) {
  video.addEventListener(event, updatePlaybackLabel);
}

video.addEventListener('error', () => {
  playButton.disabled = false;
  status.textContent = 'The video could not load. Tap the frame to try again.';
  updatePlaybackLabel();
});
