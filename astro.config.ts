import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import rehypeOptimizeImages from "./src/utils/transformers/optimizeImages";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["zh-CN"],
    defaultLocale: "zh-CN",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeOptimizeImages],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      // 字体名称：与 CSS 变量配合，作为 @font-face 的 font-family 名称
      name: "Google Sans Code",
      // 暴露给样式使用的 CSS 变量，theme.css 中的 --font-app 会引用它
      cssVariable: "--font-google-sans-code",
      // 改用本地字体提供器（fontProviders.local），完全离线，不再请求 fonts.google.com
      provider: fontProviders.local(),
      // 字体加载失败时的回退字体（使用系统等宽字体）
      fallbacks: ["monospace"],
      // 本地字体的具体配置放在 options.variants 中（这是 local provider 的要求，
      // 与 Google/Fontsource 等外部提供器使用 weights/styles 的写法不同）。
      options: {
        // 字体变体：这里使用官方发布的“可变字体（variable font）”，
        // 其字重轴（wght）范围为 300~800，因此用 "300 800" 表示整个区间。
        variants: [
          {
            // 正体（非斜体）可变字体
            weight: "300 800",
            style: "normal",
            src: ["./src/assets/fonts/GoogleSansCode-VF.ttf"],
          },
          {
            // 斜体可变字体
            weight: "300 800",
            style: "italic",
            src: ["./src/assets/fonts/GoogleSansCode-Italic-VF.ttf"],
          },
        ],
      },
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
