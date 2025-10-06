# ltb-blog

## GitHub Pages へのデプロイ

このサイトは VuePress で生成され、`docs/.vuepress/dist` にビルドされます。GitHub Actions を使って自動デプロイする場合は、リポジトリの `main`（または `master`）ブランチに push するだけで、ワークフローが `gh-pages` ブランチへ公開します。

ローカル開発で `base` を指定する必要がある場合（プロジェクトページとして公開する場合）は、Actions 実行時に環境変数 `BASE_URL` を `/your-repo-name/` に設定してビルドするか、`docs/.vuepress/config.js` の `base` 値を直接編集してください。

## 画像パス修正

GitHub Pages での正常なサムネイル画像表示のため、ビルド後に自動でパッチが適用されます。
