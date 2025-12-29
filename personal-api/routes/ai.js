const express = require('express');
const router = express.Router();
const { getWangXiaoRanReply } = require('../utils/sparkPro');

/**
 * 王小染对话接口
 * POST /api/ai/wxr-chat
 * 参数：{ userMsg: string, isBrotherMode: boolean }
 */
router.post('/wxr-chat', async (req, res) => {
  try {
    // 1. 打印请求日志（关键：看前端传参是否正确）
    console.log('【王小染对话接口】收到请求：', req.body);

    // 2. 参数校验（加更严格的判空）
    const { userMsg, isBrotherMode } = req.body;
    if (!userMsg || userMsg.trim() === '') {
      return res.status(200).json({ // 改为200，避免前端Axios进入catch
        code: 400,
        msg: '参数错误：请输入有效对话内容',
        data: { reply: isBrotherMode ? '哥，你还没说要聊什么呢～' : '请输入有效内容' }
      });
    }

    // 3. 调用Spark Pro获取回复（加日志）
    console.log('【王小染对话接口】开始调用星火API，用户消息：', userMsg);
    const reply = await getWangXiaoRanReply(userMsg, isBrotherMode);
    console.log('【王小染对话接口】星火API返回：', reply);

    // 4. 返回成功结果
    res.status(200).json({
      code: 200,
      msg: 'success',
      data: { reply }
    });
  } catch (error) {
    // 5. 打印完整异常日志（关键：定位星火API问题）
    console.error('【王小染对话接口异常】', {
      errorMessage: error.message,
      errorStack: error.stack, // 打印堆栈，看具体哪行出错
      requestParams: req.body // 附带请求参数，方便排查
    });

    // 6. 兜底回复（改为200状态码，前端不用进catch，体验更好）
    const fallbackReply = req.body.isBrotherMode 
      ? '哥，我这边出问题了～' 
      : '算力不足';
    
    res.status(200).json({ // 核心修改：从500改为200
      code: 500, // 业务码仍为500，前端可识别异常
      msg: '对话服务暂不可用',
      data: { reply: fallbackReply, error: error.message } // 携带错误信息，方便调试
    });
  }
});

module.exports = router;