<template>
  <div class="guide-page" ref="guidePageRef">
    <!-- 🔴 光标移到最外层，脱离主内容，避免被位移影响 -->
    <div class="custom-cursor" ref="cursorRef"></div>

    <!-- 左侧全屏箭头 -->
    <div class="pull-arrow" ref="arrowRef" @mouseenter="pullPageLeft" @mouseleave="handleArrowLeave">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19L8 12L15 5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- 左侧照片容器 -->
    <div class="hidden-photo" ref="photoRef" @click="goToGrowth" @mouseenter="handlePhotoEnter" @mouseleave="handlePhotoLeave">
      <img src="/src/assets/avatar/王小染街头.jpg" alt="王小染形象" class="growth-photo">
      <div class="photo-mask">点击查看成长纪事</div>
    </div>

    <!-- 主内容容器 -->
    <div class="main-content" ref="mainContentRef">
      <div class="bg-avatar"></div>
      <div class="water-wave"></div>
      <div class="content">
        <h1 class="name">舟舟小筑🌴</h1>
        <p class="slogan dynamic-slogan">勿cue   带薪发呆💤  摸鱼国一  干活自动隐身🫠</p>
        <div class="nav-buttons">
          <router-link to="/about" class="btn">关于我</router-link>
          <router-link to="/works" class="btn">我的作品</router-link>
          <a href="mailto:你的邮箱@xxx.com" class="btn contact-btn">联系我</a>
        </div>
      </div>
      <div class="ripple-container" ref="rippleContainerRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 核心Ref
const guidePageRef = ref(null)
const rippleContainerRef = ref(null)
const cursorRef = ref(null)
const arrowRef = ref(null)
const mainContentRef = ref(null)
const photoRef = ref(null)

// 状态标记：是否hover在照片上
const isHoverPhoto = ref(false)

// 涟漪/光标控制变量
let isMounted = false
let lastRippleTime = 0
let moveHandler = null
let cursorMoveHandler = null

// 主内容右滑（腾出左侧空间）
const pullPageLeft = () => {
  if (mainContentRef.value) {
    mainContentRef.value.style.transform = 'translateX(280px)'
    mainContentRef.value.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
}

// 页面复位：仅当未hover照片时执行
const resetPage = () => {
  if (!isHoverPhoto.value && mainContentRef.value) {
    mainContentRef.value.style.transform = 'translateX(0)'
    mainContentRef.value.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
}

// 箭头离开事件
const handleArrowLeave = () => {
  resetPage()
}

// 照片进入：标记hover状态，阻止复位
const handlePhotoEnter = () => {
  isHoverPhoto.value = true
}

// 照片离开：取消标记并判断是否复位
const handlePhotoLeave = () => {
  isHoverPhoto.value = false
  resetPage()
}

// 跳转成长轨迹页面
const goToGrowth = () => {
  router.push('/growth')
}

// 光标hover按钮放大逻辑（事件委托）
const handleBtnHover = (e) => {
  if (!cursorRef.value) return
  if (e.target.classList.contains('btn')) {
    cursorRef.value.classList.add('hover')
  } else {
    cursorRef.value.classList.remove('hover')
  }
}

// 涟漪生成逻辑
const handleMouseMove = (e) => {
  if (!isMounted || !guidePageRef.value || !rippleContainerRef.value) return

  // 频率限制：60ms生成一个涟漪
  const now = Date.now()
  if (now - lastRippleTime < 60) return
  lastRippleTime = now

  const rect = guidePageRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // 创建涟漪元素
  const ripple = document.createElement('div')
  ripple.classList.add('ripple')
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.style.width = '0px'
  ripple.style.height = '0px'
  ripple.style.opacity = '1'
  ripple.style.transition = 'none'

  rippleContainerRef.value.appendChild(ripple)
  void ripple.offsetWidth // 强制重绘

  // 随机涟漪参数
  const size = Math.random() * 80 + 80
  const opacity = Math.random() * 0.2 + 0.2
  const duration = Math.random() * 1 + 1.5

  // 触发涟漪动画
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.opacity = `${opacity}`
  ripple.style.transition = `all ${duration}s cubic-bezier(0.2, 0, 0.2, 1)`
  ripple.style.opacity = '0'

  // 动画结束后移除
  setTimeout(() => {
    ripple.remove()
  }, duration * 1000)
}

// 🔴 光标零延迟跟随：直接基于鼠标绝对坐标，不依赖任何父容器
const handleCursorMove = (e) => {
  if (!cursorRef.value) return
  // 1. 初始透明→显示，无渲染延迟
  cursorRef.value.style.opacity = '1'
  // 2. 直接用屏幕绝对坐标，脱离主内容位移影响
  cursorRef.value.style.left = `${e.clientX}px`
  cursorRef.value.style.top = `${e.clientY}px`
}

// 挂载时绑定事件
onMounted(() => {
  isMounted = true
  if (guidePageRef.value) {
    // 绑定涟漪事件
    moveHandler = handleMouseMove
    guidePageRef.value.addEventListener('mousemove', moveHandler)

    // 绑定按钮hover事件委托
    guidePageRef.value.addEventListener('mouseover', handleBtnHover)
    guidePageRef.value.addEventListener('mouseout', handleBtnHover)
  }

  // 🔴 光标事件绑定到document，最高优先级，无延迟
  cursorMoveHandler = handleCursorMove
  document.addEventListener('mousemove', cursorMoveHandler, { passive: true }) // 被动监听，提升性能

  // 初始透明，避免显示问题
  if (cursorRef.value) {
    cursorRef.value.style.opacity = '0'
  }
})

// 卸载时清理事件
onUnmounted(() => {
  if (guidePageRef.value && moveHandler) {
    guidePageRef.value.removeEventListener('mousemove', moveHandler)
    guidePageRef.value.removeEventListener('mouseover', handleBtnHover)
    guidePageRef.value.removeEventListener('mouseout', handleBtnHover)
  }
  // 清理光标事件
  if (cursorMoveHandler) {
    document.removeEventListener('mousemove', cursorMoveHandler)
  }
})
</script>

<style>
/* 全局样式 - 仅定义一次，避免覆盖 */
.guide-page {
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle, rgba(113, 229, 204, 0.879) 0%, rgba(167, 159, 162, 0) 97%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: none;
}

/* 左侧全屏箭头（核心：删除重复定义，保留全屏样式） */
.pull-arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 8px 8px 0;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  cursor: none;
  z-index: 999;
  transition: all 0.3s ease;
  /* 🔴 允许鼠标事件穿透箭头，避免光标被遮挡 */
  pointer-events: auto;
}

.pull-arrow:hover {
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 126, 179, 0.6);
}

