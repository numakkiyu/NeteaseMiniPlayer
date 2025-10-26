# 🎵 [NMP v2] NeteaseMiniPlayer v2 – A Minimalist NetEase Cloud Music Player

<div align="center">

<img width="861" height="430" alt="NMPV2" src="https://github.com/numakkiyu/NeteaseMiniPlayer/blob/main/NMPV2.png">

**A CDN-ready, embeddable UI component library for NetEase Cloud Music, built on top of [NeteaseCloudMusicApi](https://neteasecloudmusicapi.js.org)**

[🚀 Quick Start](#-quick-start) • [📖 Configuration](#-configuration-options) • [🎮 Demo](#-usage-examples) • [🛠️ API Reference](#-api-reference)

[English](README.en.md) • [简体中文](README.md) • [繁体中文](README.zh-Hant.md) 

</div>

> **Note**: Netease Mini Player v1 is deprecated and no longer maintained. It has been archived.

> **Live Demo**: [https://nmp.hypcvgm.top/](https://nmp.hypcvgm.top/)

---

## ✨ Core Features

<table>
<tr>
<td width="50%">

### 🎨 **Neumorphic Design**  
Soft shadows and highlights create a modern, tactile visual experience.

### 💿 **Playlist Navigation**  
Seamlessly switch between tracks within a specified playlist.

### 📱 **Fully Responsive**  
Adapts to desktop, tablet, and mobile devices with touch-friendly controls.

### 🎵 **Dual-Layer Lyrics System**  
Supports original and translated lyrics with real-time highlighting and glow effects.

</td>
<td width="50%">

### 🎛️ **Full Playback Controls**  
- ▶️ Play / Pause / Stop  
- ⏮️ Previous / Next track  
- 🎚️ Scrub through progress bar  
- 🔊 Volume slider

### 📋 **Smart Playlist View**  
Compact, scrollable track list with one-tap song switching.

### ⚡ **CDN-Ready**  
Zero build step required—configure via HTML attributes and embed instantly.

### 🌙 **Theme Support**  
Choose between light, dark, or auto (system-aware) themes.

</td>
</tr>
</table>

## 🏗️ Powered by NeteaseCloudMusicApi

This player leverages the open-source **[NeteaseCloudMusicApi](https://neteasecloudmusicapi.js.org)** to proxy NetEase Cloud Music data, enabling seamless cross-origin access. The live demo uses **[Muran Cloud (墨染云)](https://i9mr.com/)** at `https://zm.i9mr.com` as the API backend.

> 💡 **Recommendation**: For production use, deploy your own instance of NeteaseCloudMusicApi to ensure reliability and performance.

## 📊 Technical Specifications

| Item | Details |
|------|---------|
| **Framework** | Vanilla JavaScript (zero dependencies) |
| **Browser Support** | Chrome 60+, Firefox 55+, Safari 12+, Edge 79+ |
| **Bundle Size** | CSS: 15KB + JS: 35KB (minified & gzipped) |
| **API Source** | NeteaseCloudMusicApi |
| **License** | Apache License 2.0 |
| **Initialization Time** | < 100ms |
| **Memory Footprint** | < 5MB |

## 🚀 Quick Start

### 1️⃣ Include the Files

#### 📦 Local Installation

```html
<!-- CSS -->
<link rel="stylesheet" href="netease-mini-player-v2.css">

<!-- JavaScript -->
<script src="netease-mini-player-v2.js"></script>
```

**Download:**
- [📥 From GitHub](https://github.com/numakkiyu/NeteaseMiniPlayer/archive/refs/tags/v2.0.4.zip)
- [📥 Via CDN](https://api.hypcvgm.top/NeteaseMiniPlayer/download/NeteaseMiniPlayer-v2.0.3.zip)

#### 🌐 CDN (Recommended for Prototyping)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://api.hypcvgm.top/NeteaseMiniPlayer/netease-mini-player-v2.css">

<!-- JavaScript -->
<script src="https://api.hypcvgm.top/NeteaseMiniPlayer/netease-mini-player-v2.js"></script>
```

### 2️⃣ Create a Player Instance

```html
<!-- Basic Player -->
<div class="netease-mini-player"
     data-playlist-id="14273792576"
     data-lyric="true"
     data-theme="auto"
     data-size="compact">
</div>

<!-- Floating Player -->
<div class="netease-mini-player"
     data-playlist-id="14273792576"
     data-position="bottom-right"
     data-lyric="true"
     data-autoplay="false">
</div>
```

### 3️⃣ Initialize

```javascript
// Auto-initialization (recommended)
// Players are automatically initialized after DOM load

// Manual initialization
document.addEventListener('DOMContentLoaded', function() {
    const players = document.querySelectorAll('.netease-mini-player');
    players.forEach(el => new NeteaseMiniPlayer(el));
});

// Single instance
const playerEl = document.querySelector('#my-player');
const player = new NeteaseMiniPlayer(playerEl);
```

## ⚙️ Configuration Options

Configure behavior and appearance via HTML `data-*` attributes:

| Attribute | Type | Default | Description |
|----------|------|--------|-------------|
| `data-playlist-id` | string | — | **Required**. NetEase playlist ID |
| `data-song-id` | string | — | Single track ID (for embed mode) |
| `data-position` | string | — | Floating position: `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `data-embed` | boolean | `false` | Embed mode (hides prev/next buttons) |
| `data-lyric` | boolean | `true` | Show lyrics |
| `data-theme` | string | `auto` | Theme: `light`, `dark`, or `auto` |
| `data-autoplay` | boolean | `false` | Auto-play on load |
| `data-volume` | number | `0.8` | Initial volume (0.0–1.0) |

## 🎮 Usage Examples

### 🎵 Basic Player

```html
<div class="netease-mini-player"
     data-playlist-id="14273792576"
     data-lyric="true"
     data-theme="light">
</div>
```

### 🎯 Embedded Player (Single Track)

```html
<div class="netease-mini-player"
     data-song-id="1901371647"
     data-embed="true"
     data-lyric="true"
     data-theme="auto">
</div>
```

### 🎪 Floating Player

```html
<div class="netease-mini-player"
     data-playlist-id="14273792576"
     data-position="bottom-right"
     data-lyric="true"
     data-autoplay="false"
     data-theme="dark">
</div>
```

### 🎨 Custom Styling

```html
<div class="netease-mini-player"
     data-playlist-id="14273792576"
     data-theme="auto"
     data-size="normal"
     data-volume="0.6">
</div>
```

## 🛠️ API Reference

### Player Instance Methods

```javascript
const player = new NeteaseMiniPlayer(element);

// Playback
player.play();           // Resume playback
player.pause();          // Pause playback
player.stop();           // Stop and reset
player.next();           // Next track
player.prev();           // Previous track

// Volume
player.setVolume(0.5);   // Set volume (0.0–1.0)
player.getVolume();      // Get current volume

// Progress
player.seek(30);         // Jump to 30 seconds
player.getCurrentTime(); // Current playback time (s)
player.getDuration();    // Total duration (s)

// Playlist
player.loadPlaylist(id); // Load a new playlist
player.loadSong(id);     // Load a single track
player.getCurrentSong(); // Get current track metadata
```

### Event Listeners

```javascript
const player = new NeteaseMiniPlayer(element);

player.on('play', () => console.log('Playback started'));
player.on('pause', () => console.log('Playback paused'));
player.on('ended', () => console.log('Track ended'));

player.on('songchange', (song) => console.log('Now playing:', song));
player.on('timeupdate', (time) => console.log('Progress:', time));
player.on('volumechange', (volume) => console.log('Volume:', volume));
```

## 🎯 Advanced Features

### 🔄 Loop Modes

```html
<!-- Loop entire playlist -->
<div class="netease-mini-player" data-loop="list"></div>

<!-- Repeat current track -->
<div class="netease-mini-player" data-loop="single"></div>

<!-- No loop -->
<div class="netease-mini-player" data-loop="none"></div>
```

### 🎨 Dynamic Theme Switching

```javascript
player.setTheme('dark');   // Force dark mode
player.setTheme('light');  // Force light mode
player.setTheme('auto');   // Follow system preference
```

### 📱 Responsive Behavior

The player automatically adapts its layout:
- **Desktop**: Full controls and lyrics
- **Tablet**: Touch-optimized spacing
- **Mobile**: Compact, gesture-friendly UI

## 🔧 Custom Styling

### CSS Custom Properties

```css
.netease-mini-player {
    --primary-color: #1890ff;
    --background-color: #ffffff;
    --text-color: #333333;
    --border-radius: 12px;
    --shadow-color: rgba(0, 0, 0, 0.1);
}
```

### Custom Theme Example

```css
/* Dark theme override */
.netease-mini-player[data-theme="dark"] {
    --background-color: #1f1f1f;
    --text-color: #ffffff;
    --primary-color: #4facfe;
}
```

## 📋 Browser Compatibility

| Browser | Minimum Version | Status |
|--------|------------------|--------|
| Chrome | 60+ | ✅ Fully supported |
| Firefox | 55+ | ✅ Fully supported |
| Safari | 12+ | ✅ Fully supported |
| Edge | 79+ | ✅ Fully supported |
| Internet Explorer | — | ❌ Not supported |

## 🚨 Important Notes

- 📱 The library auto-initializes all elements with class `.netease-mini-player`.
- ⚠️ Ensure the script is loaded **before** creating player elements.
- ✅ Multiple player instances can coexist on the same page.
- 🔒 Most browsers block autoplay unless triggered by user interaction.

## 📝 Changelog

### v2.0.1 (2025-10-16)
- ✨ Added embed mode support  
- 🐛 Fixed song metadata fetching in single-track mode  
- 🎨 Hidden navigation buttons in embed mode  
- ⚡ Improved initialization performance  
- 🔧 Enhanced error handling

### v2.0.0 (2025-09-26)
- 🎉 Major v2 release  
- 🎨 Redesigned with Neumorphism  
- 💿 Added vinyl record animation  
- 🎵 Rewrote lyrics rendering engine  
- 📱 Refined responsive layout  
- 🌙 Introduced theme switching

## 📄 License

This project is licensed under the **[Apache License 2.0](LICENSE)**.

## 🤝 Contributing

Issues and pull requests are welcome! Help make this player even better.

## 📞 Contact

- 📧 Email: [imbhcn@gmail.com](mailto:imbhcn@gmail.com)  
- 🐛 Bug Reports: [GitHub Issues](https://github.com/numakkiyu/NeteaseMiniPlayer/issues)  
- 💬 Discussions: [GitHub Discussions](https://github.com/numakkiyu/NeteaseMiniPlayer/discussions)

---

<div align="center">

**If you find this project useful, please give it a ⭐ Star!**

Made with ❤️ by [ImBHCN](https://github.com/numakkiyu)

</div>
