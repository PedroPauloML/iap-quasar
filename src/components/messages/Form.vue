<template>
  <q-card>
    <q-card-section>
      <p class="text-h6 q-mb-none">
        {{ id ? "Editando mensagem" : "Criando nova mensagem" }}
      </p>
      <p class="q-mb-none text-grey-8">
        {{
          id
            ? "Edite as informações abaixo para atualizar a mensagem."
            : "Insira as informações abaixo para criar uma nova mensagem."
        }}
        É possível pré-visualizar como a mensagem ficará antes de criá-la
        clicando em "Pré-visualização".
      </p>
    </q-card-section>

    <q-card-section>
      <div ref="previewContainer" v-show="preview">
        <p class="text-h6 text-primary text-weight-bold">Pré-visualização</p>
        <Message
          :title="title"
          :caption="caption"
          :content="content"
          :author="author"
          :published_at="published_at"
          :tags="tags"
          :metadata="{ read_time: true }"
          @filterMessages="search => (value.search = search)"
          class="q-mb-lg"
          no-actions
        />
      </div>
      <q-form
        v-show="!preview"
        ref="form"
        @submit="id ? updateMessage : createMessage"
      >
        <q-input
          ref="title"
          v-model="title"
          :rules="requiredRules.title"
          label="Título"
        />

        <q-input
          ref="caption"
          v-model="caption"
          :rules="requiredRules.caption"
          label="Legenda"
        />

        <div
          ref="contentContainer"
          :class="{
            'content-container bg-white': true,
            fullscreen: fullscreen
          }"
        >
          <div
            :class="{
              'row items-center': true,
              'bg-primary text-white text-weight-bold q-pa-sm': fullscreen
            }"
          >
            <div class="col">
              <p
                :class="{
                  'q-mt-md q-mb-sm': !fullscreen,
                  'q-mb-none': fullscreen,
                  'text-red': contentPrintError
                }"
              >
                Conteúdo
              </p>
              <p
                ref="contentLabelError"
                v-show="contentPrintError && !fullscreen"
                class="text-red q-mb-sm"
              >
                O conteúdo da notícia é obrigatório(a)
              </p>
            </div>

            <q-btn
              dense
              flat
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click.stop="fullscreen = !fullscreen"
              class="col-auto"
            >
              <q-tooltip>
                {{ fullscreen ? "Sair da tela cheia" : "Entrar em tela cheia" }}
              </q-tooltip>
            </q-btn>
          </div>

          <div class="q-mb-lg">
            <TipTapEditor
              ref="content"
              v-model="content"
              :max-size="fullscreen ? 'calc(100vh - 48px - 40px)' : null"
            />
          </div>
        </div>

        <q-select
          v-model="tags"
          multiple
          :options="tagsSuggestions"
          use-chips
          use-input
          hide-dropdown-icon
          input-debounce="0"
          label="Tags (opcional)"
          hint="Máximo de 5 tags"
          new-value-mode="add"
        />

        <q-btn label="Submeter fomrulário" class="hidden" />
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

      <q-space />

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
      fullscreen: false,

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
      this.$refs.form.validate(false).then(valid => {
        if (valid) {
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
        } else {
          this.scrollToFieldNotValid();
        }
      });
    },
    updateMessage() {
      this.$refs.form.validate(false).then(valid => {
        if (valid) {
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
        } else {
          this.scrollToFieldNotValid();
        }
      });
    },
    scrollToFieldNotValid() {
      if (!this.content) {
        this.contentPrintError = true;
        let y =
          this.$refs.contentContainer.$el.getBoundingClientRect().top +
          window.pageYOffset -
          150;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }

      if (!this.title) {
        let y =
          this.$refs.title.$el.getBoundingClientRect().top +
          window.pageYOffset -
          150;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }

      if (!this.caption) {
        let y =
          this.$refs.caption.$el.getBoundingClientRect().top +
          window.pageYOffset -
          150;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }

      if (!this.content) {
        let y =
          this.$refs.contentLabelError.getBoundingClientRect().top +
          window.pageYOffset -
          150;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    },
    closeForm() {
      this.$emit("closeForm");
    }
  }
};
</script>

<style></style>
