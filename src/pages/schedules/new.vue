<template>
  <div id="edit-new">
    <Form
      @closeForm="goToSchedules"
      @createSchedule="(data) => createSchedule(data)"
    />
  </div>
</template>

<script>
import Form from "../../components/schedules/Form";

export default {
  components: { Form },
  created() {
    this.$emit("setBackRoute", {
      name: "schedules",
    });
  },
  methods: {
    createSchedule(schedule) {
      this.$store.dispatch("schedules/addSchedule", schedule);
      this.goToSchedules();
    },
    goToSchedules() {
      this.$router.push({ name: "schedules" });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  },
};
</script>

<style></style>
