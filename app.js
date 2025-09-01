// Element references - will be initialized after DOM loads
const $ = id => document.getElementById(id);
let els = {};

// Sample data for demo mode
const sampleTrack = { 
  title: "Midnight Drive (Demo)", 
  artist: "Lumen & Co", 
  duration: 212, 
  elapsed: 48, 
  art: "demo.jpg" 
};

const sampleQueue = [
  { title: "Neon Skyline", artist: "City Nights" },
  { title: "Rainy Window", artist: "Loftgram" },
  { title: "Synth Bloom", artist: "Vapor Sun" },
  { title: "Night Arcade", artist: "Retro Wave" },
];

function initializeElements() {
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
    queueMax: $('queueMax'), showArtists: $('showArtists'), ws: $('ws'), pollMs: $('pollMs'),
    queueColorMode: $('queueColorMode'), queueAccent: $('queueAccent'), queueText: $('queueText'), 
    queueMuted: $('queueMuted'), queueCard: $('queueCard'), queueGlowColor: $('queueGlowColor'), 
    queueBorderColor: $('queueBorderColor'), queueBackgroundType: $('queueBackgroundType'),
    queueLayout: $('queueLayout'), queueRadius: $('queueRadius'), queueShadow: $('queueShadow'), 
    queueGap: $('queueGap'), queueSliderHeight: $('queueSliderHeight'),
    
    // UI elements
    demo: $('demo'), getUrls: $('getUrls'), openPreview: $('openPreview'), reset: $('reset'), 
    preview: $('preview'), colorsBlock: $('colorsBlock'), queuePreview: $('queuePreview'),
    playerUrl: $('playerUrl'), queueUrl: $('queueUrl'), copyPlayerUrl: $('copyPlayerUrl'), 
    copyQueueUrl: $('copyQueueUrl')
  };
  
  console.log('Elements initialized successfully');
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
  const state = {
    // Player state
    base: els.base.value.trim(),
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
    ws: els.ws?.value || 'ws://localhost:5173',
    pollMs: els.pollMs?.value || '15000',
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
    demo: +(els.demo.checked)
  };
  
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
  
  return u.origin + u.pathname + (q.toString() ? '?' + q.toString() : '');
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
      '🔗 Live mode: connecting to Queuefy server (requires local server)';
  }
  
  // Update player preview - always use demo data for preview
  updatePlayerPreview(playerUrl);
}

// Update player preview with robust error handling and retry logic
function updatePlayerPreview(playerUrl) {
  if(!els.preview) return;
  
  let previewUrl;
  if (playerUrl && playerUrl !== '') {
    previewUrl = playerUrl + (playerUrl.includes('?') ? '&' : '?') + 'demo=true&_t=' + Date.now();
  } else {
    // Fallback to local overlay.html
    const localOverlay = new URL('overlay.html', location.href).toString();
    previewUrl = localOverlay + '?demo=true&_t=' + Date.now();
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
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (toast) {
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
      if (k.startsWith('queue')) {
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
  
  // Color mode toggle
  if(els.colorMode) {
    els.colorMode.addEventListener('change', toggleColorsBlock);
    toggleColorsBlock();
  }
  
  if(els.queueColorMode) {
    els.queueColorMode.addEventListener('change', toggleQueueColorsBlock);
    toggleQueueColorsBlock();
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