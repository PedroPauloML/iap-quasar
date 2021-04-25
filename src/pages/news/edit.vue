<template>
  <div id="edit-new">
    <div v-if="fetchingNews">
      <q-linear-progress indeterminate color="primary" />
    </div>
    <Form v-else :data="news" />
  </div>
</template>

<script>
import NewsRequest from "src/services/requests/news";

import Form from "../../components/news/Form";

export default {
  components: { Form },
  data() {
    return {
      news: null,
      fetchingNews: false
    };
  },
  created() {
    this.$emit("setBackRoute", {
      name: "news_show",
      params: { id: this.$route.params.id }
    });
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
              if (err.response && err.response.status != 404) {
                if (err.response.data.error.message) {
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
