module.exports = {
  // base を環境変数 `BASE_URL` から読み取れるようにしておくと
  // - ローカル開発では '/' を使い、
  // - GitHub Actions 等でプロジェクトページを公開する際は '/<repo>/' を渡せます。
  // ビルド時に環境変数 BASE_URL を渡す運用のままにできますが、
  // リポジトリのプロジェクトページとして公開しているため、
  // デフォルトは '/ltb-blog/' にしておくとミスが少なくなります。
  // ※ 必要ならローカル開発時に環境変数で '/' を渡して戻せます。
  base: process.env.BASE_URL || "/ltb-blog/",
  title: "ライフスタイル & テクノロジーブログ",
  description: "ライフスタイルとテクノロジーを横断する情報サイト",

  // SSRの設定 - Vuetifyコンポーネントの互換性向上
  ssr: {
    shouldPrefetch: () => false,
  },

  // テーマやカスタムヘッダが参照しやすいトップレベルのロゴ設定
  // public 配下のファイルはルート相対で指定し、ビルド時に base が付与されるようにする
  // logo: "/logo.png", // enhanceApp.jsで動的に追加するためコメントアウト
  theme: "vuepress-theme-blog-vuetify",

  // Configure plugins at the top level so VuePress recognizes them.
  // Limit medium-zoom to article/content images and explicitly exclude
  // card thumbnails which use the `.post-image` class.
  plugins: [
    [
      "@vuepress/plugin-medium-zoom",
      {
        selector:
          ".theme-default-content img:not(.post-image), article img:not(.post-image), .theme-default-content picture img:not(.post-image)",
      },
    ],
  ],

  // ヘッド要素の設定
  head: [
    ["link", { rel: "icon", href: "/avatar.svg" }],
    ["meta", { name: "theme-color", content: "#000000" }],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    // Google Analytics 4 (gtag.js) - Measurement ID added per user
    [
      "script",
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-THN3TRJ81V",
      },
    ],
    [
      "script",
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-THN3TRJ81V');",
    ],
  ],

  themeConfig: {
    // 検索機能の設定
    search: true,
    searchMaxSuggestions: 10,

    // ダークテーマを有効化
    vuetify: {
      theme: {
        dark: true,
        themes: {
          dark: {
            primary: "#ffffff",
            secondary: "#424242",
            accent: "#000000",
            background: "#121212",
            surface: "#1e1e1e",
          },
        },
      },
    },
    // テーマ組み込みのロゴ（public 配下のファイルへのパス）
    // logo: "/logo.png", // enhanceApp.jsで動的に追加するためコメントアウト

    // カテゴリ別のディレクトリ設定
    directories: [
      {
        id: "health",
        dirname: "post/health",
        path: "/post/health/",
        title: "健康",
        itemPermalink: "/post/health/:slug",
        layout: "IndexPost",
        itemLayout: "Post",
      },
      {
        id: "nba",
        dirname: "post/nba",
        path: "/post/nba/",
        title: "NBA",
        itemPermalink: "/post/nba/:slug",
        layout: "IndexPost",
        itemLayout: "Post",
      },
      {
        id: "ai",
        dirname: "post/ai",
        path: "/post/ai/",
        title: "AI",
        itemPermalink: "/post/ai/:slug",
        layout: "IndexPost",
        itemLayout: "Post",
      },
      {
        id: "shose",
        dirname: "post/shose",
        path: "/post/shose/",
        title: "シューズ",
        itemPermalink: "/post/shose/:slug",
        layout: "IndexPost",
        itemLayout: "Post",
      },
      {
        id: "tech",
        dirname: "post/tech",
        path: "/post/tech/",
        title: "テクノロジー",
        itemPermalink: "/post/tech/:slug",
        layout: "IndexPost",
        itemLayout: "Post",
      },
    ],

    sidebar: {
      directoryIds: ["health", "nba", "ai", "shose", "tech"],
      profile: {
        // public 配下のアバターはルート相対で記述（ビルドで base が付与されます）
        avatarUrl: "/avatar.svg",
        name: "LTB",
        subTitle: "ライフスタイル・テクノロジー・知見",
        descriptionHtml:
          "生活と技術の交差点から、実用的な知見と読み物をお届けします。",
      },
      // カテゴリ別の最新記事表示
      hotTags: 8,
      recentPosts: 5,
    },
  },
};
