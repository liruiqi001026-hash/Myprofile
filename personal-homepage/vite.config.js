import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 新增：引入path模块

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()], // 保留原有Vue插件配置
  // 新增：代理配置（解决跨域+转发请求到后端3000端口）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 关键：__dirname是当前文件目录，指向前端根目录
    }
  },
  server: {
    proxy: {
      // 匹配所有以/api开头的请求，转发到后端
      '/api': {
        target: 'http://localhost:3000', // 你的后端服务地址
        changeOrigin: true, // 开启跨域（必须）
        ws: true, // 支持WebSocket（适配星火API的WS协议）
        rewrite: (path) => path.replace(/^\/api/, '/api') // 路径重写（无需修改）
      }
    },
    port: 5173 // 前端端口（保持默认5173，和你能打开的localhost:5173一致）
  }
})