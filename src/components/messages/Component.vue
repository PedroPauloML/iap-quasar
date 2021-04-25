<template>
  <q-card
    :class="{
      message: true,
      rounded: true,
      'full-content': !!fullContent || !showReadMore
    }"
  >
    <q-card-section class="header">
      <div class="flex items-center">
        <q-chip
          v-if="!message.published"
          square
          icon="history_edu"
          color="primary-lighten-2"
          text-color="white"
          class="text-bold q-mr-md"
        >
          Rascunho
          <q-tooltip anchor="center end" self="center start">
            Essa mensagem ainda não foi publicada
          </q-tooltip>
        </q-chip>

        <router-link
          v-if="message.id && $router.currentRoute.name != 'messages_show'"
          :to="{ name: 'messages_show', params: { id: message.id } }"
          v-slot="{ href }"
        >
          <a class="text-h4 text-weight-bold text-primary" :href="href">
            {{ message.title }}
          </a>
        </router-link>
        <span v-else class="text-h4 text-weight-bold text-primary">
          {{ message.title }}
        </span>
      </div>

      <span class="text-grey-8 text-weight-medium q-my-sm block">
        {{ message.caption }}
      </span>

      <div class="row">
        <div
          class="col-12 col-sm self-center metadata text-overline text-uppercase"
        >
          <span v-if="metadata.read_time">
            Tempo de leitura:
            {{ Math.ceil(message.content_text.split(" ").length / 5 / 60) }}
            minuto(s)
          </span>

          <span>
            Publicado em:
            {{
              message.published_at
                ? $moment(message.published_at).format("DD/MM/YYYY hh:mm")
                : "Não publicado"
            }}
          </span>

          <span v-if="message.author_name">
            Autor: {{ message.author_name }}
          </span>
        </div>

        <div v-if="!noActions" class="col-auto actions">
          <q-btn flat round color="accent" @click="saved = !saved">
            <q-icon v-if="saved" name="mdi-bookmark" />
            <q-icon v-else name="mdi-bookmark-outline" />

            <q-tooltip>
              {{ saved ? "Remover marcação" : "Marcar publicação" }}
            </q-tooltip>
          </q-btn>

          <q-btn v-if="userSigned" flat round>
            <q-icon name="mdi-dots-vertical" />

            <q-menu>
              <q-list dense flat>
                <q-item
                  v-if="!message.published"
                  clickable
                  @click="publishMessage"
                  class="bg-positive"
                  :disable="publishing"
                >
                  <q-item-section avatar>
                    <q-icon name="send" />
                  </q-item-section>

                  <q-item-section>
                    Publicar
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  :to="{
                    name: 'messages_edit',
                    params: { id: message.id }
                  }"
                >
                  <q-item-section avatar>
                    <q-icon name="edit" />
                  </q-item-section>

                  <q-item-section>
                    Editar
                  </q-item-section>
                </q-item>

                <q-item clickable @click="destroy">
                  <q-item-section avatar>
                    <q-icon name="delete" />
                  </q-item-section>

                  <q-item-section>
                    Excluir
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <div class="content-wrapper tiptap">
      <q-card-section v-if="message.content_html">
        <!-- <div class="content editor__content" v-html="content" /> -->
        <TipTapEditor
          ref="content"
          v-model="message.content_html"
          readonly
          :max-size="showReadMore ? '50vh' : 'auto'"
        />
      </q-card-section>

      <div v-if="showReadMore" class="show-more flex align-end">
        <div class="col background pa-4 white--text">
          <div class="flex justify-center">
            <q-btn
              flat
              link
              class="text-h6 text-primary text-weight-bold full-width"
              @click="showReadMore = !showReadMore"
            >
              Continuar lendo
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <q-separator v-if="message.content_html && message.tags" />

    <q-card-section v-if="message.tags">
      <router-link
        v-for="(tag, index) in message.tags"
        :key="index"
        :to="tagRoute(tag.slug)"
        v-slot="{ href }"
      >
        <q-chip
          clickable
          class="ma-2 font-weight-medium"
          color="accent"
          label
          text-color="white"
          @click="noActions ? null : $router.push(href)"
        >
          <q-icon name="mdi-label" size="sm" class="q-mr-sm" />
          {{ tag.name || tag.label || tag }}
        </q-chip>
      </router-link>
    </q-card-section>
  </q-card>
