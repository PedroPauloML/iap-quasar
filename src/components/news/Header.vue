<template>
  <div id="news-header" class="q-mb-lg">
    <div class="row q-col-gutter-md">
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
        <span class="text-h4 text-weight-bold">Notícias</span>
      </div>

      <div class="col-12 col-sm-auto">
        <div class="row items-center">
          <div class="col">
            <div class="row">
              <div class="col-12 col-sm">
                <q-input
                  v-model="filters.date"
                  placeholder="Pesquisar por data..."
                  background-color="white"
                  :class="{
                    'q-mr-md': $q.screen.gt.sm,
                    'q-mb-md': $q.screen.lt.md
                  }"
                  outlined
                  clearable
                  dense
                  hide-details
                  bg-color="white"
                  mask="##/##/####"
                  @change="filterNews"
                  @clear="
                    filters.date = null;
                    filterNews();
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
                          @input="filterNews"
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
                  @keyup.enter="filterNews"
                  @clear="filterNews"
                  :disabled="searching"
                >
                  <template v-slot:append>
                    <q-icon
                      name="search"
                      class="cursor-pointer"
                      @click="filterNews"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <div class="col-auto">
            <q-btn
              v-if="userSigned"
              color="primary"
              round
              @click="
                $router.push({
                  name:
                    $router.currentRoute.name == 'news_new'
                      ? 'news'
                      : 'news_new'
                })
              "
              class="q-ml-lg"
            >
              <q-icon
                name="mdi-plus"
                :class="{ rotateZ: $router.currentRoute.name == 'news_new' }"
              >
              </q-icon>

              <q-tooltip>
                <span v-if="$router.currentRoute.name == 'news_new'"
                  >Cancelar notícia</span
                >
                <span v-else>Criar notícia</span>
              </q-tooltip>
            </q-btn>
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
    searching: Boolean,
    showForm: Boolean
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
    },
    menu(val) {
      if (!val) this.filters.date = this.value.date;
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
    filterNews() {
      if (this.$router.currentRoute.name == "news") {
        this.$emit("input", this.filters);
      } else {
        this.$router.push({
          name: "news",
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
    },
    changeDate() {
      this.$emit("input", this.filters);
      this.filterNews();
      this.menu = false;
    }
  }
};
</script>

<style scoped>
.rotateZ {
  transition: all 1s;
  transform: rotateZ(45deg);
}
</style>
