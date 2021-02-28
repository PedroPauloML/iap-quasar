<template>
  <q-card class="mb-8">
    <q-card-section>
      Criando nova agenda
    </q-card-section>
    <q-card-section>
      Insira as informações abaixo para criar uma nova agenda. É possível
      pré-visualizar como a agenda ficará antes de criá-la clicando em
      "Pré-visualização".
    </q-card-section>

    <q-card-text>
      <div ref="previewContainer" v-show="preview">
        <p class="body-1 primary--text font-weight-bold">Pré-visualização</p>
        <Schedule
          :id="id"
          :title="title"
          :description="description"
          :date_start="date_start"
          :date_end="date_end"
          :image="image"
          :location="location"
          class="mb-10"
          no-actions
        />
      </div>
      <v-form v-show="!preview" ref="form" v-model="valid" lazy-validation>
        <Cropper
          ref="image"
          v-model="image"
          :currentImage="currentImage"
          imageName="Imagem da agenda"
        />
        <p v-if="imagePrintError" class="red--text">
          A imagem da agenda é obrigatório(a)
        </p>

        <v-text-field
          ref="title"
          v-model="title"
          :rules="requiredRules.title"
          label="Título"
          required
          @keyup.enter="createSchedule"
        ></v-text-field>

        <div class="row">
          <div class="col-12 col-md-6 col-sm-3">
            <v-menu
              v-model="dateStartMenu"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateStartFormatted"
                  ref="dateStart"
                  :rules="requiredRules.date_start"
                  label="Data de início"
                  required
                  prepend-icon="mdi-calendar"
                  background-color="white"
                  class="mr-3"
                  clearable
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @click:clear="date_start = ''"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date_start"
                locale="pt-br"
                no-title
                scrollable
                @change="date => (date_start = date)"
              >
              </v-date-picker>
            </v-menu>
          </div>

          <div class="col-12 col-md-6 col-sm-3">
            <v-menu
              v-model="timeStartMenu"
              transition="scale-transition"
              offset-y
              min-width="290px"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="timeStartFormatted"
                  ref="timeStart"
                  :rules="requiredRules.time_start"
                  label="Horário de início"
                  required
                  prepend-icon="mdi-clock-outline"
                  background-color="white"
                  class="mr-3"
                  clearable
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @click:clear="time_start = ''"
                ></v-text-field>
              </template>
              <v-time-picker
                :value="parseTime(time_start)"
                @input="time => (time_start = time)"
                format="24hr"
                locale="pt-br"
                scrollable
                @change="
                  time => {
                    time_start = time;
                    timeStartMenu = false;
                  }
                "
              >
              </v-time-picker>
            </v-menu>
          </div>

          <div class="col-12 col-md-6 col-sm-3">
            <v-menu
              v-model="dateEndMenu"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateEndFormatted"
                  ref="dateEnd"
                  :rules="requiredRules.date_end"
                  label="Data de início"
                  required
                  prepend-icon="mdi-calendar"
                  background-color="white"
                  class="mr-3"
                  clearable
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @click:clear="date_end = ''"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date_end"
                locale="pt-br"
                no-title
                scrollable
                @change="date => (date_end = date)"
              >
              </v-date-picker>
            </v-menu>
          </div>

          <div class="col-12 col-md-6 col-sm-3">
            <v-menu
              v-model="timeEndMenu"
              transition="scale-transition"
              offset-y
              min-width="290px"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="timeEndFormatted"
                  ref="timeEnd"
                  :rules="requiredRules.time_end"
                  label="Horário de término"
                  required
                  prepend-icon="mdi-clock-outline"
                  background-color="white"
                  class="mr-3"
                  clearable
                  dense
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @click:clear="time_end = ''"
                ></v-text-field>
              </template>
              <v-time-picker
                :value="parseTime(time_end)"
                @input="time => (time_end = time)"
                format="24hr"
                locale="pt-br"
                scrollable
                @change="
                  time => {
                    time_end = time;
                    timeEndMenu = false;
                  }
                "
              >
              </v-time-picker>
            </v-menu>
          </div>
        </div>

        <v-text-field
          ref="location"
          v-model="location"
          :rules="requiredRules.location"
          label="Local"
          prepend-icon="mdi-map-marker-outline"
          required
          @keyup.enter="createSchedule"
        ></v-text-field>

        <p
          :class="{
            'body-2': true,
            'mt-2': true,
            'mb-1': true,
            'red--text': descriptionPrintError
          }"
        >
          Descrição
        </p>
        <p
          ref="descriptionLabelError"
          v-show="descriptionPrintError"
          class="red--text mb-1"
        >
          A descrição da agenda é obrigatório(a)
        </p>
        <div class="mb-5">
          <TipTapEditor ref="description" v-model="description" />
        </div>
      </v-form>
    </q-card-text>

    <q-card-actions>
      <q-btn
        v-if="$q.screen.gt.sm"
        color="primary"
        outlined
        @click="preview = !preview"
        :disabled="loading"
      >
        {{ preview ? "Formulário" : "Pré-visualizar" }}
      </q-btn>
      <q-tooltip v-else bottom>
        <template v-slot:activator="{ on, attrs }">
          <q-btn
            v-bind="attrs"
            v-on="on"
            color="primary"
            outlined
            @click="preview = !preview"
            :disabled="loading"
          >
            <q-icon>
              {{ preview ? "mdi-file" : "mdi-file-find" }}
            </q-icon>
          </q-btn>
        </template>
        <span>{{ preview ? "Formulário" : "Pré-visualizar" }}</span>
      </q-tooltip>

      <v-spacer></v-spacer>
      <q-btn color="grey" dark @click="closeForm" :disabled="loading">
        Cancelar
      </q-btn>

      <q-btn
        v-if="id"
        color="primary"
        @click="updateSchedule"
        :loading="loading"
      >
        Atualizar
      </q-btn>
      <q-btn v-else color="primary" @click="createSchedule" :loading="loading">
        Criar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import Schedule from "./Component";
