// Element references - will be initialized after DOM loads
const $ = id => document.getElementById(id);
let els = {};

// Sample data for demo mode
const sampleTrack = { 
  title: "Midnight Drive (Demo)", 
  artist: "Lumen & Co", 
  duration: 212, 
  elapsed: 48, 
  art: "assets/demo-albumcover.jpg" 
};

const sampleQueue = [
  { title: "Neon Skyline", artist: "City Nights" },
  { title: "Rainy Window", artist: "Loftgram" },
  { title: "Synth Bloom", artist: "Vapor Sun" },
  { title: "Night Arcade", artist: "Retro Wave" },
];

function initializeElements() {
  console.log('Initializing elements...');
  
  els = {
    // Player elements
    base: $('base'), layout: $('layout'), align: $('align'), accentstyle: $('accentstyle'),
    colorMode: $('colorMode'), accent: $('accent'), text: $('text'), muted: $('muted'), 
    panelColor: $('panelColor'), glowColor: $('glowColor'), borderColor: $('borderColor'),
    disc: $('disc'), bar: $('bar'), progressWidth: $('progressWidth'), textAlign: $('textAlign'),
    radius: $('radius'), blur: $('blur'), pad: $('pad'), outline: $('outline'),
    compact: $('compact'), spin: $('spin'), labelStatic: $('labelStatic'), tonearm: $('tonearm'),
    showStatus: $('showStatus'), showProgress: $('showProgress'), showTime: $('showTime'), 
    showTitle: $('showTitle'), showArtist: $('showArtist'), showNext: $('showNext'),
    scroll: $('scroll'), autoAccent: $('autoAccent'), marq: $('marq'),
    transparent: $('transparent'), panelAlpha: $('panelAlpha'),
    
    // Queue elements
    queueMax: $('queueMax'), showArtists: $('showArtists'), 
    sbHost: $('sbHost'), sbPort: $('sbPort'), sbSsl: $('sbSsl'), eventType: $('eventType'), 
    ws: $('ws'), pollMs: $('pollMs'), maxItems: $('maxItems'),
    queueColorMode: $('queueColorMode'), queueAccent: $('queueAccent'), queueText: $('queueText'), 
    queueMuted: $('queueMuted'), queueCard: $('queueCard'), queueGlowColor: $('queueGlowColor'), 
    queueBorderColor: $('queueBorderColor'), queueBackgroundType: $('queueBackgroundType'),
    queueLayout: $('queueLayout'), queueRadius: $('queueRadius'), queueShadow: $('queueShadow'), 
    queueGap: $('queueGap'), queueSliderHeight: $('queueSliderHeight'),
    
    // UI elements
    demo: $('demo'), getUrls: $('getUrls'), openPreview: $('openPreview'), reset: $('reset'), 
    preview: $('preview'), colorsBlock: $('colorsBlock'), queuePreview: $('queuePreview'),
    playerUrl: $('playerUrl'), queueUrl: $('queueUrl'), copyPlayerUrl: $('copyPlayerUrl'), 
    copyQueueUrl: $('copyQueueUrl'), downloadOverlay: $('downloadOverlay')
  };
  
  console.log('Elements initialized successfully');
  console.log('Download overlay element:', els.downloadOverlay);
  console.log('sbHost element:', els.sbHost);
  console.log('sbPort element:', els.sbPort);
}

// State management
function setState(s) {
  for(const k in s) {
    if(els[k] && 'value' in els[k]) els[k].value = s[k];
    if(els[k] && 'checked' in els[k]) els[k].checked = !!s[k];
  }
  render();
}

