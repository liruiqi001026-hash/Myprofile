// 音乐API封装（基于网易云非官方API，稳定且免费）
import axios from 'axios';

// 基础请求配置
const musicApi = axios.create({
  baseURL: 'https://music.163.com/api', // 网易云API前缀
  headers: {
    'Referer': 'https://music.163.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  timeout: 10000
});

/**
 * 搜索音乐
 * @param {string} keyword 搜索关键词
 * @param {number} limit 结果数量（默认10）
 * @returns {Promise<Array>} 歌曲列表
 */
export const searchMusic = async (keyword, limit = 10) => {
  try {
    const res = await musicApi.get('/search/get/', {
      params: {
        s: keyword,
        type: 1, // 1=单曲，2=歌单，3=专辑
        offset: 0,
        limit
      }
    });
    // 格式化返回数据
    if (res.data.result?.songs) {
      return res.data.result.songs.map(song => ({
        id: song.id,
        name: song.name,
        singer: song.artists.map(artist => artist.name).join('/'),
        album: song.album.name,
        cover: song.album.picUrl + '?param=60y60', // 压缩封面图
        duration: song.duration / 1000 // 转秒
      }));
    }
    return [];
  } catch (error) {
    console.error('搜索音乐失败：', error);
    return [];
  }
};

/**
 * 获取歌曲播放URL（核心：获取可播放的音频链接）
 * @param {number} songId 歌曲ID
 * @returns {Promise<string>} 播放URL
 */
export const getSongUrl = async (songId) => {
  try {
    // 备用API（网易云外链可能失效，此接口更稳定）
    const res = await axios.get(`https://api.injahow.cn/meting/api?server=netease&type=url&id=${songId}`);
    return res.data.data[0].url || '';
  } catch (error) {
    console.error('获取播放链接失败：', error);
    // 降级使用网易云外链
    return `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
  }
};

/**
 * 获取热门歌单
 * @returns {Promise<Array>} 热门歌单列表
 */
export const getHotPlayList = async () => {
  try {
    const res = await musicApi.get('/playlist/hot');
    return res.data.tags.slice(0, 10).map(tag => ({
      id: tag.id,
      name: tag.name,
      cover: tag.coverImgUrl + '?param=60y60'
    }));
  } catch (error) {
    console.error('获取热门歌单失败：', error);
    return [];
  }
};