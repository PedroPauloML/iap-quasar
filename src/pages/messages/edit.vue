<template>
  <div id="edit-new">
    <Form
      v-if="message"
      :data="message"
      @closeForm="closeEditingForm"
      @updateMessage="(id, message) => updateMessage(id, message)"
    />
    <div v-else class="mb-3 body-2">
      <v-progress-linear indeterminate></v-progress-linear>
      <p class="text-center mt-5">
        Estamos preparando a mensagem...
      </p>
    </div>
  </div>
</template>

<script>
import Form from "../../components/messages/Form";

export default {
  components: { Form },
  data() {
    return {
      message: null,
      showEditingForm: false,
    };
  },
  created() {
    this.$store.dispatch("messages/loadMessages").then(this.findMessage);
    this.$emit("setBackRoute", {
      name: "messages_show",
      params: { id: this.$route.params.id },
    });
  },
  methods: {
    findMessage() {
      this.message = this.$store.state.messages.messages.find(
        (el) => el.id == this.$route.params.id
      );
    },
    updateMessage(payload) {
      this.$store.dispatch("messages/updateMessage", payload).then(() => {
        this.$router.push({
          name: "messages_show",
          params: { id: this.$route.params.id },
        });
      });
    },
    closeEditingForm() {
      this.$router.push({
        name: "messages_show",
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
