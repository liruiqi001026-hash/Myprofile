<template>
  <!-- 全局悬浮音乐播放器 -->
  <div class="music-player" :class="{ expanded: isExpanded }">
    <!-- 折叠/展开按钮（仅折叠状态显示） -->
    <div class="toggle-btn" @click="isExpanded = !isExpanded">
      <svg v-if="!isExpanded" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19M16 5V19" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 5H18M6 19H18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>

    <!-- 展开后的完整播放器 -->
    <div class="player-content" v-if="isExpanded">
      <!-- 新增顶部折叠按钮（优化体验） -->
      <div class="top-toggle-btn" @click="isExpanded = !isExpanded">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 5H18M6 19H18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 歌曲列表 -->
      <div class="song-list-container">
        <div class="list-title">
          <span>我的音乐列表</span>
        </div>
        <div class="song-list">
          <div class="song-item" v-for="song in songList" :key="song.id" @click="playTargetSong(song)">
            <img :src="song.cover" alt="歌曲封面" class="song-cover" />
            <div class="song-info">
              <p class="song-name">{{ song.name }}</p>
              <p class="song-singer">{{ song.singer }}</p>
            </div>
            <div class="play-icon" v-if="currentPlayingSong.id !== song.id">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19M16 5V19" stroke="#6161ff" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="playing-tag" v-else>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#6161ff" stroke-width="2" stroke-dasharray="4 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前播放栏 -->
      <div class="current-play-bar" v-if="currentPlayingSong.id">
        <img :src="currentPlayingSong.cover" alt="当前播放封面" class="current-cover" />
        <div class="current-info">
          <p class="current-name">{{ currentPlayingSong.name }}</p>
          <p class="current-singer">{{ currentPlayingSong.singer }}</p>
        </div>
      </div>

      <!-- 核心播放控制 -->
      <div class="player-controls">
        <button class="control-btn" @click="playPrevSong" :disabled="!currentPlayingSong.id">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 20L9 12L19 4V20Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 20L15 12L5 4V20Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="control-btn play-btn" @click="togglePlayStatus" :disabled="!currentPlayingSong.id">
          <svg v-if="!isPlaying" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19M16 5V19" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 5H18M6 19H18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="control-btn" @click="playNextSong" :disabled="!currentPlayingSong.id">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 4L15 12L5 20V4Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <path d="M19 4L9 12L19 20V4Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- 播放进度条 -->
      <div class="progress-bar" v-if="currentPlayingSong.id">
        <div class="progress-track" @click="adjustPlayProgress($event)">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
          <div class="progress-thumb" :style="{ left: `${progressPercent}%` }"></div>
        </div>
        <div class="time-wrap">
          <span class="time-text">{{ formatTime(currentPlayTime) }}</span>
          <span class="time-text">{{ formatTime(songTotalDuration) }}</span>
        </div>
      </div>

      <!-- 音量控制 -->
      <div class="volume-control" v-if="currentPlayingSong.id">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          <path d="M15.54 8.46C16.4774 9.39758 17 10.6692 17 12C17 13.3308 16.4774 14.6024 15.54 15.54" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          <path d="M19.07 4.93C20.9447 6.80528 22 9.34835 22 12C22 14.6516 20.9447 17.1947 19.07 19.07" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input type="range" min="0" max="1" step="0.01" v-model="currentVolume" class="volume-slider" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// 1. 基础状态控制
const isExpanded = ref(false); // 播放器是否展开
const isPlaying = ref(false); // 是否正在播放
const currentVolume = ref(0.7); // 当前音量（0-1）

// 2. 歌曲数据配置（可自行修改/添加，音频文件放入 public/music 文件夹）
const songList = ref([
  {
    id: 1,
    name: "离开我的依赖",
    singer: "王艳薇",
    cover: "https://picsum.photos/60/60?random=1",
    audioUrl: "/music/likaiwodeyilai.mp3" // 对应 public/music 下的文件
  },
]);
const currentPlayingSong = ref({}); // 当前播放歌曲
const currentPlayIndex = ref(-1); // 当前播放歌曲索引

