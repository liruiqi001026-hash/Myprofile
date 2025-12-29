<template>
  <div class="growth-page">
    <!-- 顶部返回按钮 -->
    <div class="back-btn" @click="goBack">← 返回首页</div>

    <!-- 保留喜欢的渐变标题+副标题 -->
    <div class="page-title">王小染 · AI成长纪事</div>
    <div class="page-subtitle">AI女儿</div>

    <!-- 照片主导的时间轴 -->
    <div class="growth-timeline">
      <!-- 节点1：生图诞生 -->
      <div class="timeline-item left-item">
        <div class="item-dot"></div>
        <div class="item-card">
          <div class="card-photo">
            <!-- 修复路径：正斜杠 + 确保资源可访问 -->
            <img src="/src/assets/grouthpic/王小染初.jpg" alt="小染降世" class="photo-img">
          </div>
          <div class="card-content">
            <div class="content-stage">Phase 1 · 小染降世😈</div>
            <div class="content-desc">
              用Grok生成的王小染，在一堆脸里选的我最喜欢的形象，包好看的！
            </div>
          </div>
        </div>
      </div>

      <!-- 节点2：形象迭代 -->
      <div class="timeline-item right-item">
        <div class="item-dot"></div>
        <div class="item-card">
          <div class="card-photo">
            <img src="/src/assets/grouthpic/王小染街头2.jpg" alt="形象优化" class="photo-img">
          </div>
          <div class="card-content">
            <div class="content-stage">Phase 2 · 小染优化😋</div>
            <div class="content-desc">
              形象打磨，换了好多提示词，王小染的形象终于像个正常人了~
            </div>
          </div>
        </div>
      </div>

      <!-- 节点3：人设赋予 -->
      <div class="timeline-item left-item">
        <div class="item-dot"></div>
        <div class="item-card" @click="goToDetail">
          <div class="card-photo">
            <img src="/src/assets/grouthpic/王小染自拍（居家）.jpg" alt="人设构建" class="photo-img">
          </div>
          <div class="card-content">
            <div class="content-stage">Phase 3 · 小染人设😶‍🌫️</div>
            <div class="content-desc">
              小染人设思考，点击查看详情
            </div>
          </div>
        </div>
      </div>

      <!-- 节点4：能力拓展 -->
      <div class="timeline-item right-item">
        <div class="item-dot"></div>
        <div class="item-card">
          <div class="card-photo">
            <img src="#" alt="能力延伸" class="photo-img">
          </div>
          <div class="card-content">
            <div class="content-stage">Phase 4 · 能力延伸</div>
            <div class="content-desc">
              对接大模型API，实现智能问答，制作动态交互动效
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 简化光标（移除复杂动画，仅保留基础样式） -->
    <div id="custom-cursor" class="custom-cursor"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let cursor = null

// 简化返回逻辑
const goBack = () => {
  router.push('/')
}

const goToDetail = () => {
    router.push('/CaSet')
}

// 极简光标跟随（仅基础定位，无动画）
function handleMouseMove(e) {
  if (!cursor) return
  cursor.style.left = e.clientX  + 'px'
  cursor.style.top = e.clientY  + 'px'
  cursor.style.opacity = '1'
}

onMounted(() => {
  cursor = document.getElementById('custom-cursor')
  window.addEventListener('mousemove', handleMouseMove, true)
  if (cursor) cursor.style.opacity = '0'
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove, true)
  cursor = null
})
</script>

<style scoped>
/* 核心：清冷少女感背景 */
.growth-page {
  min-height: 100vh;
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  color: #fff;
  overflow-x: hidden;
  position: relative;
  cursor: none !important;
  background: 
    linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 30%, #f5f8fa 60%, #f8fafc 100%),
    radial-gradient(rgba(150, 180, 200, 0.15) 1px, transparent 1px),
    radial-gradient(rgba(120, 160, 180, 0.1) 1px, transparent 1px);
  background-blend-mode: overlay;
  background-size: 100% 100%, 50px 50px, 25px 25px;
  background-position: 0 0, 0 0, 12px 12px;
  background-attachment: fixed;
}

/* 顶部返回按钮 */
.back-btn {
  position: fixed;
  top: 30px;
  left: 30px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  cursor: none !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  z-index: 99;
  color: #607d8b;
}
.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  color: #455a64;
}