function getState() {
  console.log('getState called, els:', els);
  
  const state = {
    // Player state
    base: els.base?.value?.trim() || '',
    layout: els.layout?.value || 'record', 
    align: els.align?.value || 'left', 
    accentstyle: els.accentstyle?.value || 'solid',
    disc: els.disc?.value || '200', 
    bar: els.bar?.value || '6', 
    progressWidth: els.progressWidth?.value || '100', 
    textAlign: els.textAlign?.value || 'auto',
    radius: els.radius?.value || '16', 
    blur: els.blur?.value || '8', 
    pad: els.pad?.value || '16', 
    outline: els.outline?.value || '0',
    compact: +(els.compact?.checked || false), 
    spin: +(els.spin?.checked || true), 
    labelStatic: +(els.labelStatic?.checked || false), 
    tonearm: +(els.tonearm?.checked || true),
    showStatus: +(els.showStatus?.checked || false), 
    showProgress: +(els.showProgress?.checked || false), 
    showTime: +(els.showTime?.checked || false), 
    showTitle: +(els.showTitle?.checked || false), 
    showArtist: +(els.showArtist?.checked || false), 
    showNext: +(els.showNext?.checked || false),
    scroll: +(els.scroll?.checked || false), 
    autoAccent: +(els.autoAccent?.checked || false), 
    marq: els.marq?.value || '18',
    colorMode: els.colorMode?.value || 'custom', 
    accent: els.accent?.value || '#1db954', 
    text: els.text?.value || '#eaeaea', 
    muted: els.muted?.value || '#b6bcc4',
    transparent: +(els.transparent?.checked || false), 
    panelAlpha: els.panelAlpha?.value || '72', 
    panelColor: els.panelColor?.value || '#121212',
    
    // Queue state
    queueMax: els.queueMax?.value || '5',
    showArtists: els.showArtists?.value || 'true',
    sbHost: els.sbHost?.value || '127.0.0.1',
    sbPort: els.sbPort?.value || '8080',
    sbSsl: els.sbSsl?.value || '0',
    eventType: els.eventType?.value || 'queue:update',
    ws: els.ws?.value || 'ws://localhost:5173',
    pollMs: els.pollMs?.value || '15000',
    maxItems: els.maxItems?.value || '5',
    queueLayout: els.queueLayout?.value || 'list',
    queueColorMode: els.queueColorMode?.value || 'custom',
    queueAccent: els.queueAccent?.value || '#1db954',
    queueText: els.queueText?.value || '#ffffff',
    queueMuted: els.queueMuted?.value || '#cfcfcf',
    queueCard: els.queueCard?.value || '#000000',
    queueGlowColor: els.queueGlowColor?.value || '#00ff00',
    queueBorderColor: els.queueBorderColor?.value || '#ffffff',
    queueBackgroundType: els.queueBackgroundType?.value || 'card',
    queueRadius: els.queueRadius?.value || '12',
    queueShadow: els.queueShadow?.value || 'soft',
    queueGap: els.queueGap?.value || '6',
    queueSliderHeight: els.queueSliderHeight?.value || '400',
    
    // UI state
    demo: +(els.demo?.checked || false)
  };
  
  console.log('State generated:', state);
  
  // Debug behavior options
  console.log('Behavior options state:', {
    compact: state.compact,
    spin: state.spin,
    labelStatic: state.labelStatic,
    tonearm: state.tonearm
  });
  
  return state;
}

// URL building functions
function buildPlayerURL() {
  const s = getState();
  if(!s.base) return '';
  const q = new URLSearchParams();

  if(s.layout && s.layout !== 'record') q.set('layout', s.layout);
  if(s.align && s.align !== 'left') q.set('align', s.align);
  if(s.accentstyle && s.accentstyle !== 'solid') q.set('accentstyle', s.accentstyle);
  if(s.disc) q.set('disc', s.disc);
  if(s.bar) q.set('bar', s.bar);
  if(s.progressWidth && s.progressWidth !== '100') q.set('progresswidth', s.progressWidth);
  if(s.textAlign && s.textAlign !== 'auto') q.set('textalign', s.textAlign);
  if(s.radius) q.set('radius', s.radius);
  if(s.blur) q.set('blur', s.blur);
  if(s.pad) q.set('pad', s.pad);
  if(s.outline) q.set('outline', s.outline);
  if(s.compact) q.set('compact','1');
  if(!s.spin) q.set('spin','0');
  if(s.labelStatic) q.set('label','static');
  if(!s.tonearm) q.set('tonearm','0');
  
  // Debug behavior parameters
  console.log('Behavior parameters in URL:', {
    compact: s.compact ? '1' : 'not set',
    spin: !s.spin ? '0' : 'not set (default enabled)',
    label: s.labelStatic ? 'static' : 'not set',
    tonearm: !s.tonearm ? '0' : 'not set (default enabled)'
  });
  q.set('showstatus', s.showStatus ? '1' : '0');
  q.set('showprogress', s.showProgress ? '1' : '0');
  q.set('showtime', s.showTime ? '1' : '0');
  q.set('title', s.showTitle ? '1' : '0');
  q.set('artist', s.showArtist ? '1' : '0');
  if(s.showNext) q.set('next','1');
  q.set('scroll', s.scroll ? '1' : '0');
  if(s.autoAccent) q.set('autoaccent','1');
  q.set('marq', s.marq);

  if(s.colorMode === 'custom'){
    if(s.accent) q.set('accent', s.accent);
    if(s.text) q.set('text', s.text);
    if(s.muted) q.set('muted', s.muted);
    if(s.glowColor) q.set('glowColor', s.glowColor);
    if(s.borderColor) q.set('borderColor', s.borderColor);
  }
  if(s.transparent) q.set('transparent','1');
  else {
    const hexToRgb = hex => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || [];
      return {r:parseInt(m[1]||'00',16), g:parseInt(m[2]||'00',16), b:parseInt(m[3]||'00',16)};
    };

    const {r,g,b} = hexToRgb(s.panelColor);
    const a = Math.max(0,Math.min(100,parseInt(s.panelAlpha||'72',10)))/100;
    q.set('panel', `rgba(${r},${g},${b},${a})`);
  }

  const sep = s.base.includes('?') ? '&' : '?';
  const finalUrl = s.base + (q.toString() ? sep + q.toString() : '');
  console.log('Built player URL with params:', q.toString());

  return finalUrl;
}

