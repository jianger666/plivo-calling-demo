# Plivo WebRTC 通话演示

基于 Plivo Browser SDK 的 WebRTC 通话演示项目，支持完整的语音通话功能。

## 功能特性

✅ **完整的通话流程**
- 🔐 JWT Token 登录
- 📞 呼出通话
- 📱 呼入接听/拒绝
- ❌ 挂断通话
- 🔇 静音功能

✅ **用户体验优化**
- 🎨 现代化 UI 设计
- 📱 响应式布局
- 🔔 实时状态反馈
- 🐛 智能错误处理

✅ **技术栈**
- ⚡ Next.js 15 + React 19
- 🎯 TypeScript
- 🎨 TailwindCSS
- 📞 Plivo Browser SDK 2.2.16

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API 地址

在 `src/config/plivo.ts` 中配置您的 Plivo API 地址：

```typescript
export const PLIVO_CONFIG = {
  TOKEN_URL: 'your-token-api-url',
  PREPARE_CALL_URL: 'your-prepare-call-api-url',
  // ...
}
```

### 3. 开发模式

```bash
npm run dev
```

项目将在 `https://localhost:3000` 启动（自动启用 HTTPS）

### 4. 生产构建

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 主页面
│   └── globals.css     # 全局样式
├── components/         # React 组件
│   ├── PlivoPhone.tsx  # 主电话组件
│   ├── CallStatus.tsx  # 通话状态组件
│   └── DialPad.tsx     # 拨号键盘
├── hooks/              # React Hooks
│   └── usePlivoClient.ts # Plivo 客户端逻辑
├── types/              # TypeScript 类型
│   └── plivo.ts        # Plivo 相关类型
├── config/             # 配置文件
│   └── plivo.ts        # Plivo 配置
└── utils/              # 工具函数
    └── plivo.ts        # Plivo 工具函数
```

## 核心功能说明

### 登录流程
- 自动获取 JWT Token
- 建立 WebSocket 连接
- 客户端状态同步

### 呼出通话
1. 获取 callId
2. 发起通话
3. 状态管理：连接中 → 振铃中 → 已接通

### 呼入通话
1. 监听来电事件
2. 提取 callUUID
3. 提供接听/拒绝操作

### 错误处理
- 用户主动操作不显示错误
- 真正的通话失败才提示用户
- 智能区分操作类型

## 部署

### Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jianger666/plivo-webrtc-demo)

### 手动部署

1. 构建项目：`npm run build`
2. 上传 `.next` 文件夹和其他必要文件
3. 配置环境变量（如需要）
4. 启动：`npm start`

## 注意事项

1. **HTTPS 要求**：WebRTC 需要 HTTPS 环境
2. **浏览器权限**：需要麦克风权限
3. **API 配置**：确保后端 API 正确配置
4. **域名白名单**：Plivo 需要配置允许的域名

## 开发说明

### 代码优化亮点
- 🧹 **大幅简化**：从 600+ 行优化到 400 行，减少 33%
- 🏗️ **架构优化**：合并小组件，统一状态管理
- 🔧 **类型安全**：使用原生 Plivo SDK 类型
- 🐛 **错误处理**：智能区分用户操作和系统错误
- ⚡ **性能优化**：动态导入，避免 SSR 问题

### 浏览器支持
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 许可证

MIT License