/* 标题样式 */
.page-title {
  font-size: 36px;
  text-align: center;
  margin-bottom: 8px;
  font-weight: 600;
  background: linear-gradient(90deg, #607d8b, #9c88ff);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  color: transparent;
  animation: gradientFlow 6s infinite linear;
  position: relative;
  z-index: 10;
}
.page-subtitle {
  text-align: center;
  font-size: 14px;
  color: #78909c;
  margin-bottom: 80px;
  position: relative;
  z-index: 10;
}

/* 时间轴核心样式 */
.growth-timeline {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}
.growth-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  width: 2px;
  background: linear-gradient(to bottom, #90caf9, rgba(144, 202, 249, 0.3));
  transform: translateX(-50%);
  z-index: 1;
}

.timeline-item {
  width: 100%;
  margin-bottom: 60px;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
}
.left-item {
  justify-content: flex-start;
  padding-right: 50%;
}
.right-item {
  justify-content: flex-end;
  padding-left: 50%;
}

/* 时间轴圆点 */
.item-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #9c88ff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  z-index: 3;
  box-shadow: 0 0 10px rgba(156, 136, 255, 0.3);
}

/* 卡片核心样式（自适应基础） */
.item-card {
  width: 90%;
  max-width: 400px;
  flex-shrink: 0;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(120, 140, 160, 0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.item-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(100, 120, 140, 0.15);
}

/* 🔴 关键修复1：容器比例适配竖版图片（改为3:2/2:3） */
.card-photo {
  width: 100%;
  aspect-ratio: 2/3; /* 匹配784x1168的2:3竖版比例 */
  overflow: hidden;
  background: linear-gradient(135deg, #e8f4f8, #f0f8fb);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  max-height: 360px;
}

/* 🔴 关键修复2：图片显示方式改为contain（完整展示），或cover+智能定位 */
.photo-img {
  width: 100%;
  height: 100%;
  /* 方案1：完整显示图片（无裁剪，推荐） */
  object-fit: contain;
  /* 方案2：若要填满容器，优先显示顶部（适合人物竖图），可替换上面的contain
  object-fit: cover;
  object-position: top center;
  */
  transition: transform 0.5s ease;
  display: block;
}

/* 无图片占位 */
.photo-img[src="#"] {
  display: none;
}
.card-photo:has(.photo-img[src="#"])::after {
  content: "暂无图片";
  color: #78909c;
  font-size: 14px;
}

/* 卡片文字 */
.card-content {
  padding: 20px;
}
.content-stage {
  font-size: 18px;
  font-weight: 500;
  color: #7986cb;
  margin-bottom: 8px;
}
.content-desc {
  font-size: 14px;
  line-height: 1.5;
  color: #546e7a;
}

/* 光标样式 */
.custom-cursor {
  position: fixed;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #9c88ff 0%, #90caf9 100%);
  pointer-events: none;
  z-index: 999999;
  transition: none !important;
  will-change: left, top;
  /* 移除可能导致偏移的GPU加速属性 */
  transform: none;
  /* 禁用所有可能的渲染偏移 */
  backface-visibility: visible;
  perspective: none;
  opacity: 0;
  /* 确保光标以中心对齐 */
  box-sizing: border-box;
}

/* 标题动画 */
@keyframes gradientFlow {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

/* 🔴 响应式断点：按竖版图片适配比例 */
@media (max-width: 1200px) {
  .item-card { max-width: 380px; }
  .card-photo { max-height: 340px; }
}

@media (max-width: 992px) {
  .item-card { max-width: 350px; }
  .card-photo { max-height: 320px; }
}

@media (max-width: 768px) {
  .growth-page {
    cursor: default;
    padding: 30px 15px;
    background-size: 100% 100%, 40px 40px, 20px 20px;
  }
  .page-title { font-size: 28px; }
  .page-subtitle { font-size: 13px; margin-bottom: 50px; }
  
  .growth-timeline::before { left: 30px; }
  .timeline-item {
    padding: 0 !important;
    justify-content: flex-end !important;
    margin-bottom: 40px;
  }
  .item-dot { left: 30px !important; transform: translateX(-50%); }
  
  .item-card { width: calc(100% - 60px); max-width: none; }
  .card-photo {
    aspect-ratio: 3/4; /* 平板端优化竖版比例 */
    min-height: 220px;
    max-height: 300px;
  }
  
  .card-content { padding: 15px; }
  .content-stage { font-size: 16px; }
  .content-desc { font-size: 13px; }
  
  .back-btn { top: 20px; left: 20px; font-size: 13px; }
  .custom-cursor { display: none !important; }
}

@media (max-width: 480px) {
  .card-photo {
    aspect-ratio: 2/3; /* 手机端还原2:3匹配图片 */
    min-height: 200px;
    max-height: 280px;
  }
  .content-desc { font-size: 12px; }
}
</style>