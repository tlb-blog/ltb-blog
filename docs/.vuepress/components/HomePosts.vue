<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="12">
        <!-- gridOnlyの場合はシンプルなグリッド表示のみ -->
        <!-- gridOnlyの場合はシンプルなグリッド表示のみ -->
        <div v-if="gridOnly || $props['grid-only']">
          <v-row>
            <v-col
              v-for="post in categoryPosts"
              :key="post.path"
              cols="12"
              sm="6"
              md="6"
            >
              <v-card class="post-card" :to="post.path" flat>
                <!-- サムネイル画像部分 -->
                <div class="post-image-container">
                  <v-img
                    v-if="post.image"
                    :src="post.image"
                    class="post-image"
                    cover
                  ></v-img>
                  <div v-else class="post-image placeholder-image"></div>
                </div>

                <!-- コンテンツ部分 -->
                <v-card-text class="post-content">
                  <v-card-title class="post-title">{{
                    post.title
                  }}</v-card-title>
                  <!-- tags -->
                  <div
                    v-if="post.tags && post.tags.length"
                    class="d-flex flex-wrap mb-2"
                  >
                    <v-chip
                      v-for="(tag, idx) in post.tags"
                      :key="idx"
                      small
                      class="ma-1"
                      outlined
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                  <v-card-subtitle
                    v-if="post.description"
                    class="post-excerpt"
                    >{{ post.description }}</v-card-subtitle
                  >
                  <v-card-text
                    v-else-if="post.excerpt"
                    class="post-excerpt pa-0"
                    >{{ post.excerpt }}</v-card-text
                  >
                </v-card-text>
              </v-card>
            </v-col>
            <v-col v-if="categoryPosts.length === 0" cols="12">
              <v-alert type="info" dense>まだ記事がありません。</v-alert>
            </v-col>
          </v-row>
        </div>

        <!-- 通常表示（ホームページ用：新着 + おすすめ） -->
        <div v-else>
          <h2 class="modern-text">Recent Posts</h2>
          <v-row>
            <v-col
              v-for="post in recentPosts"
              :key="post.path"
              cols="12"
              sm="6"
              md="6"
            >
              <v-card class="post-card" :to="post.path" flat>
                <!-- サムネイル画像部分 -->
                <div class="post-image-container">
                  <v-img
                    v-if="post.image"
                    :src="post.image"
                    class="post-image"
                    cover
                  ></v-img>
                  <div v-else class="post-image placeholder-image"></div>
                </div>

                <!-- コンテンツ部分 -->
                <v-card-text class="post-content">
                  <v-card-title class="post-title">{{
                    post.title
                  }}</v-card-title>
                  <!-- tags -->
                  <div
                    v-if="post.tags && post.tags.length"
                    class="d-flex flex-wrap mb-2"
                  >
                    <v-chip
                      v-for="(tag, idx) in post.tags"
                      :key="idx"
                      small
                      class="ma-1"
                      outlined
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                  <v-card-subtitle
                    v-if="post.description"
                    class="post-excerpt"
                    >{{ post.description }}</v-card-subtitle
                  >
                  <v-card-text
                    v-else-if="post.excerpt"
                    class="post-excerpt pa-0"
                    >{{ post.excerpt }}</v-card-text
                  >
                </v-card-text>
              </v-card>
            </v-col>
            <v-col v-if="recentPosts.length === 0" cols="12">
              <v-alert type="info" dense>まだ記事がありません。</v-alert>
            </v-col>
          </v-row>

          <h2 class="modern-text" style="margin-top: 32px">
            Recommended Posts
          </h2>
          <v-row>
            <v-col
              v-for="post in recommendedPosts"
              :key="post.path"
              cols="12"
              sm="6"
              md="6"
            >
              <v-card class="post-card" :to="post.path" flat>
                <!-- サムネイル画像部分 -->
                <div class="post-image-container">
                  <v-img
                    v-if="post.image"
                    :src="post.image"
                    class="post-image"
                    cover
                  ></v-img>
                  <div v-else class="post-image placeholder-image"></div>
                </div>

                <!-- コンテンツ部分 -->
                <v-card-text class="post-content">
                  <v-card-title class="post-title">{{
                    post.title
                  }}</v-card-title>
                  <!-- tags -->
                  <div
                    v-if="post.tags && post.tags.length"
                    class="d-flex flex-wrap mb-2"
                  >
                    <v-chip
                      v-for="(tag, idx) in post.tags"
                      :key="idx"
                      small
                      class="ma-1"
                      outlined
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                  <v-card-subtitle
                    v-if="post.description"
                    class="post-excerpt"
                    >{{ post.description }}</v-card-subtitle
                  >
                  <v-card-text
                    v-else-if="post.excerpt"
                    class="post-excerpt pa-0"
                    >{{ post.excerpt }}</v-card-text
                  >
                </v-card-text>
              </v-card>
            </v-col>
            <v-col v-if="recommendedPosts.length === 0" cols="12">
              <v-alert type="info" dense
                >おすすめ記事はまだ設定されていません。</v-alert
              >
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomePosts",
  props: {
    category: {
      type: String,
      default: null,
    },
    limit: {
      type: Number,
      default: 6,
    },
    gridOnly: {
      type: Boolean,
      default: false,
    },
    "grid-only": {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // 開発環境でのみコンソールログを出力
    if (process.env.NODE_ENV === 'development') {
      console.log("HomePosts mounted with props:", this.$props);
      console.log("Number of pages:", this.$site?.pages?.length);
      
      const pagesWithImages = this.$site?.pages?.filter(p => 
        p.frontmatter?.image || p.frontmatter?.thumbnail
      ) || [];
      console.log("Pages with images count:", pagesWithImages.length);
    }
  },
  computed: {
    allPages() {
      // this.$site.pages is provided by VuePress
      return (this.$site && this.$site.pages) || [];
    },
    // 推奨記事: frontmatter.recommended === true
    recommendedPosts() {
      return this.allPages
        .filter((p) => p.frontmatter && p.frontmatter.recommended)
        .filter((p) =>
          this.category
            ? p.frontmatter && p.frontmatter.category === this.category
            : true
        )
        .map((p) => this.normalizePage(p))
        .slice(0, this.limit);
    },
    // 新着記事: dateでソート（降順）
    recentPosts() {
      return this.allPages
        .filter((p) => p.frontmatter && (p.frontmatter.date || p.date))
        .filter((p) =>
          this.category
            ? p.frontmatter && p.frontmatter.category === this.category
            : true
        )
        .map((p) => this.normalizePage(p))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, this.limit);
    },
    // カテゴリの全記事（gridOnly用）
    categoryPosts() {
      if (!this.category) return [];
      console.log("CategoryPosts - category:", this.category);
      console.log("CategoryPosts - allPages:", this.allPages.length);

      const filtered = this.allPages
        .filter(
          (p) => p.frontmatter && p.frontmatter.category === this.category
        )
        .filter((p) => p.frontmatter && (p.frontmatter.date || p.date))
        .map((p) => this.normalizePage(p))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("CategoryPosts - filtered result:", filtered);
      return filtered;
    },
  },
  methods: {
    normalizePage(p) {
      // 画像パスを取得
      let imagePath = (p.frontmatter && (p.frontmatter.image || p.frontmatter.thumbnail)) || null;
      
      // 既にベースパスが含まれている場合は何もしない
      if (imagePath && imagePath.startsWith('/ltb-blog/')) {
        // そのまま使用
      }
      // VuePressの$withBaseヘルパーを使用（ベースパスがない場合のみ）
      else if (imagePath && imagePath.startsWith('/') && this.$withBase) {
        imagePath = this.$withBase(imagePath);
      }
      // フォールバック：手動でベースパスを追加
      else if (imagePath && imagePath.startsWith('/') && !imagePath.startsWith('/ltb-blog/')) {
        imagePath = `/ltb-blog${imagePath}`;
      }
      
      const normalizedPage = {
        title: p.title || (p.frontmatter && p.frontmatter.title) || "無題",
        path: p.path || (p.frontmatter && p.frontmatter.path) || "/",
        description: (p.frontmatter && p.frontmatter.description) || "",
        excerpt: p.excerpt || "",
        date: (p.frontmatter && p.frontmatter.date) || p.date || null,
        image: imagePath,
        tags: (p.frontmatter && p.frontmatter.tags) || [],
        category: (p.frontmatter && p.frontmatter.category) || null,
      };
      
      return normalizedPage;
    },
    formatDate(date) {
      if (!date) return "";
      try {
        const d = new Date(date);
        return d.toLocaleDateString();
      } catch (e) {
        return date;
      }
    },
  },
};
</script>

