// 1. 加载环境变量（必须加，读取.env中的密钥）
require('dotenv').config();
console.log('【调试】加载的星火密钥：', {
  APP_ID: process.env.APP_ID,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET
});

require('dotenv').config({ 
  path: 'D:/Myprofile/personal-api/.env' 
});

// 新增调试日志（看是否加载成功）
console.log('【调试】APP_ID：', process.env.APP_ID); // 打印不为undefined则成功
console.log('【调试】API_KEY：', process.env.API_KEY);
console.log('【调试】API_SECRET：', process.env.API_SECRET);

// 2. 导入依赖（Node.js内置crypto，需安装ws）
const crypto = require('crypto');
const WebSocket = require('ws');

/**
 * 生成星火API的授权URL（签名逻辑）
 * @param {string} apiKey - 星火API_KEY
 * @param {string} apiSecret - 星火API_SECRET
 * @param {string} hostUrl - 星火服务地址（spark-api.xfyun.cn）
 * @returns {string} 授权后的WebSocket地址
 */
function generateAuthUrl(apiKey, apiSecret, hostUrl) {
  // 步骤1：获取UTC时间
  const date = new Date().toUTCString();
  // 步骤2：构造原始签名串
  const signatureOrigin = `host: ${hostUrl}\ndate: ${date}\nGET /v1/chat HTTP/1.1`;
  // 步骤3：HmacSHA256加密（核心：算法名用sha256，不是hmac-sha256）
  const signatureSha = crypto.createHmac('sha256', apiSecret)
    .update(signatureOrigin)
    .digest('base64');
  // 步骤4：构造authorization原始串
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
  // 步骤5：base64编码authorization
  const authorization = Buffer.from(authorizationOrigin).toString('base64');
  // 步骤6：拼接最终URL
  return `wss://${hostUrl}/v1/chat?authorization=${authorization}&date=${date}&host=${hostUrl}`;
}

/**
 * 获取王小染的对话回复
 * @param {string} userMsg - 用户输入的消息
 * @param {boolean} isBrotherMode - 是否是对哥哥的模式（温柔/高冷）
 * @returns {Promise<string>} 王小染的回复
 */
async function getWangXiaoRanReply(userMsg, isBrotherMode) {
  return new Promise((resolve, reject) => {
    // 1. 校验入参
    if (!userMsg || userMsg.trim() === '') {
      return reject(new Error('用户消息不能为空'));
    }

    const appId = '4c34f433'; // 替换成你讯飞控制台的APP_ID
    const apiKey = '4fdfcc04a3a7e3a9753865edaeae4b09'; // 替换成你的API_KEY
    const apiSecret = 'ZTEzN2FiNWFhYjZkYjQ2YmU3ZGEwYWI0'; // 替换成你的API_SECRET

    // 2. 读取.env中的密钥（确保.env文件配置正确）
    //const appId = process.env.APP_ID;
    //const apiKey = process.env.API_KEY;
    //const apiSecret = process.env.API_SECRET;
    //if (!appId || !apiKey || !apiSecret) {
      //return reject(new Error('.env文件中未配置星火API密钥（APP_ID/API_KEY/API_SECRET）'));
    //}

    // 3. 构造王小染的人设Prompt
    const systemPrompt = isBrotherMode 
      ? `你是王小染，一个软萌的技术少女，对哥哥说话温柔撒娇，回复简短（不超过50字），语气亲切，比如用"～""😜"等语气词，不要说专业术语，像妹妹和哥哥聊天一样。`
      : `你是王小染，对外高冷话少，回复简短（不超过20字），语气冷淡，不使用表情包和语气词，只说核心内容，像职场沟通一样。`;

    // 4. 构造星火API的消息体
    const messages = [
      { role: 'system', content: systemPrompt }, // 人设
      { role: 'user', content: userMsg }          // 用户消息
    ];

    // 5. 生成授权URL
    const hostUrl = 'spark-api.xfyun.cn'; // 星火固定服务地址
    let authUrl;
    try {
      authUrl = generateAuthUrl(apiKey, apiSecret, hostUrl);
    } catch (err) {
      return reject(new Error('生成星火API授权URL失败：' + err.message));
    }

    // 6. 建立WebSocket连接
    const ws = new WebSocket(authUrl);
    let reply = ''; // 存储最终回复

    // 超时处理（10秒超时，避免一直等待）
    const timeoutTimer = setTimeout(() => {
      ws.close();
      reject(new Error('调用星火API超时（10秒）'));
    }, 10000);

    // 7. WebSocket连接成功
    ws.on('open', () => {
      console.log('【星火API】WebSocket连接成功');
      // 构造星火API的请求体
      const payload = {
        header: { app_id: appId },
        parameter: {
          chat: {
            domain: 'generalv3.5', // 星火3.5模型（固定值，不要改）
            temperature: 0.7,      // 回复随机性（0-1，越小越固定）
            max_tokens: 2048,      // 最大回复长度
            status: 0              // 0表示单次对话
          }
        },
        payload: {
          message: { text: messages }
        }
      };
      // 发送请求
      ws.send(JSON.stringify(payload));
    });

    // 8. 接收星火API的回复
    ws.on('message', (data) => {
      try {
        // 解析返回数据（Buffer转字符串）
        const res = JSON.parse(data.toString());
        
        // 校验返回码（0表示成功）
        if (res.header?.code !== 0) {
          clearTimeout(timeoutTimer);
          return reject(new Error(`星火API返回错误：${res.header.code} - ${res.header.message}`));
        }

        // 拼接回复内容（星火会分块返回）
        if (res.payload?.choices?.text?.length > 0) {
          reply += res.payload.choices.text[0].content;
        }

        // 消息结束标识（status=2）
        if (res.payload?.choices?.status === 2) {
          clearTimeout(timeoutTimer);
          ws.close();
          resolve(reply.trim()); // 返回最终回复
        }
      } catch (err) {
        clearTimeout(timeoutTimer);
        reject(new Error('解析星火API返回数据失败：' + err.message));
      }
    });

    // 9. WebSocket错误处理
    ws.on('error', (err) => {
      clearTimeout(timeoutTimer);
      reject(new Error('WebSocket连接错误：' + err.message));
    });

    // 10. WebSocket关闭处理
    ws.on('close', (code, reason) => {
      clearTimeout(timeoutTimer);
      if (code !== 1000 && !reply) {
        reject(new Error(`WebSocket异常关闭：code=${code}，reason=${reason.toString()}`));
      }
    });
  });
}

// 导出函数（供路由文件调用）
module.exports = {
  generateAuthUrl,
  getWangXiaoRanReply
};