const fs = require("fs");
const path = require("path");

// 設定
const SITE_HOSTNAME = process.env.SITE_HOSTNAME || "https://example.com";
const BASE_URL = process.env.BASE_URL || "/ltb-blog/";
const POSTS_DIR = path.join(__dirname, "..", "docs", "post");
const OUT_DIR = path.join(__dirname, "..", "docs", ".vuepress", "dist");
const OUT_FILE = path.join(OUT_DIR, "rss.xml");

function walk(dir) {
  let files = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const fp = path.join(dir, d.name);
    if (d.isDirectory()) files = files.concat(walk(fp));
    else if (d.isFile() && fp.endsWith(".md")) files.push(fp);
  });
  return files;
}

function parseFrontMatter(content) {
  if (!content.startsWith("---")) return {};
  const end = content.indexOf("\n---", 3);
  if (end === -1) return {};
  const fm = content.slice(3, end + 1);
  const out = {};
  fm.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      const k = m[1];
      let v = m[2].trim();
      // remove surrounding quotes
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      // simple array handling like tags: ["a","b"]
      if (v.startsWith("[") && v.endsWith("]")) {
        try {
          out[k] = JSON.parse(v);
        } catch (e) {
          out[k] = v;
        }
      } else {
        out[k] = v;
      }
    }
  });
  return out;
}

function toIsoStringIfDate(s) {
  if (!s) return null;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toUTCString();
  return null;
}

function buildItem(fm, relUrl) {
  const title = fm.title || path.basename(relUrl);
  const description = fm.description || "";
  const link =
    SITE_HOSTNAME.replace(/\/$/, "") + "/" + relUrl.replace(/^\//, "");
  const pubDate = toIsoStringIfDate(fm.date) || new Date().toUTCString();
  return `  <item>\n    <title><![CDATA[${title}]]></title>\n    <link>${link}</link>\n    <guid isPermaLink="true">${link}</guid>\n    <pubDate>${pubDate}</pubDate>\n    <description><![CDATA[${description}]]></description>\n  </item>`;
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error("posts dir not found:", POSTS_DIR);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) {
    console.warn("out dir not found, creating:", OUT_DIR);
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  const files = walk(POSTS_DIR);
  const items = [];
  files.forEach((f) => {
    const content = fs.readFileSync(f, "utf8");
    const fm = parseFrontMatter(content);
    // derive permalink relative path from docs/post/... -> ltb-blog/post/...
    const rel = path
      .relative(path.join(__dirname, "..", "docs"), f)
      .replace(/\\\\/g, "/")
      .replace(/\.md$/, ".html");
    const relUrl = (BASE_URL + rel).replace(/\/\/+/, "/");
    items.push(buildItem(fm, relUrl));
  });

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n  <title>LTB - RSS</title>\n  <link>${
    SITE_HOSTNAME.replace(/\/$/, "") + BASE_URL
  }</link>\n  <description>Latest posts</description>\n${items.join(
    "\n"
  )}\n</channel>\n</rss>`;

  fs.writeFileSync(OUT_FILE, rss, "utf8");
  console.log("RSS written to", OUT_FILE);
}

main();
