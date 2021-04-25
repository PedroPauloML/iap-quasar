<template>
  <q-card>
    <q-card-section>
      <p class="text-h6 q-mb-none">
        {{ formTitle }}
      </p>
      <p class="q-mb-none text-grey-8">
        {{ formCaption }}
      </p>
    </q-card-section>

    <q-card-section>
      <q-form v-show="!preview" ref="form" @submit="sendNews">
        <Cropper
          ref="cover"
          :value="''"
          @input="val => (news.cover = val)"
          :currentImage="currentImage"
          coverName="Imagem de capa"
        />
        <p v-if="coverPrintError" class="text-red text-body2 q-mt-sm">
          A capa da notícia é obrigatório(a)
        </p>
        <!-- <v-file-input
          v-model="cover"
          label="Imagem de capa"
          show-size
          prepend-icon="mdi-camera"
          required
          :rules="requiredRules['cover']"
        ></v-file-input> -->

        <q-input
          ref="news[title]"
          v-model="news.title"
          :rules="requiredRules.title"
          label="Título"
          required
        ></q-input>

        <q-input
          ref="news[caption]"
          v-model="news.caption"
          :rules="requiredRules.caption"
          label="Legenda"
          required
        ></q-input>

        <p class="body-2 mt-2">Conteúdo</p>
        <p
          ref="contentHtmlLabelError"
          v-show="contentHtmlPrintError"
          class="text-red text-body2"
        >
          O conteúdo da notícia é obrigatório(a)
        </p>
        <div class="q-mb-lg">
          <TipTapEditor
            ref="news[content_html]"
            :value="news.content_html"
            @input="
              ({ plainText, html }) => {
                news.content_text = plainText;
                news.content_html = html;
              }
            "
          />
        </div>

        <q-select
          ref="news[tags]"
          label="Tags (opcional)"
          v-model="news.tags"
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

      <News
        v-if="preview"
        :data="{ ...news, cover: news.cover || { url: currentImage } }"
        :coverRatio="16 / 9"
        :metadata="{
          read_time: true
        }"
        no-actions
      />
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
        v-if="news.id"
        color="primary"
        @click="sendNews"
        :loading="loading"
      >
        Atualizar
      </q-btn>
      <q-btn v-else color="primary" @click="sendNews" :loading="loading">
        Criar
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import News from "../../components/news/Component";
import TipTapEditor from "../TipTapEditor";
import Cropper from "../Cropper";

import NewsRequest from "src/services/requests/news";

export default {
  components: { TipTapEditor, Cropper, News },
  props: { data: Object },
  data() {
    return {
      // General
      preview: false,

      // Fields
      newsSchema: {
        id: null,
        title: "",
        caption: "",
        cover: null,
        content_html: "",
        tags: []
      },
      news: null,
      currentImage: this.data ? this.data.cover.url : null,
      coverPrintError: false,
      contentHtmlPrintError: false,
      initialTags: [],
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
        { field: "cover", name: "Imagem" },
        { field: "content_html", name: "Conteúdo" }
      ].reduce((acc, val) => {
        acc[val.field] = [v => !!v || `${val.name} é obrigatório(a)`];
        return acc;
      }, {}),

      // Form variables
      valid: true,
      loading: false
    };
  },
  created() {
    this.news = this.data
      ? {
          ...JSON.parse(JSON.stringify(this.data)),
          cover: null
        }
      : this.newsSchema;

    this.initialTags = Array.from(this.news.tags || []);
    this.news.tags = this.formatTags(this.news.tags);

    setTimeout(() => {
      this.contentHtmlPrintError = false;
      this.coverPrintError = false;
    }, 200);
  },
  watch: {
    "news.content_html": function(val) {
      this.contentHtmlPrintError = !val;
    },
    "news.cover": function(val) {
      this.coverPrintError = !val;
    },
    "news.tags"(val) {
      if (this.$refs.form && val.length > 5) {
        this.$nextTick(() => this.news.tags.pop());
      }
    }
  },
  computed: {
    formTitle() {
      return this.news.id ? "Atualizando notícia" : "Criando nova notícia";
    },
    formCaption() {
      let caption;
      if (this.news.id) {
        caption =
          "Edite as informações abaixo para atualizar a notícia. " +
          "É possível pré-visualizar como a notícia ficará antes de salvá-la " +
          'clicando em "Pré-visualização".';
      } else {
        caption =
          "Insira as informações abaixo para criar uma nova notícia. " +
          "É possível pré-visualizar como a notícia ficará antes de salvá-la " +
          'clicando em "Pré-visualização".';
      }
      return caption;
    }
  },
  methods: {
    formatTags(tags) {
      console.log("tags", tags);
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

    sendNews() {
      if (this.news.id ? true : !!this.news.cover) {
        this.$refs.form.validate(false).then(valid => {
          if (valid && this.news.content_html) {
            let formData = new FormData();

            formData.set("news[id]", this.news.id);
            formData.set("news[title]", this.news.title);
            formData.set("news[caption]", this.news.caption);

            if (!!this.news.cover) formData.set("news[cover]", this.news.cover);

            formData.set("news[content_html]", this.news.content_html);
            formData.set("news[content_text]", this.news.content_text);

            this.news.tags.forEach((tag, i) => {
              let tagToKeep = this.initialTags.find(t => t.id == tag.value);

              if (tagToKeep) {
                formData.set(`news[tags_attributes][${i}][id]`, tagToKeep.id);
                formData.set(
                  `news[tags_attributes][${i}][name]`,
                  tagToKeep.name
                );
              } else {
                formData.set(`news[tags_attributes][${i}][name]`, tag);
              }
            });

            this.initialTags.forEach((tag, i) => {
              let tagToDestroy = this.news.tags.find(t => t.value == tag.id);
              if (!tagToDestroy) {
                formData.set(
                  `news[tags_attributes][${i + this.news.tags.length}][id]`,
                  tag.id
                );
                formData.set(
                  `news[tags_attributes][${i +
                    this.news.tags.length}][_destroy]`,
                  true
                );
              }
            });

            this.loading = true;

            if (this.news.id) {
              NewsRequest.update(this.news.id, formData)
                .then(res => {
                  if (res) {
                    this.$q.notify({
                      message: "Notícia atualizada com sucesso",
                      icon: "check",
                      color: "positive"
                    });

                    this.$router.push({
                      name: "news_show",
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
              NewsRequest.create(formData)
                .then(res => {
                  if (res) {
                    this.loading = false;

                    this.$q.notify({
                      message: "Notícia criada com sucesso",
                      icon: "check",
                      color: "positive"
                    });

                    this.$router.push({
                      name: "news_show",
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

            if (!this.news.title) {
              element = this.$refs.title.$el;
            } else if (!this.news.caption) {
              element = this.$refs.caption.$el;
            } else if (!this.news.content_html) {
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
      } else {
        let y =
          this.$refs.cover.$el.getBoundingClientRect().top +
          window.pageYOffset -
          60;
        this.coverPrintError = true;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    }
  }
};
</script>

<style></style>
