(() => {
  const group = document.querySelector('.reactions');
  if (!group) return;
  const buttons = [...group.querySelectorAll('[data-reaction]')];
  const status = group.querySelector('.reaction-status');
  let busy = false;
  let ready = false;
  let visible = false;
  let lastRead = 0;

  function render(data) {
    for (const button of buttons) {
      const count = data.counts?.[button.dataset.reaction];
      if (!Number.isSafeInteger(count) || count < 0) throw new Error('Reactions could not load. Please try again.');
    }
    for (const button of buttons) {
      const count = data.counts[button.dataset.reaction];
      button.querySelector('.reaction-count').textContent = count >= 10000 ? new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(count) : count.toLocaleString();
      button.setAttribute('aria-pressed', String(data.selected === button.dataset.reaction));
      button.setAttribute('aria-label', `${button.dataset.label}: ${count} ${count === 1 ? 'reaction' : 'reactions'}`);
    }
    status.textContent = data.preview ? 'Preview only · Tap or click a reaction' : 'Tap or click a reaction';
  }

  async function request(options) {
    const response = await fetch('/api/reactions', { credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(25000), ...options });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Reactions could not load. Please try again.');
    render(data);
    ready = true;
    return data;
  }

  async function refresh() {
    if (busy || document.hidden) return;
    busy = true;
    try { await request(); lastRead = Date.now(); }
    catch { status.textContent = ready ? 'Counts could not refresh. Tap a reaction to try again.' : 'Reactions could not load. Tap to retry.'; }
    finally { busy = false; }
  }

  for (const button of buttons) {
    button.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      group.setAttribute('aria-busy', 'true');
      buttons.forEach(item => { item.disabled = true; });
      status.textContent = 'Saving your reaction…';
      try {
        if (!ready) await request();
        await request({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ choice: button.dataset.reaction }) });
        status.textContent = 'Thanks for your reaction!';
        lastRead = Date.now();
      } catch (error) { status.textContent = error.message || 'Your reaction could not be saved. Please try again.'; }
      finally {
        buttons.forEach(item => { item.disabled = false; });
        group.setAttribute('aria-busy', 'false');
        busy = false;
      }
    });
  }
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible && Date.now() - lastRead > 15000) refresh(); }).observe(group);
  setInterval(() => { if (visible) refresh(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) refresh(); });
  refresh();
})();
