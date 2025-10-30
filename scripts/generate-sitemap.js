const fs = require("fs");
const path = require("path");

const SITE_HOSTNAME = process.env.SITE_HOSTNAME || "https://example.com";
const BASE_URL = process.env.BASE_URL || "/ltb-blog/";
const DOCS_DIR = path.join(__dirname, "..", "docs");
const OUT_DIR = path.join(__dirname, "..", "docs", ".vuepress", "dist");
const OUT_FILE = path.join(OUT_DIR, "sitemap.xml");

function walkHtml(dir) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const fp = path.join(dir, d.name);
    if (d.isDirectory()) files = files.concat(walkHtml(fp));
    else if (d.isFile() && fp.endsWith(".html")) files.push(fp);
  });
  return files;
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.warn("out dir not found, creating:", OUT_DIR);
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  // Look for generated HTML files in docs/.vuepress/dist
  const files = walkHtml(OUT_DIR);
  const hostname = SITE_HOSTNAME.replace(/\/$/, "");
  const urlset = files
    .map((f) => {
      // relative to docs/.vuepress/dist
      const rel = path.relative(OUT_DIR, f).replace(/\\\\/g, "/");
      // if the site is hosted under a base path, ensure base is included
      const loc = hostname + (BASE_URL === "/" ? "/" : BASE_URL) + rel;
      return `  <url>\n    <loc>${loc.replace(
        /([^:])\/\//g,
        "$1/"
      )}</loc>\n  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;

  fs.writeFileSync(OUT_FILE, sitemap, "utf8");
  console.log("Sitemap written to", OUT_FILE);
}

main();
