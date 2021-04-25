<template>
  <div id="message">
    <div v-if="fetchingMessage">
      <q-linear-progress indeterminate color="primary" />
    </div>
    <Message
      v-else
      :data="message"
      :metadata="{ read_time: true }"
      :full-content="true"
      @onDestroy="$router.push({ name: 'messages' })"
    />
  </div>
</template>

<script>
import MessageRequest from "src/services/requests/message";

import Message from "../../components/messages/Component";

export default {
  components: { Message },
  data() {
    return {
      back_router: "/messages",
      message: null,

      fetchingMessage: false
    };
  },
  created() {
    this.$emit("setBackRoute", { name: "messages" });
    this.findMessage();
  },
  methods: {
    findMessage() {
      if (!this.fetchingMessage) {
        this.fetchingMessage = true;

        MessageRequest.find(this.$route.params.id)
          .then(res => {
            if (res) {
              this.message = res.data;
              // ^(.+)(?=[|])
            }

            this.fetchingMessage = false;
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
                    "Ocorreu um erro ao tentar encontrar a mensagem. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                  icon: "info",
                  color: "negative"
                });
              }

              this.fetchingMessage = false;
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