function buildQueueURL() {
  const s = getState();
  if(!s.base) return '';
  
  // swap overlay.html → queue.html (same folder)
  const u = new URL(s.base);
  u.pathname = u.pathname.replace(/overlay\.html$/,'queue.html');
  const q = new URLSearchParams();
  
  // Behavior params
  if(s.queueMax && s.queueMax !== '5') q.set('queueMax', s.queueMax);
  if(s.showArtists === 'false') q.set('showArtists', 'false');
  
  // Streamer.bot connection params - always include these
  q.set('sb_host', s.sbHost || '127.0.0.1');
  q.set('sb_port', s.sbPort || '8080');
  q.set('sb_ssl', s.sbSsl || '0');
  q.set('event_type', s.eventType || 'queue:update');
  
  console.log('Streamer.bot params added:', {
    sb_host: s.sbHost || '127.0.0.1',
    sb_port: s.sbPort || '8080',
    sb_ssl: s.sbSsl || '0',
    event_type: s.eventType || 'queue:update'
  });
  
  if(s.maxItems && s.maxItems !== '5') q.set('max_items', s.maxItems);
  
  // Legacy WebSocket and poll interval (for backward compatibility)
  if(s.ws && s.ws !== 'ws://localhost:5173') q.set('ws', s.ws);
  if(s.pollMs && s.pollMs !== '15000') q.set('pollMs', s.pollMs);
  
  // Styling params
  if(s.queueColorMode === 'custom'){
    if(s.queueAccent) q.set('accent', s.queueAccent);
    if(s.queueText) q.set('text', s.queueText);
    if(s.queueMuted) q.set('muted', s.queueMuted);
    if(s.queueCard) q.set('card', s.queueCard);
    if(s.queueGlowColor) q.set('glowColor', s.queueGlowColor);
    if(s.queueBorderColor) q.set('borderColor', s.queueBorderColor);
  }
  
  // Handle queue background type
  if(s.queueBackgroundType === 'transparent') {
    q.set('transparent', '1');
  }

  if(s.queueLayout && s.queueLayout !== 'list') q.set('layout', s.queueLayout);
  if(s.queueRadius && s.queueRadius !== '12') q.set('radius', s.queueRadius);
  if(s.queueShadow && s.queueShadow !== 'soft') q.set('shadow', s.queueShadow);
  if(s.queueGap && s.queueGap !== '6') q.set('gap', s.queueGap);
  if(s.queueSliderHeight && s.queueSliderHeight !== '400') q.set('sliderHeight', s.queueSliderHeight);
  
  const finalUrl = u.origin + u.pathname + (q.toString() ? '?' + q.toString() : '');
  console.log('Final Queue URL built:', finalUrl);
  return finalUrl;
}

// Render function
function render() {
  const s = getState();
  
  // Build URLs
  const playerUrl = buildPlayerURL();
  const queueUrl = buildQueueURL();
  
  // Update URL displays
  if(els.playerUrl) {
    els.playerUrl.textContent = playerUrl;
    console.log('Render function - playerUrl set to:', playerUrl);
  }
  if(els.queueUrl) {
    els.queueUrl.textContent = queueUrl;
    console.log('Render function - queueUrl set to:', queueUrl);
  }
  
  // Debounce preview updates to prevent excessive reloading
  clearTimeout(window.previewUpdateTimeout);
  window.previewUpdateTimeout = setTimeout(() => {
    updatePlayerPreview(playerUrl);
  }, 150);
  
  // Update demo status text
  const demoStatus = document.getElementById('demoStatus');
  if(demoStatus) {
    demoStatus.textContent = els.demo.checked ? 
      'Demo mode: showing sample data' : 
      'Live mode: connecting to Spotify';
  }
  
  // Update queue preview status text
  const queuePreviewStatus = document.getElementById('queuePreviewStatus');
  if(queuePreviewStatus) {
    queuePreviewStatus.textContent = els.demo.checked ? 
      '🎯 Demo mode: showing sample queue data' : 
      '🤖 Live mode: connecting to Streamer.bot WebSocket';
  }
  
  // Update player preview - respect demo mode setting
  updatePlayerPreview(playerUrl);
}

