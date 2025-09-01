# Queuefy Configurator

A modern, user-friendly dashboard for configuring Queuefy overlays for OBS streaming with **Streamer.bot WebSocket integration**.

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
- **Queue Behavior**: Max items, artist display, Streamer.bot WebSocket connection
- **Styling Options**: Colors, layouts, shadows, spacing
- **Multiple Layouts**: List, Grid, Cards, Compact, Minimal, Slider, Ticker, Masonry, Timeline, Carousel, Stack
- **Live Preview**: Real-time queue preview with demo data
- **Connection Status**: Visual indicator for Streamer.bot connection state

### 🔗 **OBS Integration**
- **URL Generation**: Automatic Player and Queue URL building
- **Copy to Clipboard**: One-click URL copying
- **Modal Interface**: Clean URL display with instructions
- **Open Preview**: Direct preview in new tab
- **Download Overlay**: Export self-contained queue.html with embedded settings

### 🤖 **Streamer.bot Integration**
- **Native WebSocket**: Direct connection to Streamer.bot WebSocket server
- **Real-time Updates**: Live queue updates via General.Custom events
- **Robust Connection**: Automatic reconnection with exponential backoff
- **No Server Required**: Fully static overlay - no local server needed
- **Connection Status**: Visual feedback for connection state and data freshness

### 📥 **Download Overlay Feature**
- **Self-contained Export**: Single HTML file with embedded CSS, JS, and configuration
- **Preserved Settings**: All visual presets and Streamer.bot connection settings included
- **No External Dependencies**: Works offline as local OBS Browser Source
- **SSL Support**: Automatic ws:// vs wss:// handling based on settings
- **Layout Preservation**: Maintains all queue styling, colors, and layout options

## Using Queuefy with Streamer.bot

### Prerequisites
- **Spotify Premium account** (required for queue/playback control)
- **Streamer.bot installed** with WebSocket Server enabled
- **Spotify integration for Streamer.bot** (community extension) with scopes:
  - `user-read-playback-state`
  - `user-read-currently-playing` 
  - `user-modify-playback-state`

### Streamer.bot Setup

#### 1. Enable WebSocket Server
1. Open Streamer.bot
2. Go to **Settings** → **WebSocket Server**
3. Enable **WebSocket Server**
4. Note the **Host** (default: 127.0.0.1) and **Port** (default: 8080)
5. Enable **SSL** if needed (for HTTPS connections)

#### 2. Create Queue Broadcast Action
1. Create a new action named **"Queue: Broadcast Overlay State"**
2. Add a **WebSocket** action
3. Set **Request** to `Broadcast`
4. Set **Event** to `General.Custom`
5. Set **Data** to a JSON object with the following structure:

```json
{
  "type": "queue:update",
  "nowPlaying": {
    "id": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
    "title": "Song Title",
    "artists": ["Artist Name"],
    "album": "Album Name",
    "artUrl": "https://i.scdn.co/image/ab67616d0000b273...",
    "durationMs": 180000,
    "progressMs": 45000,
    "requestedBy": "username",
    "isExplicit": false
  },
  "upNext": [
    {
      "id": "spotify:track:5QO79kh1waicV47BqGRL3g",
      "title": "Next Song",
      "artists": ["Next Artist"],
      "album": "Next Album",
      "artUrl": "https://i.scdn.co/image/ab67616d0000b273...",
      "durationMs": 200000,
      "requestedBy": "username",
      "isExplicit": false
    }
  ],
  "generatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### 3. Trigger the Action
Set up triggers for the action on:
- **Track change events** (from Spotify integration)
- **Song request added/accepted**
- **Skip/previous commands**

## Download a Single-File Overlay

### How to Use
1. **Configure Settings**: Set up your desired queue appearance and Streamer.bot connection
2. **Click Download**: Use the "📥 Download queue.html" button in the Queue Behavior section
3. **Save File**: The browser will download a self-contained `queue.html` file
4. **Use in OBS**: Add as a Browser Source with "Local File" option

### What's Included
- **Visual Settings**: All colors, layouts, spacing, and styling options
- **Streamer.bot Config**: Host, port, SSL, event type, and connection parameters
- **Embedded Assets**: CSS and JavaScript are inlined for offline use
- **Connection Logic**: WebSocket client with automatic reconnection

### Important Notes
- **Local/OBS Usage**: Works perfectly with `ws://` connections in OBS or local file://
- **HTTPS Limitations**: If opened from `https://`, `ws://` connections will be blocked
- **SSL Recommendation**: Use `wss://` (SSL enabled) for web-hosted overlays
- **No Build Required**: The exported file is ready to use immediately

