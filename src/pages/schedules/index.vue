<template>
  <div id="schedules">
    <div v-if="value.search || value.date" class="flex flex-wrap mb-5">
      <span v-if="searching" class="mr-1 text-nowrap">
        Aguarde um momento, estamos pesquisando por
      </span>
      <span v-else class="mr-1 text-nowrap">
        Encontramos {{ schedules.length }} resultados para a busca
      </span>
      <span
        v-if="value.search"
        class="text-truncate-1-line mr-1 font-weight-medium"
      >
        {{ value.search }}
      </span>

      <span v-if="value.date" class="mr-1">
        no dia
      </span>
      <span
        v-if="value.date"
        class="text-truncate-1-line font-weight-medium mr-1"
      >
        {{ value.date | moment("DD/MM/YYYY") }}
      </span>
    </div>

    <div v-if="!searching" class="row">
      <div
        v-for="(schedule, index) in schedules"
        :key="index"
        class="col-12 col-md-4"
      >
        <Schedule
          :id="schedule.id"
          :title="schedule.title"
          :description="schedule.description"
          :date_start="schedule.date_start"
          :date_end="schedule.date_end"
          :image="schedule.image"
          :location="schedule.location"
          @onDestroy="loadSchedules"
        />
      </div>
    </div>

    <v-row v-else align="center" justify="center">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </v-row>
  </div>
</template>

<script>
import Schedule from "../../components/schedules/Component";

export default {
  components: { Schedule },
  props: {
    value: {
      search: String,
      date: String,
      required: true
    },
    searching: Boolean
  },
  data() {
    return {
      schedules: []
    };
  },
  created() {
    this.$store.dispatch("schedules/loadSchedules").then(this.loadSchedules);
  },
  watch: {
    value: {
      handler: function() {
        this.filterSchedules(this.value);
      },
      deep: true
    }
  },
  methods: {
    loadSchedules() {
      this.schedules = this.$store.state.schedules.schedules;
      if (this.$route.query.search)
        this.value.search = this.$route.query.search;
      if (this.$route.query.date) this.value.date = this.$route.query.date;
      this.filterSchedules(this.value);
    },
    filterSchedules(filters) {
      if (!this.searching) {
        this.$emit("searching", true);

        setTimeout(() => {
          let search = (filters.search || "")
            .toLocaleLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          let date = filters.date
            ? this.$moment(filters.date).format("DD/MM/YYYY")
            : "";

          this.schedules = this.$store.state.schedules.schedules.filter(
            schedule =>
              schedule.title
                .toLocaleLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(search) &&
              (date
                ? [
                    this.$moment(schedule.date_start).format("DD/MM/YYYY"),
                    this.$moment(schedule.date_start).format("DD/MM/YYYY")
                  ].includes(date)
                : true)
          );

          this.$emit("searching", false);
        }, 1000);
      }
    }
  }
};
</script>

<style></style>
