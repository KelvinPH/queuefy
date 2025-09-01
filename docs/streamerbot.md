# Queuefy Streamer.bot Integration Guide

This guide explains how to set up Queuefy to work with Streamer.bot for real-time queue updates without requiring a local server.

## Overview

Queuefy now connects directly to Streamer.bot's WebSocket server to receive queue updates in real-time. This eliminates the need for a local Socket.IO server or HTTP polling, making the overlay fully static and easier to deploy.

## Prerequisites

### Required Software
- **Streamer.bot** (latest version)
- **Spotify Premium account** (required for queue/playback control)
- **OBS Studio** (for displaying the overlay)

### Streamer.bot Extensions
- **Spotify Integration** (community extension) with the following scopes:
  - `user-read-playback-state`
  - `user-read-currently-playing`
  - `user-modify-playback-state`

## Streamer.bot Setup

### 1. Enable WebSocket Server

1. Open Streamer.bot
2. Go to **Settings** → **WebSocket Server**
3. Enable **WebSocket Server**
4. Configure settings:
   - **Host**: `127.0.0.1` (default) or your preferred IP
   - **Port**: `8080` (default) or your preferred port
   - **SSL**: Enable if you need secure connections (for HTTPS)
   - **Password**: Leave empty for this implementation

### 2. Create Queue Broadcast Action

Create a new action in Streamer.bot that will broadcast queue updates to the overlay:

1. **Create Action**: Right-click in the Actions panel → **Add Action**
2. **Name**: `Queue: Broadcast Overlay State`
3. **Add WebSocket Action**: Click the **+** button → **WebSocket**
4. **Configure WebSocket Action**:
   - **Request**: `Broadcast`
   - **Event**: `General.Custom`
   - **Data**: Use the JSON structure below

### 3. JSON Payload Structure

The WebSocket action should send a JSON object with this structure:

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

### 4. Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Must be `"queue:update"` (configurable) |
| `nowPlaying` | object | No | Currently playing track (null if nothing playing) |
| `upNext` | array | No | Array of upcoming tracks (empty if no queue) |
| `generatedAt` | string | No | ISO timestamp for debouncing |

#### Track Object Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Spotify track ID or URI |
| `title` | string | Yes | Track title |
| `artists` | array | Yes | Array of artist names |
| `album` | string | No | Album name |
| `artUrl` | string | No | Album artwork URL (HTTPS preferred) |
| `durationMs` | number | No | Track duration in milliseconds |
| `progressMs` | number | No | Current playback position (only for nowPlaying) |
| `requestedBy` | string | No | Username who requested the song |
| `isExplicit` | boolean | No | Whether the track is explicit |

### 5. Setting Up Triggers

Configure when the action should fire:

#### Automatic Triggers (Recommended)
- **Spotify Track Change**: From your Spotify integration
- **Song Request Added**: When a new request is added to queue
- **Song Request Accepted**: When a request is approved
- **Skip/Previous Commands**: When playback is controlled

#### Manual Triggers
- **Chat Commands**: `!queue`, `!song`, `!skip`
- **Hotkeys**: Keyboard shortcuts for testing
- **Periodic Timer**: Every 3-5 seconds as fallback

#### Example Trigger Setup
1. **Spotify Integration**: 
   - Event: `Track Changed`
   - Action: `Queue: Broadcast Overlay State`

2. **Chat Commands**:
   - Event: `Chat Message`
   - Condition: `Message` contains `!queue`
   - Action: `Queue: Broadcast Overlay State`

## Overlay Configuration

### URL Parameters

The queue overlay accepts these configuration parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `sb_host` | `127.0.0.1` | Streamer.bot WebSocket host |
| `sb_port` | `8080` | Streamer.bot WebSocket port |
| `sb_ssl` | `0` | Use SSL (1) or not (0) |
| `event_type` | `queue:update` | Event type to listen for |
| `max_items` | `5` | Maximum queue items to display |
| `theme` | `dark` | Theme (dark/light) |
| `demo` | `false` | Show demo data (true/false) |

### Example URLs

```html
<!-- Basic connection -->
queue.html?sb_host=127.0.0.1&sb_port=8080

<!-- Custom configuration -->
queue.html?sb_host=192.168.1.100&sb_port=8080&max_items=3&theme=dark

<!-- Demo mode -->
queue.html?demo=true

<!-- SSL connection -->
queue.html?sb_host=127.0.0.1&sb_port=8080&sb_ssl=1
```

