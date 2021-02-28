<template>
  <q-card class="news-poster rounded-lg">
    <q-img
      :src="image.url || ''"
      :ratio="image.ratio"
      width="100%"
      height="100%"
    >
      <div class="full-height full-width row items-end">
        <div class="col background q-pa-md text-white">
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
                {{ title }}
              </p>
            </div>

            <div v-if="!noActions && !caption && route" class="col-auto">
              <router-link :to="route" v-slot="{ href }">
                <q-btn flat round size="lg" link color="white" :to="href">
                  <q-icon name="chevron_right" size="md" />
                </q-btn>
              </router-link>
            </div>
          </div>

          <div v-if="caption" class="row">
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
                {{ caption }}
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
                      clickable
                      :to="{
                        name: 'news_edit',
                        params: { id: id }
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
      v-if="metadata"
      class="flex align-center metadata flex-column flex-sm-row"
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
    </q-card-section>

    <q-separator v-if="metadata" />

    <q-card-section v-if="content">
      <div
        class="content mce-content-body black--text body-1"
        v-html="content"
      />
    </q-card-section>

    <q-separator v-if="content && tags" />

    <q-card-section v-if="tags">
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
    </q-card-section>
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
// .metadata span:not(:last-child):after {
//   content: "\F09DE";
//   display: inline-block;
//   font: normal normal normal 24px/1 "Material Design Icons";
//   font-size: inherit;
//   text-rendering: auto;
//   line-height: inherit;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
// }

.q-img__content > div {
  padding: 0;
  background: none;
}
</style>
