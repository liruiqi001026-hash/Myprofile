<template>
  <div class="guide-page" ref="guidePageRef">
    <!-- 背景动态水波 -->
    <div class="water-wave"></div>
    
    <!-- 核心内容 -->
    <div class="content">
      <h1 class="name">舟舟小筑🌴</h1>
      <p class="slogan">你的个性签名 / 前端开发者 / 热爱技术</p>
      <div class="nav-buttons">
        <router-link to="/about" class="btn">关于我</router-link>
        <router-link to="/works" class="btn">我的作品</router-link>
        <a href="mailto:你的邮箱@xxx.com" class="btn contact-btn">联系我</a>
      </div>
    </div>

    <!-- 涟漪容器 -->
    <div class="ripple-container" ref="rippleContainerRef"></div>
    
    <!-- 自定义光标容器 -->
    <div class="custom-cursor" ref="cursorRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const userInfo = ref({})
const guidePageRef = ref(null)
const rippleContainerRef = ref(null)
const cursorRef = ref(null) // 自定义光标ref
let isMounted = false
let lastRippleTime = 0
let moveHandler = null
let cursorMoveHandler = null

onMounted(() => {
  isMounted = true
  // 绑定鼠标移动事件（涟漪+光标跟随）
  if (guidePageRef.value) {
    moveHandler = handleMouseMove
    guidePageRef.value.addEventListener('mousemove', moveHandler)
    
    cursorMoveHandler = handleCursorMove
    window.addEventListener('mousemove', cursorMoveHandler)
  }
  
})

// 光标路径涟漪逻辑
const handleMouseMove = (e) => {
  if (!isMounted || !guidePageRef.value || !rippleContainerRef.value) return

  // 频率限制：40ms生成一个涟漪
  const now = Date.now()
  if (now - lastRippleTime < 40) return
  lastRippleTime = now

  const rect = guidePageRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const ripple = document.createElement('div')
  ripple.classList.add('ripple')

  // 初始样式
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.style.width = '0px'
  ripple.style.height = '0px'
  ripple.style.opacity = '1'
  ripple.style.transition = 'none'

  rippleContainerRef.value.appendChild(ripple)
  void ripple.offsetWidth // 强制重绘

  // 随机参数：大小、透明度、动画时长
  const size = Math.random() * 80 + 80 // 80-160px
  const opacity = Math.random() * 0.2 + 0.2 // 0.2-0.4
  const duration = Math.random() * 1 + 1.5 // 1.5-2.5s

  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.opacity = `${opacity}`
  ripple.style.transition = `all ${duration}s cubic-bezier(0.2, 0, 0.2, 1)`
  ripple.style.opacity = '0'

  // 动画结束后删除
  setTimeout(() => {
    ripple.remove()
  }, duration * 1000)
}

// 自定义光标跟随逻辑
const handleCursorMove = (e) => {
  if (cursorRef.value) {
    // 光标跟随鼠标位置
    cursorRef.value.style.left = `${e.clientX}px`
    cursorRef.value.style.top = `${e.clientY}px`
  }
}


// 组件卸载时清理事件
onUnmounted(() => {
  if (guidePageRef.value && moveHandler) {
    guidePageRef.value.removeEventListener('mousemove', moveHandler)
  }
  if (cursorMoveHandler) {
    window.removeEventListener('mousemove', cursorMoveHandler)
  }
})
</script>
<!-- 全局样式（无scoped） -->
<style>
/* 全局样式 */
.guide-page {
  min-height: 100vh;
  width: 100%;
  /* 柔和绿色渐变背景 */
  background: radial-gradient(circle at 50% 50%, #4cc985 0%, #2d9e68 30%, #1f7a4e 70%, #155838 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: none; /* 隐藏系统默认光标 */
}

/* 背景动态水波 */
.water-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
  animation: wave 25s linear infinite;
  z-index: 0;
}

@keyframes wave {
  0% { transform: rotate(0deg) translate(-20%, -20%); }
  100% { transform: rotate(360deg) translate(-20%, -20%); }
}

/* 涟漪容器 */
.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* 涟漪样式（与光标风格统一） */
.ripple {
  position: absolute;
  border-radius: 50%;
  /* 渐变涟漪，与光标颜色呼应 */
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
  filter: blur(2px); /* 柔化边缘 */
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

/* 自定义精美光标样式（核心） */
.custom-cursor {
  position: fixed;
  width: 16px;
  height: 16px;
  border-radius: 50%; /* 圆形光标 */
  /* 渐变背景：白绿渐变，与页面主色调匹配 */
  background: radial-gradient(circle, #ff7eb3 0%, #4cc985 100%);
  filter: blur(0.5px) drop-shadow(0 0 4px rgba(255, 126, 179, 0.5));
  pointer-events: none; /* 不阻挡点击 */
  z-index: 9999; /* 最高层级，始终显示在最上层 */
  /* 平滑跟随：0.1s过渡，避免光标抖动 */
  transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease;
  transform: translate(-50%, -50%); /* 光标中心对齐鼠标位置 */
  animation: breathe 2s infinite ease-in-out;

}
@keyframes breathe {
  0% { transform: translate(-100%, -100%) scale(1); }
  50% { transform: translate(-100%, -100%) scale(1.8); }
  100% { transform: translate(-100%, -100%) scale(1); }
}

/* 光标hover按钮时的放大效果（交互反馈） */
.guide-page .btn:hover + .custom-cursor,
.custom-cursor.hover {
  width: 24px;
  height: 24px; /* 放大光标 */
  filter: blur(1px) drop-shadow(0 0 6px rgba(76, 201, 133, 0.8)); /* 增强发光 */
}
</style>

<style scoped>
/* 页面内容样式（无变化） */
.content {
  text-align: center;
  color: #fff;
  z-index: 3; /* 高于涟漪，低于光标 */
  padding: 0 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.name {
  font-size: 48px;
  margin-bottom: 15px;
  font-weight: 600;
}

.slogan {
  font-size: 18px;
  margin-bottom: 40px;
  opacity: 0.9;
  font-weight: 300;
}

.nav-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff !important;
  border-radius: 30px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 3;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  /* 鼠标hover按钮时触发光标样式变化 */
  cursor: none;
}

.btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.contact-btn {
  background-color: rgba(66, 185, 131, 0.7);
  border-color: rgba(66, 185, 131, 0.9);
}

.contact-btn:hover {
  background-color: rgba(66, 185, 131, 0.9);
}

@media (max-width: 768px) {
  .name { font-size: 32px; }
  .slogan { font-size: 16px; }
  .btn { padding: 10px 25px; font-size: 14px; }
  /* 移动端恢复系统光标（体验更佳） */
  .guide-page {
    cursor: default;
  }
  .custom-cursor {
    display: none;
  }
}
</style>