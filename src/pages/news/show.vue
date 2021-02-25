<template>
  <div id="new">
    <News
      v-if="news"
      :id="news.id"
      :title="news.title"
      :caption="news.caption"
      :image="{
        url: news.image,
        //ratio: $vuetify.breakpoint.xs ? '1.2' : '2.5',
        ratio: 16 / 9,
      }"
      :content="news.content"
      :metadata="news.metadata"
      :tags="news.tags"
      @onDestroy="$router.push({ name: 'news' })"
    />
    <div v-else class="mb-3 body-2">
      <v-progress-linear indeterminate></v-progress-linear>
      <p class="text-center mt-5">
        Estamos preparando a notícia...
      </p>
    </div>
  </div>
</template>

<script>
import News from "../../components/news/Component";

export default {
  components: { News },
  data() {
    return {
      back_router: "/news",
      news: null,
    };
  },
  created() {
    this.$store.dispatch("news/loadNews").then(this.findNews);
    this.$emit("setBackRoute", { name: "news" });
  },
  methods: {
    findNews() {
      this.news = this.$store.state.news.news.find(
        (el) => el.id == this.$route.params.id
      );
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  },
};
</script>

<style></style>
