<template>
  <q-card class="news-poster rounded-lg">
    <q-img
      :src="news.cover.url || ''"
      :ratio="coverRatio"
      width="100%"
      height="100%"
    >
      <div class="full-height full-width row">
        <div class="col-12 self-start q-pa-md">
          <q-chip
            v-if="!news.published"
            square
            icon="history_edu"
            color="primary-lighten-2"
            text-color="white"
            class="text-bold"
          >
            Rascunho
            <q-tooltip anchor="center end" self="center start">
              Essa notícia ainda não foi publicada
            </q-tooltip>
          </q-chip>
        </div>

        <div class="col-12 self-end background q-pa-md text-white">
          <div class="row">
            <div class="col self-center">
              <p
                :class="{
                  'text-h5': true,
                  'text-truncate-1-line': route ? true : false,
                  'q-pa-none': true,
                  'q-mb-sm': true
                }"
              >
                {{ news.title }}
              </p>
            </div>

            <div v-if="!noActions && !news.caption && route" class="col-auto">
              <router-link :to="route" v-slot="{ href }">
                <q-btn flat round size="lg" link color="white" :to="href">
                  <q-icon name="chevron_right" size="md" />
                </q-btn>
              </router-link>
            </div>
          </div>

          <div v-if="news.caption" class="row">
            <div class="col self-center">
              <p
                :class="{
                  'text-white': true,
                  'text-subtitle1': true,
                  'q-pa-none': true,
                  'q-mb-none': true,
                  'self-center': true,
                  'text-truncate-2-line': route ? true : false
                }"
              >
                {{ news.caption }}
              </p>
            </div>

            <div v-if="!noActions && route" class="col-auto">
              <router-link :to="route" v-slot="{ href }">
                <q-btn flat round size="lg" link color="white" :to="href">
                  <q-icon name="chevron_right" size="md" />
                </q-btn>
              </router-link>
            </div>

            <div v-if="!noActions && userSigned" class="col-auto">
              <q-btn flat round size="lg" color="white">
                <q-icon name="mdi-dots-vertical" size="md" />

                <q-menu>
                  <q-list dense flat>
                    <q-item
                      v-if="!news.published"
                      clickable
                      @click="publishNews"
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
                        name: 'news_edit',
                        params: { id: news.id }
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
        </div>
      </div>
    </q-img>

    <q-card-section
      v-if="!noContent"
      class="flex align-center metadata flex-column flex-sm-row text-overline text-uppercase"
    >
      <span v-if="metadata.read_time">
        Tempo de leitura:
        {{ Math.ceil(news.content_text.split(" ").length / 5 / 60) }} minuto(s)
      </span>

      <span>
        Publicado em:
        {{
          news.published_at
            ? $moment(news.published_at).format("DD/MM/YYYY hh:mm")
            : "Não publicado"
        }}
      </span>

      <span v-if="news.author_name"> Autor: {{ news.author_name }} </span>
    </q-card-section>

    <q-separator v-if="!noContent" />

    <q-card-section v-if="!noContent && news.content_html" class="q-pa-none">
      <!-- <div
        class="content mce-content-body black--text text-body1"
        v-html="content"
      /> -->
      <TipTapEditor ref="content" v-model="news.content_html" readonly />
    </q-card-section>

    <q-separator v-if="!noContent && news.content_html && news.tags" />

    <q-card-section v-if="!noContent && news.tags">
      <router-link
        v-for="(tag, index) in news.tags"
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
          {{ tag.name || tag.label }}
        </q-chip>
      </router-link>
    </q-card-section>
  </q-card>
</template>

<script>
import NewsRequest from "src/services/requests/news";

import TipTapEditor from "../TipTapEditor";

export default {
  props: {
    data: { type: Object, required: true },
    coverRatio: { type: Number, required: true },
    metadata: {
      read_time: { type: Boolean, default: false },
      default: () => ({ read_time: false })
    },
    noContent: { type: Boolean, default: false },
    noActions: { type: Boolean, default: false }
  },
  components: { TipTapEditor },
  data() {
    return {
      news: JSON.parse(JSON.stringify(this.data)),
      optionsMenu: false,
      route: null,

      // Loading variables
      publishing: false,
      destroying: false
    };
  },
  created() {
    this.route =
      this.$router.currentRoute.name != "news_show" &&
      !!this.news &&
      !!this.news.id
        ? { name: "news_show", params: { id: this.news.id } }
        : null;
  },
  watch: {
    data: {
      async handler(newValue) {
        let newsData = JSON.parse(JSON.stringify(newValue));

        // If has the method .name, it's a File({})
        if (!!newValue.cover.name)
          newsData.cover = { url: await this.toBase64(newValue.cover) };

        this.news = newsData;
      },
      deep: true
    }
  },
  methods: {
    tagRoute(tag) {
      return { name: "news", query: { search: tag } };
    },

    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = error => reject(error);
      });
    },

    edit() {
      this.$router.push();
    },
    publishNews() {
      if (!this.publishing) {
        this.publishing = true;

        NewsRequest.publish(this.news.id)
          .then(res => {
            if (res) {
              this.$q.notify({
                message: "Notícia publicada com sucesso",
                icon: "check",
                color: "positive"
              });

              this.news = res.data;
              this.publishing = false;

              this.$emit("onPublish");
            }
          })
          .catch(err => {
            this.publishing = false;

            if (err.response && err.response.news.error.full_message) {
              this.$q.notify({
                message: err.response.news.error.full_message,
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

          NewsRequest.destroy(this.news.id)
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

              if (err.response && err.response.news.error.full_message) {
                this.$q.notify({
                  message: err.response.news.error.full_message,
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

<style lang="scss" scoped>
.background {
  background: rgb(0, 0, 0);
  background: -moz-linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  background: -webkit-linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
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

.q-img__content > div {
  padding: 0;
  background: none;
}
</style>
