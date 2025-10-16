import CategoryNavigation from "./components/CategoryNavigation.vue";
import HomePosts from "./components/HomePosts.vue";
import CategoryPage from "./components/CategoryPage.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import ShareButtons from "./components/ShareButtons.vue";

// Single clean enhanceApp module — minimal runtime helpers only
export default ({ Vue, options, router, siteData }) => {
  Vue.component("CategoryNavigation", CategoryNavigation);
  Vue.component("HomePosts", HomePosts);
  Vue.component("CategoryPage", CategoryPage);
  Vue.component("Breadcrumb", Breadcrumb);
  Vue.component("ShareButtons", ShareButtons);

  if (typeof window === "undefined") return;

  const addHeaderLogo = () => {
    try {
      const base = (siteData && siteData.base) || "/";
      if (document.querySelector(".site-logo")) return;
      const contentEl =
        document.querySelector(".v-toolbar__content") ||
        document.querySelector(".v-toolbar") ||
        document.querySelector("header") ||
        document.body;
      if (!contentEl) return;
      const a = document.createElement("a");
      a.href = base;
      a.className = "site-logo";
      const img = document.createElement("img");
      img.src = (base === "/" ? "/" : base) + "logo.png";
      img.alt = document.title || "logo";
      img.style.height = "40px";
      img.style.width = "auto";
      a.appendChild(img);
      if (contentEl.firstChild && typeof contentEl.insertBefore === "function")
        contentEl.insertBefore(a, contentEl.firstChild);
      else if (typeof contentEl.appendChild === "function")
        contentEl.appendChild(a);
    } catch (e) {
      /* ignore */
    }
  };

  const ensureMermaid = () => {
    try {
      if (window.__mermaid_initialized__) return;
      if (window.mermaid && typeof window.mermaid.initialize === "function") {
        window.mermaid.initialize({ startOnLoad: false });
        window.__mermaid_initialized__ = true;
        try {
          window.mermaid.init(undefined, document.querySelectorAll(".mermaid"));
        } catch (e) {}
        return;
      }
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
      s.onload = () => {
        try {
          if (
            window.mermaid &&
            typeof window.mermaid.initialize === "function"
          ) {
            window.mermaid.initialize({ startOnLoad: false });
            window.__mermaid_initialized__ = true;
            try {
              window.mermaid.init(
                undefined,
                document.querySelectorAll(".mermaid")
              );
            } catch (e) {}
          }
        } catch (e) {}
      };
      s.onerror = () => {
        try {
          console.error("[enhanceApp] failed to load mermaid");
        } catch (e) {}
      };
      document.head.appendChild(s);
    } catch (e) {
      /* ignore */
    }
  };

  Vue.nextTick(() => {
    addHeaderLogo();
    ensureMermaid();
    if (router && typeof router.afterEach === "function") {
      router.afterEach(() => {
        try {
          setTimeout(() => {
            if (window && window.__mermaid_initialized__)
              try {
                window.mermaid.init(
                  undefined,
                  document.querySelectorAll(".mermaid")
                );
              } catch (e) {}
          }, 200);
        } catch (e) {}
      });
    }
  });
};
