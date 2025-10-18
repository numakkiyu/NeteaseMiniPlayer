# 🎵 网易云音乐迷你播放器 NeteaseMiniPlayer v2

<div align="center">
  

**基于 NeteaseCloudMusicApi 的网易云 API 二次开发 CDN 可插入式音乐播放器 UI 组件库**

[🚀 快速开始](#-快速开始) • [📖 文档](#-配置选项) • [🎮 演示](#-使用示例) • [🛠️ API](#-api-参考)

</div>

> 注意：Netease Mini Player v1 版本过旧已弃用，不再提供维护，已归档

> 在线演示：[https://nmp.hypcvgm.top/](https://nmp.hypcvgm.top/)
---

## ✨ 核心特性

<table>
<tr>
<td width="50%">

### 🎨 **Neumorphism 设计**
采用新拟态设计风格，柔和的阴影和高光效果，现代化的视觉体验

### 💿 **歌单切歌**
可以在填写的歌单内自由切换歌单里面的音乐

### 📱 **完全响应式**
适配桌面端、平板和移动设备，支持触摸操作

### 🎵 **迷你歌词系统**
双层歌词布局，支持翻译显示，当前行高亮和发光效果

</td>
<td width="50%">

### 🎛️ **完整播放控制**
- ▶️ 播放/暂停/停止
- ⏮️ 上一首/下一首
- 🎚️ 拖拽进度条
- 🔊 滑块控制音量

### 📋 **智能播放列表**
紧凑列表展示，点击切换歌曲，支持滑动浏览

### ⚡ **CDN 就绪**
无需构建工具，直接通过 HTML 属性配置，即插即用

### 🌙 **主题支持**
支持明亮、暗色和自动主题，适应用户系统偏好

</td>
</tr>
</table>

## 🏗️ 基于 NeteaseCloudMusicApi 构建

本播放器基于开源项目 **NeteaseCloudMusicApi** 提供的接口服务，通过 API 代理实现跨域访问。当前演示使用 **[墨染云](https://i9mr.com/)** 的`https://zm.i9mr.com` 作为数据源。

> 💡 **提示：** 为获得更稳定的服务体验，建议在生产环境中部署自己的 NeteaseCloudMusicApi 实例

## 📊 技术规格

| 项目 | 详情 |
|------|------|
| **框架依赖** | 无依赖，纯原生 JavaScript |
| **浏览器支持** | Chrome 60+, Firefox 55+, Safari 12+ |
| **文件大小** | CSS 15KB + JS 35KB (压缩后) |
| **API 来源** | NeteaseCloudMusicApi |
| **许可证** | Apache 2.0 |
| **初始化时间** | < 100ms |
| **内存占用** | < 5MB |

## 🚀 快速开始

### 1️⃣ 引入文件

#### 📦 本地引入

```html
<!-- 引入 CSS 文件 -->
<link rel="stylesheet" href="netease-mini-player-v2.css">

<!-- 引入 JS 文件 -->
<script src="netease-mini-player-v2.js"></script>
```

**下载文件：**
- [📥 下载 CSS 文件](https://api.hypcvgm.top/NeteaseMiniPlayer/download/netease-mini-player-v2.css)
- [📥 下载 JS 文件](https://api.hypcvgm.top/NeteaseMiniPlayer/download/netease-mini-player-v2.js)

#### 🌐 CDN 引入

```html
<!-- 引入 CSS 文件 -->
<link rel="stylesheet" href="https://api.hypcvgm.top/NeteaseMiniPlayer/netease-mini-player-v2.css">

<!-- 引入 JS 文件 -->
<script src="https://api.hypcvgm.top/NeteaseMiniPlayer/netease-mini-player-v2.js"></script>
```

### 2️⃣ 创建播放器

```html
<!-- 基础播放器 -->
<div class="netease-mini-player" 
     data-playlist-id="14273792576"
     data-lyric="true"
     data-theme="auto"
     data-size="compact">
</div>

<!-- 浮动播放器 -->
<div class="netease-mini-player" 
     data-playlist-id="14273792576"
     data-position="bottom-right"
     data-lyric="true"
     data-autoplay="false">
</div>
```

### 3️⃣ 初始化

```javascript
// 自动初始化（推荐）
// 播放器会在 DOM 加载完成后自动初始化

// 手动初始化
document.addEventListener('DOMContentLoaded', function() {
    const players = document.querySelectorAll('.netease-mini-player');
    players.forEach(playerElement => {
        new NeteaseMiniPlayer(playerElement);
    });
});

// 单个播放器初始化
const playerElement = document.querySelector('#my-player');
const player = new NeteaseMiniPlayer(playerElement);
```

## ⚙️ 配置选项

通过 HTML 属性配置播放器的各种功能和外观：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data-playlist-id` | string | - | 歌单ID（必需） |
| `data-song-id` | string | - | 单曲ID（嵌入模式） |
| `data-position` | string | - | 浮动位置：`bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `data-embed` | boolean | `false` | 嵌入模式（隐藏上一首/下一首按钮） |
| `data-lyric` | boolean | `true` | 是否显示歌词 |
| `data-theme` | string | `auto` | 主题：`light`, `dark`, `auto` |
| `data-autoplay` | boolean | `false` | 自动播放 |
| `data-volume` | number | `0.8` | 默认音量（0.0-1.0） |

## 🎮 使用示例

### 🎵 基础播放器

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

### 🎪 浮动播放器

```html
<div class="netease-mini-player" 
     data-playlist-id="14273792576"
     data-position="bottom-right"
     data-lyric="true"
     data-autoplay="false"
     data-theme="dark">
</div>
```

### 🎨 自定义主题

```html
<div class="netease-mini-player" 
     data-playlist-id="14273792576"
     data-theme="auto"
     data-size="normal"
     data-volume="0.6">
</div>
```

## 🛠️ API 参考

### 播放器实例方法

```javascript
const player = new NeteaseMiniPlayer(element);

// 播放控制
player.play();           // 播放
player.pause();          // 暂停
player.stop();           // 停止
player.next();           // 下一首
player.prev();           // 上一首

// 音量控制
player.setVolume(0.5);   // 设置音量 (0.0-1.0)
player.getVolume();      // 获取当前音量

// 进度控制
player.seek(30);         // 跳转到指定时间（秒）
player.getCurrentTime(); // 获取当前播放时间
player.getDuration();    // 获取歌曲总时长

// 播放列表
player.loadPlaylist(id); // 加载歌单
player.loadSong(id);     // 加载单曲
player.getCurrentSong(); // 获取当前歌曲信息
```

### 事件监听

```javascript
const player = new NeteaseMiniPlayer(element);

// 播放状态变化
player.on('play', () => console.log('开始播放'));
player.on('pause', () => console.log('暂停播放'));
player.on('ended', () => console.log('播放结束'));

// 歌曲变化
player.on('songchange', (song) => console.log('切换歌曲:', song));

// 进度更新
player.on('timeupdate', (time) => console.log('播放进度:', time));

// 音量变化
player.on('volumechange', (volume) => console.log('音量变化:', volume));
```

## 🎯 高级功能

### 🔄 循环模式

```html
<!-- 列表循环 -->
<div class="netease-mini-player" data-loop="list"></div>

<!-- 单曲循环 -->
<div class="netease-mini-player" data-loop="single"></div>

<!-- 不循环 -->
<div class="netease-mini-player" data-loop="none"></div>
```

### 🎨 主题切换

```javascript
// 动态切换主题
player.setTheme('dark');   // 暗色主题
player.setTheme('light');  // 明亮主题
player.setTheme('auto');   // 自动主题（跟随系统）
```

### 📱 响应式布局

播放器会自动适配不同屏幕尺寸：

- **桌面端**：完整功能界面
- **平板**：优化的触摸界面
- **手机**：紧凑的移动界面

## 🔧 自定义样式

### CSS 变量

```css
.netease-mini-player {
    --primary-color: #1890ff;
    --background-color: #ffffff;
    --text-color: #333333;
    --border-radius: 12px;
    --shadow-color: rgba(0, 0, 0, 0.1);
}
```

### 自定义主题

```css
/* 自定义暗色主题 */
.netease-mini-player[data-theme="dark"] {
    --background-color: #1f1f1f;
    --text-color: #ffffff;
    --primary-color: #4facfe;
}
```

## 📋 浏览器兼容性

| 浏览器 | 版本要求 | 支持状态 |
|--------|----------|----------|
| Chrome | 60+ | ✅ 完全支持 |
| Firefox | 55+ | ✅ 完全支持 |
| Safari | 12+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| IE | - | ❌ 不支持 |

## 🚨 注意事项

- 📱 播放器会自动检测页面中的 `.netease-mini-player` 元素并初始化
- ⚠️ 确保在引入 JS 文件后再创建播放器元素
- ✅ 支持在同一页面创建多个播放器实例
- 🔒 部分浏览器需要用户交互后才能自动播放音频

## 📝 更新日志

### v2.0.1 (2025-10-16)
- ✨ 新增嵌入模式支持
- 🐛 修复单曲模式下歌曲信息获取问题
- 🎨 优化播放器UI，隐藏嵌入模式下的切换按钮
- ⚡ 提升播放器初始化性能
- 🔧 完善错误处理机制

### v2.0.0 (2025-9-26)
- 🎉 全新 v2 版本发布
- 🎨 采用 Neumorphism 设计风格
- 💿 新增黑胶唱片旋转效果
- 🎵 重构歌词系统
- 📱 完善响应式布局
- 🌙 新增主题切换功能

## 📄 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源协议。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## 📞 联系方式

- 📧 邮箱：[imbhcn@gmail.com](imbhcn@gmail.com)
- 🐛 问题反馈：[GitHub Issues](https://github.com/numakkiyu/NeteaseMiniPlayer/issues)
- 💬 讨论交流：[GitHub Discussions](https://github.com/numakkiyu/NeteaseMiniPlayer/discussions)

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐ Star！**

Made with ❤️ by [北海的佰川](https://github.com/numakkiyu)

</div>
