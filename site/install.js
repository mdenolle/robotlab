(() => {
  const button = document.getElementById('install-app');
  const status = document.getElementById('install-status');
  const help = document.getElementById('install-help');
  const offline = document.getElementById('offline-status');
  let prompt = null;
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  function installed() { button.hidden = true; status.textContent = 'You’re using the RobotLab app. Your Build Studio is ready.'; }
  if (standalone()) installed();
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); prompt = event;
    if (!standalone()) { button.hidden = false; status.textContent = 'Installation is available in this browser.'; }
  });
  window.addEventListener('appinstalled', () => { prompt = null; installed(); });
  button.addEventListener('click', async () => {
    if (!prompt) { help.open = true; status.textContent = 'Follow the instructions below to add RobotLab.'; return; }
    const request = prompt; prompt = null;
    try {
      await request.prompt(); const choice = await request.userChoice;
      status.textContent = choice.outcome === 'accepted' ? 'Install request accepted. Open RobotLab from your device when it is ready.' : 'You can continue building on the website.';
    } catch { help.open = true; status.textContent = 'Use your browser’s install menu or the instructions below.'; }
  });
  if ('serviceWorker' in navigator && window.isSecureContext) {
    offline.textContent = 'Preparing guides for offline use…';
    navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
      offline.textContent = 'This device is ready for offline search and guides. Speech input and external references need internet.';
    }).catch(() => { offline.textContent = 'Offline setup is unavailable here. You can still build while online.'; });
  }
})();
