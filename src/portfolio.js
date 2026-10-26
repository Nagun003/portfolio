/* Portfolio layer for Nagun Haridasan: panels, skill constellation, assistant, lab demos, command menu.
   No innerHTML anywhere: every node is built with h() / icon() and text goes through textContent. */
(function () {
  'use strict';

  // ------------------------------------------------------------------ helpers
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s);
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NARROW = window.matchMedia('(max-width: 860px) and (orientation: portrait), (max-width: 600px)');
  const isNarrow = () => NARROW.matches;
  // keep the overlay above the on-screen keyboard
  (function keyboard() {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.getElementById('pf');
    const fit = () => root.style.setProperty('--pf-kb', Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)) + 'px');
    vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit);
  })();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'vars') for (const [n, val] of Object.entries(v)) el.style.setProperty(n, val);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else el.setAttribute(k, v === true ? '' : String(v));
      }
    }
    kids.flat(Infinity).forEach((c) => {
      if (c == null || c === false) return;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    });
    return el;
  }

  const frag = (...kids) => { const f = document.createDocumentFragment(); kids.flat(Infinity).forEach((c) => { if (c) f.append(c); }); return f; };
  const circle = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0 ${r} ${r} 0 1 0 ${-2 * r} 0`;
  const ICONS = {
    user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', circle(12, 7, 4)],
    nodes: [circle(6, 7, 2.3), circle(18, 7, 2.3), circle(12, 18, 2.3), 'M8.3 7h7.4', 'M7.3 9l3.6 7', 'M16.7 9l-3.6 7'],
    layers: ['M12 3 3 8l9 5 9-5-9-5z', 'M3 12.5l9 5 9-5', 'M3 17l9 5 9-5'],
    flask: ['M9 3h6', 'M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3', 'M7.5 15h9'],
    mail: ['M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M3 7l9 6 9-6'],
    spark: ['M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z', 'M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7L19 15z'],
    search: [circle(11, 11, 7), 'M20 20l-3.5-3.5'],
    send: ['M5 12h14', 'M13 6l6 6-6 6'],
    x: ['M6 6l12 12', 'M18 6L6 18'],
    chev: ['M6 9l6 6 6-6'],
    copy: ['M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z', 'M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1'],
    github: ['M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21'],
    linkedin: ['M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z', 'M2 9h4v12H2z', circle(4, 4, 2)],
    pin: ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', circle(12, 10, 2.5)],
    fish: ['M3 12c3-5 8-6 12-3l4-3v12l-4-3c-4 3-9 2-12-3z', 'M8 11.5h.01'],
    camera: ['M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z', circle(12, 13, 3.5)],
    brush: ['M18.4 2.6a2 2 0 0 1 2.8 2.8L11 15.5 8 16l.5-3L18.4 2.6z', 'M8 16c-2.5 0-4 1.5-4 4.5 3 0 4.5-1.5 4.5-4'],
    waves: ['M2 8c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0', 'M2 14c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0', 'M2 20c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0'],
    play: ['M7 4l13 8-13 8V4z'],
    pause: ['M8 5v14', 'M16 5v14'],
    check: ['M5 12l5 5 9-10'],
    alert: ['M12 9v4', 'M12 17h.01', 'M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 3.9a2 2 0 0 0-3.4 0z'],
    ext: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
    pulse: ['M3 12h4l2-6 4 12 2-6h6'],
    volume: ['M11 5 6 9H2v6h4l5 4V5z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M18.5 5.5a9 9 0 0 1 0 13'],
    cpu: ['M7 7h10v10H7z', 'M9 3v4', 'M15 3v4', 'M9 17v4', 'M15 17v4', 'M3 9h4', 'M3 15h4', 'M17 9h4', 'M17 15h4'],
    cube: ['M12 3 4 7.5v9L12 21l8-4.5v-9L12 3z', 'M4 7.5l8 4.5 8-4.5', 'M12 12v9'],
    home: ['M3 11l9-8 9 8', 'M5 10v10h14V10']
  };
  function icon(name) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', 'pf-ico');
    s.setAttribute('aria-hidden', 'true');
    (ICONS[name] || []).forEach((d) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      s.append(p);
    });
    return s;
  }
  // **bold** -> <b>
  function rich(str) {
    const frag = document.createDocumentFragment();
    String(str).split(/(\*\*[^*]+\*\*)/g).forEach((part) => {
      if (!part) return;
      if (part.startsWith('**')) frag.append(h('b', { text: part.slice(2, -2) }));
      else frag.append(document.createTextNode(part));
    });
    return frag;
  }
  let toastTimer = 0;
  function toast(msg) {
    const t = $('#pf-toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('on'), 2200);
  }
  async function copyText(text, okMsg) {
    try {
      await navigator.clipboard.writeText(text);
      toast(okMsg || 'Copied to clipboard');
    } catch (e) {
      const ta = h('textarea', { style: 'position:fixed;opacity:0;left:-999px' });
      ta.value = text;
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { /* blocked */ }
      ta.remove();
      toast(ok ? (okMsg || 'Copied to clipboard') : 'Copy failed, select the text instead');
    }
  }
  const pct = (el) => el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min)) * 100 + '%');

  // ------------------------------------------------------------------ content (from the CV)
  const ME = {
    name: 'Nagun Haridasan',
    email: 'nagunbrasitha@gmail.com',
    github: 'https://github.com/Nagun003',
    linkedin: 'https://www.linkedin.com/in/nagun-haridasan',
    place: 'Begur, Bengaluru, Karnataka'
  };

  const PROJECTS = [
    {
      id: 'llm', n: '01', cat: 'ai', title: 'Local LLM Inference & Voice Cloning Runner', where: 'Android / Termux', years: '2025 – 2026', lab: 'llm',
      tags: ['Python', 'llama.cpp', 'GGUF', 'Coqui XTTS-v2', 'MCP'],
      summary: 'Quantized language models and a cloned voice, running entirely on a 4GB Android phone.',
      bullets: [
        'Compiled and ran 4-bit quantized Llama 3.2 1B, Gemma 4 and Phi-3.5-mini locally on a 4GB RAM device through Termux with llama.cpp, tuning context length, batch size and CPU threads to prevent out-of-memory crashes.',
        'Set up local voice cloning and text-to-speech with Coqui XTTS-v2 using custom reference audio samples.',
        'Connected local model instances to Model Context Protocol (MCP) tools and shell scripts to automate on-device tasks, including custom Android screen-recording utilities.'
      ]
    },
    {
      id: 'studios', n: '02', cat: 'web', title: 'Browser-Based 3D Studios: Lampshade Generator & Aquarium Simulator', where: 'Three.js · WebGL', years: '2025 – 2026', lab: 'lamp',
      tags: ['JavaScript', 'Three.js', 'WebGL', 'HTML5'],
      summary: 'Two single-file 3D tools: a parametric lampshade designer and a planted-tank simulator.',
      bullets: [
        'Built a single-file 3D parametric lampshade design tool in Three.js that generates custom procedural meshes in real time from user-controlled sliders (radius, ribs, twist, height).',
        'Created an interactive 3D planted freshwater aquarium simulator in the browser with custom lighting controls, water-surface shaders, hardscape placement and smooth orbit-camera controls.'
      ]
    },
    {
      id: 'lip', n: '03', cat: 'ai', title: 'Lip-to-Speech (TTS) Synthesis from Silent Video', where: 'Deep learning', years: '2024 – 2025', lab: 'lip',
      tags: ['Python', 'Deep Learning', 'OpenCV', 'Librosa'],
      summary: 'A pipeline that predicts speech audio from nothing but a speaker’s lip movements.',
      bullets: [
        'Built a deep learning pipeline that takes silent video clips of a speaker’s lip movements and predicts the corresponding audio mel-spectrogram to synthesize intelligible speech.',
        'Wrote preprocessing scripts to extract video frames, crop facial mouth regions and align them with ground-truth audio spectrograms for model training.'
      ]
    },
    {
      id: 'twitter', n: '04', cat: 'data', title: 'Twitter (X) Engagement Analytics Dashboard', where: 'Business intelligence', years: '2024',
      tags: ['Power BI', 'DAX', 'Power Query', 'Excel'],
      summary: 'An interactive dashboard tracking impressions, engagement rate, link clicks and best posting times.',
      bullets: [
        'Cleaned raw tweet export datasets in Power Query and built an interactive Power BI dashboard tracking impressions, engagement rates, link clicks and posting-time performance.',
        'Wrote custom DAX measures and calculated columns to filter engagement metrics across date ranges and content types.'
      ]
    },
    {
      id: 'stock', n: '05', cat: 'data', title: 'Stock Price Time-Series Forecasting', where: 'Machine learning', years: '2024',
      tags: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
      summary: 'Regression models on OHLCV history, compared on RMSE and MAE.',
      bullets: [
        'Trained regression models on historical OHLCV stock data using moving averages and rolling volatility features, comparing prediction error (RMSE and MAE) across models.'
      ]
    }
  ];
  const PROJ = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

  const CATS = [
    { id: 'lang', name: 'Languages', color: '#ffc46b', items: [['Python', ['llm', 'lip', 'stock']], ['SQL', []], ['C++', []], ['JavaScript (ES6+)', ['studios']], ['HTML5 & CSS3', ['studios']], ['Bash / Shell', ['llm']]] },
    {
      id: 'ai', name: 'AI, ML & Speech', color: '#ff5a2a', items: [
        ['Deep Learning', ['lip']], ['llama.cpp', ['llm']], ['GGUF quantization', ['llm']], ['Small Language Models', ['llm']], ['Llama 3.2', ['llm']], ['Gemma 4', ['llm']],
        ['Phi-3.5', ['llm']], ['Voice cloning (XTTS-v2)', ['llm']], ['Computer Vision', ['lip']], ['NLP', []], ['MCP', ['llm']], ['OpenCV', ['lip']], ['Librosa', ['lip']]]
    },
    { id: 'web', name: '3D Graphics & Web', color: '#ffe08a', items: [['Three.js', ['studios']], ['WebGL', ['studios']], ['HTML5 Canvas', ['studios']], ['Procedural geometry', ['studios']], ['REST APIs', []]] },
    { id: 'data', name: 'Data & BI', color: '#ff8fa3', items: [['Power BI', ['twitter']], ['DAX', ['twitter']], ['Power Query', ['twitter']], ['Pandas', ['stock']], ['NumPy', ['stock']], ['Scikit-Learn', ['stock']], ['Matplotlib', ['stock']], ['Excel', ['twitter']]] },
    { id: 'sys', name: 'Systems & Hardware', color: '#d9a066', items: [['Git', []], ['GitHub', []], ['Linux / Termux', ['llm']], ['Android ADB', ['llm']], ['GCP Cloud Run', []], ['ESP32', []]] }
  ];

  // ------------------------------------------------------------------ panel manager
  const body = document.body;
  const panel = $('#pf-panel');
  const panelBody = $('#pf-panel-body');
  const panelTitle = $('#pf-panel-title');
  const panelEyebrow = $('#pf-panel-eyebrow');
  let current = null;       // { id, dispose }
  let leaveTimer = 0;

  const SECTIONS = [
    { id: 'about', icon: 'user', label: 'About', eyebrow: '01 — About', title: 'Hi, I’m Nagun.', render: renderAbout },
    { id: 'skills', icon: 'nodes', label: 'Skills', eyebrow: '02 — Skills', title: 'Skill constellation', render: renderSkills },
    { id: 'projects', icon: 'layers', label: 'Projects', eyebrow: '03 — Projects', title: 'Selected work', render: renderProjects },
    { id: 'lab', icon: 'flask', label: 'Lab', eyebrow: '04 — Lab', title: 'Try it yourself', render: renderLab },
    { id: 'contact', icon: 'mail', label: 'Contact', eyebrow: '05 — Contact', title: 'Let’s build something', render: renderContact },
    { id: 'ask', icon: 'spark', label: 'Ask AI', eyebrow: 'AI — Assistant', title: 'Ask my portfolio', render: renderAsk }
  ];
  const SEC = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

  function buildRail() {
    const rail = $('#pf-rail');
    SECTIONS.forEach((s, i) => {
      if (s.id === 'ask') rail.append(h('div', { class: 'pf-rail-sep' }));
      rail.append(h('button', { type: 'button', class: 'pf-rail-btn', 'data-sec': s.id, 'aria-label': s.label, onclick: () => (current && current.id === s.id ? closePanel() : openPanel(s.id)) },
        icon(s.icon), h('span', { class: 'pf-rail-label', text: s.label })));
    });
  }
  function syncRail() {
    document.querySelectorAll('.pf-rail-btn').forEach((b) => b.setAttribute('aria-current', String(!!current && b.dataset.sec === current.id)));
  }
  function frameCamera() {
    const A = window.PF3D;
    if (!A) return;
    if (!current) { A.shift(0, 0); A.zoom(1); return; }
    if (isNarrow()) { A.shift(0, Math.max(0, (panel.offsetHeight - 62) / 2)); A.zoom(1.1); }
    else { A.shift(Math.max(0, (panel.offsetWidth - 54) / 2), 0); A.zoom(1.2); }
  }
  function openPanel(id, opts) {
    const s = SEC[id];
    if (!s) return;
    clearTimeout(leaveTimer);
    panel.classList.remove('pf-leaving');
    if (current && current.id === id && !(opts && opts.rerender)) {
      if (current.update) current.update(opts || {});
      return;
    }
    if (current && current.dispose) current.dispose();
    panelEyebrow.textContent = s.eyebrow;
    panelTitle.textContent = s.title;
    const res = s.render(opts || {}) || {};
    current = { id, dispose: res.dispose, update: res.update };
    panelBody.replaceChildren(res.node || res);
    panelBody.scrollTop = 0;
    panel.hidden = false;
    body.classList.add('pf-panel-open');
    syncRail();
    try { history.replaceState(null, '', '#/' + id); } catch (e) { /* file:// */ }
    requestAnimationFrame(frameCamera);
    if (!isNarrow()) panelTitle.focus({ preventScroll: true });
  }
  function closePanel() {
    if (!current) return;
    if (current.dispose) current.dispose();
    current = null;
    syncRail();
    body.classList.remove('pf-panel-open');
    panel.classList.add('pf-leaving');
    leaveTimer = setTimeout(() => { panel.hidden = true; panel.classList.remove('pf-leaving'); panelBody.replaceChildren(); }, reduced ? 0 : 280);
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* file:// */ }
    frameCamera();
  }
  $('#pf-panel-close').addEventListener('click', closePanel);
  window.addEventListener('resize', () => { if (current) requestAnimationFrame(frameCamera); });

  // ------------------------------------------------------------------ ABOUT
  function renderAbout() {
    const stat = (n, t) => h('div', { class: 'pf-stat' }, h('strong', { text: n }), h('span', { text: t }));
    const langs = [['English', 'Fluent', 100], ['Kannada', 'Native', 100], ['Malayalam', 'Fluent', 100], ['Tamil', 'Conversational', 62], ['Hindi', 'Conversational', 62]];
    return frag(
      h('p', { class: 'pf-lead' }, rich('I’m an **AI / ML engineer** who likes making models **small enough to run anywhere**: 4-bit Llama, Gemma and Phi on a **4GB phone**, voice cloning on-device, and 3D tools that live in a single browser tab.')),
      h('div', { class: 'pf-stats' },
        stat('4GB', 'RAM phone running local language models'),
        stat('3', 'small language models quantized to 4-bit'),
        stat('5', 'projects across AI, 3D and data, 2024–2026'),
        stat('5', 'languages spoken, from Kannada to Hindi')),
      h('div', null, h('p', { class: 'pf-h3', text: 'Education' }),
        h('div', { class: 'pf-card' }, h('div', { class: 'pf-tl' }, h('span', { class: 'pf-tl-dot' }),
          h('span', { class: 'when', text: '2021 – 2025' }),
          h('h4', { text: 'B.E. in Computer Science & Engineering (AI & ML)' }),
          h('p', { text: 'AMC Engineering College, Bengaluru · Affiliated to VTU' }),
          h('div', { class: 'pf-tags' }, ['Deep Learning', 'Machine Learning', 'Computer Vision', 'NLP', 'DBMS (SQL)', 'Data Structures & Algorithms', 'Operating Systems'].map((t) => h('span', { class: 'pf-tag plain', text: t })))))),
      h('div', null, h('p', { class: 'pf-h3', text: 'Languages' }),
        h('div', { class: 'pf-bars' }, langs.map(([n, l, w]) => h('div', { class: 'pf-bar' }, h('span', { text: n }), h('i', { vars: { '--w': w + '%' } }), h('em', { text: l }))))),
      h('div', null, h('p', { class: 'pf-h3', text: 'Away from the keyboard' }),
        h('div', { class: 'pf-interests' },
          [['fish', 'Freshwater aquascaping & planted tanks'], ['camera', 'Macro photography of jumping & lynx spiders'], ['brush', 'Drawing & painting'], ['waves', 'Swimming']].map(([i, t]) => h('div', { class: 'pf-interest' }, icon(i), h('span', { text: t }))))),
      h('div', { class: 'pf-actions' },
        h('button', { type: 'button', class: 'pf-btn primary', onclick: () => openPanel('projects') }, 'See the projects', icon('send')),
        h('button', { type: 'button', class: 'pf-btn', onclick: () => openPanel('ask', { q: 'What should I look at first?' }) }, icon('spark'), 'Ask the assistant')));
  }

  // ------------------------------------------------------------------ SKILLS (constellation)
  function renderSkills() {
    let focus = null;
    const tip = h('div', { class: 'pf-graph-tip' });
    const canvas = h('canvas', { 'aria-label': 'Interactive map of skills grouped by category and linked to the projects that use them', role: 'img' });
    const graphEl = h('div', { class: 'pf-graph' }, canvas, tip);
    const graph = mountGraph(canvas, tip, () => focus);
    const chips = h('div', { class: 'pf-seg' });
    const groups = h('div', { class: 'pf-skill-groups' });
    const groupEls = {};
    function sync() {
      chips.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(focus ? b.dataset.cat === focus : b.dataset.cat === 'all')));
      Object.entries(groupEls).forEach(([k, el]) => el.setAttribute('data-dim', String(!!focus && k !== focus)));
      graph.refresh();
    }
    const setFocus = (id) => { focus = focus === id ? null : id; sync(); };
    chips.append(h('button', { type: 'button', 'data-cat': 'all', 'aria-pressed': 'true', onclick: () => { focus = null; sync(); } }, 'All'));
    CATS.forEach((c) => {
      chips.append(h('button', { type: 'button', 'data-cat': c.id, 'aria-pressed': 'false', onclick: () => setFocus(c.id) }, h('i', { class: 'dot', vars: { '--c': c.color } }), c.name));
      groupEls[c.id] = h('div', { class: 'pf-skill-group', vars: { '--c': c.color } },
        h('h4', null, h('i', { class: 'dot' }), c.name),
        h('div', { class: 'pf-tags' }, c.items.map(([n]) => h('button', { type: 'button', class: 'pf-tag btn', text: n,
          onmouseenter: () => graph.select(n), onfocus: () => graph.select(n), onmouseleave: () => graph.select(null), onblur: () => graph.select(null),
          onclick: () => graph.pin(n) }))));
      groups.append(groupEls[c.id]);
    });
    graph.onCat = setFocus;
    return {
      node: frag(
        h('p', { class: 'pf-p' }, rich('Every dot is something I’ve used. **Hover or tap** a dot to see which projects it shows up in; dashed lines connect skills that appeared together.')),
        chips, graphEl, groups),
      dispose: graph.dispose
    };
  }

  function mountGraph(canvas, tip, getFocus) {
    const ctx = canvas.getContext('2d');
    const nodes = [], edges = [], byName = new Map(), cats = [];
    const hub = { kind: 'hub', label: 'NAGUN', x: 0, y: 0, r: 7, color: '#ffd79a' };
    nodes.push(hub);
    CATS.forEach((c, ci) => {
      const cn = { kind: 'cat', id: c.id, label: c.name, color: c.color, ang: (-90 + ci * 72) * Math.PI / 180, r: 6, x: 0, y: 0, leaves: [] };
      nodes.push(cn); cats.push(cn); edges.push([hub, cn]);
      c.items.forEach(([name, projs], i) => {
        const ln = { kind: 'leaf', label: name, cat: cn, color: c.color, projs, r: 3.4, x: 0, y: 0, i, n: c.items.length, dir: ci % 2 ? -1 : 1, phase: (i / c.items.length) * Math.PI * 2, rv: 0.82 + ((i * 37) % 11) / 30, ox: 0, oy: 0 };
        cn.leaves.push(ln); nodes.push(ln); edges.push([cn, ln]); byName.set(name, ln);
      });
    });
    let W = 0, H = 0, dpr = 1, raf = 0, alive = true, t0 = performance.now();
    let hover = null, pinned = null, mouse = null;
    const pulses = [];
    const glow = {};
    function sprite(color) {
      if (glow[color]) return glow[color];
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, color); gr.addColorStop(0.25, color + '88'); gr.addColorStop(1, color + '00');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      return (glow[color] = c);
    }
    function layout(t) {
      const cx = W / 2, cy = H / 2 - 10, rx = W * 0.3, ry = H * 0.29;
      hub.x = cx; hub.y = cy;
      cats.forEach((n) => { n.x = cx + Math.cos(n.ang) * rx; n.y = cy + Math.sin(n.ang) * ry; });
      nodes.forEach((n) => {
        if (n.kind !== 'leaf') return;
        const c = n.cat, ro = (20 + c.leaves.length * 2.9) * n.rv * (W < 420 ? 0.82 : 1);
        const a = n.phase + (reduced ? 0 : t * 0.00016 * n.dir * (1 + (n.i % 3) * 0.25));
        let tx = c.x + Math.cos(a) * ro, ty = c.y + Math.sin(a) * ro * 0.92;
        if (mouse) {
          const dx = tx - mouse.x, dy = ty - mouse.y, d = Math.hypot(dx, dy);
          if (d < 64 && d > 0.1) { const k = (1 - d / 64) * 13; tx += (dx / d) * k; ty += (dy / d) * k; }
        }
        n.x += (tx - n.x) * (n.x === 0 ? 1 : 0.14); n.y += (ty - n.y) * (n.y === 0 ? 1 : 0.14);
      });
    }
    function related(n) {
      if (!n || n.kind !== 'leaf' || !n.projs.length) return [];
      return nodes.filter((o) => o.kind === 'leaf' && o !== n && o.projs.some((p) => n.projs.includes(p)));
    }
    function active(n) {
      const f = getFocus();
      if (f && n.kind === 'leaf' && n.cat.id !== f) return false;
      if (f && n.kind === 'cat' && n.id !== f) return false;
      return true;
    }
    function draw(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      layout(t);
      const sel = pinned || hover, rel = related(sel);
      // edges
      ctx.lineWidth = 1;
      edges.forEach(([a, b]) => {
        const on = active(b) && active(a);
        ctx.globalAlpha = on ? (b.kind === 'cat' ? 0.4 : 0.2) : 0.05;
        ctx.strokeStyle = b.color || '#ff9a4a';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      // links between skills that share a project
      if (sel && sel.kind === 'leaf') {
        ctx.globalAlpha = 0.7; ctx.strokeStyle = '#ffd79a'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 4]);
        rel.forEach((o) => { ctx.beginPath(); ctx.moveTo(sel.x, sel.y); ctx.lineTo(o.x, o.y); ctx.stroke(); });
        ctx.setLineDash([]); ctx.lineWidth = 1;
      }
      // data pulses
      if (!reduced) {
        if (pulses.length < 9 && Math.random() < 0.06) pulses.push({ a: hub, b: cats[Math.floor(Math.random() * cats.length)], t: 0 });
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i]; p.t += 0.018;
          if (p.t >= 1) {
            if (p.b.kind === 'cat' && p.b.leaves.length) pulses.push({ a: p.b, b: p.b.leaves[Math.floor(Math.random() * p.b.leaves.length)], t: 0 });
            pulses.splice(i, 1); continue;
          }
          if (!active(p.b)) continue;
          const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
          ctx.globalAlpha = 0.9 * Math.sin(Math.PI * p.t); ctx.globalCompositeOperation = 'lighter';
          ctx.drawImage(sprite('#ffb45e'), x - 7, y - 7, 14, 14); ctx.globalCompositeOperation = 'source-over';
        }
      }
      // nodes
      nodes.forEach((n) => {
        const on = active(n), isSel = n === sel, isRel = rel.includes(n);
        const a = on ? (sel && sel.kind === 'leaf' && !isSel && !isRel && n.kind === 'leaf' ? 0.3 : 1) : 0.14;
        const rad = n.r * (isSel ? 1.6 : isRel ? 1.3 : 1);
        ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter';
        const gs = rad * (n.kind === 'leaf' ? 5 : 6.5);
        ctx.drawImage(sprite(n.color), n.x - gs, n.y - gs, gs * 2, gs * 2);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = n.kind === 'leaf' ? n.color : '#1a0b05';
        ctx.strokeStyle = n.color; ctx.lineWidth = n.kind === 'leaf' ? 0 : 2;
        ctx.beginPath(); ctx.arc(n.x, n.y, rad, 0, 7); ctx.fill(); if (n.kind !== 'leaf') ctx.stroke();
        if (n.kind === 'leaf' && (isSel || isRel)) { ctx.fillStyle = '#fff4e6'; ctx.beginPath(); ctx.arc(n.x, n.y, rad * 0.45, 0, 7); ctx.fill(); }
      });
      // labels
      ctx.font = '600 10.5px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      nodes.forEach((n) => {
        if (n.kind === 'leaf' && n !== sel && !rel.includes(n)) return;
        const on = active(n); if (!on) return;
        let lx = n.x, ly = n.y - (n.kind === 'hub' ? 17 : n.kind === 'cat' ? 17 : 12);
        if (n.kind === 'leaf') { const w = ctx.measureText(n.label).width / 2 + 4; lx = clamp(lx, w + 2, W - w - 2); }
        ctx.globalAlpha = 1; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(10,5,3,.9)'; ctx.strokeText(n.kind === 'cat' ? n.label.toUpperCase() : n.label, lx, ly);
        ctx.fillStyle = n.kind === 'leaf' ? '#fff4e6' : n.kind === 'hub' ? '#ffd79a' : n.color; ctx.fillText(n.kind === 'cat' ? n.label.toUpperCase() : n.label, lx, ly);
      });
      ctx.globalAlpha = 1;
    }
    function setTip() {
      const n = pinned || hover;
      tip.replaceChildren();
      if (!n) { tip.append(rich('**Hover or tap a dot.** Categories can be tapped to focus them.')); return; }
      if (n.kind === 'leaf') {
        const ps = n.projs.map((p) => PROJ[p].title.split(':')[0]);
        tip.append(h('b', { text: n.label }), document.createTextNode(` · ${n.cat.label} — `), document.createTextNode(ps.length ? 'used in ' + ps.join(', ') : 'part of my core toolkit'));
      } else if (n.kind === 'cat') tip.append(h('b', { text: n.label }), document.createTextNode(` — ${n.leaves.length} skills. Tap to focus.`));
      else tip.append(h('b', { text: 'Nagun Haridasan' }), document.createTextNode(' — everything branches from here.'));
    }
    function pick(x, y) {
      let best = null, bd = 16;
      for (const n of nodes) { if (!active(n)) continue; const d = Math.hypot(n.x - x, n.y - y) - n.r; if (d < bd) { bd = d; best = n; } }
      return best;
    }
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    canvas.addEventListener('pointermove', (e) => { mouse = pos(e); const n = pick(mouse.x, mouse.y); if (n !== hover) { hover = n; setTip(); } canvas.style.cursor = n ? 'pointer' : ''; if (reduced) draw(performance.now() - t0); });
    canvas.addEventListener('pointerleave', () => { mouse = null; hover = null; setTip(); if (reduced) draw(performance.now() - t0); });
    canvas.addEventListener('click', (e) => {
      const p = pos(e), n = pick(p.x, p.y);
      if (n && n.kind === 'cat') { api.onCat && api.onCat(n.id); return; }
      pinned = n && n.kind === 'leaf' && n !== pinned ? n : null; hover = n; setTip(); if (reduced) draw(performance.now() - t0);
    });
    function size() {
      const r = canvas.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(200, r.width); H = Math.max(200, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      nodes.forEach((n) => { if (n.kind === 'leaf') { n.x = 0; n.y = 0; } });
      draw(performance.now() - t0);
    }
    const ro = new ResizeObserver(size); ro.observe(canvas);
    function loop(now) {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      draw(now - t0);
    }
    if (!reduced) raf = requestAnimationFrame(loop);
    setTip();
    const api = {
      onCat: null,
      refresh() { if (reduced) draw(performance.now() - t0); },
      select(name) { const n = name ? byName.get(name) : null; hover = n || null; setTip(); if (reduced) draw(performance.now() - t0); },
      pin(name) { const n = byName.get(name); pinned = n && n !== pinned ? n : null; setTip(); if (reduced) draw(performance.now() - t0); },
      dispose() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); }
    };
    return api;
  }

  // ------------------------------------------------------------------ PROJECTS
  function renderProjects(opts) {
    let filter = 'all';
    const list = h('div', { style: 'display:grid;gap:12px' });
    const cards = {};
    const FILTERS = [['all', 'All'], ['ai', 'AI & ML'], ['web', '3D & Web'], ['data', 'Data']];
    const seg = h('div', { class: 'pf-seg' }, FILTERS.map(([id, label]) => h('button', { type: 'button', 'data-f': id, 'aria-pressed': String(id === 'all'), onclick: () => {
      filter = id; seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === id)));
      PROJECTS.forEach((p) => { cards[p.id].hidden = id !== 'all' && p.cat !== id; });
    } }, label)));
    function toggle(id, force) {
      const el = cards[id]; const open = force != null ? force : el.dataset.open !== 'true';
      el.dataset.open = String(open); el.querySelector('.pf-proj-head').setAttribute('aria-expanded', String(open));
    }
    PROJECTS.forEach((p) => {
      const head = h('button', { type: 'button', class: 'pf-proj-head', 'aria-expanded': 'false', onclick: () => toggle(p.id) },
        h('span', { class: 'pf-proj-n', text: p.n }),
        h('span', null, h('span', { class: 'pf-proj-title', style: 'display:block' , text: p.title }),
          h('span', { class: 'pf-proj-meta' }, h('span', { class: 'y', text: p.years }), h('span', { text: p.where }))),
        h('span', { class: 'pf-chev' }, icon('chev')));
      const more = h('div', { class: 'pf-proj-more' }, h('div', null, h('div', { class: 'pf-proj-inner' },
        h('ul', null, p.bullets.map((b) => h('li', { text: b }))),
        h('div', { class: 'pf-tags' }, p.tags.map((t) => h('span', { class: 'pf-tag', text: t }))),
        h('div', { class: 'pf-actions' },
          p.lab ? h('button', { type: 'button', class: 'pf-btn sm primary', onclick: () => openPanel('lab', { tab: p.lab }) }, icon('flask'), 'Play with it in the lab') : null,
          h('button', { type: 'button', class: 'pf-btn sm', onclick: () => openPanel('ask', { q: `Tell me about the ${p.title.split(':')[0].split(' (')[0]} project` }) }, icon('spark'), 'Ask about it')))));
      cards[p.id] = h('article', { class: 'pf-proj', 'data-open': 'false', id: 'proj-' + p.id }, head, h('p', { class: 'pf-proj-sum', text: p.summary }), more);
      list.append(cards[p.id]);
    });
    toggle((opts && opts.project) || 'llm', true);
    return { node: frag(seg, list), update(o) { if (o.project) { toggle(o.project, true); cards[o.project].scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); } } };
  }

  // ------------------------------------------------------------------ LAB
  function renderLab(opts) {
    const TABS = [['llm', 'LLM memory'], ['lamp', 'Lampshade'], ['lip', 'Lip → speech']];
    let tab = null, disposeTab = null;
    const host = h('div');
    const tabs = h('div', { class: 'pf-tabs', role: 'tablist' }, TABS.map(([id, label]) => h('button', { type: 'button', role: 'tab', 'data-t': id, 'aria-selected': 'false', onclick: () => show(id) }, label)));
    function show(id) {
      if (tab === id) return;
      if (disposeTab) { disposeTab(); disposeTab = null; }
      tab = id;
      tabs.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.t === id)));
      const r = id === 'llm' ? labLLM() : id === 'lamp' ? labLamp() : labLip();
      host.replaceChildren(r.node); disposeTab = r.dispose;
    }
    show((opts && opts.tab) || 'llm');
    return { node: frag(tabs, host), dispose() { if (disposeTab) disposeTab(); }, update(o) { if (o.tab) show(o.tab); } };
  }

  // --- LLM memory budget (rough estimate, same knobs I tuned on the phone)
  function labLLM() {
    const MODELS = {
      llama: { name: 'Llama 3.2 1B', file: 'Llama-3.2-1B-Instruct', params: 1.24, layers: 16, kvHeads: 8, headDim: 64, ctxDef: 2048 },
      phi: { name: 'Phi-3.5-mini', file: 'Phi-3.5-mini-instruct', params: 3.82, layers: 32, kvHeads: 32, headDim: 96, ctxDef: 1024 }
    };
    const QUANTS = { Q3_K_M: 3.9, Q4_K_M: 4.85, Q5_K_M: 5.7, Q8_0: 8.5 };
    const DEVICES = { 4: 1.4, 6: 1.9, 8: 2.4 };   // GB the OS and other apps keep
    const S = { model: 'llama', quant: 'Q4_K_M', ram: 4, ctx: 2048, batch: 256, threads: 4 };
    const GB = 1024 ** 3;
    const out = h('div', { class: 'pf-meter' });
    const cmd = h('pre', { class: 'pf-code' });
    const copyBtn = h('button', { type: 'button', class: 'pf-icon-btn', 'aria-label': 'Copy command', onclick: () => copyText(cmd.firstChild.textContent, 'Command copied') }, icon('copy'));
    function group(label, key, map, fmt) {
      const row = h('div', { class: 'pf-select', role: 'group', 'aria-label': label });
      Object.keys(map).forEach((k) => row.append(h('button', { type: 'button', 'data-k': k, 'aria-pressed': String(String(S[key]) === k), onclick: () => {
        S[key] = key === 'ram' ? Number(k) : k;
        if (key === 'model') { S.ctx = MODELS[k].ctxDef; sliders.ctx.value = S.ctx; pct(sliders.ctx); }
        row.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
        update();
      } }, fmt ? fmt(k) : k)));
      return h('div', { class: 'pf-field' }, h('span', { class: 'lbl', text: label }), row);
    }
    const sliders = {};
    function slider(label, key, min, max, step, fmt) {
      const o = h('output', { text: fmt(S[key]) });
      const inp = h('input', { type: 'range', min, max, step, value: S[key], 'aria-label': label });
      pct(inp);
      inp.addEventListener('input', () => { S[key] = Number(inp.value); o.textContent = fmt(S[key]); pct(inp); update(); });
      sliders[key] = inp; inp.out = o; inp.fmt = fmt;
      return h('div', { class: 'pf-field' }, h('label', null, h('span', { text: label }), o), inp);
    }
    function update() {
      const m = MODELS[S.model];
      sliders.ctx.out.textContent = sliders.ctx.fmt(S.ctx);
      const weights = (m.params * 1e9 * QUANTS[S.quant]) / 8 / GB;
      const kv = (2 * m.layers * m.kvHeads * m.headDim * 2 * S.ctx) / GB;
      const compute = (0.1 + (S.batch / 512) * 0.2) * (m.params > 2 ? 1.4 : 1);
      const os = DEVICES[S.ram], total = weights + kv + compute, usable = S.ram - os, ratio = total / usable;
      const free = Math.max(0, usable - total);
      const seg = (c, v, name) => ({ c, v, name });
      const parts = [seg('#ff4d1c', weights, 'Weights'), seg('#ff9a3c', kv, 'KV cache'), seg('#ffd27a', compute, 'Compute'), seg('#3a2a20', free, 'Free'), seg('#6b3a22', os, 'OS + apps')];
      const v = ratio <= 0.8 ? 'ok' : ratio <= 1.05 ? 'tight' : 'oom';
      const msg = v === 'ok' ? `Comfortable: needs about ${total.toFixed(2)} GB of the ${usable.toFixed(1)} GB the phone can spare.`
        : v === 'tight' ? `Tight: ${total.toFixed(2)} of ${usable.toFixed(1)} GB. One background app could get it killed, so trim context or batch.`
          : `Won’t fit: ${total.toFixed(2)} GB wanted, ${usable.toFixed(1)} GB available. Lower the context, batch or quantization.`;
      out.replaceChildren(
        h('div', { class: 'pf-meter-bar', role: 'img', 'aria-label': `Estimated memory ${total.toFixed(2)} gigabytes of ${S.ram} gigabytes` },
          parts.map((p) => h('span', { style: `flex:${Math.max(p.v, 0.0001)} 1 0%;background:${p.c}`, title: `${p.name} ${p.v.toFixed(2)} GB` }))),
        h('div', { class: 'pf-legend' }, parts.map((p) => h('span', null, h('i', { vars: { '--c': p.c } }), p.name, h('b', { text: p.v.toFixed(2) + ' GB' })))),
        h('div', { class: 'pf-verdict', 'data-v': v }, icon(v === 'ok' ? 'check' : 'alert'), h('span', { text: msg })));
      cmd.replaceChildren(document.createTextNode(`./llama-cli -m ${m.file}-${S.quant}.gguf -c ${S.ctx} -b ${S.batch} -t ${S.threads}`), copyBtn);
    }
    const node = h('div', { class: 'pf-lab' },
      h('p', { class: 'pf-p' }, rich('Running a model on a **4GB phone** is a budgeting problem. These are the three knobs I tuned in Termux: **context length**, **batch size** and **CPU threads**. Move them and watch the memory.')),
      h('div', { class: 'pf-field' }, h('span', { class: 'lbl', text: 'Model' }), (() => {
        const row = h('div', { class: 'pf-select' });
        Object.entries(MODELS).forEach(([k, m]) => row.append(h('button', { type: 'button', 'data-k': k, 'aria-pressed': String(k === S.model), onclick: () => {
          S.model = k; S.ctx = m.ctxDef; sliders.ctx.value = S.ctx; pct(sliders.ctx);
          row.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === k))); update();
        } }, m.name)));
        return row;
      })()),
      h('div', { class: 'pf-ctrl-row' }, group('Quantization', 'quant', QUANTS), group('Phone RAM', 'ram', DEVICES, (k) => k + ' GB')),
      slider('Context length', 'ctx', 512, 8192, 256, (v) => v.toLocaleString('en-US') + ' tokens'),
      h('div', { class: 'pf-ctrl-row' }, slider('Batch size', 'batch', 64, 1024, 64, (v) => String(v)), slider('CPU threads', 'threads', 1, 8, 1, (v) => String(v))),
      out,
      h('div', { class: 'pf-field' }, h('span', { class: 'lbl', text: 'The llama.cpp command for these settings' }), cmd),
      h('p', { class: 'pf-note', text: 'Rough estimate (weights + fp16 KV cache + a compute buffer) from published model shapes. Real usage shifts with mmap, KV quantization and the Android version. Threads change speed, not memory: match them to the fast cores.' }));
    update();
    return { node };
  }

  // --- Parametric lampshade (Three.js, same four sliders as the standalone tool)
  function labLamp() {
    const stage = h('div', { class: 'pf-stage3d', 'aria-label': 'Interactive 3D lampshade: drag to rotate', role: 'img' });
    const S = { radius: 1.6, ribs: 12, twist: 0.5, height: 3.2, wire: false };
    const sliders = [];
    function slider(label, key, min, max, step, fmt) {
      const o = h('output', { text: fmt(S[key]) });
      const inp = h('input', { type: 'range', min, max, step, value: S[key], 'aria-label': label }); pct(inp);
      inp.addEventListener('input', () => { S[key] = Number(inp.value); o.textContent = fmt(S[key]); pct(inp); rebuild(); });
      return h('div', { class: 'pf-field' }, h('label', null, h('span', { text: label }), o), inp);
    }
    const wireBtn = h('button', { type: 'button', class: 'pf-btn sm', 'aria-pressed': 'false', onclick: () => { S.wire = !S.wire; wireBtn.setAttribute('aria-pressed', String(S.wire)); mat.wireframe = S.wire; } }, icon('cube'), 'Wireframe');
    let renderer, scene, camera, mesh, mat, rafId = 0, alive = true, ro, rotY = 0.5, rotX = 0.25, drag = null, lamp;
    function build() {
      if (!window.THREE) { stage.append(h('p', { class: 'pf-note', style: 'padding:18px', text: '3D library did not load.' })); return; }
      const T = window.THREE;
      try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' }); } catch (e) { stage.append(h('p', { class: 'pf-note', style: 'padding:18px', text: 'WebGL is unavailable here.' })); return; }
      renderer.setPixelRatio(Math.min(isNarrow() ? 1.5 : 2, window.devicePixelRatio || 1));
      renderer.setClearColor(0x000000, 0);
      stage.append(renderer.domElement);
      renderer.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); alive = false; stage.replaceChildren(h('p', { class: 'pf-note', style: 'padding:18px', text: 'The 3D preview was paused by your device. Reopen this tab to restart it.' })); });
      scene = new T.Scene();
      camera = new T.PerspectiveCamera(36, 1, 0.1, 50); camera.position.set(0, 0.4, 9);
      scene.add(new T.AmbientLight(0xffd2b0, 0.5));
      const key = new T.DirectionalLight(0xffc08a, 1.1); key.position.set(4, 5, 6); scene.add(key);
      const inner = new T.PointLight(0xff7a22, 2.2, 14, 1.6); scene.add(inner);
      mat = new T.MeshStandardMaterial({ color: 0xff9a55, emissive: 0xff4d12, emissiveIntensity: 0.32, roughness: 0.5, metalness: 0.05, side: T.DoubleSide, transparent: true, opacity: 0.93, wireframe: S.wire });
      lamp = new T.Group(); scene.add(lamp);
      rebuild();
      const base = new T.Mesh(new T.CylinderGeometry(0.25, 0.4, 0.12, 24), new T.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.6 }));
      base.userData.base = true; lamp.add(base);
      stage._inner = inner; stage._base = base;
      const rs = () => { const r = stage.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); };
      ro = new ResizeObserver(rs); ro.observe(stage); rs();
      stage.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; stage.setPointerCapture(e.pointerId); });
      stage.addEventListener('pointermove', (e) => { if (!drag) return; rotY += (e.clientX - drag.x) * 0.01; rotX = clamp(rotX + (e.clientY - drag.y) * 0.006, -0.9, 0.9); drag = { x: e.clientX, y: e.clientY }; });
      const end = () => { drag = null; };
      stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
      const loop = () => {
        if (!alive) return; rafId = requestAnimationFrame(loop);
        if (document.hidden) return;
        if (!drag && !reduced) rotY += 0.006;
        lamp.rotation.y = rotY; lamp.rotation.x = rotX;
        renderer.render(scene, camera);
      };
      loop();
    }
    function rebuild() {
      if (!window.THREE || !lamp) return;
      const T = window.THREE, U = 140, V = 56, pos = new Float32Array((U + 1) * (V + 1) * 3), idx = [];
      for (let j = 0; j <= V; j++) {
        const v = j / V, prof = 1 - 0.3 * Math.pow(2 * v - 1, 2), y = (v - 0.5) * S.height;
        for (let i = 0; i <= U; i++) {
          const th = (i / U) * Math.PI * 2, r = S.radius * prof * (1 + 0.1 * Math.cos(S.ribs * (th + S.twist * Math.PI * 2 * v)));
          const k = (j * (U + 1) + i) * 3; pos[k] = Math.cos(th) * r; pos[k + 1] = y; pos[k + 2] = Math.sin(th) * r;
        }
      }
      for (let j = 0; j < V; j++) for (let i = 0; i < U; i++) { const a = j * (U + 1) + i, b = a + 1, c = a + U + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      if (mesh) { lamp.remove(mesh); mesh.geometry.dispose(); }
      mesh = new T.Mesh(g, mat); lamp.add(mesh);
      if (stage._base) stage._base.position.y = -S.height / 2 - 0.05;
      camera.position.z = Math.max(8, S.height * 2.2 + S.radius * 2);
    }
    build();
    const node = h('div', { class: 'pf-lab' },
      h('p', { class: 'pf-p' }, rich('The lampshade tool from the CV, shrunk into this panel: a **procedural mesh rebuilt every time you move a slider**. Drag the lamp to spin it.')),
      stage,
      h('div', { class: 'pf-ctrl-row' }, slider('Radius', 'radius', 0.8, 2.6, 0.05, (v) => v.toFixed(2)), slider('Height', 'height', 1.5, 5, 0.1, (v) => v.toFixed(1))),
      h('div', { class: 'pf-ctrl-row' }, slider('Ribs', 'ribs', 3, 28, 1, (v) => String(v)), slider('Twist', 'twist', 0, 3, 0.05, (v) => v.toFixed(2) + ' turns')),
      h('div', { class: 'pf-actions' }, wireBtn,
        h('button', { type: 'button', class: 'pf-btn sm', onclick: () => { Object.assign(S, { radius: 1.6, ribs: 12, twist: 0.5, height: 3.2 }); node.querySelectorAll('input[type=range]').forEach((r, i) => { r.value = [1.6, 3.2, 12, 0.5][i]; r.dispatchEvent(new Event('input')); }); } }, 'Reset')));
    return {
      node, dispose() {
        alive = false; cancelAnimationFrame(rafId); if (ro) ro.disconnect();
        if (mesh) mesh.geometry.dispose(); if (mat) mat.dispose();
        if (renderer) { renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss(); }
      }
    };
  }

  // --- Lip-to-speech: illustrative animation of the pipeline (not model output)
  function labLip() {
    const cv = h('canvas', { 'aria-label': 'Animated illustration: a mouth region feeds a model that outputs a mel-spectrogram', role: 'img' });
    const STEPS = ['Silent video', 'Mouth crop', 'Neural encoder', 'Mel-spectrogram', 'Speech'];
    const stepEls = STEPS.map((s) => h('span', { class: 'pf-step', text: s }));
    let playing = !reduced, alive = true, raf = 0, ro, W = 0, H = 0, dpr = 1, t = 0, last = 0;
    const spec = document.createElement('canvas'); const sctx = spec.getContext('2d');
    const BINS = 56;
    const playBtn = h('button', { type: 'button', class: 'pf-btn sm', onclick: () => { playing = !playing; playBtn.replaceChildren(icon(playing ? 'pause' : 'play'), playing ? 'Pause' : 'Play'); if (playing) { last = performance.now(); loop(last); } } }, icon(playing ? 'pause' : 'play'), playing ? 'Pause' : 'Play');
    const VOW = [[730, 1090], [270, 2290], [300, 870], [530, 1840], [660, 1720], [390, 990]];
    const env = (x) => { const s = Math.sin(x * 3.4) * 0.5 + 0.5, g = Math.sin(x * 0.9 + 1) * 0.5 + 0.5; return Math.sin(x * 0.37) > -0.6 ? (0.22 + 0.78 * Math.pow(s, 1.2)) * (0.55 + 0.45 * g) : 0.03; };
    function fire(v) { // black -> red -> orange -> pale yellow
      v = clamp(v, 0, 1);
      return `rgb(${Math.round(255 * clamp(v * 2.1, 0, 1))},${Math.round(255 * clamp((v - 0.35) * 1.8, 0, 1) * 0.85)},${Math.round(255 * clamp((v - 0.75) * 3, 0, 1) * 0.7)})`;
    }
    function size() {
      const r = cv.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const sw = Math.max(40, Math.round(W * 0.5 / 2));
      if (spec.width !== sw || spec.height !== BINS) {
        spec.width = sw; spec.height = BINS; sctx.fillStyle = '#080302'; sctx.fillRect(0, 0, sw, BINS);
        const keep = t; for (let i = 0; i < sw; i++) { t += 0.018; column(); } t = keep + sw * 0.018;
      }
      drawFrame();
    }
    function column() {
      const syl = Math.floor(t * 2.6), [f1, f2] = VOW[syl % VOW.length], e = env(t);
      spec.getContext('2d').drawImage(spec, -1, 0);
      const f0 = 105 + 22 * Math.sin(t * 1.7);
      for (let b = 0; b < BINS; b++) {
        const f = (1 - b / BINS) * 4000; let a = 0;
        for (let k = 1; k < 38; k++) { const d = (f - k * f0) / 38; if (Math.abs(d) < 4) a += Math.exp(-d * d); }
        const form = Math.exp(-Math.pow((f - f1) / 300, 2)) + 0.8 * Math.exp(-Math.pow((f - f2) / 420, 2)) + 0.18 * Math.exp(-f / 2500);
        const v = Math.pow(e, 0.55) * clamp((0.35 + a * 0.75) * form * 1.5, 0, 1) + Math.random() * 0.04 * e;
        sctx.fillStyle = fire(v); sctx.fillRect(spec.width - 1, b, 1, 1);
      }
    }
    function drawFrame() {
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
      const e = env(t), open = e;
      const mx = W * 0.17, my = H * 0.5, rw = Math.min(W * 0.2, 90);
      // ROI frame
      c.strokeStyle = 'rgba(255,170,105,.45)'; c.lineWidth = 1; c.setLineDash([4, 4]); c.strokeRect(mx - rw / 2 - 8, my - rw / 2 - 8, rw + 16, rw + 16); c.setLineDash([]);
      c.fillStyle = 'rgba(255,170,105,.7)'; c.font = '500 10px "JetBrains Mono", monospace'; c.textAlign = 'center'; c.fillText('mouth ROI', mx, my - rw / 2 - 16);
      // lips
      const lw = rw * 0.5, lh = 4 + open * rw * 0.4;
      const g = c.createRadialGradient(mx, my, 2, mx, my, lw); g.addColorStop(0, '#1a0604'); g.addColorStop(1, '#4a1208');
      c.fillStyle = g; c.beginPath(); c.ellipse(mx, my, lw, lh, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,240,225,.85)'; c.fillRect(mx - lw * 0.55, my - lh + 2, lw * 1.1, Math.min(7, lh * 0.35));
      c.strokeStyle = '#ff6a3a'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.ellipse(mx, my, lw, lh, 0, 0, 7); c.stroke();
      // flow
      const fx0 = W * 0.285, fx1 = W * 0.335;
      for (let i = 0; i < 6; i++) { const p = ((t * 1.4 + i / 6) % 1), x = fx0 + (fx1 - fx0) * p; c.globalAlpha = Math.sin(Math.PI * p); c.fillStyle = '#ffb45e'; c.beginPath(); c.arc(x, my + Math.sin(p * 9 + i) * 10, 2.4, 0, 7); c.fill(); }
      for (let i = 0; i < 5; i++) { const p = ((t * 1.4 + i / 5 + 0.3) % 1), x = W * 0.425 + (W * 0.045) * p; c.globalAlpha = Math.sin(Math.PI * p); c.fillStyle = '#ffd79a'; c.beginPath(); c.arc(x, my + Math.sin(p * 7 + i) * 14, 2.2, 0, 7); c.fill(); }
      c.globalAlpha = 1;
      const bx = W * 0.335, bw = W * 0.09;
      c.strokeStyle = 'rgba(255,170,105,.5)'; c.lineWidth = 1.2; c.strokeRect(bx, my - 26, bw, 52);
      c.fillStyle = 'rgba(255,140,50,.12)'; c.fillRect(bx, my - 26, bw, 52);
      // spectrogram
      const sx = W * 0.47, sw = W * 0.5, sh = H * 0.62, sy = (H - sh) / 2;
      c.imageSmoothingEnabled = true; c.drawImage(spec, sx, sy, sw, sh);
      c.strokeStyle = 'rgba(255,170,105,.4)'; c.strokeRect(sx, sy, sw, sh);
      c.fillStyle = 'rgba(255,170,105,.7)'; c.textAlign = 'left'; c.fillText('predicted mel-spectrogram', sx, sy - 8);
      c.textAlign = 'right'; c.fillText('time →', sx + sw, sy + sh + 16);
    }
    function loop(now) {
      if (!alive || !playing) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      const cols = Math.max(1, Math.round(dt * 60 * 1.3));
      for (let i = 0; i < cols; i++) column();
      const s = Math.floor((t / 1.1) % STEPS.length); stepEls.forEach((el, i) => el.classList.toggle('on', i === s));
      drawFrame();
    }
    const node = h('div', { class: 'pf-lab' },
      h('p', { class: 'pf-p' }, rich('My lip-to-speech project reads **silent video of a mouth** and predicts the **mel-spectrogram** of what was said, which a vocoder turns into speech. This is an **illustration of the pipeline**, not output from the trained model.')),
      h('div', { class: 'pf-pipe' }, cv),
      h('div', { class: 'pf-steps' }, stepEls),
      h('div', { class: 'pf-actions' }, playBtn),
      h('p', { class: 'pf-note', text: 'Preprocessing in the real project: extract frames, crop the mouth region, and align each clip with its ground-truth audio spectrogram for training.' }));
    ro = new ResizeObserver(size);
    requestAnimationFrame(() => { size(); ro.observe(cv); if (playing) { last = performance.now(); loop(last); } });
    return { node, dispose() { alive = false; cancelAnimationFrame(raf); if (ro) ro.disconnect(); } };
  }

  // ------------------------------------------------------------------ CONTACT
  function renderContact() {
    const name = h('input', { type: 'text', placeholder: 'Your name', maxlength: 60, autocomplete: 'name', 'aria-label': 'Your name' });
    const msg = h('textarea', { placeholder: 'What are you building?', maxlength: 800, 'aria-label': 'Message' });
    const form = h('form', { class: 'pf-form', onsubmit: (e) => {
      e.preventDefault();
      const subject = encodeURIComponent('Hello from your portfolio' + (name.value.trim() ? ' – ' + name.value.trim() : ''));
      const text = encodeURIComponent(msg.value.trim() || 'Hi Nagun,');
      window.location.href = `mailto:${ME.email}?subject=${subject}&body=${text}`;
    } }, name, msg, h('button', { type: 'submit', class: 'pf-btn primary' }, icon('mail'), 'Open in my email app'), h('p', { class: 'pf-note', text: 'This opens your own email app with the message filled in. Nothing is sent through this site.' }));
    return frag(
      h('div', { class: 'pf-cta' }, h('h3', { text: 'Got a model that’s too big, or an idea that’s too small?' }),
        h('p', { class: 'pf-p', text: 'I’m always up for AI on constrained hardware, speech, and interactive 3D. The fastest way to reach me is email.' }),
        h('div', { class: 'pf-mail' }, h('code', { text: ME.email }),
          h('button', { type: 'button', class: 'pf-btn sm primary', onclick: () => copyText(ME.email, 'Email copied') }, icon('copy'), 'Copy'),
          h('a', { class: 'pf-btn sm', href: 'mailto:' + ME.email }, icon('mail'), 'Write'))),
      h('div', { class: 'pf-links' },
        h('a', { class: 'pf-link', href: ME.github, target: '_blank', rel: 'noopener noreferrer' }, icon('github'), h('span', null, h('strong', { text: 'GitHub' }), h('small', { text: 'github.com/Nagun003' }))),
        h('a', { class: 'pf-link', href: ME.linkedin, target: '_blank', rel: 'noopener noreferrer' }, icon('linkedin'), h('span', null, h('strong', { text: 'LinkedIn' }), h('small', { text: 'in/nagun-haridasan' })))),
      h('div', { class: 'pf-interest' }, icon('pin'), h('span', { text: ME.place })),
      h('div', null, h('p', { class: 'pf-h3', text: 'Say hello' }), form),
      h('p', { class: 'pf-foot', text: 'Built with Three.js · Fire theme · © 2026 Nagun Haridasan' }));
  }

  // ------------------------------------------------------------------ ASK (local assistant: answers come only from the CV)
  const KB = [
    { id: 'hello', kw: ['hello', 'hi ', 'hey', 'good morning', 'good evening', 'sup'], a: 'Hi! I’m the assistant for this portfolio. I know **Nagun Haridasan’s CV**: projects, skills, education and how to get in touch. Try one of the questions below.', go: [['projects', 'See projects'], ['skills', 'See skills']] },
    { id: 'about', kw: ['who is', 'who are', 'about', 'introduce', 'summary', 'tell me about nagun', 'background', 'profile', 'overview'], a: '**Nagun Haridasan** is an AI / ML engineer from Bengaluru with a B.E. in Computer Science & Engineering (AI & ML) from AMC Engineering College (VTU), 2021–2025. The through-line in the work: **make AI small enough to run anywhere**, from 4-bit language models on a 4GB phone to 3D tools in a single browser tab.', go: [['about', 'Open About'], ['projects', 'See projects']] },
    { id: 'projects', kw: ['project', 'built', 'build', 'portfolio', 'work on', 'made', 'created', 'showcase', 'look at first', 'best'], a: 'There are five projects (2024–2026):\n**1.** Local LLM inference & voice cloning on an Android phone\n**2.** Browser 3D studios: a parametric lampshade generator and an aquarium simulator\n**3.** Lip-to-speech synthesis from silent video\n**4.** Twitter (X) engagement dashboard in Power BI\n**5.** Stock price time-series forecasting\nIf you only look at one, make it **#1**: it’s the one that stretches the hardware the most.', go: [['projects', 'Open projects'], ['lab', 'Try the lab']] },
    { id: 'llm', kw: ['llm', 'llama', 'gemma', 'phi', 'local', 'on-device', 'on device', 'termux', 'android', '4gb', 'ram', 'quantiz', 'gguf', 'llama.cpp', 'slm', 'small language', 'inference', 'offline'], a: 'Nagun compiled **llama.cpp** in Termux and ran **4-bit quantized Llama 3.2 1B, Gemma 4 and Phi-3.5-mini** on a **4GB RAM Android phone**. To avoid out-of-memory crashes the work was tuning **context length, batch size and CPU threads**. The models were also wired to **MCP tools** and shell scripts to automate on-device tasks, including custom screen-recording utilities.', go: [['lab', 'Memory calculator'], ['projects', 'Open project']], lab: 'llm', project: 'llm' },
    { id: 'voice', kw: ['voice', 'tts', 'text to speech', 'text-to-speech', 'xtts', 'coqui', 'clone', 'cloning', 'speech synth'], a: 'On-device, Nagun set up **voice cloning and text-to-speech with Coqui XTTS-v2**, using custom reference audio samples, alongside the local language models.', go: [['projects', 'Open project']], project: 'llm' },
    { id: 'lip', kw: ['lip', 'silent video', 'mel', 'spectrogram', 'librosa', 'opencv', 'deep learning', 'video to speech'], a: 'The **lip-to-speech** project takes **silent video of a speaker’s lips** and predicts the audio **mel-spectrogram** to synthesize intelligible speech. Nagun wrote the preprocessing too: frame extraction, mouth-region cropping, and alignment with ground-truth spectrograms. Stack: Python, deep learning, OpenCV, Librosa.', go: [['lab', 'Watch the pipeline'], ['projects', 'Open project']], lab: 'lip', project: 'lip' },
    { id: '3d', kw: ['three', 'webgl', '3d', 'lamp', 'aquarium', 'tank', 'shader', 'graphics', 'canvas', 'procedural', 'browser'], a: 'Two single-file **Three.js** tools: a **parametric lampshade generator** (procedural meshes rebuilt live from radius, ribs, twist and height sliders) and an **interactive planted aquarium simulator** with lighting controls, water-surface shaders, hardscape placement and orbit camera. This very site’s block wall is Three.js too.', go: [['lab', 'Try the lampshade'], ['projects', 'Open project']], lab: 'lamp', project: 'studios' },
    { id: 'data', kw: ['power bi', 'powerbi', 'dax', 'twitter', 'tweet', 'dashboard', 'analytics', 'power query', 'excel', 'bi ', 'business intelligence'], a: 'Nagun cleaned raw tweet exports in **Power Query** and built an interactive **Power BI** dashboard for impressions, engagement rate, link clicks and best posting times, with custom **DAX** measures and calculated columns to slice by date range and content type.', go: [['projects', 'Open project']], project: 'twitter' },
    { id: 'stock', kw: ['stock', 'forecast', 'time series', 'time-series', 'regression', 'rmse', 'mae', 'scikit', 'sklearn', 'pandas', 'prediction'], a: 'The **stock forecasting** project trained regression models on historical **OHLCV** data with moving-average and rolling-volatility features, then compared **RMSE and MAE** across models (Python, Scikit-Learn, Pandas, Matplotlib).', go: [['projects', 'Open project']], project: 'stock' },
    { id: 'skills', kw: ['skill', 'stack', 'tech', 'technolog', 'tools', 'programming', 'language do', 'languages do', 'proficien', 'know how', 'expert', 'python', 'c++', 'javascript', 'sql'], a: '**Languages:** Python, SQL, C++, JavaScript (ES6+), HTML5/CSS3, Bash.\n**AI / ML / speech:** deep learning, local LLM inference (llama.cpp, GGUF), small language models, voice cloning & TTS, computer vision, NLP, MCP.\n**3D & web:** Three.js, WebGL, Canvas, procedural geometry, REST APIs.\n**Data & BI:** Power BI, DAX, Power Query, Pandas, NumPy, Scikit-Learn, Excel.\n**Systems:** Git/GitHub, Linux/Termux, Android ADB, GCP Cloud Run, ESP32.', go: [['skills', 'Open constellation']] },
    { id: 'edu', kw: ['education', 'college', 'degree', 'university', 'study', 'studied', 'vtu', 'amc', 'graduat', 'b.e', 'coursework', 'course', 'qualification', 'batch'], a: '**B.E. in Computer Science & Engineering (AI & ML)**, AMC Engineering College, Bengaluru (affiliated to VTU), **2021–2025**. Coursework: deep learning, machine learning, computer vision, NLP, DBMS (SQL), data structures & algorithms, operating systems.', go: [['about', 'Open About']] },
    { id: 'spoken', kw: ['speak', 'spoken', 'kannada', 'malayalam', 'tamil', 'hindi', 'english', 'human language', 'multilingual'], a: 'English (fluent), Kannada (native), Malayalam (fluent), Tamil (conversational) and Hindi (conversational).', go: [['about', 'Open About']] },
    { id: 'hobby', kw: ['hobby', 'hobbies', 'interest', 'free time', 'outside', 'fun', 'aquascap', 'photograph', 'spider', 'paint', 'draw', 'swim', 'personal'], a: 'Away from the keyboard: **freshwater aquascaping** and planted-tank care, **macro photography** of jumping and lynx spiders, drawing & painting, and swimming.', go: [['about', 'Open About']] },
    { id: 'contact', kw: ['contact', 'email', 'mail', 'reach', 'hire', 'hiring', 'job', 'opportunit', 'collaborat', 'talk', 'connect', 'message', 'get in touch'], a: 'Best way is email: **' + ME.email + '**. You can also find Nagun on GitHub (**Nagun003**) and LinkedIn (**nagun-haridasan**).', go: [['contact', 'Open contact']] },
    { id: 'links', kw: ['github', 'linkedin', 'link', 'profile', 'social', 'repo', 'code'], a: 'GitHub: **github.com/Nagun003** · LinkedIn: **linkedin.com/in/nagun-haridasan**.', go: [['contact', 'Open contact']] },
    { id: 'where', kw: ['where', 'location', 'based', 'city', 'bengaluru', 'bangalore', 'live', 'relocat', 'remote'], a: 'Nagun is based in **Begur, Bengaluru, Karnataka**, India. Anything about relocation or remote work isn’t on the CV, so ask by email.', go: [['contact', 'Open contact']] },
    { id: 'exp', kw: ['experience', 'intern', 'employment', 'worked', 'company', 'years', 'previous', 'professional'], a: 'The CV lists **no formal employment**, only hands-on projects from 2024 to 2026, including real work on constrained hardware and speech models. Education finished in 2025.', go: [['projects', 'See projects']] },
    { id: 'cv', kw: ['resume', 'cv', 'curriculum', 'pdf', 'download'], a: 'Everything on this site is taken from Nagun’s CV. For the PDF itself, just ask by email.', go: [['contact', 'Open contact']] },
    { id: 'unknown-biz', kw: ['salary', 'ctc', 'notice', 'available', 'availability', 'expect', 'visa', 'age', 'married', 'phone', 'number', 'whatsapp'], a: 'That isn’t on the CV, so I won’t guess. Email Nagun and ask directly.', go: [['contact', 'Open contact']] },
    { id: 'mcp', kw: ['mcp', 'model context', 'agent', 'automation', 'tool use'], a: 'Nagun connected local model instances to **Model Context Protocol (MCP) tools** and shell scripts to automate on-device tasks, for example custom Android screen-recording utilities.', go: [['projects', 'Open project']], project: 'llm' },
    { id: 'hardware', kw: ['esp32', 'gcp', 'cloud run', 'cloud', 'adb', 'embedded', 'hardware', 'linux', 'git'], a: 'Under **systems & hardware** the CV lists Git/GitHub, Linux and Termux CLI, Android ADB, Google Cloud Platform (Cloud Run) and ESP32.', go: [['skills', 'Open skills']] },
    { id: 'site', kw: ['this site', 'this website', 'how was', 'made with', 'theme', 'fire', 'blocks', 'wall', 'assistant', 'chatbot', 'are you ai', 'are you real', 'gpt', 'claude'], a: 'This site is one HTML file: a **Three.js** wall of molten blocks plus a hand-built UI layer. I’m not a cloud model: I’m a small **retrieval script running in your browser**, answering only from the CV. No server, no API calls.', go: [['lab', 'Open the lab']] }
  ];
  const STOP = /[^a-z0-9+#.\- ]/g;
  function answer(q) {
    const s = ' ' + q.toLowerCase().replace(STOP, ' ').replace(/\s+/g, ' ') + ' ';
    let best = null, bs = 0;
    KB.forEach((e) => { let sc = 0; e.kw.forEach((k) => { if (s.includes(k.length <= 3 ? ' ' + k.trim() + ' ' : k)) sc += k.length > 4 ? 2.2 : 1.4; }); if (sc > bs) { bs = sc; best = e; } });
    if (!best || bs < 1.4) return { text: 'I only know what’s on Nagun’s CV, and I couldn’t match that. Try asking about **projects**, **skills**, **education**, the **local LLM on a 4GB phone**, or **how to get in touch**.', go: [['projects', 'See projects'], ['contact', 'Contact']], miss: true };
    return best;
  }

  const chat = []; // {role, text, go, lab, project}
  const SUGGEST = ['What have you built?', 'Can an LLM really run on 4GB?', 'What’s your tech stack?', 'How do I reach you?'];
  function renderAsk(opts) {
    const log = h('div', { class: 'pf-chat', 'aria-live': 'polite' });
    const input = h('input', { type: 'text', placeholder: 'Ask about projects, skills, stack…', maxlength: 140, 'aria-label': 'Your question', enterkeyhint: 'send', spellcheck: 'false' });
    const sendQ = (q) => { q = q.trim(); if (!q) return; input.value = ''; ask(q); };
    const form = h('form', { onsubmit: (e) => { e.preventDefault(); sendQ(input.value); } }, h('span', { class: 'pf-ask-icon', style: 'color:var(--pf-amber);display:grid' }, icon('spark')), input,
      h('button', { type: 'submit', class: 'pf-ask-send', 'aria-label': 'Send' }, icon('send')));
    let timer = 0, busy = false;
    function actionsFor(r) {
      const row = h('div', { class: 'pf-actions' });
      (r.go || []).forEach(([sec, label]) => row.append(h('button', { type: 'button', class: 'pf-btn sm', onclick: () => openPanel(sec, sec === 'lab' && r.lab ? { tab: r.lab } : sec === 'projects' && r.project ? { project: r.project } : {}) }, label)));
      return row;
    }
    function addMsg(role, text, r) {
      const bubble = h('div', { class: 'pf-bubble' });
      const m = h('div', { class: 'pf-msg ' + (role === 'me' ? 'me' : 'ai') }, role === 'ai' ? h('div', { class: 'who' }, icon('spark'), 'Portfolio AI') : null, bubble);
      log.append(m);
      if (role === 'me') bubble.textContent = text; else if (text != null) { bubble.append(rich(text)); if (r) m.append(actionsFor(r)); }
      panelBody.scrollTop = panelBody.scrollHeight;
      return { m, bubble };
    }
    function ask(q) {
      if (busy) return;
      busy = true;
      chat.push({ role: 'me', text: q }); addMsg('me', q);
      const r = answer(q);
      const ai = addMsg('ai', null);
      ai.bubble.append(h('span', { class: 'pf-dots' }, h('i'), h('i'), h('i')));
      timer = setTimeout(() => {
        ai.bubble.replaceChildren();
        const full = r.text || r.a;
        if (reduced) finish(); else {
          let i = 0; const tick = () => {
            i = Math.min(full.length, i + 3 + Math.floor(Math.random() * 3));
            ai.bubble.replaceChildren(rich(full.slice(0, i).replace(/\*\*([^*]*)$/, '$1')));   // hide a half-typed ** marker
            panelBody.scrollTop = panelBody.scrollHeight;
            if (i >= full.length) finish(); else timer = setTimeout(tick, 16);
          }; tick();
        }
        function finish() { ai.bubble.replaceChildren(rich(full)); ai.m.append(actionsFor(r)); chat.push({ role: 'ai', text: full, go: r.go, lab: r.lab, project: r.project }); busy = false; panelBody.scrollTop = panelBody.scrollHeight; }
      }, reduced ? 0 : 420 + Math.random() * 260);
    }
    // restore history
    if (!chat.length) addMsg('ai', 'Hi! I’m a small assistant that lives in your browser and answers **only from Nagun’s CV**. What would you like to know?');
    chat.forEach((c) => addMsg(c.role, c.text, c.role === 'ai' ? c : null));
    const sug = h('div', { class: 'pf-actions' }, SUGGEST.map((s) => h('button', { type: 'button', class: 'pf-chip', onclick: () => sendQ(s) }, s)));
    if (opts && opts.q) setTimeout(() => sendQ(opts.q), 250);
    return {
      node: frag(log, sug, h('p', { class: 'pf-note', text: 'Runs locally in your browser. No server, no API, and nothing you type leaves this page.' }), h('div', { class: 'pf-chatform' }, form)),
      dispose() { clearTimeout(timer); busy = false; },
      update(o) { if (o.q) sendQ(o.q); }
    };
  }

  // ------------------------------------------------------------------ command palette
  const pal = $('#pf-palette'), palQ = $('#pf-palette-q'), palList = $('#pf-palette-list');
  let palItems = [], palSel = 0, palReturn = null;
  const COMMANDS = [
    ...SECTIONS.map((s) => ({ g: 'Go to', label: s.label === 'Ask AI' ? 'Ask the AI assistant' : s.label, icon: s.icon, hint: '', kw: s.id, run: () => openPanel(s.id) })),
    { g: 'Lab', label: 'LLM memory calculator', icon: 'cpu', kw: 'llama gguf ram phone', run: () => openPanel('lab', { tab: 'llm' }) },
    { g: 'Lab', label: 'Parametric lampshade', icon: 'cube', kw: 'three webgl 3d', run: () => openPanel('lab', { tab: 'lamp' }) },
    { g: 'Lab', label: 'Lip-to-speech pipeline', icon: 'waves', kw: 'spectrogram video', run: () => openPanel('lab', { tab: 'lip' }) },
    ...PROJECTS.map((p) => ({ g: 'Projects', label: p.title.split(':')[0], icon: 'layers', hint: p.years, kw: p.tags.join(' '), run: () => openPanel('projects', { project: p.id }) })),
    { g: 'Actions', label: 'Pulse the block wall', icon: 'pulse', kw: 'shock wave', run: () => { closePanel(); window.PF3D && window.PF3D.pulse(); } },
    { g: 'Actions', label: 'Toggle sound', icon: 'volume', kw: 'mute music audio', run: () => { const b = $('#btn-audio'); if (b) b.click(); } },
    { g: 'Actions', label: 'Copy email address', icon: 'copy', hint: ME.email, kw: 'mail', run: () => copyText(ME.email, 'Email copied') },
    { g: 'Links', label: 'Open GitHub', icon: 'github', kw: 'code repo', run: () => window.open(ME.github, '_blank', 'noopener,noreferrer') },
    { g: 'Links', label: 'Open LinkedIn', icon: 'linkedin', kw: 'profile', run: () => window.open(ME.linkedin, '_blank', 'noopener,noreferrer') }
  ];
  function renderPalette() {
    const q = palQ.value.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    palItems = COMMANDS.filter((c) => words.every((w) => (c.label + ' ' + (c.kw || '') + ' ' + c.g).toLowerCase().includes(w)));
    if (q) palItems.push({ g: 'Ask', label: `Ask the assistant: “${palQ.value.trim()}”`, icon: 'spark', run: () => openPanel('ask', { q: palQ.value.trim() }) });
    palSel = 0;
    palList.replaceChildren();
    let lastG = '';
    palItems.forEach((c, i) => {
      if (c.g !== lastG) { lastG = c.g; palList.append(h('li', { class: 'grp', role: 'presentation', text: c.g })); }
      palList.append(h('li', { role: 'option', id: 'pf-opt-' + i, 'aria-selected': String(i === 0), onclick: () => runPal(i), onmousemove: () => selPal(i) }, icon(c.icon), h('span', { text: c.label }), c.hint ? h('small', { text: c.hint }) : null));
    });
  }
  function selPal(i) {
    palSel = clamp(i, 0, palItems.length - 1);
    palList.querySelectorAll('[role=option]').forEach((el) => el.setAttribute('aria-selected', String(el.id === 'pf-opt-' + palSel)));
    const el = $('#pf-opt-' + palSel, palList); if (el) el.scrollIntoView({ block: 'nearest' });
    palQ.setAttribute('aria-activedescendant', 'pf-opt-' + palSel);
  }
  function runPal(i) { const c = palItems[i]; if (!c) return; closePalette(false); c.run(); }
  function openPalette() { palReturn = document.activeElement; pal.hidden = false; palQ.value = ''; renderPalette(); palQ.focus(); }
  function closePalette(restore = true) { if (pal.hidden) return; pal.hidden = true; if (restore && palReturn && palReturn.focus) palReturn.focus(); }
  palQ.addEventListener('input', renderPalette);
  palQ.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selPal((palSel + 1) % palItems.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selPal((palSel - 1 + palItems.length) % palItems.length); }
    else if (e.key === 'Enter') { e.preventDefault(); runPal(palSel); }
  });
  $('#pf-palette-backdrop').addEventListener('click', () => closePalette());
  $('#pf-open-palette').addEventListener('click', openPalette);

  // ------------------------------------------------------------------ global keys, hero bits, boot
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? openPalette() : closePalette(); return; }
    if (e.key === 'Escape') { if (!pal.hidden) closePalette(); else if (current) closePanel(); return; }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
    if (e.key === '/' && !typing && pal.hidden) { e.preventDefault(); $('#pf-ask-input').focus(); }
  });
  window.addEventListener('hashchange', () => {
    const id = location.hash.replace(/^#\/?/, '');
    if (SEC[id]) openPanel(id); else if (!id && current) closePanel();
  });

  // ask bar + chips on the hero
  $('#pf-ask').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('#pf-ask-input'), q = inp.value.trim();
    inp.value = ''; inp.blur();
    openPanel('ask', q ? { q } : {});
  });
  NARROW.addEventListener && NARROW.addEventListener('change', () => { if (current) requestAnimationFrame(frameCamera); });
  const chipsEl = $('#pf-chips');
  SUGGEST.forEach((s) => chipsEl.append(h('button', { type: 'button', class: 'pf-chip', onclick: () => openPanel('ask', { q: s }) }, s)));

  // typed tagline
  (function typed() {
    const el = $('#pf-typed'), words = ['on a 4GB phone.', 'fully offline.', 'inside a browser tab.', 'on tiny hardware.'];
    if (reduced) { el.textContent = words[0]; return; }
    let w = 0, i = 0, del = false;
    (function tick() {
      const full = words[w];
      i += del ? -1 : 1; el.textContent = full.slice(0, i);
      let d = del ? 28 : 62;
      if (!del && i === full.length) { del = true; d = 1700; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; d = 380; }
      setTimeout(tick, d);
    })();
  })();

  // placeholders cycle
  (function placeholders() {
    const inp = $('#pf-ask-input'), list = ['Ask about projects, skills, stack…', 'Can an LLM run on 4GB of RAM?', 'What did you build with Three.js?', 'How do I get in touch?'];
    if (reduced) return;
    let i = 0; setInterval(() => { if (document.activeElement !== inp && !inp.value) inp.placeholder = list[(i = (i + 1) % list.length)]; }, 3800);
  })();

  // hint fades after the first interaction with the wall
  window.addEventListener('pointerdown', (e) => { if (!e.target.closest('[data-ui]')) $('#pf-hint').style.opacity = '0'; }, { once: true });

  // icons in the static shell
  document.querySelectorAll('[data-icon]').forEach((el) => el.append(icon(el.dataset.icon)));

  buildRail();
  const first = location.hash.replace(/^#\/?/, '');
  if (SEC[first]) setTimeout(() => openPanel(first), 700);
})();