// 3. 音频相关状态
const audioInstance = ref(null); // Audio 实例
const currentPlayTime = ref(0); // 当前播放时间（秒）
const songTotalDuration = ref(0); // 歌曲总时长（秒）
const progressPercent = ref(0); // 播放进度百分比

// 4. 初始化 Audio 实例
onMounted(() => {
  // 创建全局唯一 Audio 实例
  audioInstance.value = new Audio();
  // 设置默认音量
  audioInstance.value.volume = currentVolume.value;

  // 绑定 Audio 事件
  bindAudioEvents();
});

// 5. 解绑 Audio 事件，防止内存泄漏
onUnmounted(() => {
  if (audioInstance.value) {
    unbindAudioEvents();
    // 销毁时暂停播放
    audioInstance.value.pause();
  }
});

// 6. 监听音量变化，实时更新
watch(currentVolume, (newVolume) => {
  if (audioInstance.value) {
    audioInstance.value.volume = newVolume;
  }
});

// 7. 绑定 Audio 相关事件
const bindAudioEvents = () => {
  const audio = audioInstance.value;
  if (!audio) return;

  // 播放状态变更
  audio.addEventListener('play', () => {
    isPlaying.value = true;
  });
  audio.addEventListener('pause', () => {
    isPlaying.value = false;
  });

  // 播放进度更新
  audio.addEventListener('timeupdate', () => {
    currentPlayTime.value = audio.currentTime;
    // 计算进度百分比
    progressPercent.value = songTotalDuration.value > 0 
      ? (currentPlayTime.value / songTotalDuration.value) * 100 
      : 0;
  });

  // 歌曲加载完成，获取总时长
  audio.addEventListener('loadedmetadata', () => {
    songTotalDuration.value = audio.duration;
  });

  // 歌曲播放结束，自动播放下一曲
  audio.addEventListener('ended', () => {
    playNextSong();
  });
};

// 8. 解绑 Audio 相关事件
const unbindAudioEvents = () => {
  const audio = audioInstance.value;
  if (!audio) return;

  audio.removeEventListener('play', () => {
    isPlaying.value = true;
  });
  audio.removeEventListener('pause', () => {
    isPlaying.value = false;
  });
  audio.removeEventListener('timeupdate', () => {
    currentPlayTime.value = audio.currentTime;
    progressPercent.value = songTotalDuration.value > 0 
      ? (currentPlayTime.value / songTotalDuration.value) * 100 
      : 0;
  });
  audio.removeEventListener('loadedmetadata', () => {
    songTotalDuration.value = audio.duration;
  });
  audio.removeEventListener('ended', () => {
    playNextSong();
  });
};

// 9. 播放指定歌曲
const playTargetSong = (song) => {
  if (!song || !song.audioUrl) return;

  // 更新当前播放歌曲和索引
  currentPlayingSong.value = song;
  currentPlayIndex.value = songList.value.findIndex(item => item.id === song.id);

  // 更新音频地址并播放
  const audio = audioInstance.value;
  audio.src = song.audioUrl;
  audio.play().catch(err => {
    console.error('播放失败：', err);
    alert('播放失败，请检查音频文件路径');
  });
};

// 10. 播放/暂停切换
const togglePlayStatus = () => {
  const audio = audioInstance.value;
  if (!audio || !currentPlayingSong.value.id) return;

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
};

// 11. 播放上一曲
const playPrevSong = () => {
  if (songList.value.length === 0 || currentPlayIndex.value === -1) return;

  // 计算上一曲索引（循环播放）
  currentPlayIndex.value = (currentPlayIndex.value - 1 + songList.value.length) % songList.value.length;
  const prevSong = songList.value[currentPlayIndex.value];
  playTargetSong(prevSong);
};

