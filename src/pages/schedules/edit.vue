<template>
  <div id="edit-schedule">
    <Form
      v-if="schedule"
      :data="schedule"
      @closeForm="closeEditingForm"
      @updateSchedule="(id, schedule) => updateSchedule(id, schedule)"
    />
    <div v-else class="q-mb-md text-body2">
      <q-linear-progress indeterminate></q-linear-progress>
      <p class="text-center q-mt-lg">
        Estamos preparando a mensagem...
      </p>
    </div>
  </div>
</template>

<script>
import Form from "../../components/schedules/Form";

export default {
  components: { Form },
  data() {
    return {
      schedule: null,
      showEditingForm: false
    };
  },
  created() {
    this.$store.dispatch("schedules/loadSchedules").then(this.findSchedule);
    this.$emit("setBackRoute", {
      name: "schedules_show",
      params: { id: this.$route.params.id }
    });
  },
  methods: {
    findSchedule() {
      this.schedule = this.$store.state.schedules.schedules.find(
        el => el.id == this.$route.params.id
      );
    },
    updateSchedule(payload) {
      this.$store.dispatch("schedules/updateSchedule", payload).then(() => {
        this.$router.push({
          name: "schedules_show",
          params: { id: this.$route.params.id }
        });
      });
    },
    closeEditingForm() {
      this.$router.push({
        name: "schedules_show",
        params: { id: this.$route.params.id }
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("setBackRoute", null);
    next();
  }
};
</script>

<style></style>
