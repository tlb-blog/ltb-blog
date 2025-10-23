<template>
  <v-app-bar
    app
    fixed
    :dark="$vuetify.theme.dark"
    :color="$vuetify.theme.dark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)'"
    style="backdrop-filter: blur(10px)"
    elevation="1"
  >
    <!-- サイトタイトル -->
    <v-toolbar-title>
      <router-link to="/" style="text-decoration: none; color: inherit">
        {{ $site.title }}
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- デスクトップ用ナビゲーション -->
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn text :to="'/'">
        <i class="fa-solid fa-house me-1"></i>
        ホーム
      </v-btn>

      <v-btn text :to="'/health/'">
        <i class="fa-solid fa-heart me-1"></i>
        健康
      </v-btn>

      <v-btn text :to="'/parenting/'">
        <i class="fa-solid fa-children me-1"></i>
        子育て
      </v-btn>

      <v-btn text :to="'/nba/'">
        <i class="fa-solid fa-trophy me-1"></i>
        NBA
      </v-btn>

      <v-btn text :to="'/ai/'">
        <i class="fa-solid fa-robot me-1"></i>
        AI
      </v-btn>

      <v-btn text :to="'/post/shose/'">
        <i class="fa-solid fa-shoe-prints me-1" aria-hidden="true"></i>
        シューズ
      </v-btn>

      <!-- カテゴリドロップダウン -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left>mdi-menu-down</v-icon>
            すべて
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/health/'">
            <v-list-item-icon>
              <i class="fa-solid fa-heart"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>健康</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/parenting/'">
            <v-list-item-icon>
              <i class="fa-solid fa-children"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>子育て</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/nba/'">
            <v-list-item-icon>
              <i class="fa-solid fa-trophy"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>NBA</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/ai/'">
            <v-list-item-icon>
              <i class="fa-solid fa-robot"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>AI</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/post/shose/'">
            <v-list-item-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="nav-icon" aria-hidden="true">
                <path d="M2.5 14c1-3.5 6-6 10-6 2.5 0 5 1 7 3v2c-2-1-5-2-8-2-4 0-7 1-9 3z"/>
                <path d="M3.5 15.5c1-.6 3-1 6-1 2 0 3.5.4 5 .9" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="7.2" cy="9.6" r="0.45"/>
                <circle cx="9.0" cy="9.3" r="0.45"/>
                <circle cx="10.6" cy="9.1" r="0.45"/>
              </svg>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>シューズ</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/post/'">
            <v-list-item-icon>
              <i class="bi bi-three-dots"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>その他</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>

    <!-- モバイル用ハンバーガーメニュー -->
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <!-- モバイル用ナビゲーションドロワー -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      :dark="$vuetify.theme.dark"
    >
      <v-list>
        <v-list-item :to="'/'">
          <v-list-item-icon>
            <i class="fa-solid fa-house"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ホーム</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-subheader>カテゴリ</v-subheader>

        <v-list-item :to="'/health/'">
          <v-list-item-icon>
            <i class="fa-solid fa-heart"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>健康</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/parenting/'">
          <v-list-item-icon>
            <i class="fa-solid fa-children"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>子育て</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/nba/'">
          <v-list-item-icon>
            <i class="fa-solid fa-trophy"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>NBA</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/ai/'">
          <v-list-item-icon>
            <i class="fa-solid fa-robot"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>AI</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/post/shose/'">
            <v-list-item-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="bi bi-shoe-prints" aria-hidden="true">
                <path d="M2.5 14c1-3.5 6-6 10-6 2.5 0 5 1 7 3v2c-2-1-5-2-8-2-4 0-7 1-9 3z"/>
                <path d="M3.5 15.5c1-.6 3-1 6-1 2 0 3.5.4 5 .9" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="7.2" cy="9.6" r="0.45"/>
                <circle cx="9.0" cy="9.3" r="0.45"/>
                <circle cx="10.6" cy="9.1" r="0.45"/>
              </svg>
            </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>シューズ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/post/'">
          <v-list-item-icon>
            <i class="fa-solid fa-ellipsis"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>その他</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script>
export default {
  name: "CategoryNavigation",
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style scoped>
.v-toolbar-title a {
  color: inherit !important;
  text-decoration: none !important;
  font-weight: 600 !important;
}

.v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
}

.v-app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
}

/* Font Awesome + SVG icon styling */
.fa, .fa-solid {
  font-size: 16px;
  vertical-align: middle;
}

.me-1 {
  margin-right: 4px;
}

/* Icon spacing for list items */
.v-list-item-icon .fa, .v-list-item-icon .nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-icon {
  display: inline-block;
  width: 20px;
  text-align: center;
  margin-right: 6px;
  font-size: 18px;
  line-height: 1;
}
</style>