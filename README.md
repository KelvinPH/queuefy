# Queuefy

A comprehensive streaming overlay system with both Player and Queue overlays for OBS.

## Features

### Player Overlay (overlay.html)
- Spotify Now Playing display with multiple layout options
- Real-time track information and progress
- Customizable themes, colors, and animations
- Multiple layout presets (Record, Card, Bar, Stacked, etc.)
- Demo mode for testing without Spotify connection

### Queue Overlay (queue.html)
- Upcoming tracks display
- WebSocket connection for real-time updates
- HTTP fallback polling
- Customizable styling and behavior
- Demo mode with rotating sample tracks

### Dashboard (config.html)
- Unified configuration interface for both overlays
- Live previews of both Player and Queue overlays
- Tabbed interface: Player, Queue, Visual, Advanced, Links
- Local storage for saving settings
- URL generation for OBS Browser Sources

## Quick Start

1. **Open the Dashboard**: Open `config.html` in your browser
2. **Configure Player Overlay**: Use the Player tab to customize the Spotify overlay
3. **Configure Queue Overlay**: Use the Queue tab to customize the queue display
4. **Get URLs**: Use the Links tab to copy both overlay URLs
5. **Add to OBS**: Add both URLs as Browser Sources in OBS

## Player Overlay Configuration

### Layout Options
- **Record**: Vinyl record style with spinning animation
- **Card**: Album cover with text overlay
- **Bar**: Minimal horizontal layout
- **Stacked**: Centered layout with album art
- **Compact**: Mini version for small spaces
- **Wide**: Cinematic wide layout
- **Split**: Dual-panel layout
- **Floating**: Overlay-style positioning
- **Corner**: Tiny corner display
- **Ticker**: Scrolling text layout

### Themes
- Spotify, OBS Dark, Minimal, Neon, Gaming, Lo-Fi, Retro Wave, Elegant, Cyberpunk, Sunset, Ocean, Forest, Midnight, Aurora, Gradient, Monochrome, Party, Cozy, Focus

### Elements
- Status pill, Progress bar, Time display, Title, Artist, Next track preview
- Text scrolling, Auto-accent from album art, Marquee speed control

## Queue Overlay Configuration

### Behavior
- **Queue Max**: Number of items to display (0-20, default: 5)
- **Show Artists**: Toggle artist names display
- **WebSocket URL**: Connection endpoint (default: ws://localhost:5173)
- **Poll Interval**: HTTP fallback interval in milliseconds (min: 3000, default: 15000)

### Styling
- **Theme**: Minimal, OBS Dark, Elegant presets
- **Card Radius**: Corner radius in pixels
- **Card Shadow**: Toggle drop shadow
- **Item Gap**: Vertical spacing between items
- **Colors**: Card background, text, and muted colors
- **Typography**: Title size, artist size, font family, uppercase toggle
- **Alignment**: Left, center, or right alignment

## OBS Setup

1. **Player Overlay**: Add the Player URL as a Browser Source
2. **Queue Overlay**: Add the Queue URL as a second Browser Source
3. **Positioning**: Arrange both overlays as desired in your scene
4. **Testing**: Use demo mode to test without Spotify connection

## Queuefy App Integration

The Queue overlay connects to a local Queuefy app running on the streaming PC:

- **WebSocket**: Real-time updates via ws://localhost:5173
- **HTTP Fallback**: Polling via http://localhost:5173/queue.json
- **Chat Commands**: Use !sr, !queue, !song, !skip to test functionality

## File Structure

```
Queuefy/
├── config.html          # Main dashboard
├── overlay.html         # Player overlay
├── queue.html          # Queue overlay
├── assets/
│   ├── queue.css       # Queue overlay styles
│   ├── queue.js        # Queue overlay logic
│   ├── demo-albumcover.jpg
│   ├── queue.css
│   └── queue.js
└── README.md
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Local file access for testing
- WebSocket support for real-time updates
- LocalStorage for settings persistence

## Development

- No build tools required
- Vanilla HTML/CSS/JavaScript
- Local development server recommended for testing
- File:// protocol works for basic functionality