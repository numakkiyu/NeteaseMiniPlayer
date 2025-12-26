/**
 * [NMPv2] NeteaseMiniPlayer v2 JavaScript
 * Lightweight Player Component Based on NetEase Cloud Music API
 * 
 * Copyright 2025 BHCN STUDIO & 北海的佰川（ImBHCN[numakkiyu]）
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * 播放器配置对象类型定义
 * @typedef {Object} PlayerConfig
 * @property {boolean} embed - 是否嵌入模式（隐藏部分控制，适配容器）
 * @property {boolean} autoplay - 是否在初始化后自动播放
 * @property {string | undefined} playlistId - 播放列表ID（与`songId`互斥）
 * @property {string | undefined} songId - 单曲ID（与`playlistId`互斥）
 * @property {('static'|'top-left'|'top-right'|'bottom-left'|'bottom-right')} position - 组件位置枚举
 * @property {boolean} lyric - 是否显示歌词
 * @property {('auto'|'dark'|'light')} theme - 主题模式枚举
 * @property {('compact'|string)} size - 尺寸模式（默认`compact`，可按需扩展）
 * @property {boolean} defaultMinimized - 是否默认最小化（需配合定位生效）
 */

/**
 * 歌曲信息类型定义
 * @typedef {Object} SongInfo
 * @property {number | string} id - 歌曲ID
 * @property {string} name - 歌曲名称
 * @property {string} artists - 艺术家名称（以` / `分隔）
 * @property {string} album - 专辑名称
 * @property {string} picUrl - 封面图片URL
 * @property {number} duration - 时长（毫秒）
 */

/**
 * 歌词条目类型定义
 * @typedef {Object} LyricEntry
 * @property {number} time - 时间戳（秒）
 * @property {string} text - 原文歌词
 * @property {string} translation - 翻译歌词
 */

/**
 * 运行环境信息类型定义
 * @typedef {Object} UAInfo
 * @property {boolean} isMobile - 是否移动端环境
 * @property {boolean} isiOS - 是否iOS设备
 * @property {boolean} isAndroid - 是否Android设备
 * @property {boolean} isHarmonyOS - 是否HarmonyOS设备
 * @property {boolean} isHarmonyDesktop - 是否HarmonyOS桌面环境
 * @property {boolean} isWeChat - 是否微信WebView
 * @property {boolean} isQQ - 是否QQ或MQQBrowser
 * @property {boolean} isInAppWebView - 是否App内置WebView
 * @property {boolean} isPWA - 是否PWA独立模式
 * @property {boolean} isiPad - 是否iPad或iPad风格设备
 */

/**
 * DOM引用映射类型定义
 * @typedef {Object.<string, HTMLElement>} ElementsMap
 */
/**
 * 全局音频管理器，确保同一时间仅有一个播放器实例在播放
 * @namespace GlobalAudioManager
 * @property {NeteaseMiniPlayer | null} currentPlayer - 当前激活的播放器实例
 * @example
 * // 设置新的当前播放器，会自动暂停之前的播放器
 * GlobalAudioManager.setCurrent(player);
 */
const GlobalAudioManager = {
    currentPlayer: null,
    /**
     * 设置当前播放器实例，并在必要时暂停之前的实例
     * @param {NeteaseMiniPlayer} player - 需要设置为当前的播放器实例
     */
    setCurrent(player) {
        if (this.currentPlayer && this.currentPlayer !== player) {
            this.currentPlayer.pause();
        }
        this.currentPlayer = player;
    }
};

const ICONS = {
    prev: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M556.2 541.6C544.2 546.6 530.5 543.8 521.3 534.7L352 365.3L352 512C352 524.9 344.2 536.6 332.2 541.6C320.2 546.6 306.5 543.8 297.3 534.7L128 365.3L128 512C128 529.7 113.7 544 96 544C78.3 544 64 529.7 64 512L64 128C64 110.3 78.3 96 96 96C113.7 96 128 110.3 128 128L128 274.7L297.4 105.4C306.6 96.2 320.3 93.5 332.3 98.5C344.3 103.5 352 115.1 352 128L352 274.7L521.4 105.3C530.6 96.1 544.3 93.4 556.3 98.4C568.3 103.4 576 115.1 576 128L576 512C576 524.9 568.2 536.6 556.2 541.6z"/></svg>`,
    next: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M83.8 541.6C95.8 546.6 109.5 543.8 118.7 534.7L288 365.3L288 512C288 524.9 295.8 536.6 307.8 541.6C319.8 546.6 333.5 543.8 342.7 534.7L512 365.3L512 512C512 529.7 526.3 544 544 544C561.7 544 576 529.7 576 512L576 128C576 110.3 561.7 96 544 96C526.3 96 512 110.3 512 128L512 274.7L342.6 105.3C333.4 96.1 319.7 93.4 307.7 98.4C295.7 103.4 288 115.1 288 128L288 274.7L118.6 105.4C109.4 96.2 95.7 93.5 83.7 98.5C71.7 103.5 64 115.1 64 128L64 512C64 524.9 71.8 536.6 83.8 541.6z"/></svg>`,
    play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"/></svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M176 96C149.5 96 128 117.5 128 144L128 496C128 522.5 149.5 544 176 544L240 544C266.5 544 288 522.5 288 496L288 144C288 117.5 266.5 96 240 96L176 96zM400 96C373.5 96 352 117.5 352 144L352 496C352 522.5 373.5 544 400 544L464 544C490.5 544 512 522.5 512 496L512 144C512 117.5 490.5 96 464 96L400 96z"/></svg>`,
    volume: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M533.6 96.5C523.3 88.1 508.2 89.7 499.8 100C491.4 110.3 493 125.4 503.3 133.8C557.5 177.8 592 244.8 592 320C592 395.2 557.5 462.2 503.3 506.3C493 514.7 491.5 529.8 499.8 540.1C508.1 550.4 523.3 551.9 533.6 543.6C598.5 490.7 640 410.2 640 320C640 229.8 598.5 149.2 533.6 96.5zM473.1 171C462.8 162.6 447.7 164.2 439.3 174.5C430.9 184.8 432.5 199.9 442.8 208.3C475.3 234.7 496 274.9 496 320C496 365.1 475.3 405.3 442.8 431.8C432.5 440.2 431 455.3 439.3 465.6C447.6 475.9 462.8 477.4 473.1 469.1C516.3 433.9 544 380.2 544 320.1C544 260 516.3 206.3 473.1 171.1zM412.6 245.5C402.3 237.1 387.2 238.7 378.8 249C370.4 259.3 372 274.4 382.3 282.8C393.1 291.6 400 305 400 320C400 335 393.1 348.4 382.3 357.3C372 365.7 370.5 380.8 378.8 391.1C387.1 401.4 402.3 402.9 412.6 394.6C434.1 376.9 448 350.1 448 320C448 289.9 434.1 263.1 412.6 245.5zM80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416z"/></svg>`,
    lyrics: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M532 71C539.6 77.1 544 86.3 544 96L544 400C544 444.2 501 480 448 480C395 480 352 444.2 352 400C352 355.8 395 320 448 320C459.2 320 470 321.6 480 324.6L480 207.9L256 257.7L256 464C256 508.2 213 544 160 544C107 544 64 508.2 64 464C64 419.8 107 384 160 384C171.2 384 182 385.6 192 388.6L192 160C192 145 202.4 132 217.1 128.8L505.1 64.8C514.6 62.7 524.5 65 532.1 71.1z"/></svg>`,
    list: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M104 112C90.7 112 80 122.7 80 136L80 184C80 197.3 90.7 208 104 208L152 208C165.3 208 176 197.3 176 184L176 136C176 122.7 165.3 112 152 112L104 112zM256 128C238.3 128 224 142.3 224 160C224 177.7 238.3 192 256 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L256 128zM256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L256 288zM256 448C238.3 448 224 462.3 224 480C224 497.7 238.3 512 256 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L256 448zM80 296L80 344C80 357.3 90.7 368 104 368L152 368C165.3 368 176 357.3 176 344L176 296C176 282.7 165.3 272 152 272L104 272C90.7 272 80 282.7 80 296zM104 432C90.7 432 80 442.7 80 456L80 504C80 517.3 90.7 528 104 528L152 528C165.3 528 176 517.3 176 504L176 456C176 442.7 165.3 432 152 432L104 432z"/></svg>`,
    minimize: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 352C302.3 352 288 337.7 288 320C288 302.3 302.3 288 320 288C337.7 288 352 302.3 352 320C352 337.7 337.7 352 320 352zM224 320C224 373 267 416 320 416C373 416 416 373 416 320C416 267 373 224 320 224C267 224 224 267 224 320zM168 304C168 271.6 184.3 237.4 210.8 210.8C237.3 184.2 271.6 168 304 168C317.3 168 328 157.3 328 144C328 130.7 317.3 120 304 120C256.1 120 210.3 143.5 176.9 176.9C143.5 210.3 120 256.1 120 304C120 317.3 130.7 328 144 328C157.3 328 168 317.3 168 304z"/></svg>`,
    maximize: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM320 352C302.3 352 288 337.7 288 320C288 302.3 302.3 288 320 288C337.7 288 352 302.3 352 320C352 337.7 337.7 352 320 352zM224 320C224 373 267 416 320 416C373 416 416 373 416 320C416 267 373 224 320 224C267 224 224 267 224 320zM168 304C168 271.6 184.3 237.4 210.8 210.8C237.3 184.2 271.6 168 304 168C317.3 168 328 157.3 328 144C328 130.7 317.3 120 304 120C256.1 120 210.3 143.5 176.9 176.9C143.5 210.3 120 256.1 120 304C120 317.3 130.7 328 144 328C157.3 328 168 317.3 168 304z"/></svg>`,
    loopList: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M534.6 182.6C547.1 170.1 547.1 149.8 534.6 137.3L470.6 73.3C461.4 64.1 447.7 61.4 435.7 66.4C423.7 71.4 416 83.1 416 96L416 128L256 128C150 128 64 214 64 320C64 337.7 78.3 352 96 352C113.7 352 128 337.7 128 320C128 249.3 185.3 192 256 192L416 192L416 224C416 236.9 423.8 248.6 435.8 253.6C447.8 258.6 461.5 255.8 470.7 246.7L534.7 182.7zM105.4 457.4C92.9 469.9 92.9 490.2 105.4 502.7L169.4 566.7C178.6 575.9 192.3 578.6 204.3 573.6C216.3 568.6 224 556.9 224 544L224 512L384 512C490 512 576 426 576 320C576 302.3 561.7 288 544 288C526.3 288 512 302.3 512 320C512 390.7 454.7 448 384 448L224 448L224 416C224 403.1 216.2 391.4 204.2 386.4C192.2 381.4 178.5 384.2 169.3 393.3L105.3 457.3z"/></svg>`,
    loopSingle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M534.6 182.6C547.1 170.1 547.1 149.8 534.6 137.3L470.6 73.3C461.4 64.1 447.7 61.4 435.7 66.4C423.7 71.4 416 83.1 416 96L416 128L256 128C150 128 64 214 64 320C64 337.7 78.3 352 96 352C113.7 352 128 337.7 128 320C128 249.3 185.3 192 256 192L416 192L416 224C416 236.9 423.8 248.6 435.8 253.6C447.8 258.6 461.5 255.8 470.7 246.7L534.7 182.7zM105.4 457.4C92.9 469.9 92.9 490.2 105.4 502.7L169.4 566.7C178.6 575.9 192.3 578.6 204.3 573.6C216.3 568.6 224 556.9 224 544L224 512L384 512C490 512 576 426 576 320C576 302.3 561.7 288 544 288C526.3 288 512 302.3 512 320C512 390.7 454.7 448 384 448L224 448L224 416C224 403.1 216.2 391.4 204.2 386.4C192.2 381.4 178.5 384.2 169.3 393.3L105.3 457.3z"/><path d="M295 280L305 260L335 260L335 380L305 380L305 280Z"/></svg>`,
    shuffle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M467.8 98.4C479.8 93.4 493.5 96.2 502.7 105.3L566.7 169.3C572.7 175.3 576.1 183.4 576.1 191.9C576.1 200.4 572.7 208.5 566.7 214.5L502.7 278.5C493.5 287.7 479.8 290.4 467.8 285.4C455.8 280.4 448 268.9 448 256L448 224L416 224C405.9 224 396.4 228.7 390.4 236.8L358 280L318 226.7L339.2 198.4C357.3 174.2 385.8 160 416 160L448 160L448 128C448 115.1 455.8 103.4 467.8 98.4zM218 360L258 413.3L236.8 441.6C218.7 465.8 190.2 480 160 480L96 480C78.3 480 64 465.7 64 448C64 430.3 78.3 416 96 416L160 416C170.1 416 179.6 411.3 185.6 403.2L218 360zM502.6 534.6C493.4 543.8 479.7 546.5 467.7 541.5C455.7 536.5 448 524.9 448 512L448 480L416 480C385.8 480 357.3 465.8 339.2 441.6L185.6 236.8C179.6 228.7 170.1 224 160 224L96 224C78.3 224 64 209.7 64 192C64 174.3 78.3 160 96 160L160 160C190.2 160 218.7 174.2 236.8 198.4L390.4 403.2C396.4 411.3 405.9 416 416 416L448 416L448 384C448 371.1 455.8 359.4 467.8 354.4C479.8 349.4 493.5 352.2 502.7 361.3L566.7 425.3C572.7 431.3 576.1 439.4 576.1 447.9C576.1 456.4 572.7 464.5 566.7 470.5L502.7 534.5z"/></svg>`
};
/**
 * 播放器核心类，管理音频播放、状态同步、歌词解析和UI更新
 * @class NeteaseMiniPlayer
 * @constructor
 * @description
 * - 适用于网页嵌入式或独立悬浮播放控件
 * - 支持歌单/单曲加载、歌词解析、主题跟随与移动端优化
 * - 注意：同一页面建议使用全局音频管理器避免多实例同时播放
 * @see https://github.com/numakkiyu/NeteaseMiniPlayer
 * @property {HTMLElement} element - 容器元素（组件挂载目标）
 * @property {PlayerConfig} config - 播放器配置项
 * @property {SongInfo | null} currentSong - 当前歌曲信息
 * @property {SongInfo[]} playlist - 播放列表（按索引顺序播放）
 * @property {number} currentIndex - 当前播放索引
 * @property {HTMLAudioElement} audio - 原生Audio实例
 * @property {boolean} wasPlayingBeforeHidden - 页面隐藏前是否在播放
 * @property {boolean} isPlaying - 是否正在播放
 * @property {number} currentTime - 当前播放进度（秒）
 * @property {number} duration - 当前歌曲总时长（秒）
 * @property {number} volume - 音量值（0.0 - 1.0）
 * @property {LyricEntry[]} lyrics - 已解析的歌词列表
 * @property {number} currentLyricIndex - 当前歌词行索引
 * @property {boolean} showLyrics - 是否显示歌词
 * @property {Map<string, any>} cache - 简易缓存（带过期时间）
 * @property {('list'|'single'|'shuffle')} playMode - 播放模式枚举
 * @property {number[]} shuffleHistory - 随机播放历史索引（避免连续重复）
 * @property {number | null} idleTimeout - 空闲淡出定时器ID
 * @property {number} idleDelay - 空闲淡出延迟（毫秒）
 * @property {boolean} isIdle - 是否处于空闲淡出态
 * @property {boolean} isMinimized - 是否处于最小化态
 * @property {ElementsMap} elements - 关键DOM引用映射
 *
 * @example
 * const el = document.querySelector('.netease-mini-player');
 * const player = new NeteaseMiniPlayer(el);
 * // 加载并播放播放列表
 * player.parseConfig();
 * player.init().then(() => player.play());
 */
