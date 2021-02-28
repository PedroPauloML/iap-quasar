<template>
  <q-card class="verse-of-day" light>
    <q-card-section class="row">
      <div
        :class="{
          'col-12': true,
          'col-sm-auto': true,
          'self-center': true,
          'q-mb-md': $q.screen.lt.sm
        }"
      >
        <div class="row">
          <div class="col-auto self-center">
            <img
              :src="bibleSRC"
              alt="Bíblia"
              :width="$q.screen.lt.sm ? '30' : '55'"
              class="q-mr-md"
            />
          </div>

          <div class="col">
            <span v-if="$q.screen.lt.sm" class="text-h6 text-primary">
              Versículo do dia
            </span>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm self-center">
        <p
          v-if="$q.screen.gt.xs"
          class="text-h6 text-weight-bold q-mb-sm text-primary"
        >
          Versículo do dia
        </p>
        <p>
          {{ verse }}
        </p>
        <p class="q-mb-none text-overline text-uppercase">
          {{ reference }}
        </p>
      </div>

      <div class="col-12 col-sm-auto self-center">
        <div class="row">
          <div class="col-auto col-sm-12 text-center self-center">
            <img
              :src="calendarSRC"
              alt="Bíblia"
              :width="$q.screen.lt.sm ? '25' : '55'"
              :class="{
                'q-mr-xs': $q.screen.lt.sm
              }"
            />
          </div>

          <div class="col-auto col-sm-12 q-mb-sm-sm text-center self-center">
            <span
              :class="{
                'text-uppercase': true,
                'text-weight-bold': true,
                'text-body2': true,
                'q-mb-md': $q.screen.gt.xs
              }"
            >
              {{ $moment(date).format("DD/MMM") }}
            </span>
          </div>

          <div v-if="$q.screen.lt.sm" class="col self-center">
            <q-separator class="q-mx-sm"></q-separator>
          </div>

          <div class="col-auto col-sm-12 text-center self-center">
            <router-link v-if="route" :to="route" v-slot="{ href }">
              <q-btn
                :size="$q.screen.lt.sm ? 'sm' : 'md'"
                link
                color="primary"
                :to="href"
                dense
                class="q-pl-sm"
              >
                Ver mais <q-icon name="chevron_right" />
              </q-btn>
            </router-link>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section
      ref="commentariesContainer"
      class="flex align-center justify-space-between"
    >
      <span v-if="fetchingCommentaries">
        <v-progress-circular
          indeterminate
          color="primary"
          class="q-mr-md"
          size="18"
          width="2"
        ></v-progress-circular>
        Buscando os comentários desse versículo
      </span>
      <span v-else>
        <q-icon name="o_mode_comment" class="q-mr-md" />
        <span v-if="isCommentariesPresent">
          {{ commentaries.length }}
          {{
            $q.screen.gt.xs
              ? commentaries.length > 1
                ? "comentários"
                : "comentário"
              : ""
          }}
        </span>
        <span v-else-if="commentaries_count">
          {{ commentaries_count }}
          {{ commentaries_count > 1 ? "comentários" : "comentário" }}
        </span>
        <span v-else>
          Nenhum comentário adicionado a esse versículo
        </span>
      </span>

      <q-btn
        v-if="userSigned && !noActions"
        color="primary"
        text
        tile
        small
        @click="openCommentaryForm"
      >
        Adicionar novo comentário
      </q-btn>
    </q-card-section>

    <v-scroll-y-transition v-if="userSigned && !noActions" group>
      <q-separator v-show="showCommentaryForm" key="divider" />
      <NewCommetary
        key="form"
        v-show="showCommentaryForm"
        class="ma-4"
        :commentary="''"
        @cancelCommentary="closeCommentaryForm"
        @sendCommentary="createNewCommentary"
        :sending="sendingCommentary"
      />
    </v-scroll-y-transition>

    <q-separator v-if="isCommentariesPresent" />

    <span v-if="fetchingCommentaries" class="d-block pa-5">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </span>

    <q-card-section
      v-if="!noCommentaries && !fetchingCommentaries && isCommentariesPresent"
      class="commentaries"
    >
      <Commentary
        v-for="(commentary, index) in commentaries"
        :key="index"
        :commentary="commentary"
        @update="updateCommentary"
        :updating="commentaryIdToUpdate == commentary.id && updatingCommentary"
        @delete="deleteCommentary"
        :deleting="commentaryIdToDelete == commentary.id && deletingCommentary"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import Commentary from "./commentaries/Component";
