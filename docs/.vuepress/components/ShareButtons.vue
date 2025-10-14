<template>
  <div class="share-buttons">
    <span class="share-label">この記事を共有：</span>
    <a
      :href="twitterUrl"
      class="btn x"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share on X (旧Twitter)"
    >
      <!-- X icon (simple) -->
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43 1c-.88.52-1.86.9-2.9 1.11A4.48 4.48 0 0 0 12.07 6.5v.56A12.94 12.94 0 0 1 3 2s-4 9 5 13a13 13 0 0 1-8 2c9 5 20 0 20-11.5A4.5 4.5 0 0 0 23 3z"
          fill="currentColor"
        />
      </svg>
      <span>X</span>
    </a>
    <a
      :href="facebookUrl"
      class="btn facebook"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share on Facebook"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z"
          fill="currentColor"
        />
      </svg>
      <span>Facebook</span>
    </a>
    <a
      :href="lineUrl"
      class="btn line"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share on LINE"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M21 2H3a1 1 0 0 0-1 1v18l4-4h15a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"
          fill="currentColor"
        />
      </svg>
      <span>LINE</span>
    </a>
    <a
      :href="hatenaUrl"
      class="btn hatena"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share on はてブ"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.2 0 4.22-.72 5.83-1.94L22 22V2h-10z"
          fill="currentColor"
        />
      </svg>
      <span>はてブ</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "ShareButtons",
  props: {
    title: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  computed: {
    twitterUrl() {
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        this.title
      )}&url=${encodeURIComponent(this.url)}`;
    },
    facebookUrl() {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        this.url
      )}`;
    },
    lineUrl() {
      return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        this.url
      )}`;
    },
    hatenaUrl() {
      return `https://b.hatena.ne.jp/add?mode=confirm&url=${encodeURIComponent(
        this.url
      )}&title=${encodeURIComponent(this.title)}`;
    },
  },
};
</script>

<style scoped>
.share-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 24px;
}
.share-label {
  margin-right: 8px;
  color: #555;
}
.share-buttons .btn {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  background: #f1f3f5;
  padding: 6px 10px;
  border-radius: 8px;
  text-decoration: none;
  color: #222;
  font-weight: 600;
}
.share-buttons .btn svg {
  width: 16px;
  height: 16px;
}
.share-buttons .btn:hover {
  background: #e9eefb;
  color: #0b63d6;
}
.share-buttons .btn.facebook:hover {
  background: #e7f0ff;
}
.share-buttons .btn.line:hover {
  background: #e6f9ec;
}
.share-buttons .btn.hatena:hover {
  background: #f8f8ff;
}
</style>
