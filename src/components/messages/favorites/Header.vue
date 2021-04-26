<template>
  <div id="favorite-messages-header" class="q-mb-lg">
    <div class="row q-col-gutter-md items-center">
      <transition
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutLeft"
        mode="out-in"
      >
        <div v-if="back_route" class="col-auto flex align-center">
          <router-link :to="back_route" v-slot="{ href }">
            <q-btn round color="primary" :to="href">
              <q-icon name="chevron_left" color="white" />

              <q-tooltip>Voltar</q-tooltip>
            </q-btn>
          </router-link>
        </div>
      </transition>

      <div class="col">
        <span class="text-h4 text-weight-bold">Mensagens Favoritadas</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    back_route: Object,
    searching: Boolean
  },
  data() {
    return {
      menu: false
    };
  }
};
</script>

<style></style>
