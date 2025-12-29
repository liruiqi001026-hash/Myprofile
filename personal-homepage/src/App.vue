<script setup>
import HelloWorld from './components/HelloWorld.vue'
import MusicPlayer from './components/MusicPlayer.vue';
</script>

<template>
  <router-view></router-view>
  <!-- 全局音乐播放器（常驻） -->
  <MusicPlayer />
</template>

<style>
/* 全局样式，可自定义 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Microsoft YaHei", sans-serif;
  color: #333;
}
a {
  color: #42b983;
  text-decoration: none;
}
</style>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Microsoft Yahei", sans-serif;
  background: #f5f5f5;
}
</style>
