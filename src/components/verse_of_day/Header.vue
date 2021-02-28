<template>
  <div id="news-header" class="mb-3">
    <v-row>
      <v-slide-x-transition>
        <div v-if="back_route" class="col-auto flex align-center">
          <router-link :to="back_route" v-slot="{ href }">
            <q-btn icon link color="gray" :to="href">
              <q-icon color="white">mdi-chevron-left</q-icon>
            </q-btn>
          </router-link>
        </div>
      </v-slide-x-transition>

      <div class="col">
        <h1>Versículos do dia</h1>
      </div>

      <div class="col-12 col-md-5 col-sm-7 flex align-center">
        <div class="flex flex flex-column flex-sm-row">
          <v-menu
            v-model="menu"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                placeholder="Pesquisar por data..."
                append-icon="mdi-calendar"
                background-color="white"
                :class="{
                  'mr-3': $vuetify.breakpoint.mdAndUp,
                  'mb-3': $q.screen.lt.md
                }"
                readonly
                outlined
                clearable
                dense
                hide-details
                v-bind="attrs"
                v-on="on"
                @click:clear="value.date = null"
                :disabled="searching"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="value.date"
              locale="pt-br"
              no-title
              scrollable
              @change="
                date => {
                  filters.date = date;
                  filterVerseOfDay();
                }
              "
            >
            </v-date-picker>
          </v-menu>

          <v-text-field
            name="search"
            v-model="filters.search"
            placeholder="Pesquisar por..."
            append-icon="mdi-magnify"
            background-color="white"
            max-width="100"
            outlined
            clearable
            dense
            :hide-details="true"
            @keyup.enter="filterVerseOfDay"
            @click:append="filterVerseOfDay"
            :disabled="searching"
          ></v-text-field>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    back_route: Object,
    value: {
      search: String,
      date: String
    },
    searching: Boolean
  },
  data() {
    return {
      menu: false,
      filters: { ...this.value }
    };
  },
  watch: {
    value: {
      handler: function(val) {
        this.filters = { ...val };
      },
      deep: true
    }
  },
  computed: {
    dateFormatted: {
      get() {
        return this.parseDate(this.value.date) || "";
      },
      set(newValue) {
        return newValue;
      }
    }
  },
  methods: {
    filterVerseOfDay() {
      if (this.$router.currentRoute.name == "verses_of_day") {
        this.$emit("input", this.filters);
      } else {
        this.$router.push({
          name: "verses_of_day",
          query: {
            search: this.filters.search,
            date: this.filters.date
          }
        });
      }
    },
    parseDate(date) {
      if (!date) return null;
      return this.$moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
  }
};
</script>

<style></style>
