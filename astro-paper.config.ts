import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://miemie0615.github.io/",
    title: "一间工作室",
    description: "BJD娃衣、国风周边、平面设计定制工作室",
    author: "一间工作室",
    // 工作室链接
    profile: "",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Bangkok",
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
  },
  socials: [
    { name: "douyin",      url: "https://v.douyin.com/hAr8uiL-yCg/ 8@0.com :9pm", linkTitle: "抖音" },
    { name: "wechat",      url: "#你的微信号或公众号链接",              linkTitle: "微信" },
    { name: "qq",          url: "#你的QQ号或QQ群链接",                  linkTitle: "QQ" },
    { name: "xiaohongshu", url: "https://xhslink.cn/o/LhHaNtg81X", linkTitle: "小红书" },
  ],
  shareLinks: [
    { name: "douyin",      url: "https://v.douyin.com/hAr8uiL-yCg/ 8@0.com :9pm", linkTitle: "抖音" },
    { name: "wechat",      url: "#你的微信号或公众号链接",              linkTitle: "微信" },
    { name: "qq",          url: "#你的QQ号或QQ群链接",                  linkTitle: "QQ" },
    { name: "xiaohongshu", url: "https://xhslink.cn/o/LhHaNtg81X", linkTitle: "小红书" },
  ],
});