import NewCommetary from "./commentaries/Form";

import calendarSRC from "assets/imgs/calendar.svg";
import bibleSRC from "assets/imgs/bible.svg";

export default {
  props: {
    verse: String,
    reference: String,
    date: String,
    route: Object,
    commentaries_count: Number,
    noActions: { type: Boolean, default: false },
    noCommentaries: { type: Boolean, default: false }
  },
  components: { Commentary, NewCommetary },
  data() {
    return {
      showCommentaryForm: false,
      sendingCommentary: false,
      fetchingCommentaries: false,
      commentaryIdToDelete: null,
      deletingCommentary: false,
      commentaryIdToUpdate: null,
      updatingCommentary: false,
      commentaries: [
        {
          id: 1,
          text: `
            <p>Bela reflexão e ensiamento para as nossas vidas.</p>
            <p>Em momentos de ângustia e necessidade, busque ao Senhor.</p>
            `,
          author: {
            name: "Pedro Paulo",
            avatar: "https://picsum.photos/id/1012/100/100"
          }
        },
        {
          id: 2,
          text: `
            <p>O salmista nos deixou o ensinamento que o nosso porto seguro e salvador
            é aquele que criou os céus e a terra.</p>
            <p>Louvado seja Deus.</p>
            `,
          author: {
            name: "Paulo Pedro",
            avatar: "https://picsum.photos/id/1013/100/100"
          }
        }
      ],

      // Icons
      calendarSRC,
      bibleSRC
    };
  },
  created() {
    setTimeout(() => (this.fetchingCommentaries = false), 2000);
  },
  computed: {
    isCommentariesPresent() {
      return (
        this.commentaries &&
        Array.isArray(this.commentaries) &&
        this.commentaries.length > 0
      );
    }
  },
  methods: {
    openCommentaryForm() {
      this.showCommentaryForm = true;
    },
    closeCommentaryForm() {
      this.showCommentaryForm = false;
    },
    createNewCommentary(commentary) {
      this.sendingCommentary = true;
      setTimeout(() => {
        this.commentaries = [
          {
            id: this.commentaries.length + 1,
            text: commentary,
            author: {
              name: this.$store.state.user.user.profile.name,
              avatar: "https://picsum.photos/id/1012/100/100"
            }
          },
          ...this.commentaries
        ];
        this.sendingCommentary = false;
        this.closeCommentaryForm();

        let y =
          this.$refs.commentariesContainer.getBoundingClientRect().top +
          window.pageYOffset -
          60;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }, 1000);
    },
    updateCommentary(data) {
      this.updatingCommentary = true;
      this.commentaryIdToUpdate = data.id;
      setTimeout(() => {
        this.updatingCommentary = false;
        this.commentaryIdToUpdate = null;
        this.commentaries.forEach(el => {
          if (el.id == data.id) {
            el.text = data.text;
          }
        });
      }, 1000);
    },
    deleteCommentary(id) {
      if (confirm("Tem certeza que deseja excluir esse comentário?")) {
        this.deletingCommentary = true;
        this.commentaryIdToDelete = id;
        setTimeout(() => {
          this.deletingCommentary = false;
          this.commentaryIdToDelete = null;
          this.commentaries = this.commentaries.filter(el => el.id != id);
        }, 1000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.commentaries > .commentary:not(:last-child) {
  border-bottom: 1px solid #e4e4e4;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
</style>
