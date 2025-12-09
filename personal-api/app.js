const express = require('express')
const cors = require('cors')
const pool = require('./db')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// 接口：获取个人信息
app.get('/api/user', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user LIMIT 1')
    res.json({ code: 200, data: rows[0] || {} })
  } catch (err) {
    res.status(500).json({ code: 500, msg: '服务器错误' })
  }
})

// 接口：获取作品列表
app.get('/api/works', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM works ORDER BY create_time DESC')
    res.json({ code: 200, data: rows })
  } catch (err) {
    res.status(500).json({ code: 500, msg: '服务器错误' })
  }
})

// 启动服务
app.listen(PORT, () => {
  console.log(`后端服务运行在：http://localhost:${PORT}`)
})