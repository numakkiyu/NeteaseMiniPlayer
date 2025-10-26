# 🎵 [NMP v2] NeteaseMiniPlayer v2 網易雲音樂迷你播放器

<div align="center">

<img width="861" height="430" alt="NMPV2" src="https://github.com/numakkiyu/NeteaseMiniPlayer/blob/main/NMPV2.png" />

**基於 NeteaseCloudMusicApi 的網易雲 API 二次開發 CDN 可插入式音樂播放器 UI 元件庫**

[🚀 快速開始](#-快速開始) • [📖 文件](#-配置選項) • [🎮 演示](#-使用範例) • [🛠️ API](#-api-參考)

[English](README.en.md) • [简体中文](README.md) • [繁体中文](README.zh-Hant.md) 

</div>

> 注意：Netease Mini Player v1 版本過舊已棄用，不再提供維護，已歸檔

> 線上示範：[https://nmp.hypcvgm.top/](https://nmp.hypcvgm.top/)
---

## ✨ 核心特性

<table>
<tr>
<td width="50%">

### 🎨 **Neumorphism 設計**
採用新擬態設計風格，柔和的陰影和高光效果，現代化的視覺體驗

### 💿 **歌單切歌**
可以在填寫的歌單內自由切換歌單裡面的音樂

### 📱 **完全響應式**
適配桌面端、平板和行動設備，支援觸控操作

### 🎵 **迷你歌詞系統**
雙層歌詞佈局，支援翻譯顯示，目前行高亮發光效果

</td>
<td width="50%">

### 🎛️ **完整播放控制**
- ▶️ 播放/暫停/停止
- ⏮️ 上一首/下一首
- 🎚️ 拖曳進度條
- 🔊 滑桿控制音量

### 📋 **智慧播放清單**
緊湊列表展示，點擊切換歌曲，支援滑動瀏覽

### ⚡ **CDN 就緒**
無需建置工具，直接透過 HTML 屬性配置，即插即用

### 🌙 **主題支援**
支援明亮、暗色和自動主題，適應使用者係統偏好

</td>
</tr>
</table>

## 🏗️ 基於 NeteaseCloudMusicApi 構建

本播放器基於開源專案 **NeteaseCloudMusicApi** 提供的介面服務，透過 API 代理實現跨域存取。目前示範使用 **[墨染雲](https://i9mr.com/)** 的`https://zm.i9mr.com` 作為資料來源。

> 💡 **提示：** 為獲得更穩定的服務體驗，建議在生產環境中部署自己的 NeteaseCloudMusicApi 實例

## 📊 技術規格

| 項目 | 詳情 |
|------|------|
| **框架依賴** | 無依賴，純原生 JavaScript |
| **瀏覽器支援** | Chrome 60+, Firefox 55+, Safari 12+ |
| **檔案大小** | CSS 15KB + JS 35KB (壓縮後) |
| **API 來源** | NeteaseCloudMusicApi |
| **許可證** | Apache 2.0 |
| **初始化時間** | < 100ms |
| **記憶體佔用** | < 5MB |

## 🚀 快速開始

### 1️⃣ 引入文件

#### 📦 本地引入

```html
<!-- 引入 CSS 檔案 -->
<link rel="stylesheet" href="netease-mini-player-v2.css">

<!-- 引入 JS 檔案 -->
<script src="netease-mini-player-v2.js"></script>
```

**下載檔案：**
- [📥 從GitHub下載](https://github.com/numakkiyu/NeteaseMiniPlayer/archive/refs/tags/v2.0.4.zip)
- [📥 使用CDN下載](https://api.hypcvgm.top/NeteaseMiniPlayer/download/NeteaseMiniPlayer-v2.0.3.zip)

#### 🌐 CDN 引入

```html
<!-- 引入 CSS 檔案 -->
<link rel="stylesheet" href="https://api.hypcvgm.top/NeteaseMiniPlayer/netease-mini-player-v2.css">

<!-- 引入 JS 檔案 -->
<script src="https://api.hypcvgm.top/NeteaseMiniPlayer/netease-mini-player-v2.js"></script>
```

### 2️⃣ 建立播放器

```html
<!-- 基礎播放器 -->
<div class="netease-mini-player"
 data-playlist-id="14273792576"
 data-lyric="true"
 data-theme="auto"
 data-size="compact">
</div>

<!-- 浮動播放器 -->
<div class="netease-mini-player"
 data-playlist-id="14273792576"
 data-position="bottom-right"
 data-lyric="true"
 data-autoplay="false">
</div>
```

### 3️⃣ 初始化

```javascript
// 自動初始化（建議）
// 播放器會在 DOM 載入完成後自動初始化

// 手動初始化
document.addEventListener('DOMContentLoaded', function() {
 const players = document.querySelectorAll('.netease-mini-player');
 players.forEach(playerElement => {
 new NeteaseMiniPlayer(playerElement);
 });
});

// 單一播放器初始化
const playerElement = document.querySelector('#my-player');
const player = new NeteaseMiniPlayer(playerElement);
```

## ⚙️ 配置選項

透過 HTML 屬性配置播放器的各種功能和外觀：

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `data-playlist-id` | string | - | 歌單ID（必備） |
| `data-song-id` | string | - | 單曲ID（嵌入模式） |
| `data-position` | string | - | 浮動位置：`bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `data-embed` | boolean | `false` | 嵌入模式（隱藏上一首/下一首按鈕） |
| `data-lyric` | boolean | `true` | 是否顯示歌詞 |
| `data-theme` | string | `auto` | 主題：`light`, `dark`, `auto` |
| `data-autoplay` | boolean | `false` | 自動播放 |
| `data-volume` | number | `0.8` | 預設音量（0.0-1.0） |

## 🎮 使用範例

### 🎵 基礎播放器

```html
<div class="netease-mini-player"
 data-playlist-id="14273792576"
 data-lyric="true"
 data-theme="light">
</div>
```

### 🎯 嵌入模式播放器

```html
<div class="netease-mini-player"
 data-song-id="1901371647"
 data-embed="true"
 data-lyric="true"
 data-theme="auto">
</div>
```

### 🎪 浮動播放器

```html
<div class="netease-mini-player"
 data-playlist-id="14273792576"
 data-position="bottom-right"
 data-lyric="true"
 data-autoplay="false"
 data-theme="dark">
</div>
```

### 🎨 自訂主題

```html
<div class="netease-mini-player"
 data-playlist-id="14273792576"
 data-theme="auto"
 data-size="normal"
 data-volume="0.6">
</div>
```

## 🛠️ API 參考

### 播放器實例方法

```javascript
const player = new NeteaseMiniPlayer(element);

// 播放控制
player.play(); // 播放
player.pause(); // 暫停
player.stop(); // 停止
player.next(); // 下一首
player.prev(); // 上一首

// 音量控制
player.setVolume(0.5); // 設定音量 (0.0-1.0)
player.getVolume(); // 取得目前音量

// 進度控制
player.seek(30); // 跳到指定時間（秒）
player.getCurrentTime(); // 取得目前播放時間
player.getDuration(); // 取得歌曲總時長

// 播放清單
player.loadPlaylist(id); // 載入歌單
player.loadSong(id); // 載入單曲
player.getCurrentSong(); // 取得當前歌曲資訊
```

### 事件監聽

```javascript
const player = new NeteaseMiniPlayer(element);

// 播放狀態變化
player.on('play', () => console.log('開始播放'));
player.on('pause', () => console.log('暫停播放'));
player.on('ended', () => console.log('播放結束'));

// 歌曲變化
player.on('songchange', (song) => console.log('切換歌曲:', song));

// 進度更新
player.on('timeupdate', (time) => console.log('播放進度:', time));

// 音量變化
player.on('volumechange', (volume) => console.log('音量變化:', volume));
```

## 🎯 高級功能

### 🔄 循環模式

```html
<!-- 清單循環 -->
<div class="netease-mini-player" data-loop="list"></div>

<!-- 單曲循環 -->
<div class="netease-mini-player" data-loop="single"></div>

<!-- 不循環 -->
<div class="netease-mini-player" data-loop="none"></div>
```

### 🎨 主題切換

```javascript
// 動態切換主題
player.setTheme('dark'); // 暗色主題
player.setTheme('light'); // 明亮主題
player.setTheme('auto'); // 自動主題（跟隨系統）
```

### 📱 響應式佈局

播放器會自動適配不同螢幕尺寸：

- **桌面端**：完整功能介面
- **平板**：優化的觸控介面
- **手機**：小巧的行動介面

## 🔧 自訂樣式

### CSS 變數

```css
.netease-mini-player {
 --primary-color: #1890ff;
 --background-color: #ffffff;
 --text-color: #333333;
 --border-radius: 12px;
 --shadow-color: rgba(0, 0, 0, 0.1);
}
```

### 自訂主題

```css
/* 自訂暗色主題 */
.netease-mini-player[data-theme="dark"] {
 --background-color: #1f1f1f;
 --text-color: #ffffff;
 --primary-color: #4facfe;
}
```

## 📋 瀏覽器相容性

| 瀏覽器 | 版本需求 | 支援狀態 |
|--------|----------|----------|
| Chrome | 60+ | ✅ 完全支援 |
| Firefox | 55+ | ✅ 完全支援 |
| Safari | 12+ | ✅ 完全支援 |
| Edge | 79+ | ✅ 完全支援 |
| IE | - | ❌ 不支援 |

## 🚨 注意事項

- 📱 播放器會自動偵測頁面中的 `.netease-mini-player` 元素並初始化
- ⚠️ 確保在引入 JS 檔案後再建立播放器元素
- ✅ 支援在同一頁面建立多個播放器實例
- 🔒 部分瀏覽器需要使用者互動後才能自動播放音訊

## 📝 更新日誌

### v2.0.1 (2025-10-16)
- ✨ 新增嵌入模式支持
- 🐛 修正單曲模式下歌曲資訊取得問題
- 🎨 優化播放器UI，隱藏嵌入模式的切換按鈕
- ⚡ 提升播放器初始化效能
- 🔧 完善錯誤處理機制

### v2.0.0 (2025-9-26)
- 🎉 全新 v2 版本發布
- 🎨 採用 Neumorphism 設計風格
- 💿 新增黑膠唱片旋轉效果
- 🎵 重構歌詞系統
- 📱 完善響應式佈局
- 🌙 新增主題切換功能

## 📄 許可證

本專案基於 [Apache License 2.0](LICENSE) 開源協定。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來幫助改進這個專案！

## 📞 聯絡方式

- 📧 信箱：[imbhcn@gmail.com](imbhcn@gmail.com)
- 🐛 問題回饋：[GitHub Issues](https://github.com/numakkiyu/NeteaseMiniPlayer/issues)
- 💬 討論交流：[GitHub Discussions](https://github.com/numakkiyu/NeteaseMiniPlayer/discussions)

---

<div align="center">

**如果這個專案對你有幫助，請給它一個 ⭐ Star！**

Made with ❤️ by [北海的佰川](https://github.com/numakkiyu)

</div>
