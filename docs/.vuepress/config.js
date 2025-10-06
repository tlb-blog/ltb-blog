module.exports = {
  // base を環境変数 `BASE_URL` から読み取れるようにしておくと
  // - ローカル開発では '/' を使い、
  // - GitHub Actions 等でプロジェクトページを公開する際は '/<repo>/' を渡せます。
  base: process.env.BASE_URL || "/",
  title: "ライフスタイル & テクノロジーブログ",
  description: "ライフスタイルとテクノロジーを横断する情報サイト",
  // テーマやカスタムヘッダが参照しやすいトップレベルのロゴ設定
  logo: "/logo.png",
  theme: "vuepress-theme-blog-vuetify",

  // ヘッド要素の設定
  head: [
    ["link", { rel: "icon", href: "/avatar.svg" }],
    ["meta", { name: "theme-color", content: "#000000" }],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],

  themeConfig: {
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
    logo: "/logo.png",

    // カテゴリ別のディレクトリ設定
    directories: [
      {
        id: "health",
        dirname: "health",
        path: "/post/health/",
        title: "健康",
      },
      {
        id: "nba",
        dirname: "nba",
        path: "/post/nba/",
        title: "NBA",
      },
      {
        id: "ai",
        dirname: "ai",
        path: "/post/ai/",
        title: "AI",
      },
      {
        id: "post",
        dirname: "post",
        path: "/post/",
        title: "その他",
      },
    ],

    sidebar: {
      profile: {
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
