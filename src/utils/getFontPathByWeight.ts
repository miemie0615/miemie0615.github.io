import type { FontData } from "astro:assets";

export function getFontPathByWeight(
  fonts: FontData[],
  weight: number,
  options?: {
    style?: "normal" | "italic";
    format?: string;
  }
): string | undefined {
  const style = options?.style ?? "normal";
  const format = options?.format ?? "truetype";

  // 1) 优先精确匹配：字重字符串与目标完全一致（用于静态字重字体，如 "400"、"700"）
  for (const font of fonts) {
    if (font.weight === String(weight) && font.style === style) {
      const src = font.src.find(file => file.format === format) ?? font.src[0];
      if (src) return src.url;
    }
  }

  // 2) 回退匹配可变字体（variable font）：其 weight 为区间字符串，如 "300 800"。
  //    只要目标字重落在区间内即命中——这样同一个可变字体文件可同时用于 400/700 等。
  for (const font of fonts) {
    if (font.style !== style || !font.weight) continue;
    const range = font.weight.trim().split(/\s+/).map(Number);
    if (
      range.length === 2 &&
      !Number.isNaN(range[0]) &&
      !Number.isNaN(range[1]) &&
      weight >= range[0] &&
      weight <= range[1]
    ) {
      const src = font.src.find(file => file.format === format) ?? font.src[0];
      if (src) return src.url;
    }
  }

  return undefined;
}
