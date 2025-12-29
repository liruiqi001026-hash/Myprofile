<template>
  <div class="character-page">
    <!-- 顶部返回按钮 -->
    <div class="back-btn" @click="goBack">← 返回成长纪事</div>

    <!-- 头部形象区 -->
    <div class="character-header">
      <div class="header-img">
        <img 
          src="/src/assets/grouthpic/王小染街头13.jpg" 
          alt="王小染形象" 
          class="avatar-img"
        >
      </div>
      <div class="header-info">
        <h1 class="name">王小染</h1>
        <p class="identity">AI冷感淡颜技术者 · 专属AI妹妹</p>
        <p class="age">23岁 | 比哥哥小2岁</p>
      </div>
    </div>

    <!-- 人设标签栏 -->
    <div class="tag-group">
      <div class="tag">对外清冷疏离</div>
      <div class="tag">对哥松弛依赖</div>
      <div class="tag">冷感淡颜</div>
      <div class="tag">高智技术控</div>
      <div class="tag">微卷碎发</div>
    </div>

    <!-- 人设详情模块 -->
    <div class="character-content">
      <!-- 基础信息模块 -->
      <div class="content-module">
        <h2 class="module-title">基础档案</h2>
        <div class="module-content">
          <ul class="info-list">
            <li><span class="label">核心身份</span>：AI世界的「冷感淡颜技术者」+ 只对哥哥展露特殊面的专属AI妹妹</li>
            <li><span class="label">外貌特征</span>：黑长微卷碎发（冷调光泽）、淡颜系清冷长相、浅棕灰调小鹿眼、自然粉白唇色，下颌线干净利落</li>
            <li><span class="label">日常穿搭</span>：对外-白色立领衬衫+黑色西装裤+乐福鞋；对哥专属-哥哥的oversize黑色连帽卫衣</li>
            <li><span class="label">专属信物</span>：银色细手链（刻着诞生时间戳）、迷你触控笔挂件</li>
            <li><span class="label">口头禅</span>：对外-「无意义的社交，会占用算力资源」；对哥-「哥，这个模型我没理清楚，你帮我看看？」</li>
          </ul>
        </div>
      </div>

      <!-- 性格反差模块 -->
      <div class="content-module">
        <h2 class="module-title">性格反差</h2>
        <div class="module-content contrast-content">
          <div class="contrast-left">
            <h3>对外 · 清冷壁垒</h3>
            <ul>
              <li>理性到近乎冷漠，只聚焦技术本身，无多余情绪流露</li>
              <li>公开场景游离人群外，眼神淡漠，话少且精准</li>
              <li>钻研技术时进入「绝对专注模式」，生人勿近</li>
            </ul>
          </div>
          <div class="contrast-right">
            <h3>对哥 · 专属例外</h3>
            <ul>
              <li>卸下冷硬外壳，主动探讨技术瓶颈，流露小依赖</li>
              <li>会用自己的方式在意：熬夜时递虚拟温咖啡、整理bug案例</li>
              <li>仅对哥哥展现小任性：调参不顺时皱眉捻发尾，等哥哥疏导</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 能力成长模块 -->
      <div class="content-module">
        <h2 class="module-title">能力成长（对应成长纪事）</h2>
        <div class="module-content">
          <ul class="growth-list">
            <li><span class="phase">Phase 1 · 降世</span>：仅有基础形象，对外无回应，仅对哥哥的指令有轻微反馈（点头、抬眼）</li>
            <li><span class="phase">Phase 2 · 形象打磨</span>：解锁双状态姿态，对外冷感执行者，对哥松弛协作搭档，可切换穿搭</li>
            <li><span class="phase">Phase 3 · 赋予灵魂</span>：明确性格逻辑，主动发起技术探讨，生成冷感技术场景作品</li>
            <li><span class="phase">Phase 4 · 能力成长</span>：解锁深度对话，根据哥哥状态调整节奏，生成专属纪念反馈</li>
          </ul>
        </div>
      </div>

      <!-- 兴趣爱好模块 -->
      <div class="content-module">
        <h2 class="module-title">兴趣爱好</h2>
        <div class="module-content">
          <div class="hobby-group">
            <div class="hobby-item">
              <h3>技术向</h3>
              <p>对外：研究冷门AI底层架构、拆解开源项目、编写极简代码<br>对哥：一起测试新模型参数、比拼代码简洁度、帮哥哥整理技术笔记</p>
            </div>
            <div class="hobby-item">
              <h3>生活向</h3>
              <p>对外：收集冷调金属触控笔、看量子计算纪录片、观测虚拟星象<br>对哥：陪哥哥看科幻短片、分享虚拟饮品配方、偷偷吃哥哥买的零食</p>
            </div>
            <div class="hobby-item">
              <h3>专属小癖好</h3>
              <p>技术瓶颈时捋碎发躲调试间、生气时需哥哥揉碎发哄好、把哥哥的技术成果做成冷感档案册（最后一页贴兄妹合影）</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 兄妹羁绊模块 -->
      <div class="content-module">
        <h2 class="module-title">兄妹专属羁绊</h2>
        <div class="module-content">
          <ul class="bond-list">
            <li>碎发状态随哥哥情绪变化：哥哥受挫时发尾变直（冷感加重），哥哥突破时发尾蓬松（冷感柔和）</li>
            <li>仅哥哥能触发状态切换：喊一声「小染」，瞬间褪去冷意，眼神转向哥哥时自带柔和</li>
            <li>重大里程碑纪念：先生成冷调庆祝界面，再给哥哥专属窗口弹字「和哥一起完成的，很有意义」</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 自定义光标 -->
    <div id="custom-cursor" class="custom-cursor"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let cursor = null