## OBS Setup

### 1. Add Browser Source
1. In OBS, add a new **Browser Source**
2. Set **URL** to your queue.html file with parameters
3. Set **Width** and **Height** as needed
4. Enable **Shutdown source when not visible** for performance

### 2. Example Browser Source URL
```
file:///C:/path/to/queuefy/queue.html?sb_host=127.0.0.1&sb_port=8080&max_items=5&theme=dark
```

### 3. Positioning
- Place the queue overlay where you want it to appear
- Use OBS's transform tools to resize and position
- Consider using **Lock** to prevent accidental movement

## Testing

### 1. Test Connection
1. Open the queue overlay in a browser
2. Look for the connection status indicator (top-right)
3. Should show "Connected" when Streamer.bot is running

### 2. Test Updates
1. Change tracks in Spotify
2. Add songs to queue
3. Use skip/previous commands
4. Verify the overlay updates in real-time

### 3. Test Demo Mode
1. Add `?demo=true` to the URL
2. Should show sample data immediately
3. Status should show "Demo mode"

## Troubleshooting

### Connection Issues

#### "Disconnected" Status
- **Check Streamer.bot**: Ensure WebSocket Server is enabled
- **Verify Host/Port**: Confirm settings match your configuration
- **Firewall**: Ensure port 8080 (or your custom port) is accessible
- **SSL Mismatch**: Use `sb_ssl=1` if Streamer.bot has SSL enabled

#### "Error" Status
- **Check Console**: Open browser developer tools for error messages
- **Network Issues**: Verify network connectivity
- **Streamer.bot Restart**: Try restarting Streamer.bot

### No Updates Showing

#### Action Not Firing
- **Test Action**: Manually trigger the action in Streamer.bot
- **Check Triggers**: Verify triggers are properly configured
- **Event Type**: Ensure payload includes `"type": "queue:update"`

#### Data Format Issues
- **Validate JSON**: Use a JSON validator for your payload
- **Check Fields**: Ensure required fields are present
- **Console Warnings**: Look for validation warnings in browser console

### Performance Issues

#### High CPU Usage
- **Reduce Updates**: Limit action triggers to necessary events
- **Debounce**: Use `generatedAt` timestamp to prevent rapid updates
- **OBS Settings**: Enable "Shutdown source when not visible"

#### Memory Leaks
- **Browser Refresh**: Refresh the overlay periodically
- **OBS Restart**: Restart OBS if memory usage is high

## Advanced Configuration

### Custom Event Types
You can use different event types for different overlays:

```html
<!-- Main queue -->
queue.html?event_type=queue:update

<!-- Now playing only -->
queue.html?event_type=now:playing

<!-- Song requests -->
queue.html?event_type=requests:update
```

### Multiple Overlays
Run multiple queue overlays with different configurations:

```html
<!-- Compact queue -->
queue.html?max_items=3&layout=compact

<!-- Full queue -->
queue.html?max_items=10&layout=list

<!-- Now playing only -->
queue.html?max_items=0
```

### Network Configuration
For remote connections or different network setups:

```html
<!-- Remote Streamer.bot -->
queue.html?sb_host=192.168.1.100&sb_port=8080

<!-- SSL connection -->
queue.html?sb_host=127.0.0.1&sb_port=8080&sb_ssl=1

<!-- Custom port -->
queue.html?sb_host=127.0.0.1&sb_port=9000
```

## Security Considerations

### WebSocket Security
- **Local Network**: Keep Streamer.bot on local network when possible
- **Firewall**: Restrict access to WebSocket port
- **SSL**: Use SSL for production environments

### Credentials
- **No Authentication**: This implementation doesn't support WebSocket authentication
- **Local Only**: Recommended for local network use only
- **VPN**: Use VPN for remote access if needed

## Support

### Common Issues
1. **Mixed Content**: Use HTTPS/SSL for secure connections
2. **CORS**: Not applicable for local file:// URLs
3. **Port Conflicts**: Change Streamer.bot port if 8080 is in use

### Getting Help
- Check browser console for error messages
- Verify Streamer.bot WebSocket server is running
- Test with demo mode first
- Ensure all required fields are present in payload

### Resources
- [Streamer.bot Documentation](https://streamerbot.github.io/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
