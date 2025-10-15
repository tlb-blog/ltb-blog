<template>
  <nav class="breadcrumb" v-if="crumbs && crumbs.length">
    <ul class="breadcrumb-list">
      <li v-for="(c, i) in crumbs" :key="i" class="breadcrumb-item">
        <span v-if="c.link">
          <a :href="c.link">{{ c.text }}</a>
        </span>
        <span v-else>{{ c.text }}</span>
        <span v-if="i < crumbs.length - 1" class="sep">&gt;</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Breadcrumb",
  computed: {
    crumbs() {
      const page = this.$page || {};
      const site = this.$site || {};
      const base = site.base && site.base !== "/" ? site.base : "/";

      // Prefer frontmatter.category when available
      const fm = page.frontmatter || {};
      let category = fm.category || null;

      // If no explicit category, try to infer from path: /post/<category>/...
      if (!category && page.path) {
        const segs = (page.path || "")
          .replace(/^\/+|\/+$/g, "")
          .split("/")
          .filter(Boolean);
        const postIdx = segs.indexOf("post");
        if (postIdx >= 0 && segs.length > postIdx + 1) {
          category = segs[postIdx + 1];
        } else if (segs.length >= 2) {
          // fallback: use first segment if looks like a category structure
          category = segs[0];
        }
      }

      // Category label mapping (simple Japanese labels)
      const CATEGORY_LABELS = {
        health: "健康",
        ai: "AI",
        nba: "NBA",
        shose: "shose（シューズ）",
      };

      // Determine display name for category (use mapping if possible)
      let categoryText = category
        ? CATEGORY_LABELS[category] ||
          decodeURIComponent(category).replace(/-/g, " ")
        : null;

      // Build category link - point to /post/<category>/ (use site.base)
      // Ensure slashes are correct: base may be '/' or '/ltb-blog/' etc.
      const ensureTrailingSlash = (s) => (s.endsWith("/") ? s : s + "/");
      const catLink = category
        ? (base === "/" ? "/" : ensureTrailingSlash(base)) + `post/${category}/`
        : null;

      // File name: prefer frontmatter.title, else derive from final path segment
      let fileText = fm.title || null;
      if (!fileText && page.path) {
        const segs = (page.path || "")
          .replace(/^\/+|\/+$/g, "")
          .split("/")
          .filter(Boolean);
        let last = segs[segs.length - 1] || "";
        // remove file extension if present
        last = last.replace(/\.html?$|\.md$/i, "");
        fileText = decodeURIComponent(last).replace(/-/g, " ");
      }

      // If this page is itself a category index (e.g., /post/health/), then show only category (no filename)
      const isCategoryIndex =
        page.path &&
        page.path
          .replace(/\/$/, "")
          .match(new RegExp("/post/" + (category || "") + "$"));

      // Hide breadcrumb on the site's home page (root)
      const path = (page.path || "").replace(/^\/+|\/+$/g, "");
      const isHome =
        path === "" || path === "README.html" || path === "index.html";
      if (isHome) return [];

      const crumbs = [];
      // Always show Home first, then Category (no title)
      const homeLink = base === "/" ? "/" : base;
      crumbs.push({ text: "ホーム", link: homeLink });
      if (categoryText) {
        crumbs.push({ text: categoryText, link: catLink });
      }

      return crumbs;
    },
  },
};
</script>

<style scoped>
.breadcrumb {
  font-size: 14px;
  margin: 8px 0 16px 0;
}
.breadcrumb-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.breadcrumb-item {
  display: inline-flex;
  align-items: center;
}
.breadcrumb-item a {
  color: #1976d2;
  text-decoration: none;
}
.breadcrumb-item a:hover {
  text-decoration: underline;
}
.sep {
  margin: 0 8px;
  color: #999;
}
</style>
