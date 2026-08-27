import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://miemie0615.github.io/",
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
