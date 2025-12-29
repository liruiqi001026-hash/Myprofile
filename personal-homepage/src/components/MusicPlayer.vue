<template>
  <!-- 全局悬浮音乐播放器 -->
  <div class="music-player" :class="{ expanded: isExpanded }">
    <!-- 折叠/展开按钮 -->
    <div class="toggle-btn" @click="isExpanded = !isExpanded">
      <svg v-if="!isExpanded" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19M16 5V19" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 5H18M6 19H18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>

    <!-- 展开后的完整播放器（新增搜索+列表） -->
    <div class="player-content" v-if="isExpanded">
      <!-- 搜索框 -->
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索歌曲/歌手..." 
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#666" stroke-width="2" stroke-linecap="round"/>
            <path d="M21 21L16.65 16.65" stroke="#666" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- 搜索结果/歌曲列表（修复key冲突） -->
      <div class="song-list-container">
        <div class="list-title">
          <span>{{ searchResult.length ? '搜索结果' : '推荐歌曲' }}</span>
        </div>
        <div class="song-list">
          <!-- 推荐歌曲分支：加根节点+唯一key="recommend" -->
          <div v-if="!searchResult.length" key="recommend">
            <div class="song-item" v-for="song in recommendSongs" :key="`recommend-${song.id}`" @click="playSong(song)">
              <img :src="song.cover" alt="封面" class="song-cover" />
              <div class="song-info">
                <p class="song-name">{{ song.name }}</p>
                <p class="song-singer">{{ song.singer }}</p>
              </div>
              <div class="play-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19M16 5V19" stroke="#6161ff" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- 搜索结果分支：加根节点+唯一key="search" -->
          <div v-else key="search">
            <div class="song-item" v-for="song in searchResult" :key="`search-${song.id}`" @click="playSong(song)">
              <img :src="song.cover" alt="封面" class="song-cover" />
              <div class="song-info">
                <p class="song-name">{{ song.name }}</p>
                <p class="song-singer">{{ song.singer }}</p>
              </div>
              <div class="play-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19M16 5V19" stroke="#6161ff" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前播放栏 -->
      <div class="current-play-bar">
        <img :src="currentSong.cover" alt="封面" class="current-cover" />
        <div class="current-info">
          <p class="current-name">{{ currentSong.name }}</p>
          <p class="current-singer">{{ currentSong.singer }}</p>
        </div>
      </div>

      <!-- 播放控制 -->
      <div class="player-controls">
        <button class="control-btn" @click="playPrev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 20L9 12L19 4V20Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <path d="M5 20L15 12L5 4V20Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="control-btn play-btn" @click="togglePlay">
          <svg v-if="!isPlaying" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19M16 5V19" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 5H18M6 19H18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="control-btn" @click="playNext">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 4L15 12L5 20V4Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            <path d="M19 4L9 12L19 20V4Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-track" @click="setProgress">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
          <div class="progress-thumb" :style="{ left: `${progressPercent}%` }"></div>
        </div>
        <div class="time-wrap">
          <span class="time-text">{{ formatTime(currentTime) }}</span>
          <span class="time-text">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 音量控制 -->
      <div class="volume-control">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          <path d="M15.54 8.46C16.4774 9.39758 17 10.6692 17 12C17 13.3308 16.4774 14.6024 15.54 15.54" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          <path d="M19.07 4.93C20.9447 6.80528 22 9.34835 22 12C22 14.6516 20.9447 17.1947 19.07 19.07" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input type="range" min="0" max="1" step="0.01" v-model="volume" class="volume-slider" @change="setVolume">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { searchMusic, getSongUrl, getHotPlayList } from '@/api/music';

// 基础状态
const isExpanded = ref(false); // 是否展开
const isPlaying = ref(false); // 是否播放
const searchKeyword = ref(''); // 搜索关键词
const searchResult = ref([]); // 搜索结果
const volume = ref(0.7); // 音量

// 歌曲数据
const recommendSongs = ref([
  // 默认推荐歌曲（可替换为热门歌单）
  { id: 1324282164, name: '小幸运', singer: '田馥甄', cover: 'https://picsum.photos/60/60?random=10', duration: 235 },
  { id: 186016, name: '七里香', singer: '周杰伦', cover: 'https://picsum.photos/60/60?random=11', duration: 281 },
  { id: 27843816, name: '稻香', singer: '周杰伦', cover: 'https://picsum.photos/60/60?random=12', duration: 219 }
]);
const currentSong = ref({
  id: '', name: '暂无播放', singer: '', cover: 'https://picsum.photos/60/60?random=99', duration: 0
});
const playList = ref([]); // 播放列表
const currentIndex = ref(-1); // 当前播放索引

// 音频相关
const audio = ref(null); // 全局Audio实例
const currentTime = ref(0); // 当前播放时间
const duration = ref(0); // 总时长
const progressPercent = ref(0); // 进度百分比

