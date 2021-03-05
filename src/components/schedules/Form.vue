<template>
  <q-card class="q-mb-lg">
    <q-card-section>
      <p class="text-h6 q-mb-none">
        {{ id ? "Editando agenda" : "Criando nova agenda" }}
      </p>
      <p class="q-mb-none text-grey-8">
        {{
          id
            ? "Edite as informações abaixo para atualizar a agenda."
            : "Insira as informações abaixo para criar uma nova agenda."
        }}
        É possível pré-visualizar como a agenda ficará antes de salva-la
        clicando em "Pré-visualização".
      </p>
    </q-card-section>

    <q-card-section>
      <div ref="previewContainer" v-show="preview">
        <p class="text-body1 text-primary text-weight-bold">Pré-visualização</p>
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
      <q-form
        v-show="!preview"
        ref="form"
        @submit="id ? updateSchedule : createSchedule"
      >
        <Cropper
          ref="image"
          v-model="image"
          :currentImage="currentImage"
          imageName="Imagem da agenda"
        />
        <p v-if="imagePrintError" class="red--text">
          A imagem da agenda é obrigatório(a)
        </p>

        <q-input
          ref="title"
          v-model="title"
          :rules="requiredRules.title"
          label="Título"
          required
          @keyup.enter="createSchedule"
        ></q-input>

        <div class="row">
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              ref="dateStart"
              label="Data de início"
              v-model="dateStartFormattedToInput"
              :rules="requiredRules.date_start"
              background-color="white"
              class="q-mr-md"
              mask="##/##/####"
              required
              clearable
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxyDateStart"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="dateStartFormattedToPicker" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              ref="timeStart"
              label="Horário de início"
              v-model="time_start"
              :rules="requiredRules.time_start"
              background-color="white"
              class="q-mr-md"
              mask="##:##"
              required
              clearable
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxyTimeStart"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="time_start" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              ref="dateEnd"
              label="Data de término"
              v-model="dateEndFormattedToInput"
              :rules="requiredRules.date_end"
              background-color="white"
              class="q-mr-md"
              mask="##/##/####"
              required
              clearable
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxyDateEnd"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="dateEndFormattedToPicker" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              ref="timeEnd"
              label="Horário de término"
              v-model="time_end"
              :rules="requiredRules.time_end"
              background-color="white"
              class="q-mr-md"
              mask="##:##"
              required
              clearable
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxyTimeEnd"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="time_end" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <q-input
          ref="location"
          v-model="location"
          :rules="requiredRules.location"
          label="Local"
          prepend-icon="mdi-map-marker-outline"
          required
          @keyup.enter="createSchedule"
        ></q-input>

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
      </q-form>
    </q-card-section>

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

      <q-space />

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
      date_start: this.data ? this.parseDateToInput(this.data.date_start) : "",
      time_start: this.data
        ? this.$moment(this.data.date_start).format("HH:mm")
        : "",
      date_end: this.data ? this.parseDateToInput(this.data.date_end) : "",
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
    },
    date_start(newValue) {
      console.log("date_start", newValue);
    },
    date_end(newValue) {
      console.log("date_end", newValue);
    }
  },
  computed: {
    dateStartFormattedToPicker: {
      get() {
        return this.parseDateToPicker(this.date_start) || "";
      },
      set(newValue) {
        this.$refs.qDateProxyDateStart.hide();
        console.log(newValue);
        return (this.date_start = this.parseDateToInput(newValue));
      }
    },
    dateEndFormattedToPicker: {
      get() {
        return this.parseDateToPicker(this.date_end) || "";
      },
      set(newValue) {
        this.$refs.qDateProxyDateEnd.hide();
        return (this.date_end = this.parseDateToInput(newValue));
      }
    },
    dateStartFormattedToInput: {
      get() {
        return this.parseDateToInput(this.date_start) || "";
      },
      set(newValue) {
        return (this.date_start = newValue);
      }
    },
    dateEndFormattedToInput: {
      get() {
        return this.parseDateToInput(this.date_end) || "";
      },
      set(newValue) {
        return (this.date_end = newValue);
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

        this.date_start = this.$moment(
          this.parseDateToInput(this.date_start),
          "DD/MM/YYYY"
        )
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

        this.date_end = this.$moment(
          this.parseDateToInput(this.date_end),
          "DD/MM/YYYY"
        )
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
