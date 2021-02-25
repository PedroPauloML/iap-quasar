<template>
  <q-card class="mb-8">
    <q-card-section>
      Criando nova notícia
    </q-card-section>
    <q-card-section>
      Insira as informações abaixo para criar uma nova notícia. É possível
      pré-visualizar como a notícia ficará antes de criá-la clicando em
      "Pré-visualização".
    </q-card-section>

    <q-card-text>
      <News
        v-show="preview"
        :id="id"
        :title="title"
        :caption="caption"
        :image="{
          url: image || currentImage,
          ratio: 16 / 9
        }"
        :content="content"
        :metadata="{
          read_time: true,
          published_at: this.$moment().format('DD/MM/YYYY')
        }"
        :tags="tags"
        no-actions
      />
      <v-form v-show="!preview" ref="form" v-model="valid" lazy-validation>
        <Cropper
          ref="image"
          v-model="image"
          :currentImage="currentImage"
          imageName="Imagem de capa"
        />
        <p v-if="imagePrintError" class="red--text">
          A imagem da notícia é obrigatório(a)
        </p>
        <!-- <v-file-input
          v-model="image"
          label="Imagem de capa"
          show-size
          prepend-icon="mdi-camera"
          required
          :rules="requiredRules['image']"
        ></v-file-input> -->

        <v-text-field
          ref="title"
          v-model="title"
          :rules="requiredRules.title"
          label="Título"
          required
          @keyup.enter="createNews"
        ></v-text-field>

        <v-text-field
          ref="caption"
          v-model="caption"
          :rules="requiredRules.caption"
          label="Legenda"
          required
          @keyup.enter="createNews"
        ></v-text-field>

        <p class="body-2 mt-2">Conteúdo</p>
        <p ref="contentLabelError" v-show="contentPrintError" class="red--text">
          O conteúdo da notícia é obrigatório(a)
        </p>
        <div class="mb-5">
          <TipTapEditor ref="content" v-model="content" />
        </div>

        <v-combobox
          ref="tags"
          v-model="tags"
          :items="tagsSuggestions"
          :search-input.sync="tagsSearch"
          hide-selected
          hint="Máximo de 5 tags"
          label="Tags (opcional)"
          multiple
          persistent-hint
          small-chips
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  Nenhum resultado encontrado para "<strong>{{
                    tagsSearch
                  }}</strong
                  >". Pressione <kbd>enter</kbd> para criar uma nova tag.
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
      </v-form>
    </q-card-text>

    <q-card-actions>
      <q-btn
        v-if="$vuetify.breakpoint.smAndUp"
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

      <q-btn v-if="id" color="primary" @click="updateNews" :loading="loading">
        Atualizar
      </q-btn>
      <q-btn v-else color="primary" @click="createNews" :loading="loading">
        Criar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import News from "../../components/news/Component";
import TipTapEditor from "../TipTapEditor";
import Cropper from "../Cropper";

export default {
  components: { TipTapEditor, Cropper, News },
  props: { data: Object, default: {} },
  data() {
    return {
      // General
      preview: false,

      // Fields
      id: this.data ? this.data.id : null,
      title: this.data ? this.data.title : null,
      caption: this.data ? this.data.caption : null,
      image: "",
      currentImage: this.data ? this.data.image : null,
      imagePrintError: false,
      content: this.data ? this.data.content : "",
      contentPrintError: false,
      tags: this.data ? this.data.tags || [] : null,
      tagsSuggestions: Array.from(
        new Set(
          this.$store.state.news.news
            .map(el => el.tags)
            .filter(el => el != null)
            .flat()
        )
      ),
      tagsSearch: null,

      // Rules
      requiredRules: [
        { field: "title", name: "Título" },
        { field: "caption", name: "Legenda" },
        { field: "image", name: "Imagem" },
        { field: "content", name: "Conteúdo" }
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
    content: function(val) {
      this.contentPrintError = !val;
    },
    image: function(val) {
      this.imagePrintError = !val;
    },
    tags(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.tags.pop());
      }
    }
  },
  methods: {
    createNews() {
      if (!this.content) this.contentPrintError = true;
      if (!this.image) this.imagePrintError = true;

      if (this.$refs.form.validate() && this.content && this.image) {
        let data = {
          title: this.title,
          caption: this.caption,
          image: this.image,
          content: this.content,
          tags: this.tags,
          metadata: {
            read_time: true,
            published_at: this.$moment().format("DD/MM/YYYY")
          }
        };

        this.loading = true;

        setTimeout(() => {
          this.loading = false;
          this.$emit("createNews", data);
        }, 1000);
      } else {
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
        if (!this.caption) {
          let y =
            this.$refs.caption.$el.getBoundingClientRect().top +
            window.pageYOffset -
            60;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
          return;
        }
        if (!this.content) {
          let y =
            this.$refs.contentLabelError.getBoundingClientRect().top +
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
    updateNews() {
      if (!this.content) this.contentPrintError = true;

      if (this.$refs.form.validate() && this.content) {
        let data = {
          title: this.title,
          caption: this.caption,
          image: this.image || this.currentImage,
          content: this.content,
          tags: this.tags,
          metadata: {
            read_time: true,
            published_at: this.$moment().format("DD/MM/YYYY")
          }
        };

        this.loading = true;

        setTimeout(() => {
          this.loading = false;
          this.$emit("updateNews", { id: this.id, data });
        }, 1000);
      }
    },
    closeForm() {
      this.$emit("closeForm");
    }
  }
};
</script>

<style></style>
