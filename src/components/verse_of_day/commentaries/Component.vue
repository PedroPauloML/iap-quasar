<template>
  <div class="flex commentary">
    <v-scroll-x-reverse-transition>
      <q-img
        v-show="!showEditForm || (!showEditForm && $q.screen.gt.sm)"
        :src="commentary.author.avatar"
        aspect-ratio="1"
        width="60px"
        height="60px"
        max-width="60px"
        max-height="60px"
        class="rounded-circle mr-4"
      ></q-img>
    </v-scroll-x-reverse-transition>

    <div class="flex">
      <div class="flex align-center justify-space-between">
        <span class="overline">
          {{ commentary.author.name }}
        </span>

        <v-scroll-x-transition v-if="userSigned" mode="out-in">
          <div v-show="!showEditForm" class="actions">
            <q-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <q-btn
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  :disabled="deleting"
                  @click="showUpdatingForm"
                >
                  <q-icon small>mdi-pencil-outline</q-icon>
                </q-btn>
              </template>
              <span>Editar</span>
            </q-tooltip>

            <q-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <q-btn
                  color="red"
                  icon
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteCommentary"
                  :loading="deleting"
                >
                  <q-icon small>mdi-delete-outline</q-icon>
                </q-btn>
              </template>
              <span>Excluir</span>
            </q-tooltip>
          </div>
        </v-scroll-x-transition>
      </div>

      <v-scroll-x-transition mode="out-in">
        <div key="commentary-form" v-if="userSigned && showEditForm">
          <TipTapEditor ref="content" v-model="commentaryEdited" />

          <div class="text-right mt-4">
            <q-btn
              color="grey"
              :dark="!updating"
              class="mr-2"
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

        <div
          key="commentary-text"
          v-else
          class="black--text body-1 mce-content-body"
          v-html="commentary.text"
        />
      </v-scroll-x-transition>
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
      commentaryEdited: this.commentary.text
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
      this.$emit("update", {
        id: this.commentary.id,
        text: this.commentaryEdited
      });
    },
    deleteCommentary() {
      this.$emit("delete", this.commentary.id);
    }
  }
};
</script>

<style lang="scss" scoped></style>
