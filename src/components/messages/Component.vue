<template>
  <q-card
    :class="{
      message: true,
      rounded: true,
      'full-content': !!full_content || !showReadMore
    }"
  >
    <q-card-section class="header">
      <router-link
        v-if="id && $router.currentRoute.name != 'messages_show'"
        :to="{ name: 'messages_show', params: { id: id } }"
        v-slot="{ href }"
      >
        <a class="text-h4 text-weight-bold text-primary" :href="href">
          {{ title }}
        </a>
      </router-link>
      <span v-else class="text-h4 text-weight-bold text-primary">
        {{ title }}
      </span>

      <span class="text-grey-8 text-weight-medium q-my-sm block">
        {{ caption }}
      </span>

      <div class="row">
        <div class="col-12 col-sm self-center metadata">
          <span v-if="metadata.read_time" class="text-overline text-uppercase">
            Tempo de leitura:
            {{ Math.ceil(content.split(" ").length / 5 / 60) }} minuto(s)
          </span>

          <span v-if="published_at" class="text-overline text-uppercase">
            Publicado em:
            {{ $moment(published_at).format("DD/MM/YYYY hh:mm") }}
          </span>

          <span v-if="author" class="text-overline text-uppercase">
            Autor: {{ author }}
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

            <q-menu bottom left offset-y>
              <q-list dense flat>
                <q-item
                  clickable
                  :to="{
                    name: 'messages_edit',
                    params: { id: id }
                  }"
                >
                  <q-item-section avatar class="q-py-sm">
                    <q-icon name="edit" />
                  </q-item-section>

                  <q-item-section class="q-py-sm">
                    Editar
                  </q-item-section>
                </q-item>

                <q-item clickable @click="destroy">
                  <q-item-section avatar class="q-py-sm">
                    <q-icon name="delete" />
                  </q-item-section>

                  <q-item-section class="q-py-sm">
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
      <q-card-section v-if="content">
        <div class="content editor__content" v-html="content" />
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

    <q-separator v-if="content && tags" />

    <q-card-section v-if="tags">
      <q-chip
        v-for="(tag, index) in tags"
        :key="index"
        color="accent"
        label
        text-color="white"
        square
        clickable
        @click="filterMessages(tag)"
      >
        <q-icon name="mdi-label" size="sm" class="q-mr-sm" />
        {{ tag }}
      </q-chip>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    id: Number,
    title: { type: String, required: true },
    caption: { type: String, required: true },
    content: { type: String, required: true },
    full_content: Boolean,
    published_at: String,
    author: String,
    metadata: {
      read_time: Boolean
    },
    tags: Array,
    noActions: Boolean
  },
  data() {
    return {
      saved: false,
      showReadMore: !this.full_content,
      optionsMenu: false
    };
  },
  methods: {
    filterMessages(tag) {
      if (this.$router.currentRoute.name == "messages") {
        this.$emit("filterMessages", tag);
      } else {
        this.$router.push({ name: "messages", query: { search: tag } });
      }
    },
    destroy() {
      if (confirm("Tem certeza que deseja remover essa mensagem?")) {
        this.$store
          .dispatch("messages/removeMessages", this.id)
          .then(() => this.$emit("onDestroy"));
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
