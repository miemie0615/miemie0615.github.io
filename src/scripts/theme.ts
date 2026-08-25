const THEME_KEY = "theme";
const PALETTE_KEY = "palette";
const LIGHT = "light";
const DARK = "dark";

function getPreferredTheme(): string {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

// Reuse the value already set by the inline FOUC-prevention script if available.
let themeValue: string =
  (window as unknown as { __theme?: { value: string } }).__theme?.value ??
  getPreferredTheme();

// 当前国风配色（data-palette）；空字符串表示使用默认主题配色。
let paletteValue: string =
  (window as unknown as { __theme?: { palette: string } }).__theme?.palette ??
  localStorage.getItem(PALETTE_KEY) ??
  "";

function persist(): void {
  localStorage.setItem(THEME_KEY, themeValue);
  reflect();
}

// 持久化并应用国风配色（与明暗互相独立）。
function persistPalette(): void {
  if (paletteValue) {
    localStorage.setItem(PALETTE_KEY, paletteValue);
  } else {
    localStorage.removeItem(PALETTE_KEY);
  }
  reflect();
}

function reflect(): void {
  const root = document.firstElementChild;
  root?.setAttribute("data-theme", themeValue);
  root?.classList.toggle("dark", themeValue === DARK);

  // 应用/清除国风配色标记：有值则设置 data-palette，无值则移除以回到默认主题。
  if (paletteValue) {
    root?.setAttribute("data-palette", paletteValue);
  } else {
    root?.removeAttribute("data-palette");
  }

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  // Fill <meta name="theme-color"> with the computed background colour so
  // Android's browser chrome matches the page background.
  const bg = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

function setup(): void {
  reflect();

  // 明暗切换按钮（保留原有二态切换）。
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    persist();
  });

  setupPalette();
}

// 国风配色选择器：点开菜单、选择配色、点外部关闭。
// 说明：菜单内元素随 View Transitions 重建，故按钮/选项的监听在 setup 时重新绑定；
// 而 document 级别的“点外部关闭 / Esc 关闭”只在模块加载时绑定一次，避免导航后重复累积。
function setupPalette(): void {
  const paletteBtn =
    document.querySelector<HTMLButtonElement>("#palette-btn");
  const paletteMenu = document.querySelector<HTMLElement>("#palette-menu");
  if (!paletteBtn || !paletteMenu) return;

  // 点击调色盘按钮切换菜单显隐。
  paletteBtn.addEventListener("click", event => {
    event.stopPropagation();
    const isHidden = paletteMenu.classList.contains("hidden");
    if (isHidden) {
      paletteMenu.classList.remove("hidden");
      paletteBtn.setAttribute("aria-expanded", "true");
    } else {
      paletteMenu.classList.add("hidden");
      paletteBtn.setAttribute("aria-expanded", "false");
    }
  });

  // 选择某套配色：设置 palette，并按该配色的明暗归类自动切换 data-theme。
  paletteMenu.querySelectorAll<HTMLButtonElement>(".palette-option").forEach(
    option => {
      option.addEventListener("click", () => {
        paletteValue = option.dataset.palette ?? "";
        persistPalette();

        // data-mode 指明该配色属于浅色系还是深色系，选中后自动切到对应明暗。
        const mode = option.dataset.mode;
        if (mode === LIGHT || mode === DARK) {
          themeValue = mode;
          persist();
        }
        closePaletteMenu();
      });
    }
  );
}

// 关闭配色菜单（供 document 级监听调用；实时查询当前 DOM 中的菜单）。
function closePaletteMenu(): void {
  const btn = document.querySelector("#palette-btn");
  const menu = document.querySelector("#palette-menu");
  menu?.classList.add("hidden");
  btn?.setAttribute("aria-expanded", "false");
}

// 点击菜单外部区域关闭菜单（仅绑定一次）。
document.addEventListener("click", event => {
  const btn = document.querySelector("#palette-btn");
  const menu = document.querySelector("#palette-menu");
  if (!menu || menu.classList.contains("hidden")) return;
  if (
    !menu.contains(event.target as Node) &&
    !btn?.contains(event.target as Node)
  ) {
    closePaletteMenu();
  }
});

// Esc 键关闭菜单（仅绑定一次）。
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePaletteMenu();
});

setup();

// Re-run after View Transitions navigation.
document.addEventListener("astro:after-swap", setup);

// Carry the theme-color value across View Transitions to prevent the
// Android navigation bar from flashing during page transitions.
document.addEventListener("astro:before-swap", event => {
  const color = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");
  if (color) {
    (event as { newDocument: Document }).newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", color);
  }
});

// Sync with OS-level dark/light preference changes.
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    themeValue = matches ? DARK : LIGHT;
    persist();
  });
