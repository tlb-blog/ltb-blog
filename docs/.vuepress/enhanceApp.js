import CategoryNavigation from "./components/CategoryNavigation.vue";
import HomePosts from "./components/HomePosts.vue";
import CategoryPage from "./components/CategoryPage.vue";

export default ({ Vue, options, router, siteData }) => {
  Vue.component("CategoryNavigation", CategoryNavigation);
  Vue.component("HomePosts", HomePosts);
  Vue.component("CategoryPage", CategoryPage);

  // ヘッダーナビゲーションを動的に追加
  if (typeof window !== "undefined") {
    Vue.nextTick(() => {
      // ヘッダにロゴを挿入する（クライアントサイドのみ）
      const addHeaderLogo = () => {
        // 既に挿入済みなら何もしない
        if (document.querySelector(".site-logo")) return;

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

        if (!contentEl) return; // 見つからなければ抜ける

        // ロゴ要素を作成
  const a = document.createElement("a");
  // siteData.base を使用して、プロジェクトページの base を考慮したリンクを生成
  const base = (siteData && siteData.base) || "/";
  a.href = base;
        a.className = "site-logo";
        a.style.display = "inline-flex";
        a.style.alignItems = "center";
        a.style.marginRight = "12px";
        a.style.textDecoration = "none";

    const img = document.createElement("img");
    // public 配下の logo.png を base を組み合わせて参照
  img.src = (base === "/" ? "/" : base) + "logo.png";
        img.alt = document.title || "logo";
        img.style.height = "40px";
        img.style.width = "auto";
        img.style.display = "block";

        a.appendChild(img);

        // contentEl の中で .v-toolbar__title を見つけ、その前に挿入する。
        const titleEl = contentEl.querySelector(".v-toolbar__title");
        if (titleEl && titleEl.parentNode === contentEl) {
          contentEl.insertBefore(a, titleEl);
        } else if (titleEl) {
          // title が深くネストされている場合は titleEl の親の前に挿入
          titleEl.parentNode.insertBefore(a, titleEl.parentNode.firstChild);
        } else if (contentEl.firstChild) {
          contentEl.insertBefore(a, contentEl.firstChild);
        } else {
          contentEl.appendChild(a);
        }
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

        // カテゴリナビゲーションを作成（parentingリンクを削除）
        const nav = document.createElement("div");
        nav.className = "category-nav";
        nav.innerHTML = `
            <a href="/"><i class="bi bi-house me-5" aria-hidden="true"></i><span>ホーム</span></a>
            <a href="/post/ai/"><i class="bi bi-robot me-2" aria-hidden="true"></i><span>AI</span></a>
            <a href="/post/health/"><i class="bi bi-activity me-2" aria-hidden="true"></i><span>健康</span></a>
            <a href="/post/nba/"><i class="bi bi-trophy me-2" aria-hidden="true"></i><span>NBA</span></a>
            <a href="/post/"><i class="bi bi-three-dots me-2" aria-hidden="true"></i><span>その他</span></a>
          `;

        // まず非表示状態で挿入しておき、次フレームでクラスを付与してフェードイン
        document.body.appendChild(nav);
        // 強制レイアウトを避けるため requestAnimationFrame を使う
        requestAnimationFrame(() => {
          nav.classList.add("category-nav--visible");
        });
      };

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
