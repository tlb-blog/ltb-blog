# VuePress ブログ デプロイメント マニュアル

## 🔄 デプロイの仕組み

### 現在の正しいワークフロー

1. **mainブランチで作業**
   - 記事の追加・編集
   - 設定変更
   - サムネイル画像の追加

2. **mainブランチにコミット・プッシュ**
   ```bash
   git add .
   git commit -m "記事追加/修正内容"
   git push origin main
   ```

3. **GitHub Actions自動実行**
   - `.github/workflows/gh-pages.yml`が自動実行される
   - VuePressのビルドを行う
   - パッチスクリプト(`scripts/patch-dist.ps1`)でパス修正
   - GitHub Pagesに自動デプロイ

### ⚠️ 重要な注意点

**`gh-pages`ブランチには直接コミットしないでください！**

- `gh-pages`ブランチはGitHub Actionsが自動生成するもの
- 手動でコミットすると自動デプロイが壊れる可能性がある
- 常に`main`ブランチで作業する

## 📁 ディレクトリ構造

```
a-blog/
├── docs/                           # VuePressソースファイル
│   ├── .vuepress/
│   │   ├── config.js              # VuePress設定
│   │   └── dist/                  # ビルド成果物（gitignore）
│   └── post/                      # 記事ファイル
├── .gh-pages/                     # GitHub Actionsビルド成果物（手動修正禁止）
├── scripts/
│   ├── patch-dist.ps1            # パス修正スクリプト
│   └── thumbnail-fix-manual.ps1  # サムネイル修正スクリプト（緊急用）
└── .github/workflows/
    └── gh-pages.yml              # GitHub Actions設定
```

## 🚀 デプロイ手順

### 日常的な記事投稿・更新

1. **記事作成/編集**
   ```bash
   # 新しい記事作成
   docs/post/カテゴリ名/記事名.md
   ```

2. **画像追加**
   ```bash
   # サムネイル画像
   docs/.vuepress/public/article_images/カテゴリ名/サムネイル.png
   
   # 記事内画像
   docs/.vuepress/public/article_images/カテゴリ名/画像.png
   ```

3. **ローカル確認**
   ```bash
   npm run dev
   # http://localhost:8080 で確認
   ```

4. **デプロイ**
   ```bash
   git add .
   git commit -m "記事追加: タイトル"
   git push origin main
   ```

5. **結果確認**
   - GitHub Actionsの実行状況: https://github.com/tlb-blog/ltb-blog/actions
   - ライブサイト: https://tlb-blog.github.io/ltb-blog/
   - 通常1-3分で反映される

## 🔧 トラブルシューティング

### サムネイル画像が表示されない場合

1. **まず画像ファイルが存在するかチェック**
   ```bash
   # 画像ファイルパスの確認
   ls docs/.vuepress/public/article_images/health/
   ```

2. **記事のfrontmatterを確認**
   ```yaml
   ---
   title: 記事タイトル
   image: /article_images/health/サムネイル.png  # この部分
   ---
   ```

3. **緊急時のサムネイル修正**
   ```bash
   # 緊急用スクリプト実行（mainブランチで実行）
   .\scripts\thumbnail-fix-manual.ps1 docs\.vuepress\dist
   
   # その後通常のデプロイ
   git add .
   git commit -m "サムネイル修正"
   git push origin main
   ```

### GitHub Actions実行失敗の場合

1. **Actions画面で詳細確認**
   - https://github.com/tlb-blog/ltb-blog/actions
   - 失敗したワークフローをクリック
   - エラーログを確認

2. **よくある原因**
   - Node.jsのバージョン不一致
   - パッケージの依存関係エラー
   - パッチスクリプトの実行エラー

3. **修正後の再実行**
   ```bash
   # 修正後、空コミットで再実行
   git commit --allow-empty -m "GitHub Actions再実行"
   git push origin main
   ```

## 📋 設定ファイル

### VuePress設定 (docs/.vuepress/config.js)
```javascript
base: process.env.CI ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || 'ltb-blog'}/` : '/'
```

### GitHub Actions (/.github/workflows/gh-pages.yml)
- mainブランチへのプッシュで自動実行
- Node.js 18を使用
- `npm run build`でビルド
- `scripts/patch-dist.ps1`でパス修正
- GitHub Pagesに自動デプロイ

## ✅ チェックリスト

### 記事投稿前
- [ ] 画像ファイルが正しい場所にある
- [ ] frontmatterのimage属性が正しい
- [ ] ローカルでプレビュー確認済み

### デプロイ後
- [ ] GitHub Actionsが成功している
- [ ] ライブサイトで記事が表示される
- [ ] サムネイル画像が表示される
- [ ] 画像リンクが正常に動作する

## 🚨 緊急時の対応

### `.gh-pages`ディレクトリを誤って修正した場合

1. **worktreeをリセット**
   ```bash
   git worktree remove -f .gh-pages
   git worktree prune
   git worktree add .gh-pages origin/gh-pages
   ```

2. **mainブランチで再デプロイ**
   ```bash
   git commit --allow-empty -m "緊急デプロイ"
   git push origin main
   ```

### サイト全体が表示されない場合

1. **GitHub Pages設定確認**
   - Settings → Pages
   - Source: GitHub Actions に設定されている事を確認

2. **強制リビルド**
   ```bash
   git commit --allow-empty -m "Force rebuild"
   git push origin main
   ```

---

**⚠️ 重要な原則:**
- **常にmainブランチで作業する**
- **gh-pagesブランチには直接コミットしない**
- **問題があってもまずmainブランチで修正してからプッシュする**