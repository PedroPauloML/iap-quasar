<template>
  <div class="row commentary">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-avatar
        v-show="!showEditForm || (!showEditForm && $q.screen.gt.sm)"
        size="60px"
        class="col-auto q-mr-md"
      >
        <q-img :src="commentary.author.avatar" width="60px" />
      </q-avatar>
    </transition>

    <div class="col flex flex-block">
      <div class="flex no-wrap items-center justify-between">
        <span class="text-overline text-uppercase text-grey-7">
          {{ commentary.author.name }}
        </span>

        <transition
          v-if="userSigned"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <div v-show="!showEditForm" class="actions">
            <q-btn flat round :disabled="deleting" @click="showUpdatingForm">
              <q-icon name="mdi-pencil-outline" />
              <q-tooltip>Editar</q-tooltip>
            </q-btn>

            <q-btn
              color="red"
              flat
              round
              @click="deleteCommentary"
              :loading="deleting"
            >
              <q-icon name="mdi-delete-outline" />
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </div>
        </transition>
      </div>

      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <div
          key="commentary-form"
          ref="commentaryForm"
          v-if="userSigned && showEditForm"
        >
          <p v-if="showError" class="text-red">
            O comentário não pode ficar vazio
          </p>
          <TipTapEditor ref="content" v-model="commentaryEdited" />

          <div class="text-right q-mt-lg">
            <q-btn
              color="grey"
              :dark="!updating"
              class="q-mr-md"
              @click="closeUpdatingForm"
              :disabled="updating"
            >
              Cancelar
            </q-btn>
            <q-btn
              color="primary"
              @click="updateCommentary"
              :loading="updating"
            >
              Atualizar
            </q-btn>
          </div>
        </div>

        <div key="commentary-text" v-else v-html="commentary.text" />
      </transition>
    </div>
  </div>
</template>

<script>
import TipTapEditor from "../../TipTapEditor";

export default {
  props: {
    commentary: {
      id: { type: Number, required: true },
      text: { type: String, required: true },
      author: {
        name: { type: String, required: true },
        avatar: { type: String, required: true }
      }
    },
    deleting: Boolean,
    updating: Boolean
  },
  components: { TipTapEditor },
  data() {
    return {
      showEditForm: false,
      commentaryEdited: this.commentary.text,
      showError: false
    };
  },
  watch: {
    commentary: {
      handler: function(val) {
        this.showEditForm = false;
        this.commentaryEdited = val.text;
      },
      deep: true
    }
  },
  methods: {
    showUpdatingForm() {
      this.showEditForm = true;
    },
    closeUpdatingForm() {
      this.showEditForm = false;
    },
    updateCommentary() {
      if (this.commentaryEdited && this.commentaryEdited != "<p></p>") {
        this.showError = false;

        this.$emit("update", {
          id: this.commentary.id,
          text: this.commentaryEdited
        });
      } else {
        this.showError = true;

        let y =
          this.$refs.commentaryForm.getBoundingClientRect().top +
          window.pageYOffset -
          60;
        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    },
    deleteCommentary() {
      this.$emit("delete", this.commentary.id);
    }
  }
};
</script>

<style lang="scss" scoped></style>
