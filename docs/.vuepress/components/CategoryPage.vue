<template>
  <div class="category-page">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <!-- カテゴリタイトルと説明 -->
          <h1 class="category-title">{{ title }}</h1>
          <p class="category-description">{{ description }}</p>

          <!-- 記事カード一覧 -->
          <v-row v-if="posts.length > 0">
            <v-col
              v-for="post in posts"
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
          </v-row>

          <!-- 記事がない場合 -->
          <v-alert v-else type="info" dense> まだ記事がありません。 </v-alert>

          <!-- デバッグ情報 -->
          <div v-if="debug" class="debug-info">
            <h3>デバッグ情報</h3>
            <p>カテゴリ: {{ category }}</p>
            <p>全ページ数: {{ allPages.length }}</p>
            <p>フィルタ後記事数: {{ posts.length }}</p>
            <details>
              <summary>記事一覧</summary>
              <pre>{{ JSON.stringify(posts, null, 2) }}</pre>
            </details>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "CategoryPage",
  props: {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "カテゴリ",
    },
    description: {
      type: String,
      default: "",
    },
    debug: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    allPages() {
      return (this.$site && this.$site.pages) || [];
    },
    posts() {
      console.log("CategoryPage - category:", this.category);
      console.log("CategoryPage - allPages:", this.allPages.length);

      const filtered = this.allPages
        .filter(
          (p) => p.frontmatter && p.frontmatter.category === this.category
        )
        .filter((p) => p.frontmatter && (p.frontmatter.date || p.date))
        .map((p) => this.normalizePage(p))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("CategoryPage - filtered result:", filtered);
      return filtered;
    },
  },
  mounted() {
    console.log("CategoryPage mounted with props:", this.$props);
    console.log("All pages:", this.allPages.length);
  },
  methods: {
    normalizePage(p) {
      return {
        title: p.title || (p.frontmatter && p.frontmatter.title) || "無題",
        path: p.path || (p.frontmatter && p.frontmatter.path) || "/",
        description: (p.frontmatter && p.frontmatter.description) || "",
        excerpt: p.excerpt || "",
        date: (p.frontmatter && p.frontmatter.date) || p.date || null,
        image:
          (p.frontmatter && (p.frontmatter.image || p.frontmatter.thumbnail)) ||
          null,
        tags: (p.frontmatter && p.frontmatter.tags) || [],
        category: (p.frontmatter && p.frontmatter.category) || null,
      };
    },
  },
};
</script>

<style scoped>
.category-page {
  padding: 20px 0;
}

.category-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.category-description {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 32px;
  line-height: 1.6;
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

.debug-info {
  margin-top: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.debug-info h3 {
  margin-top: 0;
}

.debug-info pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
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

  .category-title {
    font-size: 1.5rem;
  }
}
</style>
