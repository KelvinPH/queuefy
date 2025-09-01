// No themes - removed all theme configurations
const THEMES = {};

// Theme selector functionality
function createThemeSelector() {
  const selector = document.createElement('div');
  selector.className = 'theme-selector';
  selector.innerHTML = `
    <style>
      .theme-selector {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: rgba(0,0,0,0.9);
        border-radius: 12px;
        padding: 16px;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.2);
        max-width: 300px;
        font-family: system-ui, -apple-system, Segoe UI, Inter, Arial, sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      }
      
      .theme-selector h3 {
        margin: 0 0 12px 0;
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
      }
      
      .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 8px;
      }
      
      .theme-option {
        padding: 8px;
        border-radius: 8px;
        border: 2px solid transparent;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        background: rgba(255,255,255,0.1);
        color: #ffffff;
      }
      
      .theme-option:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      .theme-option.active {
        border-color: var(--accent, #1db954);
        background: rgba(255,255,255,0.2);
      }
      
      .theme-toggle {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        background: var(--accent, #1db954);
        color: #000;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .theme-toggle:hover {
        transform: scale(1.1);
      }
      
      .theme-selector.hidden {
        display: none;
      }
    </style>
    
    <button class="theme-toggle" onclick="toggleThemeSelector()">🎨</button>
    <div class="theme-selector hidden">
      <h3>Choose Theme</h3>
      <div class="theme-grid">
        ${Object.keys(THEMES).map(name => `
          <div class="theme-option" onclick="applyTheme('${name}')" data-theme="${name}">
            ${name.charAt(0).toUpperCase() + name.slice(1)}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  return selector;
}

function toggleThemeSelector() {
  const selector = document.querySelector('.theme-selector');
  if (selector) {
    selector.classList.toggle('hidden');
  }
}

function applyTheme(themeName, saveToStorage = true) {
  const theme = THEMES[themeName];
  if (!theme) {
    console.log('Theme not found:', themeName);
    return;
  }
  
  console.log('Applying theme:', themeName, theme);
  
  // Update active state
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.remove('active');
  });
  document.querySelector(`[data-theme="${themeName}"]`)?.classList.add('active');
  
  // Apply theme variables with !important to override any existing styles
  const root = document.documentElement.style;
  
  // Clear any existing theme styles first
  const existingThemeStyle = document.getElementById('theme-override-style');
  if (existingThemeStyle) {
    existingThemeStyle.remove();
  }
  
  // Create a new style element for theme overrides
  const themeStyle = document.createElement('style');
  themeStyle.id = 'theme-override-style';
  themeStyle.textContent = `
    :root {
      ${theme.panel ? `--panel: ${theme.panel} !important;` : ''}
      ${theme.text ? `--text: ${theme.text} !important;` : ''}
      ${theme.muted ? `--muted: ${theme.muted} !important;` : ''}
      ${theme.accent ? `--accent: ${theme.accent} !important;` : ''}
      ${theme.radius != null ? `--radius: ${theme.radius}px !important;` : ''}
      ${theme.blur != null ? `--blur: ${theme.blur}px !important;` : ''}
      ${theme.shadow ? `--shadow: ${theme.shadow} !important;` : ''}
      ${theme.card ? `--card: ${theme.card} !important;` : ''}
      ${theme.blur != null ? `--panel-blur: ${theme.blur}px !important;` : ''}
    }
  `;
  document.head.appendChild(themeStyle);
  
  // Store theme preference only if not from URL
  if (saveToStorage) {
    localStorage.setItem('queuefy_theme', themeName);
  }
  
  console.log('Theme applied successfully:', themeName);
  
  // Update dropdowns to reflect the current theme
  updateThemeDropdowns(themeName);
  
  // Hide selector after selection
  toggleThemeSelector();
}

// Initialize theme system
function initThemeSystem() {
  // Prevent multiple initializations
  if (window.themeSystemInitialized) {
    console.log('Theme system already initialized, skipping...');
    return;
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initThemeSystemInternal();
    });
    return;
  }
  
  initThemeSystemInternal();
}

