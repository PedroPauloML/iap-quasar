<template>
  <div id="news-header" class="q-mb-lg">
    <div class="row q-col-gutter-md items-center">
      <transition
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutLeft"
        mode="out-in"
      >
        <div v-if="back_route" class="col-auto flex align-center">
          <router-link :to="back_route" v-slot="{ href }">
            <q-btn round color="primary" :to="href">
              <q-icon name="chevron_left" color="white" />

              <q-tooltip>Voltar</q-tooltip>
            </q-btn>
          </router-link>
        </div>
      </transition>

      <div class="col">
        <span class="text-h4 text-weight-bold">Versículos do dia</span>
      </div>

      <div class="col-12 col-sm-auto">
        <div class="row items-center">
          <div class="col">
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm">
                <q-input
                  v-model="filters.date"
                  placeholder="Pesquisar por data..."
                  background-color="white"
                  outlined
                  clearable
                  dense
                  hide-details
                  bg-color="white"
                  mask="##/##/####"
                  @change="filterVerseOfDay"
                  @clear="
                    filters.date = null;
                    filterVerseOfDay();
                  "
                  :disabled="searching"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxydate"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="dateFormattedToPicker"
                          @input="filterVerseOfDay"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm">
                <q-input
                  name="search"
                  v-model="filters.search"
                  placeholder="Pesquisar por..."
                  background-color="white"
                  width="100"
                  outlined
                  clearable
                  dense
                  bg-color="white"
                  hide-details
                  @keyup.enter="filterVerseOfDay"
                  @clear="filterVerseOfDay"
                  :disabled="searching"
                >
                  <template v-slot:append>
                    <q-icon
                      name="search"
                      class="cursor-pointer"
                      @click="filterVerseOfDay"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    dateFormattedToPicker: {
      get() {
        return this.parseDateToPicker(this.filters.date) || "";
      },
      set(newValue) {
        this.$refs.qDateProxydate.hide();
        return (this.filters.date = this.parseDateToInput(newValue));
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
