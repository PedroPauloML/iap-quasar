<template>
  <div id="edit-new">
    <Form />
  </div>
</template>

<script>
import Form from "../../components/news/Form";

export default {
  components: { Form },
  created() {
    this.$emit("setBackRoute", {
      name: "news"
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  }
};
</script>

<style></style>
