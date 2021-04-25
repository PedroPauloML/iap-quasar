<template>
  <div id="edit-message">
    <div v-if="fetchingMessage">
      <q-linear-progress indeterminate color="primary" />
    </div>
    <Form v-else :data="message" />
  </div>
</template>

<script>
import MessageRequest from "src/services/requests/message";

import Form from "../../components/messages/Form";

export default {
  components: { Form },
  data() {
    return {
      message: null,
      fetchingMessage: false
    };
  },
  created() {
    this.$emit("setBackRoute", {
      name: "messages_show",
      params: { id: this.$route.params.id }
    });
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
            }

            this.fetchingMessage = false;
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
                      "Ocorreu um erro ao tentar encontrar a mensagem. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                    icon: "info",
                    color: "negative"
                  });
                }
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
