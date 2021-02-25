<template>
  <q-card class="schedule" light>
    <q-card-text>
      <div class="d-flex justify-space-between">
        <p
          v-if="date_start"
          class="text-uppercase black--text text-caption font-weight-bold"
        >
          {{ date_start | moment("DD [de] MMMM [de] YYYY") }}
        </p>
        <p v-else>Data de início não informada</p>

        <p
          v-if="!futureEvent"
          class="red--text text-uppercase caption font-weight-bold"
        >
          Evento já encerrado
        </p>
        <p
          v-else-if="presentEvent"
          class="green--text text-uppercase caption font-weight-bold"
        >
          Evento em andamento
        </p>
      </div>

      <router-link v-if="route" :to="route">
        <q-img :src="image" aspect-ratio="2" class="rounded mb-3">
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0 secondary darken-1"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-row>
          </template>
        </q-img>
      </router-link>
      <q-img v-else :src="image" aspect-ratio="2" class="rounded mb-3">
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0 secondary darken-1"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-row>
        </template>
      </q-img>

      <div class="d-flex justify-space-between">
        <p class="title primary--text">
          <router-link v-if="route" :to="route" class="text-decoration-none">
            {{ title }}
          </router-link>
          <span v-else>{{ title }}</span>
        </p>

        <v-menu
          v-if="userSigned && !noActions"
          v-model="optionsMenu"
          bottom
          left
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <q-btn icon v-bind="attrs" v-on="on">
              <q-icon>mdi-dots-vertical</q-icon>
            </q-btn>
          </template>

          <v-list dense flat>
            <v-list-item :to="routeToEdit">
              <v-list-item-icon>
                <q-icon>mdi-pencil</q-icon>
              </v-list-item-icon>
              <v-list-item-content>
                Editar
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="destroy">
              <v-list-item-icon>
                <q-icon>mdi-delete</q-icon>
              </v-list-item-icon>
              <v-list-item-content>
                Excluir
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <p class="mb-0">
        <q-icon small class="mr-1">mdi-map-marker-outline</q-icon>
        <span v-if="location">{{ location }}</span>
        <span v-else>Local não informado</span>
      </p>
      <p>
        <q-icon small class="mr-1">mdi-clock-outline</q-icon>
        <span v-if="date_start">{{
          date_start | moment("DD/MM/YYYY HH:mm")
        }}</span>
        <span v-else>Data de início não informada</span>
        -
        <span v-if="date_end">{{ date_end | moment("DD/MM/YYYY HH:mm") }}</span>
        <span v-else>Data de término não informada</span>
      </p>

      <div
        v-if="!mini"
        class="black--text mb-0 description mce-content-body"
        v-html="description"
      ></div>
    </q-card-text>

    <div
      v-if="futureEvent && !mini"
      class="
        px-3
        pt-3
        d-flex
        flex-column
        align-stretch,
      "
    >
      <q-separator class="mb-3"></q-separator>

      <div v-if="updating" class="mb-3 body-2">
        <p class="text-center grey--text">
          Estamos atualizando sua decisão...
        </p>
        <v-progress-linear indeterminate></v-progress-linear>
      </div>

      <p class="body-2">Podemos contar com sua presença?</p>

      <div
        :class="{
          'd-flex': true,
          'flex-column': !solo || $vuetify.breakpoint.smAndDown
        }"
      >
        <q-btn
          v-if="presence == null || presence == true"
          color="primary"
          :class="{
            'mb-3': true,
            flex: true,
            'mr-3': !!solo && $vuetify.breakpoint.mdAndUp
          }"
          :outlined="presence == true"
          :disabled="updating"
          @click="changePresence(true)"
        >
          <q-icon small class="mr-2">mdi-thumb-up</q-icon>
          Presença confirmada!
        </q-btn>

        <q-btn
          v-if="presence == null || presence == false"
          color="grey"
          :dark="updating == false"
          class="mb-3 flex"
          :outlined="presence == false"
          :disabled="updating"
          @click="changePresence(false)"
        >
          <q-icon small class="mr-2">mdi-help</q-icon>
          Não tenho certeza se irei
        </q-btn>
      </div>

      <p v-if="presence != null" class="body-2">
        Deseja ficar informado sobre esse evento?
      </p>

      <div
        :class="{
          'd-flex': true,
          'flex-column': !solo || $vuetify.breakpoint.smAndDown
        }"
      >
        <q-btn
          v-if="presence != null && (notify == null || notify == true)"
          color="primary"
          :class="{
            'mb-3': true,
            flex: true,
            'mr-3': !!solo && $vuetify.breakpoint.mdAndUp
          }"
          :outlined="notify == true"
          :disabled="updating"
          @click="changeNotify(true)"
        >
          <q-icon small class="mr-2">mdi-bell-ring-outline</q-icon>
          Mantenha-me informado
        </q-btn>

        <q-btn
          v-if="presence != null && (notify == null || notify == false)"
          color="grey"
          :dark="updating == false"
          class="mb-3 flex"
          :outlined="notify == false"
          :disabled="updating"
          @click="changeNotify(false)"
        >
          <q-icon small class="mr-2">mdi-bell-off-outline</q-icon>
          Não preciso ser informado
        </q-btn>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    id: Number,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date_start: {
      type: String,
      required: true
    },
    date_end: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    solo: { type: Boolean, default: false },
    mini: { type: Boolean, default: false },
    noActions: { type: Boolean, default: false }
  },
  data() {
    return {
      presence: null,
      notify: null,
      updating: false,
      optionsMenu: false
    };
  },
  computed: {
    route() {
      return this.noActions
        ? null
        : this.id
        ? { name: "schedules_show", params: { id: this.id } }
        : null;
    },
    routeToEdit() {
      return this.noActions
        ? null
        : this.id
        ? { name: "schedules_edit", params: { id: this.id } }
        : null;
    },
    futureEvent() {
      return this.date_end
        ? this.$moment(this.date_end) > this.$moment()
        : false;
    },
    presentEvent() {
      return this.date_start && this.date_end
        ? this.$moment(this.date_start) < this.$moment() &&
            this.$moment(this.date_end) > this.$moment()
        : false;
    }
  },
  methods: {
    changePresence(presence) {
      if (this.presence == presence) {
        this.presence = null;

        if (this.notify != null) {
          this.notify = null;
          this.updating = true;

          setTimeout(() => {
            this.updating = false;
          }, 1000);
        }
      } else {
        this.presence = presence;
      }
    },
    changeNotify(notify) {
      if (this.notify == notify) {
        this.notify = null;
      } else {
        this.notify = notify;
      }

      this.updating = true;

      setTimeout(() => {
        this.updating = false;
      }, 1000);
    },
    destroy() {
      if (this.id && confirm("Tem certeza que deseja remover essa agenda?")) {
        this.$store
          .dispatch("schedules/removeSchedule", this.id)
          .then(() => this.$emit("onDestroy"));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.description :last-child {
  margin-bottom: 0;
}
</style>
