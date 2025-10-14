<template>
  <div class="share-buttons">
    <span>この記事を共有：</span>
    <a :href="twitterUrl" target="_blank" rel="noopener noreferrer">Twitter</a>
    <a :href="facebookUrl" target="_blank" rel="noopener noreferrer">Facebook</a>
    <a :href="lineUrl" target="_blank" rel="noopener noreferrer">LINE</a>
    <a :href="hatenaUrl" target="_blank" rel="noopener noreferrer">はてブ</a>
  </div>
</template>

<script>
export default {
  name: "ShareButtons",
  props: {
    title: { type: String, default: '' },
    url: { type: String, default: '' }
  },
  computed: {
    twitterUrl() {
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.title)}&url=${encodeURIComponent(this.url)}`;
    },
    facebookUrl() {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.url)}`;
    },
    lineUrl() {
      return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(this.url)}`;
    },
    hatenaUrl() {
      return `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(this.url)}&title=${encodeURIComponent(this.title)}`;
    }
  }
};
</script>

<style scoped>
.share-buttons{display:flex;gap:8px;align-items:center;margin-top:24px}
.share-buttons a{background:#f1f3f5;padding:6px 10px;border-radius:6px;text-decoration:none;color:#222}
</style>