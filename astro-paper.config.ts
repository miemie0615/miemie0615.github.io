import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://yihome.shop",
    title: "一间工作室",
    description: "BJD娃衣、国风周边、平面设计定制工作室",
    author: "一间工作室",
    profile: "",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/satnaing/astro-paper/edit/main/",
    },
    search: "pagefind",
    // 访问统计：不蒜子（零配置，国内主流，自动按域名统计）
    // 如需 Google Analytics 4，改为：{ provider: "ga4", id: "G-XXXXXXXXXX" }
    analytics: {
      provider: "busuanzi",
    },
    // 评论系统：Waline
    // 后端部署方案（LeanCloud 已停服，推荐以下方案）：
    //
    // 方案 A【最简单·推荐】Vercel + Neon（官方默认）
    //   1. Vercel 一键部署 Waline 模板 → 在 Storage 页创建 Neon 数据库（PostgreSQL）
    //   2. 绑定自定义域名（国内访问必需）
    //   参考: https://waline.js.org/guide/deploy/vercel.html
    //
    // 方案 B【国内更快】Vercel + MongoDB Atlas
    //   1. 注册 MongoDB Atlas（免费 512MB，永久）
    //   2. 创建 M0 集群（选香港节点），获取连接信息
    //   3. Vercel 部署 Waline，配置环境变量 MONGO_HOST/MONGO_DB/MONGO_USER/MONGO_PASSWORD 等
    //   参考: https://waline.js.org/guide/database.html#mongodb
    //
    // 方案 C【自建】宝塔面板 + MySQL + Waline
    //   在自己的服务器上部署 Waline 后端，使用 MySQL 存储
    //   参考: https://waline.js.org/guide/deploy/vps.html
    //
    // 部署完成后，将 serverURL 填入下方即可启用：
    // waline: { serverURL: "https://你的-waline-服务地址", lang: "zh-CN" },
    waline: false,
  },
  socials: [
    { name: "douyin",       url: "https://v.douyin.com/hAr8uiL-yCg/", linkTitle: "抖音" },
    { name: "xiaohongshu", url: "https://xhslink.cn/o/LhHaNtg81X",   linkTitle: "小红书" },
  ],
  shareLinks: [
    { name: "douyin",      url: "https://v.douyin.com/hAr8uiL-yCg/", linkTitle: "抖音" },
    { name: "xiaohongshu", url: "https://xhslink.cn/o/LhHaNtg81X",   linkTitle: "小红书" },
  ],
});
