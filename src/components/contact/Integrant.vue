<template>
  <q-dialog :value="dialog" @input="closeDialog">
    <q-card class="dialog-container">
      <q-card-section class="text-h5 text-center text-weight-bold">
        <span v-if="id" class="q-mr">Atualizar</span>
        <span v-else class="q-mr">Adicionar</span>
        dados do integrate
      </q-card-section>

      <q-card-section>
        <q-form ref="form" v-model="valid" lazy-validation>
          <Cropper
            ref="photo"
            v-model="photo"
            :currentImage="currentPhoto"
            imageName="Foto"
            :aspectRatio="1 / 1"
            linear-actions-button
          />
          <q-input
            ref="title"
            v-model="name"
            :rules="requiredRules.name"
            label="Nome"
            required
            @keyup.enter="createOrUpdateIntegrant"
          />
          <q-input
            ref="title"
            v-model="role"
            :rules="requiredRules.role"
            label="Função"
            required
            @keyup.enter="createOrUpdateIntegrant"
          />
          <q-input
            ref="title"
            v-model="contact"
            :rules="requiredRules.contact"
            label="Contato (opcional)"
            required
            @keyup.enter="createOrUpdateIntegrant"
          />
        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-space></q-space>
        <q-btn color="grey" dark @click="closeDialog" :disabled="loading">
          Cancelar
        </q-btn>

        <q-btn
          v-if="id"
          color="primary"
          @click="updateIntegrant"
          :loading="loading"
        >
          Atualizar
        </q-btn>
        <q-btn
          v-else
          color="primary"
          @click="createIntegrant"
          :loading="loading"
        >
          Criar
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import Cropper from "../Cropper";

export default {
  props: {
    data: {
      id: {
        type: Number
      },
      name: {
        type: String
      },
      role: {
        type: String
      },
      contact: {
        type: String
      },
      photo: {
        type: String
      },
      required: true
    },
    opened: {
      type: Boolean,
      default: false
    }
  },
  components: { Cropper },
  data() {
    return {
      dialog: this.opened,

      // Fields
      id: this.data ? this.data.id || null : null,
      name: this.data ? this.data.name || "" : "",
      role: this.data ? this.data.role || "" : "",
      contact: this.data ? this.data.contact || "" : "",
      photo: this.data ? this.data.photo || "" : "",
      currentPhoto: this.data ? this.data.photo || "" : "",

      // Rules
      requiredRules: [
        { field: "name", name: "Nome" },
        { field: "role", name: "Função" }
      ].reduce((acc, val) => {
        acc[val.field] = [v => !!v || `${val.name} é obrigatório(a)`];
        return acc;
      }, {}),

      // Form variables
      valid: true,
      loading: false
    };
  },
  watch: {
    opened(val) {
      this.dialog = val;
    },
    data: {
      handler: function(val) {
        this.id = val ? val.id || null : null;
        this.name = val ? val.name || "" : "";
        this.role = val ? val.role || "" : "";
        this.contact = val ? val.contact || "" : "";
        this.photo = val ? val.photo || "" : "";
        this.currentPhoto = val ? val.photo || "" : "";
      },
      deep: true
    }
  },
  methods: {
    createOrUpdateIntegrant() {
      if (this.id) {
        this.updateIntegrant();
      } else {
        this.createIntegrant();
      }
    },
    createIntegrant() {
      if (this.$refs.form.validate()) {
        let data = {
          name: this.name,
          role: this.role,
          contact: this.contact,
          photo: this.photo
        };

        this.loading = true;

        setTimeout(() => {
          this.loading = false;
          this.$emit("createIntegrant", data);
        }, 1000);
      } else {
        if (!this.name) {
          let y =
            this.$refs.name.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.role) {
          let y =
            this.$refs.role.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
      }
    },
    updateIntegrant() {
      if (this.$refs.form.validate()) {
        let data = {
          name: this.name,
          role: this.role,
          contact: this.contact,
          photo: this.photo
        };

        this.loading = true;

        setTimeout(() => {
          this.loading = false;
          this.$emit("updateIntegrant", { id: this.id, data });
        }, 1000);
      } else {
        if (!this.name) {
          let y =
            this.$refs.name.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.role) {
          let y =
            this.$refs.role.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
      }
    },
    closeDialog() {
      this.$refs.form.reset();
      this.photo = "";
      this.currentPhoto = "";
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="scss">
.dialog-container {
  max-width: 80vw;
  width: 400px;
}
</style>
