(function(){
  const params   = new URL(location.href).searchParams;
  const wsParam  = params.get('ws');                 // e.g. ws://localhost:5173
  const theme    = params.get('theme') || '';        // minimal|obsdark|elegant
  const showArt  = (params.get('showArtists') ?? 'true') !== 'false';
  const maxItems = Math.max(0, + (params.get('queueMax') || 5));
  const pollMs   = Math.max(3000, + (params.get('pollMs') || 15000));
  const isDemo   = (params.get('demo') === '1');

  // New styling parameters
  const radius = params.get('radius') || '12';
  const shadow = params.get('shadow') !== '0';
  const gap = params.get('gap') || '6';
  const cardColor = params.get('card') || 'rgba(0,0,0,0.35)';
  const textColor = params.get('text') || '#ffffff';
  const mutedColor = params.get('muted') || '#cfcfcf';
  const titleSize = params.get('titleSize') || '15';
  const artistSize = params.get('artistSize') || '12';
  const uppercase = params.get('uppercase') === '1';
  const align = params.get('align') || 'left';
  const font = params.get('font') || '';

  // Apply theme if specified
  if (theme) document.body.classList.add('theme-'+theme);

  // Apply custom styling via CSS variables
  const root = document.documentElement;
  root.style.setProperty('--radius', radius + 'px');
  root.style.setProperty('--shadow', shadow ? '0 6px 16px rgba(0,0,0,.25)' : 'none');
  root.style.setProperty('--gap', gap + 'px');
  root.style.setProperty('--card', cardColor);
  root.style.setProperty('--text', textColor);
  root.style.setProperty('--muted', mutedColor);
  root.style.setProperty('--title-size', titleSize + 'px');
  root.style.setProperty('--artist-size', artistSize + 'px');
  root.style.setProperty('--align', align);

  // Load custom font if specified
  if (font) {
    const fontMap = {
      'inter': 'Inter',
      'rubik': 'Rubik',
      'montserrat': 'Montserrat',
      'poppins': 'Poppins',
      'firasans': 'Fira Sans'
    };
    const fontFamily = fontMap[font] || font;
    root.style.setProperty('--font', `'${fontFamily}', system-ui, -apple-system, Segoe UI, Arial, sans-serif`);
    
    // Load Google Font if needed
    if (fontMap[font]) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;600;800&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }

  const list = document.getElementById('ssq-list');

  function trunc(s,n){ if(!s) return ''; return s.length>n ? s.slice(0,n-1)+'…' : s; }

  function render(snap){
    if (!snap || !Array.isArray(snap.next)) { list.innerHTML=''; return; }
    const items = snap.next.slice(0, maxItems);
    list.innerHTML = items.map(t => {
      const title  = trunc(t?.name || '', 48);
      const artist = showArt ? `<div class="ssq-artist">${trunc((t?.artists?.[0]?.name)||'', 28)}</div>` : '';
      const titleText = uppercase ? title.toUpperCase() : title;
      return `<div class="ssq-item">
        <div class="ssq-title">${titleText}</div>
        ${artist}
      </div>`;
    }).join('');
  }

  // --- Demo mode (no sockets, no HTTP) ---
  if (isDemo) {
    const demoTracks = [
      { name: "Midnight Drive", artists: [{ name: "Lumen & Co" }] },
      { name: "Neon Skyline", artists: [{ name: "City Nights" }] },
      { name: "Rainy Window", artists: [{ name: "Lofigram" }] },
      { name: "Synth Bloom",  artists: [{ name: "Vapor Sun" }] },
      { name: "Golden Hour",  artists: [{ name: "Horizons" }] }
    ];
    let rotate = 0;
    function snap() {
      // simulate a queue: rotate demo list
      const rotated = demoTracks.slice(rotate).concat(demoTracks.slice(0, rotate));
      return { nowPlaying: null, next: rotated };
    }
    render(snap());
    setInterval(() => { rotate = (rotate + 1) % demoTracks.length; render(snap()); }, 4000);
    return; // stop here in demo mode
  }

  function wsUrl(){
    return wsParam || 'ws://localhost:5173'; // default Queuefy app
  }

  function ensureSocketIo(done){
    if (window.io) return done();
    const s = document.createElement('script');
    s.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
    s.onload = done;
    document.head.appendChild(s);
  }

  ensureSocketIo(function(){
    try{
      const socket = window.io(wsUrl(), { transports:['websocket'], path:'/socket.io' });
      socket.on('queue:update', render);
      socket.on('connect', () => console.log('[Queuefy] WS connected'));
      socket.on('connect_error', () => console.log('[Queuefy] WS error; using HTTP fallback'));
    }catch(e){
      console.log('[Queuefy] WS failed; using HTTP fallback only');
    }
  });

  async function poll(){
    try{
      const httpBase = wsUrl().replace(/^wss?/i, m => m.toLowerCase().startsWith('wss') ? 'https' : 'http');
      const r = await fetch(httpBase + '/queue.json', { cache:'no-store' });
      render(await r.json());
    }catch(_){}
  }
  setInterval(poll, pollMs);
  poll();
})();