// 初始化全局Audio
onMounted(async () => {
  // 全局单例Audio
  if (window.globalAudio) {
    audio.value = window.globalAudio;
    // 恢复之前的播放状态
    currentTime.value = audio.value.currentTime;
    duration.value = audio.value.duration;
    isPlaying.value = !audio.value.paused;
  } else {
    audio.value = new Audio();
    window.globalAudio = audio.value;
  }

  // 绑定Audio事件
  audio.value.volume = volume.value;
  audio.value.addEventListener('play', () => isPlaying.value = true);
  audio.value.addEventListener('pause', () => isPlaying.value = false);
  audio.value.addEventListener('timeupdate', updateProgress);
  audio.value.addEventListener('loadedmetadata', () => duration.value = audio.value.duration);
  audio.value.addEventListener('ended', playNext); // 自动下一曲

  // 获取热门歌单（可选，注释掉则用默认推荐）
  // const hotList = await getHotPlayList();
  // recommendSongs.value = hotList;
});

// 解绑事件（不销毁Audio）
onUnmounted(() => {
  if (audio.value) {
    audio.value.removeEventListener('play', () => isPlaying.value = true);
    audio.value.removeEventListener('pause', () => isPlaying.value = false);
    audio.value.removeEventListener('timeupdate', updateProgress);
    audio.value.removeEventListener('loadedmetadata', () => duration.value = audio.value.duration);
    audio.value.removeEventListener('ended', playNext);
  }
});

// 监听音量
watch(volume, (newVal) => {
  if (audio.value) audio.value.volume = newVal;
});

// 搜索歌曲
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) return;
  const res = await searchMusic(searchKeyword.value);
  searchResult.value = res;
  // 自动播放第一首
  if (res.length) playSong(res[0]);
};

// 播放指定歌曲
const playSong = async (song) => {
  try {
    // 获取播放URL
    const url = await getSongUrl(song.id);
    if (!url) {
      alert('该歌曲暂无播放资源');
      return;
    }

    // 更新当前歌曲
    currentSong.value = song;
    audio.value.src = url;
    // 更新播放列表
    playList.value = searchResult.value.length ? searchResult.value : recommendSongs.value;
    currentIndex.value = playList.value.findIndex(item => item.id === song.id);
    // 开始播放
    await audio.value.play();
  } catch (error) {
    console.error('播放歌曲失败：', error);
    alert('播放失败，请重试');
  }
};

// 播放/暂停
const togglePlay = () => {
  if (!currentSong.value.id) {
    // 无歌曲时播放第一首推荐
    playSong(recommendSongs.value[0]);
    return;
  }
  audio.value.paused ? audio.value.play() : audio.value.pause();
};

// 上一曲
const playPrev = () => {
  if (playList.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + playList.value.length) % playList.value.length;
  playSong(playList.value[currentIndex.value]);
};

// 下一曲
const playNext = () => {
  if (playList.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % playList.value.length;
  playSong(playList.value[currentIndex.value]);
};

// 更新进度
const updateProgress = () => {
  if (audio.value) {
    currentTime.value = audio.value.currentTime;
    progressPercent.value = (currentTime.value / (duration.value || 1)) * 100;
  }
};

// 设置进度
const setProgress = (e) => {
  const track = e.currentTarget;
  const rect = track.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audio.value.currentTime = percent * duration.value;
  updateProgress();
};

// 设置音量
const setVolume = () => {
  audio.value.volume = volume.value;
};

// 格式化时间
const formatTime = (seconds) => {
  if (!seconds) return '00:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
/* 核心样式：固定悬浮+渐变背景 */
.music-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: linear-gradient(135deg, #282c34 0%, #3b3f47 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 50px;
  height: 50px;
}

/* 展开状态：宽屏显示 */
.music-player.expanded {
  width: 380px;
  height: 500px;
  padding: 15px;
}

/* 折叠/展开按钮 */
.toggle-btn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 内容区 */
.player-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
}

/* 搜索框 */
.search-box {
  display: flex;
  gap: 8px;
  align-items: center;
}
.search-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  color: #333;
}
.search-btn {
  background: #6161ff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 歌曲列表 */
.song-list-container {
  flex: 1;
  overflow-y: auto;
}
.list-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ddd;
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
  transition: background 0.2s;
}
.song-item:hover {
  background: rgba(255, 255, 255, 0.1);
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
  color: #ccc;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.play-icon {
  color: #6161ff;
}

/* 当前播放栏 */
.current-play-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
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
  color: #ccc;
  margin: 0;
}

/* 播放控制 */
.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 8px 0;
}
.control-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}
.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.play-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6161ff;
  box-shadow: 0 4px 12px rgba(97, 97, 255, 0.4);
}

/* 进度条 */
.progress-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}
.progress-fill {
  height: 100%;
  background: #6161ff;
  border-radius: 3px;
  transition: width 0.1s;
}
.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: #6161ff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(97, 97, 255, 0.6);
}
.time-wrap {
  display: flex;
  justify-content: space-between;
}
.time-text {
  font-size: 12px;
  color: #ccc;
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}
.player-content::-webkit-scrollbar-thumb {
  background: #6161ff;
  border-radius: 2px;
}

/* 响应式 */
@media (max-width: 480px) {
  .music-player.expanded {
    width: 320px;
    height: 450px;
  }
}
</style>