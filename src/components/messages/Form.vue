<template>
  <q-card>
    <q-card-section>
      <p class="text-h6 q-mb-none">{{ formTitle }}</p>
      <p class="q-mb-none text-grey-8">{{ formCaption }}</p>
    </q-card-section>

    <q-card-section>
      <div ref="previewContainer" v-if="preview">
        <p class="text-h6 text-primary text-weight-bold">Pré-visualização</p>
        <Message
          :data="message"
          :metadata="{ read_time: true }"
          class="q-mb-lg"
          no-actions
        />
      </div>

      <q-form v-show="!preview" ref="form" @submit="sendMessage">
        <q-input
          label="Título"
          ref="message[title]"
          v-model="message.title"
          :rules="formRules.title"
        />

        <q-input
          label="Legenda"
          ref="message[caption]"
          v-model="message.caption"
          :rules="formRules.caption"
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
                  'text-red': contentHtmlPrintError
                }"
              >
                Conteúdo
              </p>
              <p
                ref="contentHtmlLabelError"
                v-show="contentHtmlPrintError && !fullscreen"
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
              ref="message[content_html]"
              :value="message.content_html"
              @input="
                ({ plainText, html }) => {
                  message.content_text = plainText;
                  message.content_html = html;
                }
              "
              :max-size="fullscreen ? 'calc(100vh - 48px - 40px)' : null"
            />
          </div>
        </div>

        <q-select
          label="Tags (opcional)"
          ref="message[tags]"
          v-model="message.tags"
          hint="Máximo de 5 tags"
          :options="tagsSuggestions"
          multiple
          use-chips
          use-input
          map-options
          hide-dropdown-icon
          input-debounce="0"
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
        v-if="message.id"
        color="primary"
        @click="sendMessage"
        :loading="loading"
      >
        Atualizar
      </q-btn>
      <q-btn v-else color="primary" @click="sendMessage" :loading="loading">
        Criar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import MessageRequest from "src/services/requests/message";

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
      messageSchema: {
        id: null,
        title: "",
        caption: "",
        content_html: "",
        tags: []
      },
      message: null,
      contentHtmlPrintError: false,
      initialTags: [],
      tagsSuggestions: [],
      tagsSearch: null,

      // Rules
      formRules: this.parseFormRules([
        { field: "title", name: "Título", required: true },
        { field: "caption", name: "Legenda", required: true },
        { field: "content_html", name: "Conteúdo", required: true }
      ]),

      // Form variables
      loading: false
    };
  },
  created() {
    this.message = this.data
      ? JSON.parse(JSON.stringify(this.data))
      : this.messageSchema;

    this.initialTags = Array.from(this.message.tags || []);
    this.message.tags = this.formatTags(this.message.tags);

    setTimeout(() => {
      this.contentHtmlPrintError = false;
      this.coverPrintError = false;
    }, 200);
  },
  watch: {
    "message.content_html": function(val) {
      this.contentHtmlPrintError = !val;
    },
    "message.tags"(val) {
      if (this.$refs.form && val.length > 5) {
        this.$nextTick(() => this.message.tags.pop());
      }
    }
  },
  computed: {
    formTitle() {
      return this.message.id ? "Atualizando mensagem" : "Criando nova mensagem";
    },
    formCaption() {
      let caption;
      if (this.message.id) {
        caption =
          "Edite as informações abaixo para atualizar a mensagem. " +
          "É possível pré-visualizar como a mensagem ficará antes de salvá-la " +
          'clicando em "Pré-visualização".';
      } else {
        caption =
          "Insira as informações abaixo para criar uma nova mensagem. " +
          "É possível pré-visualizar como a mensagem ficará antes de salvá-la " +
          'clicando em "Pré-visualização".';
      }
      return caption;
    }
  },
  methods: {
    formatTags(tags) {
      return tags.map(tag => {
        return {
          label: tag.name,
          value: tag.id
        };
      });
    },

    closeForm() {
      this.$emit("closeForm");
    },

    sendMessage() {
      if (!this.loading) {
        this.$refs.form.validate(false).then(valid => {
          if (valid && this.message.content_html) {
            this.loading = true;

            let params = {
              id: this.message.id,
              title: this.message.title,
              caption: this.message.caption,
              content_html: this.message.content_html,
              content_text: this.message.content_text,
              tags_attributes: []
            };

            this.message.tags.forEach((tag, i) => {
              let tagToKeep = this.initialTags.find(t => t.id == tag.value);
              let tagParams = {};

              if (tagToKeep) {
                tagParams["id"] = tagToKeep.id;
                tagParams["name"] = tagToKeep.name;
              } else {
                tagParams["name"] = tag;
              }

              params.tags_attributes.push(tagParams);
            });

            this.initialTags.forEach((tag, i) => {
              let tagToDestroy = this.message.tags.find(t => t.value == tag.id);

              if (!tagToDestroy) {
                params.tags_attributes.push({
                  id: tag.id,
                  _destroy: true
                });
              }
            });

            if (this.message.id) {
              MessageRequest.update(this.message.id, params)
                .then(res => {
                  if (res) {
                    this.$q.notify({
                      message: "Mensagem atualizada com sucesso",
                      icon: "check",
                      color: "positive"
                    });

                    this.$router.push({
                      name: "messages_show",
                      params: { id: res.data.id }
                    });
                  }
                })
                .catch(err => {
                  this.loading = false;

                  if (err.response && err.response.data.error.full_message) {
                    this.$q.notify({
                      message: err.response.data.error.full_message,
                      icon: "info",
                      color: "negative"
                    });
                  } else {
                    this.$q.notify({
                      message:
                        "Ocorreu um erro ao tentar criar a notícia. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                      icon: "info",
                      color: "negative"
                    });
                  }
                });
            } else {
              MessageRequest.create(params)
                .then(res => {
                  if (res) {
                    this.loading = false;

                    this.$q.notify({
                      message: "Mensagem criada com sucesso",
                      icon: "check",
                      color: "positive"
                    });

                    this.$router.push({
                      name: "messages_show",
                      params: { id: res.data.id }
                    });
                  }
                })
                .catch(err => {
                  this.loading = false;

                  if (err.response && err.response.data.error.full_message) {
                    this.$q.notify({
                      message: err.response.data.error.full_message,
                      icon: "info",
                      color: "negative"
                    });
                  } else {
                    this.$q.notify({
                      message:
                        "Ocorreu um erro ao tentar criar a notícia. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                      icon: "info",
                      color: "negative"
                    });
                  }
                });
            }
          } else {
            let element;

            if (!this.message.title) {
              element = this.$refs.title.$el;
            } else if (!this.message.caption) {
              element = this.$refs.caption.$el;
            } else if (!this.message.content_html) {
              element = this.$refs.contentHtmlLabelError;
              this.contentHtmlPrintError = true;
            }

            let y =
              element.getBoundingClientRect().top + window.pageYOffset - 60;
            window.scrollTo({
              top: y,
              behavior: "smooth"
            });
          }
        });
      }
    }
  }
};
</script>

<style></style>
