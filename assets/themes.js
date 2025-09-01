// Queuefy Themes
// This file contains theme-related functionality for the queue overlay

// Default theme configuration
const DEFAULT_THEME = {
  name: 'default',
  colors: {
    background: 'rgba(0,0,0,0.7)',
    text: '#ffffff',
    muted: '#b6bcc4',
    accent: '#1db954',
    border: '#ffffff',
    glow: '#00ff00'
  },
  spacing: {
    radius: '12px',
    gap: '6px',
    padding: '12px',
    margin: '4px'
  },
  typography: {
    titleSize: '15px',
    artistSize: '12px',
    lineHeight: '1.4',
    fontWeight: '400'
  }
};

// Theme selector functionality (simplified)
function createThemeSelector() {
  // This function is kept for compatibility but simplified
  console.log('Theme selector created (simplified)');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_THEME, createThemeSelector };
} 