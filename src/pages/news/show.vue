<template>
  <div id="new">
    <div v-if="fetchingNews">
      <q-linear-progress indeterminate color="primary" />
    </div>
    <News
      v-else
      :data="news"
      :coverRatio="16 / 9"
      :metadata="{ read_time: true }"
      @onDestroy="$router.push({ name: 'news' })"
    />
  </div>
</template>

<script>
import NewsRequest from "src/services/requests/news";

import News from "../../components/news/Component";

export default {
  components: { News },
  data() {
    return {
      back_router: "/news",
      news: null,

      fetchingNews: false
    };
  },
  created() {
    this.$emit("setBackRoute", { name: "news" });
    this.findNews();
  },
  methods: {
    findNews() {
      if (!this.fetchingNews) {
        this.fetchingNews = true;

        NewsRequest.find(this.$route.params.id)
          .then(res => {
            if (res) {
              this.news = res.data;
            }

            this.fetchingNews = false;
          })
          .catch(err => {
            if (err) {
              if (err.response && err.response.data.error.message) {
                this.$q.notify({
                  message: err.response.data.error.message,
                  icon: "info",
                  color: "negative"
                });
              } else {
                this.$q.notify({
                  message:
                    "Ocorreu um erro ao tentar encontrar a notícia. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                  icon: "info",
                  color: "negative"
                });
              }

              this.fetchingNews = false;
            }
          });
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  }
};
</script>

<style></style>