// Update player preview with robust error handling and retry logic
function updatePlayerPreview(playerUrl) {
  if(!els.preview) return;
  
  let previewUrl;
  if (playerUrl && playerUrl !== '') {
    // Respect demo mode setting
    const demoParam = els.demo.checked ? 'true' : 'false';
    previewUrl = playerUrl + (playerUrl.includes('?') ? '&' : '?') + 'demo=' + demoParam + '&_t=' + Date.now();
  } else {
    // Fallback to local overlay.html
    const localOverlay = new URL('overlay.html', location.href).toString();
    const demoParam = els.demo.checked ? 'true' : 'false';
    previewUrl = localOverlay + '?demo=' + demoParam + '&_t=' + Date.now();
  }
  
  console.log('Setting player preview URL:', previewUrl);
  
  // Force iframe reload with better error handling
  try {
    // Show loading state
    els.preview.style.opacity = '0.5';
    els.preview.src = '';
    
    // Add load event listener to handle successful loads
    const onLoad = () => {
      setTimeout(() => {
        els.preview.style.opacity = '1';
        els.preview.removeEventListener('load', onLoad);
      }, 200);
    };
    
    // Add error event listener for retry logic
    const onError = () => {
      console.error('Player preview failed to load, retrying...');
      setTimeout(() => {
        const retryUrl = previewUrl + '&retry=' + Date.now();
        els.preview.src = retryUrl;
      }, 500);
      els.preview.removeEventListener('error', onError);
    };
    
    els.preview.addEventListener('load', onLoad);
    els.preview.addEventListener('error', onError);
    
    setTimeout(() => {
      els.preview.src = previewUrl;
    }, 100);
    
    // Fallback timeout to restore opacity if load/error events don't fire
    setTimeout(() => {
      if (els.preview.style.opacity === '0.5') {
        els.preview.style.opacity = '1';
      }
    }, 3000);
    
  } catch (error) {
    console.error('Error updating player preview:', error);
    // Fallback: try direct assignment
    els.preview.src = previewUrl;
    els.preview.style.opacity = '1';
  }
}

// Update queue preview with robust error handling
function updateQueuePreview() {
  if(!els.queuePreview) return;
  
  const s = getState();
  const localQueue = new URL('queue.html', location.href).toString();
  const queuePreviewParams = new URLSearchParams();
  
  // Always include demo mode for preview
  queuePreviewParams.set('demo', 'true');
  
  // Apply current queue settings to preview
  if(s.queueMax && s.queueMax !== '5') queuePreviewParams.set('queueMax', s.queueMax);
  if(s.sbHost && s.sbHost !== '127.0.0.1') queuePreviewParams.set('sb_host', s.sbHost);
  if(s.sbPort && s.sbPort !== '8080') queuePreviewParams.set('sb_port', s.sbPort);
  if(s.sbSsl && s.sbSsl !== '0') queuePreviewParams.set('sb_ssl', s.sbSsl);
  if(s.eventType && s.eventType !== 'queue:update') queuePreviewParams.set('event_type', s.eventType);
  if(s.maxItems && s.maxItems !== '5') queuePreviewParams.set('max_items', s.maxItems);
  if(s.showArtists === 'false') queuePreviewParams.set('showArtists', 'false');
  
  // Apply queue colors to preview
  if(s.queueColorMode === 'custom'){
    if(s.queueAccent) queuePreviewParams.set('accent', s.queueAccent);
    if(s.queueText) queuePreviewParams.set('text', s.queueText);
    if(s.queueMuted) queuePreviewParams.set('muted', s.queueMuted);
    if(s.queueCard) queuePreviewParams.set('card', s.queueCard);
    if(s.queueGlowColor) queuePreviewParams.set('glowColor', s.queueGlowColor);
    if(s.queueBorderColor) queuePreviewParams.set('borderColor', s.queueBorderColor);
  }
  
  // Handle queue background type in preview
  if(s.queueBackgroundType === 'transparent') {
    queuePreviewParams.set('transparent', '1');
  }

  if(s.queueLayout && s.queueLayout !== 'list') queuePreviewParams.set('layout', s.queueLayout);
  if(s.queueRadius && s.queueRadius !== '12') queuePreviewParams.set('radius', s.queueRadius);
  if(s.queueShadow && s.queueShadow !== 'soft') queuePreviewParams.set('shadow', s.queueShadow);
  if(s.queueGap && s.queueGap !== '6') queuePreviewParams.set('gap', s.queueGap);
  if(s.queueSliderHeight && s.queueSliderHeight !== '400') queuePreviewParams.set('sliderHeight', s.queueSliderHeight);
  
  const previewUrl = localQueue + '?' + queuePreviewParams.toString() + '&_t=' + Date.now();
  
  console.log('Queue preview URL:', previewUrl);
  
  // Force iframe reload with better error handling
  try {
    // Show loading state
    els.queuePreview.style.opacity = '0.5';
    els.queuePreview.src = '';
    
    // Add load event listener to handle successful loads
    const onLoad = () => {
      setTimeout(() => {
        els.queuePreview.style.opacity = '1';
        els.queuePreview.removeEventListener('load', onLoad);
      }, 200);
    };
    
    // Add error event listener for retry logic
    const onError = () => {
      console.error('Queue preview failed to load, retrying...');
      setTimeout(() => {
        const retryUrl = previewUrl + '&retry=' + Date.now();
        els.queuePreview.src = retryUrl;
      }, 500);
      els.queuePreview.removeEventListener('error', onError);
    };
    
    els.queuePreview.addEventListener('load', onLoad);
    els.queuePreview.addEventListener('error', onError);
    
    setTimeout(() => {
      els.queuePreview.src = previewUrl;
    }, 100);
    
    // Fallback timeout to restore opacity if load/error events don't fire
    setTimeout(() => {
      if (els.queuePreview.style.opacity === '0.5') {
        els.queuePreview.style.opacity = '1';
      }
    }, 3000);
    
  } catch (error) {
    console.error('Error updating queue preview:', error);
    // Fallback: try direct assignment
    els.queuePreview.src = previewUrl;
    els.queuePreview.style.opacity = '1';
  }
}

