(function(){
  const params = new URLSearchParams(location.search);
  const ws = params.get('ws') || 'ws://localhost:5173'; // Default to localhost:5173
  const queueMax = Math.max(0, +(params.get('queueMax') || 5));
  const isDemo = params.get('demo') === 'true';
  const theme = params.get('theme') || '';
  const showArt = (params.get('showArtists') ?? 'true') !== 'false';

  // Enhanced styling parameters
  const radius = params.get('radius') || '12';
  const shadow = params.get('shadow') !== '0';
  const gap = params.get('gap') || '6';
  const border = params.get('border') || '0';
  const opacity = params.get('opacity') || '100';
  const blur = params.get('blur') || '0';
  const glow = params.get('glow') || '0';
  const cardColor = params.get('card') || 'rgba(0,0,0,0.35)';
  const textColor = params.get('text') || '#ffffff';
  const mutedColor = params.get('muted') || '#cfcfcf';
  const accentColor = params.get('accent') || '#1db954';
  const borderColor = params.get('borderColor') || '#ffffff';
  const glowColor = params.get('glowColor') || '#00ff00';
  const align = params.get('align') || 'left';
  const layout = params.get('layout') || 'list';
  const titleSize = params.get('titleSize') || '15';
  const artistSize = params.get('artistSize') || '12';
  const lineHeight = params.get('lineHeight') || '1.4';
  const letterSpacing = params.get('letterSpacing') || '0';
  const padding = params.get('padding') || '12';
  const margin = params.get('margin') || '4';
  const font = params.get('font') || '';
  const fontWeight = params.get('fontWeight') || '400';
  const textTransform = params.get('textTransform') || 'none';
  const textShadow = params.get('textShadow') === '1';
  const animSpeed = params.get('animSpeed') || '1';
  const hoverEffect = params.get('hoverEffect') || 'none';

  // Apply theme if specified
  if (theme) document.body.classList.add('theme-'+theme);

  // Apply custom styling via CSS variables
  const root = document.documentElement;
  root.style.setProperty('--radius', radius + 'px');
  root.style.setProperty('--shadow', shadow ? '0 6px 16px rgba(0,0,0,.25)' : 'none');
  root.style.setProperty('--gap', gap + 'px');
  root.style.setProperty('--border', border + 'px');
  root.style.setProperty('--opacity', opacity + '%');
  root.style.setProperty('--blur', blur + 'px');
  root.style.setProperty('--glow', glow + 'px');
  root.style.setProperty('--card', cardColor);
  root.style.setProperty('--text', textColor);
  root.style.setProperty('--muted', mutedColor);
  root.style.setProperty('--accent', accentColor);
  root.style.setProperty('--border-color', borderColor);
  root.style.setProperty('--glow-color', glowColor);
  root.style.setProperty('--align', align);
  root.style.setProperty('--layout', layout);
  root.style.setProperty('--title-size', titleSize + 'px');
  root.style.setProperty('--artist-size', artistSize + 'px');
  root.style.setProperty('--line-height', lineHeight);
  root.style.setProperty('--letter-spacing', letterSpacing + 'px');
  root.style.setProperty('--padding', padding + 'px');
  root.style.setProperty('--margin', margin + 'px');
  root.style.setProperty('--font-weight', fontWeight);
  root.style.setProperty('--text-transform', textTransform);
  root.style.setProperty('--text-shadow', textShadow ? '0 1px 3px rgba(0,0,0,0.5)' : 'none');
  root.style.setProperty('--anim-speed', animSpeed);
  root.style.setProperty('--hover-effect', hoverEffect);

  // Load custom font if specified
  if (font) {
    const fontMap = {
      'inter': 'Inter',
      'rubik': 'Rubik',
      'montserrat': 'Montserrat',
      'poppins': 'Poppins',
      'firasans': 'Fira Sans',
      'roboto': 'Roboto',
      'opensans': 'Open Sans',
      'lato': 'Lato',
      'nunito': 'Nunito',
      'quicksand': 'Quicksand',
      'raleway': 'Raleway',
      'source': 'Source Sans Pro',
      'ubuntu': 'Ubuntu',
      'oxygen': 'Oxygen',
      'cabin': 'Cabin',
      'josefin': 'Josefin Sans',
      'dancing': 'Dancing Script',
      'pacifico': 'Pacifico',
      'mono': 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
    };
    const fontFamily = fontMap[font] || font;
    root.style.setProperty('--font', `'${fontFamily}', system-ui, -apple-system, Segoe UI, Arial, sans-serif`);
    
    // Load Google Font if needed
    if (fontMap[font] && font !== 'mono') {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@300;400;500;600;700;800;900&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }

  const list = document.getElementById('ssq-list');

  // Set layout and hover effect attributes
  if (list) {
    list.setAttribute('data-layout', layout);
    list.setAttribute('data-hover', hoverEffect);
  }

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
      const titleText = textTransform === 'uppercase' ? title.toUpperCase() : 
                       textTransform === 'lowercase' ? title.toLowerCase() :
                       textTransform === 'capitalize' ? title.replace(/\b\w/g, l => l.toUpperCase()) : title;
      
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
        const titleText = textTransform === 'uppercase' ? title.toUpperCase() : 
                         textTransform === 'lowercase' ? title.toLowerCase() :
                         textTransform === 'capitalize' ? title.replace(/\b\w/g, l => l.toUpperCase()) : title;
        
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