</template>

<script>
import MessageRequest from "src/services/requests/message";

import TipTapEditor from "../TipTapEditor";

export default {
  props: {
    data: { type: Object, required: true },
    metadata: {
      read_time: { type: Boolean, default: false },
      default: () => ({ read_time: false })
    },
    fullContent: { type: Boolean, default: false },
    noActions: { type: Boolean, default: false }
  },
  components: { TipTapEditor },
  data() {
    return {
      message: JSON.parse(JSON.stringify(this.data)),
      saved: false,
      showReadMore: !this.fullContent,
      optionsMenu: false,

      // Loading variables
      publishing: false,
      destroying: false
    };
  },
  watch: {
    data: {
      async handler(newValue) {
        this.message = JSON.parse(JSON.stringify(newValue));
      },
      deep: true
    }
  },
  methods: {
    tagRoute(tag) {
      if (!tag) return "";
      return { name: "messages", query: { search: tag } };
    },

    publishMessage() {
      if (!this.publishing) {
        this.publishing = true;

        MessageRequest.publish(this.message.id)
          .then(res => {
            if (res) {
              this.$q.notify({
                message: "Notícia publicada com sucesso",
                icon: "check",
                color: "positive"
              });

              this.message = res.data;
              this.publishing = false;

              this.$emit("onPublish");
            }
          })
          .catch(err => {
            this.publishing = false;

            if (err.response && err.response.data.error.full_message) {
              this.$q.notify({
                message: err.response.data.error.full_message,
                icon: "info",
                color: "negative"
              });
            } else {
              this.$q.notify({
                message:
                  "Ocorreu um erro ao tentar publicar a notícia. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                icon: "info",
                color: "negative"
              });
            }
          });
      }
    },
    destroy() {
      if (!this.destroying) {
        if (confirm("Tem certeza que deseja remover essa notícia?")) {
          this.destroying = true;

          MessageRequest.destroy(this.message.id)
            .then(res => {
              if (res) {
                this.$q.notify({
                  message: "Notícia removida com sucesso",
                  icon: "check",
                  color: "positive"
                });

                this.$emit("onDestroy");
              }
            })
            .catch(err => {
              this.destroying = false;

              if (err.response && err.response.data.error.full_message) {
                this.$q.notify({
                  message: err.response.data.error.full_message,
                  icon: "info",
                  color: "negative"
                });
              } else {
                this.$q.notify({
                  message:
                    "Ocorreu um erro ao tentar publicar a notícia. Tente novamente. Caso o erro persista, entre em contato com o suporte técnico.",
                  icon: "info",
                  color: "negative"
                });
              }
            });
        }
      }
    }
  }
};
</script>

<style lang="scss">
.message {
  .show-more {
    background: rgb(255, 255, 255);
    background: -moz-linear-gradient(
      0deg,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background: -webkit-linear-gradient(
      0deg,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#000000",GradientType=1);
  }
  .metadata span:not(:last-child):after {
    content: "\F09DE";
    display: inline-block;
    font: normal normal normal 24px/1 "Material Design Icons";
    font-size: inherit;
    text-rendering: auto;
    line-height: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .content {
    padding: 0 !important;

    p {
      width: 100%;
    }
    img {
      border-radius: 5px;
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
      margin: 15px auto;
      height: auto;
      max-width: 100%;
      max-height: 50vh;
    }
  }

  &:not(.full-content) {
    .content {
      min-height: 100px;
      max-height: 50vh;
      overflow: hidden;
    }

    .content-wrapper {
      position: relative;
      .show-more {
        position: absolute;
        width: 100%;
        bottom: 0;
      }
    }
  }
}
</style>
