<template>
  <div id="edit-new">
    <Form
      v-if="news"
      :data="news"
      @closeForm="closeEditingForm"
      @updateNews="(id, news) => updateNews(id, news)"
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
import Form from "../../components/news/Form";

export default {
  components: { Form },
  data() {
    return {
      news: null,
      showEditingForm: false,
    };
  },
  created() {
    this.$store.dispatch("news/loadNews").then(this.findNews);
    this.$emit("setBackRoute", {
      name: "news_show",
      params: { id: this.$route.params.id },
    });
  },
  methods: {
    findNews() {
      this.news = this.$store.state.news.news.find(
        (el) => el.id == this.$route.params.id
      );
    },
    updateNews(payload) {
      this.$store.dispatch("news/updateNews", payload).then(() => {
        this.$router.push({
          name: "news_show",
          params: { id: this.$route.params.id },
        });
      });
    },
    closeEditingForm() {
      this.$router.push({
        name: "news_show",
        params: { id: this.$route.params.id },
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  },
};
</script>

<style></style>
