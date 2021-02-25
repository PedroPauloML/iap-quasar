<template>
  <div id="message">
    <Message
      v-if="message"
      :id="message.id"
      :title="message.title"
      :caption="message.caption"
      :content="message.content"
      :author="message.author"
      :published_at="message.published_at"
      :tags="Array.from(new Set(message.tags))"
      :metadata="{ read_time: true }"
      :full_content="true"
      @filterMessages="(search) => (value.search = search)"
      @onDestroy="$router.push({ name: 'messages' })"
      class="mb-10"
    />
    <v-row v-else align="center" justify="center">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </v-row>
  </div>
</template>

<script>
import Message from "../../components/messages/Component";

export default {
  components: { Message },
  data() {
    return {
      back_router: "/messages",
      message: null,
    };
  },
  created() {
    this.$store.dispatch("messages/loadMessages").then(this.findMessages);
    this.$emit("setBackRoute", { name: "messages" });
  },
  methods: {
    findMessages() {
      this.message = this.$store.state.messages.messages.find(
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