<style scoped>
.modern-text {
  margin: 0 0 12px 0;
  font-weight: 500;
}

.v-card {
  overflow: hidden;
}

/* 新しい縦型カードスタイル */
.post-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  border-color: #1976d2;
}

.post-image-container {
  width: 100%;
  height: 160px;
  position: relative;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  font-size: 48px;
}

.placeholder-image::before {
  content: "🚀";
}

.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px !important;
}

.post-title {
  font-size: 16px;
  line-height: 1.4;
  padding: 0 0 8px 0 !important;
  margin-bottom: 0;
  font-weight: 600;
  color: #2c3e50;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-excerpt {
  margin: 0;
  padding: 0 !important;
  font-size: 14px;
  line-height: 1.5;
  color: #6c757d;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* remove underline when v-card renders as an anchor */
.post-card[href],
.post-card a {
  text-decoration: none !important;
  color: inherit !important;
}
.post-card[href]:hover,
.post-card a:hover {
  text-decoration: none !important;
}

@media (max-width: 960px) {
  .post-image-container {
    height: 130px;
  }

  .post-title {
    font-size: 15px;
  }

  .post-excerpt {
    font-size: 13px;
  }
}

@media (max-width: 600px) {
  .post-image-container {
    height: 120px;
  }

  .post-content {
    padding: 12px !important;
  }
}
</style>
