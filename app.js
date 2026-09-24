(() => {
  /* ===== Tema (en memoria, sin storage) ===== */
  const themeToggle = document.getElementById('themeToggle');
  function toggleTheme() {
    const root = document.documentElement;
    const dark = root.dataset.theme === 'dark';
    root.dataset.theme = dark ? 'light' : 'dark';
    themeToggle.textContent = dark ? '◐ Oscuro' : '◐ Claro';
  }

  /* ===== Capas de información (componente 09, animado) ===== */
  const scene = document.getElementById('layersScene');
  const mergeBtn = document.getElementById('mergeBtn');
  const layersSub = document.getElementById('layersSub');
  const layersStateTxt = document.getElementById('layersStateTxt');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoTimer = null;

  function setMerged(merged) {
    scene.classList.toggle('merged', merged);
    mergeBtn.textContent = merged ? 'Separar capas' : 'Fusionar capas';
    layersSub.textContent = merged ? 'vista fusionada · gemelo digital' : 'vista separada · 4 capas';
    layersStateTxt.textContent = merged ? 'Gemelo digital compuesto' : 'Componiendo gemelo digital';
  }
  function startAuto() {
    if (reduceMotion || autoTimer) return;
    autoTimer = setInterval(() => setMerged(!scene.classList.contains('merged')), 4500);
  }
  function stopAuto() {
    clearInterval(autoTimer); autoTimer = null;
  }
  function userToggleLayers() {
    stopAuto();                       /* el control pasa a la persona */
    setMerged(!scene.classList.contains('merged'));
  }

  /* arranca el ciclo automático cuando la sección entra al viewport */
  const stage = document.querySelector('.layers-stage');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { startAuto(); } });
    }, { threshold: 0.35 }).observe(stage);
  } else {
    startAuto();
  }

  /* pintar los lienzos de cada capa (idéntico al componente 09) */
  function paint(id, fn) {
    const host = document.getElementById(id);
    const cv = document.createElement('canvas'); cv.width = 300; cv.height = 220;
    fn(cv.getContext('2d'), 300, 220);
    host.appendChild(cv);
  }
  paint('lf-sat', (c, w, h) => {
    c.fillStyle = '#1a2333'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) {
      c.fillStyle = 'rgba(120,130,150,' + (Math.random() * 0.12) + ')';
      const s = 10 + Math.random() * 30;
      c.fillRect(Math.random() * w, Math.random() * h, s, s);
    }
  });
  paint('lf-bio', (c, w, h) => {
    for (let i = 0; i < 7; i++) {
      const g = c.createRadialGradient(Math.random() * w, Math.random() * h, 2, Math.random() * w, Math.random() * h, 40 + Math.random() * 40);
      g.addColorStop(0, 'rgba(123,154,102,0.7)'); g.addColorStop(1, 'rgba(123,154,102,0)');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
    }
  });
  paint('lf-water', (c, w, h) => {
    c.strokeStyle = 'rgba(107,143,184,0.75)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(0, h * 0.6);
    for (let x = 0; x <= w; x += 20) c.lineTo(x, h * 0.6 + Math.sin(x / 30) * 22);
    c.stroke();
    c.lineWidth = 2; c.beginPath(); c.moveTo(w * 0.3, 0);
    for (let y = 0; y <= h; y += 20) c.lineTo(w * 0.3 + Math.sin(y / 25) * 18, y);
    c.stroke();
  });
  paint('lf-detect', (c) => {
    const pts = [[60, 50], [180, 90], [120, 150], [230, 140], [90, 110]];
    pts.forEach(p => {
      c.fillStyle = 'rgba(232,116,60,0.9)';
      c.beginPath(); c.arc(p[0], p[1], 5, 0, 7); c.fill();
      c.strokeStyle = 'rgba(232,116,60,0.5)'; c.lineWidth = 1.5;
      c.beginPath(); c.arc(p[0], p[1], 12, 0, 7); c.stroke();
    });
  });

  themeToggle.addEventListener('click', toggleTheme);
  mergeBtn.addEventListener('click', userToggleLayers);
})();
