<template>
  <div id="schedules">
    <div v-if="value.search || value.date" class="flex flex-wrap q-mb-lg">
      <span v-if="searching" class="q-mr-sm text-nowrap">
        Aguarde um momento, estamos pesquisando por
      </span>
      <span v-else class="q-mr-sm text-nowrap">
        Encontramos {{ schedules.length }} resultados para a busca
      </span>
      <span
        v-if="value.search"
        class="text-truncate-1-line q-mr-sm text-weight-medium"
      >
        {{ value.search }}
      </span>

      <span v-if="value.date" class="q-mr-sm">
        no dia
      </span>
      <span
        v-if="value.date"
        class="text-truncate-1-line text-weight-medium q-mr-sm"
      >
        {{ $moment(value.date).format("DD/MM/YYYY") }}
      </span>
    </div>

    <q-linear-progress v-if="searching" indeterminate color="primary" />
    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="(schedule, index) in schedules"
        :key="index"
        class="col-12 col-sm-6 col-md-4"
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
