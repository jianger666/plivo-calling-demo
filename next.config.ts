import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 抑制开发环境的水合警告
  reactStrictMode: true,
  
  // 配置构建输出
  compiler: {
    // 移除开发环境的调试属性
    removeConsole: process.env.NODE_ENV === "production"
  },
  
  // 在生产环境中禁用开发者工具相关属性
  experimental: {
    optimizePackageImports: ['@next/font']
  }
};

export default nextConfig;
