<template>
  <div id="schedule">
    <Schedule
      v-if="schedule"
      :id="schedule.id"
      :title="schedule.title"
      :description="schedule.description"
      :date_start="schedule.date_start"
      :date_end="schedule.date_end"
      :image="schedule.image"
      :location="schedule.location"
      :solo="true"
      @onDestroy="$router.push({ name: 'schedules' })"
    />
    <q-linear-progress v-else indeterminate color="primary" />
  </div>
</template>

<script>
import Schedule from "../../components/schedules/Component";

export default {
  components: { Schedule },
  data() {
    return {
      back_router: "/schedules",
      schedule: null
    };
  },
  created() {
    this.$store.dispatch("schedules/loadSchedules").then(this.findSchedule);
    this.$emit("setBackRoute", { name: "schedules" });
  },
  methods: {
    findSchedule() {
      this.schedule = this.$store.state.schedules.schedules.find(
        el => el.id == this.$route.params.id
      );
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  }
};
</script>

<style></style>