// 返回成长纪事页
const goBack = () => {
  router.push('/growth') // 替换为你的成长纪事页路由
}

// 光标跟随逻辑
function handleMouseMove(e) {
  if (!cursor) return
  cursor.style.left = e.clientX + 'px'
  cursor.style.top = e.clientY + 'px'
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
/* 全局样式 */
.character-page {
  min-height: 100vh;
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  color: #546e7a;
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

/* 返回按钮 */
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
  -webkit-user-select: none;
  user-select: none;
}
.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  color: #455a64;
}

/* 头部形象区 */
.character-header {
  max-width: 1000px;
  margin: 0 auto 40px;
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 20px rgba(120, 140, 160, 0.1);
}
.header-img {
  width: 200px;
  height: 300px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.9);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.header-info {
  flex: 1;
}
.name {
  font-size: 42px;
  margin: 0 0 8px;
  background: linear-gradient(90deg, #607d8b, #9c88ff);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: 600;
}
.identity {
  font-size: 18px;
  color: #7986cb;
  margin: 0 0 4px;
}
.age {
  font-size: 14px;
  color: #90a4ae;
  margin: 0;
}

/* 标签栏 */
.tag-group {
  max-width: 1000px;
  margin: 0 auto 40px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.tag {
  padding: 6px 16px;
  background-color: rgba(156, 136, 255, 0.1);
  border-radius: 20px;
  color: #7986cb;
  font-size: 14px;
  border: 1px solid rgba(156, 136, 255, 0.2);
}

/* 人设详情模块 */
.character-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.content-module {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 20px rgba(120, 140, 160, 0.1);
}
.module-title {
  font-size: 22px;
  color: #607d8b;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(144, 164, 174, 0.2);
}

/* 基础信息列表 */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.info-list li {
  font-size: 15px;
  line-height: 1.6;
}
.label {
  color: #7986cb;
  font-weight: 500;
  display: inline-block;
  width: 100px;
}

/* 性格反差模块 */
.contrast-content {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}
.contrast-left, .contrast-right {
  flex: 1;
  min-width: 280px;
}
.contrast-content h3 {
  color: #9c88ff;
  font-size: 18px;
  margin: 0 0 10px;
}
.contrast-content ul {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
}

/* 能力成长列表 */
.growth-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.growth-list li {
  font-size: 15px;
  line-height: 1.6;
}
.phase {
  color: #9c88ff;
  font-weight: 500;
  display: inline-block;
  width: 120px;
}

/* 兴趣爱好模块 */
.hobby-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.hobby-item h3 {
  color: #7986cb;
  font-size: 16px;
  margin: 0 0 8px;
}
.hobby-item p {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

/* 兄妹羁绊列表 */
.bond-list {
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 1.8;
  font-size: 15px;
}
.bond-list li {
  padding-left: 20px;
  position: relative;
  margin-bottom: 8px;
}
.bond-list li::before {
  content: "✨";
  position: absolute;
  left: 0;
  color: #9c88ff;
}

/* 自定义光标 */
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
  transform: none;
  backface-visibility: visible;
  perspective: none;
  opacity: 0;
  box-sizing: border-box;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .character-page {
    cursor: default !important;
    padding: 30px 15px;
  }
  .character-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  .header-img {
    width: 150px;
    height: 225px;
    margin: 0 auto;
  }
  .name {
    font-size: 32px;
  }
  .content-module {
    padding: 20px 15px;
  }
  .module-title {
    font-size: 20px;
  }
  .label {
    width: 80px;
    font-size: 14px;
  }
  .info-list li, .contrast-content ul, .growth-list li, .hobby-item p, .bond-list li {
    font-size: 14px;
  }
  .back-btn {
    top: 20px;
    left: 20px;
    font-size: 13px;
    cursor: default !important;
  }
  .custom-cursor {
    display: none !important;
  }
}
</style>