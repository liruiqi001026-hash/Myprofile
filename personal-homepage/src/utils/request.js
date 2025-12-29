// src/utils/request.js
import axios from 'axios';

// 创建axios实例，配合Vite代理转发到后端3000端口
const request = axios.create({
  baseURL: '/api', // 关键：和Vite代理的/api匹配
  timeout: 10000,  // 超时时间（星火API响应稍慢，设10秒）
  headers: {
    'Content-Type': 'application/json'
  }
});

// 响应拦截器：只返回后端的data部分，简化前端处理
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('请求出错：', error);
    // 兜底返回，避免前端崩溃
    return Promise.reject({
      code: 500,
      msg: '请求失败',
      data: null
    });
  }
);

// 导出实例，供组件导入使用
export default request;