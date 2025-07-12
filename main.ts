import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// 定义一个通用的响应头，允许跨域请求
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 允许任何来源的请求
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // 允许的方法
  "Access-Control-Allow-Headers": "Content-Type, Authorization", // 允许的请求头
};

// 定义请求处理函数
async function handler(request: Request): Promise<Response> {
  // 1. 打印日志，记录收到的请求
  // 这一步是关键，只要 Coze 的请求能到达 Deno Deploy，我们就能在日志里看到这条信息
  console.log(`[TEST] Received a ${request.method} request for ${request.url}`);

  // 2. 特别处理 OPTIONS 预检请求 (对于跨域POST请求是必需的)
  if (request.method === "OPTIONS") {
    console.log("[TEST] Responding to OPTIONS preflight request.");
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 3. 尝试读取请求体 (即使不用，也读取一下以模拟真实场景)
  try {
    const bodyText = await request.text();
    console.log(`[TEST] Request body received: ${bodyText || "(empty)"}`);
  } catch (error) {
    console.error(`[TEST] Error reading request body:`, error);
  }
  
  // 4. 无论请求是什么，都返回一个固定的成功响应
  const responseBody = {
    message: "Hello World! Your request was received.",
    timestamp: new Date().toISOString(),
  };

  console.log("[TEST] Sending 'Hello World' response.");

  return new Response(
    JSON.stringify(responseBody), 
    {
      status: 200, // 返回 200 OK 状态码
      headers: {
        ...corsHeaders, // 应用跨域头
        "Content-Type": "application/json", // 告诉客户端返回的是 JSON
      },
    }
  );
}

// 启动服务器
const port = 8000;
console.log(`[TEST] Server starting on http://localhost:${port}`);
console.log("[TEST] This is a simple echo server. It will respond with 'Hello World' to any GET or POST request.");

serve(handler, { port });