function initThemeSystemInternal() {
  window.themeSystemInitialized = true;
  
  console.log('Initializing theme system...');
  
  // Only add theme selector if we're not in the config page
  if (!window.location.href.includes('config.html')) {
    const selector = createThemeSelector();
    document.body.appendChild(selector);
  }
  
  // Check for theme parameter in URL first, then saved theme, then default
  const urlParams = new URLSearchParams(window.location.search);
  const urlTheme = urlParams.get('theme');
  const savedTheme = localStorage.getItem('queuefy_theme') || 'spotify';
  
  let themeToApply = 'spotify'; // default
  
  // In config page, prioritize saved theme over URL parameters
  if (window.location.href.includes('config.html')) {
    if (savedTheme && THEMES[savedTheme]) {
      themeToApply = savedTheme;
      console.log('Config page: Using saved theme:', savedTheme);
      applyTheme(themeToApply, true);
    } else {
      applyTheme(themeToApply, true);
    }
  } else {
    // For non-config pages, URL parameter takes priority
    if (urlTheme && urlTheme !== 'default' && THEMES[urlTheme]) {
      themeToApply = urlTheme;
      console.log('Using theme from URL parameter:', urlTheme);
      // Don't save URL themes to localStorage to avoid conflicts
      applyTheme(themeToApply, false);
    } else if (savedTheme && THEMES[savedTheme]) {
      themeToApply = savedTheme;
      console.log('Using saved theme:', savedTheme);
      applyTheme(themeToApply, true);
    } else {
      applyTheme(themeToApply, true);
    }
  }
  
  // Set initial active state and update dropdowns
  setTimeout(() => {
    document.querySelector(`[data-theme="${themeToApply}"]`)?.classList.add('active');
    
    // Update config page dropdowns if they exist
    if (window.location.href.includes('config.html')) {
      const themeSelect = document.getElementById('theme');
      const queueThemeSelect = document.getElementById('queueTheme');
      
      if (themeSelect && themeToApply !== 'default') {
        themeSelect.value = themeToApply;
      }
      if (queueThemeSelect && themeToApply !== 'default') {
        queueThemeSelect.value = themeToApply;
      }
    }
  }, 100);
  
  console.log('Theme system initialized with theme:', themeToApply);
}

// Update theme dropdowns to reflect current theme
function updateThemeDropdowns(themeName) {
  if (window.location.href.includes('config.html')) {
    const themeSelect = document.getElementById('theme');
    const queueThemeSelect = document.getElementById('queueTheme');
    
    if (themeSelect && themeName !== 'default') {
      themeSelect.value = themeName;
    }
    if (queueThemeSelect && themeName !== 'default') {
      queueThemeSelect.value = themeName;
    }
  }
}

// Debug function to test themes
function debugThemes() {
  console.log('=== Theme System Debug ===');
  console.log('Available themes:', Object.keys(THEMES));
  console.log('Current URL:', window.location.href);
  console.log('URL theme param:', new URLSearchParams(window.location.search).get('theme'));
  console.log('Saved theme:', localStorage.getItem('queuefy_theme'));
  console.log('Theme system initialized:', window.themeSystemInitialized);
  
  const computedStyle = getComputedStyle(document.documentElement);
  console.log('Current CSS variables:');
  console.log('--panel:', computedStyle.getPropertyValue('--panel'));
  console.log('--text:', computedStyle.getPropertyValue('--text'));
  console.log('--accent:', computedStyle.getPropertyValue('--accent'));
  console.log('--card:', computedStyle.getPropertyValue('--card'));
}

// Test function to manually apply a theme
function testTheme(themeName) {
  console.log(`Testing theme: ${themeName}`);
  applyTheme(themeName, true);
  setTimeout(() => {
    debugThemes();
  }, 100);
}

// Force refresh theme system
function refreshThemeSystem() {
  console.log('Forcing theme system refresh...');
  window.themeSystemInitialized = false;
  initThemeSystem();
}

// Make functions globally available for testing
window.applyTheme = applyTheme;
window.debugThemes = debugThemes;
window.testTheme = testTheme;
window.refreshThemeSystem = refreshThemeSystem;
window.THEMES = THEMES;

// Ensure theme is applied after page load
window.addEventListener('load', () => {
  // Double-check that the saved theme is applied
  const savedTheme = localStorage.getItem('queuefy_theme');
  if (savedTheme && THEMES[savedTheme] && !window.location.href.includes('config.html')) {
    console.log('Page loaded, ensuring saved theme is applied:', savedTheme);
    applyTheme(savedTheme, false); // Don't save again, just apply
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { THEMES, applyTheme, initThemeSystem, debugThemes };
} 