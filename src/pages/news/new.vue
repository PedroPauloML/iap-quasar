<template>
  <div id="edit-new">
    <Form @closeForm="goToNews" @createNews="(data) => createNews(data)" />
  </div>
</template>

<script>
import Form from "../../components/news/Form";

export default {
  components: { Form },
  data() {
    return {
      news: null,
    };
  },
  created() {
    this.$emit("setBackRoute", {
      name: "news",
    });
  },
  methods: {
    findNews() {
      this.news = this.$store.state.news.news.find(
        (el) => el.id == this.$route.params.id
      );
    },
    createNews(news) {
      this.$store.dispatch("news/addNews", news);
      this.goToNews();
    },
    goToNews() {
      this.$router.push({ name: "news" });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  },
};
</script>

<style></style>
