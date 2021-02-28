<template>
  <q-card class="mb-8">
    <q-card-section>
      Criando nova mensagem
    </q-card-section>
    <q-card-section>
      Insira as informações abaixo para criar uma nova mensagem. É possível
      pré-visualizar como a mensagem ficará antes de criá-la clicando em
      "Pré-visualização".
    </q-card-section>

    <q-card-text>
      <div ref="previewContainer" v-show="preview">
        <p class="body-1 primary--text font-weight-bold">Pré-visualização</p>
        <Message
          :title="title"
          :caption="caption"
          :content="content"
          :author="author"
          :published_at="published_at"
          :tags="tags"
          :metadata="{ read_time: true }"
          @filterMessages="search => (value.search = search)"
          class="mb-10"
          no-actions
        />
      </div>
      <q-form v-show="!preview" ref="form" v-model="valid" @submit="createNews">
        <q-input
          ref="title"
          v-model="title"
          :rules="requiredRules.title"
          label="Título"
          required
        ></q-input>

        <q-input
          ref="caption"
          v-model="caption"
          :rules="requiredRules.caption"
          label="Legenda"
          required
        ></q-input>

        <p
          :class="{
            'body-2': true,
            'mt-2': true,
            'mb-1': true,
            'red--text': contentPrintError
          }"
        >
          Conteúdo
        </p>
        <p
          ref="contentLabelError"
          v-show="contentPrintError"
          class="red--text mb-1"
        >
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

        <q-btn label="Submeter fomrulário" class="hidden" />
      </q-form>
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
      <q-btn
        v-else
        color="primary"
        outlined
        @click="preview = !preview"
        :disabled="loading"
      >
        <q-icon v-if="preview" name="mdi-file" />
        <q-icon v-else name="mdi-file-find" />

        <q-tooltip>
          <span>{{ preview ? "Formulário" : "Pré-visualizar" }}</span>
        </q-tooltip>
      </q-btn>

      <v-spacer></v-spacer>
      <q-btn color="grey" dark @click="closeForm" :disabled="loading">
        Cancelar
      </q-btn>

      <q-btn
        v-if="id"
        color="primary"
        @click="updateMessage"
        :loading="loading"
      >
        Atualizar
      </q-btn>
      <q-btn v-else color="primary" @click="createMessage" :loading="loading">
        Criar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import Message from "./Component";
import TipTapEditor from "../TipTapEditor";

export default {
  components: { TipTapEditor, Message },
  props: { data: Object, default: {} },
  data() {
    return {
      // General
      preview: false,

      // Fields
      id: this.data ? this.data.id : null,
      title: this.data ? this.data.title : "",
      caption: this.data ? this.data.caption : "",
      content: this.data ? this.data.content : "",
      contentPrintError: false,
      author: this.$store.state.user.user.profile.name,
      published_at: this.data
        ? this.data.published_at
        : this.$moment().format(),
      tags: this.data ? Array.from(new Set(this.data.tags)) || [] : null,
      tagsSuggestions: Array.from(
        new Set(
          this.$store.state.messages.messages
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
    preview(val) {
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
    content: function(val) {
      this.contentPrintError = !val;
    },
    tags(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.tags.pop());
      }
    }
  },
  methods: {
    createMessage() {
      if (this.checkFormValidity()) {
        let data = {
          title: this.title,
          caption: this.caption,
          content: this.content,
          tags: this.tags,
          published_at: this.$moment().format(),
          author: this.author
        };

        this.loading = true;

        setTimeout(() => {
          this.loading = false;
          this.$emit("createMessage", data);
        }, 1000);
      }
    },
    updateMessage() {
      if (this.checkFormValidity()) {
        let data = {
          title: this.title,
          caption: this.caption,
          content: this.content,
          tags: this.tags,
          published_at: this.published_at,
          author: this.author
        };

        this.loading = true;

        setTimeout(() => {
          this.loading = false;
          this.$emit("updateMessage", { id: this.id, data });
        }, 1000);
      }
    },
    checkFormValidity() {
      if (this.$refs.form.validate() && this.content) {
        return true;
      } else {
        if (!this.content) this.contentPrintError = true;

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
        return false;
      }
    },
    closeForm() {
      this.$emit("closeForm");
    }
  }
};
</script>

<style></style>