// 12. 播放下一曲
const playNextSong = () => {
  if (songList.value.length === 0 || currentPlayIndex.value === -1) return;

  // 计算下一曲索引（循环播放）
  currentPlayIndex.value = (currentPlayIndex.value + 1) % songList.value.length;
  const nextSong = songList.value[currentPlayIndex.value];
  playTargetSong(nextSong);
};

// 13. 调整播放进度
const adjustPlayProgress = (e) => {
  const audio = audioInstance.value;
  if (!audio || !currentPlayingSong.value.id || songTotalDuration.value === 0) return;

  // 获取进度条容器信息
  const track = e.currentTarget;
  const trackRect = track.getBoundingClientRect();
  // 计算点击位置对应的百分比
  const clickPercent = (e.clientX - trackRect.left) / trackRect.width;
  // 更新播放时间
  audio.currentTime = clickPercent * songTotalDuration.value;
  currentPlayTime.value = audio.currentTime;
  progressPercent.value = clickPercent * 100;
};

// 14. 格式化时间（秒 -> 分:秒）
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  // 补零格式化
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
/* 核心：固定悬浮 + 初始折叠样式 */
.music-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: linear-gradient(135deg, #282c34 0%, #3b3f47 100%);
  border-radius: 16px;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  width: 50px;
  height: 50px;
}

/* 展开状态样式 */
.music-player.expanded {
  width: 380px;
  height: 500px;
  padding: 15px;
}

/* 折叠/展开按钮：仅折叠状态显示 */
.toggle-btn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
/* 关键修复：播放器展开后隐藏底部按钮 */
.music-player.expanded .toggle-btn {
  display: none;
}
.toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 新增：顶部折叠按钮样式 */
.top-toggle-btn {
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  padding: 4px 0 8px 0;
  transition: transform 0.2s ease;
}
.top-toggle-btn:hover {
  transform: scale(1.05);
}

/* 播放器内容区 */
.player-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
}

/* 歌曲列表容器 */
.song-list-container {
  flex: 1;
  overflow-y: auto;
}
.list-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #dddddd;
}
.song-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.song-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.song-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.song-cover {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}
.song-info {
  flex: 1;
  overflow: hidden;
}
.song-name {
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.song-singer {
  font-size: 12px;
  color: #cccccc;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.play-icon {
  color: #6161ff;
}
.playing-tag {
  color: #6161ff;
}

/* 当前播放栏 */
.current-play-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}
.current-cover {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}
.current-info {
  flex: 1;
  overflow: hidden;
}
.current-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.current-singer {
  font-size: 12px;
  color: #cccccc;
  margin: 0;
}

/* 播放控制按钮 */
.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 8px 0;
}
.control-btn {
  background-color: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}
.control-btn:disabled {
  color: #666666;
  cursor: not-allowed;
}
.control-btn:not(:disabled):hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.play-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6161ff;
  box-shadow: 0 4px 12px rgba(97, 97, 255, 0.4);
}

/* 进度条样式 */
.progress-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.progress-track {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}
.progress-fill {
  height: 100%;
  background-color: #6161ff;
  border-radius: 3px;
  transition: width 0.1s linear;
}
.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background-color: #6161ff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(97, 97, 255, 0.6);
}
.time-wrap {
  display: flex;
  justify-content: space-between;
}
.time-text {
  font-size: 12px;
  color: #cccccc;
}

/* 音量控制 */
.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}
.volume-slider {
  width: 100px;
  height: 4px;
  accent-color: #6161ff;
  cursor: pointer;
}

/* 滚动条美化 */
.player-content::-webkit-scrollbar {
  width: 4px;
}
.player-content::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}
.player-content::-webkit-scrollbar-thumb {
  background-color: #6161ff;
  border-radius: 2px;
}

/* 响应式适配手机端 */
@media (max-width: 480px) {
  .music-player.expanded {
    width: 320px;
    height: 450px;
  }
}
</style>