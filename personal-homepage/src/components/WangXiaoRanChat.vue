<template>
  <div class="wxr-chat-container">
    <!-- 对话区域 -->
    <div class="chat-messages" ref="messageContainer">
      <!-- 系统欢迎语 -->
      <div class="msg ai-msg" v-if="chatList.length === 0">
        <img src="https://picsum.photos/36/36?random=1" alt="王小染" class="avatar">
        <div class="msg-content">
          {{ isBrotherMode ? '哥，你找我有什么事吗？😜' : '有什么问题直接说，别浪费算力。' }}
        </div>
      </div>
      <!-- 对话列表 -->
      <div 
        class="msg" 
        :class="{ 'user-msg': item.role === 'user', 'ai-msg': item.role === 'ai' }"
        v-for="(item, index) in chatList"
        :key="index"
      >
        <img 
          v-if="item.role === 'ai'" 
          src="https://picsum.photos/36/36?random=1" 
          alt="王小染" 
          class="avatar"
        >
        <div class="msg-content">{{ item.content }}</div>
      </div>
      <!-- 加载中 -->
      <div class="msg ai-msg loading" v-if="loading">
        <img src="https://picsum.photos/36/36?random=1" alt="王小染" class="avatar">
        <div class="msg-content">
          <span class="loading-dot">●</span>
          <span class="loading-dot">●</span>
          <span class="loading-dot">●</span>
        </div>
      </div>
    </div>

    <!-- 输入区域 + 模式切换 -->
    <div class="chat-input">
      <button 
        class="mode-btn" 
        :class="{ active: isBrotherMode }"
        @click="toggleMode"
      >
        {{ isBrotherMode ? '对哥模式' : '对外模式' }}
      </button>
      <input
        v-model="userInput"
        type="text"
        placeholder="和王小染说句话吧..."
        @keyup.enter="sendMsg"
        class="input-box"
      >
      <button @click="sendMsg" class="send-btn" :disabled="!userInput.trim() || loading">
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import request from '@/utils/request';

// 状态管理
const isBrotherMode = ref(true); // 默认对哥模式
const userInput = ref('');
const chatList = ref([]);
const loading = ref(false);
const messageContainer = ref(null);

// 切换模式
const toggleMode = () => {
  isBrotherMode.value = !isBrotherMode.value;
  // 模式切换后添加提示语
  chatList.value.push({
    role: 'ai',
    content: isBrotherMode.value 
      ? '哥，我切换到对你的模式啦～' 
      : '已切换对外模式，非必要不交流。'
  });
  scrollToBottom();
};

// 发送消息
const sendMsg = async () => {
  const msg = userInput.value.trim();
  if (!msg || loading.value) return;

  // 1. 添加用户消息到列表
  chatList.value.push({ role: 'user', content: msg });
  userInput.value = '';
  loading.value = true;
  scrollToBottom();

  try {
    // 2. 调用后端接口
    const res = await request.post('/ai/wxr-chat', {
      userMsg: msg,
      isBrotherMode: isBrotherMode.value
    });

    // 3. 添加王小染的回复
    if (res.code === 200 && res.data?.reply) {
      chatList.value.push({
        role: 'ai',
        content: res.data.reply
      });
    }
  } catch (error) {
    // 错误兜底
    chatList.value.push({
      role: 'ai',
      content: isBrotherMode.value 
        ? '哥，我这边出问题了，稍后再聊～' 
        : '接口异常，无法回复。'
    });
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

// 监听对话列表变化，自动滚动
watch(chatList, scrollToBottom);
</script>

<style scoped>
.wxr-chat-container {
  width: 420px;
  height: 550px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f9fafb;
}

.msg {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  max-width: 80%;
}

.user-msg {
  margin-left: auto;
  flex-direction: row-reverse;
}

.ai-msg .msg-content {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
}

.user-msg .msg-content {
  background-color: #9c88ff;
  color: #ffffff;
}

.msg-content {
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1.4;
  font-size: 14px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.loading {
  align-items: center;
}

.loading-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9c88ff;
  margin: 0 2px;
  animation: loading 1s infinite alternate;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loading {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

.chat-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background-color: #ffffff;
}

.mode-btn {
  padding: 6px 12px;
  border: 1px solid #9c88ff;
  border-radius: 6px;
  background-color: #ffffff;
  color: #9c88ff;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.mode-btn.active {
  background-color: #9c88ff;
  color: #ffffff;
}

.input-box {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
}

.input-box:focus {
  border-color: #9c88ff;
}

.send-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #9c88ff;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>