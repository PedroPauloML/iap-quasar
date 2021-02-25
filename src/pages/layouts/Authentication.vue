<template>
  <v-app>
    <v-main class="secondary">
      <v-container id="main-container" class="py-5">
        <transition name="slide-y-transition" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Footer from "../../components/Footer";

export default {
  components: {
    Footer,
  },
};
</script>

<style>
#main-container {
  max-width: 1200px !important;
}
</style>