import TipTapEditor from "../TipTapEditor";
import Cropper from "../Cropper";

export default {
  components: { TipTapEditor, Schedule, Cropper },
  props: { data: Object, default: {} },
  data() {
    return {
      // General
      preview: false,

      // Fields
      id: this.data ? this.data.id : null,
      title: this.data ? this.data.title : "",
      description: this.data ? this.data.description : "",
      date_start: this.data ? this.data.date_start : "",
      time_start: this.data
        ? this.$moment(this.data.date_start).format("HH:mm")
        : "",
      date_end: this.data ? this.data.date_end : "",
      time_end: this.data
        ? this.$moment(this.data.date_end).format("HH:mm")
        : "",
      image: this.data ? this.data.image : "",
      location: this.data ? this.data.location : "",

      // Rules
      requiredRules: [
        { field: "title", name: "Título" },
        { field: "description", name: "Descrição" },
        { field: "date_start", name: "Data de início" },
        { field: "time_start", name: "Horário de início" },
        { field: "date_end", name: "Data de término" },
        { field: "time_end", name: "Horário de término" },
        { field: "image", name: "Imagem" },
        { field: "location", name: "Local" }
      ].reduce((acc, val) => {
        acc[val.field] = [v => !!v || `${val.name} é obrigatório(a)`];
        return acc;
      }, {}),

      // Form variables
      valid: true,
      loading: false,
      descriptionPrintError: false,
      imagePrintError: false,
      dateStartMenu: false,
      timeStartMenu: false,
      dateEndMenu: false,
      timeEndMenu: false,
      currentImage: this.data ? this.data.image : null
    };
  },
  watch: {
    preview(val) {
      this.parseDateAndTime();

      setTimeout(() => {
        if (val) {
          let y =
            this.$refs.previewContainer.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
        } else {
          let y =
            this.$refs.form.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
        }
      }, 200);
    },
    description: function(val) {
      this.descriptionPrintError = !val;
    },
    image: function(val) {
      this.imagePrintError = !val;
    }
  },
  computed: {
    dateStartFormatted: {
      get() {
        return this.parseDate(this.date_start) || "";
      },
      set(newValue) {
        return newValue;
      }
    },
    timeStartFormatted: {
      get() {
        return this.parseTime(this.time_start) || "";
      },
      set(newValue) {
        return newValue;
      }
    },
    dateEndFormatted: {
      get() {
        return this.parseDate(this.date_end) || "";
      },
      set(newValue) {
        return newValue;
      }
    },
    timeEndFormatted: {
      get() {
        return this.parseTime(this.time_end) || "";
      },
      set(newValue) {
        return newValue;
      }
    }
  },
  methods: {
    createSchedule() {
      if (this.checkFormValidity()) {
        this.parseDateAndTime();

        let data = {
          title: this.title,
          description: this.description,
          date_start: this.date_start,
          date_end: this.date_end,
          image: this.image,
          location: this.location
        };

        this.loading = true;

        setTimeout(() => {
          this.loading = false;
          this.$emit("createSchedule", data);
        }, 1000);
      }
    },
    updateSchedule() {
      if (this.checkFormValidity()) {
        this.parseDateAndTime();

        let data = {
          title: this.title,
          description: this.description,
          date_start: this.date_start,
          date_end: this.date_end,
          image: this.image,
          location: this.location
        };

        this.loading = true;

        setTimeout(() => {
          this.loading = false;
          this.$emit("updateSchedule", { id: this.id, data });
        }, 1000);
      }
    },
    checkFormValidity() {
      if (this.$refs.form.validate() && this.description && this.image) {
        return true;
      } else {
        if (!this.description) this.descriptionPrintError = true;
        if (!this.image) this.imagePrintError = true;

        if (!this.title) {
          let y =
            this.$refs.title.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.date_start) {
          let y =
            this.$refs.date_start.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.time_start) {
          let y =
            this.$refs.time_start.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.date_end) {
          let y =
            this.$refs.date_end.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.time_end) {
          let y =
            this.$refs.time_end.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.description) {
          let y =
            this.$refs.description.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.image) {
          let y =
            this.$refs.image.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.location) {
          let y =
            this.$refs.location.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        return false;
      }
    },
    closeForm() {
      this.$emit("closeForm");
    },
    parseDateAndTime() {
      if (this.date_start) {
        let hour_start = this.time_start
          ? this.parseTime(this.time_start).split(":")[0]
          : "00";
        let minute_start = this.time_start
          ? this.parseTime(this.time_start).split(":")[1]
          : "00";

        this.date_start = this.$moment(this.date_start)
          .set({ hour: hour_start, minute: minute_start, second: 0 })
          .format();
      }
      if (this.date_end) {
        let hour_end = this.time_end
          ? this.parseTime(this.time_end).split(":")[0]
          : "00";
        let minute_end = this.time_end
          ? this.parseTime(this.time_end).split(":")[1]
          : "00";

        this.date_end = this.$moment(this.date_end)
          .set({ hour: hour_end, minute: minute_end, second: 0 })
          .format();
      }
    },
    parseDate(date) {
      if (!date) return null;
      return this.$moment(date).format("DD/MM/YYYY");
    },
    parseTime(time) {
      if (!time) return null;
      return this.$moment(time, "HH:mm").format("HH:mm");
    }
  }
};
</script>

<style></style>
