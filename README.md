# 🎵 [NMP v2] NeteaseMiniPlayer v2 网易云音乐迷你播放器

<div align="center">

<img width="861" height="430" alt="NMPV2" src="https://github.com/numakkiyu/NeteaseMiniPlayer/blob/main/NMPV2.png" />

**基于 NetEase Cloud Music API 的轻量级、可嵌入式音乐播放器组件库**

[🚀 快速开始](#-快速开始) • [📝 短代码语法](#-短代码语法-new) • [⚙️ 配置选项](#-配置选项) • [🛠️ API](#-api-参考)

必看 [[NMP v2] NeteaseMiniPlayer v2 使用文档](https://docs.nmp.hypcvgm.top/) 

</div>

> 注意：Netease Mini Player v1 版本过旧已弃用，不再提供维护，已归档
>
> **演示地址：** [https://nmp.hypcvgm.top/](https://nmp.hypcvgm.top/)

---

## ✨ 核心特性 v2.1

<table>
<tr>
<td width="50%">

### 📝 **Shortcode 短代码支持 (New)**
支持在文章或页面任意位置使用 `{nmpv2:playlist=id}` 语法自动生成播放器，无需编写 HTML。

### 🎭 **智能交互与动效**
- **空闲淡出 & 侧边停靠**：播放器闲置时自动变半透明并停靠至屏幕边缘，减少视觉干扰。
- **黑胶唱片模式**：最小化时变身为旋转的黑胶唱片，支持拖拽（预留）。

### 🎨 **自适应主题**
- 支持 **Auto (跟随系统)**、**Dark**、**Light** 模式。
- 内置 CSS 变量系统，支持实时颜色提取和自定义配色。

### 📱 **移动端深度适配**
- 针对手机端自动隐藏音量条等非必要控件。
- 触摸友好的操作区域和手势支持。

</td>
<td width="50%">

### 🧠 **全局音频管理**
- **互斥播放**：页面内多个播放器自动互斥，确保同一时间只有一个音源播放。
- **状态记忆**：记住播放进度、音量设置。
- **页面可见性控制**：切换标签页自动暂停/恢复（可配置）。

### 🎵 **歌词与翻译**
- 支持双语歌词显示。
- 逐行滚动与高亮动画。
- 智能截断超长歌手名和标题。

### ⚡ **CDN 即插即用**
- 无需构建工具，单 JS/CSS 文件引入。
- 极小的体积：核心逻辑仅 ~35KB。

</td>
</tr>
</table>

## 🚀 快速开始

### 1️⃣ 引入文件

建议使用官方 CDN 以获取最新特性：

```html
<!-- 引入 CSS (HEAD标签内) -->
<link rel="stylesheet" href="https://api.hypcvgm.top/NeteaseMiniPlayer/netease-mini-player-v2.css">

<!-- 引入 JS (BODY标签底部) -->
<script src="https://api.hypcvgm.top/NeteaseMiniPlayer/netease-mini-player-v2.js"></script>
```

### 2️⃣ 使用播放器

#### 方法 A：使用 HTML 标签 (标准)

适合开发者或固定布局使用：

```html
<!-- 歌单模式 -->
<div class="netease-mini-player" 
     data-playlist-id="14273792576"
     data-theme="auto"
     data-position="static">
</div>

<!-- 单曲模式 + 悬浮 + 默认最小化 -->
<div class="netease-mini-player" 
     data-song-id="1901371647"
     data-position="bottom-right"
     data-default-minimized="true">
</div>
```

#### 方法 B：使用短代码 (推荐 v2.1+)

适合在 CMS、博客文章或动态内容中使用。脚本加载后会自动解析这些文本：

```text
<!-- 播放歌单 -->
{nmpv2:playlist=14273792576}

<!-- 播放单曲并指定参数 -->
{nmpv2:song-id=1901371647, position=bottom-left, theme=dark}
```

---

## 📝 短代码语法 (New)

NMP v2.1 引入了强大的文本解析器，允许你通过简单的文本指令插入播放器。

**基本语法：** `{nmpv2:类型=ID, 参数1=值, 参数2=值...}`

| 场景 | 语法示例 |
|------|----------|
| **指定歌单** | `{nmpv2:playlist=8245642969}` |
| **指定单曲** | `{nmpv2:song-id=1860043596}` 或简写 `{nmpv2:1860043596}` |
| **带参数** | `{nmpv2:playlist=xxx, minimized=true, theme=dark}` |

**支持的短代码参数：**

- `playlist-id`: 歌单 ID
- `song-id`: 单曲 ID
- `position`: `static` (默认), `top-left`, `top-right`, `bottom-left`, `bottom-right`
- `theme`: `auto`, `light`, `dark`
- `minimized`: `true` (默认最小化)
- `lyric`: `true`/`false` (显示歌词)
- `autoplay`: `true`/`false`

---

## ⚙️ 配置选项

所有配置均可通过 HTML 的 `data-*` 属性进行设置：

| 属性 (Attribute) | 类型 | 默认值 | 说明 |
|------------------|------|--------|------|
| `data-playlist-id` | string | - | 网易云歌单 ID (与 song-id 二选一) |
| `data-song-id` | string | - | 网易云单曲 ID (与 playlist-id 二选一) |
| `data-position` | string | `static` | 布局位置：`static`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `data-theme` | string | `auto` | 主题模式：`auto` (跟随系统), `light`, `dark` |
| `data-default-minimized` | boolean | `false` | 初始化时是否默认收起为圆盘模式 |
| `data-embed` | boolean | `false` | 嵌入模式（隐藏切歌、列表按钮，适合iframe或小区域） |
| `data-lyric` | boolean | `true` | 是否显示歌词区域 |
| `data-autoplay` | boolean | `false` | 是否自动播放 (受浏览器策略限制) |
| `data-auto-pause` | boolean | `false` | **特殊：** 设置为 `true` 表示**禁用**“切出页面自动暂停”功能 (保持后台播放) |

## 🛠️ API 参考

播放器挂载在 `window.NeteaseMiniPlayer` 上，且每个 DOM 元素可以通过 `element.neteasePlayer` 获取实例。

### 全局方法

```javascript
// 手动初始化页面上新增的播放器元素
NeteaseMiniPlayer.init();

// 解析某元素内的短代码
window.processNMPv2Shortcodes(document.getElementById('content'));
```

### 实例方法

```javascript
const element = document.querySelector('.netease-mini-player');
const player = element.neteasePlayer; // 获取实例

// 控制
player.play();           // 播放
player.pause();          // 暂停
player.togglePlay();     // 切换播放状态
player.nextSong();       // 下一首
player.previousSong();   // 上一首
player.toggleMinimize(); // 切换 展开/最小化 状态

// 数据加载
player.loadPlaylist('123456'); // 加载新歌单
player.loadSingleSong('123');  // 加载新单曲

// 状态设置
player.setTheme('dark'); // 强制切换主题
```

## 🔧 CSS 自定义

v2.1 使用 CSS 变量构建，你可以在自己的 CSS 中覆盖它们来定制外观：

```css
:root {
    /* 主色调 (播放按钮、进度条) */
    --accent-color: #FF6B35;
    /* 渐变色辅助 */
    --accent-color-2: #7A66FF; 
    
    /* 背景流光效果颜色 */
    --flow-color-1: rgba(255, 107, 53, 0.32);
}

/* 针对暗色模式的覆盖 */
.netease-mini-player[data-theme="dark"] {
    --bg-color: #1e1e1e;
    --text-primary: #e0e0e0;
}
```

## 📋 更新日志

### v2.1.0 (2025-02-25)
- ✨ **新特性**：引入 Shortcode 短代码解析器，支持文本转播放器。
- ✨ **新特性**：新增空闲淡出 (Idle Fading) 和侧边停靠 (Docking) 动效。
- 🎨 **UI 优化**：全套 SVG 图标更新，支持无障碍访问 (ARIA)。
- 📱 **移动端**：优化移动端环境检测与控件布局（自动隐藏音量条）。
- 🔧 **核心**：引入 `GlobalAudioManager`，实现多实例互斥播放。
- 🔧 **API**：更新后端 API 端点为 `api.hypcvgm.top`。

### v2.0.0
- 🎉 重构版本，采用新拟态设计风格。
- 💿 新增黑胶唱片旋转动画。

## 📄 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源协议。

## 🤝 贡献与反馈

- **GitHub**: [https://github.com/numakkiyu/NeteaseMiniPlayer](https://github.com/numakkiyu/NeteaseMiniPlayer)
- **Issues**: 遇到问题或有新建议？请提交 Issue。

---
<div align="center">
Made with ❤️ by BHCN STUDIO & 北海的佰川
</div>
