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
const GlobalAudioManager = {
    currentPlayer: null,
    setCurrent(player) {
        if (this.currentPlayer && this.currentPlayer !== player) {
            this.currentPlayer.pause();
        }
        this.currentPlayer = player;
    }
};
class NeteaseMiniPlayer {
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
    parseConfig() {
        const element = this.element;
        const position = element.dataset.position || 'static';
        const validPositions = ['static', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const finalPosition = validPositions.includes(position) ? position : 'static';
        const defaultMinimized = element.dataset.defaultMinimized === 'true';
        
        const embedValue = element.getAttribute('data-embed') || element.dataset.embed;
        const isEmbed = embedValue === 'true' || embedValue === true;

        return {
            embed: isEmbed,
            autoplay: element.dataset.autoplay === 'true',
            playlistId: element.dataset.playlistId,
            songId: element.dataset.songId,
            position: finalPosition,
            lyric: element.dataset.lyric !== 'false',
            theme: element.dataset.theme || 'auto',
            size: element.dataset.size || 'compact',
            defaultMinimized: defaultMinimized
        };
    }
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
                    this.play();
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
                    ${!this.config.embed ? '<button class="control-btn prev-btn" title="上一首">⏮</button>' : ''}
                    <button class="control-btn play-btn" title="播放/暂停">
                        <span class="play-icon">▶</span>
                        <span class="pause-icon" style="display: none;">⏸</span>
                    </button>
                    ${!this.config.embed ? '<button class="control-btn next-btn" title="下一首">⏭</button>' : ''}
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
                        <span class="volume-icon">🔊</span>
                        <div class="volume-slider-container">
                            <div class="volume-slider">
                                <div class="volume-bar"></div>
                            </div>
                        </div>
                    </div>
                    <button class="feature-btn lyrics-btn" title="显示/隐藏歌词">📝</button>
                    ${!this.config.embed ? '<button class="feature-btn loop-mode-btn" title="列表循环">🔁</button>' : ''}
                    ${!this.config.embed ? '<button class="feature-btn list-btn" title="播放列表">☰</button>' : ''}
                    ${!this.config.embed ? '<button class="feature-btn minimize-btn" title="缩小/展开">⚪</button>' : ''}
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

    startIdleTimer() {
        this.clearIdleTimer();
        if (!this.shouldEnableIdleOpacity()) return;
        this.idleTimeout = setTimeout(() => {
            this.triggerFadeOut();
        }, this.idleDelay);
    }

    clearIdleTimer() {
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
    }

    triggerFadeOut() {
        if (!this.shouldEnableIdleOpacity()) return;
        if (this.isIdle) return;
        this.isIdle = true;
        this.element.classList.remove('fading-in');
        this.element.classList.add('fading-out');
        const onEnd = () => {
            this.element.classList.remove('fading-out');
            this.element.classList.add('idle');
            this.element.removeEventListener('animationend', onEnd);
        };
        this.element.addEventListener('animationend', onEnd);
    }

    restoreOpacity() {
        this.clearIdleTimer();
        if (!this.isIdle) return;
        this.isIdle = false;
        this.element.classList.remove('idle', 'fading-out');
        this.element.classList.add('fading-in');
        const onEndIn = () => {
            this.element.classList.remove('fading-in');
            this.element.removeEventListener('animationend', onEndIn);
        };
        this.element.addEventListener('animationend', onEndIn);
    }

    shouldEnableIdleOpacity() {
        return this.isMinimized === true;
    }

    applyIdlePolicyOnInit() {
        if (!this.shouldEnableIdleOpacity()) {
            this.clearIdleTimer();
            this.isIdle = false;
            this.element.classList.remove('idle', 'fading-in', 'fading-out');
        }
    }
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
    getCacheKey(type, id) {
        return `${type}_${id}`;
    }
    setCache(key, data, expiry = 5 * 60 * 1000) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + expiry
        });
    }
    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }
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
    async togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }
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
            console.error('播放失败:', error);
            this.showError('播放失败');
        }
    }
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.elements.playIcon.style.display = 'inline';
        this.elements.pauseIcon.style.display = 'none';
        this.elements.albumCover.classList.remove('playing');
        this.element.classList.remove('player-playing');
    }
    async previousSong() {
        if (this.playlist.length <= 1) return;
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
        await this.loadCurrentSong();
        if (this.isPlaying) {
            await this.play();
        }
    }
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
    updateProgress() {
        if (this.duration > 0) {
            const progress = (this.currentTime / this.duration) * 100;
            this.elements.progressBar.style.width = `${progress}%`;
        }
    }
    updateTimeDisplay() {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };
        this.elements.currentTime.textContent = formatTime(this.currentTime);
        this.elements.totalTime.textContent = formatTime(this.duration);
    }
    updateVolumeDisplay() {
        this.elements.volumeBar.style.width = `${this.volume * 100}%`;
    }
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
    seekTo(e) {
        if (!this.elements.progressContainer || !this.audio) return;
        const rect = this.elements.progressContainer.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = percent * this.duration;
        if (isFinite(newTime) && newTime >= 0) {
            this.audio.currentTime = newTime;
        }
    }
    setVolume(e) {
        if (!this.elements.volumeSlider) return;
        const rect = this.elements.volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.volume = percent;
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
    }
    toggleLyrics() {
        this.showLyrics = !this.showLyrics;
        this.elements.lyricsContainer.classList.toggle('hidden', !this.showLyrics);
        this.elements.lyricsBtn.classList.toggle('active', this.showLyrics);
    }
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
    togglePlayMode() {
        const modes = ['list', 'single', 'shuffle'];
        const currentIndex = modes.indexOf(this.playMode);
        this.playMode = modes[(currentIndex + 1) % 3];
        
        const icons = { list: '🔁', single: '🔂', shuffle: '🔀' };
        const titles = { list: '列表循环', single: '单曲循环', shuffle: '随机播放' };
        
        if (this.elements.loopModeBtn) {
            this.elements.loopModeBtn.textContent = icons[this.playMode];
            this.elements.loopModeBtn.title = titles[this.playMode];
        }
    }
    toggleMinimize() {
        const isCurrentlyMinimized = this.element.classList.contains('minimized');
        this.isMinimized = isCurrentlyMinimized;
        if (!isCurrentlyMinimized) {
            this.element.classList.add('minimized');
            this.isMinimized = true;
            if (this.elements.minimizeBtn) {
                this.elements.minimizeBtn.classList.add('active');
                this.elements.minimizeBtn.title = '展开';
            }
            this.clearIdleTimer();
            this.isIdle = false;
            this.element.classList.remove('idle', 'fading-in', 'fading-out');
            this.startIdleTimer();
        } else {
            this.element.classList.remove('minimized');
            this.isMinimized = false;
            if (this.elements.minimizeBtn) {
                this.elements.minimizeBtn.classList.remove('active');
                this.elements.minimizeBtn.title = '缩小';
            }
            this.clearIdleTimer();
            if (this.isIdle) {
                this.restoreOpacity();
            } else {
                this.element.classList.remove('idle', 'fading-in', 'fading-out');
            }
            this.isIdle = false;
        }
    }
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
    setupDragAndDrop() {
        return;
    }
    showError(message) {
        this.elements.songTitle.textContent = message;
        this.elements.songArtist.textContent = '';
        this.elements.lyricLine.textContent = '';
    }
    initTheme() {
        this.setTheme(this.config.theme);
        if (this.config.theme === 'auto') {
            this.setupThemeListener();
        }
    }
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
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
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
    isColorLight(color) {
        return !this.isColorDark(color);
    }
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
    static init() {
        document.querySelectorAll('.netease-mini-player').forEach(element => {
            if (!element._neteasePlayer) {
                element._neteasePlayer = new NeteaseMiniPlayer(element);
            }
        });
    }
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

console.log(["版本号 v2.0.10.1", "NeteaseMiniPlayer V2 [NMPv2]", "BHCN STUDIO & 北海的佰川（ImBHCN[numakkiyu]）", "GitHub地址：https://github.com/numakkiyu/NeteaseMiniPlayer", "基于 Apache 2.0 开源协议发布"].join("\n"));
