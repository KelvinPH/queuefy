(function(){
  const params = new URLSearchParams(location.search);
  
  // Streamer.bot configuration
  const sbHost = params.get('sb_host') || '127.0.0.1';
  const sbPort = params.get('sb_port') || '8080';
  const sbSsl = params.get('sb_ssl') === '1';
  const eventType = params.get('event_type') || 'queue:update';
  const maxItems = Math.max(1, Math.min(10, +(params.get('max_items') || 5)));
  const theme = params.get('theme') || 'dark';
  
  // Legacy parameters (for backwards compatibility)
  const ws = params.get('ws') || 'ws://localhost:5173'; // Deprecated
  const queueMax = Math.max(0, +(params.get('queueMax') || 5));
  const isDemo = params.get('demo') === 'true';
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
  const sliderHeight = params.get('sliderHeight') || '400';
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

  // Apply custom styling via CSS variables
  const root = document.documentElement;
  
  // Apply custom styling
  {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --radius: ${radius}px !important;
        --shadow: ${shadow ? '0 6px 16px rgba(0,0,0,.25)' : 'none'} !important;
        --gap: ${gap}px !important;
        --border: ${border}px !important;
        --opacity: ${opacity}% !important;
        --blur: ${blur}px !important;
        --glow: ${glow}px !important;
        --now-playing-glow: ${glow === '0' ? 'none' : `0 0 ${glow}px ${accentColor}`} !important;
        --hover-glow: ${glow === '0' ? 'none' : `0 0 ${glow}px ${glowColor}`} !important;
        --hover-glow-filter: ${glow === '0' ? 'none' : `drop-shadow(0 0 ${glow}px ${glowColor})`} !important;
        --card: ${cardColor} !important;
        --text: ${textColor} !important;
        --muted: ${mutedColor} !important;
        --accent: ${accentColor} !important;
        --border-color: ${borderColor} !important;
        --glow-color: ${glowColor} !important;
        --align: ${align} !important;
        --layout: ${layout} !important;
        --slider-height: ${sliderHeight}px !important;
        --title-size: ${titleSize}px !important;
        --artist-size: ${artistSize}px !important;
        --line-height: ${lineHeight} !important;
        --letter-spacing: ${letterSpacing}px !important;
        --padding: ${padding}px !important;
        --margin: ${margin}px !important;
        --font-weight: ${fontWeight} !important;
        --text-transform: ${textTransform} !important;
        --text-shadow: ${textShadow ? '0 1px 3px rgba(0,0,0,0.5)' : 'none'} !important;
        --anim-speed: ${animSpeed} !important;
        --hover-effect: ${hoverEffect} !important;
      }
    `;
    document.head.appendChild(style);
  }

  console.log('CSS variables applied with !important:', {
    '--radius': radius + 'px',
    '--card': cardColor,
    '--text': textColor,
    '--accent': accentColor
  });

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
    document.documentElement.style.setProperty('--font', `'${fontFamily}', system-ui, -apple-system, Segoe UI, Arial, sans-serif`);
    
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
    console.log('Queue layout set to:', layout);
  } else {
    console.error('Queue list element not found!');
  }

  // Connection status management
  let connectionStatus = 'disconnected';
  let lastUpdateTime = null;
  let reconnectAttempts = 0;
  let reconnectTimeout = null;
  let webSocket = null;
  let lastGeneratedAt = null;

  // Create status indicator
  function createStatusIndicator() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'connection-status';
    statusDiv.style.cssText = `
      position: fixed;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      z-index: 1000;
      opacity: 0.7;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(statusDiv);
    return statusDiv;
  }

  const statusIndicator = createStatusIndicator();

  function updateConnectionStatus(status, message = '') {
    connectionStatus = status;
    const statusMap = {
      'connecting': { text: 'Connecting...', color: '#ffa500', bg: '#fff3cd' },
      'connected': { text: 'Connected', color: '#155724', bg: '#d4edda' },
      'disconnected': { text: 'Disconnected', color: '#721c24', bg: '#f8d7da' },
      'error': { text: 'Error', color: '#721c24', bg: '#f8d7da' }
    };
    
    const statusInfo = statusMap[status] || statusMap.disconnected;
    statusIndicator.style.backgroundColor = statusInfo.bg;
    statusIndicator.style.color = statusInfo.color;
    statusIndicator.textContent = statusInfo.text;
    
    if (message) {
      console.log(`[Queuefy] ${status}: ${message}`);
    }
  }

  function trunc(s, n) { 
    if (!s) return ''; 
    return s.length > n ? s.slice(0, n-1) + '…' : s; 
  }

  // Validate and normalize Streamer.bot payload
  function validatePayload(data) {
    if (!data || typeof data !== 'object') {
      console.warn('[Queuefy] Invalid payload: not an object');
      return null;
    }

    if (data.type !== eventType) {
      console.warn(`[Queuefy] Ignoring payload with type "${data.type}" (expected "${eventType}")`);
      return null;
    }

    // Check for debouncing
    if (data.generatedAt) {
      const generatedAt = new Date(data.generatedAt).getTime();
      if (lastGeneratedAt && generatedAt < lastGeneratedAt) {
        console.warn('[Queuefy] Ignoring out-of-order update');
        return null;
      }
      lastGeneratedAt = generatedAt;
    }

    return data;
  }

  // Convert Streamer.bot format to internal format
  function normalizeData(data) {
    const normalized = {
      nowPlaying: null,
      next: []
    };

    // Handle nowPlaying
    if (data.nowPlaying) {
      normalized.nowPlaying = {
        name: data.nowPlaying.title || 'Unknown Track',
        artists: data.nowPlaying.artists ? [{ name: data.nowPlaying.artists.join(', ') }] : [{ name: 'Unknown Artist' }],
        album: {
          images: data.nowPlaying.artUrl ? [{ url: data.nowPlaying.artUrl }] : []
        },
        duration_ms: data.nowPlaying.durationMs || 0,
        progress_ms: data.nowPlaying.progressMs || 0,
        requestedBy: data.nowPlaying.requestedBy || null,
        isExplicit: data.nowPlaying.isExplicit || false
      };
    }

    // Handle upNext
    if (data.upNext && Array.isArray(data.upNext)) {
      normalized.next = data.upNext.map(track => ({
        name: track.title || 'Unknown Track',
        artists: track.artists ? [{ name: track.artists.join(', ') }] : [{ name: 'Unknown Artist' }],
        album: {
          images: track.artUrl ? [{ url: track.artUrl }] : []
        },
        duration_ms: track.durationMs || 0,
        requestedBy: track.requestedBy || null,
        isExplicit: track.isExplicit || false
      }));
    }

    return normalized;
  }

  function renderQueue(data) {
    console.log('Queue: renderQueue called with data:', data);
    
    if (!list) {
      console.error('Queue list element not found in renderQueue');
      return;
    }
    
    if (!data) { 
      console.log('Queue: No data provided, clearing list');
      list.innerHTML = ''; 
      return; 
    }

    // Update last update time
    lastUpdateTime = Date.now();

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
        <div class="ssq-art-thumb" data-title="${titleText}">
          ${albumArt ? `<img src="${albumArt}" alt="Album Art" onerror="this.style.display='none'; this.parentElement.classList.add('no-image');" />` : ''}
        </div>
        <div class="ssq-content">
          <div class="ssq-title">▶ Now Playing: ${titleText}</div>
          ${artist ? `<div class="ssq-artist">${artist}</div>` : ''}
        </div>
      </div>`;
    }

    // Show queue items (use maxItems instead of queueMax for new format)
    const itemsToShow = Math.min(maxItems, data.next ? data.next.length : 0);
    if (data.next && Array.isArray(data.next) && itemsToShow > 0) {
      const items = data.next.slice(0, itemsToShow);
      items.forEach(track => {
        const title = trunc(track?.name || '', 48);
        const artist = showArt ? trunc((track?.artists?.[0]?.name) || '', 28) : '';
        const albumArt = track?.album?.images?.[0]?.url || '';
        const titleText = textTransform === 'uppercase' ? title.toUpperCase() : 
                         textTransform === 'lowercase' ? title.toLowerCase() :
                         textTransform === 'capitalize' ? title.replace(/\b\w/g, l => l.toUpperCase()) : title;
        
        html += `<div class="ssq-item">
          <div class="ssq-art-thumb" data-title="${titleText}">
            ${albumArt ? `<img src="${albumArt}" alt="Album Art" onerror="this.style.display='none'; this.parentElement.classList.add('no-image');" />` : ''}
          </div>
          <div class="ssq-content">
            <div class="ssq-title">${titleText}</div>
            ${artist ? `<div class="ssq-artist">${artist}</div>` : ''}
          </div>
        </div>`;
      });
    }

    list.innerHTML = html;
  }

  // Streamer.bot WebSocket connection
  function connectStreamerBot() {
    if (isDemo) {
      console.log('[Queuefy] Demo mode enabled, showing sample data');
      updateConnectionStatus('connected', 'Demo mode');
      renderQueue(defaultDemoData);
      return;
    }

    const protocol = sbSsl ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${sbHost}:${sbPort}`;
    
    console.log(`[Queuefy] Connecting to Streamer.bot at ${wsUrl}`);
    updateConnectionStatus('connecting');

    try {
      webSocket = new WebSocket(wsUrl);

      webSocket.onopen = function() {
        console.log('[Queuefy] Connected to Streamer.bot WebSocket');
        updateConnectionStatus('connected');
        reconnectAttempts = 0;
        
        // Subscribe to General.Custom events
        const subscribeMessage = {
          request: 'Subscribe',
          events: {
            General: ['Custom']
          }
        };
        webSocket.send(JSON.stringify(subscribeMessage));
      };

      webSocket.onmessage = function(event) {
        try {
          const message = JSON.parse(event.data);
          
          // Handle General.Custom events
          if (message.event && message.event.source === 'General' && message.event.type === 'Custom') {
            const customData = message.event.data;
            
            if (customData && typeof customData === 'object') {
              const validatedData = validatePayload(customData);
              if (validatedData) {
                const normalizedData = normalizeData(validatedData);
                renderQueue(normalizedData);
              }
            }
          }
        } catch (error) {
          console.warn('[Queuefy] Failed to parse WebSocket message:', error);
        }
      };

      webSocket.onclose = function(event) {
        console.log('[Queuefy] WebSocket connection closed:', event.code, event.reason);
        updateConnectionStatus('disconnected');
        
        // Implement exponential backoff reconnection
        if (reconnectAttempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`[Queuefy] Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts + 1})`);
          
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++;
            connectStreamerBot();
          }, delay);
        } else {
          console.error('[Queuefy] Max reconnection attempts reached');
          updateConnectionStatus('error', 'Max reconnection attempts reached');
        }
      };

      webSocket.onerror = function(error) {
        console.error('[Queuefy] WebSocket error:', error);
        updateConnectionStatus('error', 'Connection failed');
      };

    } catch (error) {
      console.error('[Queuefy] Failed to create WebSocket connection:', error);
      updateConnectionStatus('error', 'Connection setup failed');
    }
  }

  // Check for stale data
  function checkStaleData() {
    if (lastUpdateTime && Date.now() - lastUpdateTime > 10000) {
      statusIndicator.style.opacity = '0.3';
      statusIndicator.textContent = 'Stale';
    } else {
      statusIndicator.style.opacity = '0.7';
    }
  }

  // Default demo data (same as before)
  const defaultDemoData = {
    nowPlaying: {
      name: "Midnight City",
      artists: [{ name: "M83" }],
      album: { images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center" }] }
    },
    next: [
      { 
        name: "Electric Feel", 
        artists: [{ name: "MGMT" }],
        album: { images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center&blur=1" }] }
      },
      { 
        name: "Rainy Window", 
        artists: [{ name: "Lofigram" }],
        album: { images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center&blur=2" }] }
      },
      { 
        name: "Synth Bloom", 
        artists: [{ name: "Vapor Sun" }],
        album: { images: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center&blur=1" }] }
      }
    ],
    is_playing: true,
    lastUpdated: new Date().toISOString()
  };
  
  // Show default demo data immediately if in demo mode
  if (isDemo) {
    console.log('Queue: Rendering default demo data');
    renderQueue(defaultDemoData);
    updateConnectionStatus('connected', 'Demo mode');
  }

  // Start WebSocket connection
  connectStreamerBot();
  
  // Check for stale data every 5 seconds
  setInterval(checkStaleData, 5000);
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    if (webSocket) {
      webSocket.close();
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  });
})();
