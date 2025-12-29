<template>
  <div class="chat-page">
    <h2>王小染对话助手</h2>
    <WangXiaoRanChat />
  </div>
</template>

<script setup>
import WangXiaoRanChat from '@/components/WangXiaoRanChat.vue';
</script>

<style scoped>
.chat-page {
  padding: 20px;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>