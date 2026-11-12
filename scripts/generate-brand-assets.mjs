// Renders the logo mark (assets/brand/mark.svg, "B · Doodle u, happy bowl")
// into every image the app uses: native ones app.json points at, plus the
// in-app mark (react-native-svg can't draw its feTurbulence wobble).
// Run after changing the mark:
//   node scripts/generate-brand-assets.mjs
// Uses headless Chrome (no image deps in the project); then rebuild native.
import { Buffer } from "node:buffer";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const out = (name) => join(root, "assets/images", name);
const CHROME = process.env.CHROME ?? "google-chrome";

const INK_DARK = "#0B0B0C";
const INK_LIGHT = "#F4F3EF";
// Design's dark app-icon tile.
const TILE = "#141414";

const source = readFileSync(join(root, "assets/brand/mark.svg"), "utf8");

// The mark with its "u" in `ink`; `mono` paints the dots in it too
// (Android tints monochrome and notification icons, colour is dropped).
function mark({ ink, mono = false }) {
  let svg = source.replace(/#0B0B0C/g, ink);
  if (mono) svg = svg.replace(/#(F07A5F|33B8A8)/g, ink);
  return svg;
}

// `scale` = mark size as a fraction of the canvas, centred. Chrome draws the
// SVG onto an exact-size canvas and prints it as a data URL: a --screenshot
// loses the bottom ~88px to the headless window frame.
function render(file, { size, background = "transparent", scale, ...opts }) {
  const markSize = size * scale;
  const offset = (size - markSize) / 2;
  const svg = `data:image/svg+xml;base64,${Buffer.from(mark(opts)).toString("base64")}`;
  const html = `<!doctype html><html><body><pre id="out"></pre><script>
const img = new Image();
img.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = ${size};
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "${background}";
  ctx.fillRect(0, 0, ${size}, ${size});
  ctx.drawImage(img, ${offset}, ${offset}, ${markSize}, ${markSize});
  document.getElementById("out").textContent = canvas.toDataURL("image/png");
};
img.src = "${svg}";
</script></body></html>`;
  const dir = mkdtempSync(join(tmpdir(), "umbii-brand-"));
  const page = join(dir, "page.html");
  writeFileSync(page, html);
  const dom = execFileSync(
    CHROME,
    [
      "--headless",
      "--disable-gpu",
      "--virtual-time-budget=5000",
      "--dump-dom",
      `file://${page}`,
    ],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 << 20,
    },
  );
  const data = /data:image\/png;base64,([A-Za-z0-9+/=]+)/.exec(dom)?.[1];
  if (!data) throw new Error(`Chrome didn't render ${file}`);
  writeFileSync(out(file), Buffer.from(data, "base64"));
  console.log("wrote", file);
}

// Legacy / store icon: the design's dark tile, mark at 68/104 of it.
render("icon.png", {
  size: 1024,
  background: TILE,
  scale: 68 / 104,
  ink: INK_LIGHT,
});
// Adaptive icon (108dp canvas, ~66dp safe circle): same proportion of the
// 72dp visible area as the tile, so launchers match icon.png.
render("android-icon-foreground.png", {
  size: 1024,
  scale: (72 * 68) / 104 / 108,
  ink: INK_LIGHT,
});
render("android-icon-monochrome.png", {
  size: 1024,
  scale: (72 * 68) / 104 / 108,
  ink: "#FFFFFF",
  mono: true,
});
// Status-bar icon: white silhouette, Android tints it.
render("notification-icon.png", {
  size: 96,
  scale: 0.9,
  ink: "#FFFFFF",
  mono: true,
});
// Splash: the mark alone, transparent; app.json sets the light/dark backgrounds.
render("splash-mark.png", { size: 1200, scale: 1, ink: INK_DARK });
render("splash-mark-dark.png", { size: 1200, scale: 1, ink: INK_LIGHT });
// In-app mark (components/ui/logo-mark): big enough for 128dp at 4x.
render("logo-mark.png", { size: 512, scale: 1, ink: INK_DARK });
render("logo-mark-dark.png", { size: 512, scale: 1, ink: INK_LIGHT });
render("favicon.png", {
  size: 48,
  background: TILE,
  scale: 0.8,
  ink: INK_LIGHT,
});
