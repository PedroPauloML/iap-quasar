<template>
  <div id="verses-of-day">
    <div v-if="value.search || value.date" class="flex flex-wrap q-mb-lg">
      <span v-if="searching" class="q-mr-sm text-nowrap">
        Aguarde um momento, estamos pesquisando por
      </span>
      <span v-else class="q-mr-sm text-nowrap">
        Encontramos {{ verses_of_day.length }} resultados para a busca
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
    <div v-else>
      <VerseOfDay
        v-for="(verse_of_day, index) in verses_of_day"
        :key="index"
        :verse="verse_of_day.verse"
        :reference="verse_of_day.reference"
        :date="verse_of_day.date"
        :route="verse_of_day.route"
        no-actions
        no-commentaries
        class="q-mb-lg"
      />
    </div>
  </div>
</template>

<script>
import VerseOfDay from "../../components/verse_of_day/Component";
export default {
  components: { VerseOfDay },
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
      verses_of_day: [],
      list_of_verses: []
    };
  },
  created() {
    let verses = [];
    for (let index = 0; index < 10; index++) {
      verses = verses.concat({
        verse: `Elevo os meus olhos para os montes; de onde me vem o socorro? O meu
        socorro vem do Senhor, que fez os céus e a terra. Não deixará vacilar o
        teu pé; aquele que te guarda não dormitará.`,
        reference: `Salmos 121:1-3`,
        date: this.$moment("2020-07-05T03:37:00-03:00")
          .subtract(index, "days")
          .format(),
        route: { name: "verse_of_day", params: { id: 10 - index } }
      });
    }
    this.list_of_verses = verses;
    this.verses_of_day = this.list_of_verses;

    if (this.$route.query.search) this.value.search = this.$route.query.search;
    if (this.$route.query.date) this.value.date = this.$route.query.date;

    this.filterVersesOfDay(this.value);
  },
  watch: {
    value: {
      handler: function() {
        this.filterVersesOfDay(this.value);
      },
      deep: true
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   next();
  //   this.$emit("clearInputSearch");
  // },
  methods: {
    filterVersesOfDay(filters) {
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

          this.verses_of_day = this.list_of_verses.filter(
            verse_of_day =>
              (verse_of_day.verse
                .toLocaleLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(search) ||
                verse_of_day.reference
                  .toLocaleLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .includes(search)) &&
              (date
                ? this.$moment(verse_of_day.date).format("DD/MM/YYYY") == date
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
