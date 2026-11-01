// Shows one part of the app at a time, like slides. The address (#discover,
// #guide, ...) picks the slide, so the browser's back gesture works too.
(() => {
  const SLIDES = [
    ['discover', 'Discover your robot', 'Answer a few questions and meet your best match.', '✦'],
    ['builder', 'Choose a robot', 'Search and pick one of five starter robots.', '◫'],
    ['guide', 'Instructions', 'Your step-by-step guide and parts list.', '▤'],
    ['cool', 'Cool things', 'Things to try once your robot works.', '✳'],
    ['print', '3D print it', 'Turn a drawing into a part you can print.', '⬡'],
    ['my-builds', 'My builds', 'Your saved guides and progress.', '◉'],
    ['install', 'Add to my device', 'Put RobotLab on your home screen.', '↓'],
    ['feedback', 'Tell us what you think', 'Help us make RobotLab better.', '✎'],
    ['helper', 'Robot Helper', 'Make your own robot instruction book.', '★']
  ];
  const main = document.querySelector('main');
  const slides = [...main.querySelectorAll(':scope > .slide')];
  const home = slides.find(s => s.dataset.slide === 'home');
  const order = id => SLIDES.findIndex(s => s[0] === id);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = null;

  // Menu tiles on the start slide (the Robot Helper has its own button below them).
  document.getElementById('slide-menu').innerHTML = SLIDES.filter(s => s[0] !== 'helper').map(([id, title, blurb, icon]) =>
    `<a class="slide-tile" href="#${id}"><span class="slide-icon" aria-hidden="true">${icon}</span><strong>${title}</strong><span>${blurb}</span></a>`).join('');

  // Back and menu at the top of each slide, Back and Next at the bottom.
  for (const slide of slides) {
    if (slide === home) continue;
    const i = order(slide.dataset.slide), next = SLIDES[i + 1];
    slide.insertAdjacentHTML('afterbegin', '<div class="slide-bar"><button type="button" class="slide-back">← Back</button><a class="slide-menu-link" href="#">All parts</a></div>');
    slide.insertAdjacentHTML('beforeend', '<div class="slide-bar slide-bar-end"><button type="button" class="slide-back">← Back</button>' +
      (next ? `<a class="slide-next" href="#${next[0]}">Next: ${next[1]} →</a>` : '<a class="slide-next" href="#">All parts →</a>') + '</div>');
  }

  // Each history entry remembers how deep it is, so Back knows whether to go back or to the start.
  const depth = () => (history.state && history.state.slideDepth) || 0;
  if (!history.state || history.state.slideDepth === undefined) history.replaceState({...history.state, slideDepth: 0}, '');
  let lastDepth = depth();
  main.addEventListener('click', e => {
    if (!e.target.closest('.slide-back')) return;
    if (depth() > 0) history.back(); else location.hash = '';
  });

  function show(id) {
    const target = id && id !== 'home' ? document.getElementById(id) : null;
    const slide = (target && target.closest('main > .slide')) || home;
    if (slide !== current) {
      const back = current && order(slide.dataset.slide) < order(current.dataset.slide);
      slides.forEach(s => s.classList.toggle('active', s === slide));
      slide.classList.remove('enter-left', 'enter-right');
      void slide.offsetWidth;
      if (current && !reduced()) slide.classList.add(back ? 'enter-left' : 'enter-right');
      current = slide;
      const heading = slide.querySelector('h1, h2');
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll: true}); }
    }
    // Opening a slide starts at its top; a link to something inside a slide scrolls to it.
    if (target && id !== slide.dataset.slide) target.scrollIntoView({block: 'start'});
    else window.scrollTo(0, 0);
  }

  function route() {
    if (history.state && history.state.slideDepth !== undefined) lastDepth = history.state.slideDepth;
    else { lastDepth += 1; history.replaceState({...history.state, slideDepth: lastDepth}, ''); }
    show(decodeURIComponent(location.hash.slice(1)));
  }
  window.addEventListener('hashchange', route);

  // Other scripts call this to move to a slide, e.g. after making a guide.
  window.goSlide = id => { if (location.hash === '#' + id) show(id); else location.hash = id; };
  show(decodeURIComponent(location.hash.slice(1)));
})();
