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
        <i class="bi bi-house me-1"></i>
        ホーム
      </v-btn>

      <v-btn text :to="'/health/'">
        <i class="bi bi-activity me-1"></i>
        健康
      </v-btn>

      <v-btn text :to="'/parenting/'">
        <i class="bi bi-person-hearts me-1"></i>
        子育て
      </v-btn>

      <v-btn text :to="'/nba/'">
        <i class="bi bi-trophy me-1"></i>
        NBA
      </v-btn>

      <v-btn text :to="'/ai/'">
        <i class="bi bi-robot me-1"></i>
        AI
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
              <i class="bi bi-activity"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>健康</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/parenting/'">
            <v-list-item-icon>
              <i class="bi bi-person-hearts"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>子育て</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/nba/'">
            <v-list-item-icon>
              <i class="bi bi-trophy"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>NBA</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="'/ai/'">
            <v-list-item-icon>
              <i class="bi bi-robot"></i>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>AI</v-list-item-title>
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
            <i class="bi bi-house"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ホーム</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-subheader>カテゴリ</v-subheader>

        <v-list-item :to="'/health/'">
          <v-list-item-icon>
            <i class="bi bi-activity"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>健康</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/parenting/'">
          <v-list-item-icon>
            <i class="bi bi-person-hearts"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>子育て</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/nba/'">
          <v-list-item-icon>
            <i class="bi bi-trophy"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>NBA</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="'/ai/'">
          <v-list-item-icon>
            <i class="bi bi-robot"></i>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>AI</v-list-item-title>
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

/* Bootstrap Icons styling */
.bi {
  font-size: 16px;
  vertical-align: middle;
}

.me-1 {
  margin-right: 4px;
}

/* Icon spacing for list items */
.v-list-item-icon .bi {
  font-size: 18px;
  width: 24px;
  text-align: center;
}
</style>