# Queuefy Configurator

A modern, user-friendly dashboard for configuring Queuefy overlays for OBS streaming.

## Features

### 🎨 **New Dashboard UI**
- **Split Layout**: Config panel on the left, live previews on the right
- **Vertical Navigation**: Clean segmented tabs (Player/Queue) with sub-navigation
- **Accordion Cards**: Organized sections with clear headers and descriptions
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Design System**: Consistent spacing, colors, and typography

### 🎮 **Player Configuration**
- **Layout Options**: Record (vinyl), Card, Bar, Stacked, Compact, Wide, Split, Floating, Corner, Ticker
- **Visual Customization**: Colors, effects, animations, typography
- **Behavior Controls**: Spinning, tonearm, status pills, progress bars
- **Live Preview**: Real-time preview with demo data

### 📋 **Queue Configuration**
- **Queue Behavior**: Max items, artist display, WebSocket connection
- **Styling Options**: Colors, layouts, shadows, spacing
- **Multiple Layouts**: List, Grid, Cards, Compact, Minimal, Slider, Ticker, Masonry, Timeline, Carousel, Stack
- **Live Preview**: Real-time queue preview with demo data

### 🔗 **OBS Integration**
- **URL Generation**: Automatic Player and Queue URL building
- **Copy to Clipboard**: One-click URL copying
- **Modal Interface**: Clean URL display with instructions
- **Open Preview**: Direct preview in new tab

## Usage

### Quick Start
1. Open `index.html` in your browser
2. Configure your Player settings in the left panel
3. Switch to Queue tab to configure queue display
4. Copy the generated URLs to use in OBS

### Player Configuration
1. **Basics**: Set your base URL (auto-filled for GitHub Pages)
2. **Layout & Style**: Choose layout type and media position
3. **Visual**: Customize colors, background, and effects
4. **Advanced**: Adjust sizing, positioning, and behavior
5. **Links**: Copy the generated Player URL

### Queue Configuration
1. **Queue Behavior**: Set max items and connection settings
2. **Queue Styling**: Customize colors and layout options
3. **Queue URL**: Copy the generated Queue URL

### OBS Setup
1. Add Player URL as a Browser Source in OBS
2. Add Queue URL as a Browser Source in OBS
3. Use chat commands (!sr, !queue, !song, !skip) to test

## File Structure

```
queuefy/
├── index.html          # New dashboard UI
├── styles.css          # Design system and components
├── app.js              # Dashboard functionality
├── config.html         # Legacy dashboard (backup)
├── overlay.html        # Player overlay
├── queue.html          # Queue overlay
├── assets/             # Images and resources
└── README.md           # This file
```

## Design System

### Color Palette
- **Background**: `#0e1116` (dark)
- **Panel**: `#151a21` (medium dark)
- **Text**: `#e7ebf3` (light)
- **Accent**: `#22c55e` (green)
- **Muted**: `#9aa7b6` (gray)

### Spacing Scale
- `--s1`: 6px, `--s2`: 10px, `--s3`: 14px
- `--s4`: 18px, `--s5`: 22px, `--s6`: 28px, `--s7`: 36px

### Typography
- **System Font Stack**: System UI, Inter, Arial
- **Line Height**: 1.5
- **Font Sizes**: 12px, 14px, 16px, 18px, 20px, 24px

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Local Development
```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Key Features Maintained
- ✅ All existing functionality preserved
- ✅ URL parameter schema unchanged
- ✅ Same default values and behavior
- ✅ No external dependencies
- ✅ Vanilla HTML, CSS, and JavaScript

### New Features Added
- 🎨 Modern, accessible UI design
- 📱 Responsive layout for all devices
- 🧭 Improved navigation and organization
- 🔄 Real-time preview updates
- 📋 Enhanced copy/paste functionality
- 🎯 Better visual feedback and status indicators

## License

MIT License - see LICENSE file for details.