// Update only queue-related elements without affecting player preview
function updateQueueOnly() {
  const s = getState();
  
  // Build queue URL
  const queueUrl = buildQueueURL();
  
  // Update queue URL displays
  if(els.queueUrl) els.queueUrl.textContent = queueUrl;
  
  // Update queue preview only
  updateQueuePreview();
}

// Layout-specific options management
function updateLayoutSpecificOptions() {
  const layout = els.layout?.value || 'record';
  
  // Label Static - only works with record layout
  const labelStaticGroup = document.querySelector('#labelStatic')?.closest('.toggle-group');
  if(labelStaticGroup) {
    const isLabelStaticCompatible = layout === 'record';
    labelStaticGroup.classList.toggle('disabled', !isLabelStaticCompatible);
    
    if(!isLabelStaticCompatible && els.labelStatic?.checked) {
      els.labelStatic.checked = false;
      render();
    }
  }
  
  // Tonearm - only works with record layout
  const tonearmGroup = document.querySelector('#tonearm')?.closest('.toggle-group');
  if(tonearmGroup) {
    const isTonearmCompatible = layout === 'record';
    tonearmGroup.classList.toggle('disabled', !isTonearmCompatible);
    
    if(!isTonearmCompatible && els.tonearm?.checked) {
      els.tonearm.checked = false;
      render();
    }
  }
  
  // Show Next - only works with stacked layout
  const showNextGroup = document.querySelector('#showNext')?.closest('.toggle-group');
  if(showNextGroup) {
    const isShowNextCompatible = layout === 'stacked';
    showNextGroup.classList.toggle('disabled', !isShowNextCompatible);
    
    if(!isShowNextCompatible && els.showNext?.checked) {
      els.showNext.checked = false;
      render();
    }
  }
  
  // Media Size (disc) - not applicable for bar layout
  const discField = document.querySelector('#disc')?.closest('.field');
  if(discField) {
    const isDiscCompatible = layout !== 'bar';
    discField.classList.toggle('disabled', !isDiscCompatible);
  }
  
  // Progress bar - hidden for corner and ticker layouts
  const progressGroup = document.querySelector('#showProgress')?.closest('.toggle-group');
  if(progressGroup) {
    const isProgressCompatible = !['corner', 'ticker'].includes(layout);
    progressGroup.classList.toggle('disabled', !isProgressCompatible);
    
    if(!isProgressCompatible && els.showProgress?.checked) {
      els.showProgress.checked = false;
      render();
    }
  }
  
  // Time display - hidden for corner and ticker layouts
  const timeGroup = document.querySelector('#showTime')?.closest('.toggle-group');
  if(timeGroup) {
    const isTimeCompatible = !['corner', 'ticker'].includes(layout);
    timeGroup.classList.toggle('disabled', !isTimeCompatible);
    
    if(!isTimeCompatible && els.showTime?.checked) {
      els.showTime.checked = false;
      render();
    }
  }
  
  // Status pill - hidden for bar, compact, corner, and ticker layouts
  const statusGroup = document.querySelector('#showStatus')?.closest('.toggle-group');
  if(statusGroup) {
    const isStatusCompatible = !['bar', 'compact', 'corner', 'ticker'].includes(layout);
    statusGroup.classList.toggle('disabled', !isStatusCompatible);
    
    if(!isStatusCompatible && els.showStatus?.checked) {
      els.showStatus.checked = false;
      render();
    }
  }
}

// Queue layout-specific options management
function updateQueueLayoutSpecificOptions() {
  const queueLayout = els.queueLayout?.value || 'list';
  
  // Slider Height - only applies to slider layout
  const sliderHeightField = document.querySelector('#queueSliderHeight').closest('.field');
  if(sliderHeightField) {
    const isSliderHeightCompatible = queueLayout === 'slider';
    sliderHeightField.classList.toggle('disabled', !isSliderHeightCompatible);
  }
}

// Color mode toggle function
function toggleColorsBlock() {
  const custom = els.colorMode?.value === 'custom';
  if(els.colorsBlock) {
    els.colorsBlock.classList.toggle('muted', !custom);
  }
}

function toggleQueueColorsBlock() {
  const custom = els.queueColorMode?.value === 'custom';
  if(els.queueColorsBlock) {
    els.queueColorsBlock.classList.toggle('muted', !custom);
  }
}

