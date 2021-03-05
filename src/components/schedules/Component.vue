<template>
  <q-card class="schedule">
    <q-card-section>
      <div class="flex justify-between">
        <p
          v-if="date_start"
          class="text-uppercase text-caption text-weight-bold"
        >
          {{
            $moment(parseDateToInput(date_start), "DD/MM/YYYY").format(
              "DD [de] MMMM [de] YYYY"
            )
          }}
        </p>
        <p v-else>Data de início não informada</p>

        <p
          v-if="!futureEvent"
          class="text-red text-uppercase text-caption text-weight-bold"
        >
          Evento já encerrado
        </p>
        <p
          v-else-if="presentEvent"
          class="text-green text-uppercase text-caption text-weight-bold"
        >
          Evento em andamento
        </p>
      </div>

      <router-link v-if="route" :to="route">
        <q-img :src="image" aspect-ratio="2" class="rounded q-mb-md">
          <template v-slot:placeholder>
            <div class="full-height bg-secondary">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
          </template>
        </q-img>
      </router-link>
      <q-img v-else :src="image" aspect-ratio="2" class="rounded q-mb-md">
        <template v-slot:placeholder>
          <div class="full-height bg-secondary">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </template>
      </q-img>

      <div class="flex items-center justify-between q-mb-md">
        <router-link v-if="route" :to="route" class="text-decoration-none">
          <span class="text-h6 text-primary">{{ title }}</span>
        </router-link>
        <span v-else class="text-h6 text-primary">{{ title }}</span>

        <q-btn v-if="userSigned && !noActions" flat round>
          <q-icon name="mdi-dots-vertical" />

          <q-menu>
            <q-list dense flat>
              <q-item :to="routeToEdit">
                <q-item-section avatar class="q-py-sm">
                  <q-icon name="edit" />
                </q-item-section>

                <q-item-section class="q-py-sm">
                  Editar
                </q-item-section>
              </q-item>

              <q-item clickable @click="destroy">
                <q-item-section avatar class="q-py-sm">
                  <q-icon name="delete" />
                </q-item-section>

                <q-item-section class="q-py-sm">
                  Excluir
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <p class="q-mb-none text-grey-8">
        <q-icon name="mdi-map-marker-outline" class="q-mr-sm" />
        <span v-if="location">{{ location }}</span>
        <span v-else>Local não informado</span>
      </p>
      <p class="text-grey-8">
        <q-icon name="mdi-clock-outline" class="q-mr-sm" />
        <span v-if="date_start">{{
          $moment(date_start).format("DD/MM/YYYY HH:mm")
        }}</span>
        <span v-else>Data de início não informada</span>
        -
        <span v-if="date_end">{{
          $moment(date_end).format("DD/MM/YYYY HH:mm")
        }}</span>
        <span v-else>Data de término não informada</span>
      </p>

      <div class="tiptap">
        <div
          v-if="!mini"
          class="description editor__content"
          style="padding: 0"
          v-html="description"
        ></div>
      </div>
    </q-card-section>

    <q-separator v-if="futureEvent && !mini" />

    <q-card-section v-if="futureEvent && !mini">
      <div v-if="updating" class="q-mb-md text-body2">
        <p class="text-center text-grey">
          Estamos atualizando sua decisão...
        </p>
        <q-linear-progress indeterminate></q-linear-progress>
      </div>

      <p class="text-body2">Podemos contar com sua presença?</p>

      <div class="row q-col-gutter-md">
        <div v-if="presence == null || presence == true" class="col-12 col-sm">
          <q-btn
            color="primary"
            :outline="presence == true"
            :disabled="updating"
            @click="changePresence(true)"
            class="full-width"
          >
            <q-icon name="mdi-thumb-up" small class="q-mr-md" />
            Presença confirmada!
          </q-btn>
        </div>

        <div v-if="presence == null || presence == false" class="col-12 col-sm">
          <q-btn
            color="grey"
            :dark="updating == false"
            :outline="presence == false"
            :disabled="updating"
            @click="changePresence(false)"
            class="full-width"
          >
            <q-icon name="mdi-help" small class="q-mr-md" />
            Não tenho certeza se irei
          </q-btn>
        </div>
      </div>

      <p v-if="presence != null" class="text-body2 q-mt-md">
        Deseja ficar informado sobre esse evento?
      </p>

      <div v-if="presence != null" class="row q-col-gutter-md">
        <div
          v-if="presence != null && (notify == null || notify == true)"
          class="col-12 col-sm"
        >
          <q-btn
            color="primary"
            :outline="notify == true"
            :disabled="updating"
            @click="changeNotify(true)"
            class="full-width"
          >
            <q-icon name="mdi-bell-ring-outline" small class="q-mr-md" />
            Mantenha-me informado
          </q-btn>
        </div>

        <div
          v-if="presence != null && (notify == null || notify == false)"
          class="col-12 col-sm"
        >
          <q-btn
            color="grey"
            :dark="updating == false"
            :outline="notify == false"
            :disabled="updating"
            @click="changeNotify(false)"
            class="full-width"
          >
            <q-icon name="mdi-bell-off-outline" small class="q-mr-md" />
            Não preciso ser informado
          </q-btn>
        </div>
      </div>
    </q-card-section>
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