class NeteaseMiniPlayer {
    /**
     * 构造函数，初始化实例并解析配置
     * @param {HTMLElement} element - 组件挂载的容器元素
     */
    constructor(element) {
        this.element = element;
        this.element.neteasePlayer = this;
        this.config = this.parseConfig();
        this.currentSong = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.audio = new Audio();
        this.wasPlayingBeforeHidden = false;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        this.lyrics = [];
        this.currentLyricIndex = -1;
        this.showLyrics = this.config.lyric;
        this.cache = new Map();
        this.init();
        this.playMode = 'list';
        this.shuffleHistory = [];
        this.idleTimeout = null;
        this.idleDelay = 5000;
        this.isIdle = false;
    }
    /**
     * 解析容器上的`data-*`属性为内部配置
     * @returns {PlayerConfig} 返回解析后的配置对象
     */
    parseConfig() {
        const element = this.element;
        const position = element.dataset.position || 'static';
        const validPositions = ['static', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const finalPosition = validPositions.includes(position) ? position : 'static';
        const defaultMinimized = element.dataset.defaultMinimized === 'true';
        
        const embedValue = element.getAttribute('data-embed') || element.dataset.embed;
        const isEmbed = embedValue === 'true' || embedValue === true;

        const autoPauseAttr = element.getAttribute('data-auto-pause') ?? element.dataset.autoPause;
        const autoPauseDisabled = autoPauseAttr === 'true' || autoPauseAttr === true;

        return {
            embed: isEmbed,
            autoplay: element.dataset.autoplay === 'true',
            playlistId: element.dataset.playlistId,
            songId: element.dataset.songId,
            position: finalPosition,
            lyric: element.dataset.lyric !== 'false',
            theme: element.dataset.theme || 'auto',
            size: element.dataset.size || 'compact',
            defaultMinimized: defaultMinimized,
            autoPauseDisabled: autoPauseDisabled
        };
    }
    /**
     * 初始化组件：主题、结构、事件绑定与数据加载
     * @returns {Promise<void>} 异步初始化完成
     * @throws {Error} 当数据加载失败或DOM不可用时抛出异常
     */
    async init() {
        if (this.config.embed) {
            this.element.setAttribute('data-embed', 'true');
        }
        this.element.setAttribute('data-position', this.config.position);
        
        if (this.config.embed) {
            this.element.classList.add('netease-mini-player-embed');
        }
        
        this.initTheme();
        this.createPlayerHTML();
        this.applyResponsiveControls?.();
        this.setupEnvListeners?.();
        this.bindEvents();
        this.setupAudioEvents();
        try {
            if (this.config.embed) {
                if (this.config.songId) {
                    await this.loadSingleSong(this.config.songId);
                } else if (this.config.playlistId) {
                    await this.loadPlaylist(this.config.playlistId);
                    this.playlist = [this.playlist[0]];
                }
            } else {
                if (this.config.playlistId) {
                    await this.loadPlaylist(this.config.playlistId);
                } else if (this.config.songId) {
                    await this.loadSingleSong(this.config.songId);
                }
            }
            if (this.playlist.length > 0) {
                await this.loadCurrentSong();
                if (this.config.autoplay && !this.config.embed) {
                    // 静音自动播放策略（Silent Warm-up）
                    // 1. 先静音启动
                    this.audio.muted = true;
                    // 双重保险：音量先设为0
                    const originalVolume = this.volume;
                    this.audio.volume = 0;
                    
                    try {
                        await this.play();
                    } catch (e) {
                        console.log('静音自动播放被拦截，转为交互后播放');
                    }
                    
                    // 2. 监听所有可能的用户交互事件来恢复音量
                    const interactionEvents = ['click', 'touchstart', 'keydown', 'wheel', 'scroll'];
                    
                    const enableAudio = () => {
                        // 移除所有监听器
                        interactionEvents.forEach(event => {
                            document.removeEventListener(event, enableAudio);
                        });

                        // 恢复音量设置（淡入效果）
                        this.audio.muted = false;
                        
                        // 如果之前播放失败了（不在播放状态），则尝试再次播放
                        if (!this.isPlaying) {
                            this.play().then(() => {
                                // 播放成功后开始淡入
                                this.audio.volume = 0;
                                fadeIn();
                            }).catch(e => console.error('交互后播放失败:', e));
                        } else {
                            // 已经在静音播放中，直接淡入
                            this.audio.volume = 0;
                            fadeIn();
                        }

                        // 淡入动画函数
                        const fadeIn = () => {
                            let currentVol = 0;
                            const targetVol = originalVolume;
                            const step = targetVol / 10; // 分10步完成
                            const interval = 50; // 每50ms一步，共500ms

                            const fadeTimer = setInterval(() => {
                                currentVol += step;
                                if (currentVol >= targetVol) {
                                    currentVol = targetVol;
                                    clearInterval(fadeTimer);
                                }
                                this.audio.volume = currentVol;
                                this.volume = currentVol; // 同步内部状态
                            }, interval);
                        };
                    };
                    
                    if (this.isPlaying) {
                        // 如果静音播放成功，只需要等待交互恢复音量
                        interactionEvents.forEach(event => {
                            document.addEventListener(event, enableAudio, { once: true, passive: true });
                        });
                    } else {
                        // 如果静音播放也失败了，说明策略严格，必须等待交互才能开始播放
                        this.audio.muted = false; // 恢复状态，等待交互
                        this.audio.volume = originalVolume;
                        interactionEvents.forEach(event => {
                            document.addEventListener(event, enableAudio, { once: true, passive: true });
                        });
                    }
                }
            }
            if (this.config.defaultMinimized && !this.config.embed && this.config.position !== 'static') {
                this.toggleMinimize();
            }
        } catch (error) {
            console.error('播放器初始化失败:', error);
            this.showError('加载失败，请稍后重试');
        }
    }
    /**
     * 创建播放器DOM结构并抓取关键引用
     * @returns {void}
     */
    createPlayerHTML() {
        this.element.innerHTML = `
            <div class="player-main">
                <div class="album-cover-container">
                    <img class="album-cover" src="" alt="专辑封面">
                    <div class="vinyl-overlay">
                        <div class="vinyl-center"></div>
                    </div>
                </div>
                <div class="song-content">
                    <div class="song-info">
                        <div class="song-title">加载中...</div>
                        <div class="song-artist">请稍候</div>
                    </div>
                    <div class="lyrics-container">
                        <div class="lyric-line original">♪ 加载歌词中... ♪</div>
                        <div class="lyric-line translation"></div>
                    </div>
                </div>
                <div class="controls">
                    ${!this.config.embed ? `<button class="control-btn prev-btn" title="上一首">${ICONS.prev}</button>` : ''}
                    <button class="control-btn play-btn" title="播放/暂停">
                        <span class="play-icon">${ICONS.play}</span>
                        <span class="pause-icon" style="display: none;">${ICONS.pause}</span>
                    </button>
                    ${!this.config.embed ? `<button class="control-btn next-btn" title="下一首">${ICONS.next}</button>` : ''}
                </div>
            </div>
            <div class="player-bottom">
                <div class="progress-container">
                    <span class="time-display current-time">0:00</span>
                    <div class="progress-bar-container">
                        <div class="progress-bar"></div>
                    </div>
                    <span class="time-display total-time">0:00</span>
                </div>
                <div class="bottom-controls">
                    <div class="volume-container">
                        <span class="volume-icon">${ICONS.volume}</span>
                        <div class="volume-slider-container">
                            <div class="volume-slider">
                                <div class="volume-bar"></div>
                            </div>
                        </div>
                    </div>
                    <span class="feature-btn lyrics-btn" role="button" title="显示/隐藏歌词">${ICONS.lyrics}</span>
                    ${!this.config.embed ? `<span class="feature-btn loop-mode-btn" role="button" title="列表循环">${ICONS.loopList}</span>` : ''}
                    ${!this.config.embed ? `<span class="feature-btn list-btn" role="button" title="播放列表">${ICONS.list}</span>` : ''}
                    ${!this.config.embed ? `<span class="feature-btn minimize-btn" role="button" title="缩小/展开">${ICONS.minimize}</span>` : ''}
                </div>
            </div>
            <div class="playlist-container">
                <div class="playlist-content"></div>
            </div>
        `;
        this.elements = {
            albumCover: this.element.querySelector('.album-cover'),
            albumCoverContainer: this.element.querySelector('.album-cover-container'),
            songTitle: this.element.querySelector('.song-title'),
            songArtist: this.element.querySelector('.song-artist'),
            lyricsContainer: this.element.querySelector('.lyrics-container'),
            lyricLine: this.element.querySelector('.lyric-line.original'),
            lyricTranslation: this.element.querySelector('.lyric-line.translation'),
            playBtn: this.element.querySelector('.play-btn'),
            playIcon: this.element.querySelector('.play-icon'),
            pauseIcon: this.element.querySelector('.pause-icon'),
            prevBtn: this.element.querySelector('.prev-btn'),
            nextBtn: this.element.querySelector('.next-btn'),
            progressContainer: this.element.querySelector('.progress-bar-container'),
            progressBar: this.element.querySelector('.progress-bar'),
            currentTime: this.element.querySelector('.current-time'),
            totalTime: this.element.querySelector('.total-time'),
            volumeContainer: this.element.querySelector('.volume-container'),
            volumeSlider: this.element.querySelector('.volume-slider'),
            volumeBar: this.element.querySelector('.volume-bar'),
            volumeIcon: this.element.querySelector('.volume-icon'),
            lyricsBtn: this.element.querySelector('.lyrics-btn'),
            listBtn: this.element.querySelector('.list-btn'),
            minimizeBtn: this.element.querySelector('.minimize-btn'),
            playlistContainer: this.element.querySelector('.playlist-container'),
            playlistContent: this.element.querySelector('.playlist-content')
        };
        this.isMinimized = false;
        this.elements.loopModeBtn = this.element.querySelector('.loop-mode-btn');
    }
    /**
     * 绑定交互事件（播放、进度、音量、列表、最小化等）
     * @returns {void}
     */
    bindEvents() {
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', () => this.previousSong());
        }
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', () => this.nextSong());
        }
        if (this.elements.loopModeBtn) {
            this.elements.loopModeBtn.addEventListener('click', () => this.togglePlayMode());
        }
        this.elements.albumCoverContainer.addEventListener('click', () => {
            if (this.element.classList.contains('minimized')) {
                this.elements.albumCoverContainer.classList.toggle('expanded');
                return;
            }
            if (this.currentSong && this.currentSong.id) {
            const songUrl = `https://music.163.com/song?id=${this.currentSong.id}`;
            window.open(songUrl, '_blank', 'noopener,noreferrer');
            }
        });
        let isDragging = false;
        this.elements.progressContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.seekTo(e);
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.seekTo(e);
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        this.elements.progressContainer.addEventListener('click', (e) => this.seekTo(e));
        let isVolumesDragging = false;
        this.elements.volumeSlider.addEventListener('mousedown', (e) => {
            isVolumesDragging = true;
            this.setVolume(e);
        });
        document.addEventListener('mousemove', (e) => {
            if (isVolumesDragging) {
                this.setVolume(e);
            }
        });
        document.addEventListener('mouseup', () => {
            isVolumesDragging = false;
        });
        this.elements.volumeSlider.addEventListener('click', (e) => this.setVolume(e));
        this.elements.lyricsBtn.addEventListener('click', () => this.toggleLyrics());
        if (this.elements.listBtn) {
            this.elements.listBtn.addEventListener('click', () => this.togglePlaylist());
        }
        if (this.elements.minimizeBtn) {
            this.elements.minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        }
        document.addEventListener('click', (e) => {
            if (this.elements.playlistContainer && 
                this.elements.playlistContainer.classList.contains('show')) {
                if (!this.element.contains(e.target)) {
                    this.togglePlaylist(false);
                }
            }
        });
        if (this.config.position !== 'static' && !this.config.embed) {
            this.setupDragAndDrop();
        }
        if (typeof document.hidden !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && this.isPlaying) {
                    this.wasPlayingBeforeHidden = true;
                    this.pause();
                } else if (!document.hidden && this.wasPlayingBeforeHidden) {
                    this.play();
                    this.wasPlayingBeforeHidden = false;
                }
            });
        }

        this.element.addEventListener('mouseenter', () => {
            this.restoreOpacity();
        });
        this.element.addEventListener('mouseleave', () => {
            this.startIdleTimer();
        });
        this.applyIdlePolicyOnInit();
    }

    /**
     * 启动空闲淡出计时器，在最小化时降低存在感
     * @returns {void}
     * @description
     * 1. 首先清除现有的空闲计时器
     * 2. 检查是否启用空闲透明度功能
     * 3. 设置新的计时器，延迟后触发淡出效果
     * 4. 计时器时间由idleDelay配置决定
     * 5. 计时器触发时调用triggerFadeOut开始淡出动画
     * @example
     * player.startIdleTimer(); // 启动空闲计时器
     * @private
     */
    startIdleTimer() {
        this.clearIdleTimer();
        if (!this.shouldEnableIdleOpacity()) return;
        this.idleTimeout = setTimeout(() => {
            this.triggerFadeOut();
        }, this.idleDelay);
    }

    /**
     * 清除空闲淡出计时器
     * @returns {void}
     * @description
     * 1. 检查是否存在空闲计时器实例
     * 2. 使用clearTimeout清除计时器
     * 3. 将计时器引用设为null，避免内存泄漏
     * 4. 通常在用户交互或播放器状态改变时调用
     * @example
     * player.clearIdleTimer(); // 清除正在运行的空闲计时器
     * @private
     */
    clearIdleTimer() {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
    }

    /**
     * 触发淡出动画并根据定位进行侧边停靠
     * @returns {void}
     * @description
     * 1. 检查是否启用空闲透明度功能
     * 2. 检查是否已经在空闲状态，避免重复触发
     * 3. 移除淡入动画类名
     * 4. 获取当前停靠侧边（左/右）
     * 5. 添加对应的停靠类名和淡出动画类名
     * 6. 监听动画结束事件，完成后切换到空闲状态
     * @example
     * player.triggerFadeOut(); // 开始淡出到侧边停靠状态
     * @private
     */
    triggerFadeOut() {
        if (!this.shouldEnableIdleOpacity()) return;
        if (this.isIdle) return;
        this.isIdle = true;
        this.element.classList.remove('fading-in');
        const side = this.getDockSide();
        if (side) {
            this.element.classList.add(`docked-${side}`);
        }
        this.element.classList.add('fading-out');
        const onEnd = (e) => {
            if (e.animationName !== 'player-fade-out') return;
            this.element.classList.remove('fading-out');
            this.element.classList.add('idle');
            this.element.removeEventListener('animationend', onEnd);
        };
        this.element.addEventListener('animationend', onEnd);
    }

    /**
     * 恢复不透明度，移除停靠并播放弹出动画
     * @returns {void}
     * @description
     * 1. 首先清除空闲计时器
     * 2. 获取当前停靠侧边和停靠状态
     * 3. 如果处于停靠状态，播放弹出动画
     * 4. 监听弹出动画结束，移除停靠类名
     * 5. 播放淡入动画，恢复到正常显示状态
     * 6. 监听淡入动画结束，清理动画类名
     * @example
     * player.restoreOpacity(); // 从停靠状态恢复到正常显示
     * @private
     */
    restoreOpacity() {
        this.clearIdleTimer();
        const side = this.getDockSide();
        const hasDock = side ? this.element.classList.contains(`docked-${side}`) : false;
        if (hasDock) {
            const popAnim = side === 'right' ? 'player-popout-right' : 'player-popout-left';
            this.element.classList.add(`popping-${side}`);
            const onPopEnd = (e) => {
                if (e.animationName !== popAnim) return;
                this.element.removeEventListener('animationend', onPopEnd);
                this.element.classList.remove(`popping-${side}`);
                this.element.classList.remove(`docked-${side}`);
                if (this.isIdle) {
                    this.isIdle = false;
                }
                this.element.classList.remove('idle', 'fading-out');
                this.element.classList.add('fading-in');
                const onEndIn = (ev) => {
                    if (ev.animationName !== 'player-fade-in') return;
                    this.element.classList.remove('fading-in');
                    this.element.removeEventListener('animationend', onEndIn);
                };
                this.element.addEventListener('animationend', onEndIn);
            };
            this.element.addEventListener('animationend', onPopEnd);
            return;
        }
        if (!this.isIdle) return;
        this.isIdle = false;
        this.element.classList.remove('idle', 'fading-out');
        this.element.classList.add('fading-in');
        const onEndIn = (ev) => {
            if (ev.animationName !== 'player-fade-in') return;
            this.element.classList.remove('fading-in');
            this.element.removeEventListener('animationend', onEndIn);
        };
        this.element.addEventListener('animationend', onEndIn);
    }

    /**
     * 判断是否启用空闲透明度功能
     * @returns {boolean} 启用返回true
     * @description
     * 1. 检查播放器是否处于最小化状态
     * 2. 仅当最小化时才启用空闲透明度
     * 3. 用于控制空闲时的淡出效果
     * @example
     * player.isMinimized = true;
     * player.shouldEnableIdleOpacity(); // true
     * 
     * player.isMinimized = false;
     * player.shouldEnableIdleOpacity(); // false
     * @private
     */
    shouldEnableIdleOpacity() {
        return this.isMinimized === true;
    }

    /**
     * 初始化时应用空闲策略设置
     * @returns {void}
     * @description
     * 1. 检查是否启用空闲透明度功能
     * 2. 如果未启用，清除空闲计时器
     * 3. 重置空闲状态标识
     * 4. 移除所有相关的CSS类名（停靠、动画等）
     * 5. 确保播放器以正常状态显示
     * @example
     * player.applyIdlePolicyOnInit(); // 根据配置应用空闲策略
     * @private
     */
    applyIdlePolicyOnInit() {
        if (!this.shouldEnableIdleOpacity()) {
            this.clearIdleTimer();
            this.isIdle = false;
            this.element.classList.remove('idle', 'fading-in', 'fading-out', 'docked-left', 'docked-right', 'popping-left', 'popping-right');
        }
    }
    /**
     * 计算当前停靠方向
     * @returns {'left'|'right'} 返回停靠侧边枚举
     * @description
     * 1. 根据配置中的position值判断停靠方向
     * 2. 左上角和左下角返回'left'
     * 3. 右上角和右下角返回'right'
     * 4. 其他位置默认返回'right'
     * @example
     * player.config.position = 'top-left';
     * player.getDockSide(); // 'left'
     * 
     * player.config.position = 'bottom-right';
     * player.getDockSide(); // 'right'
     * @private
     */
    getDockSide() {
        const pos = this.config.position;
        if (pos === 'top-left' || pos === 'bottom-left') return 'left';
        if (pos === 'top-right' || pos === 'bottom-right') return 'right';
        return 'right';
    }
    /**
     * 获取运行环境信息（UA & 媒体特征）
     * @returns {UAInfo} 环境信息结构
     * @description
     * 1. 检查是否存在缓存的环境信息，有则直接返回
     * 2. 解析用户代理字符串获取平台和设备信息
     * 3. 检测触摸支持、媒体播放能力等特性
     * 4. 缓存结果以提高后续访问性能
     * @example
     * const uaInfo = NeteaseMiniPlayer.getUAInfo();
     * console.log(uaInfo.platform); // 'mobile' | 'tablet' | 'desktop'
     * console.log(uaInfo.canPlayType); // 是否支持音频播放
     * @private
     */
    static getUAInfo() {
        if (NeteaseMiniPlayer._uaCache) return NeteaseMiniPlayer._uaCache;
        const nav = typeof navigator !== 'undefined' ? navigator : {};
        const uaRaw = (nav.userAgent || '');
        const ua = uaRaw.toLowerCase();
        const platform = (nav.platform || '').toLowerCase();
        const maxTP = nav.maxTouchPoints || 0;
        const isWeChat = /micromessenger/.test(ua);
        const isQQ = /(mqqbrowser| qq)/.test(ua);
        const isInAppWebView = /\bwv\b|; wv/.test(ua) || /version\/\d+.*chrome/.test(ua);
        const isiPhone = /iphone/.test(ua);
        const isiPadUA = /ipad/.test(ua);
        const isIOSLikePad = !isiPadUA && platform.includes('mac') && maxTP > 1;
        const isiOS = isiPhone || isiPadUA || isIOSLikePad;
        const isAndroid = /android/.test(ua);
        const isHarmonyOS = /harmonyos/.test(uaRaw) || /huawei|honor/.test(ua);
        const isMobileToken = /mobile/.test(ua) || /sm-|mi |redmi|huawei|honor|oppo|vivo|oneplus/.test(ua);
        const isHarmonyDesktop = isHarmonyOS && !isMobileToken && !isAndroid && !isiOS;
        const isPWA = (typeof window !== 'undefined' && (
            (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
            (nav.standalone === true)
        )) || false;
        const isMobile = (isiOS || isAndroid || (isHarmonyOS && !isHarmonyDesktop) || isMobileToken || isInAppWebView);
        const info = { isMobile, isiOS, isAndroid, isHarmonyOS, isHarmonyDesktop, isWeChat, isQQ, isInAppWebView, isPWA, isiPad: isiPadUA || isIOSLikePad };
        NeteaseMiniPlayer._uaCache = info;
        return info;
    }
    /**
     * 根据环境信息调整控件呈现（移动端隐藏音量等）
     * @returns {void}
     */
    applyResponsiveControls() {
        const env = NeteaseMiniPlayer.getUAInfo();
        const shouldHideVolume = !!env.isMobile;
        this.element.classList.toggle('mobile-env', shouldHideVolume);
        if (this.elements && this.elements.volumeContainer == null) {
            this.elements.volumeContainer = this.element.querySelector('.volume-container');
        }
        if (this.elements.volumeContainer) {
            if (shouldHideVolume) {
                this.elements.volumeContainer.classList.add('sr-visually-hidden');
                this.elements.volumeContainer.setAttribute('aria-hidden', 'false');
                this.elements.volumeSlider?.setAttribute('aria-label', '音量控制（移动端隐藏，仅无障碍可见）');
            } else {
                this.elements.volumeContainer.classList.remove('sr-visually-hidden');
                this.elements.volumeContainer.removeAttribute('aria-hidden');
                this.elements.volumeSlider?.removeAttribute('aria-label');
            }
        }
    }
    /**
     * 监听环境变化（方向、尺寸）并动态应用响应式策略
     * @returns {void}
     */
    setupEnvListeners() {
        const reapply = () => this.applyResponsiveControls();
        if (window.matchMedia) {
            try {
                const mq1 = window.matchMedia('(orientation: portrait)');
                const mq2 = window.matchMedia('(orientation: landscape)');
                mq1.addEventListener?.('change', reapply);
                mq2.addEventListener?.('change', reapply);
            } catch (e) {
                mq1.onchange = reapply;
                mq2.onchange = reapply;
            }
        } else {
            window.addEventListener('orientationchange', reapply);
        }
        window.addEventListener('resize', reapply);
    }
    /**
     * 绑定音频事件以同步UI、进度和歌词
     * @returns {void}
     */
    setupAudioEvents() {
        this.audio.addEventListener('loadedmetadata', () => {
            this.duration = this.audio.duration;
            this.updateTimeDisplay();
        });
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
            this.updateProgress();
            this.updateLyrics();
            this.updateTimeDisplay();
        });
        this.audio.addEventListener('ended', async () => {
            await this.nextSong();
        });
        this.audio.addEventListener('error', async (e) => {
            console.error('音频播放错误:', e);
            console.error('错误详情:', {
                code: e.target.error?.code,
                message: e.target.error?.message,
                src: e.target.src
            });
            this.showError('播放失败，尝试下一首');
            setTimeout(async () => {
                await this.nextSong();
            }, 1000);
        });
        this.audio.addEventListener('abort', () => {
            console.warn('音频加载被中断');
        });
        this.audio.addEventListener('stalled', () => {
            console.warn('音频加载停滞');
        });
        this.audio.addEventListener('canplay', () => {
            if (this.isPlaying && this.audio.paused) {
                this.audio.play().catch(e => console.error('自动播放失败:', e));
            }
        });
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
    }
    /**
     * 调用后端API（NetEase Cloud Music代理）
     * @param {string} endpoint - 接口路径，如`/playlist/track/all`
     * @param {Record<string, string|number|boolean>} [params] - 查询参数对象
     * @returns {Promise<any>} 返回解析后的JSON数据
     * @throws {Error} 当网络或接口返回错误码时抛出
     */
    async apiRequest(endpoint, params = {}) {
        const baseUrl = 'https://api.hypcvgm.top/NeteaseMiniPlayer/nmp.php';
        const queryString = new URLSearchParams(params).toString();
        const url = `${baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.code !== 200) {
                throw new Error(`API错误: ${data.code}`);
            }
            return data;
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
        }
    }
    /**
     * 生成缓存键，用于缓存系统
     * @param {string} type - 资源类型，如`playlist_all`、`song`
     * @param {string | number} id - 业务ID
     * @returns {string} 拼接后的缓存键
     * @description
     * 简单的字符串拼接，格式为`{type}_{id}`
     * 用于区分不同类型的缓存数据
     * @example
     * player.getCacheKey('playlist_all', '123456'); // 'playlist_all_123456'
     * player.getCacheKey('song', 789); // 'song_789'
     */
    getCacheKey(type, id) {
        return `${type}_${id}`;
    }
    /**
     * 设置缓存并附带过期时间
     * @param {string} key - 缓存键
     * @param {any} data - 缓存数据
     * @param {number} [expiry=300000] - 过期毫秒数
     * @returns {void}
     */
    setCache(key, data, expiry = 5 * 60 * 1000) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + expiry
        });
    }
    /**
     * 读取缓存，过期则删除
     * @param {string} key - 缓存键
     * @returns {any | null} 命中返回数据，未命中或过期返回`null`
     */
    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }
    /**
     * 加载播放列表并更新展示
     * @param {string | number} playlistId - 播放列表ID
     * @returns {Promise<void>}
     * @throws {Error} 当API请求失败或返回无效数据时抛出
     * @example
     * await player.loadPlaylist('123456789');
     */
    async loadPlaylist(playlistId) {
        const cacheKey = this.getCacheKey('playlist_all', playlistId);
        let tracks = this.getCache(cacheKey);
        if (!tracks) {
            const response = await this.apiRequest('/playlist/track/all', {
                id: playlistId,
                limit: 1000, 
                offset: 0
            });
            tracks = response.songs; 
            this.setCache(cacheKey, tracks);
        }
        this.playlist = tracks.map(song => ({
            id: song.id,
            name: song.name,
            artists: song.ar.map(ar => ar.name).join(', '),
            album: song.al.name,
            picUrl: song.al.picUrl,
            duration: song.dt
        }));
        this.updatePlaylistDisplay();
    }
    /**
     * 加载单曲信息并设置为播放源
     * @param {string | number} songId - 歌曲ID
     * @returns {Promise<void>}
     * @throws {Error} 当API请求失败时抛出
     * @example
     * await player.loadSingleSong('123456789');
     */
    async loadSingleSong(songId) {
        const cacheKey = this.getCacheKey('song', songId);
        let songData = this.getCache(cacheKey);
        if (!songData) {
            try {
                const response = await this.apiRequest('/song/detail', { ids: songId });
                if (response.songs && response.songs.length > 0) {
                    const song = response.songs[0];
                    songData = {
                        id: song.id,
                        name: song.name,
                        artists: song.ar.map(ar => ar.name).join(', '),
                        album: song.al.name,
                        picUrl: song.al.picUrl,
                        duration: song.dt
                    };
                    this.setCache(cacheKey, songData);
                } else {
                    throw new Error('歌曲信息获取失败');
                }
            } catch (error) {
                console.error('获取歌曲详情失败:', error);
                songData = {
                    id: songId,
                    name: '歌曲加载失败',
                    artists: '未知艺术家',
                    album: '未知专辑',
                    picUrl: '',
                    duration: 0
                };
            }
        }
        this.playlist = [songData];
    }
    /**
     * 根据当前索引加载歌曲、音频URL与歌词
     * @returns {Promise<void>}
     * @throws {Error} 当音频URL加载失败时抛出
     * @description
     * 1. 重置歌词状态
     * 2. 更新歌曲信息与封面
     * 3. 加载音频URL
     * 4. 加载歌词（如果启用）
     */
    async loadCurrentSong() {
        if (this.playlist.length === 0) return;
        
        if (this.showLyrics) {
            this.elements.lyricLine.textContent = '♪ 加载歌词中... ♪';
            this.elements.lyricTranslation.style.display = 'none';
            this.elements.lyricLine.classList.remove('current', 'scrolling');
            this.elements.lyricTranslation.classList.remove('current', 'scrolling');
            this.lyrics = [];
            this.currentLyricIndex = -1;
        }
        
        const song = this.playlist[this.currentIndex];
        this.currentSong = song;
        this.updateSongInfo(song);
        if (song.picUrl) {
            this.elements.albumCover.src = song.picUrl;
        }
        await this.loadSongUrl(song.id);
        if (this.showLyrics) {
            await this.loadLyrics(song.id);
        }
    }
    /**
     * 更新标题与艺术家信息
     * @param {SongInfo} song - 歌曲信息
     * @returns {void}
     * @description
     * 1. 更新歌曲标题
     * 2. 截断艺术家名称（如果过长）
     * 3. 设置title属性显示完整艺术家信息
     */
    updateSongInfo(song) {
        if (!song) return;
        this.elements.songTitle.textContent = song.name || '未知歌曲';
        if (song.artists) {
            const truncatedArtist = this.truncateArtistName(song.artists);
            this.elements.songArtist.textContent = truncatedArtist;
            if (truncatedArtist !== song.artists) {
                this.elements.songArtist.setAttribute('title', song.artists);
            } else {
                this.elements.songArtist.removeAttribute('title');
            }
        }
    }
    /**
     * 超出宽度时截断艺术家文本并增加省略号
     * @param {string} artistText - 原始艺术家字符串
     * @returns {string} 适配展示的简化文本
     * @description
     * 使用临时元素计算文本宽度，按可用宽度（200px）截断
     * 优先按"/"分隔的艺术家进行截断，保持可读性
     */
    truncateArtistName(artistText) {
        if (!artistText) return '';
        const tempElement = document.createElement('span');
        tempElement.style.visibility = 'hidden';
        tempElement.style.position = 'absolute';
        tempElement.style.fontSize = '12px';
        tempElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        tempElement.textContent = artistText;
        document.body.appendChild(tempElement);
        const fullWidth = tempElement.offsetWidth;
        const availableWidth = 200;
        if (fullWidth <= availableWidth) {
            document.body.removeChild(tempElement);
            return artistText;
        }
        const artists = artistText.split(' / ');
        let result = '';
        let currentWidth = 0;
        for (let i = 0; i < artists.length; i++) {
            const testText = result ? `${result} / ${artists[i]}` : artists[i];
            tempElement.textContent = testText + '...';
            const testWidth = tempElement.offsetWidth;
            if (testWidth > availableWidth) {
                if (result) {
                    break;
                } else {
                    const artist = artists[i];
                    for (let j = 1; j < artist.length; j++) {
                        const partialArtist = artist.substring(0, j);
                        tempElement.textContent = partialArtist + '...';
                        if (tempElement.offsetWidth > availableWidth) {
                            result = artist.substring(0, Math.max(1, j - 1));
                            break;
                        }
                        result = partialArtist;
                    }
                    break;
                }
            }
            result = testText;
        }
        document.body.removeChild(tempElement);
        return result + (result !== artistText ? '...' : '');
    }
    /**
     * 加载音频播放URL，含`https`校正与降级回退
     * @param {string | number} songId - 歌曲ID
     * @returns {Promise<void>}
     * @throws {Error} 当无法获取有效播放地址时抛出
     */
    async loadSongUrl(songId) {
        const cacheKey = this.getCacheKey('song_url', songId);
        let urlData = this.getCache(cacheKey);
        if (!urlData) {
            try {
                const response = await this.apiRequest('/song/url/v1', { 
                    id: songId, 
                    level: 'exhigh' 
                });
                if (response.data && response.data.length > 0) {
                    urlData = response.data[0];
                    this.setCache(cacheKey, urlData, 30 * 60 * 1000);
                }
            } catch (error) {
                console.error('获取音频URL失败:', error);
                try {
                    const fallbackResponse = await this.apiRequest('/song/url/v1', { 
                        id: songId, 
                        level: 'standard' 
                    });
                    if (fallbackResponse.data && fallbackResponse.data.length > 0) {
                        urlData = fallbackResponse.data[0];
                    }
                } catch (fallbackError) {
                    console.error('降级获取音频URL也失败:', fallbackError);
                }
            }
        }
        if (urlData && urlData.url) {
            const httpsUrl = this.ensureHttps(urlData.url);
            console.log('设置音频源:', httpsUrl);
            this.audio.src = httpsUrl;
        } else {
            throw new Error('无法获取播放地址');
        }
    }
    /**
     * 将`http`链接尽可能转换为`https`
     * @param {string} url - 原始链接
     * @returns {string} 规范化后的链接
     * @description
     * 1. 126.net域名强制转换为https
     * 2. 其他http链接尝试转换为https
     * 3. 已经是https或特殊协议的链接保持不变
     */
    ensureHttps(url) {
        if (!url) return url;
        if (url.includes('music.126.net')) {
            return url.replace(/^http:\/\//, 'https://');
        }
        if (url.startsWith('http://')) {
            return url.replace('http://', 'https://');
        }
        return url;
    }
    /**
     * 加载歌词并缓存
     * @param {string | number} songId - 歌曲ID
     * @returns {Promise<void>}
     */
    async loadLyrics(songId) {
        const cacheKey = this.getCacheKey('lyric', songId);
        let lyricData = this.getCache(cacheKey);
        if (!lyricData) {
            try {
                const response = await this.apiRequest('/lyric', { id: songId });
                lyricData = response;
                this.setCache(cacheKey, lyricData, 60 * 60 * 1000);
            } catch (error) {
                console.error('获取歌词失败:', error);
                this.lyrics = [];
                return;
            }
        }
        this.parseLyrics(lyricData);
    }
    /**
     * 解析歌词文本为时间线结构
     * @param {Object} lyricData - 原始歌词数据（含`lrc`与`tlyric`）
     * @param {Object} lyricData.lrc - 标准歌词对象
     * @param {string} lyricData.lrc.lyric - 标准歌词文本
     * @param {Object} [lyricData.tlyric] - 翻译歌词对象（可选）
     * @param {string} [lyricData.tlyric.lyric] - 翻译歌词文本（可选）
     * @returns {void}
     * @description
     * 1. 解析标准LRC格式的时间戳
     * 2. 匹配翻译歌词（如果有）
     * 3. 按时间排序并存储到this.lyrics
     * 4. 处理特殊情况（无歌词、纯音乐等）
     * @example
     * player.parseLyrics({
     *   lrc: { lyric: '[00:01.00]歌词1\n[00:05.00]歌词2' },
     *   tlyric: { lyric: '[00:01.00]Translation1\n[00:05.00]Translation2' }
     * });
     */
    parseLyrics(lyricData) {
        this.lyrics = [];
        this.currentLyricIndex = -1;
        
        if (!lyricData || (!lyricData.lrc?.lyric && !lyricData.tlyric?.lyric)) {
            this.elements.lyricLine.textContent = '暂无歌词';
            this.elements.lyricTranslation.style.display = 'none';
            this.elements.lyricLine.classList.remove('current', 'scrolling');
            this.elements.lyricTranslation.classList.remove('current', 'scrolling');
            return;
        }
        const lrcLines = lyricData.lrc.lyric.split('\n');
        const tlyricLines = lyricData.tlyric && lyricData.tlyric.lyric ? 
            lyricData.tlyric.lyric.split('\n') : [];
        const lrcMap = new Map();
        lrcLines.forEach(line => {
            const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const milliseconds = parseInt(match[3].padEnd(3, '0'));
                const time = minutes * 60 + seconds + milliseconds / 1000;
                const text = match[4].trim();
                if (text) {
                    lrcMap.set(time, text);
                }
            }
        });
        const tlyricMap = new Map();
        tlyricLines.forEach(line => {
            const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const milliseconds = parseInt(match[3].padEnd(3, '0'));
                const time = minutes * 60 + seconds + milliseconds / 1000;
                const text = match[4].trim();
                if (text) {
                    tlyricMap.set(time, text);
                }
            }
        });
        const allTimes = Array.from(new Set([...lrcMap.keys(), ...tlyricMap.keys()])).sort((a, b) => a - b);
        this.lyrics = allTimes.map(time => ({
            time,
            text: lrcMap.get(time) || '',
            translation: tlyricMap.get(time) || ''
        }));
        this.currentLyricIndex = -1;
        this.updateLyrics();
    }
    /**
     * 播放/暂停切换
     * @returns {Promise<void>}
     * @description
     * 1. 根据当前播放状态决定执行播放还是暂停
     * 2. 自动处理全局音频管理（避免多实例同时播放）
     * 3. 更新UI状态和相关CSS类名
     * 4. 处理播放失败情况并显示错误信息
     * @example
     * // 绑定到播放按钮点击事件
     * playBtn.addEventListener('click', () => player.togglePlay());
     */
    async togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }
    /**
     * 开始播放并更新UI状态
     * @returns {Promise<void>}
     * @description
     * 1. 设置当前播放器为全局活跃实例
     * 2. 尝试播放音频并处理自动播放限制
     * 3. 更新播放状态和UI元素
     * 4. 添加播放相关的CSS类名用于动画效果
     * @throws {Error} 当音频播放失败时（如自动播放策略限制）
     * @example
     * try {
     *   await player.play();
     *   console.log('播放开始');
     * } catch (error) {
     *   console.error('播放失败:', error);
     * }
     */
    async play() {
        GlobalAudioManager.setCurrent(this);
        try {
            await this.audio.play();
            this.isPlaying = true;
            this.elements.playIcon.style.display = 'none';
            this.elements.pauseIcon.style.display = 'inline';
            this.elements.albumCover.classList.add('playing');
            this.element.classList.add('player-playing');
        } catch (error) {
            // 如果是自动播放受阻，不显示错误提示，交给外部处理（如静音自动播放策略）
            if (error.name === 'NotAllowedError') {
                console.warn('自动播放被拦截 (NotAllowedError)');
                this.isPlaying = false;
                throw error;
            }
            console.error('播放失败:', error);
            this.showError('播放失败');
        }
    }
    /**
     * 暂停播放并更新UI状态
     * @returns {void}
     * @description
     * 1. 暂停音频播放
     * 2. 更新播放状态标记
     * 3. 切换播放/暂停按钮图标
     * 4. 移除播放相关的CSS类名
     * @example
     * player.pause(); // 暂停当前播放
     * console.log(player.isPlaying); // false
     */
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.elements.playIcon.style.display = 'inline';
        this.elements.pauseIcon.style.display = 'none';
        this.elements.albumCover.classList.remove('playing');
        this.element.classList.remove('player-playing');
    }
    /**
     * 切换到上一首（列表循环）
     * @returns {Promise<void>}
     * @description
     * 1. 如果播放列表只有一首歌，重置当前播放位置
     * 2. 否则移动到上一首（循环到末尾如果是第一首）
     * 3. 加载新歌曲并保持播放状态
     * 4. 更新播放列表显示
     * @throws {Error} 当音频加载失败时可能抛出
     * @example
     * await player.previousSong(); // 切换到上一首
     */
    async previousSong() {
        if (this.playlist.length <= 1) return;
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
        await this.loadCurrentSong();
        if (this.isPlaying) {
            await this.play();
        }
    }
    /**
     * 切换到下一首，根据`playMode`支持列表/单曲/随机
     * @returns {Promise<void>}
     * @description
     * 1. 单曲循环模式：重置当前歌曲播放位置
     * 2. 随机播放模式：从可用歌曲中随机选择（避免最近播放）
     * 3. 列表循环模式：移动到下一首（循环到开头如果是最后一首）
     * 4. 加载新歌曲并保持播放状态
     * @throws {Error} 当音频加载失败时可能抛出
     * @example
     * await player.nextSong(); // 根据当前播放模式切换到下一首
     * 
     * // 不同模式的行为：
     * // list模式: 1 -> 2 -> 3 -> 1 (循环)
     * // single模式: 1 -> 1 -> 1 (重复当前)
     * // shuffle模式: 随机选择，避免连续重复
     */
    async nextSong() {
    const wasPlaying = this.isPlaying;
        if (this.playlist.length <= 1) {
            if (this.playMode === 'single') {
                this.audio.currentTime = 0;
                if (wasPlaying) await this.play();
                return;
            }
            this.audio.currentTime = 0;
            if (wasPlaying) await this.play();
            return;
        }
    
        let newIndex;
        if (this.playMode === 'shuffle') {
            const availableIndices = this.playlist
                .map((_, i) => i)
                .filter(i => i !== this.currentIndex);
            
            if (availableIndices.length === 0) {
                newIndex = this.currentIndex;
            } else {
                newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            }
            this.shuffleHistory.push(this.currentIndex);
            if (this.shuffleHistory.length > 2) {
                this.shuffleHistory.shift();
            }
        } else if (this.playMode === 'single') {
            newIndex = this.currentIndex;
        } else {
            newIndex = (this.currentIndex + 1) % this.playlist.length;
        }
    
        this.currentIndex = newIndex;
        await this.loadCurrentSong();
        
        this.updatePlaylistDisplay();
        
        if (wasPlaying) {
            setTimeout(async () => {
                try {
                    await this.play();
                } catch (error) {
                    console.error('自动播放下一首失败:', error);
                }
            }, 100);
        }
    }
    /**
     * 根据播放进度更新进度条宽度
     * @returns {void}
     */
    updateProgress() {
        if (this.duration > 0) {
            const progress = (this.currentTime / this.duration) * 100;
            this.elements.progressBar.style.width = `${progress}%`;
        }
    }
    /**
     * 更新当前播放时间和总时长显示
     * @returns {void}
     * @description
     * 1. 内部定义formatTime函数将秒数格式化为MM:SS格式
     * 2. 更新当前时间显示元素
     * 3. 更新总时长显示元素
     * 4. 通常在音频元数据加载和时间更新时调用
     * @example
     * player.updateTimeDisplay(); // 显示如 "2:35 / 4:12"
     */
    updateTimeDisplay() {
        /**
         * 内部时间格式化函数，将秒数转换为MM:SS格式
         * @param {number} time - 时间值（秒）
         * @returns {string} 格式化后的时间字符串
         * @description
         * 1. 计算分钟数：Math.floor(time / 60)
         * 2. 计算剩余秒数：Math.floor(time % 60)
         * 3. 秒数不足两位时前面补零
         * 4. 返回格式如 "2:35" 的时间字符串
         * @example
         * formatTime(155); // "2:35"
         * formatTime(65);  // "1:05"
         * @private
         */
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };
        this.elements.currentTime.textContent = formatTime(this.currentTime);
        this.elements.totalTime.textContent = formatTime(this.duration);
    }
    /**
     * 更新音量条显示
     * @returns {void}
     * @description
     * 1. 根据当前音量值更新音量条宽度
     * 2. 音量条宽度百分比 = 音量值 × 100%
     * 3. 通常在音量变化时调用以同步UI显示
     * @example
     * player.volume = 0.5;
     * player.updateVolumeDisplay(); // 音量条显示50%
     */
    updateVolumeDisplay() {
        this.elements.volumeBar.style.width = `${this.volume * 100}%`;
    }
    /**
     * 同步并平滑切换当前歌词行
     * @returns {void}
     * @description
     * 1. 根据当前播放时间查找匹配的歌词索引
     * 2. 更新歌词显示并添加动画效果
     * 3. 处理翻译歌词的显示/隐藏
     * 4. 检查长歌词是否需要滚动
     */
    updateLyrics() {
        if (this.lyrics.length === 0) return;
        let newIndex = -1;
        for (let i = 0; i < this.lyrics.length; i++) {
            if (this.currentTime >= this.lyrics[i].time) {
                newIndex = i;
            } else {
                break;
            }
        }
        if (newIndex !== this.currentLyricIndex) {
            this.currentLyricIndex = newIndex;
            if (newIndex >= 0 && newIndex < this.lyrics.length) {
                const lyric = this.lyrics[newIndex];
                const lyricText = lyric.text || '♪';
            
                this.elements.lyricLine.classList.remove('current');
            
                requestAnimationFrame(() => {
                    this.elements.lyricLine.textContent = lyricText;
                    this.checkLyricScrolling(this.elements.lyricLine, lyricText);
            
                    this.elements.lyricLine.classList.add('current');
            
                    if (lyric.translation) {
                        this.elements.lyricTranslation.textContent = lyric.translation;
                        this.elements.lyricTranslation.style.display = 'block';
                        this.elements.lyricTranslation.classList.remove('current'); 
                        requestAnimationFrame(() => {
                            this.elements.lyricTranslation.classList.add('current'); 
                        });
                    } else {
                        this.elements.lyricTranslation.style.display = 'none';
                        this.elements.lyricTranslation.classList.remove('current', 'scrolling');
                    }
                });
            
                this.elements.lyricsContainer.classList.add('switching');
                setTimeout(() => {
                    this.elements.lyricsContainer.classList.remove('switching');
                }, 500);
                if (lyric.translation) {
                    this.elements.lyricTranslation.textContent = lyric.translation;
                    this.elements.lyricTranslation.classList.add('current');
                    this.elements.lyricTranslation.style.display = 'block';
                    this.checkLyricScrolling(this.elements.lyricTranslation, lyric.translation);
                } else {
                    this.elements.lyricTranslation.style.display = 'none';
                    this.elements.lyricTranslation.classList.remove('current', 'scrolling');
                }
            } else {
                this.elements.lyricLine.textContent = '♪ 纯音乐，请欣赏 ♪';
                this.elements.lyricLine.classList.remove('current', 'scrolling');
                this.elements.lyricTranslation.style.display = 'none';
                this.elements.lyricTranslation.classList.remove('current', 'scrolling');
            }
        }
    }
    /**
     * 检查歌词是否超宽并启用滚动效果
     * @param {HTMLElement} element - 歌词承载元素
     * @param {string} text - 歌词文本
     * @returns {void}
     */
    checkLyricScrolling(element, text) {
        if (!element || !text) return;
        const tempElement = document.createElement('span');
        tempElement.style.visibility = 'hidden';
        tempElement.style.position = 'absolute';
        tempElement.style.fontSize = window.getComputedStyle(element).fontSize;
        tempElement.style.fontFamily = window.getComputedStyle(element).fontFamily;
        tempElement.style.fontWeight = window.getComputedStyle(element).fontWeight;
        tempElement.textContent = text;
        document.body.appendChild(tempElement);
        const textWidth = tempElement.offsetWidth;
        document.body.removeChild(tempElement);
        const containerWidth = element.parentElement.offsetWidth - 16;
        if (textWidth > containerWidth) {
            element.classList.add('scrolling');
        } else {
            element.classList.remove('scrolling');
        }
    }
    /**
     * 渲染播放列表并绑定点击切换事件
     * @returns {void}
     * @description
     * 1. 生成播放列表HTML，包含索引、封面、歌曲名、艺术家
     * 2. 为每个列表项添加点击事件
     * 3. 高亮当前播放的歌曲
     * 4. 自动滚动到当前歌曲
     */
    updatePlaylistDisplay() {
        if (!this.elements.playlistContent || !this.playlist || this.playlist.length === 0) return;
        const html = this.playlist.map((song, index) => `
            <div class="playlist-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="playlist-item-index">${(index + 1).toString().padStart(2, '0')}</div>
                <img class="playlist-item-cover" src="${song.picUrl || ''}" alt="专辑封面">
                <div class="playlist-item-info">
                    <div class="playlist-item-name">${song.name}</div>
                    <div class="playlist-item-artist">${song.artists}</div>
                </div>
            </div>
        `).join('');
        this.elements.playlistContent.innerHTML = html;
        this.elements.playlistContent.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', async () => {
                const index = parseInt(item.dataset.index);
                if (index !== this.currentIndex) {
                    this.currentIndex = index;
                    await this.loadCurrentSong();
                    if (this.isPlaying) {
                        await this.play();
                    }
                    this.updatePlaylistDisplay();
                    this.togglePlaylist();
                }
            });
        });
        const activeItem = this.elements.playlistContent.querySelector('.playlist-item.active');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    /**
     * 根据点击/拖拽位置跳转播放进度
     * @param {MouseEvent} e - 鼠标事件
     * @returns {void}
     * @description
     * 1. 计算鼠标在进度条中的相对位置（0-1）
     * 2. 转换为时间值并设置到audio元素
     * 3. 包含边界检查确保时间值有效
     */
    seekTo(e) {
        if (!this.elements.progressContainer || !this.audio) return;
        const rect = this.elements.progressContainer.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percent * this.duration;
        if (isFinite(newTime) && newTime >= 0) {
            this.audio.currentTime = newTime;
        }
    }
    /**
     * 根据点击/拖拽位置设置音量
     * @param {MouseEvent} e - 鼠标事件
     * @returns {void}
     * @description
     * 1. 计算鼠标在音量条中的相对位置（0-1）
     * 2. 转换为音量值并应用到audio元素
     * 3. 更新音量条显示
     * 4. 包含边界检查确保音量值在0-1范围内
     */
    setVolume(e) {
        if (!this.elements.volumeSlider) return;
        const rect = this.elements.volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.volume = percent;
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
    }
    /**
     * 显示/隐藏歌词，并同步按钮态
     * @returns {void}
     * @description
     * 1. 切换showLyrics状态
     * 2. 更新歌词容器可见性
     * 3. 更新歌词按钮的激活状态
     * 4. 触发CSS过渡动画
     */
    toggleLyrics() {
        this.showLyrics = !this.showLyrics;
        this.elements.lyricsContainer.classList.toggle('hidden', !this.showLyrics);
        this.elements.lyricsBtn.classList.toggle('active', this.showLyrics);
    }
    /**
     * 展开/收起播放列表
     * @param {boolean | null} [show=null] - 指定显示或切换（`null`为切换）
     * @returns {void}
     * @description
     * 1. 根据参数决定显示/隐藏播放列表
     * 2. 计算播放列表展开方向（上/下）
     * 3. 更新播放列表内容和按钮状态
     * 4. 处理点击外部区域关闭播放列表
     */
    togglePlaylist(show = null) {
        if (!this.elements.playlistContainer) return;
        const isShowing = this.elements.playlistContainer.classList.contains('show');
        const shouldShow = show !== null ? show : !isShowing;
        if (shouldShow) {
            this.determinePlaylistDirection();
            this.updatePlaylistDisplay();
            this.elements.playlistContainer.classList.add('show');
            if (this.elements.listBtn) {
                this.elements.listBtn.classList.add('active');
            }
        } else {
            this.elements.playlistContainer.classList.remove('show', 'show-above', 'show-below');
            if (this.elements.listBtn) {
                this.elements.listBtn.classList.remove('active');
            }
        }
    }
    /**
     * 切换播放模式，三态：列表、单曲、随机
     * @returns {void}
     * @description
     * 1. 循环切换播放模式：list -> single -> shuffle -> list
     * 2. 更新播放模式按钮的图标和标题
     * 3. 影响nextSong()的行为逻辑
     * @example
     * // 当前模式: list
     * player.togglePlayMode(); // 切换到 single
     * player.togglePlayMode(); // 切换到 shuffle
     * player.togglePlayMode(); // 切换回 list
     */
    togglePlayMode() {
        const modes = ['list', 'single', 'shuffle'];
        const currentIndex = modes.indexOf(this.playMode);
        this.playMode = modes[(currentIndex + 1) % 3];
        
        const iconSvgs = { list: ICONS.loopList, single: ICONS.loopSingle, shuffle: ICONS.shuffle };
        const titles = { list: '列表循环', single: '单曲循环', shuffle: '随机播放' };
        
        if (this.elements.loopModeBtn) {
            this.elements.loopModeBtn.innerHTML = iconSvgs[this.playMode];
            this.elements.loopModeBtn.title = titles[this.playMode];
        }
    }
    /**
     * 切换最小化状态，并应用空闲淡出策略
     * @returns {void}
     * @description
     * 1. 切换minimized类名控制UI形态
     * 2. 更新最小化按钮状态和标题
     * 3. 启动或清除空闲淡出计时器
     * 4. 处理空闲状态的显示/隐藏逻辑
     * @example
     * player.toggleMinimize(); // 切换到最小化状态
     * player.toggleMinimize(); // 恢复到正常状态
     */
    toggleMinimize() {
        const isCurrentlyMinimized = this.element.classList.contains('minimized');
        this.isMinimized = isCurrentlyMinimized;
        if (!isCurrentlyMinimized) {
            this.element.classList.add('minimized');
            this.isMinimized = true;
            if (this.elements.minimizeBtn) {
                this.elements.minimizeBtn.classList.add('active');
                this.elements.minimizeBtn.title = '展开';
                this.elements.minimizeBtn.innerHTML = ICONS.maximize;
            }
            this.clearIdleTimer();
            this.isIdle = false;
            this.element.classList.remove('idle', 'fading-in', 'fading-out', 'docked-left', 'docked-right', 'popping-left', 'popping-right');
            this.startIdleTimer();
        } else {
            this.element.classList.remove('minimized');
            this.isMinimized = false;
            if (this.elements.minimizeBtn) {
                this.elements.minimizeBtn.classList.remove('active');
                this.elements.minimizeBtn.title = '缩小';
                this.elements.minimizeBtn.innerHTML = ICONS.minimize;
            }
            this.clearIdleTimer();
            if (this.isIdle) {
                this.restoreOpacity();
            } else {
                this.element.classList.remove('idle', 'fading-in', 'fading-out', 'docked-left', 'docked-right', 'popping-left', 'popping-right');
            }
            this.isIdle = false;
        }
    }
    /**
     * 根据视窗空间决定播放列表展开方向（上/下）
     * @returns {void}
     * @description
     * 1. 计算播放器在视窗中的位置
     * 2. 比较上方和下方的可用空间
     * 3. 如果下方空间不足，设置expand-up类让播放列表向上展开
     * 4. 确保播放列表不会超出视窗边界
     */
    determinePlaylistDirection() {
        const playerRect = this.element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - playerRect.bottom;
        const spaceAbove = playerRect.top;
        const playlistHeight = 220;
        this.elements.playlistContainer.classList.remove('expand-up');
        if (spaceBelow >= playlistHeight || spaceBelow >= spaceAbove) {
        } else {
            this.elements.playlistContainer.classList.add('expand-up');
        }
    }
    /**
     * 预留的拖拽定位功能（当前禁用）
     * @returns {void}
     * @description
     * 1. 当前为预留接口，仅返回不做任何操作
     * 2. 计划实现播放器的拖拽定位功能
     * 3. 将支持在页面中自由拖动播放器到任意位置
     * 4. 需要处理拖拽开始、移动、结束等事件
     * @todo 实现拖拽定位功能，支持播放器在页面中的自由拖动
     * @example
     * player.setupDragAndDrop(); // 当前无实际操作
     * @private
     */
    setupDragAndDrop() {
        return;
    }
    /**
     * 统一的错误展示（替换标题与歌词区域）
     * @param {string} message - 错误消息
     * @returns {void}
     * @description
     * 1. 清空当前歌曲信息
     * 2. 显示错误消息在标题位置
     * 3. 清空歌词显示
     * 4. 通常在网络请求失败或音频加载失败时调用
     * @example
     * player.showError('网络连接失败，请检查网络设置');
     */
    showError(message) {
        this.elements.songTitle.textContent = message;
        this.elements.songArtist.textContent = '';
        this.elements.lyricLine.textContent = '';
    }
    /**
     * 初始化并监听主题变化（跟随宿主/系统）
     * @returns {void}
     * @description
     * 1. 根据配置设置初始主题
     * 2. 如果主题为auto，设置系统主题监听器
     * 3. 应用检测到的主题到播放器元素
     * @example
     * player.initTheme(); // 初始化主题系统
     */
    initTheme() {
        this.setTheme(this.config.theme);
        if (this.config.theme === 'auto') {
            this.setupThemeListener();
        }
    }
    /**
     * 设置主题模式
     * @param {('auto'|'dark'|'light')} theme - 主题枚举
     * @returns {void}
     * @description
     * 1. 根据主题类型应用不同的样式逻辑
     * 2. auto模式下检测系统/宿主主题
     * 3. 更新播放器元素的data-theme属性和相关类名
     * 4. 触发CSS变量和样式的切换
     * @example
     * player.setTheme('dark'); // 切换到深色主题
     * player.setTheme('auto'); // 切换到自动检测模式
     */
    setTheme(theme) {
        if (theme === 'auto') {
            const detectedTheme = this.detectTheme();
            this.element.setAttribute('data-theme', 'auto');
            if (detectedTheme === 'dark') {
                this.element.classList.add('theme-dark-detected');
            } else {
                this.element.classList.remove('theme-dark-detected');
            }
        } else {
            this.element.setAttribute('data-theme', theme);
            this.element.classList.remove('theme-dark-detected');
        }
    }
    /**
     * 综合检测宿主、CSS变量与系统偏好得到主题
     * @returns {'dark'|'light'} 主题枚举
     */
    detectTheme() {
        const hostTheme = this.detectHostTheme();
        if (hostTheme) {
            return hostTheme;
        }
        const cssTheme = this.detectCSSTheme();
        if (cssTheme) {
            return cssTheme;
        }
        return this.detectSystemTheme();
    }
    /**
     * 从`<html>`或`<body>`的类名/属性推断主题
     * @returns {'dark'|'light'|null} 推断结果
     */
    detectHostTheme() {
        const html = document.documentElement;
        const body = document.body;
        const darkClasses = ['dark', 'theme-dark', 'dark-theme', 'dark-mode'];
        const lightClasses = ['light', 'theme-light', 'light-theme', 'light-mode'];
        for (const className of darkClasses) {
            if (html.classList.contains(className)) return 'dark';
        }
        for (const className of lightClasses) {
            if (html.classList.contains(className)) return 'light';
        }
        if (body) {
            for (const className of darkClasses) {
                if (body.classList.contains(className)) return 'dark';
            }
            for (const className of lightClasses) {
                if (body.classList.contains(className)) return 'light';
            }
        }
        const htmlTheme = html.getAttribute('data-theme');
        if (htmlTheme === 'dark' || htmlTheme === 'light') {
            return htmlTheme;
        }
        const bodyTheme = body?.getAttribute('data-theme');
        if (bodyTheme === 'dark' || bodyTheme === 'light') {
            return bodyTheme;
        }
        return null;
    }
    /**
     * 从CSS变量推断主题（根据背景与文字颜色明暗）
     * @returns {'dark'|'light'|null} 推断结果
     */
    detectCSSTheme() {
        try {
            const rootStyles = getComputedStyle(document.documentElement);
            const bgColor = rootStyles.getPropertyValue('--bg-color') || 
                           rootStyles.getPropertyValue('--background-color') ||
                           rootStyles.getPropertyValue('--color-bg');
            const textColor = rootStyles.getPropertyValue('--text-color') || 
                             rootStyles.getPropertyValue('--color-text') ||
                             rootStyles.getPropertyValue('--text-primary');
            if (bgColor || textColor) {
                const isDarkBg = this.isColorDark(bgColor);
                const isLightText = this.isColorLight(textColor);
                if (isDarkBg || isLightText) {
                    return 'dark';
                }
                if (!isDarkBg || !isLightText) {
                    return 'light';
                }
            }
        } catch (error) {
            console.warn('CSS主题检测失败:', error);
        }
        return null;
    }
    /**
     * 使用`prefers-color-scheme`媒体查询检测系统主题
     * @returns {'dark'|'light'} 主题枚举
     */
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    /**
     * 判断颜色是否为暗色，支持多种颜色格式和智能检测
     * @param {string} color - 颜色字符串（支持rgb、hex、颜色名称等）
     * @returns {boolean} 暗色返回`true`
     * @description
     * 1. 首先检查颜色名称中是否包含'dark'、'black'或是透明色
     * 2. 解析RGB格式，使用感知亮度公式：(r×299 + g×587 + b×114)/1000
     * 3. 解析HEX格式（支持#RGB和#RRGGBB），同样使用感知亮度计算
     * 4. 亮度阈值设为128，低于此值认为是暗色
     * @example
     * player.isColorDark('rgb(255, 0, 0)'); // false（红色是亮色）
     * player.isColorDark('#000000'); // true（黑色是暗色）
     * player.isColorDark('darkblue'); // true（包含'dark'关键字）
     */
    isColorDark(color) {
        if (!color) return false;
        color = color.replace(/\s/g, '').toLowerCase();
        if (color.includes('dark') || color.includes('black') || color === 'transparent') {
            return true;
        }
        const rgb = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
        if (rgb) {
            const [, r, g, b] = rgb.map(Number);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness < 128;
        }
        const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
        if (hex) {
            const hexValue = hex[1];
            const r = parseInt(hexValue.length === 3 ? hexValue[0] + hexValue[0] : hexValue.substr(0, 2), 16);
            const g = parseInt(hexValue.length === 3 ? hexValue[1] + hexValue[1] : hexValue.substr(2, 2), 16);
            const b = parseInt(hexValue.length === 3 ? hexValue[2] + hexValue[2] : hexValue.substr(4, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness < 128;
        }
        return false;
    }
    /**
     * 判断颜色是否为亮色（与`isColorDark`相反）
     * @param {string} color - 颜色字符串（支持rgb、hex、颜色名称等）
     * @returns {boolean} 亮色返回`true`
     * @description
     * 这是`isColorDark`函数的逻辑取反，用于判断颜色是否为亮色
     * 使用相同的颜色解析和亮度计算逻辑，但返回相反的结果
     * @example
     * player.isColorLight('rgb(255, 255, 255)'); // true（白色是亮色）
     * player.isColorLight('#000000'); // false（黑色不是亮色）
     * player.isColorLight('lightblue'); // true（包含'light'关键字时isColorDark返回false）
     */
    isColorLight(color) {
        return !this.isColorDark(color);
    }
    /**
     * 监听系统主题与宿主DOM变化，自动刷新主题
     * @returns {void}
     * @description
     * 1. 监听系统颜色方案变化（prefers-color-scheme）
     * 2. 监听DOM属性和类名变化
     * 3. 当检测到主题变化时自动重新应用主题
     * 4. 使用MutationObserver实现高效的DOM变化监听
     * @example
     * player.setupThemeListener(); // 设置主题变化监听
     */
    setupThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleThemeChange = () => {
                if (this.config.theme === 'auto') {
                    this.setTheme('auto');
                }
            };
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleThemeChange);
            } else {
                mediaQuery.addListener(handleThemeChange);
            }
        }
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                if (this.config.theme === 'auto') {
                    let shouldUpdate = false;
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && 
                            (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
                            shouldUpdate = true;
                        }
                    });
                    if (shouldUpdate) {
                        this.setTheme('auto');
                    }
                }
            });
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class', 'data-theme']
            });
            if (document.body) {
                observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['class', 'data-theme']
                });
            }
        }
    }
    /**
     * 自动初始化页面上所有`.netease-mini-player`实例
     * @returns {void}
     * @description
     * 1. 查找页面上所有具有netease-mini-player类名的元素
     * 2. 为每个元素创建播放器实例（如果尚未创建）
     * 3. 存储实例引用到元素的_neteasePlayer属性
     * 4. 通常在DOMContentLoaded事件触发时调用
     * @throws {Error} 当DOM元素无效或播放器初始化失败时可能抛出
     * @example
     * // 自动初始化（已内置）
     * NeteaseMiniPlayer.init();
     * 
     * // 手动触发初始化
     * document.addEventListener('DOMContentLoaded', NeteaseMiniPlayer.init);
     */
    /**
     * 自动初始化页面上所有带有`netease-mini-player`类名的元素
     * @returns {void}
     * @description
     * 1. 查找页面上所有具有`netease-mini-player`类名的元素
     * 2. 为每个元素创建播放器实例（如果尚未创建）
     * 3. 避免重复创建实例，确保幂等性
     * 4. 通常在DOM加载完成后自动调用
     * @example
     * // 自动初始化页面上所有播放器
     * NeteaseMiniPlayer.init();
     * 
     * // 通常在DOMContentLoaded事件中自动调用
     * document.addEventListener('DOMContentLoaded', NeteaseMiniPlayer.init);
     */
    static init() {
        document.querySelectorAll('.netease-mini-player').forEach(element => {
            if (!element._neteasePlayer) {
                element._neteasePlayer = new NeteaseMiniPlayer(element);
            }
        });
    }
    /**
     * 初始化指定容器上的播放器实例（幂等）
     * @param {HTMLElement} element - 容器元素
     * @returns {NeteaseMiniPlayer} 组件实例
     * @description
     * 1. 检查元素是否已有播放器实例
     * 2. 如果没有则创建新的播放器实例
     * 3. 返回现有的或新创建的实例
     * 4. 确保不会重复创建实例（幂等性）
     * @example
     * const element = document.querySelector('#my-player');
     * const player = NeteaseMiniPlayer.initPlayer(element);
     * // 多次调用返回同一个实例
     * const samePlayer = NeteaseMiniPlayer.initPlayer(element);
     * console.log(player === samePlayer); // true
     */
    static initPlayer(element) {
        if (!element._neteasePlayer) {
            element._neteasePlayer = new NeteaseMiniPlayer(element);
        }
        return element._neteasePlayer;
    }
}
if (typeof window !== 'undefined') {
    window.NeteaseMiniPlayer = NeteaseMiniPlayer;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', NeteaseMiniPlayer.init);
    } else {
        NeteaseMiniPlayer.init();
    }
}

/**
 * 短语法解析器（NMPv2 Shortcode Parser），将形如 `{nmpv2:...}` 的文本嵌入转换为播放器DOM
 * @class NMPv2ShortcodeParser
 * @constructor
 * @description
 * - 支持在纯文本内容中以短语法形式插入播放器，自动转换为DOM结构
 * - 兼容已有的 `.netease-mini-player` 元素，避免重复初始化
 * - 处理三类核心流程：文本节点扫描、现有元素标记、播放器初始化
 * @example
 * // 页面加载后自动启用
 * window.nmpv2ShortcodeParser = new NMPv2ShortcodeParser();
 * 
 * // 将动态字符串中的短语法转换为HTML
 * const html = NMPv2ShortcodeParser.processDynamicContent("{nmpv2:playlist=123, position=bottom-right}");
 * 
 * @see https://github.com/numakkiyu/NeteaseMiniPlayer
 */
class NMPv2ShortcodeParser {
    constructor() {
        this.paramMappings = {
            'position': 'data-position',
            'theme': 'data-theme',
            'lyric': 'data-lyric',
            'embed': 'data-embed',
            'minimized': 'data-default-minimized',
            'autoplay': 'data-autoplay',
            'idle-opacity': 'data-idle-opacity',
            'auto-pause': 'data-auto-pause'
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.processContainer(document.body);
    }

    processContainer(container) {
        this.processTextNodes(container);
        this.processExistingElements(container);
        this.initializePlayers(container);
    }

    processTextNodes(container) {
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('{nmpv2:')) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(node => {
            const content = node.textContent;
            const shortcodes = this.extractShortcodes(content);

            if (shortcodes.length > 0) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                shortcodes.forEach(shortcode => {
                    if (shortcode.startIndex > lastIndex) {
                        fragment.appendChild(document.createTextNode(
                            content.substring(lastIndex, shortcode.startIndex)
                        ));
                    }

                    const playerElement = this.createPlayerElement(shortcode);
                    fragment.appendChild(playerElement);

                    lastIndex = shortcode.endIndex;
                });

                if (lastIndex < content.length) {
                    fragment.appendChild(document.createTextNode(
                        content.substring(lastIndex)
                    ));
                }

                node.parentNode.replaceChild(fragment, node);
            }
        });
    }

    processExistingElements(container) {
        container.querySelectorAll('.netease-mini-player:not([data-shortcode-processed])')
            .forEach(element => {
                element.setAttribute('data-shortcode-processed', 'true');
            });
    }

    initializePlayers(container) {
        container.querySelectorAll('.netease-mini-player:not([data-initialized])')
            .forEach(element => {
                element.setAttribute('data-initialized', 'true');
                NeteaseMiniPlayer.initPlayer(element);
            });
    }

    extractShortcodes(text) {
        const regex = /\{nmpv2:([^}]*)\}/g;
        let match;
        const results = [];

        while ((match = regex.exec(text)) !== null) {
            const content = match[1].trim();
            const startIndex = match.index;
            const endIndex = match.index + match[0].length;

            let shortcode = {
                type: 'song',
                id: null,
                params: {},
                startIndex,
                endIndex
            };

            this.parseShortcodeContent(content, shortcode);
            results.push(shortcode);
        }

        return results;
    }

    parseShortcodeContent(content, shortcode) {
        if (content.startsWith('playlist=')) {
            shortcode.type = 'playlist';
            const parts = content.split(/,\s*/);
            const firstPart = parts.shift();
            shortcode.id = firstPart.replace('playlist=', '').trim();
            parts.forEach(part => this.parseParam(part, shortcode.params));
        } else if (content.includes('=')) {
            const parts = content.split(/,\s*/);
            const firstPart = parts.shift();
            if (firstPart.includes('=')) {
                this.parseParam(firstPart, shortcode.params);
                parts.forEach(part => this.parseParam(part, shortcode.params));
            } else {
                shortcode.id = firstPart.trim();
                parts.forEach(part => this.parseParam(part, shortcode.params));
            }
        } else {
            shortcode.id = content.trim();
        }

        if (shortcode.params.position === undefined || shortcode.params.position === 'static') {
            shortcode.params.embed = shortcode.params.embed ?? 'true';
        } else if (shortcode.params.embed === undefined) {
            shortcode.params.embed = 'false';
        }
    }

    parseParam(paramStr, params) {
        const [key, value] = paramStr.split('=');
        if (!key || !value) return;

        const cleanKey = key.trim().toLowerCase();
        const cleanValue = value.trim().toLowerCase();

        if (cleanKey === 'song-id') {
            params.songId = cleanValue;
        } else if (cleanKey === 'playlist-id') {
            params.playlistId = cleanValue;
            params.type = 'playlist';
        } else if (cleanKey === 'minimized') {
            params.defaultMinimized = cleanValue === 'true' ? 'true' : 'false';
        } else {
            const mapping = this.paramMappings[cleanKey] || `data-${cleanKey}`;
            params[cleanKey] = cleanValue;
        }
    }

    createPlayerElement(shortcode) {
        const div = document.createElement('div');
        div.className = 'netease-mini-player';
        div.setAttribute('data-shortcode-processed', 'true');

        if (shortcode.type === 'playlist' && shortcode.id) {
            div.setAttribute('data-playlist-id', shortcode.id);
        } else if (shortcode.id) {
            div.setAttribute('data-song-id', shortcode.id);
        }

        Object.entries(shortcode.params).forEach(([key, value]) => {
            if (key === 'songId') {
                div.setAttribute('data-song-id', value);
            } else if (key === 'playlistId') {
                div.setAttribute('data-playlist-id', value);
            } else if (key === 'type') {
            } else {
                const dataKey = this.paramMappings[key] || `data-${key}`;
                div.setAttribute(dataKey, value);
            }
        });

        return div;
    }

    static processDynamicContent(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        window.nmpv2ShortcodeParser.processContainer(tempDiv);
        return tempDiv.innerHTML;
    }
}

if (typeof window !== 'undefined') {
    window.nmpv2ShortcodeParser = new NMPv2ShortcodeParser();
    window.processNMPv2Shortcodes = function(container) {
        if (container instanceof Element) {
            window.nmpv2ShortcodeParser.processContainer(container);
        } else {
            console.warn('processNMPv2Shortcodes requires a DOM element');
        }
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderShortcodes: function(html) {
            return html.replace(/\{nmpv2:([^}]*)\}/g, (match, content) => {
                let shortcode = {
                    type: 'song',
                    id: null,
                    params: {}
                };
                if (content.startsWith('playlist=')) {
                    shortcode.type = 'playlist';
                    const parts = content.split(/,\s*/);
                    shortcode.id = parts[0].replace('playlist=', '').trim();
                    parts.slice(1).forEach(part => {
                        const [key, value] = part.split('=');
                        if (key && value) shortcode.params[key.trim()] = value.trim();
                    });
                } else {
                    const parts = content.split(/,\s*/);
                    if (parts[0].includes('=')) {
                        parts.forEach(part => {
                            const [key, value] = part.split('=');
                            if (key && value) shortcode.params[key.trim()] = value.trim();
                        });
                    } else {
                        shortcode.id = parts[0].trim();
                        parts.slice(1).forEach(part => {
                            const [key, value] = part.split('=');
                            if (key && value) shortcode.params[key.trim()] = value.trim();
                        });
                    }
                }
                if (!shortcode.params.position || shortcode.params.position === 'static') {
                    shortcode.params.embed = shortcode.params.embed ?? 'true';
                } else if (shortcode.params.embed === undefined) {
                    shortcode.params.embed = 'false';
                }
                let out = '<div class="netease-mini-player"';
                if (shortcode.type === 'playlist' && shortcode.id) {
                    out += ` data-playlist-id="${shortcode.id}"`;
                } else if (shortcode.id) {
                    out += ` data-song-id="${shortcode.id}"`;
                }
                Object.entries(shortcode.params).forEach(([key, value]) => {
                    if (key === 'songId') {
                        out += ` data-song-id="${value}"`;
                    } else if (key === 'playlistId') {
                        out += ` data-playlist-id="${value}"`;
                    } else {
                        const dataKey = {
                            'position': 'data-position',
                            'theme': 'data-theme',
                            'lyric': 'data-lyric',
                            'embed': 'data-embed',
                            'minimized': 'data-default-minimized',
                            'autoplay': 'data-autoplay',
                            'idle-opacity': 'data-idle-opacity',
                            'auto-pause': 'data-auto-pause'
                        }[key] || `data-${key}`;
                        out += ` ${dataKey}="${value}"`;
                    }
                });
                out += '></div>';
                return out;
            });
        }
    };
}

console.log(["版本号 v2.1.0.2", "NeteaseMiniPlayer V2 [NMPv2]", "BHCN STUDIO & 北海的佰川（ImBHCN[numakkiyu]）", "GitHub地址：https://github.com/numakkiyu/NeteaseMiniPlayer", "基于 Apache 2.0 开源协议发布"].join("\n"));
