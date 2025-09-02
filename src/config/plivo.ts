// Plivo 配置常量
export const PLIVO_CONFIG = {
  // API 地址
  TOKEN_URL: 'https://nofitication-test.wukongedu.net/public/voice/plivo/token',
  PREPARE_CALL_URL: 'https://nofitication-test.wukongedu.net/public/voice/plivo/prepare/call',
  
  // SDK 初始化选项
  SDK_OPTIONS: {
    debug: "DEBUG" as const,
    permOnClick: true,
    enableTracking: true,
    closeProtection: true,
    maxAverageBitrate: 48000,
  },
  
  // 时间配置
  CLIENT_READY_DELAY: 2000,
  STATUS_RESET_DELAY: 3000,
} as const;
