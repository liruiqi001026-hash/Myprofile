import { createApp } from 'vue'
import App from './App.vue'
// 1. 引入路由实例
import router from './router/index.js'  // 或简写为 './router'

const app = createApp(App)
// 2. 注册路由（核心步骤！）
app.use(router)
// 3. 挂载应用
app.mount('#app')