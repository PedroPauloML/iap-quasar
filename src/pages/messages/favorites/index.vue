<template>
  <div id="favorite-messages">
    <transition
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      mode="out-in"
    >
      <div v-if="loading">
        <q-linear-progress indeterminate color="primary" />
      </div>

      <div v-else-if="messages.length > 0">
        <Message
          v-for="(message, index) in messages"
          :key="index"
          :data="message"
          :metadata="{ read_time: true }"
          class="q-mb-lg"
        />
      </div>

      <div v-else class="flex no-wrap items-center justify-center">
        <q-icon name="auto_stories" size="40px" class="q-mr-lg" />
        <span class="text-h6">
          Nenhuma mensagem favoritada, ainda.
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import FavoriteMessageRequest from "src/services/requests/message/favorite";

import Message from "src/components/messages/Component";

export default {
  components: { Message },
  data() {
    return {
      messages: [],
      pagination: {
        current_page: 1,
        total_objects: 0,
        per_page: 10,
        total_pages: 2
      },

      // Loading variables
      loading: false
    };
  },
  created() {
    this.$emit("setBackRoute", { name: "messages" });
    this.fetchFavorites();
  },
  computed: {
    canFetchMoreFavoriteMessages() {
      return this.pagination.current_page < this.pagination.total_pages;
    }
  },
  methods: {
    fetchFavorites() {
      if (!this.loading && this.canFetchMoreFavoriteMessages) {
        this.loading = true;

        let { current_page, per_page } = this.pagination;

        FavoriteMessageRequest.index(current_page, per_page)
          .then(res => {
            if (res) {
              this.messages = res.data.objects;
              this.pagination = res.data.pagination;
              this.pagination.current_page += 1;
            }

            this.loading = false;
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
                    "Ocorreu um erro ao tentar buscar as mensagens favoritas. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                  icon: "info",
                  color: "negative"
                });
              }

              this.loading = false;
            }
          });
      }
    }
  }
};
</script>

<style></style>
