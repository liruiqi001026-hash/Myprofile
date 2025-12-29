const express = require('express');
const cors = require('cors');
const aiRouter = require('./routes/ai');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// 跨域配置（允许前端本地调试）
app.use(cors({
  origin: '*', // 生产环境建议限定为你的前端域名，如http://localhost:8080
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// 解析JSON请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 挂载AI接口
app.use('/api/ai', aiRouter);

// 测试接口
app.get('/', (req, res) => {
  res.send('王小染对话后端服务已启动 ✨');
});

// 启动服务
app.listen(PORT, () => {
  console.log(`✅ 后端服务运行在：http://localhost:${PORT}`);
});