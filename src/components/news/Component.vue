<template>
  <q-card class="news-poster rounded-lg">
    <q-img :src="image.url || ''" :aspect-ratio="image.ratio">
      <div class="fill-height d-flex align-end">
        <div class="col background pa-4 white--text">
          <div class="d-flex align-center">
            <q-card-section
              :class="{
                flex: true,
                title: true,
                'text-truncate-1-line': route ? true : false,
                'pa-0': true,
                'mb-2': true
              }"
            >
              {{ title }}
            </q-card-section>

            <router-link
              v-if="!noActions && !caption && route"
              :to="route"
              v-slot="{ href }"
            >
              <q-btn icon x-large link color="white" :to="href">
                <q-icon size="40">mdi-chevron-right</q-icon>
              </q-btn>
            </router-link>
          </div>

          <div v-if="caption" class="d-flex align-center">
            <q-card-section
              :class="{
                flex: true,
                'white--text': true,
                'subtitle-1': true,
                'pa-0': true,
                'text-truncate-2-line': route ? true : false
              }"
            >
              {{ caption }}
            </q-card-section>

            <router-link
              v-if="!noActions && route"
              :to="route"
              v-slot="{ href }"
            >
              <q-btn icon x-large link color="white" :to="href">
                <q-icon size="40">mdi-chevron-right</q-icon>
              </q-btn>
            </router-link>

            <v-menu
              v-if="!noActions && userSigned"
              v-model="optionsMenu"
              bottom
              left
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <q-btn icon x-large color="white" v-bind="attrs" v-on="on">
                  <q-icon>mdi-dots-vertical</q-icon>
                </q-btn>
              </template>

              <v-list dense flat>
                <v-list-item
                  :to="{
                    name: 'news_edit',
                    params: { id: id }
                  }"
                >
                  <v-list-item-icon>
                    <q-icon>mdi-pencil</q-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    Editar
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="destroy">
                  <v-list-item-icon>
                    <q-icon>mdi-delete</q-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    Excluir
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>

      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0 secondary darken-1"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-row>
      </template>
    </q-img>

    <q-card-text
      v-if="metadata"
      class="d-flex align-center metadata flex-column flex-sm-row"
    >
      <span v-if="metadata.read_time" class="overline">
        Tempo de leitura:
        {{ Math.ceil(content.split(" ").length / 5 / 60) }} minuto(s)
      </span>

      <span v-if="metadata.published_at" class="overline">
        Publicado em:
        {{
          $moment(metadata.published_at, "DD/MM/YYYY")
            | moment("DD/MM/YYYY hh:mm")
        }}
      </span>

      <span v-if="metadata.author" class="overline">
        Autor: {{ metadata.author }}
      </span>
    </q-card-text>

    <q-separator v-if="metadata" />

    <q-card-text v-if="content">
      <div
        class="content mce-content-body black--text body-1"
        v-html="content"
      />
    </q-card-text>

    <q-separator v-if="content && tags" />

    <q-card-text v-if="tags">
      <router-link
        v-for="(tag, index) in tags"
        :key="index"
        :to="tagRoute(tag)"
        v-slot="{ href }"
      >
        <q-chip
          link
          :to="href"
          class="ma-2 font-weight-medium"
          color="accent"
          label
          text-color="white"
        >
          <q-icon left>mdi-label</q-icon>
          {{ tag }}
        </q-chip>
      </router-link>
    </q-card-text>
  </q-card>
</template>

<script>
export default {
  props: {
    id: Number,
    title: String,
    caption: String,
    image: {
      url: String,
      ratio: String
    },
    content: String,
    metadata: {
      read_time: Boolean,
      published_at: String,
      author: String
    },
    tags: Array,
    noActions: { type: Boolean, default: false }
  },
  data() {
    return {
      optionsMenu: false,
      route:
        this.$router.currentRoute.name != "news_show" && this.id
          ? { name: "news_show", params: { id: this.id } }
          : null
    };
  },
  methods: {
    tagRoute(tag) {
      return { name: "news", query: { search: tag } };
    },
    edit() {
      this.$router.push();
    },
    destroy() {
      if (confirm("Tem certeza que deseja remover essa notícia?")) {
        this.$store
          .dispatch("news/removeNews", this.id)
          .then(() => this.$emit("onDestroy"));
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
</style>