// Auto-fill Base URL
function autoFillBaseUrl() {
  if (els.base.value && els.base.value.includes('github.io/Queuefy')) {
    els.base.value = els.base.value.replace('github.io/Queuefy', 'github.io/queuefy');
  }
  
  if (!els.base.value || els.base.value.includes('github.io/SpotiStream') || els.base.value.includes('github.io/queuefy')) {
    const currentUrl = new URL(location.href);
    
    if (currentUrl.hostname.includes('github.io')) {
      const username = currentUrl.hostname.split('.')[0];
      els.base.value = `https://${username}.github.io/queuefy/overlay.html`;
    } else {
      const overlayUrl = new URL('overlay.html', currentUrl.origin + currentUrl.pathname);
      els.base.value = overlayUrl.toString();
    }
  }
  
  // Always update base URL to current server for local development
  if (location.hostname === 'localhost') {
    const overlayUrl = new URL('overlay.html', location.origin);
    els.base.value = overlayUrl.toString();
    console.log('Updated base URL for localhost:', els.base.value);
  }
}

// Toast notification
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.getElementById('toast');
  if (toast) {
    // Remove existing type classes
    toast.classList.remove('success', 'error', 'warning');
    
    // Add type class if specified
    if (type && type !== 'info') {
      toast.classList.add(type);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
}

// Navigation and UI handlers
function initializeNavigation() {
  // Top-level tab switching
  document.querySelectorAll('.segmented__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.segmented__tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      const targetPanel = document.getElementById(tab.dataset.tab + '-tab');
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      
      // Show/hide player subnav based on active tab
      const playerSubnav = document.getElementById('player-subnav');
      if (playerSubnav) {
        playerSubnav.style.display = tab.dataset.tab === 'player' ? 'flex' : 'none';
      }
    });
  });

  // Player subnav scrolling
  document.querySelectorAll('.subnav__item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active state
      document.querySelectorAll('.subnav__item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Scroll to section
      const targetId = item.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hash-based navigation
  function handleHashChange() {
    const hash = window.location.hash;
    if (hash) {
      const targetSection = document.getElementById(hash.substring(1));
      if (targetSection) {
        // Switch to player tab if needed
        const playerTab = document.querySelector('.segmented__tab[data-tab="player"]');
        if (playerTab && !playerTab.classList.contains('active')) {
          playerTab.click();
        }
        
        // Update subnav active state
        const subnavItem = document.querySelector(`.subnav__item[href="${hash}"]`);
        if (subnavItem) {
          document.querySelectorAll('.subnav__item').forEach(i => i.classList.remove('active'));
          subnavItem.classList.add('active');
        }
        
        // Scroll to section
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }

  // Handle initial hash and hash changes
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
}

// Download overlay functionality
function downloadOverlay() {
  console.log('Download function called');
  
  const s = getState();
  console.log('State:', s);
  
  // Validate required fields
  if (!s.sbHost || !s.sbPort) {
    console.log('Missing required fields:', { sbHost: s.sbHost, sbPort: s.sbPort });
    showToast('❌ Please configure Streamer.bot host and port first', 'error');
    return;
  }
  
  // Disable button during export
  const downloadBtn = document.querySelector('#downloadOverlay');
  if (downloadBtn) {
    const originalText = downloadBtn.textContent;
    downloadBtn.disabled = true;
    downloadBtn.textContent = '⏳ Exporting...';
    
    try {
      // Generate the HTML content
      const htmlContent = generateQueueHTML(s);
      
      // Create and download the file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'queue.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message
      showToast('✅ Downloaded queue.html successfully!', 'success');
    } catch (error) {
      console.error('Error generating overlay:', error);
      showToast('❌ Failed to generate overlay: ' + error.message, 'error');
    } finally {
      // Re-enable button
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.textContent = originalText;
      }
    }
  }
}

// Generate queue HTML content
function generateQueueHTML(config) {
  console.log('Generating queue HTML with config:', config);
  
  const queueCSS = `
    /* Queue Styles */
    .ssq-body { margin: 0; padding: 0; background: transparent; font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif; }
    .ssq-wrap { padding: 20px; }
    .ssq-heading { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #ffffff; }
    .ssq-list { display: flex; flex-direction: column; gap: 8px; }
    .ssq-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0,0,0,0.7); border-radius: 8px; backdrop-filter: blur(10px); }
    .ssq-art { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; }
    .ssq-info { flex: 1; min-width: 0; }
    .ssq-title { font-size: 14px; font-weight: 500; color: #ffffff; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ssq-artist { font-size: 12px; color: #b6bcc4; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ssq-requested { font-size: 11px; color: #9aa7b6; margin: 0; }
    
    /* Connection Status */
    .connection-status { position: fixed; top: 10px; right: 10px; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; z-index: 1000; opacity: 0.7; transition: opacity 0.3s ease; }
    .connection-status.connected { background: #22c55e; color: #000; }
    .connection-status.connecting { background: #f59e0b; color: #000; }
    .connection-status.disconnected { background: #ef4444; color: #fff; }
    .connection-status.error { background: #dc2626; color: #fff; }
    .connection-status.demo { background: #3b82f6; color: #fff; }
  `;
  
  const queueJS = `
    // Queue functionality
    let webSocket = null;
    let reconnectAttempts = 0;
    let reconnectTimeout = null;
    let lastUpdateTime = null;
    
    const params = new URLSearchParams(location.search);
    const sbHost = params.get('sb_host') || '${config.sbHost}';
    const sbPort = params.get('sb_port') || '${config.sbPort}';
    const sbSsl = params.get('sb_ssl') === '1' || ${config.sbSsl};
    const eventType = params.get('event_type') || '${config.eventType}';
    const maxItems = Math.max(1, Math.min(10, +(params.get('max_items') || ${config.queueMax})));
    
    function connectStreamerBot() {
      try {
        const protocol = sbSsl ? 'wss' : 'ws';
        const wsUrl = \`\${protocol}://\${sbHost}:\${sbPort}\`;
        console.log('[Queuefy] Connecting to:', wsUrl);
        
        webSocket = new WebSocket(wsUrl);
        updateConnectionStatus('connecting');
        
        webSocket.onopen = function() {
          console.log('[Queuefy] WebSocket connected');
          updateConnectionStatus('connected');
          reconnectAttempts = 0;
        };
        
        webSocket.onmessage = function(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === eventType) {
              lastUpdateTime = Date.now();
              renderQueue(data);
            }
          } catch (error) {
            console.warn('[Queuefy] Failed to parse message:', error);
          }
        };
        
        webSocket.onclose = function(event) {
          console.log('[Queuefy] WebSocket closed:', event.code);
          updateConnectionStatus('disconnected');
          
          if (reconnectAttempts < 5) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            reconnectTimeout = setTimeout(() => {
              reconnectAttempts++;
              connectStreamerBot();
            }, delay);
          }
        };
        
        webSocket.onerror = function(error) {
          console.error('[Queuefy] WebSocket error:', error);
          updateConnectionStatus('error');
        };
      } catch (error) {
        console.error('[Queuefy] Connection failed:', error);
        updateConnectionStatus('error');
      }
    }
    
    function updateConnectionStatus(status, message = '') {
      const indicator = document.getElementById('connectionStatus');
      if (indicator) {
        indicator.className = \`connection-status \${status}\`;
        indicator.textContent = message || status.charAt(0).toUpperCase() + status.slice(1);
      }
    }
    
    function renderQueue(data) {
      const list = document.getElementById('ssq-list');
      if (!list) return;
      
      const items = data.upNext || data.next || [];
      const maxDisplay = Math.min(items.length, maxItems);
      
      list.innerHTML = items.slice(0, maxDisplay).map((item, index) => \`
        <div class="ssq-item">
          <img class="ssq-art" src="\${item.artUrl || item.album?.images?.[0]?.url || 'https://via.placeholder.com/40x40/333/666?text=?'}" alt="Album Art" onerror="this.style.display='none'">
          <div class="ssq-info">
            <div class="ssq-title">\${item.title || item.name || 'Unknown Track'}</div>
            <div class="ssq-artist">\${(item.artists || []).map(a => a.name || a).join(', ') || 'Unknown Artist'}</div>
            \${item.requestedBy ? \`<div class="ssq-requested">Requested by \${item.requestedBy}</div>\` : ''}
          </div>
        </div>
      \`).join('');
    }
    
    // Initialize
    connectStreamerBot();
    
    // Cleanup
    window.addEventListener('beforeunload', function() {
      if (webSocket) {
        webSocket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    });
  `;
  
  const htmlContent = \`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Queuefy – Queue Overlay</title>
<style>\${queueCSS}</style>
</head>
<body class="ssq-body">
  <div id="connectionStatus" class="connection-status connecting">Connecting...</div>
  <div class="ssq-wrap">
    <div class="ssq-heading">Up Next</div>
    <div id="ssq-list" class="ssq-list"></div>
  </div>
  <script>\${queueJS}</script>
</body>
</html>\`;
  
  console.log('HTML content generated successfully, length:', htmlContent.length);
  return htmlContent;
}

// Initialize everything after DOM loads
function initializeApp() {
  initializeElements();
  initializeNavigation();
  
  // Wire up form events with specific handling for queue elements
  for(const k in els) {
    const n = els[k];
    if(!n) continue;
    if(n.tagName === 'INPUT' || n.tagName === 'SELECT') { 
      // Special handling for queue-specific elements to avoid player preview conflicts
      if (k.startsWith('queue') || k.startsWith('sb') || k === 'eventType' || k === 'ws' || k === 'pollMs') {
        n.addEventListener('input', updateQueueOnly);
        n.addEventListener('change', updateQueueOnly);
      } else {
        n.addEventListener('input', render); 
        n.addEventListener('change', () => {
          console.log('Element changed:', k, 'Value:', n.type === 'checkbox' ? n.checked : n.value);
          render();
        }); 
      }
    }
  }
  
  // Button handlers
  if(els.getUrls) {
    els.getUrls.onclick = () => {
      const playerUrl = buildPlayerURL();
      const queueUrl = buildQueueURL();
      
      // Update modal content
      const modalPlayerUrl = document.getElementById('modalPlayerUrl');
      const modalQueueUrl = document.getElementById('modalQueueUrl');
      const copyPlayerBtn = document.getElementById('copyPlayerBtn');
      const copyQueueBtn = document.getElementById('copyQueueBtn');
      
      if (modalPlayerUrl && modalQueueUrl) {
        modalPlayerUrl.textContent = playerUrl;
        modalQueueUrl.textContent = queueUrl;
        
        // Set up copy button handlers
        if (copyPlayerBtn) {
          copyPlayerBtn.onclick = async () => {
            try {
              await navigator.clipboard.writeText(playerUrl);
              showToast('Player URL copied!');
            } catch(e) {
              showToast('Failed to copy URL');
            }
          };
        }
        
        if (copyQueueBtn) {
          copyQueueBtn.onclick = async () => {
            try {
              await navigator.clipboard.writeText(queueUrl);
              showToast('Queue URL copied!');
            } catch(e) {
              showToast('Failed to copy URL');
            }
          };
        }
        
        // Show modal
        document.getElementById('urlModal').style.display = 'block';
      }
    };
  }
  
  if(els.openPreview) {
    els.openPreview.onclick = () => {
      const playerUrl = buildPlayerURL();
      if (playerUrl) {
        window.open(playerUrl, '_blank');
      }
    };
  }
  
  if(els.reset) {
    els.reset.onclick = () => { 
      if(confirm('Reset all settings to defaults?')) {
        location.reload(); 
      }
    };
  }
  
  // Copy button handlers for Links tab
  if(els.copyPlayerUrl) {
    els.copyPlayerUrl.onclick = async () => { 
      try { 
        const urlToCopy = els.playerUrl?.textContent || '';
        if(urlToCopy) {
          await navigator.clipboard.writeText(urlToCopy); 
          showToast('Player URL copied!');
        }
      } catch(e) {
        showToast('Failed to copy URL');
      }
    };
  }
  
  if(els.copyQueueUrl) {
    els.copyQueueUrl.onclick = async () => { 
      try { 
        const urlToCopy = els.queueUrl?.textContent || '';
        if(urlToCopy) {
          await navigator.clipboard.writeText(urlToCopy); 
          showToast('Queue URL copied!');
        }
      } catch(e) {
        showToast('Failed to copy URL');
      }
    };
  }
  
  // Download overlay functionality
  const downloadBtn = document.querySelector('#downloadOverlay');
  if(downloadBtn) {
    console.log('Setting up download button click handler');
    downloadBtn.onclick = () => {
      console.log('Download button clicked');
      downloadOverlay();
    };
  } else {
    console.error('Download button not found');
  }
  
  // Color mode toggle
  if(els.colorMode) {
    els.colorMode.addEventListener('change', toggleColorsBlock);
    toggleColorsBlock();
  }
  
  if(els.queueColorMode) {
    els.queueColorMode.addEventListener('change', toggleQueueColorsBlock);
    toggleQueueColorsBlock();
  }
  
  // Demo mode toggle - refresh preview when changed
  if(els.demo) {
    els.demo.addEventListener('change', render);
  }
  
  // Layout change handler
  if(els.layout) {
    els.layout.addEventListener('change', updateLayoutSpecificOptions);
  }
  
  // Queue layout change handler
  if(els.queueLayout) {
    els.queueLayout.addEventListener('change', updateQueueLayoutSpecificOptions);
  }
  
  // Initialize the rest
  autoFillBaseUrl();
  
  // Initialize layout-specific options first
  updateLayoutSpecificOptions();
  updateQueueLayoutSpecificOptions();
  
  // Then render and update previews
  render();
  updateQueueOnly();
  
  // Ensure URLs are populated for Links tab on page load
  setTimeout(() => {
    render();
    
    // Also force populate the Links tab URLs directly
    const playerUrl = buildPlayerURL();
    const queueUrl = buildQueueURL();
    
    if (els.playerUrl) {
      els.playerUrl.textContent = playerUrl;
      console.log('Initial population - playerUrl:', playerUrl);
    }
    if (els.queueUrl) {
      els.queueUrl.textContent = queueUrl;
      console.log('Initial population - queueUrl:', queueUrl);
    }
  }, 100);
}

// Wait for DOM to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Make downloadOverlay function globally accessible for debugging
window.downloadOverlay = downloadOverlay; 