import CategoryNavigation from "./components/CategoryNavigation.vue";
import HomePosts from "./components/HomePosts.vue";
import CategoryPage from "./components/CategoryPage.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import ShareButtons from "./components/ShareButtons.vue";

export default ({ Vue, options, router, siteData }) => {
  Vue.component("CategoryNavigation", CategoryNavigation);
  Vue.component("HomePosts", HomePosts);
  Vue.component("CategoryPage", CategoryPage);
  Vue.component("Breadcrumb", Breadcrumb);
  Vue.component("ShareButtons", ShareButtons);

  // ヘッダーナビゲーションを動的に追加
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    Vue.nextTick(() => {
      // Helper: check parent is element and namespaces match to avoid HierarchyRequestError
      const isSafeParent = (parent, node) => {
        try {
          if (!parent || parent.nodeType !== 1) return false;
          // If parent is an SVG or other non-HTML namespace, avoid inserting HTML nodes into it.
          const pNs = parent.namespaceURI || null;
          // Treat nodes without namespace as HTML (XHTML) by default
          const nNs =
            (node && node.namespaceURI) || "http://www.w3.org/1999/xhtml";
          if (pNs && nNs && pNs !== nNs) return false;
          return true;
        } catch (e) {
          return false;
        }
      };
      // ヘッダにロゴを挿入する（クライアントサイドのみ）
      const addHeaderLogo = () => {
        // 既に挿入済みなら何もしない
        if (document.querySelector(".site-logo")) return;

        // テーマ自体にロゴがある場合は挿入しない（site-logoクラスは除く）
        const existingThemeLogo =
          document.querySelector(".v-toolbar img:not(.site-logo)") ||
          document.querySelector(".v-app-bar img:not(.site-logo)");
        if (existingThemeLogo) {
          try {
            console.log(
              "[enhanceApp] existing theme logo found, skipping header logo injection"
            );
          } catch (e) {}
          return;
        }

        // まずは toolbar content を優先して探す（現在のテーマ構造に合わせる）
        let contentEl =
          document.querySelector(".v-toolbar__content") ||
          document.querySelector(".v-toolbar .v-toolbar__content");

        // 見つからなければ従来の候補で探す
        if (!contentEl) {
          const headerSelectors = [
            ".v-toolbar",
            ".v-app-bar",
            "header",
            ".navbar",
            ".site-nav",
            ".page-header",
          ];
          for (const sel of headerSelectors) {
            const el = document.querySelector(sel);
            if (el) {
              contentEl = el;
              break;
            }
          }
        }

        if (!contentEl) {
          // 追加のフォールバック候補を探す
          contentEl = document.querySelector(
            "header, .site-header, .navbar, .v-app-bar, .v-toolbar"
          );
        }
        if (!contentEl || contentEl.nodeType !== 1) return; // 見つからなければまた抜ける

        // ロゴ要素を作成
        const a = document.createElement("a");
        // siteData.base を使用して、プロジェクトページの base を考慮したリンクを生成
        const base = (siteData && siteData.base) || "/";
        a.href = base;
        a.className = "site-logo";
        a.style.display = "inline-flex";
        a.style.alignItems = "center";
        a.style.textDecoration = "none";
        // mr-autoクラスが適用されないように!importantで強制的にmarginを0に設定
        a.style.setProperty("margin", "0", "important");
        a.style.setProperty("margin-right", "0", "important");

        const img = document.createElement("img");
        // public 配下の logo.png を base を組み合わせて参照
        img.src = (base === "/" ? "/" : base) + "logo.png";
        img.alt = document.title || "logo";
        img.style.height = "40px";
        img.style.width = "auto";
        img.style.display = "block";

        // img is an HTML element; appending to anchor is normally safe
        try {
          if (isSafeParent(a, img) && typeof a.appendChild === "function") {
            a.appendChild(img);
          }
        } catch (e) {
          try {
            console.error(
              "[enhanceApp] failed to append logo image to anchor",
              e
            );
          } catch (err) {}
        }

        // mr-autoクラスを明示的に削除（存在する場合）
        a.classList.remove("mr-auto");

        // contentEl の中で .v-toolbar__title を見つけ、その前に挿入する。
        try {
          const titleEl = contentEl.querySelector(".v-toolbar__title");
          if (
            titleEl &&
            titleEl.parentNode === contentEl &&
            typeof contentEl.insertBefore === "function" &&
            isSafeParent(contentEl, a)
          ) {
            contentEl.insertBefore(a, titleEl);
          } else if (
            titleEl &&
            titleEl.parentNode &&
            typeof titleEl.parentNode.insertBefore === "function" &&
            isSafeParent(titleEl.parentNode, a)
          ) {
            // title が深くネストされている場合は titleEl の親の最初の子の前に挿入
            titleEl.parentNode.insertBefore(
              a,
              titleEl.parentNode.firstChild || null
            );
          } else if (
            contentEl.firstChild &&
            typeof contentEl.insertBefore === "function" &&
            isSafeParent(contentEl, a)
          ) {
            contentEl.insertBefore(a, contentEl.firstChild);
          } else if (
            typeof contentEl.appendChild === "function" &&
            isSafeParent(contentEl, a)
          ) {
            contentEl.appendChild(a);
          } else {
            // どのノードにも挿入できない場合は safest fallback として body に追加
            if (
              document.body &&
              isSafeParent(document.body, a) &&
              typeof document.body.appendChild === "function"
            ) {
              document.body.insertBefore(a, document.body.firstChild || null);
            }
          }
        } catch (e) {
          try {
            console.error("[enhanceApp] failed to insert header logo", e);
          } catch (err) {}
        }

        // 挿入後に再度スタイルを確認し、必要に応じて修正
        setTimeout(() => {
          const insertedLogo = contentEl.querySelector(".site-logo");
          if (insertedLogo) {
            insertedLogo.classList.remove("mr-auto");
            insertedLogo.style.setProperty("margin", "0", "important");
            insertedLogo.style.setProperty("margin-right", "0", "important");
          }
        }, 100);
      };

      // 初回追加（ログを出して、レンダリングが遅い場合に備えて複数回リトライ）
      try {
        console.log("[enhanceApp] attempting addHeaderLogo (initial)");
      } catch (e) {}

      addHeaderLogo();

      // ページロード完了後と SPA 遷移後に少し待って再試行する（最大5回）
      let logoAttempts = 0;
      const retryAddLogo = () => {
        if (document.querySelector(".site-logo")) {
          try {
            console.log(
              "[enhanceApp] site-logo already present, skipping retries"
            );
          } catch (e) {}
          return;
        }
        if (logoAttempts >= 5) {
          try {
            console.log("[enhanceApp] addHeaderLogo - max attempts reached");
          } catch (e) {}
          return;
        }
        logoAttempts++;
        try {
          console.log(`[enhanceApp] retryAddLogo attempt ${logoAttempts}`);
        } catch (e) {}
        addHeaderLogo();
        setTimeout(retryAddLogo, 600);
      };

      if (document.readyState === "complete") {
        retryAddLogo();
      } else {
        window.addEventListener("load", retryAddLogo);
      }

      router.afterEach(() => {
        try {
          console.log("[enhanceApp] router.afterEach - scheduling logo retry");
        } catch (e) {}
        requestAnimationFrame(() => retryAddLogo());
      });

      const addCategoryNav = () => {
        // 既存のナビゲーションがあれば何もしない
        if (document.querySelector(".category-nav")) return;

        // siteData.base を使用してベースパスを取得
        const base = (siteData && siteData.base) || "/";
        const basePath = base === "/" ? "/" : base;

        // カテゴリナビゲーションを作成（parentingリンクを削除）
        const nav = document.createElement("div");
        nav.className = "category-nav";
        nav.innerHTML = `
            <a href="${basePath}"><i class="bi bi-house me-5" aria-hidden="true"></i><span>ホーム</span></a>
            <a href="${basePath}post/ai/"><i class="bi bi-robot me-2" aria-hidden="true"></i><span>AI</span></a>
            <a href="${basePath}post/health/"><i class="bi bi-activity me-2" aria-hidden="true"></i><span>健康</span></a>
            <a href="${basePath}post/nba/"><i class="bi bi-trophy me-2" aria-hidden="true"></i><span>NBA</span></a>
            <a href="${basePath}post/"><i class="bi bi-three-dots me-2" aria-hidden="true"></i><span>その他</span></a>
          `;

        // まず非表示状態で挿入しておき、次フレームでクラスを付与してフェードイン
        const safeAppend = (parent, node) => {
          try {
            if (!isSafeParent(parent, node)) return false;
            if (typeof parent.appendChild === "function") {
              parent.appendChild(node);
              return true;
            }
            if (typeof parent.insertBefore === "function") {
              parent.insertBefore(node, parent.firstChild || null);
              return true;
            }
          } catch (e) {
            try {
              console.error("[enhanceApp] safeAppend failed", e);
            } catch (err) {}
          }
          return false;
        };

        if (document.body) {
          const appended = safeAppend(document.body, nav);
          if (appended) {
            requestAnimationFrame(() =>
              nav.classList.add("category-nav--visible")
            );
          } else {
            // body があるが append に失敗した場合は load イベントで再試行
            window.addEventListener("load", () => {
              try {
                const ok = safeAppend(document.body, nav);
                if (ok)
                  requestAnimationFrame(() =>
                    nav.classList.add("category-nav--visible")
                  );
              } catch (e) {
                try {
                  console.error(
                    "[enhanceApp] failed to append category nav after load",
                    e
                  );
                } catch (err) {}
              }
            });
          }
        } else {
          // body がまだない場合は load イベント後に追加
          window.addEventListener("load", () => {
            try {
              const ok = safeAppend(document.body, nav);
              if (ok)
                requestAnimationFrame(() =>
                  nav.classList.add("category-nav--visible")
                );
            } catch (e) {
              try {
                console.error(
                  "[enhanceApp] failed to append category nav after load",
                  e
                );
              } catch (err) {}
            }
          });
        }
      };

      // 記事本文の末尾にシェアボタンを挿入する
      const addShareButtons = () => {
        try {
          // 記事本文を想定する要素（.content, .article, .page, .theme-default-content など）
          const articleEl =
            document.querySelector(".page .content") ||
            document.querySelector(".theme-default-content") ||
            document.querySelector("article") ||
            document.querySelector(".post");
          if (!articleEl) return;

          // 既に追加済みなら何もしない
          if (articleEl.querySelector(".share-buttons")) return;

          // Create wrapper and mount component markup
          const wrapper = document.createElement("div");
          wrapper.className = "share-buttons-wrapper";
          // Insert at the end of article using safeAppend
          const safeAppendLocal = (parent, node) => {
            try {
              if (!isSafeParent(parent, node)) return false;
              if (typeof parent.appendChild === "function") {
                parent.appendChild(node);
                return true;
              }
            } catch (e) {
              try {
                console.error("[enhanceApp] safeAppendLocal failed", e);
              } catch (err) {}
            }
            return false;
          };

          safeAppendLocal(articleEl, wrapper);

          // Use Vue to mount the component into the wrapper
          try {
            // eslint-disable-next-line no-undef
            const Share = Vue.extend(ShareButtons);
            const title = document.title || "";
            const url = window.location.href;
            new Share({ propsData: { title, url } }).$mount(wrapper);
          } catch (e) {
            // Fallback: insert simple links if Vue mounting fails
            wrapper.innerHTML = `<div class="share-buttons"><a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(
              document.title
            )}&url=${encodeURIComponent(
              window.location.href
            )}" target="_blank">Twitter</a></div>`;
          }
        } catch (e) {
          try {
            console.error("[enhanceApp] addShareButtons failed", e);
          } catch (err) {}
        }
      };

      // 初回と遷移後に差し込む
      addShareButtons();
      router.afterEach(() => requestAnimationFrame(() => addShareButtons()));

      // 記事上部にパンくずを挿入する（Breadcrumb.vue コンポーネントをマウント）
      const mountBreadcrumbComponent = (rootVue) => {
        try {
          const articleEl =
            document.querySelector(".page .content") ||
            document.querySelector(".theme-default-content") ||
            document.querySelector("article") ||
            document.querySelector(".post");
          if (!articleEl) return;
          // 既に追加済みなら何もしない
          if (articleEl.querySelector(".breadcrumb")) return;

          // wrapper を作成して記事先頭に挿入
          const wrapper = document.createElement("div");
          wrapper.className = "breadcrumb-wrapper";
          // safe insert at beginning
          try {
            if (
              articleEl &&
              articleEl.nodeType === 1 &&
              isSafeParent(articleEl, wrapper)
            ) {
              if (
                articleEl.firstChild &&
                typeof articleEl.insertBefore === "function" &&
                isSafeParent(articleEl, wrapper)
              ) {
                articleEl.insertBefore(wrapper, articleEl.firstChild);
              } else if (
                typeof articleEl.appendChild === "function" &&
                isSafeParent(articleEl, wrapper)
              ) {
                articleEl.appendChild(wrapper);
              }
            }
          } catch (e) {
            try {
              console.error(
                "[enhanceApp] failed to insert breadcrumb wrapper",
                e
              );
            } catch (err) {}
          }

          // Breadcrumb コンポーネントを rootVue を親にしてマウントする
          try {
            const BreadcrumbCtor = Vue.extend(Breadcrumb);
            new BreadcrumbCtor({ parent: rootVue }).$mount(wrapper);
          } catch (e) {
            // フォールバック: 単純なテキストを入れる
            wrapper.innerHTML =
              '<nav class="breadcrumb"><ul class="breadcrumb-list"><li class="breadcrumb-item">/</li></ul></nav>';
          }
        } catch (e) {
          try {
            console.error("[enhanceApp] mountBreadcrumbComponent failed", e);
          } catch (err) {}
        }
      };

      // root Vue インスタンスがマウントされたタイミングでパンくずをマウントする
      Vue.mixin({
        mounted() {
          // 確実にクライアントサイドで実行されていることを確認
          if (typeof window === "undefined" || typeof document === "undefined") return;
          
          try {
            if (this.$root === this) {
              // this は root Vue インスタンス
              mountBreadcrumbComponent(this);
              router.afterEach(() =>
                requestAnimationFrame(() => mountBreadcrumbComponent(this))
              );
            }
          } catch (e) {
            try {
              console.error("[enhanceApp] breadcrumb mixin error", e);
            } catch (err) {}
          }
        },
      });

      // 初回追加（遅延は除去して即時挿入）
      addCategoryNav();

      // ページ変更時に存在しなければ追加（SPA遷移対策）
      router.afterEach(() => {
        if (!document.querySelector(".category-nav")) {
          addCategoryNav();
        }
      });
    });
  }
};
