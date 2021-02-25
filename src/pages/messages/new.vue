<template>
  <div id="edit-new">
    <Form
      @closeForm="goToMessages"
      @createMessage="(data) => createMessage(data)"
    />
  </div>
</template>

<script>
import Form from "../../components/messages/Form";

export default {
  components: { Form },
  created() {
    this.$emit("setBackRoute", {
      name: "messages",
    });
  },
  methods: {
    createMessage(message) {
      this.$store.dispatch("messages/addMessage", message);
      this.goToMessages();
    },
    goToMessages() {
      this.$router.push({ name: "messages" });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  },
};
</script>

<style></style>
