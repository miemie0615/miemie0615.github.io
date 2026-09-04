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

// 复用 FOUC 预防脚本已写入的值
let themeValue: string =
  (window as unknown as { __theme?: { value: string } }).__theme?.value ??
  getPreferredTheme();

let paletteValue: string =
  (window as unknown as { __theme?: { palette: string } }).__theme?.palette ??
  localStorage.getItem(PALETTE_KEY) ??
  "";

function persist(): void {
  localStorage.setItem(THEME_KEY, themeValue);
  reflect();
}

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

  if (paletteValue) {
    root?.setAttribute("data-palette", paletteValue);
  } else {
    root?.removeAttribute("data-palette");
  }

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  // Icon swap：浅色(a)显示印章，深色(b)显示月亮
  const swap = document.querySelector<HTMLElement>("#theme-icon-swap");
  if (swap) {
    swap.dataset.state = themeValue === DARK ? "b" : "a";
  }

  const bg = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

function setup(): void {
  reflect();

  // 明暗切换按钮
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    persist();
  });

  setupPalette();
}

// 配色菜单关闭计时器（用于 is-closing 动画后彻底隐藏）
let _paletteCloseTimer: ReturnType<typeof setTimeout> | null = null;

// 国风配色选择器：使用 t-dropdown 的 is-open/is-closing 做过渡
function setupPalette(): void {
  const paletteBtn =
    document.querySelector<HTMLButtonElement>("#palette-btn");
  const paletteMenu = document.querySelector<HTMLElement>("#palette-menu");
  if (!paletteBtn || !paletteMenu) return;

  const closeMs = 160; // --dropdown-close-dur + 余量

  paletteBtn.addEventListener("click", event => {
    event.stopPropagation();
    const isOpen = paletteMenu.classList.contains("is-open");

    if (isOpen) {
      // 关闭动画
      paletteMenu.classList.remove("is-open");
      paletteMenu.classList.add("is-closing");
      paletteBtn.setAttribute("aria-expanded", "false");
      if (_paletteCloseTimer) clearTimeout(_paletteCloseTimer);
      _paletteCloseTimer = setTimeout(() => {
        paletteMenu?.classList.remove("is-closing");
      }, closeMs);
    } else {
      // 打开动画
      if (_paletteCloseTimer) {
        clearTimeout(_paletteCloseTimer);
        _paletteCloseTimer = null;
      }
      paletteMenu.classList.remove("is-closing");
      paletteMenu.classList.add("is-open");
      paletteBtn.setAttribute("aria-expanded", "true");
    }
  });

  paletteMenu.querySelectorAll<HTMLButtonElement>(".palette-option").forEach(
    option => {
      option.addEventListener("click", () => {
        paletteValue = option.dataset.palette ?? "";
        persistPalette();

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

function closePaletteMenu(): void {
  const btn = document.querySelector("#palette-btn");
  const menu = document.querySelector<HTMLElement>("#palette-menu");
  if (!menu) return;
  if (menu.classList.contains("is-open")) {
    menu.classList.remove("is-open");
    menu.classList.add("is-closing");
    btn?.setAttribute("aria-expanded", "false");
    if (_paletteCloseTimer) clearTimeout(_paletteCloseTimer);
    _paletteCloseTimer = setTimeout(() => {
      menu?.classList.remove("is-closing");
    }, 160);
  }
}

// 点击外部关闭（仅绑定一次）
document.addEventListener("click", event => {
  const btn = document.querySelector("#palette-btn");
  const menu = document.querySelector("#palette-menu");
  if (!menu || !menu.classList.contains("is-open")) return;
  if (
    !menu.contains(event.target as Node) &&
    !btn?.contains(event.target as Node)
  ) {
    closePaletteMenu();
  }
});

// Esc 关闭（仅绑定一次）
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePaletteMenu();
});

setup();

document.addEventListener("astro:after-swap", setup);

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

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    themeValue = matches ? DARK : LIGHT;
    persist();
  });