### Customization After Export
- **Edit Embedded Config**: Modify the `window.QUEUEFY_CONFIG` object in the HTML
- **Re-export**: Generate a new file with updated settings from the configurator
- **Manual Edits**: Directly edit colors, layout, or connection parameters in the HTML
- **Periodic timer** (3-5 seconds as fallback)

### Overlay Configuration

#### URL Parameters
The queue overlay accepts these parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `sb_host` | `127.0.0.1` | Streamer.bot WebSocket host |
| `sb_port` | `8080` | Streamer.bot WebSocket port |
| `sb_ssl` | `0` | Use SSL (1) or not (0) |
| `event_type` | `queue:update` | Event type to listen for |
| `max_items` | `5` | Maximum queue items to display |
| `theme` | `dark` | Theme (dark/light) |
| `demo` | `false` | Show demo data (true/false) |

#### Example URLs
```
# Basic connection
queue.html?sb_host=127.0.0.1&sb_port=8080

# Custom configuration
queue.html?sb_host=192.168.1.100&sb_port=8080&max_items=3&theme=dark

# Demo mode
queue.html?demo=true
```

### OBS Setup
1. Add the queue overlay as a **Browser Source** in OBS
2. Set the URL to your queue.html file with appropriate parameters
3. Set **Width** and **Height** as needed
4. Enable **Shutdown source when not visible** for performance

### Troubleshooting

#### No Updates Showing
- Verify Streamer.bot WebSocket host/port in overlay URL
- Check that your action actually fires (test with a simple broadcast)
- Ensure payload includes `"type": "queue:update"`
- Check browser console for connection errors

#### Connection Issues
- **Mixed content warnings**: Use `sb_ssl=1` if OBS requires HTTPS
- **Password protection**: Streamer.bot WebSocket doesn't support authentication in this implementation
- **Firewall**: Ensure port 8080 (or your custom port) is accessible

#### Data Not Updating
- Verify the action is triggered on track changes
- Check that the JSON payload matches the expected format
- Ensure `generatedAt` timestamp is current
- Look for console warnings about invalid payloads

## Usage

### Quick Start
1. Open `index.html` in your browser
2. Configure your Player settings in the left panel
3. Switch to Queue tab to configure queue display
4. Set Streamer.bot connection parameters
5. Copy the generated URLs to use in OBS

### Player Configuration
1. **Basics**: Set your base URL (auto-filled for GitHub Pages)
2. **Layout & Style**: Choose layout type and media position
3. **Visual**: Customize colors, background, and effects
4. **Advanced**: Adjust sizing, positioning, and behavior
5. **Links**: Copy the generated Player URL

### Queue Configuration
1. **Queue Behavior**: Set max items and Streamer.bot connection settings
2. **Queue Styling**: Customize colors and layout options
3. **Queue URL**: Copy the generated Queue URL with Streamer.bot parameters

### OBS Setup
1. Add Player URL as a Browser Source in OBS
2. Add Queue URL as a Browser Source in OBS
3. Configure Streamer.bot actions to broadcast queue updates
4. Test with track changes in Spotify

## File Structure

```
queuefy/
├── index.html          # New dashboard UI
├── styles.css          # Design system and components
├── app.js              # Dashboard functionality
├── config.html         # Legacy dashboard (backup)
├── overlay.html        # Player overlay
├── queue.html          # Queue overlay (Streamer.bot WebSocket)
├── assets/             # Images and resources
│   ├── queue.js        # Queue logic with Streamer.bot integration
│   ├── queue.css       # Queue styling
│   └── themes.js       # Theme definitions
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
python3 -m  http.server 8000

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
- 🤖 Streamer.bot WebSocket integration
- 🔌 No server required - fully static

## License

MIT License - see LICENSE file for details.