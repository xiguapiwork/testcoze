// Vercel 会自动为我们提供请求和响应对象的类型，我们在这里导入它们
import type { VercelRequest, VercelResponse } from '@vercel/node';

// 所有 Vercel 无服务器函数的默认导出函数都叫 handler
export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // 1. 设置关键的 CORS 跨域头，允许 Coze 请求
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. 处理 Coze 发送的 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    console.log('[Vercel] Handling OPTIONS preflight request.');
    // 对于预检请求，我们直接返回 204 No Content 即可
    return response.status(204).send('');
  }

  // 3. 在 Vercel 的日志中记录收到的请求
  console.log(`[Vercel] Received a ${request.method} request for url: ${request.url}`);
  // Vercel 会自动解析 JSON 请求体，存放在 request.body 中
  console.log(`[Vercel] Request body received:`, request.body);

  // 4. 准备要返回的 "Hello World" JSON 数据
  const responseBody = {
    message: "Hello from Vercel! Your request was received successfully.",
    timestamp: new Date().toISOString(),
    platform: "Vercel Node.js",
  };
  
  console.log("[Vercel] Sending 'Hello from Vercel' response.");
  
  // 5. 返回 200 OK 状态码和 JSON 响应
  response.status(200).json(responseBody);
}
