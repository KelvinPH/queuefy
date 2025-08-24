(function(){
  const params = new URLSearchParams(location.search);
  const ws = params.get('ws') || 'ws://localhost:5173'; // Default to localhost:5173
  const queueMax = Math.max(0, +(params.get('queueMax') || 5));
  const isDemo = params.get('demo') === 'true';
  const theme = params.get('theme') || '';
  const showArt = (params.get('showArtists') ?? 'true') !== 'false';

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

  function trunc(s, n) { 
    if (!s) return ''; 
    return s.length > n ? s.slice(0, n-1) + '…' : s; 
  }

  function renderQueue(data) {
    if (!data) { 
      list.innerHTML = ''; 
      return; 
    }

    let html = '';
    
    // Show now playing if present
    if (data.nowPlaying) {
      const title = trunc(data.nowPlaying.name || '', 48);
      const artist = showArt ? trunc((data.nowPlaying.artists?.[0]?.name) || '', 28) : '';
      const albumArt = data.nowPlaying.album?.images?.[0]?.url || '';
      const titleText = uppercase ? title.toUpperCase() : title;
      
      html += `<div class="ssq-item ssq-now-playing">
        ${albumArt ? `<div class="ssq-art-thumb"><img src="${albumArt}" alt="Album Art" /></div>` : ''}
        <div class="ssq-content">
          <div class="ssq-title">▶ Now Playing: ${titleText}</div>
          ${artist ? `<div class="ssq-artist">${artist}</div>` : ''}
        </div>
      </div>`;
    }

    // Show queue items
    if (data.next && Array.isArray(data.next)) {
      const items = data.next.slice(0, queueMax);
      items.forEach(track => {
        const title = trunc(track?.name || '', 48);
        const artist = showArt ? trunc((track?.artists?.[0]?.name) || '', 28) : '';
        const albumArt = track?.album?.images?.[0]?.url || '';
        const titleText = uppercase ? title.toUpperCase() : title;
        
        html += `<div class="ssq-item">
          ${albumArt ? `<div class="ssq-art-thumb"><img src="${albumArt}" alt="Album Art" /></div>` : ''}
          <div class="ssq-content">
            <div class="ssq-title">${titleText}</div>
            ${artist ? `<div class="ssq-artist">${artist}</div>` : ''}
          </div>
        </div>`;
      });
    }

    list.innerHTML = html;
  }

  // Demo mode - render static demo data
  if (isDemo) {
    const demoData = {
      nowPlaying: {
        name: "Midnight Drive",
        artists: [{ name: "Lumen & Co" }],
        album: { images: [{ url: "assets/demo-albumcover.jpg" }] }
      },
      next: [
        { 
          name: "Neon Skyline", 
          artists: [{ name: "City Nights" }],
          album: { images: [{ url: "assets/demo-albumcover.jpg" }] }
        },
        { 
          name: "Rainy Window", 
          artists: [{ name: "Lofigram" }],
          album: { images: [{ url: "assets/demo-albumcover.jpg" }] }
        },
        { 
          name: "Synth Bloom", 
          artists: [{ name: "Vapor Sun" }],
          album: { images: [{ url: "assets/demo-albumcover.jpg" }] }
        }
      ],
      is_playing: true,
      lastUpdated: new Date().toISOString()
    };
    
    renderQueue(demoData);
    return; // Stop here in demo mode
  }

  // WebSocket connection
  function connectWebSocket() {
    try {
      // Convert ws:// to http:// for Socket.IO
      const socketUrl = ws.replace(/^ws:\/\//, 'http://').replace(/^wss:\/\//, 'https://');
      
      const socket = io(socketUrl, { 
        transports: ['websocket'],
        path: '/socket.io'
      });

      // Listen for queue updates
      socket.on('queue:update', (data) => {
        console.log('[Queuefy] Received queue update:', data);
        renderQueue(data);
      });

      socket.on('connect', () => {
        console.log('[Queuefy] WebSocket connected to:', socketUrl);
      });

      socket.on('connect_error', (error) => {
        console.log('[Queuefy] WebSocket connection error:', error);
        // Fallback to HTTP polling
        startHttpPolling();
      });

      socket.on('disconnect', () => {
        console.log('[Queuefy] WebSocket disconnected');
      });

    } catch (error) {
      console.log('[Queuefy] WebSocket setup failed:', error);
      // Fallback to HTTP polling
      startHttpPolling();
    }
  }

  // HTTP polling fallback
  function startHttpPolling() {
    console.log('[Queuefy] Using HTTP polling fallback');
    
    async function poll() {
      try {
        const httpBase = ws.replace(/^wss?:\/\//i, m => m.toLowerCase().startsWith('wss') ? 'https' : 'http');
        const response = await fetch(httpBase + '/queue.json', { 
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          renderQueue(data);
        }
      } catch (error) {
        console.log('[Queuefy] HTTP polling failed:', error);
      }
    }

    // Poll immediately and then every 15 seconds
    poll();
    setInterval(poll, 15000);
  }

  // Start WebSocket connection
  connectWebSocket();
})();