/* 左侧照片容器（初始隐藏，hover箭头滑入） */
.hidden-photo {
  position: absolute;
  top: 0;
  left: -280px;
  bottom: 0;
  width: 280px;
  border-radius: 0 12px 12px 0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 998;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

/* 箭头hover/照片hover时显示 */
.pull-arrow:hover + .hidden-photo,
.hidden-photo:hover {
  left: 0;
  opacity: 1;
  pointer-events: auto;
}

/* 照片样式 */
.growth-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.hidden-photo:hover .growth-photo {
  transform: scale(1.05);
}

/* 照片遮罩 */
.photo-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: #fff;
  text-align: center;
  font-size: 14px;
  backdrop-filter: blur(2px);
}

/* 主内容容器（全屏+右滑动画） */
.main-content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 背景照片（全屏透明打底） */
.bg-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/src/assets/avatar/王小染自拍（居家）.jpg") center 20% / cover no-repeat;
  opacity: 0.34;
  z-index: 0;
  filter: blur(1px);
}

/* 动态水波 */
.water-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
  animation: wave 25s linear infinite;
  z-index: 1;
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
  z-index: 2;
}

/* 涟漪样式 */
.ripple {
  position: absolute;
  border-radius: 50%;
  background: transparent;
  box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.9), 
              0 0 0 1px rgba(255, 255, 255, 0.2);
  filter: blur(0.5px);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

/* 🔴 自定义光标（独立层级+零延迟） */
.custom-cursor {
  position: fixed; /* 基于视口定位，完全脱离主内容 */
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #ff7eb3 0%, #4cc985 100%);
  filter: blur(0.5px) drop-shadow(0 0 4px rgba(255, 126, 179, 0.5));
  pointer-events: none; /* 禁止光标拦截鼠标事件 */
  z-index: 99999; /* 最高层级，不被任何元素覆盖 */
  transition: all 0.05s ease; /* 极致短过渡，零延迟响应 */
  opacity: 0; /* 初始透明，替代display:none */
  will-change: left, top, width, height; /* 浏览器提前优化 */
  transform: translate(-50%, -50%); /* 仅用于居中光标，不影响定位 */
  animation: breathe 2s infinite ease-in-out;
}

/* 光标呼吸动画 */
@keyframes breathe {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.8); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

/* 光标hover按钮放大 */
.custom-cursor.hover {
  width: 24px;
  height: 24px;
  filter: blur(1px) drop-shadow(0 0 6px rgba(76, 201, 133, 0.8));
}
</style>

<style scoped>
/* 核心内容样式 */
.content {
  text-align: center;
  color: #fff;
  z-index: 1;
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
  background-color: rgba(183, 14, 14, 0.511);
  color: #fff !important;
  border-radius: 30px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 126, 179, 0.2);
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 3;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  cursor: none;
}

.btn:hover {
  background-color: rgba(255, 126, 179, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(152, 42, 42, 0.337);
}

.contact-btn {
  background-color: rgba(2, 125, 142, 0.511);
  border-color: rgba(2, 125, 142, 0.2);
}

.contact-btn:hover {
  background-color: rgba(255, 126, 179, 0.25);
}

/* 渐变文字动画 */
.dynamic-slogan {
  background: linear-gradient(90deg, #0e0d0d, #ffc2e2, #090909);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  color: transparent;
  animation: gradientFlow 6s infinite linear;
}

@keyframes gradientFlow {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .name { font-size: 32px; }
  .slogan { font-size: 16px; }
  .btn { padding: 10px 25px; font-size: 14px; }
  .guide-page { cursor: default; }
  .custom-cursor { display: none; }
  .pull-arrow, .hidden-photo { display: none; }
}
</style>